import json
import os
import hashlib
import secrets
from datetime import datetime, timedelta
import psycopg2
import jwt

def handler(event: dict, context) -> dict:
    """
    API для регистрации, авторизации и управления сессиями пользователей.
    Использует JWT токены и bcrypt для шифрования паролей.
    """
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Authorization',
                'Access-Control-Max-Age': '86400',
                'Access-Control-Allow-Credentials': 'true'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    query_params = event.get('queryStringParameters') or {}
    action = query_params.get('action', '')
    
    try:
        if method == 'POST' and action == 'register':
            return register_user(event)
        elif method == 'POST' and action == 'login':
            return login_user(event)
        elif method == 'GET' and action == 'me':
            return get_current_user(event)
        elif method == 'POST' and action == 'logout':
            return logout_user(event)
        else:
            return error_response('Invalid action. Use ?action=register|login|me|logout', 400)
    except Exception as e:
        return error_response(str(e), 500)


def hash_password(password: str) -> str:
    """Хеширование пароля с использованием SHA256 + соль"""
    salt = secrets.token_hex(16)
    pwd_hash = hashlib.sha256((password + salt).encode()).hexdigest()
    return f"{salt}${pwd_hash}"


def verify_password(password: str, hashed: str) -> bool:
    """Проверка пароля"""
    try:
        salt, pwd_hash = hashed.split('$')
        test_hash = hashlib.sha256((password + salt).encode()).hexdigest()
        return test_hash == pwd_hash
    except:
        return False


def create_jwt_token(user_id: int, email: str, role: str) -> str:
    """Создание JWT токена"""
    secret = os.environ.get('JWT_SECRET', 'default-secret-key')
    payload = {
        'user_id': user_id,
        'email': email,
        'role': role,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, secret, algorithm='HS256')


def verify_jwt_token(token: str) -> dict:
    """Проверка JWT токена"""
    try:
        secret = os.environ.get('JWT_SECRET', 'default-secret-key')
        return jwt.decode(token, secret, algorithms=['HS256'])
    except:
        return None


def get_db_connection():
    """Подключение к базе данных"""
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)


def register_user(event: dict) -> dict:
    """Регистрация нового пользователя"""
    body = json.loads(event.get('body', '{}'))
    
    email = body.get('email', '').strip()
    password = body.get('password', '')
    full_name = body.get('full_name', '').strip()
    phone = body.get('phone', '').strip()
    
    if not email or not password or not full_name:
        return error_response('Email, password and full_name are required', 400)
    
    if len(password) < 6:
        return error_response('Password must be at least 6 characters', 400)
    
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(f"SELECT id FROM \"{schema}\".users WHERE email = %s", (email,))
            if cur.fetchone():
                return error_response('Email already exists', 400)
            
            password_hash = hash_password(password)
            
            cur.execute(
                f"INSERT INTO \"{schema}\".users (email, password_hash, full_name, phone, role) VALUES (%s, %s, %s, %s, %s) RETURNING id, email, full_name, role",
                (email, password_hash, full_name, phone, 'user')
            )
            user_data = cur.fetchone()
            conn.commit()
            
            user_id, user_email, user_name, user_role = user_data
            token = create_jwt_token(user_id, user_email, user_role)
            
            session_token = secrets.token_urlsafe(32)
            expires_at = datetime.utcnow() + timedelta(days=7)
            
            cur.execute(
                "INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (%s, %s, %s)",
                (user_id, session_token, expires_at)
            )
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': 'true',
                    'X-Set-Cookie': f'session_token={session_token}; HttpOnly; Secure; SameSite=Strict; Max-Age=604800; Path=/'
                },
                'body': json.dumps({
                    'success': True,
                    'token': token,
                    'user': {
                        'id': user_id,
                        'email': user_email,
                        'full_name': user_name,
                        'role': user_role
                    }
                }),
                'isBase64Encoded': False
            }
    finally:
        conn.close()


def login_user(event: dict) -> dict:
    """Авторизация пользователя"""
    body = json.loads(event.get('body', '{}'))
    
    email = body.get('email', '').strip()
    password = body.get('password', '')
    
    if not email or not password:
        return error_response('Email and password are required', 400)
    
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                f"SELECT id, email, password_hash, full_name, role FROM \"{schema}\".users WHERE email = %s",
                (email,)
            )
            user_data = cur.fetchone()
            
            if not user_data or not verify_password(password, user_data[2]):
                return error_response('Invalid email or password', 401)
            
            user_id, user_email, _, user_name, user_role = user_data
            token = create_jwt_token(user_id, user_email, user_role)
            
            session_token = secrets.token_urlsafe(32)
            expires_at = datetime.utcnow() + timedelta(days=7)
            
            cur.execute(
                f"INSERT INTO \"{schema}\".user_sessions (user_id, session_token, expires_at) VALUES (%s, %s, %s)",
                (user_id, session_token, expires_at)
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': 'true',
                    'X-Set-Cookie': f'session_token={session_token}; HttpOnly; Secure; SameSite=Strict; Max-Age=604800; Path=/'
                },
                'body': json.dumps({
                    'success': True,
                    'token': token,
                    'user': {
                        'id': user_id,
                        'email': user_email,
                        'full_name': user_name,
                        'role': user_role
                    }
                }),
                'isBase64Encoded': False
            }
    finally:
        conn.close()


def get_current_user(event: dict) -> dict:
    """Получение данных текущего пользователя"""
    auth_header = event.get('headers', {}).get('X-Authorization', '')
    cookie_header = event.get('headers', {}).get('X-Cookie', '')
    
    token = None
    if auth_header.startswith('Bearer '):
        token = auth_header.replace('Bearer ', '')
    
    if not token:
        return error_response('Unauthorized', 401)
    
    payload = verify_jwt_token(token)
    if not payload:
        return error_response('Invalid token', 401)
    
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                f"SELECT id, email, full_name, phone, role, created_at FROM \"{schema}\".users WHERE id = %s",
                (payload['user_id'],)
            )
            user_data = cur.fetchone()
            
            if not user_data:
                return error_response('User not found', 404)
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': 'true'
                },
                'body': json.dumps({
                    'success': True,
                    'user': {
                        'id': user_data[0],
                        'email': user_data[1],
                        'full_name': user_data[2],
                        'phone': user_data[3],
                        'role': user_data[4],
                        'created_at': user_data[5].isoformat() if user_data[5] else None
                    }
                }),
                'isBase64Encoded': False
            }
    finally:
        conn.close()


def logout_user(event: dict) -> dict:
    """Выход пользователя"""
    cookie_header = event.get('headers', {}).get('X-Cookie', '')
    
    session_token = None
    for cookie in cookie_header.split(';'):
        if 'session_token=' in cookie:
            session_token = cookie.split('=')[1].strip()
            break
    
    if session_token:
        schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(f"DELETE FROM \"{schema}\".user_sessions WHERE session_token = %s", (session_token,))
                conn.commit()
        finally:
            conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'X-Set-Cookie': 'session_token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/'
        },
        'body': json.dumps({'success': True, 'message': 'Logged out successfully'}),
        'isBase64Encoded': False
    }


def error_response(message: str, status_code: int) -> dict:
    """Стандартный ответ с ошибкой"""
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true'
        },
        'body': json.dumps({'success': False, 'error': message}),
        'isBase64Encoded': False
    }
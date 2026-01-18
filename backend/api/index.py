import json
import os
import psycopg2
import jwt
from datetime import datetime

def handler(event: dict, context) -> dict:
    """
    API для управления вакансиями, резюме и компаниями.
    Поддерживает CRUD операции с проверкой авторизации.
    """
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Authorization',
                'Access-Control-Max-Age': '86400',
                'Access-Control-Allow-Credentials': 'true'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    query_params = event.get('queryStringParameters') or {}
    resource = query_params.get('resource', '')
    action = query_params.get('action', 'list')
    
    try:
        if resource == 'vacancies':
            return handle_vacancies(event, action, method)
        elif resource == 'resumes':
            return handle_resumes(event, action, method)
        elif resource == 'companies':
            return handle_companies(event, action, method)
        else:
            return error_response('Invalid resource. Use ?resource=vacancies|resumes|companies', 400)
    except Exception as e:
        return error_response(str(e), 500)


def get_db_connection():
    """Подключение к базе данных"""
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)


def verify_jwt_token(token: str) -> dict:
    """Проверка JWT токена"""
    try:
        secret = os.environ.get('JWT_SECRET', 'default-secret-key')
        return jwt.decode(token, secret, algorithms=['HS256'])
    except:
        return None


def get_user_from_request(event: dict) -> dict:
    """Извлечение пользователя из токена"""
    auth_header = event.get('headers', {}).get('X-Authorization', '')
    
    if not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.replace('Bearer ', '')
    return verify_jwt_token(token)


def handle_vacancies(event: dict, action: str, method: str) -> dict:
    """Управление вакансиями"""
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    
    if action == 'list' and method == 'GET':
        query_params = event.get('queryStringParameters') or {}
        limit = int(query_params.get('limit', 20))
        offset = int(query_params.get('offset', 0))
        
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    f"""
                    SELECT v.id, v.title, v.description, v.salary_min, v.salary_max, 
                           v.location, v.employment_type, v.experience_required, v.is_active,
                           c.name as company_name, c.rating
                    FROM "{schema}".vacancies v
                    JOIN "{schema}".companies c ON v.company_id = c.id
                    WHERE v.is_active = TRUE
                    ORDER BY v.created_at DESC
                    LIMIT %s OFFSET %s
                    """,
                    (limit, offset)
                )
                rows = cur.fetchall()
                
                vacancies = []
                for row in rows:
                    vacancies.append({
                        'id': row[0],
                        'title': row[1],
                        'description': row[2],
                        'salary_min': row[3],
                        'salary_max': row[4],
                        'location': row[5],
                        'employment_type': row[6],
                        'experience_required': row[7],
                        'is_active': row[8],
                        'company_name': row[9],
                        'company_rating': float(row[10]) if row[10] else 0.0
                    })
                
                return success_response(vacancies)
        finally:
            conn.close()
    
    elif action == 'create' and method == 'POST':
        user = get_user_from_request(event)
        if not user or user.get('role') not in ['admin', 'employer']:
            return error_response('Unauthorized', 401)
        
        body = json.loads(event.get('body', '{}'))
        
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    f"""
                    INSERT INTO "{schema}".vacancies 
                    (company_id, title, description, salary_min, salary_max, location, employment_type, experience_required)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id
                    """,
                    (
                        body.get('company_id'),
                        body.get('title'),
                        body.get('description'),
                        body.get('salary_min'),
                        body.get('salary_max'),
                        body.get('location'),
                        body.get('employment_type', 'full_time'),
                        body.get('experience_required', 0)
                    )
                )
                vacancy_id = cur.fetchone()[0]
                conn.commit()
                
                return success_response({'id': vacancy_id, 'message': 'Vacancy created'}, 201)
        finally:
            conn.close()
    
    return error_response('Invalid action or method', 400)


def handle_resumes(event: dict, action: str, method: str) -> dict:
    """Управление резюме"""
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    
    if action == 'my' and method == 'GET':
        user = get_user_from_request(event)
        if not user:
            return error_response('Unauthorized', 401)
        
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    f"""
                    SELECT r.id, r.position, r.experience_years, r.education, 
                           r.desired_salary, r.summary, r.created_at
                    FROM "{schema}".resumes r
                    WHERE r.user_id = %s
                    ORDER BY r.created_at DESC
                    LIMIT 1
                    """,
                    (user['user_id'],)
                )
                row = cur.fetchone()
                
                if not row:
                    return success_response({'resume': None})
                
                resume_id = row[0]
                
                cur.execute(
                    f"""
                    SELECT skill_name, proficiency_level
                    FROM "{schema}".skills
                    WHERE resume_id = %s
                    """,
                    (resume_id,)
                )
                skills = [{'name': s[0], 'level': s[1]} for s in cur.fetchall()]
                
                resume = {
                    'id': row[0],
                    'position': row[1],
                    'experience_years': row[2],
                    'education': row[3],
                    'desired_salary': row[4],
                    'summary': row[5],
                    'created_at': row[6].isoformat() if row[6] else None,
                    'skills': skills
                }
                
                return success_response({'resume': resume})
        finally:
            conn.close()
    
    elif action == 'create' and method == 'POST':
        user = get_user_from_request(event)
        if not user:
            return error_response('Unauthorized', 401)
        
        body = json.loads(event.get('body', '{}'))
        
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    f"""
                    INSERT INTO "{schema}".resumes 
                    (user_id, position, experience_years, education, desired_salary, summary)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id
                    """,
                    (
                        user['user_id'],
                        body.get('position'),
                        body.get('experience_years', 0),
                        body.get('education'),
                        body.get('desired_salary'),
                        body.get('summary')
                    )
                )
                resume_id = cur.fetchone()[0]
                
                for skill in body.get('skills', []):
                    cur.execute(
                        f"""
                        INSERT INTO "{schema}".skills (resume_id, skill_name, proficiency_level)
                        VALUES (%s, %s, %s)
                        """,
                        (resume_id, skill.get('name'), skill.get('level', 'intermediate'))
                    )
                
                conn.commit()
                
                return success_response({'id': resume_id, 'message': 'Resume created'}, 201)
        finally:
            conn.close()
    
    return error_response('Invalid action or method', 400)


def handle_companies(event: dict, action: str, method: str) -> dict:
    """Управление компаниями"""
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    
    if action == 'list' and method == 'GET':
        query_params = event.get('queryStringParameters') or {}
        limit = int(query_params.get('limit', 20))
        offset = int(query_params.get('offset', 0))
        
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    f"""
                    SELECT c.id, c.name, c.description, c.rating, c.reviews_count, c.website,
                           COUNT(v.id) as vacancies_count
                    FROM "{schema}".companies c
                    LEFT JOIN "{schema}".vacancies v ON c.id = v.company_id AND v.is_active = TRUE
                    GROUP BY c.id, c.name, c.description, c.rating, c.reviews_count, c.website
                    ORDER BY c.rating DESC
                    LIMIT %s OFFSET %s
                    """,
                    (limit, offset)
                )
                rows = cur.fetchall()
                
                companies = []
                for row in rows:
                    companies.append({
                        'id': row[0],
                        'name': row[1],
                        'description': row[2],
                        'rating': float(row[3]) if row[3] else 0.0,
                        'reviews_count': row[4],
                        'website': row[5],
                        'vacancies_count': row[6]
                    })
                
                return success_response(companies)
        finally:
            conn.close()
    
    elif action == 'create' and method == 'POST':
        user = get_user_from_request(event)
        if not user or user.get('role') != 'admin':
            return error_response('Unauthorized', 401)
        
        body = json.loads(event.get('body', '{}'))
        
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    f"""
                    INSERT INTO "{schema}".companies (name, description, website)
                    VALUES (%s, %s, %s)
                    RETURNING id
                    """,
                    (body.get('name'), body.get('description'), body.get('website'))
                )
                company_id = cur.fetchone()[0]
                conn.commit()
                
                return success_response({'id': company_id, 'message': 'Company created'}, 201)
        finally:
            conn.close()
    
    return error_response('Invalid action or method', 400)


def success_response(data, status_code: int = 200) -> dict:
    """Успешный ответ"""
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true'
        },
        'body': json.dumps({'success': True, 'data': data}),
        'isBase64Encoded': False
    }


def error_response(message: str, status_code: int) -> dict:
    """Ответ с ошибкой"""
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

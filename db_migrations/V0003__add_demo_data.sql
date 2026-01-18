-- Добавляем тестовые компании
INSERT INTO companies (name, description, rating, reviews_count, website) VALUES
('TechCorp', 'Ведущая технологическая компания', 4.8, 234, 'https://techcorp.example.com'),
('StartupHub', 'Инновационный стартап-хаб', 4.6, 156, 'https://startuphub.example.com'),
('DesignStudio', 'Креативная дизайн-студия', 4.9, 89, 'https://designstudio.example.com'),
('DataTech', 'Компания по работе с данными', 4.7, 198, 'https://datatech.example.com');

-- Добавляем тестовые вакансии
INSERT INTO vacancies (company_id, title, description, salary_min, salary_max, location, employment_type, experience_required, is_active) VALUES
(1, 'Senior Frontend Developer', 'Разработка современных веб-приложений на React', 200000, 300000, 'Москва', 'full_time', 5, TRUE),
(2, 'Product Manager', 'Управление продуктовой разработкой', 180000, 250000, 'Санкт-Петербург', 'full_time', 3, TRUE),
(3, 'UX/UI Designer', 'Проектирование пользовательских интерфейсов', 150000, 200000, 'Удаленно', 'remote', 2, TRUE),
(4, 'Backend Developer', 'Разработка серверной части на Python', 220000, 320000, 'Москва', 'full_time', 4, TRUE);
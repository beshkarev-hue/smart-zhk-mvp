# Smart ZhK MVP - Умная ЖКХ платформа

Комплексная платформа для управления жилищно-коммунальным хозяйством.

## Технологический стек

### Backend
- NestJS (Node.js framework)
- PostgreSQL (база данных)
- TypeORM (ORM)
- JWT (аутентификация)
- Swagger (API документация)

### Frontend
- React 18
- TypeScript
- React Router
- Axios
- Tailwind CSS

### Infrastructure
- Docker & Docker Compose
- Nginx (reverse proxy)

## Структура проекта
smart-zhk-mvp/
├── backend/          # NestJS API server
├── frontend/         # React приложение
├── docs/            # Документация
└── docker-compose.yml
## Быстрый старт

```bash
# Установка зависимостей
cd backend && npm install
cd ../frontend && npm install

# Запуск через Docker
docker-compose up -d

# Backend: http://localhost:3000
# Frontend: http://localhost:3001
# API Docs: http://localhost:3000/api
Модули MVP (Фаза 1)
	1.	✅ Управление пользователями и авторизация
	2.	✅ Личный кабинет жильца
	3.	✅ Личный кабинет УК
	4.	✅ Начисления и платежи
	5.	✅ Управление заявками
	6.	✅ Информационный раздел
Roadmap
	∙	Фаза 1 (22 янв - 1 апр): Core модули MVP
	∙	Фаза 2 (апр-май): Расширенный функционал
	∙	Фаза 3 (май-июнь): Advanced features
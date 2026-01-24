# Smart ZhK MVP - Умное ЖКХ

Платформа для управления жилищно-коммунальным хозяйством.

## Технологии

**Backend:** NestJS + TypeScript + PostgreSQL + JWT
**Frontend:** React 18 + TypeScript
**Инфраструктура:** Docker + Docker Compose

## Запуск проекта

1. `docker-compose up -d postgres`
2. `cd backend && npm run start:dev`
3. `cd frontend && npm start`

## Функционал MVP

✅ Авторизация и регистрация
✅ Dashboard с статистикой
✅ Управление платежами
✅ Создание и отслеживание заявок
✅ Новости и объявления
✅ Профиль пользователя

## API Документация

http://localhost:3000/api (Swagger)

## Планы развития

- [ ] Интеграция с Госуслугами
- [ ] Кабинет УК/ТСЖ
- [ ] Интеграция с ГИС ЖКХ

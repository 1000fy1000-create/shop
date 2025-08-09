# KopiLux — магазин с интеграцией Google Sheets

Тёмный неон-дизайн, витрина из Google Таблицы, админ-панель с записью в таблицу через сервис-аккаунт.

## Быстрый старт (локально)

```bash
pnpm i   # или npm i / yarn
cp .env.example .env
# укажи:
# NEXT_PUBLIC_SHEET_ID=1ON7deD-jFHreA5x0zqwmAXBBD225kTwRcIRy1QR7O1U
# NEXT_PUBLIC_SHEET_GID=0
# NEXT_PUBLIC_TELEGRAM_TARGET=your_bot
# ADMIN_SHARED_SECRET=strong-secret
# GOOGLE_CLIENT_EMAIL=... (сервис-аккаунт)
# GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
pnpm dev
```

Открой http://localhost:3000 — витрина.  
Открой http://localhost:3000/admin — админ-панель (требует `ADMIN_SHARED_SECRET` при сохранении).

## Деплой на Vercel

1. Создай новый проект из этого репозитория/папки.
2. В настройках проекта добавь переменные окружения из `.env.example` (секреты шифруются).
3. Выдай сервис-аккаунту доступ **Редактор** на саму Google Таблицу.
4. Задеплой — витрина будет на вашем домене Vercel.

## Как это работает

- Витрина читает данные через GViz JSON (не требует ключа).
- Админ-панель пишет через Google Sheets API, используя сервис-аккаунт.
- Общая структура сохраняется: `name, price, image, category, description, url, sku` — но админ может работать и с произвольными заголовками (они не жёстко заданы).

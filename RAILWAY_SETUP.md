# 🚀 Настройка Railway для Питомник МЯТА

## Шаг 1: Добавьте PostgreSQL базу данных

1. Зайдите в ваш Railway проект: https://railway.com/project/a596a9a0-87b9-40cb-b5e5-cb53a94b196a
2. Нажмите **"+ New"**
3. Выберите **"Database"** → **"PostgreSQL"**
4. Railway создаст PostgreSQL базу данных

## Шаг 2: Получите DATABASE_URL

1. После создания базы данных, нажмите на неё
2. Перейдите в раздел **"Variables"**
3. Скопируйте значение **`DATABASE_URL`** (выглядит как: `postgresql://username:password@host:port/database`)

## Шаг 3: Добавьте переменную в Backend

1. Вернитесь к вашему backend сервису
2. Перейдите в **"Variables"**
3. Добавьте новую переменную:
   - **Name**: `DATABASE_URL`
   - **Value**: скопированное значение из шага 2

## Шаг 4: Перезапустите Backend

1. Railway автоматически перезапустит backend после добавления переменной
2. Backend должен успешно подключиться к базе данных

## Шаг 5: Импортируйте данные (опционально)

Если нужно импортировать данные растений:

```bash
# Локально (если у вас есть DATABASE_URL)
DATABASE_URL="your_railway_database_url" npm run setup-railway-db
```

## Проверка

После настройки ваш backend должен показывать:
```
🚀 Сервер запущен на порту 8080
📊 Health check: http://localhost:8080/api/health
📚 API документация: http://localhost:8080/api
🌱 Каталог растений: http://localhost:8080/api/plants
✅ Подключение к базе данных установлено
```

## Получение публичного URL

1. В настройках вашего backend сервиса
2. Найдите раздел **"Domains"**
3. Скопируйте публичный URL (например: `https://pitomnik-myta-production.up.railway.app`)

## Обновление Frontend

После получения Railway URL, обновите frontend:

```bash
RAILWAY_URL="https://your-railway-url.up.railway.app" node scripts/update-railway-url.js
```

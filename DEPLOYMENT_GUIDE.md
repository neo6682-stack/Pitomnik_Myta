# 🚀 Руководство по развертыванию Питомник МЯТА

## Архитектура продакшена

### Backend (Railway.app)
- **URL**: `https://pitomnik-myta-backend.railway.app`
- **База данных**: PostgreSQL (встроенная)
- **API**: REST API для каталога растений

### Frontend (Vercel)
- **URL**: `https://pitomnik-myta.vercel.app`
- **Фреймворк**: Next.js 15
- **Стили**: Tailwind CSS

## 📋 Пошаговое развертывание

### 1. Развертывание Backend на Railway

1. **Зайдите на** https://railway.app
2. **Войдите через GitHub**
3. **Нажмите "New Project" → "Deploy from GitHub repo"**
4. **Выберите репозиторий** `Pitomnik_Myta`
5. **Выберите папку** `backend`
6. **Настройте переменные окружения:**
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=pitomnik_myta
   DB_USER=postgres
   DB_PASSWORD=[автоматически сгенерируется]
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=https://pitomnik-myta.vercel.app
   JWT_SECRET=[сгенерируйте случайную строку]
   ```

7. **Railway автоматически:**
   - Создаст PostgreSQL базу данных
   - Установит зависимости
   - Соберет TypeScript
   - Запустит сервер

### 2. Развертывание Frontend на Vercel

1. **Зайдите на** https://vercel.com
2. **Войдите через GitHub**
3. **Нажмите "New Project"**
4. **Выберите репозиторий** `Pitomnik_Myta`
5. **Настройте проект:**
   - **Root Directory**: `frontend-nextjs`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

6. **Добавьте переменные окружения:**
   ```
   NEXT_PUBLIC_API_URL=https://pitomnik-myta-backend.railway.app/api
   ```

7. **Нажмите "Deploy"**

### 3. Настройка домена (опционально)

#### Для Vercel:
1. **В панели Vercel** → **Settings** → **Domains**
2. **Добавьте ваш домен** (например: `pitomnik-myta.ru`)
3. **Настройте DNS записи** у вашего регистратора домена:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.19.61
   ```

#### Для Railway:
1. **В панели Railway** → **Settings** → **Domains**
2. **Добавьте поддомен** (например: `api.pitomnik-myta.ru`)

## 🔧 Дополнительные настройки

### Платежные системы

#### Сбербанк:
1. **Зарегистрируйтесь** в https://developer.sberbank.ru
2. **Получите** `MERCHANT_ID` и `SECRET_KEY`
3. **Добавьте в Railway переменные:**
   ```
   SBERBANK_MERCHANT_ID=your_merchant_id
   SBERBANK_SECRET_KEY=your_secret_key
   ```

#### ЮKassa:
1. **Зарегистрируйтесь** в https://yookassa.ru
2. **Получите** `SHOP_ID` и `SECRET_KEY`
3. **Добавьте в Railway переменные:**
   ```
   YUKASSA_SHOP_ID=your_shop_id
   YUKASSA_SECRET_KEY=your_secret_key
   ```

### Email уведомления

1. **Настройте SMTP** (например, Gmail):
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```

### AI-консультант

1. **Получите API ключ** OpenAI
2. **Добавьте в Railway:**
   ```
   OPENAI_API_KEY=your_openai_key
   ```

## 📊 Мониторинг

### Railway:
- **Логи**: Автоматически доступны в панели
- **Метрики**: CPU, память, сеть
- **Health Check**: `https://pitomnik-myta-backend.railway.app/api/health`

### Vercel:
- **Аналитика**: Встроенная в панель
- **Функции**: Serverless функции для API
- **CDN**: Автоматическое кеширование

## 🔄 Обновления

### Backend:
```bash
git add .
git commit -m "Update backend"
git push
# Railway автоматически пересоберет и перезапустит
```

### Frontend:
```bash
git add .
git commit -m "Update frontend"
git push
# Vercel автоматически пересоберет и задеплоит
```

## 🛠️ Локальная разработка

### Backend:
```bash
cd backend
npm install
npm run dev
```

### Frontend:
```bash
cd frontend-nextjs
npm install
npm run dev
```

## 📱 Мобильное приложение (будущее)

Для создания мобильного приложения рекомендуется:
- **React Native** (совместный код с веб-версией)
- **Expo** (быстрая разработка)
- **Firebase** (push-уведомления, аналитика)

## 🎯 Дальнейшие шаги

1. **SEO оптимизация** - мета-теги, sitemap, robots.txt
2. **Аналитика** - Google Analytics, Яндекс.Метрика
3. **Кеширование** - Redis для API
4. **CDN** - CloudFlare для статических файлов
5. **Безопасность** - HTTPS, CORS, rate limiting
6. **Тестирование** - Jest, Cypress
7. **CI/CD** - GitHub Actions

## 📞 Поддержка

- **GitHub Issues**: Для багов и предложений
- **Railway Support**: Для backend проблем
- **Vercel Support**: Для frontend проблем
- **Документация API**: `https://pitomnik-myta-backend.railway.app/api`

---

**Удачного развертывания! 🌱**

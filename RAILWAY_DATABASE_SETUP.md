# 🗄️ Настройка базы данных в Railway

## 📋 Пошаговая инструкция

### 1. 🆕 Создание PostgreSQL в Railway

1. Зайти в [Railway Dashboard](https://railway.app/dashboard)
2. Найти проект **"pitomnik-myta"**
3. Нажать **"New Service"**
4. Выбрать **"Database" → "PostgreSQL"**
5. Дождаться создания (1-2 минуты)

### 2. 🔑 Получение DATABASE_URL

1. В настройках PostgreSQL сервиса
2. Найти **"Connect"** или **"Variables"**
3. Скопировать **`DATABASE_URL`**

### 3. 📥 Импорт данных

#### Вариант A: Быстрый импорт (рекомендуется)
```bash
# Установить DATABASE_URL
export DATABASE_URL="postgresql://user:pass@host:port/dbname"

# Запустить быстрый импорт
npm run import-railway-data
```

#### Вариант B: Полная настройка
```bash
# Установить DATABASE_URL
export DATABASE_URL="postgresql://user:pass@host:port/dbname"

# Запустить полную настройку
npm run setup-railway-db
```

### 4. ✅ Проверка

После импорта данные будут доступны через API:
- **Растения:** `GET /api/plants`
- **Категории:** `GET /api/categories`
- **Health check:** `GET /api/health`

## 📊 Что импортируется

- **~1000 растений** с полными характеристиками
- **~10 категорий** растений
- **Изображения** (ссылки на файлы)
- **Цены и наличие**
- **Характеристики** (свет, почва, уход и т.д.)

## 🚨 Важно

- Импорт займет 2-3 минуты
- Данные будут перезаписаны при повторном импорте
- Убедитесь, что Railway API работает перед импортом

## 🔧 Troubleshooting

### Ошибка "DATABASE_URL не найден"
- Проверьте, что переменная установлена
- Убедитесь, что PostgreSQL сервис создан в Railway

### Ошибка подключения
- Проверьте, что PostgreSQL сервис запущен
- Убедитесь, что DATABASE_URL правильный

### Ошибка импорта
- Проверьте логи в Railway Dashboard
- Убедитесь, что файлы данных существуют

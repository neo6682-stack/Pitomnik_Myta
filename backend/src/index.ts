import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import plantsRouter from './routes/plants';
import categoriesRouter from './routes/categories';
import { errorHandler, notFound } from './middleware/errorHandler';
import { connectDB } from './database/connection';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '8080', 10);

// Подключение к базе данных (опционально для Railway)
connectDB().catch(() => {
  console.log('⚠️ База данных недоступна, продолжаем работу без неё');
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов с одного IP
  message: 'Слишком много запросов с этого IP, попробуйте позже.'
});
app.use('/api/', limiter);

// Routes
app.use('/api/plants', plantsRouter);
app.use('/api/categories', categoriesRouter);

// Simple health check for Railway
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Pitomnik Myta API is running',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API info
app.get('/api', (req, res) => {
  res.json({
    name: 'Pitomnik Myta API',
    version: '1.0.0',
    description: 'API для каталога растений питомника МЯТА',
    endpoints: {
      plants: '/api/plants',
      categories: '/api/categories',
      health: '/api/health'
    },
    nursery: {
      name: 'Питомник многолетних цветов и трав "МЯТА"',
      location: 'Ростовская область, Неклиновский район, село Николаевка',
      contacts: {
        phone: '+7 918 55 28 423',
        contact_person: 'Ирина Леонидовна',
        email: 'Mytapitomnik@mail.ru'
      }
    }
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API документация: http://localhost:${PORT}/api`);
  console.log(`🌱 Каталог растений: http://localhost:${PORT}/api/plants`);
});

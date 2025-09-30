import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { statusCode = 500, message } = error;

  // Логируем ошибку
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Обрабатываем специфичные ошибки
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Ошибка валидации данных';
  }

  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Неверный формат данных';
  }

  if (error.code === '23505') { // PostgreSQL unique violation
    statusCode = 409;
    message = 'Запись с такими данными уже существует';
  }

  if (error.code === '23503') { // PostgreSQL foreign key violation
    statusCode = 400;
    message = 'Нарушение связей между таблицами';
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Маршрут не найден: ${req.originalUrl}`) as AppError;
  error.statusCode = 404;
  next(error);
};

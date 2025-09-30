import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Railway предоставляет DATABASE_URL, локально используем отдельные переменные
const pool = new Pool(
  process.env.DATABASE_URL 
    ? { connectionString: process.env.DATABASE_URL }
    : {
        user: process.env.DB_USER || 'dmitryrudenkov',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'pitomnik_myta',
        password: process.env.DB_PASSWORD || '',
        port: parseInt(process.env.DB_PORT || '5432'),
      }
);

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Подключение к базе данных установлено');
    client.release();
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:', error);
    console.log('⚠️  Продолжаем работу без базы данных...');
    // process.exit(1); // Временно отключаем выход из приложения
  }
};

export default pool;

import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export async function initDatabase() {
  try {
    console.log('🔄 Инициализация базы данных...');
    
    // Читаем схему из файла
    const schemaPath = path.join(__dirname, '../../../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Выполняем схему
    await pool.query(schema);
    console.log('✅ Схема базы данных создана');
    
    // Проверяем, есть ли данные
    const plantsCount = await pool.query('SELECT COUNT(*) FROM plants');
    const categoriesCount = await pool.query('SELECT COUNT(*) FROM categories');
    
    console.log(`📊 Растений в БД: ${plantsCount.rows[0].count}`);
    console.log(`📊 Категорий в БД: ${categoriesCount.rows[0].count}`);
    
    if (parseInt(plantsCount.rows[0].count) === 0) {
      console.log('⚠️ База данных пуста. Запустите скрипт импорта данных.');
    }
    
  } catch (error) {
    console.error('❌ Ошибка инициализации БД:', error);
    throw error;
  }
}

export { pool };

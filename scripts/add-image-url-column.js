const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'dmitryrudenkov',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pitomnik_myta',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function addImageUrlColumn() {
  try {
    console.log('🔄 Добавляем колонку image_url в таблицу plants...');
    
    // Проверяем, существует ли колонка
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'plants' AND column_name = 'image_url'
    `);
    
    if (checkColumn.rows.length === 0) {
      // Добавляем колонку image_url
      await pool.query(`
        ALTER TABLE plants 
        ADD COLUMN image_url VARCHAR(500)
      `);
      console.log('✅ Колонка image_url добавлена');
    } else {
      console.log('ℹ️  Колонка image_url уже существует');
    }
    
    console.log('🎉 Миграция завершена успешно!');
    
  } catch (error) {
    console.error('❌ Ошибка при добавлении колонки:', error.message);
  } finally {
    await pool.end();
  }
}

addImageUrlColumn();

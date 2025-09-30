const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'dmitryrudenkov',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pitomnik_myta',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function checkDatabase() {
  try {
    console.log('🔍 Проверяем базу данных...');
    
    // Проверяем структуру таблицы
    const columns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'plants' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Колонки в таблице plants:');
    columns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });
    
    // Проверяем данные
    const plants = await pool.query(`
      SELECT id, name, image_url 
      FROM plants 
      LIMIT 3
    `);
    
    console.log('\n🌱 Первые 3 растения:');
    plants.rows.forEach(plant => {
      console.log(`  ID: ${plant.id}, Name: ${plant.name}, Image: ${plant.image_url || 'NULL'}`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

checkDatabase();

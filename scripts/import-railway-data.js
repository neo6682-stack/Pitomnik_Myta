const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Railway DATABASE_URL (публичный)
const DATABASE_URL = 'postgresql://postgres:TDQsyKKXQVdhebrKbrFlCyLxcwVwIhWY@gondola.proxy.rlwy.net:43679/railway';

console.log('🌱 Импорт данных растений в Railway PostgreSQL...');
console.log('DATABASE_URL:', DATABASE_URL.replace(/\/\/.*@/, '//***:***@')); // Скрываем пароль

const pool = new Pool({ connectionString: DATABASE_URL });

async function importData() {
  try {
    // 1. Создаем таблицы
    console.log('📋 Создание таблиц...');
    const schemaPath = path.join(__dirname, '..', 'database', 'schema-railway.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await pool.query(schema);
    console.log('✅ Таблицы созданы');

    // 2. Импортируем данные растений
    console.log('🌱 Импорт данных растений...');
    const plantsPath = path.join(__dirname, '..', 'data', 'plants.json');
    const plants = JSON.parse(fs.readFileSync(plantsPath, 'utf8'));

    for (const plant of plants) {
      await pool.query(`
        INSERT INTO plants (name, slug, description, price, category, characteristics, image_url, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          price = EXCLUDED.price,
          category = EXCLUDED.category,
          characteristics = EXCLUDED.characteristics,
          image_url = EXCLUDED.image_url,
          updated_at = NOW()
      `, [
        plant.name,
        plant.slug,
        plant.description,
        plant.price,
        plant.category,
        JSON.stringify(plant.characteristics),
        plant.image_url
      ]);
    }
    console.log(`✅ Импортировано ${plants.length} растений`);

    // 3. Импортируем категории
    console.log('📂 Импорт категорий...');
    const categoriesPath = path.join(__dirname, '..', 'data', 'categories.json');
    const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));

    for (const category of categories) {
      await pool.query(`
        INSERT INTO categories (name, slug, description, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          updated_at = NOW()
      `, [category.name, category.slug, category.description]);
    }
    console.log(`✅ Импортировано ${categories.length} категорий`);

    console.log('🎉 Данные успешно импортированы в Railway PostgreSQL!');
    
  } catch (error) {
    console.error('❌ Ошибка импорта данных:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

importData();

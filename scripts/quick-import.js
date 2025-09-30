#!/usr/bin/env node

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Получаем DATABASE_URL из переменной окружения
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL не найден в переменных окружения');
  console.log('💡 Убедитесь, что вы добавили DATABASE_URL в настройки Railway');
  process.exit(1);
}

console.log('🚀 Быстрый импорт данных в Railway...');
console.log('DATABASE_URL:', DATABASE_URL.replace(/\/\/.*@/, '//***:***@')); // Скрываем пароль

const pool = new Pool({ connectionString: DATABASE_URL });

async function quickImport() {
  try {
    // 1. Создаем только основные таблицы
    console.log('📋 Создание основных таблиц...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        slug VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS plants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        slug VARCHAR(200) UNIQUE NOT NULL,
        description TEXT,
        short_description TEXT,
        category VARCHAR(100),
        light_requirements VARCHAR(50),
        is_medicinal BOOLEAN DEFAULT FALSE,
        is_honey_plant BOOLEAN DEFAULT FALSE,
        is_evergreen BOOLEAN DEFAULT FALSE,
        is_roof_suitable BOOLEAN DEFAULT FALSE,
        is_ground_cover BOOLEAN DEFAULT FALSE,
        has_aroma BOOLEAN DEFAULT FALSE,
        height_min INTEGER,
        height_max INTEGER,
        price DECIMAL(10,2),
        image_url VARCHAR(500),
        characteristics JSONB,
        is_available BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Таблицы созданы');

    // 2. Очищаем старые данные
    console.log('🧹 Очистка старых данных...');
    await pool.query('DELETE FROM plants');
    await pool.query('DELETE FROM categories');
    console.log('✅ Старые данные удалены');

    // 3. Импортируем растения
    console.log('🌱 Импорт растений...');
    const plantsPath = path.join(__dirname, '..', 'data', 'plants.json');
    const plants = JSON.parse(fs.readFileSync(plantsPath, 'utf8'));

    let imported = 0;
    for (const plant of plants) {
      const slug = plant.slug || plant.name.toLowerCase()
        .replace(/[^a-z0-9а-я]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      await pool.query(`
        INSERT INTO plants (
          name, slug, description, short_description, category,
          light_requirements, is_medicinal, is_honey_plant, is_evergreen,
          is_roof_suitable, is_ground_cover, has_aroma,
          height_min, height_max, price, image_url, characteristics
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      `, [
        plant.name,
        slug,
        plant.description || '',
        plant.short_description || '',
        plant.category || '',
        plant.light_requirements || null,
        plant.is_medicinal || false,
        plant.is_honey_plant || false,
        plant.is_evergreen || false,
        plant.is_roof_suitable || false,
        plant.is_ground_cover || false,
        plant.has_aroma || false,
        plant.height_min || null,
        plant.height_max || null,
        plant.price || null,
        plant.image_url || null,
        JSON.stringify(plant.characteristics || {})
      ]);
      
      imported++;
      if (imported % 100 === 0) {
        console.log(`📊 Импортировано ${imported}/${plants.length} растений...`);
      }
    }
    console.log(`✅ Импортировано ${imported} растений`);

    // 4. Импортируем категории
    console.log('📂 Импорт категорий...');
    const categoriesPath = path.join(__dirname, '..', 'data', 'categories.json');
    const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));

    for (const category of categories) {
      await pool.query(`
        INSERT INTO categories (name, slug, description)
        VALUES ($1, $2, $3)
      `, [category.name, category.slug, category.description]);
    }
    console.log(`✅ Импортировано ${categories.length} категорий`);

    // 5. Проверяем результат
    const plantCount = await pool.query('SELECT COUNT(*) FROM plants');
    const categoryCount = await pool.query('SELECT COUNT(*) FROM categories');
    
    console.log('🎉 Импорт завершен успешно!');
    console.log(`📊 Статистика:`);
    console.log(`   - Растений: ${plantCount.rows[0].count}`);
    console.log(`   - Категорий: ${categoryCount.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Ошибка импорта:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

quickImport();

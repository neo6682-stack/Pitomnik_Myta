const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Конфигурация базы данных
const pool = new Pool({
  user: process.env.DB_USER || 'dmitryrudenkov',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pitomnik_myta',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

async function importToDatabase() {
  try {
    console.log('🗄️ Начинаем импорт данных в базу данных...');
    
    // Читаем данные
    const plantsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/plants.json'), 'utf8')
    );
    const categoriesData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/categories.json'), 'utf8')
    );
    
    console.log(`📊 Загружено ${plantsData.length} растений и ${categoriesData.length} категорий`);
    
    // Создаем таблицы
    console.log('🏗️ Создаем таблицы...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        slug VARCHAR(100) UNIQUE NOT NULL,
        parent_id INTEGER REFERENCES categories(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS plants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        scientific_name VARCHAR(200),
        description TEXT,
        short_description TEXT,
        category_id INTEGER REFERENCES categories(id),
        
        light_requirements VARCHAR(50),
        is_medicinal BOOLEAN DEFAULT FALSE,
        is_honey_plant BOOLEAN DEFAULT FALSE,
        is_evergreen BOOLEAN DEFAULT FALSE,
        is_roof_suitable BOOLEAN DEFAULT FALSE,
        is_ground_cover BOOLEAN DEFAULT FALSE,
        has_aroma BOOLEAN DEFAULT FALSE,
        is_floristic_cut BOOLEAN DEFAULT FALSE,
        is_dried_flower BOOLEAN DEFAULT FALSE,
        coastal_climate_resistant BOOLEAN DEFAULT FALSE,
        
        height_min INTEGER,
        height_max INTEGER,
        width_min INTEGER,
        width_max INTEGER,
        
        flowering_period VARCHAR(100),
        flower_color VARCHAR(100),
        plant_color VARCHAR(100),
        
        watering_frequency VARCHAR(50),
        soil_type VARCHAR(100),
        frost_resistance VARCHAR(50),
        care_instructions TEXT,
        
        price DECIMAL(10,2),
        wholesale_price DECIMAL(10,2),
        stock_quantity INTEGER DEFAULT 0,
        is_available BOOLEAN DEFAULT TRUE,
        
        slug VARCHAR(200) UNIQUE NOT NULL,
        meta_title VARCHAR(200),
        meta_description TEXT,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Очищаем существующие данные
    console.log('🧹 Очищаем существующие данные...');
    await pool.query('DELETE FROM plants');
    await pool.query('DELETE FROM categories');
    
    // Импортируем категории
    console.log('📂 Импортируем категории...');
    for (const category of categoriesData) {
      await pool.query(
        'INSERT INTO categories (id, name, description, slug, parent_id, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
        [category.id, category.name, category.description, category.slug, category.parent_id, category.created_at]
      );
    }
    
    // Создаем маппинг категорий
    const categoryMap = new Map();
    const categoryResult = await pool.query('SELECT id, name FROM categories');
    categoryResult.rows.forEach(row => {
      categoryMap.set(row.name, row.id);
    });
    
    // Импортируем растения
    console.log('🌱 Импортируем растения...');
    let importedCount = 0;
    
    for (const plant of plantsData) {
      try {
        const categoryId = categoryMap.get(plant.category) || 1; // По умолчанию первая категория
        
        await pool.query(`
          INSERT INTO plants (
            name, scientific_name, description, short_description, category_id,
            light_requirements, is_medicinal, is_honey_plant, is_evergreen,
            is_roof_suitable, is_ground_cover, has_aroma, is_floristic_cut,
            is_dried_flower, coastal_climate_resistant,
            height_min, height_max, width_min, width_max,
            flowering_period, flower_color, plant_color,
            watering_frequency, soil_type, frost_resistance, care_instructions,
            price, wholesale_price, stock_quantity, is_available,
            slug, meta_title, meta_description, image_url, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36)
        `, [
          plant.name,
          plant.scientific_name,
          plant.description,
          plant.short_description,
          categoryId,
          plant.light_requirements,
          plant.is_medicinal,
          plant.is_honey_plant,
          plant.is_evergreen,
          plant.is_roof_suitable,
          plant.is_ground_cover,
          plant.has_aroma,
          plant.is_floristic_cut,
          plant.is_dried_flower,
          plant.coastal_climate_resistant,
          plant.height_min,
          plant.height_max,
          plant.width_min,
          plant.width_max,
          plant.flowering_period,
          plant.flower_color,
          plant.plant_color,
          plant.watering_frequency,
          plant.soil_type,
          plant.frost_resistance,
          plant.care_instructions,
          plant.price,
          plant.wholesale_price,
          plant.stock_quantity,
          plant.is_available,
          plant.slug,
          plant.meta_title,
          plant.meta_description,
          plant.image_url || null,
          plant.created_at,
          plant.updated_at
        ]);
        
        importedCount++;
        
        if (importedCount % 50 === 0) {
          console.log(`📦 Импортировано ${importedCount} растений...`);
        }
        
      } catch (error) {
        console.error(`❌ Ошибка при импорте растения "${plant.name}":`, error.message);
      }
    }
    
    // Создаем индексы для оптимизации
    console.log('🔍 Создаем индексы...');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_plants_category ON plants(category_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_plants_light ON plants(light_requirements)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_plants_honey ON plants(is_honey_plant)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_plants_evergreen ON plants(is_evergreen)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_plants_available ON plants(is_available)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_plants_slug ON plants(slug)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_plants_roof ON plants(is_roof_suitable)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_plants_ground_cover ON plants(is_ground_cover)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_plants_aroma ON plants(has_aroma)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_plants_floristic ON plants(is_floristic_cut)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_plants_dried ON plants(is_dried_flower)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_plants_coastal ON plants(coastal_climate_resistant)');
    
    // Получаем статистику
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_plants,
        COUNT(CASE WHEN is_available = true THEN 1 END) as available_plants,
        COUNT(CASE WHEN is_honey_plant = true THEN 1 END) as honey_plants,
        COUNT(CASE WHEN is_evergreen = true THEN 1 END) as evergreen_plants,
        COUNT(CASE WHEN is_roof_suitable = true THEN 1 END) as roof_suitable,
        COUNT(CASE WHEN is_ground_cover = true THEN 1 END) as ground_cover,
        COUNT(CASE WHEN has_aroma = true THEN 1 END) as aromatic_plants,
        COUNT(CASE WHEN is_medicinal = true THEN 1 END) as medicinal_plants,
        COUNT(CASE WHEN is_floristic_cut = true THEN 1 END) as floristic_cut,
        COUNT(CASE WHEN is_dried_flower = true THEN 1 END) as dried_flowers,
        COUNT(CASE WHEN coastal_climate_resistant = true THEN 1 END) as coastal_resistant,
        AVG(price) as avg_price,
        MIN(price) as min_price,
        MAX(price) as max_price
      FROM plants
    `);
    
    console.log('✅ Импорт завершен успешно!');
    console.log(`📊 Статистика базы данных:`);
    console.log(`   Всего растений: ${stats.rows[0].total_plants}`);
    console.log(`   Доступно к продаже: ${stats.rows[0].available_plants}`);
    console.log(`   Медоносных: ${stats.rows[0].honey_plants}`);
    console.log(`   Вечнозеленых: ${stats.rows[0].evergreen_plants}`);
    console.log(`   Для крыш: ${stats.rows[0].roof_suitable}`);
    console.log(`   Почвопокровных: ${stats.rows[0].ground_cover}`);
    console.log(`   Ароматных: ${stats.rows[0].aromatic_plants}`);
    console.log(`   Лекарственных: ${stats.rows[0].medicinal_plants}`);
    console.log(`   Для флористики: ${stats.rows[0].floristic_cut}`);
    console.log(`   Сухоцветы: ${stats.rows[0].dried_flowers}`);
    console.log(`   Приморский климат: ${stats.rows[0].coastal_resistant}`);
    console.log(`   Средняя цена: ${parseFloat(stats.rows[0].avg_price).toFixed(2)} руб.`);
    console.log(`   Диапазон цен: ${parseFloat(stats.rows[0].min_price).toFixed(2)} - ${parseFloat(stats.rows[0].max_price).toFixed(2)} руб.`);
    
  } catch (error) {
    console.error('❌ Ошибка при импорте в базу данных:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Запускаем импорт
importToDatabase();
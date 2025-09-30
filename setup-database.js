const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Получаем DATABASE_URL из переменной окружения или аргумента командной строки
const DATABASE_URL = process.env.DATABASE_URL || process.argv[2];

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL не найден!');
  console.log('💡 Использование:');
  console.log('   node setup-database.js "postgresql://postgres:PASSWORD@containers-us-west-1.railway.app:5432/railway"');
  console.log('   или установите переменную окружения:');
  console.log('   export DATABASE_URL="postgresql://postgres:PASSWORD@containers-us-west-1.railway.app:5432/railway"');
  process.exit(1);
}

console.log('🚀 Настройка базы данных Railway...');
console.log('DATABASE_URL:', DATABASE_URL.replace(/\/\/.*@/, '//***:***@')); // Скрываем пароль

const pool = new Pool({ connectionString: DATABASE_URL });

async function setupDatabase() {
  try {
    console.log('📋 Создание таблиц...');
    
    // Создаем таблицы
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schema);
    console.log('✅ Таблицы созданы');

    // Импортируем категории
    console.log('📂 Импорт категорий...');
    const categoriesPath = path.join(__dirname, 'data', 'categories.json');
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

    // Импортируем растения
    console.log('🌱 Импорт растений...');
    const plantsPath = path.join(__dirname, 'data', 'plants.json');
    const plants = JSON.parse(fs.readFileSync(plantsPath, 'utf8'));

    let importedCount = 0;
    for (const plant of plants) {
      try {
        // Создаем slug если его нет
        const slug = plant.slug || plant.name.toLowerCase()
          .replace(/[^a-z0-9а-я]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');

        await pool.query(`
          INSERT INTO plants (
            name, slug, description, short_description, category, 
            light_requirements, is_medicinal, is_honey_plant, is_evergreen,
            is_roof_suitable, is_ground_cover, has_aroma, is_floristic_cut,
            is_dried_flower, coastal_climate_resistant,
            height_min, height_max, width_min, width_max,
            flowering_period, flower_color, watering_frequency,
            soil_type, frost_resistance, price, wholesale_price,
            stock_quantity, is_available, image_url, characteristics,
            created_at, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, NOW(), NOW())
          ON CONFLICT (slug) DO UPDATE SET
            name = EXCLUDED.name,
            description = EXCLUDED.description,
            short_description = EXCLUDED.short_description,
            category = EXCLUDED.category,
            light_requirements = EXCLUDED.light_requirements,
            is_medicinal = EXCLUDED.is_medicinal,
            is_honey_plant = EXCLUDED.is_honey_plant,
            is_evergreen = EXCLUDED.is_evergreen,
            is_roof_suitable = EXCLUDED.is_roof_suitable,
            is_ground_cover = EXCLUDED.is_ground_cover,
            has_aroma = EXCLUDED.has_aroma,
            height_min = EXCLUDED.height_min,
            height_max = EXCLUDED.height_max,
            price = EXCLUDED.price,
            image_url = EXCLUDED.image_url,
            characteristics = EXCLUDED.characteristics,
            updated_at = NOW()
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
          plant.is_floristic_cut || false,
          plant.is_dried_flower || false,
          plant.coastal_climate_resistant || false,
          plant.height_min || null,
          plant.height_max || null,
          plant.width_min || null,
          plant.width_max || null,
          plant.flowering_period || null,
          plant.flower_color || null,
          plant.watering_frequency || null,
          plant.soil_type || null,
          plant.frost_resistance || null,
          plant.price || null,
          plant.wholesale_price || null,
          plant.stock_quantity || 0,
          plant.is_available !== false, // default true
          plant.image_url || null,
          JSON.stringify(plant.characteristics || {})
        ]);
        importedCount++;
      } catch (error) {
        console.error(`❌ Ошибка импорта растения "${plant.name}":`, error.message);
      }
    }
    console.log(`✅ Импортировано ${importedCount} растений`);

    // Проверяем результат
    const result = await pool.query('SELECT COUNT(*) as count FROM plants');
    console.log(`📊 Всего растений в базе: ${result.rows[0].count}`);

    console.log('🎉 База данных успешно настроена!');
    
  } catch (error) {
    console.error('❌ Ошибка настройки базы данных:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();

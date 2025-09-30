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

async function importData() {
  try {
    console.log('🔄 Импорт данных в Railway...');
    
    // Читаем данные из JSON файлов
    const plantsPath = path.join(__dirname, '../../../data/plants.json');
    const categoriesPath = path.join(__dirname, '../../../data/categories.json');
    
    const plantsData = JSON.parse(fs.readFileSync(plantsPath, 'utf8'));
    const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
    
    console.log(`📊 Загружено ${plantsData.length} растений и ${categoriesData.length} категорий`);
    
    // Очищаем существующие данные
    await pool.query('DELETE FROM plants');
    await pool.query('DELETE FROM categories');
    console.log('🧹 Существующие данные очищены');
    
    // Импортируем категории
    for (const category of categoriesData) {
      await pool.query(`
        INSERT INTO categories (id, name, description, slug, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        category.id,
        category.name,
        category.description,
        category.slug,
        category.created_at,
        category.updated_at
      ]);
    }
    console.log(`✅ Импортировано ${categoriesData.length} категорий`);
    
    // Импортируем растения
    for (const plant of plantsData) {
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
        plant.category_id,
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
    }
    console.log(`✅ Импортировано ${plantsData.length} растений`);
    
    console.log('🎉 Импорт данных завершен успешно!');
    
  } catch (error) {
    console.error('❌ Ошибка импорта данных:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Запускаем импорт, если файл выполняется напрямую
if (require.main === module) {
  importData();
}

export { importData };

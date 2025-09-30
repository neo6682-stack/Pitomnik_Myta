import pool from '../database/connection';
import { Plant, PlantFilters } from '../types/plant';

export class PlantModel {
  static async findAll(filters: PlantFilters = {}): Promise<Plant[]> {
    const {
      category_id,
      light_requirements,
      is_honey_plant,
      is_evergreen,
      is_roof_suitable,
      is_ground_cover,
      has_aroma,
      is_floristic_cut,
      is_dried_flower,
      coastal_climate_resistant,
      min_price,
      max_price,
      search,
      page = 1,
      limit = 20
    } = filters;

    let query = `
      SELECT p.*, c.name as category_name 
      FROM plants p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE 1=1
    `;
    const queryParams: any[] = [];
    let paramCount = 0;

    // Фильтры
    if (category_id) {
      query += ` AND p.category_id = $${++paramCount}`;
      queryParams.push(category_id);
    }

    if (light_requirements) {
      query += ` AND p.light_requirements = $${++paramCount}`;
      queryParams.push(light_requirements);
    }

    if (is_honey_plant !== undefined) {
      query += ` AND p.is_honey_plant = $${++paramCount}`;
      queryParams.push(is_honey_plant);
    }

    if (is_evergreen !== undefined) {
      query += ` AND p.is_evergreen = $${++paramCount}`;
      queryParams.push(is_evergreen);
    }

    if (is_roof_suitable !== undefined) {
      query += ` AND p.is_roof_suitable = $${++paramCount}`;
      queryParams.push(is_roof_suitable);
    }

    if (is_ground_cover !== undefined) {
      query += ` AND p.is_ground_cover = $${++paramCount}`;
      queryParams.push(is_ground_cover);
    }

    if (has_aroma !== undefined) {
      query += ` AND p.has_aroma = $${++paramCount}`;
      queryParams.push(has_aroma);
    }

    if (is_floristic_cut !== undefined) {
      query += ` AND p.is_floristic_cut = $${++paramCount}`;
      queryParams.push(is_floristic_cut);
    }

    if (is_dried_flower !== undefined) {
      query += ` AND p.is_dried_flower = $${++paramCount}`;
      queryParams.push(is_dried_flower);
    }

    if (coastal_climate_resistant !== undefined) {
      query += ` AND p.coastal_climate_resistant = $${++paramCount}`;
      queryParams.push(coastal_climate_resistant);
    }

    if (min_price !== undefined) {
      query += ` AND p.price >= $${++paramCount}`;
      queryParams.push(min_price);
    }

    if (max_price !== undefined) {
      query += ` AND p.price <= $${++paramCount}`;
      queryParams.push(max_price);
    }

    if (search) {
      query += ` AND (p.name ILIKE $${++paramCount} OR p.description ILIKE $${++paramCount})`;
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    // Пагинация
    const offset = (page - 1) * limit;
    query += ` ORDER BY p.name LIMIT $${++paramCount} OFFSET $${++paramCount}`;
    queryParams.push(limit, offset);

    const result = await pool.query(query, queryParams);
    return result.rows;
  }

  static async findById(id: number): Promise<Plant | null> {
    const query = `
      SELECT p.*, c.name as category_name 
      FROM plants p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async findBySlug(slug: string): Promise<Plant | null> {
    const query = `
      SELECT p.*, c.name as category_name 
      FROM plants p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.slug = $1
    `;
    const result = await pool.query(query, [slug]);
    return result.rows[0] || null;
  }

  static async getCount(filters: PlantFilters = {}): Promise<number> {
    const {
      category_id,
      light_requirements,
      is_honey_plant,
      is_evergreen,
      is_roof_suitable,
      is_ground_cover,
      has_aroma,
      is_floristic_cut,
      is_dried_flower,
      coastal_climate_resistant,
      min_price,
      max_price,
      search
    } = filters;

    let query = 'SELECT COUNT(*) FROM plants p WHERE 1=1';
    const queryParams: any[] = [];
    let paramCount = 0;

    // Применяем те же фильтры, что и в findAll
    if (category_id) {
      query += ` AND p.category_id = $${++paramCount}`;
      queryParams.push(category_id);
    }

    if (light_requirements) {
      query += ` AND p.light_requirements = $${++paramCount}`;
      queryParams.push(light_requirements);
    }

    if (is_honey_plant !== undefined) {
      query += ` AND p.is_honey_plant = $${++paramCount}`;
      queryParams.push(is_honey_plant);
    }

    if (is_evergreen !== undefined) {
      query += ` AND p.is_evergreen = $${++paramCount}`;
      queryParams.push(is_evergreen);
    }

    if (is_roof_suitable !== undefined) {
      query += ` AND p.is_roof_suitable = $${++paramCount}`;
      queryParams.push(is_roof_suitable);
    }

    if (is_ground_cover !== undefined) {
      query += ` AND p.is_ground_cover = $${++paramCount}`;
      queryParams.push(is_ground_cover);
    }

    if (has_aroma !== undefined) {
      query += ` AND p.has_aroma = $${++paramCount}`;
      queryParams.push(has_aroma);
    }

    if (is_floristic_cut !== undefined) {
      query += ` AND p.is_floristic_cut = $${++paramCount}`;
      queryParams.push(is_floristic_cut);
    }

    if (is_dried_flower !== undefined) {
      query += ` AND p.is_dried_flower = $${++paramCount}`;
      queryParams.push(is_dried_flower);
    }

    if (coastal_climate_resistant !== undefined) {
      query += ` AND p.coastal_climate_resistant = $${++paramCount}`;
      queryParams.push(coastal_climate_resistant);
    }

    if (min_price !== undefined) {
      query += ` AND p.price >= $${++paramCount}`;
      queryParams.push(min_price);
    }

    if (max_price !== undefined) {
      query += ` AND p.price <= $${++paramCount}`;
      queryParams.push(max_price);
    }

    if (search) {
      query += ` AND (p.name ILIKE $${++paramCount} OR p.description ILIKE $${++paramCount})`;
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    const result = await pool.query(query, queryParams);
    return parseInt(result.rows[0].count);
  }

  static async getStatistics() {
    const query = `
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
    `;
    const result = await pool.query(query);
    return result.rows[0];
  }
}

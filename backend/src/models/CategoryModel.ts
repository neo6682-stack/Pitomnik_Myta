import pool from '../database/connection';
import { Category } from '../types/plant';

export class CategoryModel {
  static async findAll(): Promise<Category[]> {
    const query = 'SELECT * FROM categories ORDER BY name';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id: number): Promise<Category | null> {
    const query = 'SELECT * FROM categories WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async findBySlug(slug: string): Promise<Category | null> {
    const query = 'SELECT * FROM categories WHERE slug = $1';
    const result = await pool.query(query, [slug]);
    return result.rows[0] || null;
  }

  static async getPlantCount(categoryId: number): Promise<number> {
    const query = 'SELECT COUNT(*) FROM plants WHERE category_id = $1';
    const result = await pool.query(query, [categoryId]);
    return parseInt(result.rows[0].count);
  }
}

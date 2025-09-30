const { Pool } = require('pg');

// Подключение к базе данных Railway
const pool = new Pool({
  connectionString: 'postgresql://postgres:TDQsyKKXQVdhebrKbrFlCyLxcwVwIhWY@gondola.proxy.rlwy.net:43679/railway'
});

export default async function handler(req, res) {
  const { method } = req;

  // Настройка CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (method === 'GET') {
    try {
      const { page = 1, limit = 12, search, category_id } = req.query;
      const offset = (page - 1) * limit;

      let query = `
        SELECT 
          p.*,
          c.name as category_name
        FROM plants p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_available = true
      `;
      
      const queryParams = [];
      let paramCount = 0;

      if (search) {
        paramCount++;
        query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
        queryParams.push(`%${search}%`);
      }

      if (category_id) {
        paramCount++;
        query += ` AND p.category_id = $${paramCount}`;
        queryParams.push(category_id);
      }

      query += ` ORDER BY p.name LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
      queryParams.push(limit, offset);

      const result = await pool.query(query, queryParams);
      
      // Получаем общее количество
      let countQuery = `
        SELECT COUNT(*) as total
        FROM plants p
        WHERE p.is_available = true
      `;
      const countParams = [];
      paramCount = 0;

      if (search) {
        paramCount++;
        countQuery += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
        countParams.push(`%${search}%`);
      }

      if (category_id) {
        paramCount++;
        countQuery += ` AND p.category_id = $${paramCount}`;
        countParams.push(category_id);
      }

      const countResult = await pool.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].total);

      res.status(200).json({
        success: true,
        data: {
          plants: result.rows,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });

    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({
        success: false,
        message: 'Database error',
        error: error.message
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
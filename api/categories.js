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
      const result = await pool.query(`
        SELECT id, name, slug, description
        FROM categories
        ORDER BY name
      `);

      res.status(200).json({
        success: true,
        data: result.rows
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

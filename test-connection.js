const { Pool } = require('pg');

// Получаем DATABASE_URL из переменной окружения или аргумента командной строки
const DATABASE_URL = process.env.DATABASE_URL || process.argv[2];

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL не найден!');
  console.log('💡 Использование:');
  console.log('   node test-connection.js "postgresql://postgres:PASSWORD@containers-us-west-1.railway.app:5432/railway"');
  process.exit(1);
}

console.log('🔍 Тестирование подключения к базе данных...');
console.log('DATABASE_URL:', DATABASE_URL.replace(/\/\/.*@/, '//***:***@'));

const pool = new Pool({ connectionString: DATABASE_URL });

async function testConnection() {
  try {
    console.log('📡 Подключение к базе данных...');
    
    // Тест подключения
    const client = await pool.connect();
    console.log('✅ Подключение успешно!');
    
    // Проверяем версию PostgreSQL
    const versionResult = await client.query('SELECT version()');
    console.log('📊 Версия PostgreSQL:', versionResult.rows[0].version.split(' ')[0]);
    
    // Проверяем существующие таблицы
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📋 Существующие таблицы:');
    if (tablesResult.rows.length === 0) {
      console.log('   (таблицы не найдены)');
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    }
    
    // Если есть таблица plants, проверяем количество записей
    if (tablesResult.rows.some(row => row.table_name === 'plants')) {
      const countResult = await client.query('SELECT COUNT(*) as count FROM plants');
      console.log(`🌱 Растений в базе: ${countResult.rows[0].count}`);
    }
    
    client.release();
    console.log('✅ Тест завершен успешно!');
    
  } catch (error) {
    console.error('❌ Ошибка подключения:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Возможные причины:');
      console.log('   - Неправильный URL базы данных');
      console.log('   - База данных не создана');
      console.log('   - Неправильный пароль');
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testConnection();

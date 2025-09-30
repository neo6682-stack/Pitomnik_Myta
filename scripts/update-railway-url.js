const fs = require('fs');
const path = require('path');

// Получаем Railway URL из переменной окружения или используем дефолтный
const RAILWAY_URL = process.env.RAILWAY_URL || 'https://pitomnik-myta-production.up.railway.app';

console.log('🔧 Updating Railway URL in frontend...');
console.log('Railway URL:', RAILWAY_URL);

const frontendPath = path.join(__dirname, '..', 'frontend-static', 'index.html');

if (!fs.existsSync(frontendPath)) {
  console.error('❌ Frontend file not found:', frontendPath);
  process.exit(1);
}

let content = fs.readFileSync(frontendPath, 'utf8');

// Обновляем API_BASE URL
const newApiBase = `const API_BASE = window.location.hostname === 'localhost' 
            ? 'http://localhost:3001/api' 
            : '${RAILWAY_URL}/api';`;

content = content.replace(
  /const API_BASE = window\.location\.hostname === 'localhost'[\s\S]*?;'/,
  newApiBase
);

fs.writeFileSync(frontendPath, content);

console.log('✅ Railway URL updated in frontend!');
console.log('Updated API_BASE:', newApiBase);

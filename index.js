// Railway entry point - redirects to backend
const path = require('path');

try {
  // Пытаемся загрузить из dist (если собран)
  require('./dist/index.js');
} catch (error) {
  console.log('dist/index.js not found, trying backend/src/index.js');
  try {
    // Fallback на исходный код
    require('./backend/dist/index.js');
  } catch (error2) {
    console.log('backend/dist/index.js not found, trying direct compilation');
    // Последний fallback - запускаем TypeScript напрямую
    require('child_process').exec('cd backend && npm run build && node dist/index.js', (err, stdout, stderr) => {
      if (err) {
        console.error('Failed to start backend:', err);
        process.exit(1);
      }
    });
  }
}

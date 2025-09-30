const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
  // Устанавливаем CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Обработка OPTIONS запросов
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  
  // Проверяем существование файла
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // Если файл не найден, возвращаем index.html для SPA
      filePath = path.join(__dirname, 'index.html');
    }
    
    // Определяем MIME тип
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (extname) {
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      case '.json':
        contentType = 'application/json';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
        contentType = 'image/jpg';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
      case '.ttc':
        contentType = 'font/ttc';
        break;
      case '.ttf':
        contentType = 'font/ttf';
        break;
      case '.woff':
        contentType = 'font/woff';
        break;
      case '.woff2':
        contentType = 'font/woff2';
        break;
      case '.ico':
        contentType = 'image/x-icon';
        break;
    }
    
    // Читаем и отправляем файл
    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('<h1>404 - Страница не найдена</h1>');
        } else {
          res.writeHead(500);
          res.end(`Ошибка сервера: ${err.code}`);
        }
      } else {
        let responseBody = content;

        if (contentType === 'text/html') {
          const apiBase = process.env.API_BASE_URL || 'http://localhost:3001/api';
          responseBody = content.toString('utf-8').replace(/{{API_BASE_URL}}/g, apiBase);
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(responseBody, 'utf-8');
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`🌐 Фронтенд сервер запущен на http://localhost:${PORT}`);
  console.log(`📱 Откройте браузер и перейдите по адресу: http://localhost:${PORT}`);
});

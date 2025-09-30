const fs = require('fs');
const path = require('path');

console.log('🔨 Building backend...');

// Create dist directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Simple approach: copy files and fix only critical issues
const srcDir = path.join(__dirname, 'src');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (file.endsWith('.ts')) {
      const content = fs.readFileSync(srcPath, 'utf8');
      
      // Minimal conversion - just fix the most critical issues
      let jsContent = content
        // Fix express-rate-limit import
        .replace(/import\s+rateLimit\s+from\s+['"]express-rate-limit['"];?/g, "const rateLimit = require('express-rate-limit');")
        .replace(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"];?/g, "const $1 = require('$2');")
        .replace(/import\s*{\s*([^}]+)\s*}\s*from\s+['"]([^'"]+)['"];?/g, "const { $1 } = require('$2');")
        
        // Remove type annotations (simple ones)
        .replace(/:\s*string/g, '')
        .replace(/:\s*number/g, '')
        .replace(/:\s*boolean/g, '')
        .replace(/:\s*any/g, '')
        .replace(/:\s*object/g, '')
        .replace(/:\s*Array<[^>]+>/g, '')
        .replace(/:\s*\w+\[\]/g, '')
        
        // Remove type annotations from function parameters
        .replace(/\(\s*(\w+)\s*:\s*[^,)]+/g, '($1')
        .replace(/,\s*(\w+)\s*:\s*[^,)]+/g, ', $1')
        .replace(/\(\s*(\w+)\s*:\s*[^)]+\)/g, '($1)')
        
        // Remove export statements
        .replace(/export\s+/g, '')
        
        // Remove interface declarations
        .replace(/interface\s+\w+\s*{[^}]*}/g, '')
        .replace(/type\s+\w+\s*=\s*[^;]+;/g, '')
        
        // Fix require paths to use root node_modules
        .replace(/require\('([^']+)'\)/g, (match, moduleName) => {
          // For modules that should be in root node_modules
          const rootModules = ['express', 'cors', 'helmet', 'morgan', 'express-rate-limit', 'bcryptjs', 'joi', 'jsonwebtoken', 'multer', 'pg', 'dotenv'];
          if (rootModules.includes(moduleName)) {
            return `require('../../node_modules/${moduleName}')`;
          }
          return match;
        });
      
      // Write the converted file
      fs.writeFileSync(destPath.replace('.ts', '.js'), jsContent);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

copyDir(srcDir, distDir);
console.log('✅ Build completed!');

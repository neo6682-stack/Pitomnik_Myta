const fs = require('fs');
const path = require('path');

// Simple build script that copies and compiles TypeScript files
console.log('🔨 Building backend...');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy source files to dist (simplified approach)
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
    } else {
      // Copy .ts files as .js files (simplified)
      if (file.endsWith('.ts')) {
        const content = fs.readFileSync(srcPath, 'utf8');
        // Simple TypeScript to JavaScript conversion
        const jsContent = content
          .replace(/import\s+.*\s+from\s+['"](.*)['"];?/g, "const $1 = require('$1');")
          .replace(/export\s+/g, '')
          .replace(/: string/g, '')
          .replace(/: number/g, '')
          .replace(/: boolean/g, '')
          .replace(/: any/g, '')
          .replace(/: object/g, '')
          .replace(/: Array<.*>/g, '')
          .replace(/: \w+\[\]/g, '')
          .replace(/interface\s+\w+\s*{[^}]*}/g, '')
          .replace(/type\s+\w+\s*=.*;/g, '');
        
        fs.writeFileSync(destPath.replace('.ts', '.js'), jsContent);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  });
}

copyDir(srcDir, distDir);

console.log('✅ Build completed!');

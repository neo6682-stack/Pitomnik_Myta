const fs = require('fs');
const path = require('path');

console.log('🔨 Building backend...');

// Create dist directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy and convert TypeScript files
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
      
      // Convert TypeScript to JavaScript
      let jsContent = content
        // Fix import statements
        .replace(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"];?/g, "const $1 = require('$2');")
        .replace(/import\s*{\s*([^}]+)\s*}\s*from\s+['"]([^'"]+)['"];?/g, "const { $1 } = require('$2');")
        .replace(/import\s*\*\s*as\s+(\w+)\s+from\s+['"]([^'"]+)['"];?/g, "const $1 = require('$2');")
        
        // Remove type annotations
        .replace(/:\s*string/g, '')
        .replace(/:\s*number/g, '')
        .replace(/:\s*boolean/g, '')
        .replace(/:\s*any/g, '')
        .replace(/:\s*object/g, '')
        .replace(/:\s*Array<[^>]+>/g, '')
        .replace(/:\s*\w+\[\]/g, '')
        .replace(/:\s*{[^}]*}/g, '')
        
        // Remove interface and type declarations
        .replace(/interface\s+\w+\s*{[^}]*}/g, '')
        .replace(/type\s+\w+\s*=\s*[^;]+;/g, '')
        
        // Remove export statements
        .replace(/export\s+/g, '')
        
        // Fix variable names with hyphens
        .replace(/const\s+([a-zA-Z][a-zA-Z0-9-]*)\s*=/g, (match, varName) => {
          const cleanName = varName.replace(/-/g, '_');
          return `const ${cleanName} =`;
        })
        .replace(/require\('([^']+)'\)/g, (match, moduleName) => {
          if (moduleName.includes('-')) {
            const cleanModule = moduleName.replace(/-/g, '_');
            return `require('${moduleName}')`;
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

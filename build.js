const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building project...');

try {
  // 1. Build backend
  console.log('📦 Building backend...');
  execSync('cd backend && npx --package=typescript tsc', { stdio: 'inherit' });
  
  // 2. Check where dist was created
  const rootDist = path.join(__dirname, 'dist');
  const reposDist = path.join(__dirname, '..', 'dist');
  const backendDist = path.join(__dirname, 'backend', 'dist');
  
  console.log('📋 Looking for dist folder...');
  console.log('  - repos/dist exists:', fs.existsSync(reposDist));
  console.log('  - backend/dist exists:', fs.existsSync(backendDist));
  
  // Remove existing dist
  if (fs.existsSync(rootDist)) {
    fs.rmSync(rootDist, { recursive: true, force: true });
  }
  
  // Move dist from the correct location
  if (fs.existsSync(reposDist)) {
    console.log('📋 Moving from repos/dist...');
    execSync(`mv ${reposDist} ${rootDist}`, { stdio: 'inherit' });
  } else if (fs.existsSync(backendDist)) {
    console.log('📋 Copying from backend/dist...');
    execSync(`cp -r ${backendDist} ${rootDist}`, { stdio: 'inherit' });
  } else {
    throw new Error('No dist folder found in any expected location');
  }
  
  console.log('✅ Build completed successfully!');
  console.log('📁 Files in dist:', fs.readdirSync(rootDist));
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

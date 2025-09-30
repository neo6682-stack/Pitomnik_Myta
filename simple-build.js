const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Simple build script...');

try {
  // 1. Build backend
  console.log('📦 Building backend...');
  execSync('cd backend && npx --package=typescript tsc', { stdio: 'inherit' });
  
  // 2. Check where dist was created
  const rootDist = path.join(__dirname, 'dist');
  const reposDist = path.join(__dirname, '..', 'dist');
  const backendDist = path.join(__dirname, 'backend', 'dist');
  
  console.log('📋 Checking locations:');
  console.log('  - repos/dist exists:', fs.existsSync(reposDist));
  console.log('  - backend/dist exists:', fs.existsSync(backendDist));
  console.log('  - root/dist exists:', fs.existsSync(rootDist));
  
  // 3. Find and move dist
  if (fs.existsSync(reposDist)) {
    console.log('📋 Moving from repos/dist...');
    if (fs.existsSync(rootDist)) {
      fs.rmSync(rootDist, { recursive: true, force: true });
    }
    execSync(`mv ${reposDist} ${rootDist}`, { stdio: 'inherit' });
  } else if (fs.existsSync(backendDist)) {
    console.log('📋 Copying from backend/dist...');
    if (fs.existsSync(rootDist)) {
      fs.rmSync(rootDist, { recursive: true, force: true });
    }
    execSync(`cp -r ${backendDist} ${rootDist}`, { stdio: 'inherit' });
  } else {
    console.log('❌ No dist folder found!');
    console.log('📁 Contents of backend:', fs.readdirSync(path.join(__dirname, 'backend')));
    console.log('📁 Contents of repos:', fs.readdirSync(path.join(__dirname, '..')));
    throw new Error('No dist folder found');
  }
  
  console.log('✅ Build completed!');
  console.log('📁 Files in dist:', fs.readdirSync(rootDist));
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
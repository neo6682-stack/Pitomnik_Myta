const { execSync } = require('child_process');

console.log('🔨 Building backend with TypeScript compiler...');

try {
  execSync('npx tsc --project tsconfig.json', { stdio: 'inherit' });
  console.log('✅ Build completed!');
} catch (error) {
  console.error('❌ Build failed');
  process.exit(error.status || 1);
}

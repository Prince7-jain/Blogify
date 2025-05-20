import { execSync } from 'child_process';
import fs from 'fs';

// Ensure we're using the right version of npm
console.log('Setting up build environment...');

try {
  // Clean install without optional dependencies
  console.log('Installing dependencies without optional packages...');
  execSync('npm install --no-optional', { stdio: 'inherit' });
  
  // Run the build
  console.log('Building the application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Ensure the dist directory exists
  if (!fs.existsSync('./dist')) {
    console.error('Build failed: dist directory not created');
    process.exit(1);
  }
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 
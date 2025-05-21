#!/usr/bin/env node

/**
 * Custom build script for Vercel deployment
 * This script installs the required native dependencies for Linux
 * and then runs the Vite build process
 */

import { spawnSync } from 'child_process';

console.log('🚀 Starting custom build process for Vercel deployment');
console.log('📦 Installing platform-specific dependencies...');

// The packages to install with their versions
const packages = [
  '@rollup/rollup-linux-x64-gnu@4.41.0',
  '@swc/core-linux-x64-gnu@1.3.100', 
  'lightningcss-linux-x64-gnu@1.30.1',
  '@tailwindcss/oxide-linux-x64-gnu@4.1.7'
];

// Install each package one by one
for (const pkg of packages) {
  console.log(`Installing ${pkg}...`);
  
  const installResult = spawnSync('npm', ['install', pkg, '--no-save'], {
    stdio: 'inherit',
    shell: true
  });
  
  if (installResult.status !== 0) {
    console.error(`Failed to install ${pkg}`);
    // Continue anyway, as some packages might work without others
  }
}

console.log('✅ Dependencies installed');
console.log('🛠️ Running Vite build...');

const buildResult = spawnSync('npx', ['vite', 'build'], {
  stdio: 'inherit',
  shell: true
});

if (buildResult.status !== 0) {
  console.error('❌ Build failed');
  process.exit(1);
}

console.log('✅ Build completed successfully'); 
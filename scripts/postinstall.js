#!/usr/bin/env node

/**
 * This script ensures that all required platform-specific dependencies are installed.
 * It runs after `npm install` to check and install any missing native modules.
 */

import { spawnSync } from 'child_process';
import { platform, arch } from 'os';
import fs from 'fs';
import path from 'path';

// Check if we're in Vercel's build environment
const isVercel = process.env.VERCEL === '1';

// Skip running this in Vercel since we handle it with the build:vercel script
if (isVercel) {
  console.log('Running in Vercel environment - skipping postinstall script');
  process.exit(0);
}

// Detect current platform and architecture
const currentPlatform = platform();
const currentArch = arch();

console.log(`Detected platform: ${currentPlatform}, architecture: ${currentArch}`);

// Map platform and architecture to npm package suffixes
let suffix = null;
if (currentPlatform === 'win32' && currentArch === 'x64') {
  suffix = 'win32-x64-msvc';
} else if (currentPlatform === 'darwin' && currentArch === 'x64') {
  suffix = 'darwin-x64';
} else if (currentPlatform === 'darwin' && currentArch === 'arm64') {
  suffix = 'darwin-arm64';
} else if (currentPlatform === 'linux' && currentArch === 'x64') {
  suffix = 'linux-x64-gnu';
} else {
  console.warn(`Unsupported platform: ${currentPlatform} ${currentArch}`);
  process.exit(0);
}

// List of packages that need platform-specific binaries with their versions
const packages = [
  { name: '@rollup/rollup', version: '4.41.0' },
  { name: '@swc/core', version: '1.3.100' },
  { name: 'lightningcss', version: '1.30.1' },
  { name: '@tailwindcss/oxide', version: '4.1.7' }
];

// Check if each package's platform-specific version is installed
for (const pkg of packages) {
  const platformSpecificPkg = `${pkg.name}-${suffix}`;
  const packageWithVersion = pkg.version ? `${platformSpecificPkg}@${pkg.version}` : platformSpecificPkg;
  
  try {
    // Try to require the package to see if it's installed
    require.resolve(platformSpecificPkg);
    console.log(`✓ ${platformSpecificPkg} is already installed`);
  } catch (err) {
    // If not installed, install it
    console.log(`Installing ${packageWithVersion}...`);
    
    const result = spawnSync('npm', ['install', '--no-save', packageWithVersion], { 
      stdio: 'inherit',
      shell: true
    });
    
    if (result.status !== 0) {
      console.error(`Failed to install ${packageWithVersion}`);
      // Continue with other packages even if one fails
    }
  }
}

console.log('Platform-specific dependencies check completed'); 
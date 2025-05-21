#!/usr/bin/env node

/**
 * This script ensures that all required platform-specific dependencies are installed.
 * It runs after `npm install` to check and install any missing native modules.
 */

import { spawnSync } from 'child_process';
import { platform, arch } from 'os';
import fs from 'fs';
import path from 'path';

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

// List of packages that need platform-specific binaries
const packages = [
  '@rollup/rollup',
  '@swc/core',
  'lightningcss',
  '@tailwindcss/oxide'
];

// Check if each package's platform-specific version is installed
for (const pkg of packages) {
  const platformSpecificPkg = `${pkg}-${suffix}`;
  
  try {
    // Try to require the package to see if it's installed
    require.resolve(platformSpecificPkg);
    console.log(`✓ ${platformSpecificPkg} is already installed`);
  } catch (err) {
    // If not installed, install it
    console.log(`Installing ${platformSpecificPkg}...`);
    
    const result = spawnSync('npm', ['install', '--no-save', platformSpecificPkg], { 
      stdio: 'inherit',
      shell: true
    });
    
    if (result.status !== 0) {
      console.error(`Failed to install ${platformSpecificPkg}`);
      // Continue with other packages even if one fails
    }
  }
}

console.log('Platform-specific dependencies check completed'); 
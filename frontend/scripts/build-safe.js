/**
 * Safe build script that preserves the components folder
 * Cleans only app.js and assets, but keeps components/
 */

import { rmSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const outDir = '../public/js/react';

// Clean only specific files/folders, preserve components
const filesToClean = ['app.js', 'assets', 'chunks'];

filesToClean.forEach(item => {
  const fullPath = join(outDir, item);
  if (existsSync(fullPath)) {
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      rmSync(fullPath, { recursive: true, force: true });
      console.log(`Cleaned directory: ${item}`);
    } else {
      rmSync(fullPath, { force: true });
      console.log(`Cleaned file: ${item}`);
    }
  }
});

console.log('Preserved components/ folder');


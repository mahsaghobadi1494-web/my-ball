// @ts-nocheck
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const IMG_PATH = 'public/assets/Ultra-Garage-Pack.png';
const OUT_DIR = 'public/assets/ultra_thumbs';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

console.log('Starting garage asset analysis and extraction...');

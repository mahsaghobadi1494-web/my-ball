// @ts-nocheck
import { execSync } from 'child_process';
import fs from 'fs';

// Let's find the exact text in each debug slice using ImageMagick comparison or OCR
console.log('Inspecting layout of Ultra-Garage-Pack.png...');

// Let's create high-resolution crops of each major zone:
const zones = [
  { name: 'zone_00_bodies', y: 0, h: 700 },
  { name: 'zone_01_wheels_top', y: 700, h: 600 },
  { name: 'zone_02_wheels_bottom', y: 1300, h: 600 },
  { name: 'zone_03_decals_top', y: 1900, h: 600 },
  { name: 'zone_04_decals_bottom', y: 2500, h: 600 },
  { name: 'zone_05_toppers', y: 3100, h: 500 },
  { name: 'zone_06_antennas_goals', y: 3600, h: 742 },
];

for (const z of zones) {
  try {
    execSync(`convert /public/assets/Ultra-Garage-Pack.png -crop 2514x${z.h}+0+${z.y} -resize 1200 /public/assets/ultra_thumbs/${z.name}.jpg`);
    console.log(`Saved ${z.name}`);
  } catch (e) {
    console.error(e);
  }
}

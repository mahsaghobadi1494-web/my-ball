// @ts-nocheck
import { execSync } from 'child_process';
import fs from 'fs';

// Let us sample vertical lines or generate horizontal test crops every 100px from y=0 to 4300
// and check where each category is.
const crops = [
  { name: 'header_bodies', y: 0, h: 100 },
  { name: 'bodies_r1', y: 70, h: 140 },
  { name: 'bodies_r2', y: 220, h: 140 },
  { name: 'bodies_r3', y: 370, h: 140 },
  { name: 'bodies_r4', y: 520, h: 140 },
  { name: 'header_wheels', y: 700, h: 100 },
  { name: 'wheels_r1', y: 760, h: 140 },
  { name: 'header_decals', y: 1980, h: 100 },
  { name: 'header_toppers', y: 3080, h: 100 },
  { name: 'header_antennas', y: 3600, h: 100 },
  { name: 'header_goals', y: 3820, h: 100 },
];

for (const c of crops) {
  try {
    execSync(`convert /public/assets/Ultra-Garage-Pack.png -crop 2514x${c.h}+0+${c.y} -resize 600 /public/assets/ultra_thumbs/${c.name}.png`);
    console.log(`Saved ${c.name}`);
  } catch (e) {
    console.error(`Error on ${c.name}:`, e.message);
  }
}

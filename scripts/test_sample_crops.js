// @ts-nocheck
import { execSync } from 'child_process';
import fs from 'fs';

// Let's verify our Y slices by cropping 1 sample item from each row and printing output
const testItems = [
  { name: 'body_r1_c0', x: 28, y: 80, w: 136, h: 120 },
  { name: 'body_r2_c0', x: 28, y: 248, w: 136, h: 120 },
  { name: 'body_r3_c0', x: 28, y: 416, w: 136, h: 120 },
  { name: 'body_r4_c0', x: 28, y: 584, w: 136, h: 120 },
  { name: 'wheel_r1_c0', x: 28, y: 790, w: 136, h: 120 },
  { name: 'wheel_r7_c0', x: 28, y: 1750, w: 136, h: 120 },
  { name: 'decal_r1_c0', x: 28, y: 1960, w: 136, h: 120 },
  { name: 'topper_r1_c0', x: 28, y: 2650, w: 136, h: 120 },
  { name: 'topper_r3_c0', x: 28, y: 2970, w: 136, h: 120 },
  { name: 'antenna_r1_c0', x: 28, y: 3180, w: 136, h: 120 },
  { name: 'goal_r1_c0', x: 28, y: 3390, w: 136, h: 120 },
  { name: 'goal_r2_c0', x: 28, y: 3550, w: 136, h: 120 },
];

for (const t of testItems) {
  execSync(`convert /public/assets/Ultra-Garage-Pack.png -crop ${t.w}x${t.h}+${t.x}+${t.y} /public/assets/ultra_thumbs/test_${t.name}.jpg`);
  console.log(`Cropped test_${t.name}`);
}

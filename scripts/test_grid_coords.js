// @ts-nocheck
import { execSync } from 'child_process';
import fs from 'fs';

// Measure exact coordinates of each section header:
// In the 2514x4342 image:
// Header 1: BODIES (at ~y=20 to 60)
//   Body Row 1: y=70 to 200 (height ~130)
//   Body Row 2: y=210 to 340
//   Body Row 3: y=350 to 480
//   Body Row 4: y=490 to 620
// Header 2: WHEELS (at ~y=660 to 700)
//   Wheel Row 1: y=720 to 860
//   Wheel Row 2: y=870 to 1010
//   Wheel Row 3: y=1020 to 1160
//   Wheel Row 4: y=1170 to 1310
//   Wheel Row 5: y=1320 to 1460
//   Wheel Row 6: y=1470 to 1610
//   Wheel Row 7: y=1620 to 1760
// Header 3: DECALS / VINYLS (at ~y=1800 to 1840)
//   Decal Row 1: y=1860 to 2000
//   Decal Row 2: y=2010 to 2150
//   Decal Row 3: y=2160 to 2300
//   Decal Row 4: y=2310 to 2450
// Header 4: TOPPERS (at ~y=2500 to 2540)
// Let's verify where TOPPERS, ANTENNAS and GOALS are!

// Let's crop test strips around y=2400-4342 to check exact positions
const testY = [1800, 2000, 2200, 2400, 2600, 2800, 3000, 3200, 3400, 3600, 3800, 4000, 4200];
for (const y of testY) {
  execSync(`convert /public/assets/Ultra-Garage-Pack.png -crop 2514x80+0+${y} -resize 800 /public/assets/ultra_thumbs/row_${y}.jpg`);
}
console.log('Row samples generated');

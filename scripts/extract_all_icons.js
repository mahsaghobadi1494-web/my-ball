// @ts-nocheck
import { execSync } from 'child_process';
import fs from 'fs';

console.log('Calculating exact bounding boxes and extracting individual icons...');

const IMG = '/public/assets/Ultra-Garage-Pack.png';
const OUT = '/public/assets/ultra_thumbs';

if (!fs.existsSync(OUT)) {
  fs.mkdirSync(OUT, { recursive: true });
}

// Total dimensions: 2514 x 4342
// 18 columns standard across the full width
// Left margin: ~32px, Right margin: ~32px
// Usable width: ~2450px / 18 cols = ~136.1px per item slot

const COLS_18 = 18;
const START_X = 28;
const ITEM_W = 136;
const ITEM_H = 100; // image part of the cell

function extractItem(name, x, y, w = 130, h = 95) {
  const dest = `${OUT}/${name}.webp`;
  try {
    // Crop and convert to webp (clean, high quality, small file size)
    execSync(`convert "${IMG}" -crop ${w}x${h}+${Math.round(x)}+${Math.round(y)} -strip -quality 90 "${dest}"`);
  } catch (e) {
    console.error(`Failed to extract ${name}:`, e.message);
  }
}

// 1. BODIES (4 rows)
// Row 1: y ~ 95
// Row 2: y ~ 235
// Row 3: y ~ 375
// Row 4: y ~ 515
const bodyRows = [
  {
    y: 92,
    items: [
      'octavius', 'dominator', 'fennecx', 'vanguard', 'nocturne', 'apexr',
      'brawler', 'paladin', 'breaker', 'samurai', 'rallyhawk', 'zephyr',
      'mantis', 'centaur', 'hornet', 'bastion', 'phantom', 'dragline'
    ]
  },
  {
    y: 232,
    items: [
      'aerowing', 'voltaic', 'hooligan', 'leviathan', 'stingray', 'brickhouse',
      'sabretooth', 'comet', 'pillager', 'wraith', 'goliath', 'needle',
      'brutus', 'mako', 'thunderbug', 'viceroy', 'scrapheap', 'polaris'
    ]
  },
  {
    y: 372,
    items: [
      'hummingbird', 'wideload', 'meteor', 'glasswing', 'apex', 'vortex',
      'aurora', 'kestrel', 'rapier', 'seraph', 'talon', 'halcyon',
      'vandal', 'zenith', 'titan', 'rampage', 'bison', 'mastodon'
    ]
  },
  {
    y: 512,
    items: [
      'colossus', 'anvil', 'bruiser', 'warthog', 'grizzly', 'bulwark'
    ]
  }
];

console.log('Extracting bodies...');
for (const row of bodyRows) {
  for (let c = 0; c < row.items.length; c++) {
    const id = row.items[c];
    const x = START_X + c * 136.6;
    extractItem(`car_${id}`, x, row.y, 132, 95);
  }
}

// 2. WHEELS (7 rows)
// Header at ~720
// Rows around: 780, 930, 1080, 1230, 1380, 1530, 1680
const wheelRows = [
  {
    y: 775,
    items: [
      'falconstar', 'vortex', 'turbina', 'deepdish', 'splitsix', 'wishbone',
      'meshweave', 'bladerunner', 'webline', 'cagework', 'wirepin', 'fanblade',
      'crosshair', 'hexcore', 'spiralis', 'monolith', 'goldline', 'obsidian'
    ]
  },
  {
    y: 925,
    items: [
      'carbonite', 'titanix', 'slickline', 'gravelking', 'vgrip', 'driftline',
      'neonhalo', 'ember', 'plasmaring', 'chronos', 'gyroloop', 'voidstar',
      'pulsar', 'turbofan', 'cyclonex', 'starlance', 'nebula', 'frostbite'
    ]
  },
  {
    y: 1075,
    items: [
      'helixor', 'vertexr', 'quantum', 'zenith', 'monsterclaw', 'bogger',
      'studiq', 'sawblade', 'formula', 'turbofanx', 'neondrift', 'goldcrown',
      'carbonweb', 'thunderroll', 'voidcore', 'donut', 'foxtail', 'pyre'
    ]
  },
  {
    y: 1225,
    items: [
      'emberheart', 'magmaflow', 'lavaflow', 'dragonfire', 'cinder', 'glacier',
      'permafrost', 'cryocore', 'shiver', 'plasmadrive', 'thunderhead', 'circuitboard',
      'cyberdeck', 'neongrid', 'holofoil', 'oilslick', 'acidrain', 'toxicbloom'
    ]
  },
  {
    y: 1375,
    items: [
      'ghostfire', 'sunburst', 'retrosunset', 'zebra', 'candycane', 'checkerflag',
      'cheetah', 'woodland', 'stealth', 'dazzle', 'graffiti', 'pixelart',
      'honeycomb', 'alloycore', 'carrara', 'terrazzo', 'rustbucket', 'dragonscale'
    ]
  },
  {
    y: 1525,
    items: [
      'snakeskin', 'timber', 'denim', 'carbonwrap', 'chocchip', 'watermelon',
      'longplay', 'daisy', 'blackrose', 'pawprint', 'pineapple', 'gumball',
      'candycrush', 'sushiroll', 'gearhead', 'buzzsaw', 'ripplewave', 'inkblot'
    ]
  },
  {
    y: 1675,
    items: [
      'frostspike', 'sandpaddle', 'ductfan', 'mace', 'glacierbite', 'balloon',
      'lowprofile', 'doubleglaze'
    ]
  }
];

console.log('Extracting wheels...');
for (const row of wheelRows) {
  for (let c = 0; c < row.items.length; c++) {
    const id = row.items[c];
    const x = START_X + c * 136.6;
    extractItem(`wheel_${id}`, x, row.y, 132, 95);
  }
}

// 3. TOPPERS (3 rows)
// Header at ~3100
// Rows at: 3160, 3310, 3460
const topperRows = [
  {
    y: 3155,
    items: [
      'tophat', 'bowler', 'beanie', 'royalcrown', 'piratetricorn', 'vikinghelm',
      'wizardhat', 'policecap', 'cheftoque', 'cowboyhat', 'santahat', 'halo',
      'flowercrown', 'propellercap', 'baseballcap', 'partycone', 'graduationcap', 'devilhorns'
    ]
  },
  {
    y: 3305,
    items: [
      'unicornhorn', 'dragonskull', 'cactus', 'trafficcone', 'donut', 'sombrero',
      'beret', 'fedora', 'knighthelm', 'astrohelmet', 'catears', 'bunnyears',
      'burger', 'pizzaslice', 'rubberduck', 'octopus', 'sharkfin', 'moai'
    ]
  },
  {
    y: 3455,
    items: [
      'jackolantern', 'snowman', 'antlers', 'tiara', 'mushroom', 'sushi',
      'brain', 'alien', 'ghost', 'pineapple', 'watermelon', 'icecreamcone',
      'barrel', 'treasurechest', 'hotdog', 'vinylrecord', 'toaster'
    ]
  }
];

console.log('Extracting toppers...');
for (const row of topperRows) {
  for (let c = 0; c < row.items.length; c++) {
    const id = row.items[c];
    const x = START_X + c * 136.6;
    extractItem(`topper_${id}`, x, row.y, 132, 95);
  }
}

// 4. ANTENNAS (1 row of 12 items)
// Header at ~3640, Items at ~3700
const antennaItems = [
  'checkeredflag', 'balloon', 'lollipop', 'palmtree', 'popsicle', 'minirocket',
  'soccerball', 'luckydice', 'star', 'umbrella', 'minisword', 'seamine'
];

console.log('Extracting antennas...');
for (let c = 0; c < antennaItems.length; c++) {
  const id = antennaItems[c];
  const x = START_X + c * 136.6;
  extractItem(`antenna_${id}`, x, 3695, 132, 95);
}

// 5. GOAL FX (2 rows)
// Header at ~3860, Row 1 at ~3920, Row 2 at ~4070
const goalRows = [
  {
    y: 3915,
    items: [
      'donutstorm', 'fireworksbarrage', 'confetticannon', 'balloonpop', 'meteorshower', 'beachparty',
      'turtletide', 'snowblind', 'hellfirerift', 'duelingdragons', 'gravitybomb', 'atomizer',
      'butterflybloom', 'poof', 'voxelstorm', 'kaleidoscope', 'overgrowth', 'electroshock'
    ]
  },
  {
    y: 4065,
    items: [
      'nitrocircus', 'subzero', 'partytime', 'halorings', 'bubblepop', 'duckstorm',
      'clockwork', 'skullrain'
    ]
  }
];

console.log('Extracting goal celebrations...');
for (const row of goalRows) {
  for (let c = 0; c < row.items.length; c++) {
    const id = row.items[c];
    const x = START_X + c * 136.6;
    extractItem(`celeb_${id}`, x, row.y, 132, 95);
  }
}

console.log('All icons extracted successfully!');

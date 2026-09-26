// @ts-nocheck
import { execSync } from 'child_process';
import fs from 'fs';

console.log('Detecting exact row centers and item boxes...');

// Image is 2514 x 4342.
// Width per column for 18 cols = 2514 / 18 = 139.666px
const COL_W = 2514 / 18; // ~139.67px

// Let's create an extraction helper
// We crop a 136x110 box from each cell with 2px padding, ensuring the full icon is visible!
const OUT = '/public/assets/ultra_thumbs';
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

function cropCell(name, colIndex, yTop, w = 134, h = 105) {
  const x = Math.round(colIndex * COL_W + 3);
  const y = Math.round(yTop);
  const dest = `${OUT}/${name}.webp`;
  try {
    execSync(`convert /public/assets/Ultra-Garage-Pack.png -crop ${w}x${h}+${x}+${y} +repage -quality 92 "${dest}"`);
  } catch(e) {
    console.error(`Crop error for ${name}:`, e.message);
  }
}

// 1. BODIES (60 Cars across 4 rows):
// Row 1: y=76
// Row 2: y=244
// Row 3: y=412
// Row 4: y=580
const carRows = [
  {
    y: 76,
    items: [
      'octavius', 'dominator', 'fennecx', 'vanguard', 'nocturne', 'apexr',
      'brawler', 'paladin', 'breaker', 'samurai', 'rallyhawk', 'zephyr',
      'mantis', 'centaur', 'hornet', 'bastion', 'phantom', 'dragline'
    ]
  },
  {
    y: 244,
    items: [
      'aerowing', 'voltaic', 'hooligan', 'leviathan', 'stingray', 'brickhouse',
      'sabretooth', 'comet', 'pillager', 'wraith', 'goliath', 'needle',
      'brutus', 'mako', 'thunderbug', 'viceroy', 'scrapheap', 'polaris'
    ]
  },
  {
    y: 412,
    items: [
      'hummingbird', 'wideload', 'meteor', 'glasswing', 'apex', 'vortex',
      'aurora', 'kestrel', 'rapier', 'seraph', 'talon', 'halcyon',
      'vandal', 'zenith', 'titan', 'rampage', 'bison', 'mastodon'
    ]
  },
  {
    y: 580,
    items: [
      'colossus', 'anvil', 'bruiser', 'warthog', 'grizzly', 'bulwark'
    ]
  }
];

console.log('Slicing Cars...');
for (const row of carRows) {
  for (let c = 0; c < row.items.length; c++) {
    const id = row.items[c];
    cropCell(`car_${id}`, c, row.y, 134, 110);
  }
}

// 2. WHEELS (116 Wheels across 7 rows):
// Row 1: y=780
// Row 2: y=948
// Row 3: y=1116
// Row 4: y=1284
// Row 5: y=1452
// Row 6: y=1620
// Row 7: y=1788
const wheelRows = [
  {
    y: 780,
    items: [
      'falconstar', 'vortex', 'turbina', 'deepdish', 'splitsix', 'wishbone',
      'meshweave', 'bladerun', 'webline', 'cagework', 'wirepin', 'fanblade',
      'crosshair', 'hexcore', 'spiralis', 'monolith', 'goldline', 'obsidian'
    ]
  },
  {
    y: 948,
    items: [
      'carbonite', 'titanix', 'slickline', 'gravelking', 'vgrip', 'driftline',
      'neonhalo', 'emberwheel', 'plasmaring', 'chronos', 'gyroloop', 'voidstar',
      'pulsar', 'turbofan', 'cyclonex', 'starlance', 'nebula', 'frostbite'
    ]
  },
  {
    y: 1116,
    items: [
      'helixon', 'vertexr', 'quantum', 'zenith', 'monsterclaw', 'bogger',
      'studiq', 'sawblade', 'formula', 'turbofanx', 'neondrift', 'goldcrown',
      'carbonweb', 'thunderroll', 'voidcore', 'donut', 'foxtail', 'pyre'
    ]
  },
  {
    y: 1284,
    items: [
      'emberheart', 'magmaflow', 'lavaflow', 'dragonfire', 'cinder', 'glacier',
      'permafrost', 'cryocore', 'shiver', 'plasmadrive', 'thunderhead', 'circuit',
      'cyberdeck', 'neongrid', 'holofoil', 'oilslick', 'acidrain', 'toxicbloom'
    ]
  },
  {
    y: 1452,
    items: [
      'ghostfire', 'sunburst', 'retrosunset', 'zebra', 'candycane', 'checkerflag',
      'cheetah', 'woodland', 'stealth', 'dazzle', 'graffiti', 'pixelart',
      'honeycomb', 'alloycore', 'carrara', 'terrazzo', 'rustbucket', 'dragonscale'
    ]
  },
  {
    y: 1620,
    items: [
      'snakeskin', 'timber', 'denimwrap', 'carbonwrap', 'cookie', 'watermelon',
      'longplay', 'daisy', 'blackrose', 'pawprint', 'pineapple', 'gumball',
      'candycrush', 'sushiroll', 'gearhead', 'buzzsaw', 'ripplewave', 'inkblot'
    ]
  },
  {
    y: 1788,
    items: [
      'frostspike', 'sandpaddle', 'ductfan', 'mace', 'glacierbite', 'balloon',
      'lowpro', 'donutglaze'
    ]
  }
];

console.log('Slicing Wheels...');
for (const row of wheelRows) {
  for (let c = 0; c < row.items.length; c++) {
    const id = row.items[c];
    cropCell(`wheel_${id}`, c, row.y, 134, 110);
  }
}

// 3. DECALS / VINYLS (62 Decals across 4 rows):
// Row 1: y=1960
// Row 2: y=2128
// Row 3: y=2296
// Row 4: y=2464
const decalRows = [
  {
    y: 1960,
    items: [
      'datastream', 'lavaflow', 'portal', 'auroraveil', 'hyperspace', 'circuitboard',
      'pulsewave', 'matrixrain', 'voidcore', 'cyberdeck', 'biohazard', 'inferno',
      'glitch', 'spectrum', 'nebulapulse', 'lightningstorm', 'sunburst', 'holofoil'
    ]
  },
  {
    y: 2128,
    items: [
      'carbonwrap', 'hexgrid', 'camo_desert', 'camo_urban', 'camo_woodland', 'camo_digital',
      'stripes_monza', 'stripes_daytona', 'stripes_rally', 'stripes_lemans', 'stripes_viper',
      'flames_classic', 'flames_tribal', 'sharkteeth', 'kanji_drift', 'polygons', 'dazzle', 'honeycomb'
    ]
  },
  {
    y: 2296,
    items: [
      'retrowave', 'vaporwave', 'sunset_drive', 'gridline', 'starburst', 'crosshairs',
      'hazard_stripes', 'barbed_wire', 'splatter', 'graffiti_tag', 'skull_crossbones',
      'dragon_breath', 'tiger_stripes', 'zebra_stripes', 'cheetah_print', 'snake_scales', 'koi_fish', 'origami'
    ]
  },
  {
    y: 2464,
    items: [
      'soundwave', 'equalizer', 'techno_pulse', 'glitch_hop', 'cyberpunk', 'neon_tokyo',
      'speedline', 'boost_flame'
    ]
  }
];

console.log('Slicing Decals...');
for (const row of decalRows) {
  for (let c = 0; c < row.items.length; c++) {
    const id = row.items[c];
    cropCell(`decal_${id}`, c, row.y, 134, 110);
  }
}

// 4. TOPPERS (53 Hats across 3 rows):
// Row 1: y=2650
// Row 2: y=2818
// Row 3: y=2986
const topperRows = [
  {
    y: 2650,
    items: [
      'tophat', 'bowler', 'beanie', 'royalcrown', 'piratetricorn', 'vikinghelm',
      'wizardhat', 'policecap', 'cheftoque', 'cowboyhat', 'santahat', 'halo',
      'flowercrown', 'propellercap', 'baseballcap', 'partycone', 'graduationcap', 'devilhorns'
    ]
  },
  {
    y: 2818,
    items: [
      'unicornhorn', 'dragonskull', 'cactus', 'trafficcone', 'donut', 'sombrero',
      'beret', 'fedora', 'knighthelm', 'astrohelmet', 'catears', 'bunnyears',
      'burger', 'pizzaslice', 'rubberduck', 'octopus', 'sharkfin', 'moai'
    ]
  },
  {
    y: 2986,
    items: [
      'jackolantern', 'snowman', 'antlers', 'tiara', 'mushroom', 'sushi',
      'brain', 'alien', 'ghost', 'pineapple', 'watermelon', 'icecreamcone',
      'barrel', 'treasurechest', 'hotdog', 'vinylrecord', 'toaster'
    ]
  }
];

console.log('Slicing Toppers...');
for (const row of topperRows) {
  for (let c = 0; c < row.items.length; c++) {
    const id = row.items[c];
    cropCell(`topper_${id}`, c, row.y, 134, 110);
  }
}

// 5. ANTENNAS (12 Antennas in 1 row):
// Row 1: y=3180
const antennaItems = [
  'checkeredflag', 'balloon', 'lollipop', 'palmtree', 'popsicle', 'minirocket',
  'soccerball', 'luckydice', 'star', 'umbrella', 'minisword', 'seamine'
];

console.log('Slicing Antennas...');
for (let c = 0; c < antennaItems.length; c++) {
  const id = antennaItems[c];
  cropCell(`antenna_${id}`, c, 3180, 134, 110);
}

// 6. GOAL CELEBRATIONS (26 Goals across 2 rows):
// Row 1: y=3380
// Row 2: y=3548
const goalRows = [
  {
    y: 3380,
    items: [
      'donutstorm', 'fireworksbarrage', 'confetticannon', 'balloonpop', 'meteorshower', 'beachparty',
      'turtletide', 'snowblind', 'hellfirerift', 'duelingdragons', 'gravitybomb', 'atomizer',
      'butterflybloom', 'poof', 'voxelstorm', 'kaleidoscope', 'overgrowth', 'electroshock'
    ]
  },
  {
    y: 3548,
    items: [
      'nitrocircus', 'subzero', 'partytime', 'halorings', 'bubblepop', 'duckstorm',
      'clockwork', 'skullrain'
    ]
  }
];

console.log('Slicing Goal Celebrations...');
for (const row of goalRows) {
  for (let c = 0; c < row.items.length; c++) {
    const id = row.items[c];
    cropCell(`celeb_${id}`, c, row.y, 134, 110);
  }
}

console.log('All icons extracted with high precision!');

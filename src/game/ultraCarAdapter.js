// @ts-nocheck
import ULTRA_LIB from '../../garage ultra/Ultra-Library.js';
import { CAR_WHEEL_DEFS } from "./config.js";

// Cache for built Ultra car meshes to ensure 60fps and instant selection
const _ultraMeshCache = new Map();
const _ultraWheelCache = new Map();
const _ultraTopperCache = new Map();
const _ultraAntennaCache = new Map();

/**
 * Safely clears all Ultra WebGL mesh caches and deletes GPU VAOs when rebuild is requested.
 */
export function clearUltraMeshCache(gl) {
  if (gl) {
    const deleteKit = (kit) => {
      if (!kit) return;
      ['body', 'accent', 'glass', 'lights', 'headlights', 'taillights', 'thruster', 'trim', 'wheel', 'hub'].forEach(k => {
        if (kit[k] && kit[k].vao) {
          try { gl.deleteVertexArray(kit[k].vao); } catch (e) {}
        }
      });
      if (kit.fenders && Array.isArray(kit.fenders)) {
        kit.fenders.forEach(f => {
          if (f && f.body && f.body.vao) {
            try { gl.deleteVertexArray(f.body.vao); } catch (e) {}
          }
        });
      }
      if (kit.parts && Array.isArray(kit.parts)) {
        kit.parts.forEach(p => {
          if (p && p.mesh && p.mesh.vao) {
            try { gl.deleteVertexArray(p.mesh.vao); } catch (e) {}
          }
        });
      }
      if (kit.mastParts && Array.isArray(kit.mastParts)) {
        kit.mastParts.forEach(p => {
          if (p && p.mesh && p.mesh.vao) {
            try { gl.deleteVertexArray(p.mesh.vao); } catch (e) {}
          }
        });
      }
      if (kit.payloadParts && Array.isArray(kit.payloadParts)) {
        kit.payloadParts.forEach(p => {
          if (p && p.mesh && p.mesh.vao) {
            try { gl.deleteVertexArray(p.mesh.vao); } catch (e) {}
          }
        });
      }
    };

    for (const [, v] of _ultraMeshCache) deleteKit(v);
    for (const [, v] of _ultraWheelCache) deleteKit(v);
    for (const [, v] of _ultraTopperCache) deleteKit(v);
    for (const [, v] of _ultraAntennaCache) deleteKit(v);
  }
  _ultraMeshCache.clear();
  _ultraWheelCache.clear();
  _ultraTopperCache.clear();
  _ultraAntennaCache.clear();
}

export const FA_TOPPER_NAMES = {
  tophat: "کلاه سیلندری رسمی",
  bowler: "کلاه لبه‌دار انگلیسی",
  beanie: "کلاه بافتنی زمستانی",
  crown: "تاج سلطنتی طلایی",
  pirate: "کلاه سه‌گوش دزدان دریایی",
  viking: "کلاهخود وایکینگ شاخ‌دار",
  wizard: "کلاه جادوگر",
  police: "کلاه افسر پلیس",
  chef: "کلاه سرآشپز",
  cowboy: "کلاه کابوی وسترن",
  santa: "کلاه بابانوئل",
  halo: "هاله نورانی فرشته",
  flowers: "تاج گل بهاری",
  propeller: "کلاه پروانه‌ای چرخان",
  baseball: "کلاه کپ بیسبال",
  party: "مخروط جشن تولد",
  grad: "کلاه فارغ‌التحصیلی",
  devil: "شاخ‌های اهریمنی",
  unicorn: "شاخ تک‌شاخ جادویی",
  dragon: "جمجمه اسکلتی اژدها",
  cactus: "کاکتوس صحرایی",
  traffic: "مخروط هشدار ترافیکی",
  donut: "دونات توت‌فرنگی",
  sombrero: "سامبررو مکزیکی",
  beret: "کلاه بره هنری",
  fedora: "کلاه فدورا کارآگاهی",
  knight: "کلاهخود شوالیه فولادی",
  astro: "کلاه‌خود فضانوردی",
  catears: "گوش‌های گربه نئونی",
  bunny: "گوش‌های خرگوش",
  burger: "همبرگر دوبل پنیر",
  pizza: "اسلایس پیتزا پپرونی",
  duck: "اردک پلاستیکی زرد",
  octopus: "اختاپوس دریایی",
  sharkfin: "باله کوسه شکاری",
  moai: "مجسمه باستانی موآی",
  pumpkin: "کدو تنبل هالووین",
  snowman: "آدم‌برفی زمستانی",
  antlers: "شاخ‌های گوزن شمالی",
  tiara: "نیم‌تاج الماسی",
  mushroom: "قارچ جادویی جنگلی",
  sushi: "سوشی سالمون ژاپنی",
  brain: "مغز متفکر درخشان",
  alien: "سر موجود فضایی",
  ghost: "روح سرگردان شبح‌وار",
  pineapple: "آناناس استوایی",
  watermelon: "قاچ هندوانه تابستانی",
  icecream: "بستنی قیفی خوشمزه",
  barrel: "بشکه بلوط دزدان دریایی",
  treasure: "صندوقچه گنج طلا",
  hotdog: "ساندویچ هات‌داگ",
  record: "صفحه گرامافون وینیل",
  toaster: "توستر کرومی براق"
};

export const FA_ANTENNA_NAMES = {
  a_flag: "پرچم شطرنجی خط پایان",
  a_balloon: "بادکنک رنگی معلق",
  a_lollipop: "آب‌نبات چوبی رنگین‌کمانی",
  a_palm: "درخت نخل استوایی",
  a_popsicle: "بستنی یخی میوه‌ای",
  a_rocket: "راکت مینیاتوری فضایی",
  a_soccer: "توپ فوتبال چرمی",
  a_dice: "تاس شانس خوش‌یمن",
  a_star: "ستاره طلایی درخشان",
  a_umbrella: "چتر ساحلی تابستانی",
  a_sword: "شمشیر فولادی شوالیه",
  a_mine: "مین دریایی انفجاری"
};

export function parseSlotColor(slot) {
  if (!slot) return [0.85, 0.85, 0.85];
  if (slot.includes('#')) {
    const hex = slot.split('#')[1];
    const s = hex.length === 3 ? hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] : hex;
    const n = parseInt(s, 16);
    if (!isNaN(n)) {
      return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
    }
  }
  const map = {
    gold: [0.95, 0.82, 0.22],
    silver: [0.85, 0.88, 0.92],
    chrome: [0.92, 0.94, 0.96],
    rubber: [0.12, 0.12, 0.14],
    fwhite: [0.96, 0.96, 0.96],
    fblack: [0.10, 0.10, 0.12],
    carbon: [0.15, 0.15, 0.18],
    wood: [0.55, 0.35, 0.18],
    copper: [0.85, 0.55, 0.35],
    bronze: [0.80, 0.50, 0.25],
    brass: [0.85, 0.72, 0.32],
    red: [0.85, 0.18, 0.18],
    blue: [0.18, 0.55, 0.95],
    green: [0.18, 0.80, 0.35],
    yellow: [0.95, 0.85, 0.18],
    orange: [0.95, 0.50, 0.12],
    purple: [0.65, 0.25, 0.85],
    pink: [0.95, 0.40, 0.65],
    cyan: [0.15, 0.85, 0.92]
  };
  return map[slot.toLowerCase()] || [0.85, 0.85, 0.85];
}

/**
 * Checks whether a given model ID belongs to the Ultra car collection.
 */
export function isUltraCar(id) {
  if (!id) return false;
  const lower = String(id).toLowerCase();
  return !!(ULTRA_LIB.findCar(id) || ULTRA_LIB.findCar(lower));
}

/**
 * Retrieves the Ultra car specification.
 */
export function findUltraCar(id) {
  if (!id) return null;
  const lower = String(id).toLowerCase();
  return ULTRA_LIB.findCar(id) || ULTRA_LIB.findCar(lower) || null;
}

/**
 * Returns formatted catalog of all Ultra car models with categorization.
 */
export function getUltraCars() {
  const all = ULTRA_LIB.cars || [];
  return all.map((car, idx) => {
    let category = 'handmade';
    let categoryName = 'تیپ‌های دست‌ساز';
    let icon = 'sparkles';

    if (car.f1 || car.exposedWheels) {
      category = 'formula';
      categoryName = 'فرمول یک (F1)';
      icon = 'gauge';
    } else if (car.bed || car.bar || car.cls === 'Monster' || car.cls === 'Heavy' || car.cls === 'Semi' || car.cls === 'Pickup' || car.cls === 'Armoured') {
      category = 'monster';
      categoryName = 'سنگین و مانستر تراک';
      icon = 'shield';
    } else if (car.cls === 'Hyper' || car.cls === 'Exotic' || car.cls === 'Speedster' || car.cls === 'Proto' || car.cls === 'Stealth') {
      category = 'hyper';
      categoryName = 'سوپراسپرت و هایپر';
      icon = 'zap';
    }

    return {
      id: car.id,
      name: car.name,
      cls: car.cls || (car.f1 ? 'Formula' : 'Ultra'),
      tagline: car.tagline || 'مدل اختصاصی اولترا با آیرودینامیک پیشرفته',
      category,
      categoryName,
      icon,
      track: (car.wheel && car.wheel.x) ? (car.wheel.x * 2).toFixed(2) : '1.20',
      wheelbase: (car.wheel && car.wheel.zf && car.wheel.zr) ? (car.wheel.zf - car.wheel.zr).toFixed(2) : '1.60',
      wing: car.wing ? (typeof car.wing === 'object' ? car.wing.type : car.wing) : 'Standard',
      exhaust: car.exhaust ? `${car.exhaust.count || 2}x ${car.exhaust.style || 'twin'}` : 'Dual Aero',
      spec: car,
    };
  });
}

/**
 * Converts procedural mesh vertices into WebGL builder format with scale.
 */
function meshToBuilder(mesh, scale, out) {
  if (!out) out = { v: [], i: [], n: 0 };
  if (!mesh || !mesh.count || !mesh.idx || !mesh.idx.length) return out;
  const offset = out.n;
  const p = mesh.p || [];
  const n = mesh.n || [];
  const t = mesh.t || [];
  for (let k = 0; k < mesh.count; k++) {
    const px = (p[k * 3] !== undefined ? p[k * 3] : 0) * scale;
    const py = (p[k * 3 + 1] !== undefined ? p[k * 3 + 1] : 0) * scale;
    const pz = (p[k * 3 + 2] !== undefined ? p[k * 3 + 2] : 0) * scale;
    const nx = (n[k * 3] !== undefined ? n[k * 3] : 0);
    const ny = (n[k * 3 + 1] !== undefined ? n[k * 3 + 1] : 0);
    const nz = (n[k * 3 + 2] !== undefined ? n[k * 3 + 2] : 0);
    const tu = (t[k * 2] !== undefined ? t[k * 2] : 0);
    const tv = (t[k * 2 + 1] !== undefined ? t[k * 2 + 1] : 0);
    out.v.push(px, py, pz, nx, ny, nz, tu, tv);
  }
  for (let j = 0; j < mesh.idx.length; j++) {
    out.i.push(mesh.idx[j] + offset);
  }
  out.n += mesh.count;
  return out;
}

/**
 * Builds the complete WebGL mesh set for an Ultra car model.
 * Scales the 2.5m authoring frame by 0.52 to precisely match the in-game
 * vehicle scale, hitbox and 0.415m wheel attachment points.
 */
export function buildUltraCarMesh(R, modelId) {
  if (!R || !modelId) return null;
  const lower = String(modelId).toLowerCase();

  if (_ultraMeshCache.has(lower)) {
    return _ultraMeshCache.get(lower);
  }

  const car = findUltraCar(modelId);
  if (!car) return null;

  try {
    const res = ULTRA_LIB.buildBody(car, 'high');
    if (!res || !res.parts) return null;

    const P = res.parts;
    const SCALE = 0.52; // Exact proportional scale matching in-game wheelbase (0.415)

    function safeMesh(builder) {
      if (!builder || builder.n === 0 || !builder.i.length) {
        return { vao: null, count: 0, type: 5123 };
      }
      return R.mesh(builder);
    }

    // 1. Primary body paint
    const bodyB = meshToBuilder(P.get('paint'), SCALE);

    // 2. Accents and mechanical details
    const accentB = { v: [], i: [], n: 0 };
    ['dark', 'carbon', 'rubber', 'interior', 'seam', 'accent', 'mesh'].forEach(s => {
      meshToBuilder(P.get(s), SCALE, accentB);
    });

    // 3. Canopy & Glass
    const glassB = meshToBuilder(P.get('glass'), SCALE);

    // 4. Headlights
    const headB = meshToBuilder(P.get('head'), SCALE);

    // 5. Taillights
    const tailB = meshToBuilder(P.get('tail'), SCALE);

    // 6. Chrome trim & Badges
    const trimB = meshToBuilder(P.get('chrome'), SCALE);

    // 7. Thruster & Afterburner Glow
    const thrusterB = meshToBuilder(P.get('glow'), SCALE);

    const st = res.stations;
    const noseZ = st && st.length ? st[st.length - 1][0] * SCALE : 0.6;
    const tailZ = st && st.length ? st[0][0] * SCALE : -0.6;

    const wheelMounts = {
      x: (car.wheel && car.wheel.x !== undefined) ? car.wheel.x * SCALE : 0.33,
      zf: (car.wheel && car.wheel.zf !== undefined) ? car.wheel.zf * SCALE : 0.416,
      zr: (car.wheel && car.wheel.zr !== undefined) ? car.wheel.zr * SCALE : -0.405,
      y: (car.wheel && car.wheel.y !== undefined) ? car.wheel.y * SCALE : -0.096,
      r: (car.wheel && car.wheel.r !== undefined) ? car.wheel.r * SCALE : 0.16
    };

    const modelKit = {
      id: car.id,
      name: car.name,
      sub: car.cls || 'Ultra',
      body: safeMesh(bodyB),
      accent: safeMesh(accentB),
      glass: safeMesh(glassB),
      lights: safeMesh(headB.n > 0 ? headB : thrusterB),
      headlights: safeMesh(headB),
      taillights: safeMesh(tailB),
      thruster: safeMesh(thrusterB),
      trim: safeMesh(trimB),
      archX: wheelMounts.x,
      wheelMounts: wheelMounts,
      frontZ: noseZ,
      rearZ: tailZ,
      isUltra: true,
      spec: car
    };

    _ultraMeshCache.set(lower, modelKit);
    // Also cache under exact id if different case
    if (car.id !== lower) {
      _ultraMeshCache.set(car.id, modelKit);
    }

    return modelKit;
  } catch (e) {
    console.error(`Failed to build Ultra car mesh for '${modelId}':`, e);
    return null;
  }
}

/**
 * Returns list of all Ultra toppers (hats).
 */
export function getUltraToppers() {
  const all = (ULTRA_LIB && ULTRA_LIB.toppers) || [];
  return all.map(t => ({
    id: t.id,
    name: t.name,
    faName: FA_TOPPER_NAMES[t.id] || t.name,
    grade: t.grade || 'rare',
    tags: t.tags || [],
    spec: t
  }));
}

/**
 * Checks if a cosmetic ID belongs to Ultra toppers.
 */
export function isUltraTopper(id) {
  if (!id || id === 'none') return false;
  const lower = String(id).toLowerCase();
  return !!(ULTRA_LIB && ULTRA_LIB.toppers && ULTRA_LIB.toppers.some(t => t.id.toLowerCase() === lower));
}

/**
 * Cantilever deflection curve for whip antenna.
 * Foot is clamped (slope and displacement = 0), tip deflects.
 */
export function cantilever(s) {
  if (s <= 0) return 0;
  if (s >= 1) return 1;
  return (3 * s * s - s * s * s) * 0.5;
}

const _mountsCache = new Map();

/**
 * Returns exact roof topper mount and antenna mount coordinates for any car model.
 * Ultra cars use procedural body metadata analysis from Ultra-Library (topperMount & antennaMount).
 * Built-in cars have customized anchor coordinates matched to their roof and rear deck.
 */
export function getCarAccessoriesMounts(modelId) {
  if (!modelId) modelId = 'OCTANE';
  const lower = String(modelId).toLowerCase();
  if (_mountsCache.has(lower)) {
    return _mountsCache.get(lower);
  }

  const SCALE = 0.52;
  const car = findUltraCar(modelId);
  if (car) {
    try {
      const built = ULTRA_LIB.buildBody(car, 'high');
      const tm = ULTRA_LIB.topperMount(built);
      const am = ULTRA_LIB.antennaMount(built);

      let topperY = tm && Number.isFinite(tm.y) ? tm.y : 0.65;
      let topperZ = tm && Number.isFinite(tm.z) ? tm.z : 0;
      let topperX = tm && Number.isFinite(tm.x) ? tm.x : 0;

      // Scan actual 3D body parts around topper location to sit on top of airboxes, cockpits or roofracks
      if (built && built.parts) {
        let maxPartY = -Infinity;
        const r2 = 0.22 * 0.22;
        for (const [, mesh] of built.parts.entries()) {
          const p = mesh.p;
          if (!p) continue;
          for (let k = 0; k < mesh.count; k++) {
            const dx = p[k * 3] - topperX;
            const dz = p[k * 3 + 2] - topperZ;
            if (dx * dx + dz * dz <= r2) {
              const py = p[k * 3 + 1];
              if (py > maxPartY) maxPartY = py;
            }
          }
        }
        if (Number.isFinite(maxPartY) && maxPartY > topperY) {
          topperY = maxPartY;
        }
      }

      let antennaX = am && Number.isFinite(am.x) ? am.x : -0.32;
      let antennaY = am && Number.isFinite(am.y) ? am.y : 0.60;
      let antennaZ = am && Number.isFinite(am.z) ? am.z : -0.20;

      // Scan actual 3D body parts around antenna mount point to seat firmly on the surface
      if (built && built.parts) {
        let maxAntPartY = -Infinity;
        const r2 = 0.14 * 0.14;
        for (const [, mesh] of built.parts.entries()) {
          const p = mesh.p;
          if (!p) continue;
          for (let k = 0; k < mesh.count; k++) {
            const dx = p[k * 3] - antennaX;
            const dz = p[k * 3 + 2] - antennaZ;
            if (dx * dx + dz * dz <= r2) {
              const py = p[k * 3 + 1];
              if (py > maxAntPartY) maxAntPartY = py;
            }
          }
        }
        if (Number.isFinite(maxAntPartY) && maxAntPartY > antennaY) {
          antennaY = maxAntPartY;
        }
      }

      const mounts = {
        topper: {
          x: topperX * SCALE,
          y: topperY * SCALE,
          z: topperZ * SCALE,
          scale: 1
        },
        antenna: {
          x: antennaX * SCALE,
          y: antennaY * SCALE,
          z: antennaZ * SCALE,
          scale: 1.32
        }
      };
      _mountsCache.set(lower, mounts);
      return mounts;
    } catch (e) {
      console.warn("Failed to compute mounts for Ultra car:", modelId, e);
    }
  }

  // Built-in models curated attachment points
  const BUILTIN_MOUNTS = {
    octane:   { topper: { x: 0, y: 0.35, z: 0.04 }, antenna: { x: -0.26, y: 0.32, z: -0.18 } },
    dominus:  { topper: { x: 0, y: 0.28, z: -0.08 }, antenna: { x: -0.24, y: 0.26, z: -0.30 } },
    breakout: { topper: { x: 0, y: 0.27, z: 0.00 }, antenna: { x: -0.24, y: 0.25, z: -0.28 } },
    paladin:  { topper: { x: 0, y: 0.26, z: -0.05 }, antenna: { x: -0.22, y: 0.25, z: -0.28 } },
    merc:     { topper: { x: 0, y: 0.44, z: 0.00 }, antenna: { x: -0.28, y: 0.42, z: -0.25 } },
    takumi:   { topper: { x: 0, y: 0.31, z: -0.02 }, antenna: { x: -0.25, y: 0.29, z: -0.24 } },
    vortex:   { topper: { x: 0, y: 0.32, z: 0.02 }, antenna: { x: -0.25, y: 0.30, z: -0.22 } },
    striker:  { topper: { x: 0, y: 0.30, z: 0.00 }, antenna: { x: -0.24, y: 0.28, z: -0.25 } },
    titan:    { topper: { x: 0, y: 0.40, z: 0.02 }, antenna: { x: -0.28, y: 0.38, z: -0.26 } },
    monster:  { topper: { x: 0, y: 0.46, z: -0.04 }, antenna: { x: -0.30, y: 0.44, z: -0.28 } },
    hyper:    { topper: { x: 0, y: 0.26, z: -0.06 }, antenna: { x: -0.22, y: 0.25, z: -0.28 } }
  };

  const fallback = BUILTIN_MOUNTS[lower] || {
    topper: { x: 0, y: 0.32, z: 0.02 },
    antenna: { x: -0.25, y: 0.30, z: -0.25 }
  };
  _mountsCache.set(lower, fallback);
  return fallback;
}

/**
 * Updates physical spring sway state for an antenna.
 */
export function stepAntennaSway(car, dt, loadX, loadZ) {
  if (!car) return { x: 0, z: 0, vx: 0, vz: 0 };
  if (!car._antennaSway) {
    car._antennaSway = (ULTRA_LIB && ULTRA_LIB.makeSway) ? ULTRA_LIB.makeSway() : { x: 0, z: 0, vx: 0, vz: 0 };
  }
  if (ULTRA_LIB && ULTRA_LIB.stepSway) {
    ULTRA_LIB.stepSway(car._antennaSway, dt, loadX, loadZ);
  }
  return car._antennaSway;
}

/**
 * Builds 3D multi-part meshes for an Ultra topper.
 * Scaled and authored in local model coordinates (base at y=0).
 * Positioned on the vehicle at each specific vehicle's roof anchor point.
 */
export function buildUltraTopperMesh(R, topperId) {
  if (!R || !topperId || topperId === 'none') return null;
  const lower = String(topperId).toLowerCase();
  const cacheKey = 'top_' + lower;
  if (_ultraMeshCache.has(cacheKey)) return _ultraMeshCache.get(cacheKey);

  const t = ULTRA_LIB.toppers && ULTRA_LIB.toppers.find(x => x.id.toLowerCase() === lower);
  if (!t) return null;

  try {
    const built = ULTRA_LIB.buildTopper(t, 'high');
    if (!built || !built.m) return null;

    const SCALE = 0.52;
    const parts = [];
    for (const [slot, mesh] of built.m.entries()) {
      if (!mesh || !mesh.count || !mesh.idx || !mesh.idx.length) continue;
      const b = { v: [], i: [], n: 0 };
      for (let k = 0; k < mesh.count; k++) {
        // Authored with base at y = 0 for accurate dynamic car mounting
        const px = (mesh.p[k * 3] || 0) * SCALE;
        const py = (mesh.p[k * 3 + 1] || 0) * SCALE;
        const pz = (mesh.p[k * 3 + 2] || 0) * SCALE;
        const nx = mesh.n[k * 3] || 0;
        const ny = mesh.n[k * 3 + 1] || 1;
        const nz = mesh.n[k * 3 + 2] || 0;
        const tu = mesh.t[k * 2] || 0;
        const tv = mesh.t[k * 2 + 1] || 0;
        b.v.push(px, py, pz, nx, ny, nz, tu, tv);
      }
      for (let j = 0; j < mesh.idx.length; j++) {
        b.i.push(mesh.idx[j]);
      }
      b.n = mesh.count;

      const col = parseSlotColor(slot);
      const isGlow = slot.includes('glow') || slot.includes('star');
      const isMetal = slot.includes('silver') || slot.includes('gold') || slot.includes('chrome');

      parts.push({
        slot,
        mesh: R.mesh(b),
        opts: {
          color: col,
          emissive: isGlow ? [col[0] * 0.9, col[1] * 0.9, col[2] * 0.9] : [0.08, 0.08, 0.08],
          spec: isMetal ? 0.95 : 0.80,
          clearcoat: 0.85,
          metallic: isMetal ? 0.85 : 0.1
        }
      });
    }

    const item = { id: t.id, name: t.name, parts, isUltraTopper: true };
    _ultraMeshCache.set(cacheKey, item);
    return item;
  } catch (e) {
    console.error(`Failed to build Ultra topper '${topperId}':`, e);
    return null;
  }
}

/**
 * Returns list of all Ultra antennas.
 */
export function getUltraAntennas() {
  const all = (ULTRA_LIB && ULTRA_LIB.antennas) || [];
  return all.map(a => ({
    id: a.id,
    name: a.name,
    faName: FA_ANTENNA_NAMES[a.id] || a.name,
    grade: a.grade || 'rare',
    tags: a.tags || [],
    spec: a
  }));
}

/**
 * Checks if a cosmetic ID belongs to Ultra antennas.
 */
export function isUltraAntenna(id) {
  if (!id || id === 'none') return false;
  const lower = String(id).toLowerCase();
  return !!(ULTRA_LIB && ULTRA_LIB.antennas && ULTRA_LIB.antennas.some(a => a.id.toLowerCase() === lower));
}

/**
 * Builds 3D multi-part dynamic rig for an Ultra antenna.
 * Splits antenna into:
 *   1. Mast (rubber boot clamped at roof + dynamic silver shaft that curves with cantilever bend)
 *   2. Payload (tip accessory: flag, rocket, dice, soccer, star, etc. which translates and tilts rigidly)
 */
export function buildUltraAntennaMesh(R, antennaId) {
  if (!R || !antennaId || antennaId === 'none') return null;
  const lower = String(antennaId).toLowerCase();
  const cacheKey = 'ant_' + lower;
  if (_ultraMeshCache.has(cacheKey)) return _ultraMeshCache.get(cacheKey);

  const a = ULTRA_LIB.antennas && ULTRA_LIB.antennas.find(x => x.id.toLowerCase() === lower);
  if (!a) return null;

  try {
    const rig = ULTRA_LIB.buildAntennaRig ? ULTRA_LIB.buildAntennaRig(a, 'high') : null;
    if (!rig || !rig.mast || !rig.payload) return null;

    const SCALE = 0.52;
    const base = rig.base || 0.038;
    const top = rig.top || 0.330;
    const L = Math.max(0.01, top - base);

    // 1. Build Mast Parts: rubber boot + dynamic silver shaft
    const mastParts = [];
    let shaftDynamic = null;

    for (const [slot, mesh] of rig.mast.m.entries()) {
      if (!mesh || !mesh.count || !mesh.idx || !mesh.idx.length) continue;
      const isShaft = slot.indexOf('silver') !== -1;
      const count = mesh.count;

      const restV = new Float32Array(count * 8);
      const dynamicV = new Float32Array(count * 8);
      const weights = new Float32Array(count);
      const indices = [];

      for (let k = 0; k < count; k++) {
        const ox = mesh.p[k * 3] || 0;
        const oy = mesh.p[k * 3 + 1] || 0;
        const oz = mesh.p[k * 3 + 2] || 0;

        const px = ox * SCALE;
        const py = oy * SCALE;
        const pz = oz * SCALE;

        const nx = mesh.n[k * 3] || 0;
        const ny = mesh.n[k * 3 + 1] || 1;
        const nz = mesh.n[k * 3 + 2] || 0;
        const tu = mesh.t[k * 2] || 0;
        const tv = mesh.t[k * 2 + 1] || 0;

        const i8 = k * 8;
        restV[i8]     = px; restV[i8 + 1] = py; restV[i8 + 2] = pz;
        restV[i8 + 3] = nx; restV[i8 + 4] = ny; restV[i8 + 5] = nz;
        restV[i8 + 6] = tu; restV[i8 + 7] = tv;

        dynamicV[i8]     = px; dynamicV[i8 + 1] = py; dynamicV[i8 + 2] = pz;
        dynamicV[i8 + 3] = nx; dynamicV[i8 + 4] = ny; dynamicV[i8 + 5] = nz;
        dynamicV[i8 + 6] = tu; dynamicV[i8 + 7] = tv;

        // Cantilever deflection weight
        const s = (oy - base) / L;
        weights[k] = cantilever(s);
      }

      for (let j = 0; j < mesh.idx.length; j++) {
        indices.push(mesh.idx[j]);
      }

      const builder = { v: Array.from(dynamicV), i: indices, n: count, dynamic: isShaft };
      const glMesh = R.mesh(builder);
      const col = parseSlotColor(slot);
      const isMetal = slot.includes('silver') || slot.includes('gold') || slot.includes('chrome');

      if (isShaft) {
        shaftDynamic = {
          glMesh,
          restV,
          dynamicV,
          weights,
          count
        };
      }

      mastParts.push({
        slot,
        mesh: glMesh,
        opts: {
          color: col,
          emissive: [0.06, 0.06, 0.08],
          spec: isMetal ? 0.98 : 0.40,
          clearcoat: isMetal ? 0.95 : 0.30,
          metallic: isMetal ? 0.95 : 0.1
        }
      });
    }

    // 2. Build Payload Parts (translated so pivot is at SHAFT_TOP)
    const payloadParts = [];
    for (const [slot, mesh] of rig.payload.m.entries()) {
      if (!mesh || !mesh.count || !mesh.idx || !mesh.idx.length) continue;
      const b = { v: [], i: [], n: 0 };
      for (let k = 0; k < mesh.count; k++) {
        const px = (mesh.p[k * 3] || 0) * SCALE;
        const py = ((mesh.p[k * 3 + 1] || 0) - top) * SCALE; // Origin centered at mast tip
        const pz = (mesh.p[k * 3 + 2] || 0) * SCALE;
        const nx = mesh.n[k * 3] || 0;
        const ny = mesh.n[k * 3 + 1] || 1;
        const nz = mesh.n[k * 3 + 2] || 0;
        const tu = mesh.t[k * 2] || 0;
        const tv = mesh.t[k * 2 + 1] || 0;
        b.v.push(px, py, pz, nx, ny, nz, tu, tv);
      }
      for (let j = 0; j < mesh.idx.length; j++) {
        b.i.push(mesh.idx[j]);
      }
      b.n = mesh.count;

      const col = parseSlotColor(slot);
      const isGlow = slot.includes('glow') || slot.includes('star');
      const isMetal = slot.includes('silver') || slot.includes('gold') || slot.includes('chrome');

      payloadParts.push({
        slot,
        mesh: R.mesh(b),
        opts: {
          color: col,
          emissive: isGlow ? [col[0] * 1.2, col[1] * 1.2, col[2] * 1.2] : [0.08, 0.08, 0.08],
          spec: isMetal ? 0.95 : 0.85,
          clearcoat: 0.90,
          metallic: isMetal ? 0.90 : 0.15
        }
      });
    }

    // Sway deformation callback: updates WebGL vertex buffer and computes payload tilt
    const updateSway = (gl, sway) => {
      const dx = (sway ? sway.x : 0) * SCALE;
      const dz = (sway ? sway.z : 0) * SCALE;

      if (shaftDynamic && gl && shaftDynamic.glMesh && shaftDynamic.glMesh.vb) {
        const s = shaftDynamic;
        const c = s.count;
        const dV = s.dynamicV;
        const rV = s.restV;
        const w = s.weights;

        for (let i = 0; i < c; i++) {
          const k = w[i];
          const i8 = i * 8;
          dV[i8]     = rV[i8]     + dx * k;
          dV[i8 + 1] = rV[i8 + 1];
          dV[i8 + 2] = rV[i8 + 2] + dz * k;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, s.glMesh.vb);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, dV);
      }

      // Tip lean angle (tangent slope is 1.5 D / L)
      const tipL = L * SCALE;
      const tiltX = Math.atan2(1.5 * dz, tipL);
      const tiltZ = -Math.atan2(1.5 * dx, tipL);

      return {
        tipOffset: [dx, top * SCALE, dz],
        tilt: [tiltX, 0, tiltZ]
      };
    };

    const item = {
      id: a.id,
      name: a.name,
      mastParts,
      payloadParts,
      updateSway,
      isUltraAntenna: true
    };
    _ultraMeshCache.set(cacheKey, item);
    return item;
  } catch (e) {
    console.error(`Failed to build Ultra antenna '${antennaId}':`, e);
    return null;
  }
}

/* =============================================================================
 * ULTRA WHEELS (116 WHEEL SETS: SPORTRIMS, RETRO, CONCEPT, OFFROAD, DONUTS, ETC.)
 * ============================================================================= */

export const FA_WHEEL_CATEGORIES = {
  sport: 'اسپرت و تیونینگ',
  super: 'سوپراسپرت و هایپر',
  concept: 'کانسپت و آینده‌نگرانه',
  offroad: 'آفرود و سنگین',
  fun: 'فانتزی و خوراکی',
  retro: 'کلاسیک و وینتیج'
};

export const FA_FINISH_NAMES = {
  // 1. CLASSIC & METALLIC AUTOMOTIVE FINISHES
  gloss: { name: 'براق صیقلی (Gloss)', desc: 'درخشش آینه‌ای با انعکاس نور عالی', rough: 0.22, metal: 0.05, clearcoat: 1.0, flakes: 0.0, category: 'paint' },
  satin: { name: 'ساتن ابریشمی (Satin)', desc: 'جلوه نیمه‌مات شیک و نرم', rough: 0.42, metal: 0.10, clearcoat: 0.55, flakes: 0.02, category: 'paint' },
  matte: { name: 'مات مخملی (Matte)', desc: 'بدون انعکاس، عمیق و یکدست', rough: 0.72, metal: 0.02, clearcoat: 0.12, flakes: 0.0, category: 'paint' },
  metallic: { name: 'متالیک اکلیلی (Metallic)', desc: 'ذرات ریز فلزی درخشنده در نور', rough: 0.30, metal: 0.55, clearcoat: 0.95, flakes: 0.55, category: 'paint' },
  pearlescent: { name: 'صدفی متغیر (Pearlescent)', desc: 'تغییر طیف رنگ از زوایای مختلف', rough: 0.24, metal: 0.35, clearcoat: 1.0, flakes: 0.38, category: 'paint' },
  candy: { name: 'آبنبات کریستالی (Candy)', desc: 'رنگ شفاف عمیق با ژرفای کریستالی', rough: 0.15, metal: 0.25, clearcoat: 1.0, flakes: 0.22, category: 'paint' },
  chrome: { name: 'کروم آینه‌ای (Chrome)', desc: 'بازتاب صددرصد فلزی نقره‌ای', rough: 0.06, metal: 1.0, clearcoat: 0.30, flakes: 0.0, category: 'metal' },
  brushed: { name: 'استیل خش‌دار (Brushed)', desc: 'خطوط تراش‌کاری شده فلزی صنعتی', rough: 0.34, metal: 1.0, clearcoat: 0.20, flakes: 0.0, category: 'metal' },
  anodized: { name: 'آنودایز الکتریکی (Anodized)', desc: 'پوشش مات فلزی آبکاری شده', rough: 0.28, metal: 0.85, clearcoat: 0.45, flakes: 0.10, category: 'metal' },
  hammered: { name: 'فلز چکش‌کاری شده (Hammered)', desc: 'فرو رفتگی‌های دست‌ساز فلزی عتیقه', rough: 0.38, metal: 0.95, clearcoat: 0.40, flakes: 0.0, category: 'metal' },
  rust: { name: 'زنگار و پتینه (Rust)', desc: 'خوردگی فلز با بافت زبر کهنه', rough: 0.88, metal: 0.40, clearcoat: 0.05, flakes: 0.0, category: 'metal' },

  // 2. COMPOSITES & TEXTILES
  carbon: { name: 'فیبر کربن بافت‌دار (Carbon)', desc: 'بافت سبک و مستحکم فیبر کربن کامپوزیت', rough: 0.30, metal: 0.30, clearcoat: 0.90, flakes: 0.0, category: 'composite' },
  carboncloth: { name: 'پارچه کربنی شطرنجی', desc: 'بافت پارچه‌ای متراکم الیاف کربن', rough: 0.45, metal: 0.25, clearcoat: 0.60, flakes: 0.0, category: 'composite' },
  leather: { name: 'چرم طبیعی دوخت‌دار (Leather)', desc: 'روکش چرم مرغوب با دانه‌بندی طبیعی', rough: 0.65, metal: 0.05, clearcoat: 0.30, flakes: 0.0, category: 'textile' },
  denim: { name: 'جین آبی (Denim)', desc: 'پارچه دنیم کتان با بافت زبر', rough: 0.85, metal: 0.0, clearcoat: 0.05, flakes: 0.0, category: 'textile' },
  velvet: { name: 'مخمل سلطنتی (Velvet)', desc: 'پرزهای نرم مخملی با بازتاب ابریشمی', rough: 0.90, metal: 0.10, clearcoat: 0.15, flakes: 0.0, category: 'textile' },
  fur: { name: 'خز طبیعی (Fur)', desc: 'الیاف متراکم پشمی گرم و حجیم', rough: 0.88, metal: 0.0, clearcoat: 0.05, flakes: 0.0, category: 'textile' },

  // 3. ORGANIC, MINERAL & EXOTIC SURFACES
  scale: { name: 'پولک خزندگان (Reptile)', desc: 'بافت زره‌ای پوست مار و سوسمار', rough: 0.48, metal: 0.15, clearcoat: 0.70, flakes: 0.10, category: 'exotic' },
  dragonscale: { name: 'پولک اژدها (Dragon Scale)', desc: 'فلس‌های درشت محافظ آتشین', rough: 0.35, metal: 0.50, clearcoat: 0.85, flakes: 0.40, category: 'exotic' },
  wood: { name: 'چوب گردو صیقلی (Wood)', desc: 'رگه‌های چوب طبیعی لاک‌خورده', rough: 0.45, metal: 0.05, clearcoat: 0.75, flakes: 0.0, category: 'exotic' },
  stone: { name: 'سنگ گرانیت و مرمر (Stone)', desc: 'بافت صخره‌ای محکم و رگه‌دار', rough: 0.65, metal: 0.10, clearcoat: 0.40, flakes: 0.0, category: 'exotic' },
  obsidian: { name: 'آبسیدین آتشفشانی (Obsidian)', desc: 'شیشه سیاه معدنی با لبه‌های تیز', rough: 0.12, metal: 0.70, clearcoat: 0.95, flakes: 0.0, category: 'exotic' },

  // 4. DYNAMIC & ELEMENTAL SHADERS
  glitter: { name: 'پولک درخشان (Glitter)', desc: 'پولک‌های پرزرق‌وبرق طلایی و رنگی', rough: 0.26, metal: 0.45, clearcoat: 1.0, flakes: 1.0, category: 'dynamic' },
  holographic: { name: 'هولوگرافیک رنگین‌کمانی', desc: 'طیف رنگین‌کمانی چشم‌نواز نئونی', rough: 0.18, metal: 0.60, clearcoat: 1.0, flakes: 0.45, category: 'dynamic' },
  plasma: { name: 'پلاسما نئونی (Plasma)', desc: 'تابش نئونی با هاله درخشان الکتریکی', rough: 0.20, metal: 0.10, clearcoat: 0.80, flakes: 0.15, isGlowing: true, category: 'dynamic' },
  lava: { name: 'سنگ مذاب ماگما (Lava)', desc: 'ترک‌های گداخته با مغز سرخ سوزان', rough: 0.55, metal: 0.20, clearcoat: 0.30, flakes: 0.0, isGlowing: true, category: 'dynamic' },
  ice: { name: 'یخ کریستالی قطبی (Ice)', desc: 'بلورهای منجمد شفاف با ژرفای نور آبی', rough: 0.08, metal: 0.15, clearcoat: 1.0, flakes: 0.30, category: 'dynamic' },
  gem: { name: 'الماس و یاقوت (Gemstone)', desc: 'تراش‌های منشور کریستالی گران‌بها', rough: 0.05, metal: 0.30, clearcoat: 1.0, flakes: 0.60, category: 'dynamic' },
  slime: { name: 'اسلایم بیوشیمیایی (Slime)', desc: 'پوشش ژله‌ای لزج و نیمه‌شفاف فسفری', rough: 0.15, metal: 0.05, clearcoat: 1.0, flakes: 0.0, isGlowing: true, category: 'dynamic' },
  ember: { name: 'خاکستر افروخته (Ember)', desc: 'ذغال گداخته با جرقه‌های زیرین', rough: 0.70, metal: 0.10, clearcoat: 0.10, flakes: 0.0, isGlowing: true, category: 'dynamic' }
};

export const FA_RIM_FINISH_NAMES = {
  chrome: { name: 'کروم براق', color: '#e8edf5', metal: 1.0, rough: 0.06 },
  silver: { name: 'نقره‌ای متالیک', color: '#c9ced8', metal: 1.0, rough: 0.20 },
  gunmetal: { name: 'دودی تیره (Gunmetal)', color: '#5b626e', metal: 1.0, rough: 0.32 },
  black: { name: 'مشکی مات', color: '#15171b', metal: 0.7, rough: 0.42 },
  gold: { name: 'طلای ۲۴ عیار', color: '#d4a62a', metal: 1.0, rough: 0.16 },
  bronze: { name: 'برنز ریسینگ', color: '#9d6b3f', metal: 1.0, rough: 0.26 },
  titanium: { name: 'تایتانیوم تراش‌خورده', color: '#8f98a4', metal: 1.0, rough: 0.34 },
  brushed: { name: 'آلومینیوم خش‌دار', color: '#adb5c0', metal: 1.0, rough: 0.30 },
  anodized: { name: 'آبی آنودایز', color: '#3f6f8c', metal: 0.9, rough: 0.24 },
  carbon: { name: 'فیبر کربن خالص', color: '#22252a', metal: 0.35, rough: 0.30 },
  purple: { name: 'بنفش الکتریک', color: '#6b3fd4', metal: 0.9, rough: 0.22 },
  ice: { name: 'یخ کریستالی', color: '#d8ecf7', metal: 1.0, rough: 0.09 },
  red: { name: 'قرمز مسابقه‌ای', color: '#c0202c', metal: 0.6, rough: 0.22 },
  matte: { name: 'دودی مخملی', color: '#26282d', metal: 0.5, rough: 0.62 },
  rust: { name: 'زنگار صحرایی', color: '#7d4a26', metal: 0.6, rough: 0.78 },
  plasma: { name: 'سایبر پلاسما', color: '#2b2f45', metal: 0.9, rough: 0.16 },
  obsidian: { name: 'آبسیدین براق', color: '#101216', metal: 0.85, rough: 0.28 },
  neon: { name: 'زرد نئون شتاب', color: '#e8ff3a', metal: 0.8, rough: 0.20 },
  sakura: { name: 'شکوفه صورتی (Sakura)', color: '#f0a0c0', metal: 0.85, rough: 0.18 },
  sand: { name: 'شن‌های طلایی کویر', color: '#c8b184', metal: 0.7, rough: 0.55 }
};

export const FA_CELEBRATION_NAMES = {
  donutstorm: { name: 'طوفان دونات‌های رنگین‌کمانی', desc: 'دونات‌های غول‌پیکر و خوشمزه همراه با روبان‌های رنگارنگ فضا را پر می‌کنند', icon: 'donut' },
  fireworks: { name: 'آتش‌بازی باشکوه آسمانی', desc: 'نه خمپاره نوری در آسمان اوج گرفته و انفجاری پرشکوه خلق می‌کنند', icon: 'sparkles' },
  confetti: { name: 'توپ‌های کاغذ رنگی و شرشره', desc: 'باران کاغذهای رنگی و روبان‌های جشن پیروزی', icon: 'party' },
  balloons: { name: 'انفجار بادکنک‌های هلیومی', desc: 'بادکنک‌های رنگارنگ به سمت سقف پرواز کرده و یکی پس از دیگری می‌ترکند', icon: 'balloon' },
  meteors: { name: 'باران شهاب‌سنگ آتشین', desc: 'سنگ‌های گداخته آسمانی با سرعت به زمین برخورد کرده و تکه‌تکه می‌شوند', icon: 'flame' },
  beachball: { name: 'پارتی توپ‌های ساحلی', desc: 'توپ‌های غول‌پیکر ساحلی دور ورزشگاه جهش می‌کنند', icon: 'sun' },
  turtles: { name: 'موج لاک‌پشت‌های اقیانوسی', desc: 'دسته‌ای از لاک‌پشت‌های دریایی شناکنان از دروازه خارج می‌شوند', icon: 'waves' },
  snowblind: { name: 'کولاک و قندیل‌های یخی', desc: 'ستاره‌های کریستالی برف همراه با ستون‌های یخ‌زده منجمدکننده', icon: 'snowflake' },
  hellfire: { name: 'شکاف آتشین دوزخ', desc: 'شکافی از مواد مذاب دهان باز کرده و گوی‌های آتشین پرتاب می‌کند', icon: 'flame' },
  dragons: { name: 'اژدهایان دوگانه آتش و دود', desc: 'دو اژدهای آتشین مارپیچ‌وار با بال‌های گشوده به پرواز درمی‌آیند', icon: 'dragon' },
  gravity: { name: 'بمب جاذبه و سیاه‌چاله', desc: 'تمام اجسام به سمت مرکز کشیده شده و سپس در موجی سهمگین منفجر می‌شوند', icon: 'orbit' },
  atomizer: { name: 'شکافت اتمی و مدار الکترون‌ها', desc: 'یک اتم هسته‌ای با چرخه‌های نوری درخشان منفجر می‌شود', icon: 'atom' },
  butterflies: { name: 'شکوفایی پروانه‌های درخشان', desc: 'ابری از پروانه‌های رنگی نورانی در هوا به پرواز درمی‌آیند', icon: 'flower' },
  poof: { name: 'شعبده‌بازی کلاه جادویی', desc: 'پاف دود ناگهانی همراه با پرواز کلاه‌های سیلندری جادویی', icon: 'wand' },
  voxel: { name: 'طوفان مکعب‌های وکسلی پیکسلی', desc: 'چهل مکعب سه‌بعدی به صورت کره جمع شده و متلاشی می‌شوند', icon: 'box' },
  kaleido: { name: 'زیبابین کریستالی و الماس', desc: 'خرده‌های شیشه آینه‌ای با تقارن هندسی خیره‌کننده پخش می‌شوند', icon: 'gem' },
  overgrowth: { name: 'رویش پیچک‌های سرسبز جنگلی', desc: 'پیچک‌های زنده گیاهی روی کف استادیوم رشد کرده و جوانه می‌زنند', icon: 'leaf' },
  electro: { name: 'رعد و برق و صاعقه‌های تسلا', desc: 'ستون‌های ولتاژ بالا جرقه‌های الکتریکی پرقدرت ایجاد می‌کنند', icon: 'zap' },
  nitro: { name: 'شلیک مخازن نیترو مسابقه‌ای', desc: 'کپسول‌های نیتروژن با آتش آبی به آسمان موشک می‌شوند', icon: 'gauge' },
  subzero: { name: 'انجماد مطلق زیر صفر', desc: 'زمین منجمد شده و هوای استادیوم به بلورهای کریستالی تبدیل می‌شود', icon: 'snow' },
  party: { name: 'جشن تولد و کلاه‌های بوقی', desc: 'شادی و هیجان با کلاه‌های بوقی، بادکنک‌ها و روبان‌ها', icon: 'smile' },
  halo: { name: 'حلقه‌های زرین نورانی قدیسان', desc: 'حلقه‌های طلایی بزرگ روی سه محور مختلف به چرخش درمی‌آیند', icon: 'circle' },
  bubbles: { name: 'حباب‌های صابونی رنگین‌کمانی', desc: 'حباب‌های معلق درخشان به هوا رفته و با جلوه صوتی پاپ می‌ترکند', icon: 'droplet' },
  duckstorm: { name: 'سونامی اردک‌های پلاستیکی زرد', desc: 'هزاران اردک حمام زرد رنگ در کل زمین به پرواز درمی‌آیند!', icon: 'duck' },
  clockwork: { name: 'چرخ‌دنده‌های ساعت کوکی برنجی', desc: 'چرخ‌دنده‌های برنجی با چرخش مکانیکی در هوا به هم چفت می‌شوند', icon: 'settings' },
  skullrain: { name: 'باران اسکلت‌های شبح‌وار زمردی', desc: 'جمجمه‌های هالووین با ردهای سبز فسفری از دروازه جاری می‌شوند', icon: 'skull' }
};

/**
 * Returns formatted catalog of Ultra wheels (disabled: strictly reverted to Version 4 tires).
 */
export function getUltraWheels() {
  return CAR_WHEEL_DEFS.map(w => ({
    id: w.id,
    name: w.nameFa || w.name,
    tagline: w.sub || '',
    style: w.desc || '',
    category: 'sport'
  }));
}

export function isUltraWheel(id) {
  return false;
}

export function findUltraWheel(id) {
  return null;
}

/**
 * Builds 3D WebGL meshes for an Ultra wheel set (disabled: strictly reverted to Version 4 tires).
 */
export function buildUltraWheelMesh(R, wheelId) {
  return null;
}

/**
 * Returns catalog of 13 body finishes.
 */
export function getUltraFinishes() {
  return Object.keys(FA_FINISH_NAMES).map(key => ({
    id: key,
    ...FA_FINISH_NAMES[key]
  }));
}

/**
 * Returns catalog of 20 rim finishes.
 */
export function getUltraRimFinishes() {
  return Object.keys(FA_RIM_FINISH_NAMES).map(key => ({
    id: key,
    ...FA_RIM_FINISH_NAMES[key]
  }));
}

/**
 * Returns catalog of 26 goal celebrations.
 */
export function getUltraCelebrations() {
  const all = (ULTRA_LIB && ULTRA_LIB.celebrations) || [];
  return all.map(c => {
    const meta = FA_CELEBRATION_NAMES[c.id.toLowerCase()] || {
      name: c.name || c.id,
      desc: c.tagline || c.desc || 'انفجار پرقدرت گل اولترا',
      icon: 'sparkles'
    };
    return {
      id: c.id,
      name: c.name || c.id,
      faName: meta.name,
      desc: meta.desc,
      icon: meta.icon,
      spec: c
    };
  });
}

export const FA_DECAL_LIST = [
  // 1. ANIMATED DYNAMIC DECALS (18)
  { id: 'datastream', name: 'Data Stream', faName: 'جریان داده دیجیتال', category: 'animated', isAnimated: true, grade: 'epic', desc: 'کدهای متحرک دیجیتالی درخشان روی بدنه' },
  { id: 'lavaflow', name: 'Lava Flow', faName: 'جریان مذاب آتشفشان', category: 'animated', isAnimated: true, grade: 'legendary', desc: 'گدازه‌های آتشین متحرک با درخشش نورانی' },
  { id: 'portal', name: 'Portal Rift', faName: 'شکاف پرتال کیهانی', category: 'animated', isAnimated: true, grade: 'legendary', desc: 'مارپیچ فضایی چرخنده در مرکز سقف و بدنه' },
  { id: 'auroraveil', name: 'Aurora Veil', faName: 'شفق قطبی متحرک', category: 'animated', isAnimated: true, grade: 'epic', desc: 'امواج نوری رقصنده شفق قطبی در طول بدنه' },
  { id: 'hyperspace', name: 'Hyperspace', faName: 'جهش هایپراسپیس', category: 'animated', isAnimated: true, grade: 'epic', desc: 'ستاره‌های کشیده شده با سرعت نور' },
  { id: 'circuitboard', name: 'Circuit Board', faName: 'مدار الکترونیکی زنده', category: 'animated', isAnimated: true, grade: 'rare', desc: 'جریان پالس‌های الکتریکی در مسیرهای مسی' },
  { id: 'pulsewave', name: 'Pulse Wave', faName: 'امواج پالس صوتی', category: 'animated', isAnimated: true, grade: 'rare', desc: 'امواج ضربان‌دار نئونی هماهنگ با سرعت' },
  { id: 'matrixrain', name: 'Matrix Rain', faName: 'باران کد ماتریکس', category: 'animated', isAnimated: true, grade: 'epic', desc: 'ریزش باران نمادهای فسفری سبز ماتریکسی' },
  { id: 'voidcore', name: 'Void Core', faName: 'هسته سیاهچاله خلاء', category: 'animated', isAnimated: true, grade: 'legendary', desc: 'مکندگی انرژی تاریک به مرکز خودرو' },
  { id: 'cyberdeck', name: 'Cyberdeck', faName: 'کنسول سایبرپانک', category: 'animated', isAnimated: true, grade: 'rare', desc: 'رابط گرافیکی آینده‌نگرانه و HUD متحرک' },
  { id: 'biohazard', name: 'Biohazard', faName: 'هشدار بیولوژیک', category: 'animated', isAnimated: true, grade: 'rare', desc: 'تابش رادیواکتیو سموم با هاله فسفری' },
  { id: 'inferno', name: 'Inferno Storm', faName: 'طوفان دوزخی آتش', category: 'animated', isAnimated: true, grade: 'legendary', desc: 'زبانه کشیدن شعله‌های زنده از دماغه به عقب' },
  { id: 'glitch', name: 'Glitch Screen', faName: 'گلیچ دیجیتال', category: 'animated', isAnimated: true, grade: 'rare', desc: 'پارازیت‌ها و اعوجاج‌های رنگی RGB' },
  { id: 'spectrum', name: 'Spectrum Wave', faName: 'طیف رنگین‌کمان', category: 'animated', isAnimated: true, grade: 'epic', desc: 'حرکت طیف پیوسته نوری در امتداد خودرو' },
  { id: 'nebulapulse', name: 'Nebula Pulse', faName: 'پالس سحابی کیهانی', category: 'animated', isAnimated: true, grade: 'epic', desc: 'ابرهای گاز و غبار فضایی در حال تنفس' },
  { id: 'lightningstorm', name: 'Lightning Storm', faName: 'رعد و صاعقه زنده', category: 'animated', isAnimated: true, grade: 'legendary', desc: 'صاعقه‌های پرقدرت ناگهانی روی بدنه' },
  { id: 'sunburst', name: 'Sunburst Flare', faName: 'زبانه خورشیدی', category: 'animated', isAnimated: true, grade: 'epic', desc: 'پرتوهای داغ خورشیدی منشعب از مرکز' },
  { id: 'holofoil', name: 'Holo Foil', faName: 'فویل هولوگرافیک زنده', category: 'animated', isAnimated: true, grade: 'legendary', desc: 'بازتابش متغیر و براق با زاویه دید' },

  // 2. RACING & MOTORSPORT
  { id: 'stripes_monza', name: 'Monza Racing', faName: 'خطوط مسابقه‌ای مونزا', category: 'racing', isAnimated: false, grade: 'common', desc: 'خط پهن مرکزی با حاشیه ظریف' },
  { id: 'stripes_daytona', name: 'Daytona Dual', faName: 'دوبل دیتونا', category: 'racing', isAnimated: false, grade: 'common', desc: 'دو خط کلاسیک متقارن از کاپوت تا بالچه' },
  { id: 'stripes_rally', name: 'Rally Cross', faName: 'رالی کراس حرفه‌ای', category: 'racing', isAnimated: false, grade: 'common', desc: 'طرح زاویه‌دار مسابقات رالی WRC' },
  { id: 'stripes_lemans', name: 'LeMans Heritage', faName: 'لمانز افسانه‌ای', category: 'racing', isAnimated: false, grade: 'rare', desc: 'طرح اصیل ۲۴ ساعته لمانز' },
  { id: 'stripes_viper', name: 'Viper Double', faName: 'وایپر اسپرت', category: 'racing', isAnimated: false, grade: 'common', desc: 'خطوط کشیده بدنه با الهام از دوج وایپر' },
  { id: 'carbonwrap', name: 'Carbon Wrap', faName: 'پوشش فیبر کربن', category: 'racing', isAnimated: false, grade: 'rare', desc: 'بافت سبک کربنی روی کاپوت و سقف' },

  // 3. CAMOUFLAGE & TACTICAL
  { id: 'hexgrid', name: 'Hex Grid', faName: 'شبکه لانه زنبوری', category: 'tactical', isAnimated: false, grade: 'rare', desc: 'شبکه شش‌ضلعی هندسی های‌تک' },
  { id: 'camo_desert', name: 'Desert Camo', faName: 'استتار کویری', category: 'tactical', isAnimated: false, grade: 'common', desc: 'پوشش چریکی با تناژهای خاکی و شنی' },
  { id: 'camo_urban', name: 'Urban Camo', faName: 'استتار شهری', category: 'tactical', isAnimated: false, grade: 'common', desc: 'طرح استتار خاکستری و مشکی محیط‌های شهری' },
  { id: 'camo_woodland', name: 'Woodland Camo', faName: 'استتار جنگلی', category: 'tactical', isAnimated: false, grade: 'common', desc: 'استتار کلاسیک ارتش با رنگ‌های زیتونی و قهوه‌ای' },
  { id: 'camo_digital', name: 'Digital Camo', faName: 'استتار دیجیتالی', category: 'tactical', isAnimated: false, grade: 'rare', desc: 'پیکسل‌های کوچک نظامی مدرن' },
  { id: 'dazzle', name: 'Dazzle Camo', faName: 'استتار دازل خطی', category: 'tactical', isAnimated: false, grade: 'rare', desc: 'خطوط متقاطع شکننده ابعاد خودرو' },
  { id: 'polygons', name: 'Low Poly Shards', faName: 'چندضلعی‌های کریستالی', category: 'tactical', isAnimated: false, grade: 'rare', desc: 'تکه‌های هندسی سه‌بعدی متصل' },

  // 4. STREET & CUSTOM ART
  { id: 'flames_classic', name: 'Classic Flames', faName: 'شعله‌های آتش کلاسیک', category: 'street', isAnimated: false, grade: 'common', desc: 'آتش کشیده شده از گلگیرهای جلو' },
  { id: 'flames_tribal', name: 'Tribal Flames', faName: 'آتش تریبال نوک‌تیز', category: 'street', isAnimated: false, grade: 'rare', desc: 'الگوهای تیز و آتشین خشن' },
  { id: 'sharkteeth', name: 'Shark Teeth Warhawk', faName: 'دندان‌های کوسه جنگنده', category: 'street', isAnimated: false, grade: 'rare', desc: 'طرح نوستالژیک هواپیماهای جنگی P-40' },
  { id: 'kanji_drift', name: 'Tokyo Drift Kanji', faName: 'کانجی دریفت توکیو', category: 'street', isAnimated: false, grade: 'rare', desc: 'خطوط نگارگری ژاپنی و علائم مسابقات شبانه' },
  { id: 'retrowave', name: 'Retrowave Sunset', faName: 'غروب رتروویو دهه ۸۰', category: 'street', isAnimated: false, grade: 'epic', desc: 'خورشید خط‌دار نئونی بنفش و صورتی' },
  { id: 'vaporwave', name: 'Vaporwave Grid', faName: 'شبکه ویپورویو', category: 'street', isAnimated: false, grade: 'epic', desc: 'شبکه پرسپکتیو فیروزه‌ای و سرخ‌آبی' }
];

export function getUltraDecals() {
  return FA_DECAL_LIST;
}

export function findUltraDecal(id) {
  if (!id) return null;
  const l = id.toLowerCase();
  return FA_DECAL_LIST.find(d => d.id.toLowerCase() === l) || null;
}

export function isUltraCelebration(id) {
  if (!id) return false;
  const lower = String(id).toLowerCase();
  return !!(ULTRA_LIB && ULTRA_LIB.celebrations && ULTRA_LIB.celebrations.some(c => c.id.toLowerCase() === lower));
}

export function findUltraCelebration(id) {
  if (!id) return null;
  const lower = String(id).toLowerCase();
  return (ULTRA_LIB && ULTRA_LIB.celebrations) ? (ULTRA_LIB.celebrations.find(c => c.id.toLowerCase() === lower) || null) : null;
}

export const FACTORY_PALETTES = [
  { id: 'cobalt', name: 'کبالت الکتریک', base: '#1b47f0', secondary: '#0d1330', accent: '#57e7ff', finish: 'pearlescent', desc: 'آبی درخشان با روکش صدفی هفت‌رنگ و تریم فیروزه‌ای' },
  { id: 'crimson', name: 'قرمز یاقوتی', base: '#d81031', secondary: '#1a0508', accent: '#ffd34d', finish: 'metallic', desc: 'سرخ متالیک آتشین با رگه‌های طلایی لوکس' },
  { id: 'toxic', name: 'سبز توکسیک', base: '#9ef22b', secondary: '#12210a', accent: '#00ffc8', finish: 'gloss', desc: 'فسفری مسابقه‌ای نئونی با انعکاس براق' },
  { id: 'sunset', name: 'غروب آفتاب', base: '#ff6a13', secondary: '#2a0b2f', accent: '#ffe08a', finish: 'candy', desc: 'نارنجی آبنباتی کریستالی با تریم بنفش عمیق' },
  { id: 'midnight', name: 'بنفش نیمه‌شب', base: '#12141c', secondary: '#2b3040', accent: '#7b5cff', finish: 'satin', desc: 'مشکی دودی مخملی با نئون بنفش سایبر' },
  { id: 'ivory', name: 'عاجی سوپراسپرت', base: '#e9ecf2', secondary: '#1d2129', accent: '#e02b4a', finish: 'gloss', desc: 'سفید صدفی صیقلی با خطوط مسابقه‌ای قرمز' },
  { id: 'titanium', name: 'تایتانیوم خش‌دار', base: '#8a939e', secondary: '#33383f', accent: '#f0b429', finish: 'brushed', desc: 'استیل صنعتی مات با کالیپرهای زرد اسپرت' },
  { id: 'violet', name: 'سایبر وایولت', base: '#7b2cf0', secondary: '#160a2a', accent: '#28f0d0', finish: 'holographic', desc: 'هولوگرافیک بنفش متغیر با درخشش فیروزه‌ای' },
  { id: 'teal', name: 'فیروزه مسابقه‌ای', base: '#0fb5b0', secondary: '#07262c', accent: '#f9f871', finish: 'metallic', desc: 'سبز-آبی متالیک مسابقات لمانز' },
  { id: 'ember', name: 'آتش و خاکستر', base: '#2a0d0d', secondary: '#ff4d1a', accent: '#ffb347', finish: 'matte', desc: 'مشکی مات فیبرکربن با رگه‌های گدازه افروخته' },
  { id: 'gold', name: 'طلای ۲۴ عیار', base: '#c9a227', secondary: '#241b06', accent: '#fff3c4', finish: 'anodized', desc: 'روکش آبکاری طلای خالص با جلای فوق‌العاده' },
  { id: 'carbonx', name: 'کربن سایه', base: '#23262b', secondary: '#0d0f12', accent: '#00d0ff', finish: 'carbon', desc: 'بافت واقعی فیبر کربن ۳K با خطوط آبی نئونی' },
  { id: 'sakura', name: 'شکوفه گیلاس', base: '#f472b6', secondary: '#4c0519', accent: '#fbcfe8', finish: 'pearlescent', desc: 'صورتی ملایم با پیگمنت‌های صدفی درخشان' },
  { id: 'iceberg', name: 'یخ قطبی کریستال', base: '#bae6fd', secondary: '#082f49', accent: '#38bdf8', finish: 'candy', desc: 'آبی یخی شفاف و بلوری با انعکاس منشوری' },
  { id: 'monolith', name: 'آبسیدین استیلث', base: '#0a0a0c', secondary: '#18181b', accent: '#a1a1aa', finish: 'matte', desc: 'مات یکدست استیلث بدون بازتاب نور' },
  { id: 'inferno', name: 'گدازه آتشفشان', base: '#ea580c', secondary: '#450a0a', accent: '#facc15', finish: 'metallic', desc: 'شعله‌های خورشیدی گرم با افکت اکلیل طلایی' }
];

export function getUltraPalettes() {
  return FACTORY_PALETTES;
}

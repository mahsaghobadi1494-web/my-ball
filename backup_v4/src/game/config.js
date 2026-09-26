// @ts-nocheck
export var CFG = {
  physics: {
    hz: 240,
    maxStepsPerFrame: 12,
    gravity: 6.50,
    maxCarSpeed: 28.0,
    maxBallSpeed: 65.0,
    maxAngSpeed: 24.0,
    contactSlop: 0.004,
    posCorrect: 0.55
  },
  vehicle: {
    mass: 180,
    hx: 0.42, hy: 0.18, hz: 0.59,
    comOffsetY: -0.045,
    inertiaScale: 0.72,
    driveAccel: 24.0,
    driveSpeedCap: 18.5,
    reverseAccel: 15.0,
    reverseSpeedCap: 10.5,
    brakeAccel: 30.0,
    coastDecel: 2.8,
    steerMax: 0.275,
    steerMin: 0.14,
    steerRate: 20.0,
    driftYawDamp: 7.5,
    driftStability: 1.0,
    grip: 32.0,
    gripSlide: 6.0,
    slideRecover: 7.5,
    frictionCircle: 4.0,
    airDrag: 0.015,
    groundDrag: 0.005,
    stickAccel: 22.0,
    stickSpeedRef: 9.0,
    ballHitboxScaleX: 1.25,
    ballHitboxScaleY: 1.20,
    ballHitboxScaleZ: 1.25,
    carScale: 2.75,
    hitboxElevationOffset: 0.0,
    flipAntiSnag: 0.90,
    chassisRoundness: 0.15,
    ballBoxRoundness: 0.20,
    hideWheelFlaps: false,
    flapOffsetY: 0.0,
    flapScale: 1.0,
    flapWidthScale: 0.65, // Sleek, aerodynamic flap width (reduced from bulky 1.0)
    flapThickScale: 0.60, // Slim, high-precision fender thickness
    wheel: {
      radius: 0.157,
      rest: 0.07,
      travel: 0.08,
      stiffness: 165.0,
      damping: 18.0,
      maxRay: 0.45,
      attachY: -0.05,
      attachX: 0.355,
      attachZ: 0.415,
      downforce: 12.0
    },
    jump: { impulse: 5.2, secondImpulse: 5.2, holdAccel: 14.0, holdTime: 0.20, cooldown: 0.05, doubleWindow: 1.85, dodgeWindow: 1.85, maxJumpVel: 8.0 },
    dodge: { speed: 8.5, upSpeed: 1.6, angRate: 13.5, duration: 0.52, deadzone: 0.16, flickTorque: 1.45, flickSurge: 1.35 },
    air: { pitch: 16.0, yaw: 12.5, roll: 46.0, maxAirAngSpeed: 5.5, damp: 6.5, rollDamp: 8.5 },
    boost: { max: 100, consume: 33.3, accel: 13.5, speedCap: 28.0 }
  },
  ball: {
    radius: 2.334, mass: 35,
    restitution: 0.60, restitutionCar: 0.62,
    friction: 0.36, wallFriction: 0.42,
    drag: 0.0305, angDrag: 0.0175,
    rollResist: 0.42,
    magnus: 0.0032,
    kickScale: 1.25,
    kickBase: 6.5, kickSlope: 0.45, kickMax: 32.0,
    carReaction: 0.04,
    carAngularReaction: 0.02,
    carPushBack: 0.02
  },
  arena: {
    hx: 61.5,
    hz: 76.8,
    height: 30.75,
    fillet: 3.9,
    cornerFillet: 12.3,
    goalHalfW: 13.395,
    goalHeight: 9.63,
    goalDepth: 9.6,
    wallFriction: 0.55,
    wallRestitution: 0.30
  },
  match: {
    duration: 300,
    countdown: 3,
    goalReplay: 11.5,
    teamSize: 3,
    overtime: true
  },
  camera: {
    fov: 100, distance: 9.0, height: 2.45, stiffness: 1.0, pitch: 12,
    ballcamHeight: 3.1, ballcamDistance: 9.6, shake: 1.0, speedZoom: 2.6, fovSpeed: 10,
    swivelSpeed: 2.5, transitionSpeed: 1.5,
    startBallcam: true
  },
  ai: {
    skill: 2,
    predictHorizon: 2.6,
    predictStep: 1 / 30,
    boostThreshold: 34,
    dodgeRange: 2.9
  },
  boostPad: { smallAmount: 12, bigAmount: 100, smallCooldown: 4, bigCooldown: 10, smallRadius: 2.4, bigRadius: 3.2, height: 2.5 },
  audio: { master: 0.7, sfx: 0.9, engine: 0.6 },
  gfx: {
    renderScale: 1,
    particles: 1,
    shadows: true,
    stadiumTheme: "NEON_CHAMPIONSHIP",
    perfMode: "BALANCED", // "ULTRA" (120 FPS) | "BALANCED" (60 FPS) | "HIGH" (Cinema Quality)
    // Stadium & Lighting Controls
    floodlightIntensity: 0.35, // Reduced from blinding 1.0+ to soft balanced 0.35
    ambientLight: 0.85,
    sunIntensity: 0.95,
    pitchBrightness: 1.0,
    pitchContrast: 1.0,
    pitchRoughness: 0.35,
    turfSheen: 0.45,
    // Volumetric 3D Stadium Lasers Controls
    laserBrightness: 0.45, // Soft balanced laser emissive & intensity
    laserThickness: 0.70,  // Beam cylinder thickness scale
    laserHaloRadius: 0.75, // Outer glow/halo radius scale
    laserOpacity: 0.40,    // Translucency & bloom transparency
    laserSpotRadius: 0.80, // Ground impact and flare optical spot circle radius
    // Vehicle Material & Clearcoat Controls (Solid, high-gloss automotive lacquer without brushed/grainy flakes)
    carGloss: 0.96,
    carClearcoat: 0.95,
    carMetallic: 0.08,
    carFlakes: 0.00, // Zero brushed noise for pure mirror-smooth lacquer
    carBump: 0.90, // Procedural 3D surface relief, panel seams, hood vents, and carbon fiber micro-relief
    carBumpStyle: "SPORTS_PANELS", // "SPORTS_PANELS" | "AERO_LOUVERS" | "CARBON_WEAVE" | "ARMOR_PLATES"
    carAmbientOcclusion: 0.85, // Cavity & chassis contact self-shadowing
    carReflection: 0.80,
    shadowMapping: true, // Real-time directional sun shadow map (WebGL2 native PCF)
    shadowSoftness: 1.0, // Soft penumbra PCF filter radius
    // Ball Material & Procedural Bump Controls
    ballType: "soccer", // "soccer" | "volleyball" | "tennis" | "basketball"
    ballBrightness: 1.00, // Solid saturated colors
    ballGloss: 0.72,
    ballMetallic: 0.00, // 0 metallic to maintain solid saturated panel paint
    ballBumpIntensity: 1.00, // Deep 3D embossed panel relief
    ballEmissiveGlow: 0.00, // Clean 0 glow so sphere does not wash out flatly
    // Dynamic 3D Instanced Pitch Grass System
    grassEnabled: true,
    grassDensity: "ULTRA_DENSE", // "HYPER_DENSE" (5M) | "CINEMATIC_MAX" (3M) | "OPTIMIZED_2_5M" (2.5M) | "OPTIMIZED_2M" (2M) | "EXTREME" (1.5M) | "ULTRA_DENSE" (750k) | "ULTRA" (350k) | "HIGH" (150k) | "BALANCED" (60k) | "LOW" (25k)
    grassBladeCount: 750000,
    grassBladeWidth: 1.25, // Wider lush blade width for full dense coverage
    grassHeight: 0.65, // in meters
    grassWindSpeed: 1.4,
    grassWaveStrength: 0.85,
    grassTremble: 0.80, // flutter jitter
    grassTipCreaminess: 1.00, // Velvety creamy warm sunlight tips (soft rounded edges)
    grassSubsurface: 0.80, // Soft light translucency
    boostPadHeightOffset: 0.35, // Elevation above turf/grass (in meters)
    // Animated Stadium Spectator Crowds & Mexican Wave
    crowdAnimation: true,
    crowdEnergy: 1.0 // Cheering wave and jump height intensity
  },
  customization: {
    model: "OCTANE", // "OCTANE" | "VORTEX" | "STRIKER" | "TITAN" | "RAPTOR" | "PHANTOM" ...
    wheel: "SPORT",  // "SPORT" | "TURBINE" | "MESH" | "OFFROAD" | "DISH" | "AERO" | "STEEL"
    useCustomPaint: true, // If true, player uses custom paint instead of pure team color
    teamVariant: "BLUE", // "BLUE" | "RED"
    bodyColor: "#1264e8",       // Primary body paint hex (Blue team champion)
    accentColor: "#121722",     // Roll cage, sills, carbon trim hex
    trimColor: "#f0f2f5",       // Racing stripes, roof accents hex
    glassColor: "#080e18",      // Canopy tint hex
    lightsColor: "#4ca5ff",     // Headlights & LED glow hex
    thrusterColor: "#00e5ff",   // Jet nozzle & flame hex
    hubColor: "#d6dade",        // Rim face & alloy spokes hex
    wheelColor: "#121418",      // Tyre rubber hex
    metallic: 0.65,
    gloss: 0.95,
    flakes: 0.30,
    clearcoat: 0.90,
    // 10 Vinyl Decal Models & Dynamic Animated Vinyls
    vinyl: "RACING_STRIPES",    // 'CLEAN'|'RACING_STRIPES'|'CYBER_GRID'|'FLAME_SURGE'|'LIGHTNING_STORM'|'WAVE_FLOW'|'CARBON_HEX'|'CAMO_TACTICAL'|'DIGITAL_MATRIX'|'SPEED_APEX'|'SUNBURST_RAYS'
    vinylColor: "#ffffff",      // Decal artwork graphic color
    vinylAnimated: false,       // Auto-enabled for dynamic animated patterns
    vinylScale: 1.0,
    vinylIntensity: 1.0,
    vinylEmissive: 0.0          // Glowing neon emission for dynamic decals
  },
  input: { steerSens: 1.0, airSens: 1.0, deadzone: 0.08 },
  debug: { showHitboxes: false }
};

export var STADIUM_THEMES = {
  NEON_CHAMPIONSHIP: {
    id: "NEON_CHAMPIONSHIP",
    name: "Daylight Grand Championship",
    subName: "Open Air Daylight Stadium",
    badge: "DAYLIGHT",
    turfBase: "#226a34",
    turfStripe1: "#2e8844",
    turfStripe2: "#26783b",
    lineColor: "#ffffff",
    team0Grad: "rgba(35,145,255,0.22)",
    team1Grad: "rgba(255,120,40,0.22)",
    particleColor: "rgba(240,248,255,",
    fogColor: [0.62, 0.78, 0.95],
    skyColor: [0.45, 0.72, 0.98],
    shellColor: [0.82, 0.88, 0.96],
    crowdEmissive: [0.35, 0.38, 0.46],
    lightsEmissive: [2.0, 2.0, 2.2]
  },
  NEON_VELOCITY: {
    id: "NEON_VELOCITY",
    name: "Overdrive Stadium",
    subName: "Sunny Coastal Pitch",
    badge: "DAYLIGHT",
    turfBase: "#237237",
    turfStripe1: "#308e48",
    turfStripe2: "#287e3f",
    lineColor: "#ffffff",
    team0Grad: "rgba(53,186,255,0.20)",
    team1Grad: "rgba(255,151,69,0.20)",
    particleColor: "rgba(220,245,255,",
    fogColor: [0.60, 0.76, 0.92],
    skyColor: [0.42, 0.70, 0.96],
    shellColor: [0.80, 0.86, 0.94],
    crowdEmissive: [0.32, 0.36, 0.44],
    lightsEmissive: [1.8, 1.8, 2.0]
  },
  CYBER_DOME: {
    id: "CYBER_DOME",
    name: "Classic Cyber Dome",
    subName: "Pro Indoor Arena",
    badge: "CLASSIC",
    turfBase: "#181b24",
    turfStripe1: "#232634",
    turfStripe2: "#1d2029",
    lineColor: "#ecf0f8",
    team0Grad: "rgba(255,51,133,0.18)",
    team1Grad: "rgba(153,250,71,0.18)",
    particleColor: "rgba(255,255,255,",
    fogColor: [0.04, 0.04, 0.07],
    skyColor: [0.07, 0.08, 0.14],
    shellColor: [0.38, 0.42, 0.52],
    crowdEmissive: [0.15, 0.18, 0.28],
    lightsEmissive: [1.8, 1.8, 1.9]
  },
  HYPERION_NIGHT: {
    id: "HYPERION_NIGHT",
    name: "Hyperion Night Dome",
    subName: "Midnight Neon Lights",
    badge: "NIGHT",
    turfBase: "#1b0d2a",
    turfStripe1: "#28143e",
    turfStripe2: "#211033",
    lineColor: "#ff55d4",
    team0Grad: "rgba(255,85,212,0.25)",
    team1Grad: "rgba(255,214,102,0.25)",
    particleColor: "rgba(255,180,255,",
    fogColor: [0.07, 0.02, 0.12],
    skyColor: [0.13, 0.04, 0.22],
    shellColor: [0.45, 0.25, 0.52],
    crowdEmissive: [0.38, 0.12, 0.48],
    lightsEmissive: [2.2, 1.4, 2.2]
  },
  CYBER_SUNSET: {
    id: "CYBER_SUNSET",
    name: "Cyber Sunset Colosseum",
    subName: "Synthwave Golden Hour",
    badge: "FANTASY",
    turfBase: "#1e1428",
    turfStripe1: "#2c1c3c",
    turfStripe2: "#241632",
    lineColor: "#ffd166",
    team0Grad: "rgba(255,42,109,0.28)",
    team1Grad: "rgba(255,170,0,0.28)",
    particleColor: "rgba(255,210,120,",
    fogColor: [0.22, 0.08, 0.18],
    skyColor: [0.35, 0.10, 0.28],
    shellColor: [0.65, 0.35, 0.55],
    crowdEmissive: [0.55, 0.25, 0.45],
    lightsEmissive: [2.5, 1.8, 1.2]
  },
  COSMIC_AURORA: {
    id: "COSMIC_AURORA",
    name: "Cosmic Aurora Arena",
    subName: "Starlight & Celestial Aurora",
    badge: "COSMIC",
    turfBase: "#0b1f24",
    turfStripe1: "#122e36",
    turfStripe2: "#0e262c",
    lineColor: "#05ffa1",
    team0Grad: "rgba(5,255,161,0.26)",
    team1Grad: "rgba(185,43,255,0.26)",
    particleColor: "rgba(160,255,230,",
    fogColor: [0.03, 0.08, 0.12],
    skyColor: [0.05, 0.14, 0.22],
    shellColor: [0.25, 0.65, 0.55],
    crowdEmissive: [0.25, 0.55, 0.50],
    lightsEmissive: [1.6, 2.4, 2.2]
  }
};

export var DEFAULT_CFG = JSON.parse(JSON.stringify(CFG));

export function deepMerge(target, source) {
  if (!source || typeof source !== "object") return;
  for (var key in source) {
    if (source[key] !== null && typeof source[key] === "object" && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

export function loadSavedConfig() {
  try {
    if (typeof localStorage !== "undefined") {
      var raw = localStorage.getItem("overdrive_tuning_cfg");
      if (raw) {
        var saved = JSON.parse(raw);
        if (saved && saved.ball && saved.ball.carReaction === 0.26) {
          saved.ball.carReaction = 0.04;
        }
        if (saved && saved.vehicle && saved.vehicle.air) {
          if (saved.vehicle.air.maxAirAngSpeed === undefined) {
            saved.vehicle.air.maxAirAngSpeed = 5.5;
          }
          if (saved.vehicle.air.damp !== undefined && saved.vehicle.air.damp < 5.0) {
            saved.vehicle.air.damp = 6.5;
          }
          if (saved.vehicle.air.rollDamp !== undefined && saved.vehicle.air.rollDamp < 6.0) {
            saved.vehicle.air.rollDamp = 8.5;
          }
        }
        if (saved && saved.gfx) {
          if (saved.gfx.perfMode === undefined) saved.gfx.perfMode = "BALANCED";
          if (saved.gfx.turfSheen === undefined) saved.gfx.turfSheen = 0.45;
          if (saved.gfx.sunIntensity === undefined) saved.gfx.sunIntensity = 0.95;
        }
        deepMerge(CFG, saved);
        return true;
      }
    }
  } catch (e) {
    console.warn("Failed to load saved config from localStorage", e);
  }
  return false;
}

export function saveCurrentConfig() {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("overdrive_tuning_cfg", JSON.stringify(CFG));
      return true;
    }
  } catch (e) {
    console.error("Failed to save config to localStorage", e);
  }
  return false;
}

export function saveZeroPreset(customData) {
  try {
    if (typeof localStorage !== "undefined") {
      var toSave = customData || CFG;
      localStorage.setItem("overdrive_preset_zero", JSON.stringify(toSave));
      // Also ensure main tuning cfg has it
      localStorage.setItem("overdrive_tuning_cfg", JSON.stringify(toSave));
      return true;
    }
  } catch (e) {
    console.error("Failed to save zero preset to localStorage", e);
  }
  return false;
}

export function loadZeroPreset() {
  try {
    if (typeof localStorage !== "undefined") {
      var raw = localStorage.getItem("overdrive_preset_zero");
      if (raw) {
        var saved = JSON.parse(raw);
        deepMerge(CFG, saved);
        return saved;
      }
    }
  } catch (e) {
    console.warn("Failed to load zero preset from localStorage", e);
  }
  return null;
}

export function hasZeroPreset() {
  try {
    if (typeof localStorage !== "undefined") {
      return !!localStorage.getItem("overdrive_preset_zero");
    }
  } catch (e) {
    return false;
  }
  return false;
}

// Auto-load config if present
if (typeof window !== "undefined") {
  loadSavedConfig();
}

export var TEAM = { BLUE: 0, RED: 1, PULSE: 0, VOLT: 1 };
export var TEAM_NAME = ["تیم آبی (Blue)", "تیم قرمز (Red)"];
export var TEAM_COLOR = [
  [0.08, 0.44, 0.96], // Pure Championship Blue #1264E8
  [0.95, 0.14, 0.16]  // Pure Championship Red #E81A24
];
export var BOT_NAMES = [["Striker-Blue", "Mako-Blue", "Zephyr-Blue"], ["Titan-Red", "Onyx-Red", "Blaze-Red"]];

export var CAR_BODY_DEFS = [
  { id: 'OCTANE', name: 'Octavius Prime', nameFa: 'اکتان پرایم (Octane)', sub: 'باگی مسابقه‌ای محبوب', icon: 'buggy', desc: 'باگی آیرودینامیک با دماغه کوتاه، شانه‌های پهن و باله عقب پرقدرت' },
  { id: 'DOMINUS', name: 'Dominator GT', nameFa: 'دومیناتور GT (Dominus)', sub: 'وج سوپراسپرت', icon: 'car', desc: 'بدنه کشیده و تخت با بزرگترین سطح ضربه‌زنی و اسپویلر مسابقه‌ای GT' },
  { id: 'FENNEC', name: 'Fennec Cyber', nameFa: 'فنک سایبر (Fennec)', sub: 'بدنه جعبه‌ای عضلانی', icon: 'shield', desc: 'طراحی مکعبی عضلانی با دیواره‌های صاف و آیرودینامیک فوق‌العاده در هوا' },
  { id: 'TAKUMI', name: 'Samurai Drift', nameFa: 'سامورایی دریفت (Takumi)', sub: 'کوپه دریفت JDM', icon: 'zap', desc: 'کوپه ژاپنی با گلگیرهای بسیار پهن، ورودی‌های هوای کاپوت و اگزوز بزرگ' },
  { id: 'BREAKOUT', name: 'Apex Hyper R', nameFa: 'آپکس هایپر R (Breakout)', sub: 'هایپرکار موتور وسط', icon: 'car', desc: 'بدنه کشیده و پهن با تیغه‌های هوایی جانبی و باله دوطبقه کربنی' },
  { id: 'MANTIS', name: 'Mantis Proto', nameFa: 'مانتیس پروتوتایپ (Mantis)', sub: 'سوپر اسپرت خوابیده', icon: 'flame', desc: 'ارتفاع بسیار کم نزدیک به زمین با کابین حبابدار شیشه‌ای خلبانی' },
  { id: 'MERC', name: 'Bastion Titan', nameFa: 'باستیون تایران (Merc)', sub: 'سنگین‌وزن زره‌پوش', icon: 'truck', desc: 'شاسی مستحکم زره‌پوش با پرچ‌های فولادی، گارد جلو و اگزوزهای عمودی' },
  { id: 'BATCAR', name: 'Phantom Stealth', nameFa: 'فانتوم استلث (Batcar)', sub: 'موشک زاویه‌دار', icon: 'flame', desc: 'طراحی لبه‌دار استلث بدون کروم با موتور جت خروجی و باله‌های پروانه‌ای' },
  { id: 'VANGUARD', name: 'Vanguard Van', nameFa: 'ونوانگارد پنل (Vanguard)', sub: 'ون مسابقه‌ای مرتفع', icon: 'truck', desc: 'سقف مرتفع و جادار با نردبان عقب و باله انتهایی سقفی' },
  { id: 'NOCTURNE', name: 'Nocturne Exotic', nameFa: 'نوکتورن اگزوتیک (Nocturne)', sub: 'کانوپی جتی', icon: 'zap', desc: 'کابین شیشه‌ای خلبانی یکپارچه با باله کوسه‌ای مرکزی و موتور جت عقب' },
  { id: 'BRAWLER', name: 'Brawler V8 Muscle', nameFa: 'برولر V8 عضلانی (Brawler)', sub: 'ماسل کار کلاسیک', icon: 'flame', desc: 'موتور سوپرشارژر خروجی از کاپوت، اگزوزهای جانبی و صدای طنین‌انداز V8' },
  { id: 'PALADIN', name: 'Paladin Heavy', nameFa: 'پالادین آفرود (Paladin)', sub: 'شاسی‌بلند آفرود', icon: 'shield', desc: 'رول‌کیج فلزی ضخیم، لایت‌بار نئونی سقفی و تایرهای آفرود غول‌پیکر' },
  { id: 'BREAKER', name: 'Breaker Wedge', nameFa: 'بریکر وِج (Breaker)', sub: 'تیغه شیرجه‌ای', icon: 'car', desc: 'دماغه شیب‌دار نزدیک به زمین با دیفیوزر ۷ پره و باله GT' },
  { id: 'RALLYHAWK', name: 'Rally Hawk', nameFa: 'رالی هاوک (Rally Hawk)', sub: 'هاشبک رالی شن', icon: 'zap', desc: 'شاسی سفت و مرتفع با گل‌پخش‌کن‌های مسابقه‌ای و پروژکتورهای رالی' },
  { id: 'ZEPHYR', name: 'Zephyr Speedster', nameFa: 'زفیر اسپیدستر (Zephyr)', sub: 'کابین روباز اسپرت', icon: 'sun', desc: 'رودستر بدون سقف با بادگیر جلوی شیشه‌ای و برآمدگی‌های صندلی عقب' },
  { id: 'CENTAUR', name: 'Centaur GT', nameFa: 'سنتاور تورر (Centaur)', sub: 'گرند تورر سنگین', icon: 'car', desc: 'کاپوت بسیار کشیده و لوکس با جلوپنجره کروم و اگزوزهای چهارگانه' },
  { id: 'HORNET', name: 'Hornet Kei Racer', nameFa: 'هورنت کی (Hornet)', sub: 'کوچک و فوق‌العاده سریع', icon: 'sparkles', desc: 'بدنه فشرده و چابک با باله عقب مرتفع و تسلط کامل در هوا' },
  { id: 'DRAGLINE', name: 'Dragline Rocket', nameFa: 'درگلاین موشکی (Dragline)', sub: 'درگستر چرخ عقب غول‌پیکر', icon: 'flame', desc: 'فاصله محوری بسیار زیاد، تایرهای عقب پهن درگ و ویلی‌بار تعادل' },
  { id: 'AEROWING', name: 'Aerowing LMP', nameFa: 'آیرووینگ لمانز (Aerowing)', sub: 'استقامت لمانز', icon: 'shield', desc: 'بدنه آیرودینامیک لمانز با باله قوی کوسه‌ای و اسپلیتر عریض جلویی' },
  { id: 'VOLTAIC', name: 'Voltaic EV One', nameFa: 'ولتاپک الکتریکی (Voltaic)', sub: 'مفهومی نئونی الکتریکی', icon: 'zap', desc: 'طراحی نئونی آینده‌نگر با نوارهای نوری سرتاسری و خروجی‌های هوای درخشان' }
];

export var CAR_WHEEL_DEFS = [
  { id: 'SPORT', name: 'Falcon Star', nameFa: 'فالکون استار ۵ پره', sub: 'پنج‌پره کروم', desc: '۵ پره پهن و مخروطی با لبه‌های تراش‌خورده و صیقلی کروم' },
  { id: 'VORTEX', name: 'Vortex Twist', nameFa: 'ورتکس توئیست ۶ پره', sub: 'مارپیچ آیرودینامیک', desc: '۶ پره منحنی چرخشی برای تخلیه هوای ترمز' },
  { id: 'TURBINE', name: 'Turbina Jet', nameFa: 'توربینی جت ۹ پره', sub: 'توربینی ریسینگ', desc: '۹ پره باریک با زاویه مایل جهت خنک‌کاری بهینه دیسک ترمز' },
  { id: 'DISH', name: 'Deep Dish Chrome', nameFa: 'دیپ دیش کروم', sub: 'لبه عمیق', desc: 'پره‌های فرورفته در عمق رینگ با لبه خارجی براق و برجسته' },
  { id: 'SPLIT_SIX', name: 'Split Six', nameFa: 'اسپلیت ۶ پره دوتایی', sub: 'دوتایی اسپرت', desc: '۶ جفت پره دوتایی متقاطع با سنترلاک تیتانیوم' },
  { id: 'WISHBONE', name: 'Wishbone Mesh', nameFa: 'ویش‌بون Y شکل', sub: 'سبک مسابقه‌ای', desc: '۵ پره دوشاخه جفتی فوق‌العاده سبک' },
  { id: 'MESH', name: 'Mesh Weave', nameFa: 'مش ویو ۱۰ پره', sub: 'شبکه‌ای مشبک', desc: '۱۰ پره متقاطع مشبک مسابقه‌ای با ۶ مهره تیتانیومی سنترلاک' },
  { id: 'BLADERUNNER', name: 'Bladerunner Carbon', nameFa: 'بلیدرانر فیبر کربن', sub: 'تیغه کربنی', desc: '۴ تیغه پهن آیرودینامیک با بافت فیبر کربن' },
  { id: 'WEBLINE', name: 'Webline', nameFa: 'وب‌لاین ۸ پره', sub: 'عنکبوتی ریسینگ', desc: 'پره‌های شعاعی متصل به الگوی تار عنکبوتی' },
  { id: 'OFFROAD', name: 'Cagework Heavy', nameFa: 'کِیج‌ورک سنگین', sub: 'عضلانی بیابانی', desc: '۶ پره ضخیم فوق‌العاده مستحکم با تایرهای بالونی عاج‌دار رالی' },
  { id: 'WIREPIN', name: 'Wirepin Classic', nameFa: 'وایربین ۱۶ پره سیمی', sub: 'کلاسیک سیمی', desc: '۱۶ پره سیمی با لکه‌گیری دست‌ساز' },
  { id: 'FANBLADE', name: 'Fanblade GT', nameFa: 'فن‌بلید GT', sub: 'پروانه‌ای خنک‌کننده', desc: '۷ پره پروانه‌ای با هوادهی بالای دیسک ترمز' },
  { id: 'CROSSHAIR', name: 'Crosshair Stealth', nameFa: 'کروس‌هیر استلث', sub: 'ضربدری تیره', desc: '۴ پره متقاطع با آلیاژ آلومینیوم دودی' },
  { id: 'HEXCORE', name: 'Hexcore Neon', nameFa: 'هگزکور نئونی', sub: 'شش‌ضلعی سایبری', desc: 'الگوی لانه زنبوری با حاشیه درخشان' },
  { id: 'SPIRALIS', name: 'Spiralis', nameFa: 'اسپیرالیس ۵ پره', sub: 'مارپیچ درخشان', desc: 'پره‌های چرخشی مایل با پوشش پودری' },
  { id: 'MONOLITH', name: 'Monolith Block', nameFa: 'مستحکم مونولیت', sub: 'بلوکی سنگین', desc: '۵ پره تکه‌تکه ضخیم برای ضربات سنگین' },
  { id: 'GOLDLINE', name: 'Goldline VIP', nameFa: 'گلدلاین VIP', sub: '۱۰ پره روکش طلا', desc: '۱۰ پره نازک با آبکاری طلای ۲۴ عیار' },
  { id: 'OBSIDIAN', name: 'Obsidian Black', nameFa: 'ابسیدین مات', sub: 'کریستالی تاریک', desc: 'رینگ کاملاً مشکی مات با زوایای کریستالی' },
  { id: 'CARBONITE', name: 'Carbonite Composite', nameFa: 'کربنیت کامپوزیت', sub: 'سبک‌وزن فیبر کربن', desc: 'تکنولوژی یکپارچه فیبر کربن مسابقات لمانز' },
  { id: 'TITANIX', name: 'Titanix Forged', nameFa: 'تایتانیکس فورج‌کن', sub: '👑 تیتانیوم ماشین‌کاری', desc: 'رینگ تیتانیومی نورد گرم با دیسک شیاردار' },
  { id: 'SLICKLINE', name: 'Slickline Racing', nameFa: 'اسلیک‌لاین پیست', sub: 'تایر اسلیک', desc: 'تایر کاملاً صاف اسلیک مخصوص پیست خشک' },
  { id: 'GRAVELKING', name: 'Gravelking Rally', nameFa: 'گراول‌کینگ شن', sub: 'عاج عمیق آفرود', desc: 'تایرهای عاج عمیق مخصوص رالی شن و گل' },
  { id: 'VGRIP', name: 'V-Grip Pro Rain', nameFa: 'وی-گریپ بارانی', sub: 'شیارهای V شکل', desc: 'تایر با شیارهای عمیق خروج سریع آب' },
  { id: 'DRIFTLINE', name: 'Driftline Speed', nameFa: 'دریفت‌لاین رنگی', sub: 'دیواره رنگی', desc: 'دیواره دور لاستیک رنگی مخصوص حرکات نمایشی' },
  { id: 'NEON_HALO', name: 'Neon Halo Glow', nameFa: 'نئون هالو درخشان', sub: '⚡ هالو نئونی', desc: 'رینگ مشکی با حلقه نئونی متحرک و درخشان' },
  { id: 'EMBER_SPAG', name: 'Ember Blaze', nameFa: 'امبر آتشین', sub: '🔥 پره‌های گداخته', desc: 'پره‌های متحرک با درخشش نارنجی نیترو' },
  { id: 'PLASMA_RING', name: 'Plasma Ring', nameFa: 'حلقه پلاسمای بنفش', sub: '⚛️ پلاسما نئون', desc: 'میدان مغناطیسی بنفش دور رینگ' },
  { id: 'CHRONOS', name: 'Chronos Dial', nameFa: 'کرونوس زمان', sub: '⏱️ عقربه‌ای متحرک', desc: 'طراحی شبیه صفحه ساعت مکانیکی' },
  { id: 'GYROLOOP', name: 'Gyroloop Light', nameFa: 'ژیروسکوپ نوری', sub: '🌀 ژیروسکوپ', desc: 'حلقه‌های متداخل شناور در هوا' },
  { id: 'VOIDSTAR', name: 'Voidstar Galaxy', nameFa: 'ویداستار سیاهچاله', sub: '🌌 سیاهچاله کیهانی', desc: 'مرکز تاریک جذبی با ستاره‌های پیرامون' },
  { id: 'PULSAR', name: 'Pulsar Beam', nameFa: 'پالسار پرتویی', sub: '💫 پالس رادیویی', desc: 'پرتوهای نوری درخشان تپنده' },
  { id: 'TURBOFAN', name: 'Turbofan Carbon', nameFa: 'فن توربو کربن', sub: '🌀 توربوفن', desc: 'دیسک تهویه هوای فرمول یک' },
  { id: 'CYCLONE_X', name: 'Cyclone X', nameFa: 'سایکولون گردباد', sub: '🌪️ گردباد ۵ پره', desc: 'پره‌های پیچیده شبیه گردباد' },
  { id: 'STARLANCE', name: 'Starlance Gold', nameFa: 'استارلنس طلایی', sub: '🌟 پره ستاره‌ای', desc: 'نوک پره‌های تیز شبیه ستاره' },
  { id: 'NEBULA', name: 'Nebula Swirl', nameFa: 'نبیولا کهکشانی', sub: '🌌 سدیم بنفش', desc: 'گردوغبار درخشان بنفش دور رینگ' },
  { id: 'FROSTBITE', name: 'Frostbite Crystal', nameFa: 'فراست‌بایت یخی', sub: '❄️ کریستال یخی', desc: 'پره‌های نوک‌تیز شفاف یخی' },
  { id: 'HELIXON', name: 'Helixon Spiral', nameFa: 'هلیکسون مارپیچ', sub: '🧬 دی‌ان‌ای', desc: 'پره‌های متداخل سه بعدی' },
  { id: 'VERTEX_R', name: 'Vertex R Triangle', nameFa: 'ورتکس مثلثی', sub: '📐 هندسی تیز', desc: 'سه پره مثلثی دوتایی' },
  { id: 'QUANTUM', name: 'Quantum Core', nameFa: 'کوانتوم کُر', sub: '⚛️ هسته کوانتوم', desc: 'هسته فیروزه‌ای درخشان نئونی' },
  { id: 'ZENITH', name: 'Zenith Crown', nameFa: 'زنیت پادشاهی', sub: '👑 تاج طلا', desc: 'طراحی لوکس پادشاهی با لبه طلا' }
];

export var COSMETICS_LIBRARY = [
  // --- HORNS / SPIKES (15) ---
  { id: 'CLASSIC_HORN', name: 'Classic Horn', nameFa: 'شاخ کلاسیک', category: 'horns', icon: 'shield', desc: 'شاخ‌های جفت کلاسیک روی کاپوت' },
  { id: 'SPIKE_HORN', name: 'Spike Horn', nameFa: 'شاخ تیغه‌ای', category: 'horns', icon: 'zap', desc: 'تیغه آیرودینامیک نوک‌تیز روی سقف' },
  { id: 'SPIRAL_HORN', name: 'Spiral Horn', nameFa: 'شاخ مارپیچ', category: 'horns', icon: 'disc', desc: 'شاخ‌های مارپیچ متمایل به جلو' },
  { id: 'DRAGON_HORN', name: 'Dragon Horn', nameFa: 'شاخ اژدها', category: 'horns', icon: 'flame', desc: 'شاخ‌های برجسته اژدهای باستانی' },
  { id: 'DEMON_HORNS', name: 'Demon Horns', nameFa: 'شاخ‌های شیطان', category: 'horns', icon: 'flame', desc: 'شاخ‌های قرمز و تیز شیطانی' },
  { id: 'UNICORN_HORN', name: 'Unicorn Horn', nameFa: 'شاخ تک‌شاخ', category: 'horns', icon: 'sparkles', desc: 'شاخ مارپیچ درخشان تک‌شاخ افسانه‌ای' },
  { id: 'DEVIL_HORNS', name: 'Devil Horns', nameFa: 'شاخ‌های دیو', category: 'horns', icon: 'flame', desc: 'شاخ‌های کوتاه نئونی گداخته' },
  { id: 'LIGHTNING_BOLT', name: 'Lightning Bolt', nameFa: 'صاعقه درخشان', category: 'horns', icon: 'zap', desc: 'صاعقه نئونی ایستاده روی کاپوت' },
  { id: 'CROWN', name: 'Crown Crest', nameFa: 'تاج سلطنتی کوچک', category: 'horns', icon: 'sparkles', desc: 'نشان تاج طلایی فشرده' },
  { id: 'FLAME_CREST', name: 'Flame Crest', nameFa: 'تاج آتشین', category: 'horns', icon: 'flame', desc: 'زبانه‌های آتش فلزی روی سقف' },
  { id: 'ICE_SPIKE', name: 'Ice Spike', nameFa: 'تیغه یخی', category: 'horns', icon: 'sun', desc: 'کریستال یخی نوک‌تیز شفاف' },
  { id: 'VOID_SPIKES', name: 'Void Spikes', nameFa: 'تیغه‌های خلاء', category: 'horns', icon: 'layers', desc: 'مجموعه تیغه‌های مشکی بنفش درخشان' },
  { id: 'LIGHT_RAY', name: 'Light Ray', nameFa: 'شعاع نوری', category: 'horns', icon: 'sun', desc: 'پرتو نوری عمودی شفاف' },
  { id: 'SHADOW_CREST', name: 'Shadow Crest', nameFa: 'تاج سایه', category: 'horns', icon: 'shield', desc: 'تاج زاویه‌دار استلث مشکی' },
  { id: 'LEAF_CROWN', name: 'Leaf Crown', nameFa: 'تاج برگ سبز', category: 'horns', icon: 'sun', desc: 'شاخه برگ‌های متقاطع سبز نئونی' },

  // --- HATS / TOPPERS (15) ---
  { id: 'BOWLER_HAT', name: 'Bowler Hat', nameFa: 'کلاه شاپو', category: 'hats', icon: 'disc', desc: 'کلاه شاپو کلاسیک با نوار قرمز' },
  { id: 'TOP_HAT', name: 'Top Hat', nameFa: 'کلاه سیلندر', category: 'hats', icon: 'layers', desc: 'کلاه بلند تشریفاتی سیلندر' },
  { id: 'BEANIE', name: 'Beanie', nameFa: 'کلاه بافتنی', category: 'hats', icon: 'sun', desc: 'کلاه زمستانی بافتنی اسپرت' },
  { id: 'ROYAL_CROWN', name: 'Royal Crown', nameFa: 'تاج پادشاهی', category: 'hats', icon: 'sparkles', desc: 'تاج طلایی بزرگ با جواهرات درخشان' },
  { id: 'PIRATE_HAT', name: 'Pirate Hat', nameFa: 'کلاه دزدان دریایی', category: 'hats', icon: 'shield', desc: 'کلاه سه‌گوش با نشان اسکلت' },
  { id: 'VIKING_HELM', name: 'Viking Helm', nameFa: 'کلاه وایکینگ', category: 'hats', icon: 'shield', desc: 'کلاهخود فلزی با شاخ‌های عریض' },
  { id: 'WIZARD_HAT', name: 'Wizard Hat', nameFa: 'کلاه جادوگر', category: 'hats', icon: 'sparkles', desc: 'کلاه مخروطی جادویی با ستاره‌های طلایی' },
  { id: 'POLICE_CAP', name: 'Police Cap', nameFa: 'کلاه پلیس', category: 'hats', icon: 'shield', desc: 'کلاه رسمی پلیس با نشان نقره‌ای' },
  { id: 'CHEF_HAT', name: 'Chef Hat', nameFa: 'کلاه آشپز', category: 'hats', icon: 'sun', desc: 'کلاه سفید و مرتفع سرآشپز' },
  { id: 'COWBOY_HAT', name: 'Cowboy Hat', nameFa: 'کلاه گاوچران', category: 'hats', icon: 'sun', desc: 'کلاه چرمی قهوه‌ای کاوبوی' },
  { id: 'SANTA_HAT', name: 'Santa Hat', nameFa: 'کلاه بابا نوئل', category: 'hats', icon: 'sparkles', desc: 'کلاه قرمز کریسمس با منگوله سفید' },
  { id: 'ALIEN_HEADGEAR', name: 'Alien Headgear', nameFa: 'کلاه فضایی', category: 'hats', icon: 'zap', desc: 'آنتن و کلاهخود سبز نئونی بیگانگان' },
  { id: 'HALO', name: 'Angel Halo', nameFa: 'هاله نورانی', category: 'hats', icon: 'sun', desc: 'حلقه شناور درخشان فرشته بالای سقف' },
  { id: 'FLOWER_CROWN', name: 'Flower Crown', nameFa: 'تاج گل', category: 'hats', icon: 'sun', desc: 'حلقه گل‌های رنگارنگ بهاری' },
  { id: 'ANTENNA_BALLS', name: 'Antenna Balls', nameFa: 'آنتن گوی‌دار', category: 'hats', icon: 'disc', desc: 'آنتن فلزی با دو گوی نئونی متحرک' },

  // --- TOOLS / WEAPONS (15) ---
  { id: 'GIANT_WRENCH', name: 'Giant Wrench', nameFa: 'آچار فرانسه غول‌پیکر', category: 'tools', icon: 'zap', desc: 'آچار فرانسه فلزی بزرگ روی سقف' },
  { id: 'BATTLE_AXE', name: 'Battle Axe', nameFa: 'تبر جنگی', category: 'tools', icon: 'shield', desc: 'تبر متقاطع دوتیغه فولادی' },
  { id: 'SWORD', name: 'Katana Sword', nameFa: 'شمشیر کاتانا', category: 'tools', icon: 'zap', desc: 'کاتانای سامورایی با غلاف مشکی' },
  { id: 'SLEDGEHAMMER', name: 'Sledgehammer', nameFa: 'پتک سنگین', category: 'tools', icon: 'layers', desc: 'پتک فولادی غول‌پیکر' },
  { id: 'MINI_ROCKET', name: 'Mini Rocket', nameFa: 'موشک فشرده', category: 'tools', icon: 'flame', desc: 'راکت کوچک با باله‌های هدایت' },
  { id: 'BATTLE_SHIELD', name: 'Battle Shield', nameFa: 'سپر دفاعی', category: 'tools', icon: 'shield', desc: 'سپر فولادی با نماد شیر' },
  { id: 'MAGIC_STAFF', name: 'Magic Staff', nameFa: 'عصای جادویی', category: 'tools', icon: 'sparkles', desc: 'عصای جادوگر با کریستال بنفش شناور' },
  { id: 'LANCE', name: 'Jousting Lance', nameFa: 'نیزه مسابقه', category: 'tools', icon: 'zap', desc: 'نیزه شوالیه با گارد فلزی' },
  { id: 'CROSSBOW', name: 'Crossbow', nameFa: 'کمان زنبورکی', category: 'tools', icon: 'shield', desc: 'کمان مکانیکی با تیر آماد' },
  { id: 'BLASTER', name: 'Laser Blaster', nameFa: 'تفنگ لیزری', category: 'tools', icon: 'zap', desc: 'سلاح انرژی نئونی سایبری' },
  { id: 'BOW', name: 'Long Bow', nameFa: 'کمان تیراندازی', category: 'tools', icon: 'sun', desc: 'کمان سنتی چوبی' },
  { id: 'GRIM_SCYTHE', name: 'Grim Scythe', nameFa: 'داس مرگ', category: 'tools', icon: 'flame', desc: 'داس بزرگ مرگ با تیغه منحنی' },
  { id: 'CHAINSAW', name: 'Chainsaw', nameFa: 'اره برقی', category: 'tools', icon: 'zap', desc: 'اره برقی صنعتی با زنجیر فولادی' },
  { id: 'TENNIS_RACKET', name: 'Tennis Racket', nameFa: 'راکت تنیس', category: 'tools', icon: 'disc', desc: 'راکت تنیس با زه فلزی' },
  { id: 'ELECTRIC_GUITAR', name: 'Electric Guitar', nameFa: 'گیتار الکتریک', category: 'tools', icon: 'flame', desc: 'گیتار راک قرمز گداخته' },

  // --- WINGS / BOOSTERS (10) ---
  { id: 'ANGEL_WINGS', name: 'Angel Wings', nameFa: 'بال‌های فرشته', category: 'wings', icon: 'sparkles', desc: 'بال‌های سفید درخشان فرشته در طرفین' },
  { id: 'DEMON_WINGS', name: 'Demon Wings', nameFa: 'بال‌های دیو', category: 'wings', icon: 'flame', desc: 'بال‌های چرمی مشکی و قرمز شیطانی' },
  { id: 'BUTTERFLY_WINGS', name: 'Butterfly Wings', nameFa: 'بال‌های پروانه', category: 'wings', icon: 'sun', desc: 'بال‌های رنگارنگ نئونی پروانه' },
  { id: 'DRAGON_WINGS', name: 'Dragon Wings', nameFa: 'بال‌های اژدها', category: 'wings', icon: 'flame', desc: 'بال‌های عریض و فلس‌دار اژدها' },
  { id: 'JET_FLAMES', name: 'Jet Thrusters', nameFa: 'اگزوزهای جتی', category: 'wings', icon: 'flame', desc: 'دوتایی اگزوز جت در انتهای بدنه' },
  { id: 'ROCKET_THRUST', name: 'Rocket Booster', nameFa: 'بوستر موشکی', category: 'wings', icon: 'zap', desc: 'محفظه سوخت موشکی با خروجی نارنجی' },
  { id: 'HOVER_PACK', name: 'Hover Pack', nameFa: 'کوله‌پشتی پرواز', category: 'wings', icon: 'layers', desc: 'سیستم تعادل شناور نئونی' },
  { id: 'SAIL', name: 'Racing Sail', nameFa: 'بادبان مسابقه‌ای', category: 'wings', icon: 'sun', desc: 'بادبان فیبر کربن آیرودینامیک' },
  { id: 'VOID_WINGS', name: 'Void Wings', nameFa: 'بال‌های خلاء', category: 'wings', icon: 'sparkles', desc: 'بال‌های سایه‌ای شفاف بنفش' },
  { id: 'NEON_WINGS', name: 'Neon Cyber Wings', nameFa: 'بال‌های نئونی', category: 'wings', icon: 'zap', desc: 'بال‌های خطوط نوری فیروزه‌ای متحرک' }
];

export var CELEBRATION_EFFECTS = [
  { id: 'MASSIVE_EXPLOSION', name: 'Massive Explosion', nameFa: 'انفجار غول‌پیکر', color: '#ff3b00', icon: 'flame', desc: 'انفجار عظیم همراه با موج ضربه‌ای سهمگین و جرقه‌های طلایی' },
  { id: 'CONFETTI_BURST', name: 'Confetti Celebration', nameFa: 'بارش نقل و کاغذ رنگی', color: '#ec4899', icon: 'sparkles', desc: 'انفجار شاد کاغذهای رنگی و نقل‌های درخشان طلایی' },
  { id: 'FIREWORKS', name: 'Royal Fireworks', nameFa: 'آتش‌بازی جشن', color: '#38bdf8', icon: 'sun', desc: 'شلیک منورهای چندرنگ و نورافشانی آسمانی' },
  { id: 'RAINBOW_CASCADE', name: 'Rainbow Cascade', nameFa: 'آبشار رنگین‌کمان', color: '#a855f7', icon: 'sparkles', desc: 'حلقه‌های چندرنگ طیف نوری روان' },
  { id: 'DARK_VORTEX', name: 'Dark Void Vortex', nameFa: 'گرداب سیاه', color: '#8b5cf6', icon: 'layers', desc: 'مکش ذرات به داخل سیاهچاله بنفش' },
  { id: 'CRYSTAL_SHATTER', name: 'Crystal Shatter', nameFa: 'شکستن کریستال', color: '#06b6d4', icon: 'sun', desc: 'انفجار هزاران تکه کریستال شفاف درخشان' },
  { id: 'INFERNO_SURGE', name: 'Inferno Fire Surge', nameFa: 'فوران دوزخی', color: '#ef4444', icon: 'flame', desc: 'ستون‌های مستقیم آتش دوزخی از زمین' },
  { id: 'PLASMA_STORM', name: 'Plasma Energy Storm', nameFa: 'طوفان پلاسما', color: '#3b82f6', icon: 'zap', desc: 'جرقه‌های شعاعی صاعقه الکتریکی پلاسما' },
  { id: 'STARBURST', name: 'Supernova Starburst', nameFa: 'انفجار ستاره‌ای', color: '#eab308', icon: 'sparkles', desc: 'پرتوهای نوک‌تیز نورانی ستاره‌ای' },
  { id: 'VOID_COLLAPSE', name: 'Void Singularity', nameFa: 'فروپاشی خلاء', color: '#a855f7', icon: 'layers', desc: 'موج انقباضی و سپس انفجار بنفش' },
  { id: 'AURORA_LIGHTS', name: 'Aurora Borealis', nameFa: 'شفق قطبی', color: '#10b981', icon: 'sun', desc: 'پرده‌های موج‌دار نوری سبز و فیروزه‌ای' },
  { id: 'NUCLEAR_BLOOM', name: 'Atomic Bloom', nameFa: 'قارچ اتمی درخشان', color: '#f97316', icon: 'flame', desc: 'قارچ انرژی اتمی درخشان نارنجی' },
  { id: 'STELLAR_BIRTH', name: 'Stellar Birth', nameFa: 'تولد ستاره', color: '#f43f5e', icon: 'sparkles', desc: 'تولد گوی درخشان و تشعشعات خورشیدی' },
  { id: 'FROZEN_CRYSTALLINE', name: 'Frozen Glacial Burst', nameFa: 'انجماد کریستالی', color: '#38bdf8', icon: 'sun', desc: 'قندیل‌ها و ذرات برف و یخ ساطع‌شده' },
  { id: 'NEON_PULSE', name: 'Cyber Neon Pulse', nameFa: 'پالس نئونی', color: '#00f0ff', icon: 'zap', desc: 'حلقه‌های نئونی هم‌مرکز متسع شونده' },
  { id: 'MOONLIGHT_GLOW', name: 'Moonlight Glow', nameFa: 'تابش مهتاب', color: '#e2e8f0', icon: 'sparkles', desc: 'هاله نرم نقره‌ای همراه با غبار درخشان' },
  { id: 'SHADOW_CASCADE', name: 'Shadow Phantom', nameFa: 'آبشار سایه‌ها', color: '#334155', icon: 'layers', desc: 'امواج تاریک سایه‌گون خروشنده' },
  { id: 'GOLDEN_CASCADE', name: 'Golden Coin Shower', nameFa: 'بارش سکه‌های طلایی', color: '#eab308', icon: 'sun', desc: 'بارش هزاران سکه و شمش طلا' },
  { id: 'ACID_SPLASH', name: 'Toxic Acid Splash', nameFa: 'پاشش اسید درخشان', color: '#84cc16', icon: 'flame', desc: 'پاشش فواره‌ای مایع اسیدی سبز' },
  { id: 'QUANTUM_FLUX', name: 'Quantum Flux Rift', nameFa: 'شار کوانتومی', color: '#06b6d4', icon: 'zap', desc: 'شکاف‌های نوری کوانتومی متقاطع' }
];

export var OLD_CAR_DEFS = {
  bodies: [
    { id: 'OCTANE_OLD', name: 'Octane Legacy' },
    { id: 'STRIKER_OLD', name: 'Striker Classic' },
    { id: 'TITAN_OLD', name: 'Titan Van' },
    { id: 'RAPTOR_OLD', name: 'Raptor Truck' },
    { id: 'PHANTOM_OLD', name: 'Phantom Openwheel' },
    { id: 'MONSTER_OLD', name: 'Monster Truck' }
  ]
};

// 24 Distinct High-Quality Vinyl Decals / Liveries for Cars (with dynamic animated shaders & categories)
export var CAR_VINYL_DEFS = [
  // --- Category: Simple & Clean ---
  {
    id: 'CLEAN',
    name: 'Clean Solid',
    nameFa: 'بدنه ساده و فابریک',
    sub: 'خالص و متالیک',
    category: 'all',
    icon: 'sparkles',
    isAnimated: false,
    defaultColor: '#ffffff',
    emissiveBoost: 0.0,
    desc: 'رنگ بدنه یکدست و صیقلی بدون برچسب با درخشش بازتاب‌های نور محیطی'
  },
  // --- Category: Dragon & Mythical ---
  {
    id: 'DRAGON_FIRE',
    name: 'Mythic Dragon Fire',
    nameFa: 'اژدهای آتشین (پرتاب آتش)',
    sub: '🐲 پویا با پرتاب شعله',
    category: 'dragon',
    icon: 'flame',
    isAnimated: true,
    defaultColor: '#ff7700',
    emissiveBoost: 2.8,
    desc: 'طرح اژدهای حماسی با چشم درخشان روی کاپوت که شعله‌های متحرک آتش و جرقه‌های گداخته از دهانش به سمت عقب پرتاب می‌شوند'
  },
  {
    id: 'PHOENIX_BLAZE',
    name: 'Immortal Phoenix',
    nameFa: 'ققنوس آتشین جاودان',
    sub: '🔥 پویا و شعله‌ور',
    category: 'dragon',
    icon: 'flame',
    isAnimated: true,
    defaultColor: '#ffaa00',
    emissiveBoost: 2.4,
    desc: 'بال‌های باشکوه ققنوس آتشین که روی گلگیرها گسترده شده و امواج سوزان حرارتی از آن ساطع می‌شود'
  },
  // --- Category: Superheroes ---
  {
    id: 'HERO_SPIDER_WEB',
    name: 'Spider Hero Web',
    nameFa: 'تار عنکبوت ابرقهرمانی',
    sub: '🦸 نشان عنکبوت نئونی',
    category: 'hero',
    icon: 'shield',
    isAnimated: false,
    defaultColor: '#ffffff',
    emissiveBoost: 1.5,
    desc: 'طرح تار عنکبوت هندسی شگفت‌انگیز با نماد مرکزی عنکبوت درخشان روی کاپوت'
  },
  {
    id: 'HERO_LIGHTNING_BOLT',
    name: 'Thunderbolt Hero',
    nameFa: 'صاعقه رعدآسا قهرمان',
    sub: '⚡ پویا و پرانرژی',
    category: 'hero',
    icon: 'zap',
    isAnimated: true,
    defaultColor: '#ffd700',
    emissiveBoost: 2.6,
    desc: 'صاعقه غول‌پیکر ابرقهرمانی سبک شزم و فلش با هاله انرژی تپنده و پرانرژی'
  },
  {
    id: 'HERO_COSMIC_STAR',
    name: 'Cosmic Star Shield',
    nameFa: 'سپر ستاره کیهانی',
    sub: '⭐ پویا و چرخشی',
    category: 'hero',
    icon: 'sun',
    isAnimated: true,
    defaultColor: '#38bdf8',
    emissiveBoost: 2.2,
    desc: 'ستاره پنج‌پر ابرقهرمانی با حلقه‌های مداری محافظ کیهانی و موج‌های نورانی متحرک'
  },
  {
    id: 'HERO_BAT_WING',
    name: 'Dark Bat Knight',
    nameFa: 'بال خفاش شوالیه تاریکی',
    sub: '🦇 شارپ و زاویه‌دار',
    category: 'hero',
    icon: 'shield',
    isAnimated: false,
    defaultColor: '#facc15',
    emissiveBoost: 1.4,
    desc: 'نشان بال‌های خفاش شبح‌گون با لبه‌های نئونی شارپ و گوش‌های آیرودینامیک'
  },
  // --- Category: Cute & Kids & Arcade ---
  {
    id: 'CUTE_STARS_GALAXY',
    name: 'Kawaii Star Galaxy',
    nameFa: 'ستاره‌های کهکشانی کارتونی',
    sub: '✨ پویا با گرد و غبار رنگین‌کمان',
    category: 'cute',
    icon: 'sparkles',
    isAnimated: true,
    defaultColor: '#f472b6',
    emissiveBoost: 2.0,
    desc: 'ستاره‌های چشمک‌زن کارتونی و بامزه با دنباله امواج غبار کیهانی شاد و رنگارنگ'
  },
  {
    id: 'CUTE_MONSTER_SMILE',
    name: 'Playful Monster',
    nameFa: 'هیولای بامزه دندان‌دار',
    sub: '👾 کارتونی و خندان',
    category: 'cute',
    icon: 'smile',
    isAnimated: false,
    defaultColor: '#a855f7',
    emissiveBoost: 1.0,
    desc: 'لبخند بزرگ هیولای کارتونی با دندان‌های مثلثی بامزه و چشمان انیمیشنی درشت روی کاپوت'
  },
  {
    id: 'CUTE_CANDY_SWEETS',
    name: 'Sweet Candy Donut',
    nameFa: 'آب‌نبات و دونات رنگین‌کمان',
    sub: '🍩 خوشمزه و رنگارنگ',
    category: 'cute',
    icon: 'disc',
    isAnimated: false,
    defaultColor: '#ec4899',
    emissiveBoost: 1.2,
    desc: 'روکش دونات میوه‌ای با سس شکلاتی و ترافل‌های رنگین‌کمانی آب‌نباتی پخش‌شده روی سقف و بدنه'
  },
  {
    id: 'PIXEL_ARCADE_8BIT',
    name: 'Retro 8-Bit Arcade',
    nameFa: 'آرکید پیکسلی رترو ۸-بیتی',
    sub: '🕹️ پویا با کاراکترهای پیکسلی',
    category: 'cute',
    icon: 'layers',
    isAnimated: true,
    defaultColor: '#22c55e',
    emissiveBoost: 2.2,
    desc: 'سفینه‌های فضایی نوستالژیک مهاجمان فضایی و قلب‌های پیکسلی متحرک در سبک بازی‌های رترو'
  },
  {
    id: 'CUTE_PAW_PRINTS',
    name: 'Cute Animal Paws',
    nameFa: 'ردپای پنجه‌های پیشی و هاپو',
    sub: '🐾 ردپاهای انیمیشنی',
    category: 'cute',
    icon: 'disc',
    isAnimated: false,
    defaultColor: '#fb923c',
    emissiveBoost: 0.8,
    desc: 'ردپاهای بامزه پنجه‌های گربه و سگ که به صورت مایل از کاپوت تا سقف ماشین حرکت کرده‌اند'
  },
  // --- Category: Racing & High-Tech ---
  {
    id: 'LAVA_MAGMA',
    name: 'Volcanic Molten Magma',
    nameFa: 'گدازه‌های مذاب آتش‌فشان',
    sub: '🌋 پویا با پالس حرارتی',
    category: 'racing',
    icon: 'flame',
    isAnimated: true,
    defaultColor: '#ff3b00',
    emissiveBoost: 2.8,
    desc: 'شکاف‌های عمیق سنگ‌های آتش‌فشانی با جریان روان گدازه‌های مذاب تپنده و درخشان'
  },
  {
    id: 'QUANTUM_CIRCUIT',
    name: 'Quantum Microchip',
    nameFa: 'مدارهای کوانتومی پردازنده',
    sub: '💾 پویا با بسته‌های داده',
    category: 'racing',
    icon: 'layers',
    isAnimated: true,
    defaultColor: '#00f0ff',
    emissiveBoost: 2.2,
    desc: 'ردپای خطوط طلایی بردهای الکترونیکی با بسته‌های داده نورانی متحرک روی بدنه'
  },
  {
    id: 'NEON_TOKYO_DRIFT',
    name: 'Tokyo Neon Drift',
    nameFa: 'توکیو نایت دریفت',
    sub: '🎌 خطوط مسابقه‌ای مایل',
    category: 'racing',
    icon: 'zap',
    isAnimated: false,
    defaultColor: '#e11d48',
    emissiveBoost: 1.5,
    desc: 'خطوط زاویه‌دار و اسلش‌های مسابقات شبانه توکیو با نوارهای آیرودینامیک دوبل'
  },
  {
    id: 'RACING_STRIPES',
    name: 'GT Twin Stripes',
    nameFa: 'خطوط مسابقه‌ای دوبل',
    sub: 'کلاسیک GT',
    category: 'racing',
    icon: 'zap',
    isAnimated: false,
    defaultColor: '#ffffff',
    emissiveBoost: 0.0,
    desc: 'دو خط موازی عریض اسپرت در راستای کاپوت و سقف خودرو با لبه‌های کنتراست بالا'
  },
  {
    id: 'CYBER_GRID',
    name: 'Cyber Grid Pulse',
    nameFa: 'شبکه سایبری نئونی',
    sub: '⚡ پویا و متحرک',
    category: 'racing',
    icon: 'layers',
    isAnimated: true,
    defaultColor: '#00f0ff',
    emissiveBoost: 1.8,
    desc: 'شبکه خطوط ماتریس نئونی آینده‌نگر با پالس نورانی روان و متحرک روی بدنه'
  },
  {
    id: 'FLAME_SURGE',
    name: 'Blazing Flame Surge',
    nameFa: 'شعله‌های آتشین متحرک',
    sub: '⚡ پویا و متحرک',
    category: 'racing',
    icon: 'flame',
    isAnimated: true,
    defaultColor: '#ffaa00',
    emissiveBoost: 2.2,
    desc: 'زبانه‌های خروشان آتش ارگانیک که از دماغه ماشین به سمت عقب موج می‌زنند'
  },
  {
    id: 'LIGHTNING_STORM',
    name: 'Lightning Plasma',
    nameFa: 'صاعقه و پلاسمای الکتریکی',
    sub: '⚡ پویا و متحرک',
    category: 'racing',
    icon: 'zap',
    isAnimated: true,
    defaultColor: '#a855f7',
    emissiveBoost: 2.5,
    desc: 'شاخه صاعقه‌های الکتریکی پرانرژی متحرک که به صورت نئونی روی متریال ماشین جرقه می‌زنند'
  },
  {
    id: 'WAVE_FLOW',
    name: 'Holo Wave Stream',
    nameFa: 'امواج هولوگرافیک نئونی',
    sub: '⚡ پویا و متحرک',
    category: 'racing',
    icon: 'disc',
    isAnimated: true,
    defaultColor: '#00ffa3',
    emissiveBoost: 1.6,
    desc: 'امواج سینوسی هولوگرافیک لطیف و روان که در طول انحناهای بدنه جریان دارند'
  },
  {
    id: 'CARBON_HEX',
    name: 'Hex Honeycomb Carbon',
    nameFa: 'فیبر کربن شش‌ضلعی',
    sub: 'لانه زنبوری اسپرت',
    category: 'racing',
    icon: 'shield',
    isAnimated: false,
    defaultColor: '#222834',
    emissiveBoost: 0.0,
    desc: 'پترن سه‌بعدی فیبر کربن لانه زنبوری با انعکاس‌های نور متغیر تیتانیومی'
  },
  {
    id: 'CAMO_TACTICAL',
    name: 'Urban Tactical Camo',
    nameFa: 'کاموفلاژ شهری تاکتیکال',
    sub: 'چند ضلعی مدرن',
    category: 'racing',
    icon: 'layers',
    isAnimated: false,
    defaultColor: '#475569',
    emissiveBoost: 0.0,
    desc: 'طرح استتاری مدرن چند تکه با زوایای شکسته هندسی و بافت مسابقه‌ای'
  },
  {
    id: 'DIGITAL_MATRIX',
    name: 'Digital Rain Matrix',
    nameFa: 'کدهای بارانی دیجیتال',
    sub: '⚡ پویا و متحرک',
    category: 'racing',
    icon: 'sparkles',
    isAnimated: true,
    defaultColor: '#55ff00',
    emissiveBoost: 2.0,
    desc: 'جریان سقوط کدهای نئونی دیجیتالی که به صورت افقی در طول بدنه خودرو حرکت می‌کنند'
  },
  {
    id: 'SPEED_APEX',
    name: 'Apex Speed Wings',
    nameFa: 'بال‌های آیرودینامیک ایپکس',
    sub: 'شارپ و تهاجمی',
    category: 'racing',
    icon: 'flame',
    isAnimated: false,
    defaultColor: '#ffffff',
    emissiveBoost: 0.2,
    desc: 'خطوط تیز و پره‌های شکسته شبیه بال‌های جنگنده روی کاپوت و دیفیوزرهای کناری'
  },
  {
    id: 'SUNBURST_RAYS',
    name: 'Sunburst Radical Rays',
    nameFa: 'پرتوهای رادیکال خورشیدی',
    sub: 'پرتوهای زاویه‌دار',
    category: 'racing',
    icon: 'sun',
    isAnimated: false,
    defaultColor: '#ffd700',
    emissiveBoost: 0.3,
    desc: 'پرتوهای زاویه‌دار هندسی متمرکز که از مرکز به سمت لبه‌های گلگیر کشیده شده‌اند'
  }
];

export var CAR_PRESETS = [
  {
    id: "dragonInfernoFire",
    name: "Mythic Dragon Fire",
    nameFa: "اژدهای سرخ آتش‌خوار (Dragon Breath)",
    model: "STRIKER",
    wheel: "TURBINE",
    teamVariant: "RED",
    bodyColor: "#b80f1e",
    accentColor: "#140608",
    trimColor: "#ff9900",
    glassColor: "#150406",
    lightsColor: "#ffaa00",
    thrusterColor: "#ff3300",
    hubColor: "#ffaa00",
    wheelColor: "#0d0e12",
    metallic: 0.85,
    gloss: 0.98,
    flakes: 0.45,
    clearcoat: 0.98,
    vinyl: "DRAGON_FIRE",
    vinylColor: "#ff7700",
    vinylAnimated: true,
    vinylEmissive: 2.8
  },
  {
    id: "heroSpiderWeb",
    name: "Spider Hero Web",
    nameFa: "تیم آبی: قهرمان اسپایدر وب",
    model: "OCTANE",
    wheel: "SPORT",
    teamVariant: "BLUE",
    bodyColor: "#0b5cd6",
    accentColor: "#0a1324",
    trimColor: "#e61928",
    glassColor: "#040c1a",
    lightsColor: "#38bdf8",
    thrusterColor: "#00e5ff",
    hubColor: "#ffffff",
    wheelColor: "#090b0f",
    metallic: 0.70,
    gloss: 0.98,
    flakes: 0.35,
    clearcoat: 0.95,
    vinyl: "HERO_SPIDER_WEB",
    vinylColor: "#ffffff",
    vinylAnimated: false,
    vinylEmissive: 1.6
  },
  {
    id: "heroThunderFlash",
    name: "Thunderbolt Hero",
    nameFa: "تیم قرمز: صاعقه شزم فلش",
    model: "VORTEX",
    wheel: "MESH",
    teamVariant: "RED",
    bodyColor: "#d91424",
    accentColor: "#170709",
    trimColor: "#ffd700",
    glassColor: "#120305",
    lightsColor: "#ffd700",
    thrusterColor: "#ffcc00",
    hubColor: "#ffd700",
    wheelColor: "#0d0e12",
    metallic: 0.80,
    gloss: 0.96,
    flakes: 0.40,
    clearcoat: 0.98,
    vinyl: "HERO_LIGHTNING_BOLT",
    vinylColor: "#ffd700",
    vinylAnimated: true,
    vinylEmissive: 2.6
  },
  {
    id: "cuteKawaiiGalaxy",
    name: "Cute Kawaii Stars",
    nameFa: "کهکشان ستاره‌های کارتونی",
    model: "KART",
    wheel: "SPORT",
    teamVariant: "BLUE",
    bodyColor: "#2563eb",
    accentColor: "#1e1b4b",
    trimColor: "#f472b6",
    glassColor: "#0f172a",
    lightsColor: "#f472b6",
    thrusterColor: "#ec4899",
    hubColor: "#f472b6",
    wheelColor: "#111827",
    metallic: 0.50,
    gloss: 0.95,
    flakes: 0.60,
    clearcoat: 0.95,
    vinyl: "CUTE_STARS_GALAXY",
    vinylColor: "#f472b6",
    vinylAnimated: true,
    vinylEmissive: 2.0
  },
  {
    id: "retro8BitPixel",
    name: "8-Bit Retro Pixel",
    nameFa: "آرکید پیکسلی ۸-بیتی رترو",
    model: "HYPER",
    wheel: "AERO",
    teamVariant: "BLUE",
    bodyColor: "#0284c7",
    accentColor: "#082f49",
    trimColor: "#22c55e",
    glassColor: "#031c2e",
    lightsColor: "#22c55e",
    thrusterColor: "#4ade80",
    hubColor: "#22c55e",
    wheelColor: "#020617",
    metallic: 0.75,
    gloss: 0.96,
    flakes: 0.30,
    clearcoat: 0.90,
    vinyl: "PIXEL_ARCADE_8BIT",
    vinylColor: "#22c55e",
    vinylAnimated: true,
    vinylEmissive: 2.2
  },
  {
    id: "volcanicLavaMagma",
    name: "Volcanic Magma",
    nameFa: "تیم قرمز: گدازه‌های مذاب آتش‌فشان",
    model: "RAPTOR",
    wheel: "OFFROAD",
    teamVariant: "RED",
    bodyColor: "#991b1b",
    accentColor: "#180505",
    trimColor: "#ff4500",
    glassColor: "#150505",
    lightsColor: "#ff3b00",
    thrusterColor: "#ff2200",
    hubColor: "#ff4500",
    wheelColor: "#0a0a0f",
    metallic: 0.60,
    gloss: 0.92,
    flakes: 0.40,
    clearcoat: 0.92,
    vinyl: "LAVA_MAGMA",
    vinylColor: "#ff3b00",
    vinylAnimated: true,
    vinylEmissive: 2.8
  },
  {
    id: "blueChampionApex",
    name: "Blue Team Apex",
    nameFa: "تیم آبی: قهرمان ایپکس",
    model: "OCTANE",
    wheel: "SPORT",
    teamVariant: "BLUE",
    bodyColor: "#1062e6",
    accentColor: "#0f1624",
    trimColor: "#ffffff",
    glassColor: "#060d1a",
    lightsColor: "#38bdf8",
    thrusterColor: "#00e5ff",
    hubColor: "#d5dadf",
    wheelColor: "#101216",
    metallic: 0.70,
    gloss: 0.98,
    flakes: 0.35,
    clearcoat: 0.95,
    vinyl: "SPEED_APEX",
    vinylColor: "#ffffff",
    vinylAnimated: false,
    vinylEmissive: 0.2
  },
  {
    id: "redInfernoFlames",
    name: "Red Team Inferno Flames",
    nameFa: "تیم قرمز: زبانه‌های آتشین",
    model: "VORTEX",
    wheel: "TURBINE",
    teamVariant: "RED",
    bodyColor: "#e61928",
    accentColor: "#1a0b0d",
    trimColor: "#ffd700",
    glassColor: "#1a0608",
    lightsColor: "#ff7700",
    thrusterColor: "#ff3300",
    hubColor: "#ffd700",
    wheelColor: "#0d0e12",
    metallic: 0.65,
    gloss: 0.96,
    flakes: 0.30,
    clearcoat: 0.95,
    vinyl: "FLAME_SURGE",
    vinylColor: "#ffaa00",
    vinylAnimated: true,
    vinylEmissive: 2.2
  },
  {
    id: "blueCyberPulse",
    name: "Blue Team Cyber Pulse",
    nameFa: "تیم آبی: شبکه سایبری نئونی",
    model: "HYPER",
    wheel: "AERO",
    teamVariant: "BLUE",
    bodyColor: "#0b4ec7",
    accentColor: "#091220",
    trimColor: "#00f0ff",
    glassColor: "#040b17",
    lightsColor: "#00f0ff",
    thrusterColor: "#00d2ff",
    hubColor: "#00f0ff",
    wheelColor: "#080b10",
    metallic: 0.85,
    gloss: 0.98,
    flakes: 0.45,
    clearcoat: 1.00,
    vinyl: "CYBER_GRID",
    vinylColor: "#00f0ff",
    vinylAnimated: true,
    vinylEmissive: 2.0
  },
  {
    id: "blueHoloWave",
    name: "Blue Team Holo Wave",
    nameFa: "تیم آبی: امواج هولوگرافیک",
    model: "PHANTOM",
    wheel: "TURBINE",
    teamVariant: "BLUE",
    bodyColor: "#0e56d4",
    accentColor: "#0a1324",
    trimColor: "#00ffa3",
    glassColor: "#040d1c",
    lightsColor: "#00ffa3",
    thrusterColor: "#00ffa3",
    hubColor: "#00ffa3",
    wheelColor: "#090c12",
    metallic: 0.75,
    gloss: 0.96,
    flakes: 0.40,
    clearcoat: 0.95,
    vinyl: "WAVE_FLOW",
    vinylColor: "#00ffa3",
    vinylAnimated: true,
    vinylEmissive: 1.8
  },
  {
    id: "stealthCarbonGT",
    name: "Stealth Carbon GT",
    nameFa: "کربن سیاه هگز مسابقه‌ای",
    model: "TITAN",
    wheel: "DISH",
    teamVariant: "BLUE",
    bodyColor: "#12151c",
    accentColor: "#0a0c10",
    trimColor: "#38bdf8",
    glassColor: "#05070a",
    lightsColor: "#38bdf8",
    thrusterColor: "#0ea5e9",
    hubColor: "#334155",
    wheelColor: "#08090c",
    metallic: 0.40,
    gloss: 0.92,
    flakes: 0.15,
    clearcoat: 0.90,
    vinyl: "CARBON_HEX",
    vinylColor: "#1e293b",
    vinylAnimated: false,
    vinylEmissive: 0.0
  }
];



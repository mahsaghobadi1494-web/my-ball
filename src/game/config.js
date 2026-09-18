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
    driveAccel: 21.0,
    driveSpeedCap: 17.5,
    reverseAccel: 14.0,
    reverseSpeedCap: 10.0,
    brakeAccel: 28.0,
    coastDecel: 2.8,
    steerMax: 0.65,
    steerMin: 0.18,
    steerRate: 14.0,
    grip: 30.0,
    gripSlide: 5.5,
    slideRecover: 7.5,
    frictionCircle: 3.8,
    airDrag: 0.015,
    groundDrag: 0.006,
    stickAccel: 10.5,
    stickSpeedRef: 9.0,
    ballHitboxScaleX: 1.25,
    ballHitboxScaleY: 1.20,
    ballHitboxScaleZ: 1.25,
    carScale: 2.75,
    hitboxElevationOffset: 0.0,
    flipAntiSnag: 0.90,
    chassisRoundness: 0.15,
    ballBoxRoundness: 0.20,
    wheel: {
      radius: 0.157,
      rest: 0.07,
      travel: 0.08,
      stiffness: 165.0,
      damping: 18.0,
      maxRay: 0.45,
      attachY: -0.05,
      attachX: 0.355,
      attachZ: 0.415
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
    hx: 41.0,
    hz: 51.2,
    height: 20.5,
    fillet: 2.6,
    cornerFillet: 8.2,
    goalHalfW: 8.93,
    goalHeight: 6.42,
    goalDepth: 6.4,
    wallFriction: 0.55,
    wallRestitution: 0.30
  },
  match: {
    duration: 300,
    countdown: 3,
    goalReplay: 4.0,
    teamSize: 3,
    overtime: true
  },
  camera: {
    fov: 100, distance: 9.0, height: 2.45, stiffness: 1.0,
    ballcamHeight: 3.1, ballcamDistance: 9.6, shake: 1.0, speedZoom: 2.6, fovSpeed: 10,
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
    // Vehicle Material & Clearcoat Controls (Solid, high-gloss automotive lacquer without brushed/grainy flakes)
    carGloss: 0.96,
    carClearcoat: 0.95,
    carMetallic: 0.08,
    carFlakes: 0.00, // Zero brushed noise for pure mirror-smooth lacquer
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
    grassDensity: "HIGH", // "HYPER_DENSE" (5M) | "CINEMATIC_MAX" (3M) | "EXTREME" (1.5M) | "ULTRA_DENSE" (750k) | "ULTRA" (350k) | "HIGH" (150k) | "BALANCED" (60k) | "LOW" (25k)
    grassBladeCount: 150000,
    grassBladeWidth: 1.00, // Blade thickness / width factor (0.2x to 4.0x)
    grassHeight: 0.65, // in meters
    grassWindSpeed: 1.4,
    grassWaveStrength: 0.85,
    grassTremble: 0.80, // flutter jitter
    grassTipCreaminess: 0.95, // Soft creamy warm golden sunlight tips
    grassSubsurface: 0.75, // Soft light translucency
    // Animated Stadium Spectator Crowds & Mexican Wave
    crowdAnimation: true,
    crowdEnergy: 1.0 // Cheering wave and jump height intensity
  },
  input: { steerSens: 1.0, airSens: 1.0, deadzone: 0.15 },
  debug: { showHitboxes: false }
};

export var STADIUM_THEMES = {
  NEON_CHAMPIONSHIP: {
    id: "NEON_CHAMPIONSHIP",
    name: "Daylight Grand Championship",
    subName: "Open Air Daylight Stadium",
    badge: "DAYLIGHT",
    turfBase: "#194c25",
    turfStripe1: "#226332",
    turfStripe2: "#1c542a",
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
    turfBase: "#184f29",
    turfStripe1: "#236737",
    turfStripe2: "#1d582f",
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

// Auto-load config if present
if (typeof window !== "undefined") {
  loadSavedConfig();
}

export var TEAM = { PULSE: 0, VOLT: 1 };
export var TEAM_NAME = ["Pulse", "Volt"];
export var TEAM_COLOR = [[1.0, 0.20, 0.52], [0.60, 0.98, 0.28]];
export var BOT_NAMES = [["Kestrel", "Mako"], ["Vector", "Onyx", "Halcyon"]];

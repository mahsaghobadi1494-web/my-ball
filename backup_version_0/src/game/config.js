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
    jump: { impulse: 3.15, holdAccel: 15.5, holdTime: 0.22, cooldown: 0.10, doubleWindow: 1.5, dodgeWindow: 1.5 },
    dodge: { speed: 8.5, upSpeed: 1.6, angRate: 13.5, duration: 0.52, deadzone: 0.20, flickTorque: 1.45, flickSurge: 1.35 },
    air: { pitch: 16.0, yaw: 12.5, roll: 46.0, damp: 3.2, rollDamp: 5.2 },
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
    carReaction: 0.26
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
  gfx: { renderScale: 1, particles: 1, shadows: true },
  input: { steerSens: 1.0, airSens: 1.0, deadzone: 0.15 },
  debug: { showHitboxes: false }
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

// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Sliders,
  RotateCcw,
  Save,
  Check,
  Zap,
  Gauge,
  CircleDot,
  X,
  Sparkles,
  Flame,
  Wind,
  Disc,
  Box,
  Eye,
  EyeOff,
  ArrowUpRight,
  Minimize2,
  Maximize2,
  Plus,
  Minus,
  Layers,
  Sun,
  Lightbulb,
  Palette,
  Activity,
  Shield,
  Camera
} from "lucide-react";
import { CFG, DEFAULT_CFG, saveCurrentConfig, deepMerge, STADIUM_THEMES, saveZeroPreset, loadZeroPreset, hasZeroPreset } from "../game/config.js";

export function RealTimeTuningPanel({ engineRef, onConfigChange, isOpen, onClose, initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || "graphics"); // 'graphics' | 'hitbox' | 'wheels' | 'flip' | 'air' | 'boost' | 'ball' | 'presets'
  const [isMinimized, setIsMinimized] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Sync values from current CFG
  const getInitialValues = () => ({
    // 0. Hitbox & Debug
    showHitboxes: !!(CFG.debug && CFG.debug.showHitboxes),
    chassisHx: CFG.vehicle.hx,
    chassisHy: CFG.vehicle.hy,
    chassisHz: CFG.vehicle.hz,
    hitboxElevationOffset: CFG.vehicle.hitboxElevationOffset !== undefined ? CFG.vehicle.hitboxElevationOffset : 0.0,
    flipAntiSnag: CFG.vehicle.flipAntiSnag !== undefined ? CFG.vehicle.flipAntiSnag : 0.90,
    carScale: CFG.vehicle.carScale !== undefined ? CFG.vehicle.carScale : 2.75,
    comOffsetY: CFG.vehicle.comOffsetY,
    stickAccel: CFG.vehicle.stickAccel,
    ballHitboxScaleX: CFG.vehicle.ballHitboxScaleX || 1.25,
    ballHitboxScaleY: CFG.vehicle.ballHitboxScaleY || 1.20,
    ballHitboxScaleZ: CFG.vehicle.ballHitboxScaleZ || 1.25,
    chassisRoundness: CFG.vehicle.chassisRoundness !== undefined ? CFG.vehicle.chassisRoundness : 0.15,
    ballBoxRoundness: CFG.vehicle.ballBoxRoundness !== undefined ? CFG.vehicle.ballBoxRoundness : 0.20,
    ballKickScale: CFG.ball.kickScale || 1.25,
    ballRestitutionCar: CFG.ball.restitutionCar || 0.62,
    ballCarReaction: CFG.ball.carReaction !== undefined ? CFG.ball.carReaction : 0.04,
    ballCarAngularReaction: CFG.ball.carAngularReaction !== undefined ? CFG.ball.carAngularReaction : 0.02,

    // Camera Settings
    cameraFov: CFG.camera.fov || 100,
    cameraDistance: CFG.camera.distance || 9.0,
    cameraHeight: CFG.camera.height || 2.45,
    cameraPitch: CFG.camera.pitch !== undefined ? CFG.camera.pitch : 12,
    cameraStiffness: CFG.camera.stiffness || 1.0,
    cameraSpeedZoom: CFG.camera.speedZoom !== undefined ? CFG.camera.speedZoom : 2.6,

    // 1. Wheels & Suspension
    wheelRadius: CFG.vehicle.wheel.radius,
    wheelRest: CFG.vehicle.wheel.rest,
    wheelTravel: CFG.vehicle.wheel.travel,
    wheelStiffness: CFG.vehicle.wheel.stiffness,
    wheelDamping: CFG.vehicle.wheel.damping,
    wheelDownforce: CFG.vehicle.wheel.downforce !== undefined ? CFG.vehicle.wheel.downforce : 12.0,
    grip: CFG.vehicle.grip,
    gripSlide: CFG.vehicle.gripSlide,
    steerRate: CFG.vehicle.steerRate,
    hideWheelFlaps: !!(CFG.vehicle.hideWheelFlaps),
    flapOffsetY: (CFG.vehicle.flapOffsetY !== undefined ? CFG.vehicle.flapOffsetY : 0.0),
    flapScale: (CFG.vehicle.flapScale !== undefined ? CFG.vehicle.flapScale : 1.0),
    flapWidthScale: (CFG.vehicle.flapWidthScale !== undefined ? CFG.vehicle.flapWidthScale : 1.0),
    flapThickScale: (CFG.vehicle.flapThickScale !== undefined ? CFG.vehicle.flapThickScale : 1.0),

    // 2. 360° Flips & Dodges
    dodgeAngRate: CFG.vehicle.dodge.angRate,
    dodgeDuration: CFG.vehicle.dodge.duration,
    dodgeSpeed: CFG.vehicle.dodge.speed,
    dodgeUpSpeed: CFG.vehicle.dodge.upSpeed,
    dodgeFlickTorque: CFG.vehicle.dodge.flickTorque || 1.45,
    dodgeFlickSurge: CFG.vehicle.dodge.flickSurge || 1.35,
    jumpImpulse: CFG.vehicle.jump.impulse,

    // 3. Air & Driving Control
    maxAirAngSpeed: (CFG.vehicle.air && CFG.vehicle.air.maxAirAngSpeed !== undefined) ? CFG.vehicle.air.maxAirAngSpeed : 5.5,
    airDamp: (CFG.vehicle.air && CFG.vehicle.air.damp !== undefined) ? CFG.vehicle.air.damp : 6.5,
    airPitch: CFG.vehicle.air.pitch,
    airYaw: CFG.vehicle.air.yaw,
    airRoll: CFG.vehicle.air.roll,
    driveAccel: CFG.vehicle.driveAccel,
    driveSpeedCap: CFG.vehicle.driveSpeedCap,
    steerSens: (CFG.input && CFG.input.steerSens !== undefined) ? CFG.input.steerSens : 1.0,
    steerMax: CFG.vehicle.steerMax !== undefined ? CFG.vehicle.steerMax : 0.55,
    steerMin: CFG.vehicle.steerMin !== undefined ? CFG.vehicle.steerMin : 0.28,

    // 4. Boost & Engine
    boostAccel: CFG.vehicle.boost.accel,
    boostSpeedCap: CFG.vehicle.boost.speedCap,
    boostConsume: CFG.vehicle.boost.consume,

    // 5. Ball & Arena
    ballRadius: CFG.ball.radius,
    ballRestitution: CFG.ball.restitution,
    gravity: CFG.physics.gravity,

    // 6. Graphics & Materials
    perfMode: (CFG.gfx && CFG.gfx.perfMode) || "BALANCED",
    stadiumTheme: (CFG.gfx && CFG.gfx.stadiumTheme) || "NEON_CHAMPIONSHIP",
    floodlightIntensity: (CFG.gfx && CFG.gfx.floodlightIntensity !== undefined) ? CFG.gfx.floodlightIntensity : 0.35,
    ambientLight: (CFG.gfx && CFG.gfx.ambientLight !== undefined) ? CFG.gfx.ambientLight : 0.85,
    sunIntensity: (CFG.gfx && CFG.gfx.sunIntensity !== undefined) ? CFG.gfx.sunIntensity : 0.90,
    pitchBrightness: (CFG.gfx && CFG.gfx.pitchBrightness !== undefined) ? CFG.gfx.pitchBrightness : 1.0,
    pitchContrast: (CFG.gfx && CFG.gfx.pitchContrast !== undefined) ? CFG.gfx.pitchContrast : 1.0,
    pitchRoughness: (CFG.gfx && CFG.gfx.pitchRoughness !== undefined) ? CFG.gfx.pitchRoughness : 0.35,

    // Vehicle Paint & Specular
    carGloss: (CFG.gfx && CFG.gfx.carGloss !== undefined) ? CFG.gfx.carGloss : 0.85,
    carClearcoat: (CFG.gfx && CFG.gfx.carClearcoat !== undefined) ? CFG.gfx.carClearcoat : 0.80,
    carMetallic: (CFG.gfx && CFG.gfx.carMetallic !== undefined) ? CFG.gfx.carMetallic : 0.40,
    carFlakes: (CFG.gfx && CFG.gfx.carFlakes !== undefined) ? CFG.gfx.carFlakes : 0.85,
    carBump: (CFG.gfx && CFG.gfx.carBump !== undefined) ? CFG.gfx.carBump : 0.90,
    carBumpStyle: (CFG.gfx && CFG.gfx.carBumpStyle) || "SPORTS_PANELS",
    carAmbientOcclusion: (CFG.gfx && CFG.gfx.carAmbientOcclusion !== undefined) ? CFG.gfx.carAmbientOcclusion : 0.85,
    shadowMapping: (CFG.gfx && CFG.gfx.shadowMapping !== undefined) ? CFG.gfx.shadowMapping : true,
    shadowSoftness: (CFG.gfx && CFG.gfx.shadowSoftness !== undefined) ? CFG.gfx.shadowSoftness : 1.0,

    // Ball Type & Material Bump
    ballType: (CFG.gfx && CFG.gfx.ballType) || "soccer",
    ballBrightness: (CFG.gfx && CFG.gfx.ballBrightness !== undefined) ? CFG.gfx.ballBrightness : 1.0,
    ballGloss: (CFG.gfx && CFG.gfx.ballGloss !== undefined) ? CFG.gfx.ballGloss : 0.70,
    ballBumpIntensity: (CFG.gfx && CFG.gfx.ballBumpIntensity !== undefined) ? CFG.gfx.ballBumpIntensity : 0.80,
    ballEmissiveGlow: (CFG.gfx && CFG.gfx.ballEmissiveGlow !== undefined) ? CFG.gfx.ballEmissiveGlow : 0.0,

    // 7. Dynamic 3D Grass & Crowd Atmosphere
    grassEnabled: (CFG.gfx && CFG.gfx.grassEnabled !== undefined) ? CFG.gfx.grassEnabled : true,
    grassDensity: (CFG.gfx && CFG.gfx.grassDensity) || "ULTRA_DENSE",
    grassBladeCount: (CFG.gfx && CFG.gfx.grassBladeCount) || 750000,
    grassBladeWidth: (CFG.gfx && CFG.gfx.grassBladeWidth !== undefined) ? CFG.gfx.grassBladeWidth : 1.25,
    grassHeight: (CFG.gfx && CFG.gfx.grassHeight !== undefined) ? CFG.gfx.grassHeight : 0.65,
    grassWindSpeed: (CFG.gfx && CFG.gfx.grassWindSpeed !== undefined) ? CFG.gfx.grassWindSpeed : 1.4,
    grassWaveStrength: (CFG.gfx && CFG.gfx.grassWaveStrength !== undefined) ? CFG.gfx.grassWaveStrength : 0.85,
    grassTremble: (CFG.gfx && CFG.gfx.grassTremble !== undefined) ? CFG.gfx.grassTremble : 0.80,
    grassTipCreaminess: (CFG.gfx && CFG.gfx.grassTipCreaminess !== undefined) ? CFG.gfx.grassTipCreaminess : 1.00,
    grassSubsurface: (CFG.gfx && CFG.gfx.grassSubsurface !== undefined) ? CFG.gfx.grassSubsurface : 0.80,
    boostPadHeightOffset: (CFG.gfx && CFG.gfx.boostPadHeightOffset !== undefined) ? CFG.gfx.boostPadHeightOffset : 0.35,
    crowdAnimation: (CFG.gfx && CFG.gfx.crowdAnimation !== undefined) ? CFG.gfx.crowdAnimation : true,
    crowdEnergy: (CFG.gfx && CFG.gfx.crowdEnergy !== undefined) ? CFG.gfx.crowdEnergy : 1.0,

    // Stadium Lasers & Optical Beams
    laserBrightness: (CFG.gfx && CFG.gfx.laserBrightness !== undefined) ? CFG.gfx.laserBrightness : 0.45,
    laserThickness: (CFG.gfx && CFG.gfx.laserThickness !== undefined) ? CFG.gfx.laserThickness : 0.70,
    laserHaloRadius: (CFG.gfx && CFG.gfx.laserHaloRadius !== undefined) ? CFG.gfx.laserHaloRadius : 0.75,
    laserOpacity: (CFG.gfx && CFG.gfx.laserOpacity !== undefined) ? CFG.gfx.laserOpacity : 0.40,
    laserSpotRadius: (CFG.gfx && CFG.gfx.laserSpotRadius !== undefined) ? CFG.gfx.laserSpotRadius : 0.80
  });

  const [values, setValues] = useState(getInitialValues);

  useEffect(() => {
    if (isOpen) {
      setValues(getInitialValues());
    }
  }, [isOpen]);

  const updateParam = (key, val, updater) => {
    setValues(prev => ({ ...prev, [key]: val }));
    if (updater) {
      updater(val);
    }

    if (!CFG.gfx) CFG.gfx = {};
    if (!CFG.camera) CFG.camera = {};

    // Direct CFG Synchronization for instant visual reactivity
    if (key === "stadiumTheme") {
      CFG.gfx.stadiumTheme = val;
      if (engineRef?.current?.renderer) {
        engineRef.current.renderer.initTextures(engineRef.current.world?.arena);
      }
    }
    if (key === "ballType") {
      CFG.gfx.ballType = val;
      if (engineRef?.current?.renderer) {
        engineRef.current.renderer.initTextures(engineRef.current.world?.arena);
      }
    }
    if (key === "perfMode") CFG.gfx.perfMode = val;
    if (key === "floodlightIntensity") CFG.gfx.floodlightIntensity = val;
    if (key === "sunIntensity") CFG.gfx.sunIntensity = val;
    if (key === "ambientLight") CFG.gfx.ambientLight = val;
    if (key === "pitchBrightness") CFG.gfx.pitchBrightness = val;
    if (key === "pitchContrast") CFG.gfx.pitchContrast = val;
    if (key === "pitchRoughness") CFG.gfx.pitchRoughness = val;
    if (key === "shadowMapping") CFG.gfx.shadowMapping = val;
    if (key === "shadowSoftness") CFG.gfx.shadowSoftness = val;
    if (key === "grassEnabled") CFG.gfx.grassEnabled = val;
    if (key === "grassBladeCount") CFG.gfx.grassBladeCount = val;
    if (key === "grassBladeWidth") CFG.gfx.grassBladeWidth = val;
    if (key === "grassHeight") CFG.gfx.grassHeight = val;
    if (key === "grassDensity") CFG.gfx.grassDensity = val;
    if (key === "grassWindSpeed") CFG.gfx.grassWindSpeed = val;
    if (key === "grassWaveStrength") CFG.gfx.grassWaveStrength = val;
    if (key === "grassTipCreaminess") CFG.gfx.grassTipCreaminess = val;
    if (key === "grassSubsurface") CFG.gfx.grassSubsurface = val;
    if (key === "crowdAnimation") CFG.gfx.crowdAnimation = val;
    if (key === "crowdEnergy") CFG.gfx.crowdEnergy = val;

    if (key === "ballBrightness") CFG.gfx.ballBrightness = val;
    if (key === "ballBumpIntensity") CFG.gfx.ballBumpIntensity = val;
    if (key === "ballMetallic") CFG.gfx.ballMetallic = val;
    if (key === "ballGloss") CFG.gfx.ballGloss = val;
    if (key === "ballEmissiveGlow") CFG.gfx.ballEmissiveGlow = val;

    if (key === "carGloss") CFG.gfx.carGloss = val;
    if (key === "carClearcoat") CFG.gfx.carClearcoat = val;
    if (key === "carMetallic") CFG.gfx.carMetallic = val;
    if (key === "carFlakes") CFG.gfx.carFlakes = val;
    if (key === "carBump") CFG.gfx.carBump = val;
    if (key === "carBumpStyle") CFG.gfx.carBumpStyle = val;
    if (key === "carAmbientOcclusion") CFG.gfx.carAmbientOcclusion = val;

    // Lasers
    if (key === "laserBrightness") CFG.gfx.laserBrightness = val;
    if (key === "laserThickness") CFG.gfx.laserThickness = val;
    if (key === "laserHaloRadius") CFG.gfx.laserHaloRadius = val;
    if (key === "laserOpacity") CFG.gfx.laserOpacity = val;
    if (key === "laserSpotRadius") CFG.gfx.laserSpotRadius = val;

    // Camera Real-Time parameters
    if (key === "cameraFov") {
      CFG.camera.fov = val;
      if (engineRef?.current?.camera) engineRef.current.camera.fov = val;
    }
    if (key === "cameraDistance") {
      CFG.camera.distance = val;
      CFG.camera.ballcamDistance = val * 1.06;
    }
    if (key === "cameraHeight") {
      CFG.camera.height = val;
      CFG.camera.ballcamHeight = val + 0.65;
    }
    if (key === "cameraPitch") {
      CFG.camera.pitch = val;
    }
    if (key === "cameraStiffness") {
      CFG.camera.stiffness = val;
    }
    if (key === "cameraSpeedZoom") {
      CFG.camera.speedZoom = val;
    }

    // Flaps / Fender Arches
    if (key === "flapWidthScale") CFG.vehicle.flapWidthScale = val;
    if (key === "flapThickScale") CFG.vehicle.flapThickScale = val;
    if (key === "flapScale") CFG.vehicle.flapScale = val;
    if (key === "flapOffsetY") CFG.vehicle.flapOffsetY = val;
    if (key === "hideWheelFlaps") CFG.vehicle.hideWheelFlaps = val;

    // Steering Parameters
    if (key === "steerSens") {
      if (!CFG.input) CFG.input = {};
      CFG.input.steerSens = val;
    }
    if (key === "steerMax") {
      CFG.vehicle.steerMax = val;
    }
    if (key === "steerMin") {
      CFG.vehicle.steerMin = val;
    }

    // Sync with compiled Three.js engine objects if they exist
    if (window.teObj) {
      if (key === "chassisHx") window.teObj.hitbox.x = val * 280.95;
      if (key === "chassisHy") window.teObj.hitbox.y = val * 467.7;
      if (key === "chassisHz") window.teObj.hitbox.z = val * 61.28;
      if (key === "jumpImpulse") window.teObj.jumpImpulse = val * 100;
      if (key === "boostConsume") window.teObj.boostConsumption = val;
      if (key === "boostAccel") window.teObj.boostAccel = val * 100;
      if (key === "driveAccel") window.teObj.driveAccel = val * 100;
      if (key === "wheelRadius" && window.teObj.wheel) window.teObj.wheel.radius = val * 100;
    }
    if (window.keObj) {
      if (key === "ballRadius") {
        window.keObj.radius = val * 39.91;
        window.keObj.inertia = 0.7 * window.keObj.mass * window.keObj.radius * window.keObj.radius;
      }
      if (key === "ballRestitution") window.keObj.restitution = val;
      if (key === "ballRestitutionCar") window.keObj.restitutionCar = val;
    }
    if (window.KiObj) {
      if (key === "gravity") window.KiObj.gravity = val * 100;
    }

    // Update live world entities
    if (engineRef && engineRef.current && engineRef.current.world) {
      const world = engineRef.current.world;
      if (key === "wheelRadius" && world.cars) {
        world.cars.forEach(car => {
          if (car.wheels) {
            car.wheels.forEach(w => {
              w.radius = val;
            });
          }
        });
      }
      if (key === "ballRadius" && world.ball) {
        world.ball.radius = val;
        if (world.ball.body && typeof world.ball.body.setSphereInertia === "function") {
          world.ball.body.setSphereInertia(val);
        }
      }
      if ((key === "chassisHx" || key === "chassisHy" || key === "chassisHz" || key === "carScale") && world.cars) {
        world.cars.forEach(car => {
          if (car.body && typeof car.body.setBoxInertia === "function") {
            car.body.setBoxInertia(CFG.vehicle.hx, CFG.vehicle.hy, CFG.vehicle.hz, CFG.vehicle.inertiaScale);
          }
        });
      }
    }

    if (onConfigChange) {
      onConfigChange(key, val);
    }
  };

  const toggleHitboxVisualizer = () => {
    const nextState = !values.showHitboxes;
    if (!CFG.debug) CFG.debug = {};
    CFG.debug.showHitboxes = nextState;
    setValues(prev => ({ ...prev, showHitboxes: nextState }));
    if (onConfigChange) {
      onConfigChange("showHitboxes", nextState);
    }
  };

  const [zeroNotice, setZeroNotice] = useState("");
  const [hasZero, setHasZero] = useState(() => hasZeroPreset());

  const handleSaveZeroPreset = () => {
    saveZeroPreset();
    setHasZero(true);
    setZeroNotice("تغییرات صفر ذخیره شد!");
    setTimeout(() => setZeroNotice(""), 2500);
  };

  const handleLoadZeroPreset = () => {
    const loaded = loadZeroPreset();
    if (loaded) {
      setValues(getInitialValues());
      if (onConfigChange) onConfigChange();
      setZeroNotice("تنظیمات تغییرات صفر اعمال شد!");
      setTimeout(() => setZeroNotice(""), 2500);
    }
  };

  const handleSaveToStorage = () => {
    const success = saveCurrentConfig();
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const handleApplyPreset = (presetName) => {
    if (presetName === "octaneRL") {
      CFG.vehicle.hx = 0.42;
      CFG.vehicle.hy = 0.18;
      CFG.vehicle.hz = 0.59;
      CFG.vehicle.ballHitboxScaleX = 1.25;
      CFG.vehicle.ballHitboxScaleY = 1.20;
      CFG.vehicle.ballHitboxScaleZ = 1.25;
      CFG.ball.kickScale = 1.25;
      CFG.vehicle.wheel.radius = 0.157;
      CFG.vehicle.wheel.rest = 0.07;
      CFG.vehicle.dodge.angRate = 12.0;
      CFG.vehicle.air.maxAirAngSpeed = 5.5;
      CFG.vehicle.air.damp = 6.5;
      CFG.vehicle.air.rollDamp = 8.5;
    } else if (presetName === "giantStriker") {
      CFG.vehicle.hx = 0.52;
      CFG.vehicle.hy = 0.24;
      CFG.vehicle.hz = 0.72;
      CFG.vehicle.ballHitboxScaleX = 1.65;
      CFG.vehicle.ballHitboxScaleY = 1.50;
      CFG.vehicle.ballHitboxScaleZ = 1.65;
      CFG.ball.kickScale = 1.75;
      CFG.ball.restitutionCar = 0.78;
      CFG.vehicle.air.maxAirAngSpeed = 5.5;
    } else if (presetName === "monsterTruck") {
      CFG.vehicle.wheel.radius = 0.30;
      CFG.vehicle.wheel.rest = 0.16;
      CFG.vehicle.wheel.travel = 0.15;
      CFG.vehicle.wheel.stiffness = 190.0;
      CFG.vehicle.wheel.damping = 22.0;
      CFG.vehicle.grip = 36.0;
      CFG.vehicle.driveAccel = 25.0;
      CFG.vehicle.air.maxAirAngSpeed = 5.0;
    } else if (presetName === "proFlip") {
      CFG.vehicle.wheel.radius = 0.157;
      CFG.vehicle.dodge.angRate = 14.5;
      CFG.vehicle.dodge.duration = 0.50;
      CFG.vehicle.dodge.speed = 9.8;
      CFG.vehicle.dodge.upSpeed = 1.8;
      CFG.vehicle.dodge.flickTorque = 1.60;
      CFG.vehicle.dodge.flickSurge = 1.45;
      CFG.physics.maxAngSpeed = 28.0;
      CFG.vehicle.air.pitch = 18.0;
      CFG.vehicle.air.roll = 52.0;
      CFG.vehicle.air.yaw = 14.0;
      CFG.vehicle.air.maxAirAngSpeed = 6.0;
      CFG.vehicle.air.damp = 7.0;
      CFG.vehicle.air.rollDamp = 9.0;
    } else if (presetName === "freestyle") {
      CFG.vehicle.dodge.angRate = 12.0;
      CFG.vehicle.dodge.duration = 0.60;
      CFG.vehicle.air.pitch = 24.0;
      CFG.vehicle.air.roll = 65.0;
      CFG.vehicle.air.yaw = 16.0;
      CFG.vehicle.boost.accel = 16.0;
      CFG.vehicle.boost.speedCap = 32.0;
      CFG.physics.gravity = 5.8;
      CFG.vehicle.air.maxAirAngSpeed = 6.8;
      CFG.vehicle.air.damp = 6.0;
      CFG.vehicle.air.rollDamp = 8.0;
    }

    if (engineRef && engineRef.current && engineRef.current.world && engineRef.current.world.cars) {
      engineRef.current.world.cars.forEach(car => {
        if (car.wheels) {
          car.wheels.forEach(w => {
            w.radius = CFG.vehicle.wheel.radius;
          });
        }
        if (car.body && typeof car.body.setBoxInertia === "function") {
          car.body.setBoxInertia(CFG.vehicle.hx, CFG.vehicle.hy, CFG.vehicle.hz, CFG.vehicle.inertiaScale);
        }
      });
    }

    setValues(getInitialValues());
    if (onConfigChange) onConfigChange("preset", presetName);
  };

  const handleResetToDefaults = () => {
    deepMerge(CFG, DEFAULT_CFG);
    if (engineRef && engineRef.current && engineRef.current.world && engineRef.current.world.cars) {
      engineRef.current.world.cars.forEach(car => {
        if (car.wheels) {
          car.wheels.forEach(w => {
            w.radius = CFG.vehicle.wheel.radius;
          });
        }
        if (car.body && typeof car.body.setBoxInertia === "function") {
          car.body.setBoxInertia(CFG.vehicle.hx, CFG.vehicle.hy, CFG.vehicle.hz, CFG.vehicle.inertiaScale);
        }
      });
    }
    setValues(getInitialValues());
    saveCurrentConfig();
    if (onConfigChange) {
      onConfigChange("reset", true);
    }
  };

  const tabs = [
    { id: "camera", label: "دوربین (Camera)", icon: Camera, color: "text-cyan-400" },
    { id: "graphics", label: "گرافیک و نور (GFX)", icon: Sun, color: "text-amber-300" },
    { id: "hitbox", label: "هیت‌باکس‌ها (Boxes)", icon: Box, color: "text-amber-400" },
    { id: "wheels", label: "چرخ‌ها (Wheels)", icon: Disc, color: "text-emerald-400" },
    { id: "flip", label: "فلیپ ۳۶۰ (Flips)", icon: Flame, color: "text-[#ff3385]" },
    { id: "air", label: "کنترل هوا (Air R)", icon: Gauge, color: "text-[#99fa47]" },
    { id: "boost", label: "بوست و سرعت", icon: Zap, color: "text-amber-400" },
    { id: "ball", label: "توپ و فیزیک", icon: CircleDot, color: "text-sky-400" },
    { id: "presets", label: "پریست آماده", icon: Sparkles, color: "text-purple-400" }
  ];

  if (!isOpen) return null;

  return (
    <aside
      id="realtime-tuning-panel"
      aria-label="Game Settings & Hitbox Physics Tuning Panel"
      className="fixed top-16 right-3 sm:right-5 z-40 w-[340px] sm:w-[380px] pointer-events-auto select-none transition-all duration-300 animate-in fade-in slide-in-from-top-2"
    >
      {/* Sleek Floating Glass Card */}
      <div className="flex flex-col bg-neutral-950/94 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_15px_45px_rgba(0,0,0,0.85)] overflow-hidden text-neutral-100 max-h-[calc(100vh-80px)]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-neutral-900/95 via-neutral-900/80 to-neutral-950/95 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]">
              <Sliders className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold font-mono tracking-wide text-white">HITBOX & TUNING</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#99fa47] animate-pulse" />
              </div>
              <p className="text-[10px] text-neutral-400 font-mono leading-none">Live 240Hz Hitboxes & Physics</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(prev => !prev)}
              className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition"
              title={isMinimized ? "Expand [باز کردن]" : "Minimize [کوچک کردن]"}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition"
              title="Close [T / ESC]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Minimized Quick Bar */}
        {isMinimized ? (
          <div className="p-3 flex items-center justify-between bg-black/60 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 text-[11px]">پنل هیت‌باکس‌ها فعال است</span>
              {values.showHitboxes && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  وایرفریم روشن
                </span>
              )}
            </div>
            <button
              onClick={() => setIsMinimized(false)}
              className="px-2.5 py-1 bg-[#99fa47] text-neutral-950 rounded-lg font-bold text-[11px] shadow"
            >
              نمایش منو
            </button>
          </div>
        ) : (
          <>
            {/* Horizontal Tabs Strip */}
            <div className="flex items-center gap-1 p-1.5 bg-black/50 border-b border-white/10 overflow-x-auto no-scrollbar">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-mono font-medium transition-all shrink-0 ${
                      isActive
                        ? "bg-white/20 text-white border border-white/30 shadow-sm"
                        : "text-neutral-400 hover:text-neutral-200 hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Scrollable Sliders Body */}
            <div className="p-3.5 space-y-3.5 overflow-y-auto max-h-[420px] sm:max-h-[500px] bg-gradient-to-b from-neutral-950/60 to-black/80 font-sans">
              
              {/* ======================================================== */}
              {/* TAB 0: HITBOXES & VISUALIZER (هیت‌باکس‌ها و نمایش سه‌بعدی) */}
              {/* ======================================================== */}
              {activeTab === "hitbox" && (
                <div className="space-y-3">
                  
                  {/* Master 3D Wireframe Visualizer Toggle */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-neutral-900/90 to-neutral-900/90 border border-amber-500/40 shadow-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {values.showHitboxes ? (
                          <Eye className="w-4 h-4 text-amber-400 animate-pulse" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-neutral-400" />
                        )}
                        <div>
                          <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                            نمایش خطوط هیت‌باکس در بازی
                          </div>
                          <div className="text-[10px] text-neutral-400">3D Wireframe Visualizer</div>
                        </div>
                      </div>

                      <button
                        onClick={toggleHitboxVisualizer}
                        className={`px-3 py-1 rounded-xl text-xs font-bold font-mono transition-all border ${
                          values.showHitboxes
                            ? "bg-amber-400 text-neutral-950 border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.4)]"
                            : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-white/10"
                        }`}
                      >
                        {values.showHitboxes ? "روشن (ON)" : "خاموش (OFF)"}
                      </button>
                    </div>

                    {/* Color Legend when ON */}
                    <div className="pt-2 border-t border-white/10 grid grid-cols-3 gap-1 text-[10px] font-mono">
                      <div className="flex items-center gap-1 text-cyan-300 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-500/30">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                        <span>شاسی/زمین</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-300 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/30">
                        <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                        <span>ضربه توپ</span>
                      </div>
                      <div className="flex items-center gap-1 text-rose-300 bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-500/30">
                        <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
                        <span>توپ کروی</span>
                      </div>
                    </div>
                  </div>

                  {/* Overall Car Scale Slider (سایز کلی ماشین) */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/15 via-neutral-900/90 to-neutral-900/90 border border-cyan-500/40 shadow-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Box className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-white font-mono">سایز و مقیاس ماشین (Car Scale)</span>
                      </div>
                      <span className="text-cyan-300 font-mono font-bold text-xs px-2.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40">
                        {values.carScale.toFixed(2)}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1.00"
                      max="5.00"
                      step="0.05"
                      value={values.carScale}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("carScale", v, val => { CFG.vehicle.carScale = val; });
                      }}
                      className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <div className="text-[10px] text-neutral-400">
                      تغییر اندازه زنده مدل ۳D و هیت‌باکس ماشین (از ۱x تا ۵x)
                    </div>
                  </div>

                  {/* Section 1: Car-Ball Striking Hitbox (هیت‌باکس اختصاصی ضربه به توپ) */}
                  <div className="p-3 rounded-xl bg-neutral-900/80 border border-amber-500/30 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 font-mono">
                        <Layers className="w-3.5 h-3.5" />
                        <span>هیت‌باکس ضربه به توپ (Car-Ball Hitbox)</span>
                      </div>
                    </div>

                    {/* Scale X (Width) */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">مقیاس عرض ضربه به توپ (Width Scale X)</span>
                        <span className="text-amber-300 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-amber-500/30">
                          {values.ballHitboxScaleX.toFixed(2)}x
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.80"
                        max="2.50"
                        step="0.05"
                        value={values.ballHitboxScaleX}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("ballHitboxScaleX", v, val => { CFG.vehicle.ballHitboxScaleX = val; });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-amber-400"
                      />
                    </div>

                    {/* Scale Y (Height) */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">مقیاس ارتفاع ضربه به توپ (Height Scale Y)</span>
                        <span className="text-amber-300 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-amber-500/30">
                          {values.ballHitboxScaleY.toFixed(2)}x
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.80"
                        max="2.50"
                        step="0.05"
                        value={values.ballHitboxScaleY}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("ballHitboxScaleY", v, val => { CFG.vehicle.ballHitboxScaleY = val; });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-amber-400"
                      />
                    </div>

                    {/* Scale Z (Length) */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">مقیاس طول ضربه به توپ (Length Scale Z)</span>
                        <span className="text-amber-300 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-amber-500/30">
                          {values.ballHitboxScaleZ.toFixed(2)}x
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.80"
                        max="2.50"
                        step="0.05"
                        value={values.ballHitboxScaleZ}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("ballHitboxScaleZ", v, val => { CFG.vehicle.ballHitboxScaleZ = val; });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-amber-400"
                      />
                    </div>

                    {/* Ball Box Roundness (میزان گردی گوشه‌ها) */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">میزان گردی گوشه‌ها (Corner Roundness)</span>
                        <span className="text-amber-300 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-amber-500/30">
                          {(values.ballBoxRoundness * 100).toFixed(0)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.00"
                        max="1.00"
                        step="0.05"
                        value={values.ballBoxRoundness}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("ballBoxRoundness", v, val => { CFG.vehicle.ballBoxRoundness = val; });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-amber-400"
                      />
                      <div className="text-[10px] text-neutral-400">
                        0% = مکعب تیز کامل | 100% = گوشه‌های گرد و کروی
                      </div>
                    </div>

                    {/* Kick Power */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">قدرت شوت و پرتاب توپ (Kick Power)</span>
                        <span className="text-[#ff3385] font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-[#ff3385]/30">
                          {values.ballKickScale.toFixed(2)}x
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.60"
                        max="2.80"
                        step="0.05"
                        value={values.ballKickScale}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("ballKickScale", v, val => { CFG.ball.kickScale = val; });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-[#ff3385]"
                      />
                    </div>
                  </div>

                  {/* Section: Car Weight & Recoil Stabilization (وزن و ثبات ماشین در برابر ضربه توپ) */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 via-neutral-900/90 to-neutral-900/90 border border-emerald-500/40 shadow-lg space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 font-mono">
                        <Shield className="w-3.5 h-3.5" />
                        <span>وزن ماشین و پایداری در برابر توپ (Weight & Recoil)</span>
                      </div>
                      <span className="text-[10px] text-emerald-400/90 font-mono font-bold bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                        {values.ballCarReaction <= 0.05 ? "سنگین (سبک راکت لیگ)" : values.ballCarReaction < 0.20 ? "متعادل" : "سبک"}
                      </span>
                    </div>

                    {/* 1. Linear Recoil Slider */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-200">پس‌زدن خطی ماشین (Car Linear Recoil)</span>
                        <span className="text-emerald-300 font-mono font-bold text-[11px] bg-black/60 px-2 py-0.5 rounded border border-emerald-500/30">
                          {(values.ballCarReaction * 100).toFixed(0)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.00"
                        max="0.40"
                        step="0.01"
                        value={values.ballCarReaction}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("ballCarReaction", v, val => { CFG.ball.carReaction = val; });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-emerald-400"
                      />
                      <div className="flex items-center justify-between text-[10px] text-neutral-400">
                        <span>۰٪ = وزن بسیار بالا (بدون پس‌زدن)</span>
                        <span>۴۰٪ = ماشین سبک و پرتاب‌شونده</span>
                      </div>
                    </div>

                    {/* 2. Angular Deflection Slider */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-200">انحراف و چرخش جهت ماشین (Heading Deflection)</span>
                        <span className="text-emerald-300 font-mono font-bold text-[11px] bg-black/60 px-2 py-0.5 rounded border border-emerald-500/30">
                          {(values.ballCarAngularReaction * 100).toFixed(0)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.00"
                        max="0.30"
                        step="0.01"
                        value={values.ballCarAngularReaction}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("ballCarAngularReaction", v, val => { CFG.ball.carAngularReaction = val; });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-emerald-400"
                      />
                      <div className="text-[10px] text-neutral-400">
                        مقادیر کم (۰٪ تا ۳٪) مانع از انحراف و چرخش ناگهانی زاویه ماشین هنگام شوت و برخورد با توپ می‌شود.
                      </div>
                    </div>

                    {/* Quick Presets Buttons */}
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          updateParam("ballCarReaction", 0.04, val => { CFG.ball.carReaction = val; });
                          updateParam("ballCarAngularReaction", 0.02, val => { CFG.ball.carAngularReaction = val; });
                        }}
                        className={`px-2 py-1 rounded text-[10px] font-mono font-bold border transition ${
                          values.ballCarReaction <= 0.05
                            ? "bg-emerald-500/25 text-emerald-300 border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                            : "bg-neutral-800/80 text-neutral-400 border-white/5 hover:text-white"
                        }`}
                      >
                        راکتی (سنگین ۴٪)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateParam("ballCarReaction", 0.12, val => { CFG.ball.carReaction = val; });
                          updateParam("ballCarAngularReaction", 0.06, val => { CFG.ball.carAngularReaction = val; });
                        }}
                        className={`px-2 py-1 rounded text-[10px] font-mono font-bold border transition ${
                          values.ballCarReaction > 0.05 && values.ballCarReaction < 0.20
                            ? "bg-emerald-500/25 text-emerald-300 border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                            : "bg-neutral-800/80 text-neutral-400 border-white/5 hover:text-white"
                        }`}
                      >
                        متعادل (۱۲٪)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateParam("ballCarReaction", 0.26, val => { CFG.ball.carReaction = val; });
                          updateParam("ballCarAngularReaction", 0.15, val => { CFG.ball.carAngularReaction = val; });
                        }}
                        className={`px-2 py-1 rounded text-[10px] font-mono font-bold border transition ${
                          values.ballCarReaction >= 0.20
                            ? "bg-emerald-500/25 text-emerald-300 border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                            : "bg-neutral-800/80 text-neutral-400 border-white/5 hover:text-white"
                        }`}
                      >
                        کلاسیک (۲۶٪)
                      </button>
                    </div>
                  </div>

                  {/* Section 2: Chassis Physical Hitbox (هیت‌باکس شاسی ماشین با زمین و دیوار) */}
                  <div className="p-3 rounded-xl bg-neutral-900/80 border border-cyan-500/30 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 font-mono">
                        <Box className="w-3.5 h-3.5" />
                        <span>هیت‌باکس شاسی با زمین و دیوار (Chassis Box)</span>
                      </div>
                    </div>

                    {/* Chassis Width (hx) */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">عرض شاسی (Half-Width hx)</span>
                        <span className="text-cyan-300 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-cyan-500/30">
                          {(values.chassisHx * 200).toFixed(0)} cm
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.25"
                        max="0.75"
                        step="0.01"
                        value={values.chassisHx}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("chassisHx", v, val => { CFG.vehicle.hx = val; });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>

                    {/* Chassis Height (hy) */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">ارتفاع شاسی (Half-Height hy)</span>
                        <span className="text-cyan-300 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-cyan-500/30">
                          {(values.chassisHy * 200).toFixed(0)} cm
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.10"
                        max="0.45"
                        step="0.01"
                        value={values.chassisHy}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("chassisHy", v, val => { CFG.vehicle.hy = val; });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>

                    {/* Chassis Length (hz) */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">طول شاسی (Half-Length hz)</span>
                        <span className="text-cyan-300 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-cyan-500/30">
                          {(values.chassisHz * 200).toFixed(0)} cm
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.35"
                        max="1.10"
                        step="0.01"
                        value={values.chassisHz}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("chassisHz", v, val => { CFG.vehicle.hz = val; });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>

                    {/* Hitbox Ground Clearance / Elevation Offset */}
                    <div className="space-y-1 p-2 rounded-lg bg-cyan-950/30 border border-cyan-500/20">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-cyan-200 font-bold">فاصله هیت‌باکس از زمین (Ground Clearance Offset)</span>
                        <span className="text-cyan-300 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-cyan-500/30">
                          {values.hitboxElevationOffset >= 0 ? `+${(values.hitboxElevationOffset * 100).toFixed(1)}` : (values.hitboxElevationOffset * 100).toFixed(1)} cm
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-0.06"
                        max="0.08"
                        step="0.005"
                        value={values.hitboxElevationOffset}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("hitboxElevationOffset", v, val => { CFG.vehicle.hitboxElevationOffset = val; });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-cyan-400"
                      />
                      <div className="text-[10px] text-neutral-400">
                        افزایش این مقدار هیت‌باکس را بالاتر می‌برد تا در دابل‌جامپ و فلیپ‌های سریع به زمین گیر نکند.
                      </div>
                    </div>

                    {/* Anti-Snag / Ground Glide Assist */}
                    <div className="space-y-1 p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-200 font-bold">ضد گیر کردن شاسی به زمین در فلیپ (Anti-Snag Glide)</span>
                        <span className="text-emerald-300 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          {(values.flipAntiSnag * 100).toFixed(0)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.00"
                        max="1.00"
                        step="0.05"
                        value={values.flipAntiSnag}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("flipAntiSnag", v, val => { CFG.vehicle.flipAntiSnag = val; });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-emerald-400"
                      />
                      <div className="text-[10px] text-neutral-400">
                        در فلیپ‌های نزدیک زمین به جای چرخش وحشیانه، ماشین نرم روی سطح لیز می‌خورد (مشابه Wave Dash راکت لیگ).
                      </div>
                    </div>

                    {/* Standard Hitbox Presets */}
                    <div className="space-y-1 pt-1 border-t border-white/10">
                      <div className="text-[11px] font-bold text-neutral-300">پریست‌های استاندارد راکت لیگ:</div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            updateParam("chassisHx", 0.42, v => { CFG.vehicle.hx = v; });
                            updateParam("chassisHy", 0.18, v => { CFG.vehicle.hy = v; });
                            updateParam("chassisHz", 0.59, v => { CFG.vehicle.hz = v; });
                            updateParam("hitboxElevationOffset", 0.00, v => { CFG.vehicle.hitboxElevationOffset = v; });
                          }}
                          className="px-2 py-1.5 rounded-lg bg-neutral-800/90 hover:bg-neutral-700 text-left border border-white/10 text-[10px] font-mono text-cyan-300"
                        >
                          <div className="font-bold">Octane (اوکتان)</div>
                          <div className="text-neutral-400 text-[9px]">H: 36cm | تعادل کامل</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            updateParam("chassisHx", 0.41, v => { CFG.vehicle.hx = v; });
                            updateParam("chassisHy", 0.15, v => { CFG.vehicle.hy = v; });
                            updateParam("chassisHz", 0.63, v => { CFG.vehicle.hz = v; });
                            updateParam("hitboxElevationOffset", 0.02, v => { CFG.vehicle.hitboxElevationOffset = v; });
                          }}
                          className="px-2 py-1.5 rounded-lg bg-neutral-800/90 hover:bg-neutral-700 text-left border border-white/10 text-[10px] font-mono text-purple-300"
                        >
                          <div className="font-bold">Dominus (دومینوس)</div>
                          <div className="text-neutral-400 text-[9px]">H: 30cm | پاورشوت و فلیپ</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            updateParam("chassisHx", 0.43, v => { CFG.vehicle.hx = v; });
                            updateParam("chassisHy", 0.19, v => { CFG.vehicle.hy = v; });
                            updateParam("chassisHz", 0.59, v => { CFG.vehicle.hz = v; });
                            updateParam("hitboxElevationOffset", 0.01, v => { CFG.vehicle.hitboxElevationOffset = v; });
                          }}
                          className="px-2 py-1.5 rounded-lg bg-neutral-800/90 hover:bg-neutral-700 text-left border border-white/10 text-[10px] font-mono text-emerald-300"
                        >
                          <div className="font-bold">Fennec (فنک)</div>
                          <div className="text-neutral-400 text-[9px]">H: 38cm | باکسی و دقیق</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            updateParam("chassisHx", 0.43, v => { CFG.vehicle.hx = v; });
                            updateParam("chassisHy", 0.14, v => { CFG.vehicle.hy = v; });
                            updateParam("chassisHz", 0.64, v => { CFG.vehicle.hz = v; });
                            updateParam("hitboxElevationOffset", 0.03, v => { CFG.vehicle.hitboxElevationOffset = v; });
                          }}
                          className="px-2 py-1.5 rounded-lg bg-neutral-800/90 hover:bg-neutral-700 text-left border border-white/10 text-[10px] font-mono text-amber-300"
                        >
                          <div className="font-bold">Plank (بت‌موبایل)</div>
                          <div className="text-neutral-400 text-[9px]">H: 28cm | باریک و بلند</div>
                        </button>
                      </div>
                    </div>

                    {/* Chassis Roundness */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">گردی گوشه‌های شاسی (Corner Roundness)</span>
                        <span className="text-cyan-300 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-cyan-500/30">
                          {(values.chassisRoundness * 100).toFixed(0)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.00"
                        max="1.00"
                        step="0.05"
                        value={values.chassisRoundness}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("chassisRoundness", v, val => { CFG.vehicle.chassisRoundness = val; });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-cyan-400"
                      />
                      <div className="text-[10px] text-neutral-400">
                        0% = مستطیل تیز | 100% = کپسول گرد برای غلت زدن نرم روی دیوار و زمین
                      </div>
                    </div>

                    {/* Ground Stick Downforce */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">چسبندگی روی زمین و دیوار (Stick Downforce)</span>
                        <span className="text-white font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                          {values.stickAccel} m/s²
                        </span>
                      </div>
                      <input
                        type="range"
                        min="4.0"
                        max="24.0"
                        step="0.5"
                        value={values.stickAccel}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("stickAccel", v, val => { CFG.vehicle.stickAccel = val; });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 1: WHEELS & SUSPENSION (سایز چرخ‌ها) */}
              {/* ======================================================== */}
              {activeTab === "wheels" && (
                <div className="space-y-3">
                  {/* Wheel Radius (سایز چرخ) - Highlight Card */}
                  <div className="p-3 rounded-xl bg-neutral-900/90 border border-emerald-500/40 shadow-md space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Disc className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-white font-mono">سایز چرخ‌ها (Wheel Size)</span>
                      </div>
                      <span className="text-emerald-300 font-mono font-bold text-xs px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40">
                        {(values.wheelRadius * 100).toFixed(1)} cm
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0.08"
                      max="0.38"
                      step="0.005"
                      value={values.wheelRadius}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("wheelRadius", v, val => {
                          CFG.vehicle.wheel.radius = val;
                        });
                      }}
                      className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                    />

                    {/* Quick Wheel Size Badges */}
                    <div className="flex items-center justify-between gap-1 pt-1 border-t border-white/10">
                      <button
                        onClick={() => updateParam("wheelRadius", 0.157, v => { CFG.vehicle.wheel.radius = v; })}
                        className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-[10px] text-neutral-300 font-mono border border-white/10"
                      >
                        فابریک (15.7cm)
                      </button>
                      <button
                        onClick={() => updateParam("wheelRadius", 0.22, v => { CFG.vehicle.wheel.radius = v; })}
                        className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-[10px] text-emerald-300 font-mono border border-emerald-500/30"
                      >
                        اسپرت (22cm)
                      </button>
                      <button
                        onClick={() => updateParam("wheelRadius", 0.32, v => { CFG.vehicle.wheel.radius = v; })}
                        className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-[10px] text-amber-300 font-mono border border-amber-500/30"
                      >
                        مانستر (32cm)
                      </button>
                    </div>
                  </div>

                  {/* Wheel Flaps / Arches Configuration Card */}
                  <div className="p-3 rounded-xl bg-neutral-900/80 border border-emerald-500/30 shadow-md space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white font-mono">طاق/فلپ گلگیر چرخ‌ها (Wheel Flaps)</span>
                        </div>
                        <p className="text-[11px] text-neutral-400">
                          {values.hideWheelFlaps ? "فلپ‌ها کلاً مخفی هستند" : "فلپ‌ها فعال و قابل تنظیم هستند"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const next = !values.hideWheelFlaps;
                          updateParam("hideWheelFlaps", next, val => {
                            CFG.vehicle.hideWheelFlaps = val;
                          });
                        }}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          values.hideWheelFlaps ? "bg-red-500/80" : "bg-emerald-500"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                            values.hideWheelFlaps ? "translate-x-0" : "translate-x-5"
                          }`}
                        />
                      </button>
                    </div>

                    {!values.hideWheelFlaps && (
                      <div className="pt-2 border-t border-white/10 space-y-3">
                        {/* Flap Lateral Width */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-300 font-medium">سایز عرضی / پهنای فلپ (Width)</span>
                            <span className="text-emerald-400 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-emerald-500/20">
                              {((values.flapWidthScale || 1.0) * 100).toFixed(0)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.15"
                            max="2.00"
                            step="0.05"
                            value={values.flapWidthScale || 1.0}
                            onChange={e => {
                              const v = Number(e.target.value);
                              updateParam("flapWidthScale", v, val => {
                                CFG.vehicle.flapWidthScale = val;
                              });
                            }}
                            className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-emerald-400"
                          />
                          <div className="flex justify-between text-[9px] text-neutral-500 font-mono">
                            <span>بسیار باریک (15%)</span>
                            <span>پیش‌فرض (100%)</span>
                            <span>عریض و پهن (200%)</span>
                          </div>
                        </div>

                        {/* Flap Thickness */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-300 font-medium">کلفتی و ضخامت لایه فلپ (Thickness)</span>
                            <span className="text-emerald-400 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-emerald-500/20">
                              {((values.flapThickScale || 1.0) * 100).toFixed(0)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.15"
                            max="2.00"
                            step="0.05"
                            value={values.flapThickScale || 1.0}
                            onChange={e => {
                              const v = Number(e.target.value);
                              updateParam("flapThickScale", v, val => {
                                CFG.vehicle.flapThickScale = val;
                              });
                            }}
                            className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-emerald-400"
                          />
                          <div className="flex justify-between text-[9px] text-neutral-500 font-mono">
                            <span>بسیار نازک (15%)</span>
                            <span>پیش‌فرض (100%)</span>
                            <span>خیلی کلفت (200%)</span>
                          </div>
                        </div>

                        {/* Flap Scale / Size */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-300 font-medium">مقیاس کلی طاق (Overall Scale)</span>
                            <span className="text-white font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                              {(values.flapScale * 100).toFixed(0)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.40"
                            max="1.80"
                            step="0.05"
                            value={values.flapScale}
                            onChange={e => {
                              const v = Number(e.target.value);
                              updateParam("flapScale", v, val => {
                                CFG.vehicle.flapScale = val;
                              });
                            }}
                            className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-emerald-400"
                          />
                          <div className="flex justify-between text-[9px] text-neutral-500 font-mono">
                            <span>کوچک (40%)</span>
                            <span>عادی (100%)</span>
                            <span>بزرگ (180%)</span>
                          </div>
                        </div>

                        {/* Flap Vertical Offset */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-300 font-medium">ارتفاع فلپ (بالا / پایین)</span>
                            <span className="text-white font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                              {(values.flapOffsetY >= 0 ? "+" : "") + (values.flapOffsetY * 100).toFixed(1)} cm
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-0.08"
                            max="0.12"
                            step="0.005"
                            value={values.flapOffsetY}
                            onChange={e => {
                              const v = Number(e.target.value);
                              updateParam("flapOffsetY", v, val => {
                                CFG.vehicle.flapOffsetY = val;
                              });
                            }}
                            className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-emerald-400"
                          />
                          <div className="flex justify-between text-[9px] text-neutral-500 font-mono">
                            <span>پایین‌تر (-8cm)</span>
                            <span>پیش‌فرض (0)</span>
                            <span>بالاتر (+12cm)</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Suspension Height */}
                  <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-medium">ارتفاع تعلیق (Rest Height)</span>
                      <span className="text-white font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                        {(values.wheelRest * 100).toFixed(1)} cm
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.02"
                      max="0.22"
                      step="0.005"
                      value={values.wheelRest}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("wheelRest", v, val => { CFG.vehicle.wheel.rest = val; });
                      }}
                      className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-emerald-400"
                    />
                  </div>

                  {/* Downforce */}
                  <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-medium">نیروی رو به پایین (Downforce)</span>
                      <span className="text-white font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                        {values.wheelDownforce.toFixed(1)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="40.0"
                      step="0.5"
                      value={values.wheelDownforce}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("wheelDownforce", v, val => { CFG.vehicle.wheel.downforce = val; });
                      }}
                      className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-emerald-400"
                    />
                  </div>

                  {/* Suspension Stiffness */}
                  <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-medium">سفتی فنرها (Stiffness)</span>
                      <span className="text-white font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                        {values.wheelStiffness} N/m
                      </span>
                    </div>
                    <input
                      type="range"
                      min="80"
                      max="320"
                      step="5"
                      value={values.wheelStiffness}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("wheelStiffness", v, val => { CFG.vehicle.wheel.stiffness = val; });
                      }}
                      className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-emerald-400"
                    />
                  </div>

                  {/* Tire Grip */}
                  <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-medium">چسبندگی لاستیک (Grip)</span>
                      <span className="text-white font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                        {values.grip}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="12.0"
                      max="55.0"
                      step="1.0"
                      value={values.grip}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("grip", v, val => { CFG.vehicle.grip = val; });
                      }}
                      className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-white"
                    />
                  </div>

                  {/* Steering Rate */}
                  <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-medium">سرعت چرخش فرمان (Steering)</span>
                      <span className="text-white font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                        {values.steerRate}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="6.0"
                      max="30.0"
                      step="1.0"
                      value={values.steerRate}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("steerRate", v, val => { CFG.vehicle.steerRate = val; });
                      }}
                      className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-white"
                    />
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 2: 360 FLIPS & DODGES (فلیپ‌ها) */}
              {/* ======================================================== */}
              {activeTab === "flip" && (
                <div className="space-y-3">
                  {/* Flip Angular Speed */}
                  <div className="p-3 rounded-xl bg-neutral-900/90 border border-[#ff3385]/40 shadow-md space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-[#ff3385]" />
                        <span className="text-xs font-bold text-white font-mono">سرعت فلیپ ۳۶۰ (Flip Speed)</span>
                      </div>
                      <span className="text-[#ff3385] font-mono font-bold text-xs px-2 py-0.5 rounded bg-[#ff3385]/20 border border-[#ff3385]/40">
                        {values.dodgeAngRate} rad/s
                      </span>
                    </div>
                    <input
                      type="range"
                      min="6.0"
                      max="24.0"
                      step="0.5"
                      value={values.dodgeAngRate}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("dodgeAngRate", v, val => { CFG.vehicle.dodge.angRate = val; });
                      }}
                      className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#ff3385]"
                    />
                    <div className="text-[10px] text-neutral-400 leading-tight">
                      دوبار زدن SPACE در هوا به همراه جهت = چرخش کامل ۳۶۰ درجه
                    </div>
                  </div>

                  {/* Flick Torque Snap / Whip (تکانه شلاقی فلیپ) */}
                  <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-[#ff3385]/30 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-200 font-medium">تکانه شلاقی فلیپ (Flick Whip Torque)</span>
                      <span className="text-[#ff3385] font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-[#ff3385]/30">
                        {values.dodgeFlickTorque.toFixed(2)}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1.00"
                      max="2.50"
                      step="0.05"
                      value={values.dodgeFlickTorque}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("dodgeFlickTorque", v, val => { CFG.vehicle.dodge.flickTorque = val; });
                      }}
                      className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-[#ff3385]"
                    />
                    <div className="text-[10px] text-neutral-400">
                      قدرت ضربه و تکانه شلاقی اولیه چرخش (مثل ضربه زدن ناگهانی به پشت ماشین)
                    </div>
                  </div>

                  {/* Flick Surge Momentum (تکانه پرتاب حرکتی به جلو) */}
                  <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-[#ff3385]/30 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-200 font-medium">تکانه پرتاب حرکتی (Flick Momentum Surge)</span>
                      <span className="text-[#ff3385] font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-[#ff3385]/30">
                        {values.dodgeFlickSurge.toFixed(2)}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1.00"
                      max="2.50"
                      step="0.05"
                      value={values.dodgeFlickSurge}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("dodgeFlickSurge", v, val => { CFG.vehicle.dodge.flickSurge = val; });
                      }}
                      className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-[#ff3385]"
                    />
                    <div className="text-[10px] text-neutral-400">
                      شتاب ناگهانی رو به جلو در لحظه شروع فلیپ
                    </div>
                  </div>

                  {/* Flip Duration */}
                  <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-medium">مدت زمان چرخش (Duration)</span>
                      <span className="text-white font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                        {values.dodgeDuration}s
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.30"
                      max="0.90"
                      step="0.02"
                      value={values.dodgeDuration}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("dodgeDuration", v, val => { CFG.vehicle.dodge.duration = val; });
                      }}
                      className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-[#ff3385]"
                    />
                  </div>

                  {/* Flip Impulse */}
                  <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-medium">شتاب پرتاب فلیپ (Impulse)</span>
                      <span className="text-white font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                        {values.dodgeSpeed} m/s
                      </span>
                    </div>
                    <input
                      type="range"
                      min="3.0"
                      max="15.0"
                      step="0.5"
                      value={values.dodgeSpeed}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("dodgeSpeed", v, val => { CFG.vehicle.dodge.speed = val; });
                      }}
                      className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-white"
                    />
                  </div>

                  {/* Jump Impulse */}
                  <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-medium">قدرت پرش عادی (Jump Power)</span>
                      <span className="text-white font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                        {values.jumpImpulse} m/s
                      </span>
                    </div>
                    <input
                      type="range"
                      min="3.0"
                      max="10.0"
                      step="0.2"
                      value={values.jumpImpulse}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("jumpImpulse", v, val => { CFG.vehicle.jump.impulse = val; });
                      }}
                      className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-white"
                    />
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 3: AIR & DRIVING CONTROLS (هدایت در هوا) */}
              {/* ======================================================== */}
              {activeTab === "air" && (
                <div className="space-y-3">
                  <div className="p-2.5 rounded-xl bg-[#99fa47]/10 border border-[#99fa47]/30 text-[11px] text-neutral-300 leading-relaxed">
                    <span className="text-[#99fa47] font-bold">راهنما: </span>
                    در هوا کلیدهای <b className="text-white">A/D</b> ماشین را افقی می‌چرخانند. با نگه داشتن <b className="text-[#99fa47]">[R]</b> با W/S شیب دماغه و با A/D چرخش بشکه‌ای بزنید.
                  </div>

                  {/* Highlight Feature: Max Air Angular Velocity Cap */}
                  <div className="p-3 rounded-xl bg-gradient-to-br from-neutral-900/90 to-[#99fa47]/10 border-2 border-[#99fa47]/50 shadow-[0_0_15px_rgba(153,250,71,0.15)] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-xs flex items-center gap-1.5">
                          <Gauge className="w-4 h-4 text-[#99fa47]" />
                          سقف حداکثر سرعت چرخش در هوا (Max Air Speed Cap)
                        </span>
                        <span className="text-[10px] text-neutral-400 mt-0.5">
                          محدودکننده چرخش برای جلوگیری از سرگیجه و افزایش بی‌پایان سرعت
                        </span>
                      </div>
                      <span className="text-[#99fa47] font-mono font-black text-xs bg-black/60 px-2 py-1 rounded-lg border border-[#99fa47]/40 shadow-inner">
                        {values.maxAirAngSpeed.toFixed(1)} rad/s
                        <span className="text-[10px] text-neutral-400 font-normal ml-1">
                          (~{Math.round(values.maxAirAngSpeed * 57.3)}°/s)
                        </span>
                      </span>
                    </div>

                    <input
                      type="range"
                      min="2.0"
                      max="12.0"
                      step="0.1"
                      value={values.maxAirAngSpeed}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("maxAirAngSpeed", v, val => {
                          CFG.vehicle.air.maxAirAngSpeed = val;
                        });
                      }}
                      className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#99fa47]"
                    />

                    {/* Quick Golden Standard Preset Pill */}
                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <span className="text-neutral-400">
                        استاندارد راکت لیگ: <b className="text-white">5.5 rad/s (~315°/s)</b>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          updateParam("maxAirAngSpeed", 5.5, val => {
                            CFG.vehicle.air.maxAirAngSpeed = val;
                          });
                        }}
                        className="px-2 py-0.5 rounded bg-[#99fa47]/20 hover:bg-[#99fa47]/30 border border-[#99fa47]/50 text-[#99fa47] font-bold font-mono transition active:scale-95"
                        title="تنظیم خودکار به بهترین مقدار استاندارد راکت لیگ"
                      >
                        ⭐ تنظیم به ۵.۵ (ایده‌آل)
                      </button>
                    </div>
                  </div>

                  {/* Air Damping / Instant Braking upon Key Release */}
                  <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex flex-col">
                        <span className="text-neutral-200 font-medium">ترمز و پایداری در هوا (Air Damping)</span>
                        <span className="text-[10px] text-neutral-400">سرعت توقف چرخش بلافاصله بعد از رها کردن کلید</span>
                      </div>
                      <span className="text-[#99fa47] font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-[#99fa47]/30">
                        {values.airDamp.toFixed(1)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="2.0"
                      max="15.0"
                      step="0.5"
                      value={values.airDamp}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("airDamp", v, val => {
                          CFG.vehicle.air.damp = val;
                          CFG.vehicle.air.rollDamp = val + 2.0;
                        });
                      }}
                      className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-[#99fa47]"
                    />
                    <div className="flex items-center justify-between text-[10px] text-neutral-400">
                      <span>ایده‌آل: <b className="text-neutral-200">۶.۵ تا ۸.۰</b> (توقف آنی بدون لرزش)</span>
                      <button
                        type="button"
                        onClick={() => {
                          updateParam("airDamp", 6.5, val => {
                            CFG.vehicle.air.damp = val;
                            CFG.vehicle.air.rollDamp = 8.5;
                          });
                        }}
                        className="text-[10px] text-neutral-300 hover:text-white underline"
                      >
                        تنظیم به ۶.۵
                      </button>
                    </div>
                  </div>

                  {/* Air Pitch */}
                  <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-medium">شتاب شیب دماغه [Hold R + W/S]</span>
                      <span className="text-[#99fa47] font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-[#99fa47]/30">
                        {values.airPitch}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5.0"
                      max="32.0"
                      step="0.5"
                      value={values.airPitch}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("airPitch", v, val => { CFG.vehicle.air.pitch = val; });
                      }}
                      className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-[#99fa47]"
                    />
                  </div>

                  {/* Air Yaw */}
                  <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-medium">شتاب چرخش افقی در هوا [A / D]</span>
                      <span className="text-[#99fa47] font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-[#99fa47]/30">
                        {values.airYaw}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="4.0"
                      max="28.0"
                      step="0.5"
                      value={values.airYaw}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("airYaw", v, val => { CFG.vehicle.air.yaw = val; });
                      }}
                      className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-[#99fa47]"
                    />
                  </div>

                  {/* Air Roll */}
                  <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-medium">شتاب رول بشکه‌ای [Hold R + A/D یا Q/E]</span>
                      <span className="text-[#99fa47] font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-[#99fa47]/30">
                        {values.airRoll}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10.0"
                      max="75.0"
                      step="1.0"
                      value={values.airRoll}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("airRoll", v, val => { CFG.vehicle.air.roll = val; });
                      }}
                      className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-[#99fa47]"
                    />
                  </div>

                  {/* Drive Acceleration */}
                  <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-medium">شتاب گاز عادی (W / S)</span>
                      <span className="text-white font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                        {values.driveAccel} m/s²
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10.0"
                      max="40.0"
                      step="1.0"
                      value={values.driveAccel}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("driveAccel", v, val => { CFG.vehicle.driveAccel = val; });
                      }}
                      className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-white"
                    />
                  </div>

                  {/* --- Steering Configuration (تنظیمات فرمان‌پذیری) --- */}
                  <div className="pt-2 border-t border-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-[#99fa47] tracking-wider uppercase">تنظیمات فرمان‌پذیری (Steering & Handling)</span>
                  </div>

                  {/* Steering Sensitivity */}
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#99fa47]/10 to-transparent border border-[#99fa47]/20 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex flex-col">
                        <span className="text-neutral-200 font-medium">ضریب حساسیت فرمان (Steering Sensitivity)</span>
                        <span className="text-[10px] text-neutral-400">حساسیت و سرعت چرخش با پدال/کلید/دسته</span>
                      </div>
                      <span className="text-[#99fa47] font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-[#99fa47]/30">
                        {values.steerSens.toFixed(2)}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.10"
                      max="3.00"
                      step="0.05"
                      value={values.steerSens}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("steerSens", v);
                      }}
                      className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-[#99fa47]"
                    />
                  </div>

                  {/* Max Steer Angle */}
                  <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex flex-col">
                        <span className="text-neutral-200 font-medium">حداکثر زاویه چرخش فرمان (Max Steer Angle)</span>
                        <span className="text-[10px] text-neutral-400">حداکثر زاویه تایرها در سرعت بسیار پایین</span>
                      </div>
                      <span className="text-[#99fa47] font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-[#99fa47]/30">
                        {(values.steerMax * 57.3).toFixed(1)}° ({values.steerMax.toFixed(3)} rad)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.10"
                      max="1.10"
                      step="0.01"
                      value={values.steerMax}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("steerMax", v);
                      }}
                      className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-[#99fa47]"
                    />
                  </div>

                  {/* Min Steer Angle (At High Speed) */}
                  <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex flex-col">
                        <span className="text-neutral-200 font-medium">حداقل زاویه چرخش در سرعت بالا (Min Steer Angle)</span>
                        <span className="text-[10px] text-neutral-400">حداکثر زاویه تایرها در سرعت بالا (برای جلوگیری از چرخش ناگهانی)</span>
                      </div>
                      <span className="text-[#99fa47] font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-[#99fa47]/30">
                        {(values.steerMin * 57.3).toFixed(1)}° ({values.steerMin.toFixed(3)} rad)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.80"
                      step="0.01"
                      value={values.steerMin}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("steerMin", v);
                      }}
                      className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-[#99fa47]"
                    />
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 4: BOOST & SPEED (بوست و شتاب) */}
              {/* ======================================================== */}
              {activeTab === "boost" && (
                <div className="space-y-3">
                  {/* Boost Accel */}
                  <div className="p-3 rounded-xl bg-neutral-900/90 border border-amber-500/40 shadow-md space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-white font-mono">شتاب راکت بوست (Boost Accel)</span>
                      </div>
                      <span className="text-amber-400 font-mono font-bold text-xs px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40">
                        {values.boostAccel} m/s²
                      </span>
                    </div>
                    <input
                      type="range"
                      min="8.0"
                      max="28.0"
                      step="0.5"
                      value={values.boostAccel}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("boostAccel", v, val => { CFG.vehicle.boost.accel = val; });
                      }}
                      className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                  </div>

                  {/* Boost Top Speed */}
                  <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-medium">سقف سرعت با بوست (Top Speed)</span>
                      <span className="text-white font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                        {Math.round(values.boostSpeedCap * 3.6)} km/h
                      </span>
                    </div>
                    <input
                      type="range"
                      min="18.0"
                      max="40.0"
                      step="1.0"
                      value={values.boostSpeedCap}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("boostSpeedCap", v, val => { CFG.vehicle.boost.speedCap = val; });
                      }}
                      className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-amber-400"
                    />
                  </div>

                  {/* Drive Speed Cap */}
                  <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-medium">سقف سرعت بدون بوست</span>
                      <span className="text-white font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                        {Math.round(values.driveSpeedCap * 3.6)} km/h
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10.0"
                      max="28.0"
                      step="0.5"
                      value={values.driveSpeedCap}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("driveSpeedCap", v, val => { CFG.vehicle.driveSpeedCap = val; });
                      }}
                      className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-white"
                    />
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 5: BALL & ARENA (توپ و فیزیک میدان) */}
              {/* ======================================================== */}
              {activeTab === "ball" && (
                <div className="space-y-3">
                  {/* Ball Size & Radius */}
                  <div className="p-3 rounded-xl bg-neutral-900/90 border border-sky-500/40 shadow-md space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <CircleDot className="w-4 h-4 text-sky-400" />
                        <span className="text-xs font-bold text-white font-mono">اندازه و شعاع توپ (Ball Radius)</span>
                      </div>
                      <span className="text-sky-400 font-mono font-bold text-xs px-2 py-0.5 rounded bg-sky-500/20 border border-sky-500/40">
                        {values.ballRadius.toFixed(2)}m ({Math.round(values.ballRadius * 100)} cm)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.80"
                      max="5.00"
                      step="0.05"
                      value={values.ballRadius}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("ballRadius", v, val => { CFG.ball.radius = val; });
                      }}
                      className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                    />
                    <div className="text-[10px] text-neutral-400">
                      تغییر زنده اندازه و هیت‌باکس کروی توپ (از ۰.۸ متر تا ۵ متر غول‌آسا)
                    </div>
                  </div>

                  {/* Car vs Ball Weight & Recoil Stabilization */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 via-neutral-900/90 to-neutral-900/90 border border-emerald-500/40 shadow-lg space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 font-mono">
                        <Shield className="w-3.5 h-3.5" />
                        <span>وزن ماشین و پایداری در برابر توپ (Weight & Recoil)</span>
                      </div>
                      <span className="text-[10px] text-emerald-400/90 font-mono font-bold bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                        {values.ballCarReaction <= 0.05 ? "سنگین (سبک راکت لیگ)" : values.ballCarReaction < 0.20 ? "متعادل" : "سبک"}
                      </span>
                    </div>

                    {/* 1. Linear Recoil Slider */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-200">پس‌زدن خطی ماشین (Car Linear Recoil)</span>
                        <span className="text-emerald-300 font-mono font-bold text-[11px] bg-black/60 px-2 py-0.5 rounded border border-emerald-500/30">
                          {(values.ballCarReaction * 100).toFixed(0)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.00"
                        max="0.40"
                        step="0.01"
                        value={values.ballCarReaction}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("ballCarReaction", v, val => { CFG.ball.carReaction = val; });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-emerald-400"
                      />
                      <div className="flex items-center justify-between text-[10px] text-neutral-400">
                        <span>۰٪ = وزن بسیار بالا (بدون پس‌زدن)</span>
                        <span>۴۰٪ = ماشین سبک و پرتاب‌شونده</span>
                      </div>
                    </div>

                    {/* 2. Angular Deflection Slider */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-200">انحراف و چرخش جهت ماشین (Heading Deflection)</span>
                        <span className="text-emerald-300 font-mono font-bold text-[11px] bg-black/60 px-2 py-0.5 rounded border border-emerald-500/30">
                          {(values.ballCarAngularReaction * 100).toFixed(0)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.00"
                        max="0.30"
                        step="0.01"
                        value={values.ballCarAngularReaction}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("ballCarAngularReaction", v, val => { CFG.ball.carAngularReaction = val; });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-emerald-400"
                      />
                      <div className="text-[10px] text-neutral-400">
                        تنظیم میزان انحراف جهت و اسپین ناخواسته ماشین در زمان ضربه به توپ.
                      </div>
                    </div>

                    {/* Quick Presets Buttons */}
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          updateParam("ballCarReaction", 0.04, val => { CFG.ball.carReaction = val; });
                          updateParam("ballCarAngularReaction", 0.02, val => { CFG.ball.carAngularReaction = val; });
                        }}
                        className={`px-2 py-1 rounded text-[10px] font-mono font-bold border transition ${
                          values.ballCarReaction <= 0.05
                            ? "bg-emerald-500/25 text-emerald-300 border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                            : "bg-neutral-800/80 text-neutral-400 border-white/5 hover:text-white"
                        }`}
                      >
                        راکتی (سنگین ۴٪)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateParam("ballCarReaction", 0.12, val => { CFG.ball.carReaction = val; });
                          updateParam("ballCarAngularReaction", 0.06, val => { CFG.ball.carAngularReaction = val; });
                        }}
                        className={`px-2 py-1 rounded text-[10px] font-mono font-bold border transition ${
                          values.ballCarReaction > 0.05 && values.ballCarReaction < 0.20
                            ? "bg-emerald-500/25 text-emerald-300 border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                            : "bg-neutral-800/80 text-neutral-400 border-white/5 hover:text-white"
                        }`}
                      >
                        متعادل (۱۲٪)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateParam("ballCarReaction", 0.26, val => { CFG.ball.carReaction = val; });
                          updateParam("ballCarAngularReaction", 0.15, val => { CFG.ball.carAngularReaction = val; });
                        }}
                        className={`px-2 py-1 rounded text-[10px] font-mono font-bold border transition ${
                          values.ballCarReaction >= 0.20
                            ? "bg-emerald-500/25 text-emerald-300 border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                            : "bg-neutral-800/80 text-neutral-400 border-white/5 hover:text-white"
                        }`}
                      >
                        کلاسیک (۲۶٪)
                      </button>
                    </div>
                  </div>

                  {/* Ball Bounciness */}
                  <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-medium">ارتجاع و پرش توپ (Bounciness)</span>
                      <span className="text-white font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                        {values.ballRestitution}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.30"
                      max="0.95"
                      step="0.02"
                      value={values.ballRestitution}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("ballRestitution", v, val => { CFG.ball.restitution = val; });
                      }}
                      className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-sky-400"
                    />
                  </div>

                  {/* Gravity */}
                  <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-medium">جاذبه میدان (Arena Gravity)</span>
                      <span className="text-white font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                        {values.gravity} m/s²
                      </span>
                    </div>
                    <input
                      type="range"
                      min="3.0"
                      max="14.0"
                      step="0.2"
                      value={values.gravity}
                      onChange={e => {
                        const v = Number(e.target.value);
                        updateParam("gravity", v, val => { CFG.physics.gravity = val; });
                      }}
                      className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-white"
                    />
                  </div>

                  {/* Shortcut to Camera / Graphics Tab */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab("camera")}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500/20 via-neutral-900 to-neutral-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center justify-between hover:bg-cyan-500/30 transition shadow-sm"
                    >
                      <span className="flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-cyan-400" /> زاویه دید و دوربین
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("graphics")}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-neutral-900 to-neutral-900 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold flex items-center justify-between hover:bg-amber-500/30 transition shadow-sm"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-400" /> استادیوم و نور
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 8: CAMERA & VIEW ANGLE (تنظیمات زاویه دید و دوربین) */}
              {/* ======================================================== */}
              {activeTab === "camera" && (
                <div className="space-y-3">
                  {/* FOV Slider */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/60 via-neutral-900/90 to-neutral-900/90 border border-cyan-500/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-300 font-mono flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-cyan-400" /> میدان دید (Field of View - FOV)
                      </span>
                      <span className="text-xs font-mono text-cyan-400 font-bold">
                        {Math.round(values.cameraFov || 100)}°
                      </span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="115"
                      step="1"
                      value={values.cameraFov || 100}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        updateParam("cameraFov", v, val => {
                          CFG.camera.fov = val;
                          if (engineRef?.current?.camera) engineRef.current.camera.fov = val;
                        });
                      }}
                      className="w-full accent-cyan-400 bg-neutral-800 h-1.5 rounded cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                      <span>۶۰° (بسته)</span>
                      <span className="text-cyan-400 font-bold">۱۰۰° (استاندارد)</span>
                      <span>۱۱۵° (دید واید)</span>
                    </div>
                  </div>

                  {/* Camera Distance */}
                  <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-200 font-mono">
                        فاصله دوربین (Camera Distance)
                      </span>
                      <span className="text-xs font-mono text-amber-400 font-bold">
                        {(values.cameraDistance !== undefined ? values.cameraDistance : 9.0).toFixed(1)}m
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.8"
                      max="16.0"
                      step="0.1"
                      value={values.cameraDistance !== undefined ? values.cameraDistance : 9.0}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        updateParam("cameraDistance", v, val => {
                          CFG.camera.distance = val;
                          CFG.camera.ballcamDistance = val * 1.06;
                        });
                      }}
                      className="w-full accent-amber-400 bg-neutral-800 h-1.5 rounded cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                      <span>0.8m (خیلی نزدیک)</span>
                      <span>9.0m (پیش‌فرض)</span>
                      <span>16.0m (دور)</span>
                    </div>
                  </div>

                  {/* Camera Height */}
                  <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-200 font-mono">
                        ارتفاع دوربین (Camera Height)
                      </span>
                      <span className="text-xs font-mono text-emerald-400 font-bold">
                        {(values.cameraHeight !== undefined ? values.cameraHeight : 2.45).toFixed(2)}m
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.3"
                      max="6.0"
                      step="0.05"
                      value={values.cameraHeight !== undefined ? values.cameraHeight : 2.45}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        updateParam("cameraHeight", v, val => {
                          CFG.camera.height = val;
                          CFG.camera.ballcamHeight = val + 0.65;
                        });
                      }}
                      className="w-full accent-emerald-400 bg-neutral-800 h-1.5 rounded cursor-pointer"
                    />
                  </div>

                  {/* Camera Pitch Angle */}
                  <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-200 font-mono">
                        زاویه شیب به پایین (Pitch Angle)
                      </span>
                      <span className="text-xs font-mono text-cyan-400 font-bold">
                        {Math.round(values.cameraPitch !== undefined ? values.cameraPitch : 12)}°
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-5"
                      max="28"
                      step="1"
                      value={values.cameraPitch !== undefined ? values.cameraPitch : 12}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        updateParam("cameraPitch", v, val => {
                          CFG.camera.pitch = val;
                        });
                      }}
                      className="w-full accent-cyan-400 bg-neutral-800 h-1.5 rounded cursor-pointer"
                    />
                  </div>

                  {/* Camera Follow Stiffness */}
                  <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-200 font-mono">
                        سفتی و واکنش تعقیب (Stiffness)
                      </span>
                      <span className="text-xs font-mono text-purple-400 font-bold">
                        {(values.cameraStiffness || 1.0).toFixed(2)}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.3"
                      max="2.2"
                      step="0.05"
                      value={values.cameraStiffness || 1.0}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        updateParam("cameraStiffness", v, val => {
                          CFG.camera.stiffness = val;
                        });
                      }}
                      className="w-full accent-purple-400 bg-neutral-800 h-1.5 rounded cursor-pointer"
                    />
                  </div>

                  {/* Speed Zoom Scale */}
                  <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-200 font-mono">
                        زوم دینامیک سرعت و بوست
                      </span>
                      <span className="text-xs font-mono text-amber-400 font-bold">
                        {(values.cameraSpeedZoom !== undefined ? values.cameraSpeedZoom : 2.6).toFixed(1)}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="5.0"
                      step="0.2"
                      value={values.cameraSpeedZoom !== undefined ? values.cameraSpeedZoom : 2.6}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        updateParam("cameraSpeedZoom", v, val => {
                          CFG.camera.speedZoom = val;
                        });
                      }}
                      className="w-full accent-amber-400 bg-neutral-800 h-1.5 rounded cursor-pointer"
                    />
                  </div>

                  {/* Pro Camera Presets */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-950/50 via-neutral-900/90 to-neutral-900/90 border border-purple-500/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-300 font-mono flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" /> پریست‌های حرفه‌ای دوربین (Pro Presets)
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {[
                        { id: "ultraClose", name: "Ultra-Close Bumper (فوق‌العاده نزدیک ۱ متری)", fov: 92, dist: 1.0, height: 0.85, pitch: 6, stiff: 1.8, sub: "فاصله ۱ متری چسبیده به ماشین برای اوج هیجان، سرعت و دقت" },
                        { id: "closeChaser", name: "Close Chaser (زاویه نزدیک)", fov: 95, dist: 5.5, height: 1.8, pitch: 8, stiff: 1.4, sub: "نمای ریسینگ نزدیک و متمرکز روی خودرو" },
                        { id: "rocketPro", name: "Rocket Pro (استاندارد مسابقات)", fov: 105, dist: 9.2, height: 2.4, pitch: 12, stiff: 1.1, sub: "بهترین تعادل و تسلط روی توپ و ماشین" },
                        { id: "dynamicAction", name: "Dynamic Action (اکشن و سرعت)", fov: 108, dist: 7.8, height: 2.1, pitch: 10, stiff: 1.3, sub: "دید نزدیک‌تر با حس هیجان و شتاب بالا" },
                        { id: "aerialMaster", name: "Aerial Master (هوایی و تسلط)", fov: 110, dist: 10.5, height: 2.9, pitch: 15, stiff: 1.0, sub: "زاویه باز برای تسلط کامل به هوا و پروازها" },
                        { id: "arcadeWide", name: "Arcade Wide (آرکید واید)", fov: 112, dist: 11.2, height: 3.4, pitch: 18, stiff: 0.9, sub: "نمای عریض کلاسیک بازی‌های آرکید" }
                      ].map(preset => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            updateParam("cameraFov", preset.fov, val => { CFG.camera.fov = val; if (engineRef?.current?.camera) engineRef.current.camera.fov = val; });
                            updateParam("cameraDistance", preset.dist, val => { CFG.camera.distance = val; CFG.camera.ballcamDistance = val * 1.06; });
                            updateParam("cameraHeight", preset.height, val => { CFG.camera.height = val; CFG.camera.ballcamHeight = val + 0.65; });
                            updateParam("cameraPitch", preset.pitch, val => { CFG.camera.pitch = val; });
                            updateParam("cameraStiffness", preset.stiff, val => { CFG.camera.stiffness = val; });
                          }}
                          className="p-2 rounded-lg border border-purple-500/20 bg-neutral-900/60 hover:bg-purple-900/30 hover:border-purple-500/50 text-right transition flex items-center justify-between group"
                        >
                          <div>
                            <div className="text-xs font-bold font-mono text-purple-200 group-hover:text-purple-100">{preset.name}</div>
                            <div className="text-[10px] text-neutral-400 font-sans">{preset.sub}</div>
                          </div>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            FOV {preset.fov}°
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ballcam Live Toggle */}
                  <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white font-mono">دوربین تعقیب توپ (Ball Cam)</div>
                      <div className="text-[10px] text-neutral-400">سوئیچ میان دید به توپ و دید از پشت ماشین [SPACE]</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (engineRef?.current) {
                          engineRef.current.toggleBallcam();
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30 text-xs font-mono font-bold transition shadow-sm"
                    >
                      تغییر دوربین [SPACE]
                    </button>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 7: GRAPHICS, SHADERS & PERFORMANCE (تنظیمات گرافیک، نور و پرفورمنس) */}
              {/* ======================================================== */}
              {activeTab === "graphics" && (
                <div className="space-y-3">
                  {/* Stadium Theme Selector */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-900/40 via-neutral-900/90 to-neutral-900/90 border border-blue-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-blue-400" /> تم و محیط استادیوم (Stadium Environment)
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {Object.values(STADIUM_THEMES).map(theme => {
                        const isCur = (CFG.gfx && CFG.gfx.stadiumTheme) === theme.id;
                        return (
                          <button
                            key={theme.id}
                            onClick={() => {
                              if (!CFG.gfx) CFG.gfx = {};
                              CFG.gfx.stadiumTheme = theme.id;
                              updateParam("stadiumTheme", theme.id, () => {});
                            }}
                            className={`p-2 rounded-lg border text-right transition flex items-center justify-between ${
                              isCur
                                ? 'bg-blue-600/30 border-blue-400 text-white'
                                : 'bg-neutral-800/40 border-white/10 text-neutral-300 hover:bg-neutral-800'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-6 rounded border border-white/20 shrink-0"
                                style={{ background: theme.turfBase }}
                              />
                              <div>
                                <div className="text-xs font-bold font-mono text-white">{theme.name}</div>
                                <div className="text-[10px] text-neutral-400">{theme.subName}</div>
                              </div>
                            </div>
                            {isCur && <Check className="w-4 h-4 text-blue-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Performance Mode Selector */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/50 via-neutral-900/90 to-neutral-900/90 border border-emerald-500/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300 font-mono flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-emerald-400" /> حالت بهینه‌سازی و پرفورمنس (Performance Mode)
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                      {[
                        { id: "BALANCED", label: "متعادل", sub: "Balanced 60fps" },
                        { id: "HIGH", label: "کیفیت بالا", sub: "High Graphic" },
                        { id: "ULTRA", label: "فوق سبک", sub: "Max Smooth" }
                      ].map(m => {
                        const isCur = (values.perfMode || "BALANCED") === m.id;
                        return (
                          <button
                            key={m.id}
                            onClick={() => {
                              if (!CFG.gfx) CFG.gfx = {};
                              CFG.gfx.perfMode = m.id;
                              updateParam("perfMode", m.id, () => {});
                            }}
                            className={`p-2 rounded-lg border text-center transition flex flex-col items-center justify-center ${
                              isCur
                                ? 'bg-emerald-600/30 border-emerald-400 text-white shadow-sm shadow-emerald-900/50'
                                : 'bg-neutral-800/40 border-white/10 text-neutral-400 hover:bg-neutral-800 hover:text-white'
                            }`}
                          >
                            <span className="font-bold text-xs">{m.label}</span>
                            <span className="text-[9px] text-neutral-400">{m.sub}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stadium Lighting & Shader Controls */}
                  <div className="p-3 rounded-xl bg-neutral-900/90 border border-amber-500/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300 font-mono flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-400" /> نورپردازی و شیدر زمین (Lighting & Shaders)
                      </span>
                    </div>

                    {/* Sun Intensity */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">نور مستقیم آفتاب (Direct Sunlight)</span>
                        <span className="text-amber-300 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                          {Math.round((values.sunIntensity !== undefined ? values.sunIntensity : 0.95) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="1.6"
                        step="0.05"
                        value={values.sunIntensity !== undefined ? values.sunIntensity : 0.95}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("sunIntensity", v, val => {
                            if (!CFG.gfx) CFG.gfx = {};
                            CFG.gfx.sunIntensity = val;
                          });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-amber-300"
                      />
                    </div>

                    {/* Floodlight Intensity */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">نور پرژکتورها (Floodlights)</span>
                        <span className="text-amber-400 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                          {Math.round((values.floodlightIntensity || 0.35) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.0"
                        max="1.2"
                        step="0.05"
                        value={values.floodlightIntensity || 0.35}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("floodlightIntensity", v, val => {
                            if (!CFG.gfx) CFG.gfx = {};
                            CFG.gfx.floodlightIntensity = val;
                          });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-amber-400"
                      />
                    </div>

                    {/* Ambient / Skylight */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">نور محیطی و آسمان (Ambient Light)</span>
                        <span className="text-amber-400 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                          {Math.round((values.ambientLight || 0.85) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="1.5"
                        step="0.05"
                        value={values.ambientLight || 0.85}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("ambientLight", v, val => {
                            if (!CFG.gfx) CFG.gfx = {};
                            CFG.gfx.ambientLight = val;
                          });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-amber-400"
                      />
                    </div>

                    {/* Pitch Brightness */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">روشنایی چمن زمین (Pitch Brightness)</span>
                        <span className="text-emerald-400 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                          {Math.round((values.pitchBrightness || 1.0) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.4"
                        max="1.6"
                        step="0.05"
                        value={values.pitchBrightness || 1.0}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("pitchBrightness", v, val => {
                            if (!CFG.gfx) CFG.gfx = {};
                            CFG.gfx.pitchBrightness = val;
                          });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-emerald-400"
                      />
                    </div>

                    {/* Sun Shadow Mapping (سایه‌زنی واقعی آفتاب) */}
                    <div className="pt-1.5 border-t border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-amber-300 block">سایه‌افکنی واقعی خورشید (Sun Shadow Map)</span>
                          <span className="text-[10px] text-neutral-400">سایه‌های واقعی ماشین‌ها و چرخ‌ها روی زمین با فیلتر PCF</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const next = !(values.shadowMapping !== false);
                            updateParam("shadowMapping", next, val => {
                              if (!CFG.gfx) CFG.gfx = {};
                              CFG.gfx.shadowMapping = val;
                            });
                          }}
                          className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold border transition ${
                            values.shadowMapping !== false
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                              : "bg-neutral-800 text-neutral-400 border-white/10"
                          }`}
                        >
                          {values.shadowMapping !== false ? "فعال (ON)" : "خاموش (OFF)"}
                        </button>
                      </div>

                      {values.shadowMapping !== false && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-300">نرمی مرز سایه (Shadow Softness)</span>
                            <span className="text-amber-400 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                              {(values.shadowSoftness !== undefined ? values.shadowSoftness : 1.0).toFixed(2)}x
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.5"
                            max="2.5"
                            step="0.1"
                            value={values.shadowSoftness !== undefined ? values.shadowSoftness : 1.0}
                            onChange={e => {
                              const v = Number(e.target.value);
                              updateParam("shadowSoftness", v, val => {
                                if (!CFG.gfx) CFG.gfx = {};
                                CFG.gfx.shadowSoftness = val;
                              });
                            }}
                            className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-amber-400"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3D Instanced Pitch Grass (چمن سه‌بعدی و متحرک زمین) */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/70 via-neutral-900/95 to-neutral-900/90 border border-emerald-500/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300 font-mono flex items-center gap-1.5">
                        <Wind className="w-3.5 h-3.5 text-emerald-400" /> چمن سه‌بعدی و باد دینامیک (3D Dynamic Pitch Grass)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = !(values.grassEnabled !== false);
                          updateParam("grassEnabled", next, val => {
                            if (!CFG.gfx) CFG.gfx = {};
                            CFG.gfx.grassEnabled = val;
                          });
                        }}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold border transition ${
                          values.grassEnabled !== false
                            ? "bg-emerald-500/25 text-emerald-300 border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                            : "bg-neutral-800 text-neutral-400 border-white/10"
                        }`}
                      >
                        {values.grassEnabled !== false ? "فعال (ON)" : "خاموش (OFF)"}
                      </button>
                    </div>

                    {values.grassEnabled !== false && (
                      <div className="space-y-3.5 pt-1">
                        {/* Grass Density Presets & Continuous Slider */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-300 font-medium">تراکم بوته‌های چمن (Density & Count)</span>
                            <span className="text-emerald-400 font-mono font-bold text-[11px] bg-black/60 px-2 py-0.5 rounded border border-emerald-500/30">
                              {values.grassBladeCount ? values.grassBladeCount.toLocaleString() : "150,000"} تیغه
                            </span>
                          </div>
                          
                          {/* Presets up to Multi-Million Blades */}
                          <div className="grid grid-cols-3 gap-1.5">
                            {[
                              { id: "LOW", count: 25000, label: "سبک (25k)" },
                              { id: "BALANCED", count: 60000, label: "متعادل (60k)" },
                              { id: "HIGH", count: 150000, label: "پرتراکم (150k)" },
                              { id: "ULTRA", count: 350000, label: "اولترا (350k)" },
                              { id: "ULTRA_DENSE", count: 750000, label: "فوق متراکم (750k)" },
                              { id: "EXTREME", count: 1500000, label: "اکستریم (1.5M)" },
                              { id: "OPTIMIZED_2M", count: 2000000, label: "بهینه (2M) ⚡" },
                              { id: "OPTIMIZED_2_5M", count: 2500000, label: "ایده‌آل (2.5M) ⚡" },
                              { id: "CINEMATIC_MAX", count: 3000000, label: "سینماتیک (3M)" },
                              { id: "HYPER_DENSE", count: 5000000, label: "هایپر (5M)" }
                            ].map(d => {
                              const isCur = (values.grassBladeCount === d.count) || (values.grassDensity === d.id);
                              return (
                                <button
                                  key={d.id}
                                  type="button"
                                  onClick={() => {
                                    updateParam("grassDensity", d.id, () => {
                                      if (!CFG.gfx) CFG.gfx = {};
                                      CFG.gfx.grassDensity = d.id;
                                      CFG.gfx.grassBladeCount = d.count;
                                    });
                                    updateParam("grassBladeCount", d.count, () => {});
                                  }}
                                  className={`py-1.5 px-1 rounded text-center border text-[11px] font-mono transition ${
                                    isCur
                                      ? "bg-emerald-500/30 text-emerald-200 border-emerald-400 font-bold shadow-sm shadow-emerald-950"
                                      : "bg-neutral-800/60 text-neutral-400 border-white/10 hover:bg-neutral-800 hover:text-white"
                                  }`}
                                >
                                  {d.label}
                                </button>
                              );
                            })}
                          </div>

                          {/* Grass Engine Optimization Status */}
                          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded px-2.5 py-1.5 flex items-center justify-between text-[11px] text-emerald-300">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                              بهینه‌ساز فضایی Frustum + LOD فعال
                            </span>
                            <span className="text-[10px] text-emerald-400/80 font-mono">۶۰ فریم پایدار در ۲.۵ میلیون</span>
                          </div>

                          {/* Continuous Blade Count Slider */}
                          <div className="pt-1">
                            <input
                              type="range"
                              min="10000"
                              max="5000000"
                              step="25000"
                              value={values.grassBladeCount || 150000}
                              onChange={e => {
                                const v = Number(e.target.value);
                                updateParam("grassBladeCount", v, val => {
                                  if (!CFG.gfx) CFG.gfx = {};
                                  CFG.gfx.grassBladeCount = val;
                                  CFG.gfx.grassDensity = "CUSTOM";
                                });
                                updateParam("grassDensity", "CUSTOM", () => {});
                              }}
                              className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-emerald-400"
                            />
                            <div className="flex justify-between text-[10px] text-neutral-500 font-mono pt-0.5">
                              <span>10,000 (سبک)</span>
                              <span>حداکثر ۱۰ برابری: ۵,۰۰۰,۰۰۰ تیغه چمن</span>
                            </div>
                          </div>
                        </div>

                        {/* Grass Blade Width / Thickness (کلفتی و نازکی تیغه‌ها) */}
                        <div className="space-y-1.5 bg-neutral-900/50 p-2 rounded-lg border border-white/5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-300 font-medium">ضخامت و کلفتی تیغه‌ها (Blade Thickness & Width)</span>
                            <span className="text-emerald-400 font-mono font-bold text-[11px] bg-black/60 px-2 py-0.5 rounded border border-white/10">
                              {(values.grassBladeWidth !== undefined ? values.grassBladeWidth : 1.0).toFixed(2)}x
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.2"
                            max="8.0"
                            step="0.05"
                            value={values.grassBladeWidth !== undefined ? values.grassBladeWidth : 1.0}
                            onChange={e => {
                              const v = Number(e.target.value);
                              updateParam("grassBladeWidth", v, val => {
                                if (!CFG.gfx) CFG.gfx = {};
                                CFG.gfx.grassBladeWidth = val;
                              });
                            }}
                            className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-emerald-400"
                          />
                          <div className="grid grid-cols-4 gap-1 pt-0.5">
                            {[
                              { label: "معمولی (1.0x)", val: 1.0 },
                              { label: "ضخیم (2.0x)", val: 2.0 },
                              { label: "فرш (4.0x)", val: 4.0 },
                              { label: "فوق ضخیم (8.0x)", val: 8.0 }
                            ].map(p => (
                              <button
                                key={p.label}
                                type="button"
                                onClick={() => {
                                  updateParam("grassBladeWidth", p.val, val => {
                                    if (!CFG.gfx) CFG.gfx = {};
                                    CFG.gfx.grassBladeWidth = val;
                                  });
                                }}
                                className={`text-[10px] py-1 rounded border transition font-mono ${
                                  Math.abs((values.grassBladeWidth || 1.0) - p.val) < 0.05
                                    ? "bg-emerald-500/25 text-emerald-300 border-emerald-400 font-bold"
                                    : "bg-neutral-800/50 text-neutral-400 border-white/5 hover:bg-neutral-800 hover:text-white"
                                }`}
                              >
                                {p.label}
                              </button>
                            ))}
                          </div>
                          <div className="text-[10px] text-neutral-400">
                            امکان تنظیم کلفتی و کثرت تیغه‌ها از چمن سوزنی تا حالت‌های فوق‌العاده متراکم و پوشیده
                          </div>
                        </div>

                        {/* Grass Height */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-300">ارتفاع تیغه‌های چمن (Blade Height)</span>
                            <span className="text-emerald-400 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                              {(values.grassHeight !== undefined ? values.grassHeight : 0.65).toFixed(2)}m
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.2"
                            max="1.5"
                            step="0.05"
                            value={values.grassHeight !== undefined ? values.grassHeight : 0.65}
                            onChange={e => {
                              const v = Number(e.target.value);
                              updateParam("grassHeight", v, val => {
                                if (!CFG.gfx) CFG.gfx = {};
                                CFG.gfx.grassHeight = val;
                              });
                            }}
                            className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-emerald-400"
                          />
                        </div>

                        {/* Boost Pad Height Offset */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-300">ارتفاع پایه‌های بوست‌پد (Pad Elevation)</span>
                            <span className="text-amber-400 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                              {(values.boostPadHeightOffset !== undefined ? values.boostPadHeightOffset : 0.35).toFixed(2)}m
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.0"
                            max="1.2"
                            step="0.05"
                            value={values.boostPadHeightOffset !== undefined ? values.boostPadHeightOffset : 0.35}
                            onChange={e => {
                              const v = Number(e.target.value);
                              updateParam("boostPadHeightOffset", v, val => {
                                if (!CFG.gfx) CFG.gfx = {};
                                CFG.gfx.boostPadHeightOffset = val;
                              });
                            }}
                            className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-amber-400"
                          />
                        </div>

                        {/* Grass Wind Wave Speed */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-300">سرعت موج باد (Wind Speed)</span>
                            <span className="text-cyan-400 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                              {(values.grassWindSpeed !== undefined ? values.grassWindSpeed : 1.4).toFixed(1)}x
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.2"
                            max="3.5"
                            step="0.1"
                            value={values.grassWindSpeed !== undefined ? values.grassWindSpeed : 1.4}
                            onChange={e => {
                              const v = Number(e.target.value);
                              updateParam("grassWindSpeed", v, val => {
                                if (!CFG.gfx) CFG.gfx = {};
                                CFG.gfx.grassWindSpeed = val;
                              });
                            }}
                            className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-cyan-400"
                          />
                        </div>

                        {/* Grass Wave Strength & Tremble */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-300">لرزش و شدت خمیدگی باد (Wind Flutter & Sway)</span>
                            <span className="text-cyan-400 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                              {Math.round((values.grassWaveStrength !== undefined ? values.grassWaveStrength : 0.85) * 100)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.1"
                            max="2.0"
                            step="0.05"
                            value={values.grassWaveStrength !== undefined ? values.grassWaveStrength : 0.85}
                            onChange={e => {
                              const v = Number(e.target.value);
                              updateParam("grassWaveStrength", v, val => {
                                if (!CFG.gfx) CFG.gfx = {};
                                CFG.gfx.grassWaveStrength = val;
                              });
                            }}
                            className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-cyan-400"
                          />
                        </div>

                        {/* Soft Cream Tip Gradient */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-300">گرادیانت کرم نرم نوک چمن (Cream Tip Gradient)</span>
                            <span className="text-amber-200 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                              {Math.round((values.grassTipCreaminess !== undefined ? values.grassTipCreaminess : 0.95) * 100)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.0"
                            max="1.8"
                            step="0.05"
                            value={values.grassTipCreaminess !== undefined ? values.grassTipCreaminess : 0.95}
                            onChange={e => {
                              const v = Number(e.target.value);
                              updateParam("grassTipCreaminess", v, val => {
                                if (!CFG.gfx) CFG.gfx = {};
                                CFG.gfx.grassTipCreaminess = val;
                              });
                            }}
                            className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-amber-200"
                          />
                          <div className="text-[10px] text-neutral-400">
                            جلوه ابریشمی و طبیعی نوک چمن‌ها با تن کرم لطیف و تابش خورشید
                          </div>
                        </div>

                        {/* Subsurface Light Scattering */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-300">عبور نور از بافت چمن (Subsurface Scattering)</span>
                            <span className="text-emerald-300 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                              {Math.round((values.grassSubsurface !== undefined ? values.grassSubsurface : 0.75) * 100)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.0"
                            max="1.5"
                            step="0.05"
                            value={values.grassSubsurface !== undefined ? values.grassSubsurface : 0.75}
                            onChange={e => {
                              const v = Number(e.target.value);
                              updateParam("grassSubsurface", v, val => {
                                if (!CFG.gfx) CFG.gfx = {};
                                CFG.gfx.grassSubsurface = val;
                              });
                            }}
                            className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-emerald-300"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stadium Crowd & Spectators (تماشاچیان و جو استادیوم) */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/60 via-neutral-900/90 to-neutral-900/90 border border-amber-500/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300 font-mono flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-amber-400" /> تماشاچیان و موج مکزیکی استادیوم (Crowd & Cheer)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = !(values.crowdAnimation !== false);
                          updateParam("crowdAnimation", next, val => {
                            if (!CFG.gfx) CFG.gfx = {};
                            CFG.gfx.crowdAnimation = val;
                          });
                        }}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold border transition ${
                          values.crowdAnimation !== false
                            ? "bg-amber-500/25 text-amber-300 border-amber-500/60 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                            : "bg-neutral-800 text-neutral-400 border-white/10"
                        }`}
                      >
                        {values.crowdAnimation !== false ? "فعال (ON)" : "خاموش (OFF)"}
                      </button>
                    </div>

                    {values.crowdAnimation !== false && (
                      <div className="space-y-2 pt-1">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-300">انرژی و تکان خوردن تماشاچیان (Crowd Energy)</span>
                            <span className="text-amber-400 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                              {Math.round((values.crowdEnergy !== undefined ? values.crowdEnergy : 1.0) * 100)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.2"
                            max="2.5"
                            step="0.1"
                            value={values.crowdEnergy !== undefined ? values.crowdEnergy : 1.0}
                            onChange={e => {
                              const v = Number(e.target.value);
                              updateParam("crowdEnergy", v, val => {
                                if (!CFG.gfx) CFG.gfx = {};
                                CFG.gfx.crowdEnergy = val;
                              });
                            }}
                            className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-amber-400"
                          />
                          <div className="text-[10px] text-neutral-400">
                            انیمیشن دینامیک موج مکزیکی و بالا و پایین پریدن تماشاچیان در گرنداستند
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stadium Lasers & Optical Beams (تنظیمات لیزرهای استادیوم) */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-950/60 via-neutral-900/90 to-neutral-900/90 border border-purple-500/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-300 font-mono flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" /> لیزرهای سه‌بعدی استادیوم (Stadium Volumetric Lasers)
                      </span>
                    </div>

                    {/* Laser Brightness */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">شدت روشنایی لیزرها (Laser Brightness)</span>
                        <span className="text-purple-300 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                          {Math.round((values.laserBrightness !== undefined ? values.laserBrightness : 0.45) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.0"
                        max="1.8"
                        step="0.05"
                        value={values.laserBrightness !== undefined ? values.laserBrightness : 0.45}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("laserBrightness", v, val => {
                            if (!CFG.gfx) CFG.gfx = {};
                            CFG.gfx.laserBrightness = val;
                          });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-purple-400"
                      />
                    </div>

                    {/* Laser Thickness */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">کلفتی لوله مرکزی لیزر (Beam Thickness)</span>
                        <span className="text-purple-300 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                          {(values.laserThickness !== undefined ? values.laserThickness : 0.70).toFixed(2)}x
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="2.0"
                        step="0.05"
                        value={values.laserThickness !== undefined ? values.laserThickness : 0.70}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("laserThickness", v, val => {
                            if (!CFG.gfx) CFG.gfx = {};
                            CFG.gfx.laserThickness = val;
                          });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-purple-400"
                      />
                    </div>

                    {/* Laser Halo Glow Radius */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">شعاع هاله نورانی دور لیزر (Halo Glow Radius)</span>
                        <span className="text-purple-300 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                          {(values.laserHaloRadius !== undefined ? values.laserHaloRadius : 0.75).toFixed(2)}x
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="2.5"
                        step="0.05"
                        value={values.laserHaloRadius !== undefined ? values.laserHaloRadius : 0.75}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("laserHaloRadius", v, val => {
                            if (!CFG.gfx) CFG.gfx = {};
                            CFG.gfx.laserHaloRadius = val;
                          });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-purple-400"
                      />
                    </div>

                    {/* Laser Spot Radius (دایره نوری برخورد و منبع) */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">دایره نوری برخورد و منبع (Focal Spot Radius)</span>
                        <span className="text-purple-300 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                          {(values.laserSpotRadius !== undefined ? values.laserSpotRadius : 0.80).toFixed(2)}x
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="2.5"
                        step="0.05"
                        value={values.laserSpotRadius !== undefined ? values.laserSpotRadius : 0.80}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("laserSpotRadius", v, val => {
                            if (!CFG.gfx) CFG.gfx = {};
                            CFG.gfx.laserSpotRadius = val;
                          });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-purple-400"
                      />
                    </div>

                    {/* Laser Opacity */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">میزان شفافیت لیزر (Laser Opacity)</span>
                        <span className="text-purple-300 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                          {Math.round((values.laserOpacity !== undefined ? values.laserOpacity : 0.40) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.0"
                        max="1.0"
                        step="0.05"
                        value={values.laserOpacity !== undefined ? values.laserOpacity : 0.40}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("laserOpacity", v, val => {
                            if (!CFG.gfx) CFG.gfx = {};
                            CFG.gfx.laserOpacity = val;
                          });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-purple-400"
                      />
                    </div>
                  </div>

                  {/* Ball Type & Material Controls */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-sky-950/60 via-neutral-900/90 to-neutral-900/90 border border-sky-500/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-300 font-mono flex items-center gap-1.5">
                        <CircleDot className="w-3.5 h-3.5 text-sky-400" /> نوع و شیدر توپ (Ball Models & Materials)
                      </span>
                    </div>

                    {/* Ball Types Button Selector */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {[
                        { id: "soccer", name: "توپ فوتبال (Soccer)", desc: "پنج‌ضلعی‌های کلاسیک سیاه‌وسفید" },
                        { id: "volleyball", name: "توپ والیبال (Volleyball)", desc: "طرح ۱۸ پنله المپیک Mikasa" },
                        { id: "basketball", name: "توپ بسکتبال (Basketball)", desc: "چرم عاج‌دار ۸ پنله NBA با شیار مشکی" },
                        { id: "rocketleague", name: "توپ راکت لیگ (Rocket League)", desc: "بدنه سایبر فیبر کربن با LED درخشان" },
                        { id: "tennis", name: "توپ تنیس (Tennis Ball)", desc: "روکش نمدی لیمویی با درز سفید" },
                        { id: "curvy", name: "توپ منحنی (Curvy Swirl)", desc: "پنل‌های پیچی آئرودینامیک Mikasa" }
                      ].map(ballOpt => {
                        const isCur = (CFG.gfx && CFG.gfx.ballType) === ballOpt.id;
                        return (
                          <button
                            key={ballOpt.id}
                            onClick={() => {
                              if (!CFG.gfx) CFG.gfx = {};
                              CFG.gfx.ballType = ballOpt.id;
                              updateParam("ballType", ballOpt.id, () => {});
                            }}
                            className={`p-2 rounded-lg border text-right transition flex flex-col justify-between ${
                              isCur
                                ? 'bg-sky-600/30 border-sky-400 text-white shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                                : 'bg-neutral-800/40 border-white/10 text-neutral-300 hover:bg-neutral-800'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-xs font-bold font-mono">{ballOpt.name}</span>
                              {isCur && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                            </div>
                            <span className="text-[10px] text-neutral-400 mt-1">{ballOpt.desc}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Ball Brightness */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">روشنایی توپ (Ball Brightness)</span>
                        <span className="text-sky-400 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                          {Math.round((values.ballBrightness || 1.0) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="1.8"
                        step="0.05"
                        value={values.ballBrightness || 1.0}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("ballBrightness", v, val => {
                            if (!CFG.gfx) CFG.gfx = {};
                            CFG.gfx.ballBrightness = val;
                          });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-sky-400"
                      />
                    </div>

                    {/* Ball Bump Mapping / Incline & Decline */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">عمق شیارها و پستی‌بلندی (Bump Depth)</span>
                        <span className="text-sky-400 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                          {Math.round((values.ballBumpIntensity !== undefined ? values.ballBumpIntensity : 2.8) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.0"
                        max="5.0"
                        step="0.1"
                        value={values.ballBumpIntensity !== undefined ? values.ballBumpIntensity : 2.8}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("ballBumpIntensity", v, val => {
                            if (!CFG.gfx) CFG.gfx = {};
                            CFG.gfx.ballBumpIntensity = val;
                          });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-sky-400"
                      />
                      <div className="flex gap-1 pt-0.5">
                        {[
                          { label: "صاف", v: 0.0 },
                          { label: "عادی (100%)", v: 1.0 },
                          { label: "بسیار عمیق (280%)", v: 2.8 },
                          { label: "فوق برجسته 3D (450%)", v: 4.5 }
                        ].map(btn => (
                          <button
                            key={btn.label}
                            onClick={() => {
                              updateParam("ballBumpIntensity", btn.v, val => {
                                if (!CFG.gfx) CFG.gfx = {};
                                CFG.gfx.ballBumpIntensity = val;
                              });
                            }}
                            className="flex-1 py-0.5 px-1 bg-neutral-800/80 hover:bg-neutral-700 text-[10px] text-neutral-300 rounded border border-white/5 transition"
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ball Metallic Reflection */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">متالیک و درخشش فلزی (Ball Metallic Chrome)</span>
                        <span className="text-amber-400 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                          {Math.round((values.ballMetallic !== undefined ? values.ballMetallic : 0.85) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.0"
                        max="1.0"
                        step="0.05"
                        value={values.ballMetallic !== undefined ? values.ballMetallic : 0.85}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("ballMetallic", v, val => {
                            if (!CFG.gfx) CFG.gfx = {};
                            CFG.gfx.ballMetallic = val;
                          });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-amber-400"
                      />
                      <div className="flex gap-1 pt-0.5">
                        {[
                          { label: "مات چرمی", v: 0.0 },
                          { label: "نیمه متالیک (50%)", v: 0.5 },
                          { label: "کروم/فلزی درخشان (85%)", v: 0.85 },
                          { label: "100% فلز خالص", v: 1.0 }
                        ].map(btn => (
                          <button
                            key={btn.label}
                            onClick={() => {
                              updateParam("ballMetallic", btn.v, val => {
                                if (!CFG.gfx) CFG.gfx = {};
                                CFG.gfx.ballMetallic = val;
                              });
                            }}
                            className="flex-1 py-0.5 px-1 bg-neutral-800/80 hover:bg-neutral-700 text-[10px] text-neutral-300 rounded border border-white/5 transition"
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ball Gloss & Pin-Point Specular */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">نقاط درخشان و براقیت (Pin-Point Specular Gloss)</span>
                        <span className="text-sky-400 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                          {Math.round((values.ballGloss !== undefined ? values.ballGloss : 0.95) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.0"
                        max="1.5"
                        step="0.05"
                        value={values.ballGloss !== undefined ? values.ballGloss : 0.95}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("ballGloss", v, val => {
                            if (!CFG.gfx) CFG.gfx = {};
                            CFG.gfx.ballGloss = val;
                          });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-sky-400"
                      />
                    </div>

                    {/* Ball Glow */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">درخشش امیسیو (Emissive Glow - پیش‌فرض خاموش)</span>
                        <span className="text-sky-400 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                          {Math.round((values.ballEmissiveGlow || 0.0) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.0"
                        max="0.8"
                        step="0.02"
                        value={values.ballEmissiveGlow || 0.0}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("ballEmissiveGlow", v, val => {
                            if (!CFG.gfx) CFG.gfx = {};
                            CFG.gfx.ballEmissiveGlow = val;
                          });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-sky-400"
                      />
                    </div>
                  </div>

                  {/* Vehicle Body Material & Clearcoat Controls */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-950/60 via-neutral-900/90 to-neutral-900/90 border border-purple-500/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-300 font-mono flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-purple-400" /> متریال و رنگ بدنه ماشین (Car Paint & Clearcoat)
                      </span>
                    </div>

                    {/* Car Paint Gloss */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">براقیت رنگ متالیک (Car Gloss)</span>
                        <span className="text-purple-400 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                          {Math.round((values.carGloss || 0.85) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1.5"
                        step="0.05"
                        value={values.carGloss || 0.85}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("carGloss", v, val => {
                            if (!CFG.gfx) CFG.gfx = {};
                            CFG.gfx.carGloss = val;
                          });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-purple-400"
                      />
                    </div>

                    {/* Car Clearcoat / Rim Fresnel */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">پوشش شیشه‌ای کیلر (Clearcoat & Fresnel)</span>
                        <span className="text-purple-400 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                          {Math.round((values.carClearcoat || 0.80) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.0"
                        max="1.5"
                        step="0.05"
                        value={values.carClearcoat || 0.80}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("carClearcoat", v, val => {
                            if (!CFG.gfx) CFG.gfx = {};
                            CFG.gfx.carClearcoat = val;
                          });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-purple-400"
                      />
                    </div>

                    {/* Metallic Flakes */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">درجه متالیک و صیقل بدنه (Metallic Grade)</span>
                        <span className="text-purple-400 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                          {Math.round((values.carMetallic || 0.40) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.0"
                        max="1.0"
                        step="0.05"
                        value={values.carMetallic || 0.40}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("carMetallic", v, val => {
                            if (!CFG.gfx) CFG.gfx = {};
                            CFG.gfx.carMetallic = val;
                          });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-purple-400"
                      />
                    </div>

                    {/* Metallic Flakes Sparkle (اکلیل و شاین کریستالی رنگ متالیک) */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">اکلیل و شاین کریستالی متالیک (Metallic Flakes)</span>
                        <span className="text-purple-400 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                          {Math.round((values.carFlakes !== undefined ? values.carFlakes : 0.85) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.0"
                        max="2.0"
                        step="0.05"
                        value={values.carFlakes !== undefined ? values.carFlakes : 0.85}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("carFlakes", v, val => {
                            if (!CFG.gfx) CFG.gfx = {};
                            CFG.gfx.carFlakes = val;
                          });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-purple-400"
                      />
                      <div className="text-[10px] text-neutral-400">
                        شاین و رقص نور دانه‌های متالیک بدنه در برابر زوایای مختلف تابش آفتاب
                      </div>
                    </div>

                    {/* Ambient Occlusion & Crevices (سایه‌زنی شیارها و شکاف‌های بدنه) */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">سایه‌زنی شیارها و انحنای بدنه (Ambient Occlusion)</span>
                        <span className="text-purple-400 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                          {Math.round((values.carAmbientOcclusion !== undefined ? values.carAmbientOcclusion : 0.85) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.0"
                        max="1.5"
                        step="0.05"
                        value={values.carAmbientOcclusion !== undefined ? values.carAmbientOcclusion : 0.85}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("carAmbientOcclusion", v, val => {
                            if (!CFG.gfx) CFG.gfx = {};
                            CFG.gfx.carAmbientOcclusion = val;
                          });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-purple-400"
                      />
                      <div className="text-[10px] text-neutral-400">
                        عمق‌بخشی به شیارها، زیر چرخ‌ها و حفره‌های آیرودینامیک ماشین
                      </div>
                    </div>

                    {/* 3D Surface Relief & Bump Mapping (برجستگی و پستی‌بلندی‌های سه‌بعدی بدنه) */}
                    <div className="space-y-2 p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/30">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-purple-300 font-bold flex items-center gap-1">
                          ⚡ پستی‌بلندی و بامپ‌مپ بدنه (3D Surface Relief)
                        </span>
                        <span className="text-purple-400 font-mono font-bold text-[11px] bg-black/60 px-1.5 py-0.5 rounded border border-purple-500/30">
                          {Math.round((values.carBump !== undefined ? values.carBump : 0.90) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.0"
                        max="2.0"
                        step="0.05"
                        value={values.carBump !== undefined ? values.carBump : 0.90}
                        onChange={e => {
                          const v = Number(e.target.value);
                          updateParam("carBump", v, val => {
                            if (!CFG.gfx) CFG.gfx = {};
                            CFG.gfx.carBump = val;
                          });
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-purple-400"
                      />
                      <div className="text-[10px] text-neutral-400">
                        ایجاد خطوط واقعی درز درها، شیارهای خنک‌کننده کاپوت، ورودی‌های هوا و برجستگی صفحات متالیک
                      </div>

                      {/* Bump Pattern Styles */}
                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        {[
                          { id: "SPORTS_PANELS", label: "🏎️ پنل‌های اسپرت", desc: "درز کاپوت و گریل" },
                          { id: "AERO_LOUVERS", label: "💨 شیار آیرودینامیک", desc: "شیارهای خنک‌کننده" },
                          { id: "CARBON_WEAVE", label: "🏁 بافت کربن‌فایبر", desc: "تاروپود برجسته" },
                          { id: "ARMOR_PLATES", label: "🛡️ صفحات زره‌پوش", desc: "صفحات تیتانیومی" }
                        ].map(st => (
                          <button
                            key={st.id}
                            onClick={() => {
                              updateParam("carBumpStyle", st.id, val => {
                                if (!CFG.gfx) CFG.gfx = {};
                                CFG.gfx.carBumpStyle = val;
                              });
                            }}
                            className={`p-1.5 rounded-lg border text-right transition ${
                              (values.carBumpStyle || "SPORTS_PANELS") === st.id
                                ? "bg-purple-600/30 border-purple-400 text-purple-200"
                                : "bg-black/30 border-white/10 text-neutral-400 hover:bg-white/5"
                            }`}
                          >
                            <div className="text-[11px] font-bold">{st.label}</div>
                            <div className="text-[9px] opacity-70">{st.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 6: QUICK PRESETS (پریست‌های آماده) */}
              {/* ======================================================== */}
              {activeTab === "presets" && (
                <div className="space-y-2">
                  {/* ZERO PRESET (تغییرات صفر) CARD */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/70 via-neutral-900/95 to-neutral-900/90 border-2 border-amber-400/60 shadow-[0_0_15px_rgba(251,191,36,0.15)] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 font-mono">
                        <Sparkles className="w-4 h-4 text-amber-400" /> پریست «تغییرات صفر» (Zero Changes Preset)
                      </div>
                      {hasZero && (
                        <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/40">
                          ذخیره شده ✓
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                      تنظیمات شخصی، فیزیک، نورپردازی، ابعاد و زوایای دوربین خود را به عنوان نقطه مبنای پایدار ذخیره یا بازیابی کنید تا هرگز تغییرات شما از دست نرود.
                    </p>

                    {zeroNotice && (
                      <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-mono font-bold text-center animate-pulse">
                        {zeroNotice}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={handleSaveZeroPreset}
                        className="p-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                      >
                        <Save className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>ذخیره تغییرات صفر</span>
                      </button>

                      <button
                        onClick={handleLoadZeroPreset}
                        disabled={!hasZero}
                        className={`p-2 rounded-lg font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition ${
                          hasZero
                            ? "bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-400/40"
                            : "bg-neutral-900 text-neutral-600 border border-white/5 cursor-not-allowed"
                        }`}
                      >
                        <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>بازیابی تغییرات صفر</span>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleApplyPreset("octaneRL")}
                    className="w-full p-2.5 rounded-xl bg-neutral-900/80 hover:bg-cyan-500/15 border border-cyan-500/30 hover:border-cyan-500 text-left transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-400 flex items-center gap-1.5">
                        <Box className="w-3.5 h-3.5 text-cyan-400" /> هیت‌باکس استاندارد راکت لیگ (Octane RL)
                      </div>
                      <div className="text-[10px] text-neutral-400">ابعاد دقیق اکتاین با بالانس مسابقه‌ای</div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white" />
                  </button>

                  <button
                    onClick={() => handleApplyPreset("giantStriker")}
                    className="w-full p-2.5 rounded-xl bg-neutral-900/80 hover:bg-amber-500/15 border border-amber-500/30 hover:border-amber-500 text-left transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-amber-400 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-amber-400" /> هیت‌باکس بزرگ و شوت آسان (Giant Striker)
                      </div>
                      <div className="text-[10px] text-neutral-400">هیت‌باکس عریض و شوت‌های سنگین به توپ</div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white" />
                  </button>

                  <button
                    onClick={() => handleApplyPreset("proFlip")}
                    className="w-full p-2.5 rounded-xl bg-neutral-900/80 hover:bg-[#ff3385]/15 border border-[#ff3385]/30 hover:border-[#ff3385] text-left transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#ff3385] flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-[#ff3385]" /> 360° Fast Flip Master
                      </div>
                      <div className="text-[10px] text-neutral-400">فلیپ‌های فوق‌العاده سریع و پرتابی</div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white" />
                  </button>

                  <button
                    onClick={() => handleApplyPreset("monsterTruck")}
                    className="w-full p-2.5 rounded-xl bg-neutral-900/80 hover:bg-emerald-500/15 border border-emerald-500/30 hover:border-emerald-500 text-left transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-400 flex items-center gap-1.5">
                        <Disc className="w-3.5 h-3.5 text-emerald-400" /> Monster Truck (چرخ غول‌پیکر)
                      </div>
                      <div className="text-[10px] text-neutral-400">چرخ‌های ۳۰ سانتی‌متری و فنربندی بلند</div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white" />
                  </button>

                  <button
                    onClick={() => handleApplyPreset("freestyle")}
                    className="w-full p-2.5 rounded-xl bg-neutral-900/80 hover:bg-sky-500/15 border border-sky-500/30 hover:border-sky-500 text-left transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-sky-400 flex items-center gap-1.5">
                        <Wind className="w-3.5 h-3.5 text-sky-400" /> Freestyle Aerial (پرواز هوایی)
                      </div>
                      <div className="text-[10px] text-neutral-400">رول و شیب سریع با جاذبه سبک</div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white" />
                  </button>
                </div>
              )}
            </div>

            {/* Footer Action Buttons */}
            <div className="p-3 bg-neutral-900/95 border-t border-white/10 flex items-center justify-between gap-1.5">
              <button
                onClick={handleResetToDefaults}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition text-xs font-mono border border-white/10"
                title="Reset Defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>پیش‌فرض</span>
              </button>

              <button
                onClick={handleSaveZeroPreset}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition text-xs font-mono border border-amber-400/40"
                title="Save Zero Preset"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>ثبت تغییرات صفر</span>
              </button>

              <button
                onClick={handleSaveToStorage}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all shadow-md ${
                  saveSuccess
                    ? "bg-emerald-500 text-neutral-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                    : "bg-[#99fa47] hover:bg-[#88ea36] text-neutral-950 shadow-[0_0_12px_rgba(153,250,71,0.3)]"
                }`}
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>ذخیره شد!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>ذخیره</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

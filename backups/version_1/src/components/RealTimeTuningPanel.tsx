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
  Activity
} from "lucide-react";
import { CFG, DEFAULT_CFG, saveCurrentConfig, deepMerge, STADIUM_THEMES } from "../game/config.js";

export function RealTimeTuningPanel({ engineRef, onConfigChange, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("hitbox"); // 'hitbox' | 'wheels' | 'flip' | 'air' | 'boost' | 'ball' | 'presets'
  const [isMinimized, setIsMinimized] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync values from current CFG
  const getInitialValues = () => ({
    // 0. Hitbox & Debug
    showHitboxes: !!(CFG.debug && CFG.debug.showHitboxes),
    chassisHx: CFG.vehicle.hx,
    chassisHy: CFG.vehicle.hy,
    chassisHz: CFG.vehicle.hz,
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
    ballCarReaction: CFG.ball.carReaction || 0.26,

    // 1. Wheels & Suspension
    wheelRadius: CFG.vehicle.wheel.radius,
    wheelRest: CFG.vehicle.wheel.rest,
    wheelTravel: CFG.vehicle.wheel.travel,
    wheelStiffness: CFG.vehicle.wheel.stiffness,
    wheelDamping: CFG.vehicle.wheel.damping,
    grip: CFG.vehicle.grip,
    gripSlide: CFG.vehicle.gripSlide,
    steerRate: CFG.vehicle.steerRate,

    // 2. 360° Flips & Dodges
    dodgeAngRate: CFG.vehicle.dodge.angRate,
    dodgeDuration: CFG.vehicle.dodge.duration,
    dodgeSpeed: CFG.vehicle.dodge.speed,
    dodgeUpSpeed: CFG.vehicle.dodge.upSpeed,
    dodgeFlickTorque: CFG.vehicle.dodge.flickTorque || 1.45,
    dodgeFlickSurge: CFG.vehicle.dodge.flickSurge || 1.35,
    jumpImpulse: CFG.vehicle.jump.impulse,

    // 3. Air & Driving Control
    airPitch: CFG.vehicle.air.pitch,
    airYaw: CFG.vehicle.air.yaw,
    airRoll: CFG.vehicle.air.roll,
    driveAccel: CFG.vehicle.driveAccel,
    driveSpeedCap: CFG.vehicle.driveSpeedCap,

    // 4. Boost & Engine
    boostAccel: CFG.vehicle.boost.accel,
    boostSpeedCap: CFG.vehicle.boost.speedCap,
    boostConsume: CFG.vehicle.boost.consume,

    // 5. Ball & Arena
    ballRadius: CFG.ball.radius,
    ballRestitution: CFG.ball.restitution,
    gravity: CFG.physics.gravity,

    // 6. Graphics & Materials
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

    // Ball Type & Material Bump
    ballType: (CFG.gfx && CFG.gfx.ballType) || "soccer",
    ballBrightness: (CFG.gfx && CFG.gfx.ballBrightness !== undefined) ? CFG.gfx.ballBrightness : 1.0,
    ballGloss: (CFG.gfx && CFG.gfx.ballGloss !== undefined) ? CFG.gfx.ballGloss : 0.70,
    ballBumpIntensity: (CFG.gfx && CFG.gfx.ballBumpIntensity !== undefined) ? CFG.gfx.ballBumpIntensity : 0.80,
    ballEmissiveGlow: (CFG.gfx && CFG.gfx.ballEmissiveGlow !== undefined) ? CFG.gfx.ballEmissiveGlow : 0.0
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
    } else if (presetName === "giantStriker") {
      CFG.vehicle.hx = 0.52;
      CFG.vehicle.hy = 0.24;
      CFG.vehicle.hz = 0.72;
      CFG.vehicle.ballHitboxScaleX = 1.65;
      CFG.vehicle.ballHitboxScaleY = 1.50;
      CFG.vehicle.ballHitboxScaleZ = 1.65;
      CFG.ball.kickScale = 1.75;
      CFG.ball.restitutionCar = 0.78;
    } else if (presetName === "monsterTruck") {
      CFG.vehicle.wheel.radius = 0.30;
      CFG.vehicle.wheel.rest = 0.16;
      CFG.vehicle.wheel.travel = 0.15;
      CFG.vehicle.wheel.stiffness = 190.0;
      CFG.vehicle.wheel.damping = 22.0;
      CFG.vehicle.grip = 36.0;
      CFG.vehicle.driveAccel = 25.0;
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
    } else if (presetName === "freestyle") {
      CFG.vehicle.dodge.angRate = 12.0;
      CFG.vehicle.dodge.duration = 0.60;
      CFG.vehicle.air.pitch = 24.0;
      CFG.vehicle.air.roll = 65.0;
      CFG.vehicle.air.yaw = 16.0;
      CFG.vehicle.boost.accel = 16.0;
      CFG.vehicle.boost.speedCap = 32.0;
      CFG.physics.gravity = 5.8;
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
    { id: "hitbox", label: "هیت‌باکس‌ها (Boxes)", icon: Box, color: "text-amber-400" },
    { id: "wheels", label: "چرخ‌ها (Wheels)", icon: Disc, color: "text-emerald-400" },
    { id: "flip", label: "فلیپ ۳۶۰ (Flips)", icon: Flame, color: "text-[#ff3385]" },
    { id: "air", label: "کنترل هوا (Air R)", icon: Gauge, color: "text-[#99fa47]" },
    { id: "boost", label: "بوست و سرعت", icon: Zap, color: "text-amber-400" },
    { id: "ball", label: "توپ و زمین", icon: CircleDot, color: "text-sky-400" },
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

                  {/* Air Pitch */}
                  <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-medium">شیب دماغه در هوا [Hold R + W/S]</span>
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
                      <span className="text-neutral-300 font-medium">چرخش افقی در هوا [A / D]</span>
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
                      <span className="text-neutral-300 font-medium">رول بشکه‌ای [Hold R + A/D یا Q/E]</span>
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

                  {/* Stadium Lighting & Shader Controls */}
                  <div className="p-3 rounded-xl bg-neutral-900/90 border border-amber-500/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300 font-mono flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-400" /> نورپردازی و شیدر زمین (Lighting & Shaders)
                      </span>
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
                  </div>

                  {/* Ball Type & Material Controls */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-sky-950/60 via-neutral-900/90 to-neutral-900/90 border border-sky-500/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-300 font-mono flex items-center gap-1.5">
                        <CircleDot className="w-3.5 h-3.5 text-sky-400" /> نوع و شیدر توپ (Ball Models & Materials)
                      </span>
                    </div>

                    {/* Ball Types Button Selector */}
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: "soccer", name: "توپ فوتبال (Soccer)", desc: "پنج‌ضلعی‌های کلاسیک چرمی" },
                        { id: "volleyball", name: "توپ والیبال (Volleyball)", desc: "طرح ۳ رنگ Mikasa نئونی" },
                        { id: "basketball", name: "بسکتبال (Basketball)", desc: "شیارهای مشکی عمیق با عاج" },
                        { id: "tennis", name: "توپ تنیس (Tennis Ball)", desc: "روکش نمدی لیمویی با درز سفید" }
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
                        <span className="text-neutral-300">پستی و بلندی و شیارها (Bump Map)</span>
                        <span className="text-sky-400 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                          {Math.round((values.ballBumpIntensity !== undefined ? values.ballBumpIntensity : 1.2) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.0"
                        max="4.0"
                        step="0.05"
                        value={values.ballBumpIntensity !== undefined ? values.ballBumpIntensity : 1.2}
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
                          { label: "خاموش", v: 0.0 },
                          { label: "طبیعی (100%)", v: 1.0 },
                          { label: "شیار عمیق (200%)", v: 2.0 },
                          { label: "فوق‌العاده برجسته (350%)", v: 3.5 }
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

                    {/* Ball Gloss & Specular */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">براقیت توپ (Ball Specular Gloss)</span>
                        <span className="text-sky-400 font-mono font-bold text-[11px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                          {Math.round((values.ballGloss || 0.7) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.0"
                        max="1.5"
                        step="0.05"
                        value={values.ballGloss || 0.7}
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
                        <span className="text-neutral-300">درخشش امیسیو (Emissive Glow)</span>
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
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 6: QUICK PRESETS (پریست‌های آماده) */}
              {/* ======================================================== */}
              {activeTab === "presets" && (
                <div className="space-y-2">
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
            <div className="p-3 bg-neutral-900/95 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                onClick={handleResetToDefaults}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition text-xs font-mono border border-white/10"
                title="Reset Defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>پیش‌فرض</span>
              </button>

              <button
                onClick={handleSaveToStorage}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all shadow-md ${
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
                    <span>ذخیره (SAVE)</span>
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

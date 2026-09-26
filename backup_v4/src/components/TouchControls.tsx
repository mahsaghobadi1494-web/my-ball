import React, { useState, useRef, useEffect, memo } from "react";
import {
  Eye,
  Zap,
  Flame,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2,
  Sparkles,
  Compass,
  RotateCcw,
  RotateCw,
  EyeOff
} from "lucide-react";
import { TouchInput } from "../game/touchInput.js";

interface TouchControlsProps {
  onVirtualInput?: (key: string, value: any) => void;
  ballcam: boolean;
  onToggleBallcam: () => void;
  boostAmount?: number;
  speed?: number;
  isGrounded?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const TouchControls: React.FC<TouchControlsProps> = memo(({
  ballcam,
  onToggleBallcam,
  boostAmount = 33,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [controlMode, setControlMode] = useState<"joystick" | "buttons">(() => {
    try {
      const saved = localStorage.getItem("nvc_touch_mode");
      if (saved === "buttons" || saved === "joystick") return saved;
    } catch {}
    return "buttons"; // Default to buttons on mobile for high precision
  });

  const [buttonScale, setButtonScale] = useState<"normal" | "large">(() => {
    try {
      const saved = localStorage.getItem("nvc_touch_scale");
      if (saved === "normal" || saved === "large") return saved;
    } catch {}
    return "normal";
  });

  const [isMinimized, setIsMinimized] = useState(false);

  // References for direct native delegation & hardware acceleration
  const containerRef = useRef<HTMLDivElement>(null);
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const stickKnobRef = useRef<HTMLDivElement>(null);

  const switchMode = (mode: "joystick" | "buttons") => {
    setControlMode(mode);
    try { localStorage.setItem("nvc_touch_mode", mode); } catch {}
  };

  const switchScale = () => {
    setButtonScale(prev => {
      const next = prev === "normal" ? "large" : "normal";
      try { localStorage.setItem("nvc_touch_scale", next); } catch {}
      return next;
    });
  };

  // Bind direct hardware touch listeners to root container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    TouchInput.attach(container);
    TouchInput.onBallcamToggle = onToggleBallcam;

    if (joystickBaseRef.current && stickKnobRef.current) {
      TouchInput.setJoystickElements(joystickBaseRef.current, stickKnobRef.current);
    }

    return () => {
      TouchInput.detach();
    };
  }, [onToggleBallcam, controlMode]);

  // Update joystick element references whenever controlMode switches
  useEffect(() => {
    if (controlMode === "joystick" && joystickBaseRef.current && stickKnobRef.current) {
      TouchInput.setJoystickElements(joystickBaseRef.current, stickKnobRef.current);
    }
  }, [controlMode]);

  const isLarge = buttonScale === "large";

  return (
    <div
      ref={containerRef}
      id="mobile-touch-overlay"
      className="fixed inset-0 pointer-events-none z-30 select-none overflow-hidden touch-none"
    >
      {/* Minimized Floating Restore Pill */}
      {isMinimized && (
        <div className="fixed bottom-3 left-3 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-950/90 hover:bg-neutral-900 border border-[#99fa47]/40 text-[#99fa47] font-mono text-xs font-bold shadow-2xl backdrop-blur-xl transition active:scale-95"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>کنترل‌های لمسی</span>
          </button>
        </div>
      )}

      {!isMinimized && (
        <div className="absolute inset-x-0 bottom-2 sm:bottom-3 px-2 sm:px-5 flex justify-between items-end pointer-events-none pb-[env(safe-area-inset-bottom,0px)]">
          {/* ========================================================================= */}
          {/* LEFT ZONE: Steering Controls (Smooth 360° Joystick OR Precision Arrows) */}
          {/* ========================================================================= */}
          <div className="pointer-events-auto flex flex-col items-start gap-1.5 sm:gap-2">
            {/* Left Toolbar: Toggle Mode & Scale & Fullscreen */}
            <div className="flex items-center gap-1 bg-neutral-950/85 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
              <button
                type="button"
                onClick={() => switchMode(controlMode === "joystick" ? "buttons" : "joystick")}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition flex items-center gap-1.5 ${
                  controlMode === "buttons"
                    ? "bg-[#42b8ff] text-neutral-950 shadow-[0_0_10px_rgba(66,184,255,0.5)]"
                    : "bg-[#99fa47] text-neutral-950 shadow-[0_0_10px_rgba(153,250,71,0.5)]"
                }`}
                title="تغییر بین دکمه‌های فرمانی و جوی‌استیک"
              >
                <Compass className="w-3 h-3" />
                <span>{controlMode === "buttons" ? "فرمان دکمه‌ای" : "جوی‌استیک"}</span>
              </button>

              {onToggleFullscreen && (
                <button
                  type="button"
                  onClick={onToggleFullscreen}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition flex items-center gap-1 border ${
                    isFullscreen
                      ? "bg-amber-400 text-neutral-950 border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                      : "bg-amber-400/10 text-amber-300 border-amber-400/30 hover:bg-amber-400/20"
                  }`}
                  title={isFullscreen ? "خروج از حالت تمام‌صفحه" : "حالت تمام‌صفحه (فول اسکرین)"}
                >
                  {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                  <span>{isFullscreen ? "پنجره" : "فول‌اسکرین"}</span>
                </button>
              )}

              <button
                type="button"
                onClick={switchScale}
                className="px-2 py-1 rounded-lg text-[10px] font-mono text-neutral-300 hover:text-white bg-white/5 border border-white/10"
                title="تغییر سایز دکمه‌ها"
              >
                {isLarge ? "بزرگ" : "عادی"}
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="p-1 text-neutral-400 hover:text-white rounded-md hover:bg-white/10"
                title="مخفی کردن کنترل‌ها"
              >
                <EyeOff className="w-3 h-3" />
              </button>
            </div>

            {/* Left Controller Surface */}
            {controlMode === "joystick" ? (
              /* Virtual 360° Analog Joystick with direct GPU translation */
              <div
                ref={joystickBaseRef}
                data-touch-joystick="true"
                className={`relative ${
                  isLarge ? "w-36 h-36 sm:w-40 sm:h-40" : "w-32 h-32 sm:w-36 sm:h-36"
                } rounded-full bg-neutral-950/80 backdrop-blur-xl border-2 border-white/20 shadow-2xl flex items-center justify-center touch-none cursor-grab active:cursor-grabbing select-none`}
                style={{ touchAction: "none", WebkitTouchCallout: "none", WebkitUserSelect: "none" }}
              >
                {/* Axis Crosshairs */}
                <div className="absolute inset-x-4 top-1/2 h-[1px] bg-white/15 pointer-events-none" />
                <div className="absolute inset-y-4 left-1/2 w-[1px] bg-white/15 pointer-events-none" />
                <div className="w-10 h-10 rounded-full border border-white/15 pointer-events-none" />

                {/* Moveable Stick Knob with direct GPU transform */}
                <div
                  ref={stickKnobRef}
                  className={`absolute ${
                    isLarge ? "w-14 h-14" : "w-12 h-12"
                  } rounded-full border border-white/40 bg-gradient-to-tr from-neutral-800 to-neutral-700 shadow-xl flex items-center justify-center pointer-events-none select-none`}
                  style={{ transform: "translate3d(0, 0, 0)", willChange: "transform" }}
                >
                  <div className="w-4 h-4 rounded-full bg-[#99fa47] shadow-[0_0_8px_#99fa47]" />
                </div>
              </div>
            ) : (
              /* Precision Steer Arrows: Left & Right */
              <div className="flex flex-col gap-1.5 p-1.5 bg-neutral-950/80 backdrop-blur-xl rounded-2xl border border-white/15 shadow-2xl">
                <div className="flex items-center gap-2">
                  {/* STEER LEFT */}
                  <button
                    type="button"
                    data-touch-action="steerLeft"
                    className={`${
                      isLarge ? "w-20 h-18 sm:w-22 sm:h-20" : "w-16 h-15 sm:w-18 sm:h-16"
                    } rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border-2 border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)] flex flex-col items-center justify-center transition-transform touch-none active:scale-95`}
                    title="فرمان به چپ (A)"
                  >
                    <ArrowLeft className="w-7 h-7 stroke-[3] pointer-events-none" />
                    <span className="font-mono text-[9px] font-black uppercase mt-0.5 pointer-events-none">چپ</span>
                  </button>

                  {/* STEER RIGHT */}
                  <button
                    type="button"
                    data-touch-action="steerRight"
                    className={`${
                      isLarge ? "w-20 h-18 sm:w-22 sm:h-20" : "w-16 h-15 sm:w-18 sm:h-16"
                    } rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border-2 border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)] flex flex-col items-center justify-center transition-transform touch-none active:scale-95`}
                    title="فرمان به راست (D)"
                  >
                    <ArrowRight className="w-7 h-7 stroke-[3] pointer-events-none" />
                    <span className="font-mono text-[9px] font-black uppercase mt-0.5 pointer-events-none">راست</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* RIGHT ZONE: Arcade Pedals (GAS, BRAKE) + Action Cluster (JUMP, BOOST, DRIFT, AIR ROLL) */}
          {/* ========================================================================= */}
          <div className="pointer-events-auto flex flex-col items-end gap-1.5 sm:gap-2">
            {/* Top Toolbar: Camera, Roll Q, Roll E */}
            <div className="flex items-center gap-1.5 bg-neutral-950/85 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
              {/* Ballcam Quick Toggle */}
              <button
                type="button"
                data-touch-action="ballcam"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold border shadow transition-all active:scale-95 ${
                  ballcam
                    ? "bg-emerald-500/30 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                    : "bg-neutral-900/90 border-white/15 text-neutral-400 hover:text-white"
                }`}
                title="سوئیچ دوربین توپ (Ballcam)"
              >
                <Eye className="w-3 h-3 pointer-events-none" />
                <span className="pointer-events-none">CAM</span>
                <span className={`w-1.5 h-1.5 rounded-full pointer-events-none ${ballcam ? "bg-emerald-400 animate-pulse" : "bg-neutral-600"}`} />
              </button>

              {/* Dedicated Roll Left [Q] */}
              <button
                type="button"
                data-touch-action="rollLeft"
                className="px-2 py-1 rounded-lg bg-neutral-900/90 border border-white/15 text-purple-300 font-mono text-[10px] font-bold flex items-center gap-1 active:scale-95 transition-all touch-none"
                title="Roll Left (Q)"
              >
                <RotateCcw className="w-3 h-3 pointer-events-none" />
                <span className="pointer-events-none">Q</span>
              </button>

              {/* Dedicated Roll Right [E] */}
              <button
                type="button"
                data-touch-action="rollRight"
                className="px-2 py-1 rounded-lg bg-neutral-900/90 border border-white/15 text-purple-300 font-mono text-[10px] font-bold flex items-center gap-1 active:scale-95 transition-all touch-none"
                title="Roll Right (E)"
              >
                <span className="pointer-events-none">E</span>
                <RotateCw className="w-3 h-3 pointer-events-none" />
              </button>
            </div>

            {/* Main Action Surface: Action Diamond + Drive Pedals */}
            <div className="flex items-center gap-2 p-1.5 sm:p-2 bg-neutral-950/80 backdrop-blur-xl rounded-3xl border border-white/15 shadow-2xl">
              {/* Left Column: DRIFT & AIR ROLL */}
              <div className="flex flex-col gap-1.5 sm:gap-2">
                {/* DRIFT / POWERSLIDE (Amber Key) */}
                <button
                  type="button"
                  data-touch-action="slide"
                  className={`${
                    isLarge ? "w-14 h-14 sm:w-16 sm:h-16" : "w-12 h-12 sm:w-14 sm:h-14"
                  } rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 text-neutral-950 border-2 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)] flex flex-col items-center justify-center active:scale-95 transition-transform touch-none`}
                  title="Drift / Handbrake"
                >
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] fill-current pointer-events-none" />
                  <span className="font-mono text-[8px] sm:text-[9px] font-black uppercase pointer-events-none">DRIFT</span>
                </button>

                {/* AIR ROLL 3D (Volt Lime Key) */}
                <button
                  type="button"
                  data-touch-action="airRoll"
                  className={`${
                    isLarge ? "w-14 h-14 sm:w-16 sm:h-16" : "w-12 h-12 sm:w-14 sm:h-14"
                  } rounded-2xl border-2 shadow-[0_0_15px_rgba(153,250,71,0.4)] flex flex-col items-center justify-center active:scale-95 transition-all touch-none bg-gradient-to-tr from-[#6bc41c] to-[#b3fa66] text-neutral-950 border-[#99fa47]`}
                  title="چرخش هوایی (Air Roll)"
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] pointer-events-none" />
                  <span className="font-mono text-[8px] sm:text-[9px] font-black uppercase pointer-events-none">AIR</span>
                </button>
              </div>

              {/* Center Column: JUMP & BOOST */}
              <div className="flex flex-col gap-1.5 sm:gap-2">
                {/* JUMP / 2X FLIP (Sky Cyan Key) */}
                <button
                  type="button"
                  data-touch-action="jump"
                  className={`${
                    isLarge ? "w-16 h-16 sm:w-18 sm:h-18" : "w-14 h-14 sm:w-16 sm:h-16"
                  } rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-cyan-400 text-neutral-950 border-2 border-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.4)] flex flex-col items-center justify-center active:scale-95 transition-transform touch-none`}
                  title="Jump / Double Jump / Flip"
                >
                  <ArrowUp className="w-6 h-6 stroke-[3] pointer-events-none" />
                  <span className="font-mono text-[10px] sm:text-xs font-black uppercase pointer-events-none">JUMP</span>
                </button>

                {/* ROCKET BOOST (Flame Rose/Orange Key) */}
                <button
                  type="button"
                  data-touch-action="boost"
                  className={`${
                    isLarge ? "w-16 h-16 sm:w-18 sm:h-18" : "w-14 h-14 sm:w-16 sm:h-16"
                  } rounded-2xl border-2 shadow-[0_0_22px_rgba(244,63,94,0.45)] flex flex-col items-center justify-center active:scale-95 transition-all touch-none bg-gradient-to-tr from-rose-600 via-rose-500 to-orange-400 text-white border-rose-400`}
                  title="Rocket Boost (Shift)"
                >
                  <Flame className="w-5 h-5 sm:w-6 sm:h-6 fill-current animate-pulse pointer-events-none" />
                  <span className="font-mono text-[10px] sm:text-xs font-black uppercase pointer-events-none">BOOST</span>
                  <span className="text-[8px] font-mono font-bold leading-none pointer-events-none">{Math.round(boostAmount)}%</span>
                </button>
              </div>

              {/* Right Column: DEDICATED DRIVE PEDALS (GAS & BRAKE/REVERSE) */}
              <div className="flex flex-col gap-1.5 sm:gap-2 pl-1 border-l border-white/10">
                {/* GAS / DRIVE PEDAL (Emerald Accelerator) */}
                <button
                  type="button"
                  data-touch-action="gas"
                  className={`${
                    isLarge ? "w-14 h-18 sm:w-16 sm:h-20" : "w-12 h-15 sm:w-14 sm:h-17"
                  } rounded-2xl bg-gradient-to-t from-emerald-700 via-emerald-600 to-green-400 text-neutral-950 border-2 border-emerald-300 shadow-[0_0_22px_rgba(16,185,129,0.5)] flex flex-col items-center justify-center active:scale-95 transition-transform touch-none`}
                  title="گاز / حرکت به جلو (W)"
                >
                  <ArrowUp className="w-6 h-6 stroke-[3] text-neutral-950 pointer-events-none" />
                  <span className="font-mono text-[10px] sm:text-xs font-black tracking-wider uppercase pointer-events-none">گاز</span>
                </button>

                {/* BRAKE / REVERSE PEDAL (Red/Crimson Brake) */}
                <button
                  type="button"
                  data-touch-action="brake"
                  className={`${
                    isLarge ? "w-14 h-14 sm:w-16 sm:h-16" : "w-12 h-12 sm:w-14 sm:h-14"
                  } rounded-2xl bg-gradient-to-t from-red-700 to-rose-500 text-white border-2 border-rose-400 shadow-[0_0_15px_rgba(239,68,68,0.4)] flex flex-col items-center justify-center active:scale-95 transition-transform touch-none`}
                  title="ترمز / دنده عقب (S)"
                >
                  <ArrowDown className="w-5 h-5 stroke-[3] pointer-events-none" />
                  <span className="font-mono text-[9px] sm:text-[10px] font-black uppercase pointer-events-none">ترمز</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

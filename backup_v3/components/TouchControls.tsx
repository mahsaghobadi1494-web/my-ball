import React, { useState, useRef, useCallback } from "react";
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
  RotateCw
} from "lucide-react";

interface TouchControlsProps {
  onVirtualInput: (key: string, value: any) => void;
  ballcam: boolean;
  onToggleBallcam: () => void;
  boostAmount: number;
  speed: number;
  isGrounded?: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onVirtualInput,
  ballcam,
  onToggleBallcam,
  boostAmount,
  speed,
  isGrounded = true,
}) => {
  const [controlMode, setControlMode] = useState<"joystick" | "buttons">("joystick");
  const [joystickActive, setJoystickActive] = useState(false);
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 });
  const [airRollHeld, setAirRollHeld] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const activePointerIdRef = useRef<number | null>(null);

  // Quick tactile feedback helper (vibrate on mobile if supported)
  const triggerHaptic = useCallback((ms = 12) => {
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(ms);
      }
    } catch {}
  }, []);

  // Joystick Pointer Event Handlers (Works with Mouse Click+Drag & Finger Touch)
  const updateJoystickFromPointer = (clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxRadius = rect.width / 2 - 12;

    let dx = clientX - centerX;
    let dy = clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > maxRadius) {
      dx = (dx / dist) * maxRadius;
      dy = (dy / dist) * maxRadius;
    }

    setStickPos({ x: dx, y: dy });

    const normX = Math.max(-1, Math.min(1, dx / maxRadius));
    const normY = Math.max(-1, Math.min(1, -dy / maxRadius)); // Up is positive throttle

    const deadzone = 0.12;
    const steerVal = Math.abs(normX) > deadzone ? normX : 0;
    const throttleVal = Math.abs(normY) > deadzone ? normY : 0;

    onVirtualInput("steer", steerVal);
    onVirtualInput("throttle", throttleVal);

    if (airRollHeld) {
      onVirtualInput("pitch", throttleVal);
      if (steerVal < -0.3) {
        onVirtualInput("rollLeft", true);
        onVirtualInput("rollRight", false);
      } else if (steerVal > 0.3) {
        onVirtualInput("rollRight", true);
        onVirtualInput("rollLeft", false);
      } else {
        onVirtualInput("rollLeft", false);
        onVirtualInput("rollRight", false);
      }
    } else {
      onVirtualInput("yaw", steerVal);
    }
  };

  const handleJoystickPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (activePointerIdRef.current !== null) return;
    activePointerIdRef.current = e.pointerId;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setJoystickActive(true);
    triggerHaptic(15);
    updateJoystickFromPointer(e.clientX, e.clientY);
  };

  const handleJoystickPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current === e.pointerId) {
      e.preventDefault();
      updateJoystickFromPointer(e.clientX, e.clientY);
    }
  };

  const handleJoystickPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current === e.pointerId) {
      e.preventDefault();
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
      activePointerIdRef.current = null;
      setJoystickActive(false);
      setStickPos({ x: 0, y: 0 });
      onVirtualInput("steer", 0);
      onVirtualInput("throttle", 0);
      onVirtualInput("pitch", 0);
      onVirtualInput("yaw", 0);
    }
  };

  // Helper to bind standard action button with pointer events
  const createButtonBind = (key: string, pressVal: any, releaseVal: any = 0) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {}
      triggerHaptic(12);
      onVirtualInput(key, pressVal);
    },
    onPointerUp: (e: React.PointerEvent) => {
      e.preventDefault();
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      onVirtualInput(key, releaseVal);
    },
    onPointerCancel: (e: React.PointerEvent) => {
      e.preventDefault();
      onVirtualInput(key, releaseVal);
    },
    onPointerLeave: () => {
      onVirtualInput(key, releaseVal);
    },
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  });

  return (
    <div
      id="mobile-touch-overlay"
      className="fixed inset-0 pointer-events-none z-30 select-none overflow-hidden touch-none"
    >
      {/* Minimized Floating Restore Pill */}
      {isMinimized && (
        <div className="fixed bottom-4 left-4 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-950/90 hover:bg-neutral-900 border border-white/20 text-[#99fa47] font-mono text-xs font-bold shadow-2xl backdrop-blur-xl transition active:scale-95"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>نمایش کنترل‌های لمسی</span>
          </button>
        </div>
      )}

      {!isMinimized && (
        <div className="absolute inset-x-0 bottom-3 px-3 sm:px-6 flex justify-between items-end pointer-events-none">
          {/* ========================================================================= */}
          {/* LEFT ZONE: Steering Controls (Joystick / D-Pad) + Mode Switcher */}
          {/* ========================================================================= */}
          <div className="pointer-events-auto flex flex-col items-start gap-2">
            {/* Mode Toolbar: Joystick vs D-Pad & Minimize */}
            <div className="flex items-center gap-1.5 bg-neutral-950/80 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
              <button
                type="button"
                onClick={() => setControlMode(prev => (prev === "joystick" ? "buttons" : "joystick"))}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition flex items-center gap-1.5 ${
                  controlMode === "joystick"
                    ? "bg-[#99fa47] text-neutral-950 shadow-[0_0_10px_rgba(153,250,71,0.5)]"
                    : "text-neutral-300 hover:text-white"
                }`}
                title="تغییر حالت کنترل بین جوی‌استیک و دکمه‌ای"
              >
                <Compass className="w-3 h-3" />
                <span>{controlMode === "joystick" ? "جوی‌استیک" : "دکمه‌ای"}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="p-1 text-neutral-400 hover:text-white rounded-md hover:bg-white/10"
                title="مخفی کردن کنترل‌ها"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Steering Input Surface */}
            {controlMode === "joystick" ? (
              /* Virtual Analog 360° Joystick */
              <div
                ref={joystickBaseRef}
                onPointerDown={handleJoystickPointerDown}
                onPointerMove={handleJoystickPointerMove}
                onPointerUp={handleJoystickPointerUp}
                onPointerCancel={handleJoystickPointerUp}
                onContextMenu={e => e.preventDefault()}
                className={`relative w-36 h-36 rounded-full bg-neutral-950/75 backdrop-blur-xl border-2 shadow-2xl flex items-center justify-center touch-none cursor-grab active:cursor-grabbing transition-colors ${
                  joystickActive
                    ? "border-[#99fa47] shadow-[0_0_25px_rgba(153,250,71,0.3)]"
                    : "border-white/20"
                }`}
              >
                {/* Visual Axis Cross & Ring */}
                <div className="absolute inset-x-4 top-1/2 h-[1px] bg-white/10 pointer-events-none" />
                <div className="absolute inset-y-4 left-1/2 w-[1px] bg-white/10 pointer-events-none" />
                <div className="w-10 h-10 rounded-full border border-white/10 pointer-events-none" />

                {/* Moveable Stick Knob */}
                <div
                  className={`absolute w-14 h-14 rounded-full border shadow-xl flex items-center justify-center pointer-events-none transition-transform ${
                    joystickActive
                      ? "bg-gradient-to-tr from-[#99fa47] to-[#7ce028] border-white text-neutral-950 shadow-[0_0_20px_rgba(153,250,71,0.8)] scale-105"
                      : "bg-neutral-800/95 border-white/30 text-neutral-400"
                  }`}
                  style={{
                    transform: `translate(${stickPos.x}px, ${stickPos.y}px)`
                  }}
                >
                  <div className="w-5 h-5 rounded-full bg-black/20" />
                </div>
              </div>
            ) : (
              /* Classic 4-Way D-Pad Layout */
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 bg-neutral-950/75 backdrop-blur-xl p-2 rounded-2xl border border-white/20 shadow-2xl">
                {/* UP / Accelerate */}
                <button
                  type="button"
                  {...createButtonBind("throttle", 1, 0)}
                  className="absolute top-1.5 left-1/2 -translate-x-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-neutral-800/90 active:bg-[#99fa47] border border-white/20 active:border-[#99fa47] text-white active:text-neutral-950 flex items-center justify-center font-bold shadow-lg transition-transform active:scale-95"
                  title="Forward (W)"
                >
                  <ArrowUp className="w-6 h-6 stroke-[3]" />
                </button>

                {/* LEFT / Steer Left */}
                <button
                  type="button"
                  {...createButtonBind("steer", -1, 0)}
                  className="absolute top-1/2 -translate-y-1/2 left-1.5 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-neutral-800/90 active:bg-[#99fa47] border border-white/20 active:border-[#99fa47] text-white active:text-neutral-950 flex items-center justify-center font-bold shadow-lg transition-transform active:scale-95"
                  title="Steer Left (A)"
                >
                  <ArrowLeft className="w-6 h-6 stroke-[3]" />
                </button>

                {/* CENTER / Neutral dot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#99fa47]/60" />
                </div>

                {/* RIGHT / Steer Right */}
                <button
                  type="button"
                  {...createButtonBind("steer", 1, 0)}
                  className="absolute top-1/2 -translate-y-1/2 right-1.5 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-neutral-800/90 active:bg-[#99fa47] border border-white/20 active:border-[#99fa47] text-white active:text-neutral-950 flex items-center justify-center font-bold shadow-lg transition-transform active:scale-95"
                  title="Steer Right (D)"
                >
                  <ArrowRight className="w-6 h-6 stroke-[3]" />
                </button>

                {/* DOWN / Reverse / Brake */}
                <button
                  type="button"
                  {...createButtonBind("throttle", -1, 0)}
                  className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-neutral-800/90 active:bg-[#99fa47] border border-white/20 active:border-[#99fa47] text-white active:text-neutral-950 flex items-center justify-center font-bold shadow-lg transition-transform active:scale-95"
                  title="Reverse / Brake (S)"
                >
                  <ArrowDown className="w-6 h-6 stroke-[3]" />
                </button>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* RIGHT ZONE: 2x2 Arcade Action Diamond (JUMP, BOOST, DRIFT, AIR ROLL) */}
          {/* Ergonmic thumb arc layout - no stretching, large tactile hitboxes */}
          {/* ========================================================================= */}
          <div className="pointer-events-auto flex flex-col items-end gap-2">
            {/* Top Toolbar: Ballcam, Roll Q, Roll E */}
            <div className="flex items-center gap-1.5 bg-neutral-950/80 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
              {/* Ballcam Quick Toggle */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(15);
                  onToggleBallcam();
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold border shadow transition-all active:scale-95 ${
                  ballcam
                    ? "bg-emerald-500/30 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                    : "bg-neutral-900/90 border-white/15 text-neutral-400 hover:text-white"
                }`}
                title="سوئیچ دوربین توپ (Ballcam)"
              >
                <Eye className="w-3 h-3" />
                <span>CAM</span>
                <span className={`w-1.5 h-1.5 rounded-full ${ballcam ? "bg-emerald-400 animate-pulse" : "bg-neutral-600"}`} />
              </button>

              {/* Dedicated Roll Left [Q] */}
              <button
                type="button"
                {...createButtonBind("rollLeft", true, false)}
                className="px-2 py-1 rounded-lg bg-neutral-900/90 active:bg-purple-600 border border-white/15 text-purple-300 active:text-white font-mono text-[10px] font-bold flex items-center gap-1 active:scale-95 transition-all"
                title="Roll Left (Q)"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Q</span>
              </button>

              {/* Dedicated Roll Right [E] */}
              <button
                type="button"
                {...createButtonBind("rollRight", true, false)}
                className="px-2 py-1 rounded-lg bg-neutral-900/90 active:bg-purple-600 border border-white/15 text-purple-300 active:text-white font-mono text-[10px] font-bold flex items-center gap-1 active:scale-95 transition-all"
                title="Roll Right (E)"
              >
                <span>E</span>
                <RotateCw className="w-3 h-3" />
              </button>
            </div>

            {/* 2x2 Diamond Action Cluster: DRIFT, AIR ROLL, JUMP, BOOST */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 p-2 bg-neutral-950/60 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl">
              {/* TOP-LEFT: DRIFT / POWERSLIDE (Amber Arcade Key) */}
              <button
                type="button"
                {...createButtonBind("slide", true, false)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 active:from-yellow-300 active:to-white text-neutral-950 border-2 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] flex flex-col items-center justify-center active:scale-95 transition-transform"
                title="Drift / Handbrake (Ctrl/Space)"
              >
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] fill-current" />
                <span className="font-mono text-xs sm:text-sm font-black tracking-wider uppercase mt-0.5">DRIFT</span>
                <span className="text-[8px] sm:text-[9px] font-mono text-neutral-900/80 font-bold">لایی/ترمز</span>
              </button>

              {/* TOP-RIGHT: AIR ROLL 3D (Volt Lime Arcade Key) */}
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
                  setAirRollHeld(true);
                  onVirtualInput("airRollHeld", true);
                  triggerHaptic(15);
                }}
                onPointerUp={(e) => {
                  e.preventDefault();
                  try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
                  setAirRollHeld(false);
                  onVirtualInput("airRollHeld", false);
                }}
                onPointerCancel={() => {
                  setAirRollHeld(false);
                  onVirtualInput("airRollHeld", false);
                }}
                onPointerLeave={() => {
                  setAirRollHeld(false);
                  onVirtualInput("airRollHeld", false);
                }}
                onContextMenu={e => e.preventDefault()}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 shadow-[0_0_20px_rgba(153,250,71,0.4)] flex flex-col items-center justify-center active:scale-95 transition-all ${
                  airRollHeld
                    ? "bg-white text-neutral-950 border-white shadow-[0_0_28px_rgba(153,250,71,0.8)] scale-95"
                    : "bg-gradient-to-tr from-[#6bc41c] via-[#8ae032] to-[#b3fa66] text-neutral-950 border-[#99fa47]"
                }`}
                title="Hold for 3D Air Pitch & Roll (R)"
              >
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                <span className="font-mono text-xs sm:text-sm font-black tracking-wider uppercase mt-0.5">AIR ROLL</span>
                <span className="text-[8px] sm:text-[9px] font-mono text-neutral-900/80 font-bold">چرخش هوایی</span>
              </button>

              {/* BOTTOM-LEFT: JUMP / 2X FLIP (Sky Cyan Arcade Key) */}
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
                  triggerHaptic(20);
                  onVirtualInput("jump", true);
                }}
                onPointerUp={(e) => {
                  e.preventDefault();
                  try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
                  onVirtualInput("jump", false);
                }}
                onPointerCancel={() => {
                  onVirtualInput("jump", false);
                }}
                onPointerLeave={() => {
                  onVirtualInput("jump", false);
                }}
                onContextMenu={e => e.preventDefault()}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-cyan-400 active:from-cyan-300 active:to-white text-neutral-950 border-2 border-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.4)] flex flex-col items-center justify-center active:scale-95 transition-transform"
                title="Jump / Double Jump / 360 Flip (Space)"
              >
                <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
                <span className="font-mono text-xs sm:text-sm font-black tracking-wider uppercase mt-0.5">JUMP</span>
                <span className="text-[8px] sm:text-[9px] font-mono text-neutral-900/80 font-bold">2X FLIP</span>
              </button>

              {/* BOTTOM-RIGHT: ROCKET BOOST (Flame Rose Arcade Key) */}
              <button
                type="button"
                {...createButtonBind("boost", true, false)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 shadow-[0_0_25px_rgba(244,63,94,0.45)] flex flex-col items-center justify-center active:scale-95 transition-all ${
                  boostAmount > 0
                    ? "bg-gradient-to-tr from-rose-600 via-rose-500 to-orange-400 active:from-orange-300 active:to-white text-white active:text-neutral-950 border-rose-400"
                    : "bg-neutral-800/90 border-white/20 text-neutral-500 opacity-60"
                }`}
                title="Rocket Boost (Shift)"
              >
                <Flame className={`w-5 h-5 sm:w-6 sm:h-6 fill-current ${boostAmount > 0 ? "animate-pulse" : ""}`} />
                <span className="font-mono text-xs sm:text-sm font-black tracking-wider uppercase mt-0.5">BOOST</span>
                <span className="text-[9px] sm:text-[10px] font-mono font-bold">{Math.round(boostAmount)}%</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

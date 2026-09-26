import React from "react";
import { Zap, Flame, Gauge, ArrowUpCircle } from "lucide-react";

interface TelemetryHUDProps {
  speed: number;
  boost: number;
  isGrounded?: boolean;
  touchControlsActive?: boolean;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({
  speed,
  boost,
  isGrounded = true,
  touchControlsActive = false,
}) => {
  const roundedSpeed = Math.round(speed);
  const roundedBoost = Math.round(boost);
  const isSupersonic = roundedSpeed >= 62;

  // Boost color logic
  const boostColor =
    roundedBoost > 60
      ? "#99fa47" // Volt Lime
      : roundedBoost > 25
      ? "#fbbf24" // Amber
      : "#ff3385"; // Hot Rose

  // Speed bar percentage (max ~85 km/h)
  const speedRatio = Math.min(1, roundedSpeed / 80);
  const totalSegments = 10;
  const activeSegments = Math.round(speedRatio * totalSegments);

  // SVG Gauge Math for circular boost
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (circumference * roundedBoost) / 100;

  // =========================================================================
  // VIEW A: TOUCH CONTROLS ACTIVE -> DOCKED AT BOTTOM-CENTER (NO OVERLAP)
  // =========================================================================
  if (touchControlsActive) {
    return (
      <div
        id="telemetry-dock-center"
        className="fixed bottom-2.5 sm:bottom-3.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none max-w-[85vw]"
      >
        <div className="flex items-center gap-2 sm:gap-3 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-neutral-950/90 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
          {/* Speedometer Section */}
          <div className="flex items-center gap-2.5 pr-2.5 sm:pr-3.5 border-r border-white/10">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span
                  className={`font-mono text-2xl sm:text-3xl font-black italic tracking-tight leading-none ${
                    isSupersonic
                      ? "text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)] animate-pulse"
                      : "text-white"
                  }`}
                >
                  {roundedSpeed}
                </span>
                <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400">
                  KM/H
                </span>
              </div>

              {/* Segmented LED Speed Bar */}
              <div className="flex items-center gap-0.5 mt-1">
                {Array.from({ length: 8 }).map((_, i) => {
                  const active = i < Math.round(speedRatio * 8);
                  return (
                    <div
                      key={i}
                      className={`h-1.5 w-2 sm:w-2.5 rounded-xs transition-colors duration-75 ${
                        active
                          ? i > 5
                            ? "bg-rose-500 shadow-[0_0_4px_#f43f5e]"
                            : i > 3
                            ? "bg-amber-400 shadow-[0_0_4px_#fbbf24]"
                            : "bg-cyan-400 shadow-[0_0_4px_#22d3ee]"
                          : "bg-neutral-800"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Supersonic / Flight Pill */}
            <div className="flex flex-col items-center gap-0.5">
              {isSupersonic ? (
                <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-black uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 animate-pulse flex items-center gap-0.5">
                  <Zap className="w-2.5 h-2.5 fill-current" />
                  <span>SUPER</span>
                </span>
              ) : (
                <span
                  className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase border ${
                    isGrounded
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-sky-500/10 text-sky-400 border-sky-500/20"
                  }`}
                >
                  {isGrounded ? "GROUND" : "AIR"}
                </span>
              )}
            </div>
          </div>

          {/* Boost Section (Compact Radial Gauge) */}
          <div className="flex items-center gap-2 pl-0.5">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="18"
                  className="stroke-neutral-800"
                  strokeWidth="3.5"
                  fill="none"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="18"
                  stroke={boostColor}
                  strokeWidth="3.5"
                  strokeDasharray={2 * Math.PI * 18}
                  strokeDashoffset={
                    2 * Math.PI * 18 - (2 * Math.PI * 18 * roundedBoost) / 100
                  }
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-75"
                  style={{
                    filter: `drop-shadow(0 0 4px ${boostColor}80)`
                  }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-mono text-xs sm:text-sm font-black text-white leading-none">
                  {roundedBoost}
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-[10px] font-mono font-bold tracking-wider text-neutral-300 uppercase">
                <Flame
                  className={`w-3 h-3 ${
                    roundedBoost > 0
                      ? "text-rose-400 animate-pulse fill-current"
                      : "text-neutral-600"
                  }`}
                />
                <span>BOOST</span>
              </div>
              <span
                className="text-[9px] font-mono font-bold"
                style={{ color: boostColor }}
              >
                {roundedBoost >= 100
                  ? "FULL"
                  : roundedBoost <= 0
                  ? "EMPTY"
                  : `${roundedBoost}%`}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW B: DESKTOP / TOUCH OFF -> BOTTOM CORNERS (SPACIOUS & EXPANDED)
  // =========================================================================
  return (
    <>
      {/* ---------------- SPEEDOMETER (BOTTOM-LEFT) ---------------- */}
      <div
        id="speedo"
        className="fixed bottom-6 left-6 z-20 pointer-events-none select-none flex flex-col gap-1.5 p-4 rounded-2xl bg-neutral-950/80 backdrop-blur-xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.7)] min-w-[170px]"
      >
        {/* Header: Supersonic Badge & Flight Status */}
        <div className="flex items-center justify-between gap-2">
          {isSupersonic ? (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 text-cyan-300 font-mono text-[10px] font-black tracking-wider uppercase animate-pulse shadow-[0_0_12px_rgba(34,211,238,0.4)]">
              <Zap className="w-3 h-3 fill-current" />
              <span>SUPERSONIC</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-400 tracking-wider uppercase">
              <Gauge className="w-3 h-3 text-[#99fa47]" />
              <span>VELOCITY</span>
            </div>
          )}

          <span
            className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${
              isGrounded
                ? "bg-neutral-900 border-white/10 text-neutral-300"
                : "bg-sky-950/80 border-sky-400/40 text-sky-300"
            }`}
          >
            {isGrounded ? "GROUND" : "AIRBORNE"}
          </span>
        </div>

        {/* Speed Number Display */}
        <div className="flex items-baseline justify-between mt-0.5">
          <span
            className={`font-mono text-4xl sm:text-5xl font-black italic tracking-tight leading-none ${
              isSupersonic
                ? "text-cyan-300 drop-shadow-[0_0_16px_rgba(34,211,238,0.8)]"
                : "text-white"
            }`}
          >
            {roundedSpeed}
          </span>
          <div className="flex flex-col items-end">
            <span className="text-xs font-mono font-black tracking-widest text-neutral-400">
              KM/H
            </span>
            <span className="text-[9px] font-mono text-neutral-500 font-bold">
              SPEED
            </span>
          </div>
        </div>

        {/* Segmented LED Velocity Gauge */}
        <div className="flex items-center gap-1 mt-1 w-full">
          {Array.from({ length: totalSegments }).map((_, i) => {
            const active = i < activeSegments;
            return (
              <div
                key={i}
                className={`h-2 flex-1 rounded-xs transition-all duration-75 ${
                  active
                    ? i > 7
                      ? "bg-rose-500 shadow-[0_0_8px_#f43f5e]"
                      : i > 4
                      ? "bg-amber-400 shadow-[0_0_6px_#fbbf24]"
                      : "bg-[#99fa47] shadow-[0_0_6px_#99fa47]"
                    : "bg-neutral-800/80"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* ---------------- BOOST GAUGE (BOTTOM-RIGHT) ---------------- */}
      <div
        id="boostwrap"
        className="fixed bottom-6 right-6 z-20 pointer-events-none select-none flex items-center justify-center p-3.5 rounded-3xl bg-neutral-950/80 backdrop-blur-xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.7)]"
      >
        <div className="relative flex items-center justify-center">
          <svg className="w-28 h-28 sm:w-32 sm:h-32 -rotate-90">
            {/* Background Track */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              className="stroke-neutral-800/90"
              strokeWidth="7"
              fill="none"
            />
            {/* Active Fuel Arc */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke={boostColor}
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-75"
              style={{
                filter: `drop-shadow(0 0 8px ${boostColor}90)`
              }}
            />
          </svg>

          {/* Center Digital Readout */}
          <div className="absolute flex flex-col items-center">
            <span
              className="font-mono text-3xl sm:text-4xl font-black italic tracking-tight text-white leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
              style={{ color: roundedBoost > 0 ? "#ffffff" : "#737373" }}
            >
              {roundedBoost}
            </span>
            <div className="flex items-center gap-1 mt-1 text-[10px] font-mono font-bold tracking-widest uppercase text-neutral-300">
              <Flame
                className={`w-3 h-3 ${
                  roundedBoost > 0 ? "fill-current animate-pulse" : ""
                }`}
                style={{ color: boostColor }}
              />
              <span>BOOST</span>
            </div>
            <span
              className="text-[9px] font-mono font-bold"
              style={{ color: boostColor }}
            >
              {roundedBoost >= 100
                ? "100% MAX"
                : roundedBoost <= 0
                ? "EMPTY"
                : `${roundedBoost}%`}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

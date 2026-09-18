// @ts-nocheck
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Trophy, Play, Settings, HelpCircle, Activity,
  Volume2, VolumeX, Eye, RotateCcw, Pause, Sparkles,
  Zap, Disc, ChevronRight, Check, X, Shield, FastForward,
  Sliders
} from "lucide-react";
import { CFG, DEFAULT_CFG, TEAM, TEAM_NAME, TEAM_COLOR, STADIUM_THEMES } from "./game/config.js";
import { GameEngine } from "./game/engine.js";
import { RealTimeTuningPanel } from "./components/RealTimeTuningPanel";

export default function App() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  const [gameState, setGameState] = useState("MENU"); // MENU, PLAYING, COUNTDOWN, GOAL, REPLAY, GAMEOVER, PAUSED
  const [activePanel, setActivePanel] = useState(null); // 'settings' | 'controls' | 'diagnostics' | null
  const [matchMode, setMatchMode] = useState("2v2");
  const [playerTeam, setPlayerTeam] = useState(TEAM.PULSE);
  const [botSkill, setBotSkill] = useState(2); // 0=Rookie, 1=Semi-Pro, 2=All-Star
  const [stadiumTheme, setStadiumTheme] = useState(CFG.gfx.stadiumTheme || "NEON_CHAMPIONSHIP");

  // In-Game Live HUD stats
  const [score, setScore] = useState([0, 0]);
  const [matchTime, setMatchTime] = useState(300);
  const [isOvertime, setIsOvertime] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [ballcam, setBallcam] = useState(true);
  const [fps, setFps] = useState(60);
  const [playerStats, setPlayerStats] = useState({ boost: 33, speed: 0, isGrounded: true, stats: { goals: 0, shots: 0, saves: 0 } });
  const [goalEvent, setGoalEvent] = useState(null);
  const [announceText, setAnnounceText] = useState({ title: "", sub: "" });
  const [showDebug, setShowDebug] = useState(false);
  const [showTuningPanel, setShowTuningPanel] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [lastMatchResult, setLastMatchResult] = useState(null);

  // Settings State
  const [cfgState, setCfgState] = useState({
    masterVol: CFG.audio.master * 100,
    sfxVol: CFG.audio.sfx * 100,
    fov: CFG.camera.fov,
    camDistance: CFG.camera.distance,
    camHeight: CFG.camera.height,
    steerSens: CFG.input.steerSens * 100,
    airSens: CFG.input.airSens * 100,
    gravity: CFG.physics.gravity,
    wheelRadius: CFG.vehicle.wheel.radius,
    startBallcam: CFG.camera.startBallcam
  });

  useEffect(() => {
    // Detect touch device
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new GameEngine(canvas, (data) => {
      setGameState(data.state);
      setScore([...data.score]);
      setMatchTime(data.matchTime);
      setIsOvertime(data.overtime);
      setCountdown(data.countdown);
      setBallcam(data.ballcam);
      setFps(data.fps);
      if (data.playerCar) {
        setPlayerStats(data.playerCar);
      }
      if (data.goalEvent) {
        setGoalEvent(data.goalEvent);
      }
    });

    const ok = engine.init();
    if (ok) {
      engineRef.current = engine;
    }

    const handleKeyDown = (e) => {
      if (e.code === "Escape") {
        if (engineRef.current && (engineRef.current.world.state === "PLAYING" || engineRef.current.world.state === "PAUSED")) {
          engineRef.current.pause();
        }
      } else if (e.code === "Backquote") {
        setShowDebug(prev => !prev);
      } else if (e.code === "KeyT" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setShowTuningPanel(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (engineRef.current) {
        engineRef.current.stop();
      }
    };
  }, []);

  // Sync announcements with game state
  useEffect(() => {
    if (gameState === "COUNTDOWN") {
      setAnnounceText({
        title: countdown > 0 ? `${countdown}` : "GO!",
        sub: countdown > 0 ? "GET READY" : "KICKOFF"
      });
    } else if (gameState === "GOAL" && goalEvent) {
      setAnnounceText({
        title: "GOAL!",
        sub: `${goalEvent.scorer.toUpperCase()} SCORED`
      });
    } else if (gameState === "REPLAY") {
      setAnnounceText({
        title: "INSTANT REPLAY",
        sub: "GOAL PLAYBACK"
      });
    } else if (gameState === "GAMEOVER") {
      const winner = score[0] > score[1] ? 0 : (score[1] > score[0] ? 1 : -1);
      setAnnounceText({
        title: winner >= 0 ? `${TEAM_NAME[winner].toUpperCase()} WINS!` : "MATCH DRAW",
        sub: `FINAL SCORE: ${score[0]} - ${score[1]}`
      });
      setLastMatchResult({
        winner,
        score: [...score],
        playerGoals: playerStats.stats ? playerStats.stats.goals : 0
      });
    } else {
      setAnnounceText({ title: "", sub: "" });
    }
  }, [gameState, countdown, goalEvent, score]);

  const handleStartGame = (mode) => {
    if (!engineRef.current) return;
    let size = 2;
    if (mode === "1v1") size = 1;
    if (mode === "2v2") size = 2;
    if (mode === "3v3") size = 3;
    if (mode === "freeplay") size = 1;

    setMatchMode(mode);
    setActivePanel(null);
    engineRef.current.startMatch(size, playerTeam, botSkill);
  };

  const handleResume = () => {
    if (engineRef.current) engineRef.current.pause();
  };

  const handleExitToMenu = () => {
    if (engineRef.current) {
      engineRef.current.world.state = "MENU";
      setGameState("MENU");
    }
  };

  const handleToggleBallcam = () => {
    if (engineRef.current) {
      engineRef.current.camera.ballcam = !engineRef.current.camera.ballcam;
      setBallcam(engineRef.current.camera.ballcam);
    }
  };

  const handleUpdateConfig = (key, val) => {
    setCfgState(prev => ({ ...prev, [key]: val }));
    if (key === "masterVol") {
      const vol = Number(val) / 100;
      CFG.audio.master = vol;
      if (engineRef.current && engineRef.current.audio) {
        if (typeof engineRef.current.audio.setMaster === "function") {
          engineRef.current.audio.setMaster(vol);
        } else if (typeof engineRef.current.audio.setVolumes === "function") {
          engineRef.current.audio.setVolumes();
        }
      }
    } else if (key === "sfxVol") {
      const vol = Number(val) / 100;
      CFG.audio.sfx = vol;
      if (engineRef.current && engineRef.current.audio) {
        if (typeof engineRef.current.audio.setSfx === "function") {
          engineRef.current.audio.setSfx(vol);
        } else if (typeof engineRef.current.audio.setVolumes === "function") {
          engineRef.current.audio.setVolumes();
        }
      }
    } else if (key === "fov") {
      CFG.camera.fov = Number(val);
    } else if (key === "camDistance") {
      CFG.camera.distance = Number(val);
    } else if (key === "camHeight") {
      CFG.camera.height = Number(val);
    } else if (key === "steerSens") {
      CFG.input.steerSens = Number(val) / 100;
    } else if (key === "airSens") {
      CFG.input.airSens = Number(val) / 100;
    } else if (key === "gravity") {
      CFG.physics.gravity = Number(val);
    } else if (key === "wheelRadius") {
      const r = Number(val);
      CFG.vehicle.wheel.radius = r;
      if (engineRef.current && engineRef.current.world && engineRef.current.world.cars) {
        engineRef.current.world.cars.forEach(car => {
          if (car.wheels) {
            car.wheels.forEach(w => {
              w.radius = r;
            });
          }
        });
      }
    } else if (key === "startBallcam") {
      CFG.camera.startBallcam = val;
    }
  };

  const formatClock = (seconds) => {
    const s = Math.max(0, Math.floor(seconds));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem < 10 ? '0' : ''}${rem}`;
  };

  // Virtual touch control handlers
  const setVirtualInput = (key, val) => {
    if (engineRef.current && engineRef.current.input) {
      engineRef.current.input.virtual[key] = val;
    }
  };

  return (
    <main id="app" className="relative w-full h-full overflow-hidden select-none font-sans text-neutral-100">
      {/* 3D WebGL2 Canvas */}
      <canvas id="scene" ref={canvasRef} className="fixed inset-0 w-full h-full block touch-none z-0" />

      {/* Floating Options & Tuning Dialog Button (Always Visible in Top Right) */}
      <div className="fixed top-4 right-4 sm:top-5 sm:right-6 z-40 pointer-events-auto flex items-center gap-2">
        <button
          id="btn-floating-options"
          onClick={() => setShowTuningPanel(prev => !prev)}
          className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wider border shadow-2xl transition-all backdrop-blur-xl ${
            showTuningPanel
              ? "bg-[#99fa47] text-neutral-950 border-[#99fa47] shadow-[0_0_25px_rgba(153,250,71,0.5)] scale-105"
              : "bg-neutral-950/90 hover:bg-neutral-900 border-white/20 text-white hover:border-[#99fa47]/80 hover:text-[#99fa47] shadow-[0_10px_30px_rgba(0,0,0,0.7)]"
          }`}
          title="Floating Game Physics & 360 Flip Options [T]"
        >
          <Sliders className={`w-4 h-4 transition-transform group-hover:rotate-45 ${showTuningPanel ? 'text-neutral-950' : 'text-[#99fa47]'}`} />
          <span className="font-mono">OPTIONS [T]</span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${showTuningPanel ? 'bg-neutral-950/20 text-neutral-950' : 'bg-[#99fa47]/20 text-[#99fa47] border border-[#99fa47]/30'}`}>
            360° FLIP
          </span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* HUD (In-Game Screen) */}
      {/* ============================================================ */}
      {gameState !== "MENU" && (
        <div id="hud" className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4 sm:p-6">
          {/* Top Bar: Scoreboard & Clock */}
          <div className="flex justify-center w-full">
            <div id="scorebar" className="pointer-events-auto flex items-stretch bg-neutral-900/85 backdrop-blur-md border border-white/10 rounded-b-lg shadow-2xl overflow-hidden">
              {/* Pulse Team */}
              <div className="flex items-center gap-3 px-4 py-2 border-r border-white/10">
                <div className="w-3 h-3 rounded-full bg-[#ff3385] shadow-[0_0_8px_#ff3385]" />
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-300">PULSE</span>
                <span className="font-mono text-2xl sm:text-3xl font-bold text-[#ff3385] ml-1">{score[0]}</span>
              </div>

              {/* Match Clock */}
              <div id="clock" className={`flex flex-col items-center justify-center px-5 py-1 bg-black/50 ${matchTime <= 30 && !isOvertime ? 'text-amber-400 animate-pulse' : 'text-white'}`}>
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight">
                  {isOvertime ? `+${formatClock(matchTime)}` : formatClock(matchTime)}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                  {isOvertime ? "OVERTIME" : (gameState === "GOAL" ? "GOAL!" : (gameState === "REPLAY" ? "REPLAY" : "REGULAR"))}
                </span>
              </div>

              {/* Volt Team */}
              <div className="flex items-center gap-3 px-4 py-2 border-l border-white/10">
                <span className="font-mono text-2xl sm:text-3xl font-bold text-[#99fa47] mr-1">{score[1]}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-300">VOLT</span>
                <div className="w-3 h-3 rounded-full bg-[#99fa47] shadow-[0_0_8px_#99fa47]" />
              </div>
            </div>
          </div>

          {/* Top Left Tags & Controls */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-col gap-2 pointer-events-auto">
            <button
              onClick={handleToggleBallcam}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono tracking-wider border transition-all ${ballcam ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-neutral-900/80 border-white/10 text-neutral-400'}`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>BALLCAM: {ballcam ? "ON [C]" : "OFF [C]"}</span>
            </button>

            <button
              onClick={() => engineRef.current && engineRef.current.pause()}
              className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono tracking-wider bg-neutral-900/80 border border-white/10 text-neutral-300 hover:bg-neutral-800 transition"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>PAUSE [ESC]</span>
            </button>

            {/* Quick Controls Hint Bar */}
            <div className="hidden lg:flex flex-col gap-1 p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-neutral-400 max-w-xs">
              <div className="text-white font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#99fa47]" /> Air Control Guide:
              </div>
              <div><span className="text-neutral-200 font-semibold">[SPACE x2]</span> Fast 360° Front/Side Flip</div>
              <div><span className="text-[#99fa47] font-semibold">[HOLD R]</span> 3D Air Pitch [W/S] & Roll [A/D]</div>
              <div><span className="text-neutral-200 font-semibold">[A / D]</span> Ground Steer & Air Yaw</div>
            </div>
          </div>

          {/* Center Announcements (Countdown, Goal, Replay) */}
          {announceText.title && (
            <div id="announce" className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none animate-in zoom-in-90 duration-200">
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-black italic tracking-tighter uppercase text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.8)]">
                {announceText.title}
              </h1>
              <p className="mt-2 text-sm sm:text-lg font-mono font-bold tracking-[0.25em] text-neutral-300 uppercase">
                {announceText.sub}
              </p>
            </div>
          )}

          {/* Replay indicator badge */}
          {gameState === "REPLAY" && (
            <div id="replaytag" className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 px-3 py-1.5 bg-rose-950/90 border border-rose-500/40 rounded text-rose-300 font-mono text-xs font-bold tracking-widest uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>INSTANT REPLAY</span>
            </div>
          )}

          {/* Bottom Row: Speedometer (Left) & Boost Gauge (Right) */}
          <div className="flex justify-between items-end w-full">
            {/* Speedometer */}
            <div id="speedo" className="bg-neutral-900/80 backdrop-blur-md p-3.5 rounded-lg border border-white/10 flex flex-col gap-1.5 min-w-[130px] shadow-lg">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-2xl sm:text-3xl font-black text-white">{playerStats.speed}</span>
                <span className="text-[11px] font-mono tracking-widest text-neutral-400">KM/H</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-75"
                  style={{ width: `${Math.min(100, (playerStats.speed / 80) * 100)}%` }}
                />
              </div>
            </div>

            {/* Boost Circular Gauge */}
            <div id="boostwrap" className="relative flex flex-col items-center justify-center p-3 bg-neutral-900/85 backdrop-blur-md rounded-2xl border border-white/15 shadow-2xl">
              <svg className="w-24 h-24 sm:w-28 sm:h-28 -rotate-90">
                <circle cx="48" cy="48" r="40" className="stroke-neutral-800" strokeWidth="7" fill="none" />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  className={`transition-all duration-75 ${playerStats.boost > 50 ? 'stroke-[#ff3385]' : 'stroke-amber-400'}`}
                  strokeWidth="7"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * playerStats.boost) / 100}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-mono text-2xl sm:text-3xl font-black text-white leading-none">{playerStats.boost}</span>
                <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase mt-0.5">BOOST</span>
              </div>
            </div>
          </div>

          {/* Virtual Touch Controls for Mobile */}
          {isTouchDevice && (
            <div className="fixed inset-x-0 bottom-4 px-4 flex justify-between items-end pointer-events-auto z-20 md:hidden">
              {/* Left: Virtual D-Pad (Steer & Throttle) */}
              <div className="grid grid-cols-3 gap-1.5 bg-black/40 backdrop-blur p-2 rounded-xl border border-white/10">
                <div />
                <button
                  onTouchStart={() => setVirtualInput("throttle", 1)}
                  onTouchEnd={() => setVirtualInput("throttle", 0)}
                  className="w-12 h-12 bg-neutral-800/80 active:bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-sm border border-white/10"
                >▲</button>
                <div />
                <button
                  onTouchStart={() => setVirtualInput("steer", -1)}
                  onTouchEnd={() => setVirtualInput("steer", 0)}
                  className="w-12 h-12 bg-neutral-800/80 active:bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-sm border border-white/10"
                >◀</button>
                <button
                  onTouchStart={() => setVirtualInput("throttle", -1)}
                  onTouchEnd={() => setVirtualInput("throttle", 0)}
                  className="w-12 h-12 bg-neutral-800/80 active:bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-sm border border-white/10"
                >▼</button>
                <button
                  onTouchStart={() => setVirtualInput("steer", 1)}
                  onTouchEnd={() => setVirtualInput("steer", 0)}
                  className="w-12 h-12 bg-neutral-800/80 active:bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-sm border border-white/10"
                >▶</button>
              </div>

              {/* Right: Action Buttons (Jump, Boost, Drift, Air Roll, R modifier) */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onTouchStart={() => setVirtualInput("airRollHeld", true)}
                    onTouchEnd={() => setVirtualInput("airRollHeld", false)}
                    className="w-11 h-11 bg-[#99fa47]/20 border border-[#99fa47]/50 active:bg-[#99fa47]/60 rounded-full flex items-center justify-center text-[10px] font-mono font-bold text-[#99fa47]"
                  >AIR R</button>
                  <button
                    onTouchStart={() => setVirtualInput("rollLeft", true)}
                    onTouchEnd={() => setVirtualInput("rollLeft", false)}
                    className="w-11 h-11 bg-neutral-800/80 active:bg-purple-600 rounded-full flex items-center justify-center text-xs font-mono border border-white/10"
                  >ROLL L</button>
                  <button
                    onTouchStart={() => setVirtualInput("rollRight", true)}
                    onTouchEnd={() => setVirtualInput("rollRight", false)}
                    className="w-11 h-11 bg-neutral-800/80 active:bg-purple-600 rounded-full flex items-center justify-center text-xs font-mono border border-white/10"
                  >ROLL R</button>
                </div>
                <div className="flex gap-2">
                  <button
                    onTouchStart={() => setVirtualInput("slide", true)}
                    onTouchEnd={() => setVirtualInput("slide", false)}
                    className="w-12 h-12 bg-neutral-800/80 active:bg-amber-600 rounded-full flex items-center justify-center text-xs font-mono border border-white/10"
                  >DRIFT</button>
                  <button
                    onTouchStart={() => {
                      setVirtualInput("jump", true);
                      setTimeout(() => setVirtualInput("jump", false), 150);
                    }}
                    className="w-14 h-14 bg-sky-600 active:bg-sky-400 rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
                  >JUMP</button>
                  <button
                    onTouchStart={() => setVirtualInput("boost", true)}
                    onTouchEnd={() => setVirtualInput("boost", false)}
                    className="w-14 h-14 bg-rose-600 active:bg-rose-400 rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
                  >BOOST</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* MAIN MENU SCREEN */}
      {/* ============================================================ */}
      {gameState === "MENU" && (
        <div id="menu" className="screen z-20 flex flex-col justify-between p-6 sm:p-10 lg:p-16 overflow-y-auto bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#173a63] via-[#0b1b2d] to-[#06101b]">
          {/* Header */}
          <header className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#42b8ff] to-[#ffd166] drop-shadow-[0_0_25px_rgba(66,184,255,0.45)] leading-none">
                OVERDRIVE
              </h1>
              <p className="mt-1 text-sm sm:text-base font-bold tracking-[0.32em] text-[#a9ddff] uppercase">
                NEON VELOCITY
              </p>
              <p className="mt-3 text-xs sm:text-sm text-neutral-300 max-w-xl font-light">
                Physics-driven competitive 3D vehicle arena football with full aerial control, signed-distance collision, and responsive bots.
              </p>
            </div>
            <div className="text-right font-mono text-xs text-neutral-400 flex flex-col items-end gap-1">
              <span className="px-3 py-1 bg-[#123656] border border-[#55bcff]/60 rounded text-[#a9ddff] font-bold shadow-[0_0_15px_rgba(85,188,255,0.3)]">
                OVERDRIVE V2.4 • 240HZ PHY
              </span>
              <span>WEBGL2 ACCELERATED</span>
            </div>
          </header>

          {/* Navigation & Mode Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-8 items-center">
            {/* Play Modes List */}
            <div className="lg:col-span-2 flex flex-col border-t border-[#55bcff]/20">
              {[
                { id: "3v3", label: "PLAY 3v3", meta: "Full Stadium Chaos • 6 Vehicles Brawl" },
                { id: "2v2", label: "PLAY 2v2", meta: "Competitive Doubles Match • 5 Min" },
                { id: "1v1", label: "PLAY 1v1", meta: "Pure Mechanical Skill Duel" },
                { id: "freeplay", label: "FREE PLAY", meta: "Solo Arena • Infinite Boost & Ball Practice" }
              ].map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => handleStartGame(item.id)}
                  className="group flex items-center justify-between py-4 px-3 border-b border-[#55bcff]/20 hover:bg-[#1689d9]/20 hover:pl-6 transition-all text-left rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-[#55bcff] font-bold group-hover:text-[#ffd166]">0{idx + 1}</span>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black tracking-wider text-white group-hover:text-[#42b8ff] transition">
                        {item.label}
                      </h3>
                      <p className="text-xs font-mono text-neutral-400 mt-0.5">{item.meta}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#55bcff] group-hover:text-white transition group-hover:translate-x-1" />
                </button>
              ))}

              {/* Utility Buttons */}
              <div className="flex gap-3 mt-6 flex-wrap">
                <button
                  onClick={() => setShowTuningPanel(prev => !prev)}
                  className="btn flex items-center gap-2 px-4 py-2.5 rounded bg-[#1689d9] hover:bg-[#1e9bed] border border-[#55bcff] text-xs font-mono font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(85,188,255,0.4)]"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Real-Time Physics Tuning [T]</span>
                </button>
                <button
                  onClick={() => setActivePanel("settings")}
                  className="btn flex items-center gap-2 px-4 py-2.5 rounded bg-[#123656] hover:bg-[#1a4770] border border-[#55bcff]/40 text-xs font-mono font-bold uppercase tracking-wider text-white"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => setActivePanel("controls")}
                  className="btn flex items-center gap-2 px-4 py-2.5 rounded bg-[#123656] hover:bg-[#1a4770] border border-[#55bcff]/40 text-xs font-mono font-bold uppercase tracking-wider text-white"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Controls & Keys</span>
                </button>
                <button
                  onClick={() => setActivePanel("diagnostics")}
                  className="btn flex items-center gap-2 px-4 py-2.5 rounded bg-[#123656] hover:bg-[#1a4770] border border-[#55bcff]/40 text-xs font-mono font-bold uppercase tracking-wider text-white"
                >
                  <Activity className="w-4 h-4" />
                  <span>Diagnostics</span>
                </button>
              </div>
            </div>

            {/* Team, Stadium & Bot Selection Sidebar */}
            <div className="bg-[#102944]/80 backdrop-blur-md p-6 rounded-xl border border-[#66c7ff]/30 flex flex-col gap-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#42b8ff] font-bold">Choose Your Team</span>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <button
                    onClick={() => setPlayerTeam(TEAM.PULSE)}
                    className={`py-3 px-4 rounded-lg font-bold text-sm flex items-center justify-between border transition ${playerTeam === TEAM.PULSE ? 'bg-[#ff9745]/25 border-[#ff9745] text-[#ff9745] shadow-[0_0_12px_rgba(255,151,69,0.3)]' : 'bg-[#07101c]/60 border-white/10 text-neutral-400'}`}
                  >
                    <span>PULSE (ORANGE)</span>
                    {playerTeam === TEAM.PULSE && <Check className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setPlayerTeam(TEAM.VOLT)}
                    className={`py-3 px-4 rounded-lg font-bold text-sm flex items-center justify-between border transition ${playerTeam === TEAM.VOLT ? 'bg-[#35baff]/25 border-[#35baff] text-[#35baff] shadow-[0_0_12px_rgba(53,186,255,0.3)]' : 'bg-[#07101c]/60 border-white/10 text-neutral-400'}`}
                  >
                    <span>VOLT (BLUE)</span>
                    {playerTeam === TEAM.VOLT && <Check className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Stadium Arena Selection */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#42b8ff] font-bold flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#42b8ff]" /> Stadium Arena Environment
                  </span>
                </div>
                <div className="flex flex-col gap-2 mt-3">
                  {Object.values(STADIUM_THEMES).map((stadium) => {
                    const isSelected = stadiumTheme === stadium.id;
                    return (
                      <button
                        key={stadium.id}
                        onClick={() => {
                          setStadiumTheme(stadium.id);
                          CFG.gfx.stadiumTheme = stadium.id;
                        }}
                        className={`p-3 rounded-lg border text-left transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#1689d9]/30 border-[#55bcff] text-white shadow-[0_0_15px_rgba(85,188,255,0.3)]'
                            : 'bg-[#07101c]/60 border-white/10 text-neutral-300 hover:bg-[#123656]/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-9 rounded border border-white/20 shadow-inner flex flex-col overflow-hidden shrink-0"
                            style={{ background: stadium.turfBase }}
                          >
                            <div className="h-1/2 w-full" style={{ background: stadium.lineColor }} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs tracking-wide text-white">{stadium.name}</span>
                              {stadium.badge && (
                                <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded font-black ${
                                  stadium.id === 'NEON_CHAMPIONSHIP' || stadium.id === 'NEON_VELOCITY'
                                    ? 'bg-[#42b8ff] text-black shadow-[0_0_8px_rgba(66,184,255,0.6)]'
                                    : 'bg-white/20 text-white'
                                }`}>
                                  {stadium.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] font-mono text-neutral-400 mt-0.5">{stadium.subName}</p>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#42b8ff] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#42b8ff] font-bold">AI Bot Difficulty</span>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {[
                    { level: 0, label: "Rookie" },
                    { level: 1, label: "Semi-Pro" },
                    { level: 2, label: "All-Star" }
                  ].map(b => (
                    <button
                      key={b.level}
                      onClick={() => setBotSkill(b.level)}
                      className={`py-2 px-2 rounded font-mono text-xs font-bold border transition ${botSkill === b.level ? 'bg-[#1689d9] border-[#55bcff] text-white shadow-[0_0_10px_rgba(85,188,255,0.4)]' : 'bg-[#07101c]/40 border-white/10 text-neutral-400'}`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-[#06101b]/80 rounded-lg border border-[#55bcff]/20 text-xs text-neutral-300 font-mono leading-relaxed">
                <span className="text-[#ffd166] font-bold">Overdrive Controls:</span>
                <p className="mt-1">WASD drive · Shift boost · Space jump · Ctrl drift · Esc pause</p>
                <p className="mt-1 text-neutral-400">Hold R + WASD for 3D Air Pitch & Roll</p>
                <p className="text-neutral-400">C to Toggle Ballcam</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="flex justify-between items-center border-t border-[#55bcff]/20 pt-4 text-xs font-mono text-neutral-400 flex-wrap gap-2">
            <span>OVERDRIVE STRIKERS • READY TO STRIKE</span>
            {lastMatchResult && (
              <span className="text-[#a9ddff]">
                Last Match: Final {lastMatchResult.score[0]} - {lastMatchResult.score[1]} ({lastMatchResult.winner >= 0 ? `${TEAM_NAME[lastMatchResult.winner]} Won` : 'Draw'})
              </span>
            )}
          </footer>
        </div>
      )}

      {/* ============================================================ */}
      {/* PAUSE MENU OVERLAY */}
      {/* ============================================================ */}
      {gameState === "PAUSED" && (
        <div id="pause" className="screen z-30 flex items-center justify-center p-6 bg-black/70 backdrop-blur-md">
          <div className="bg-neutral-900/95 border border-white/15 rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col gap-6">
            <div>
              <span className="text-[11px] font-mono tracking-widest text-[#99fa47] uppercase">Match Intermission</span>
              <h2 className="text-3xl font-black italic uppercase text-white mt-1">PAUSED</h2>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleResume}
                className="btn primary py-3 px-4 rounded font-bold text-sm flex items-center justify-center gap-2 bg-[#ff3385] text-white hover:bg-[#ff4d94]"
              >
                <Play className="w-4 h-4" />
                <span>Resume Match</span>
              </button>
              <button
                onClick={() => {
                  if (engineRef.current) engineRef.current.world.setupKickoff(0);
                  handleResume();
                }}
                className="btn py-3 px-4 rounded bg-neutral-800 hover:bg-neutral-700 border border-white/10 font-bold text-sm flex items-center justify-center gap-2 text-white"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Kickoff</span>
              </button>
              <button
                onClick={() => {
                  setActivePanel("settings");
                }}
                className="btn py-3 px-4 rounded bg-neutral-800 hover:bg-neutral-700 border border-white/10 font-bold text-sm flex items-center justify-center gap-2 text-white"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button
                onClick={() => setShowTuningPanel(prev => !prev)}
                className="btn py-3 px-4 rounded bg-[#99fa47]/20 border border-[#99fa47]/40 hover:bg-[#99fa47]/30 font-bold text-sm flex items-center justify-center gap-2 text-[#99fa47]"
              >
                <Sliders className="w-4 h-4" />
                <span>Real-Time Physics Tuning [T]</span>
              </button>
              <button
                onClick={handleExitToMenu}
                className="btn py-3 px-4 rounded bg-neutral-800 hover:bg-neutral-700 border border-white/10 font-bold text-sm flex items-center justify-center gap-2 text-neutral-300"
              >
                <X className="w-4 h-4" />
                <span>Exit to Main Menu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MATCH END SCREEN */}
      {/* ============================================================ */}
      {gameState === "GAMEOVER" && (
        <div id="end" className="screen z-30 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="bg-neutral-900/95 border border-white/15 rounded-2xl p-8 max-w-lg w-full shadow-2xl flex flex-col items-center text-center gap-6">
            <Trophy className="w-16 h-16 text-amber-400 animate-bounce" />
            <div>
              <span className="text-xs font-mono tracking-widest text-[#99fa47] uppercase font-bold">Match Concluded</span>
              <h2 className="text-4xl sm:text-5xl font-black italic uppercase text-white mt-1">
                {score[0] > score[1] ? "PULSE WINS!" : (score[1] > score[0] ? "VOLT WINS!" : "MATCH TIED")}
              </h2>
            </div>

            {/* Scoreboard display */}
            <div className="flex items-center gap-6 font-mono">
              <div className="flex flex-col items-center">
                <span className="text-xs text-neutral-400">PULSE</span>
                <span className="text-4xl font-bold text-[#ff3385]">{score[0]}</span>
              </div>
              <span className="text-2xl text-neutral-600 font-light">—</span>
              <div className="flex flex-col items-center">
                <span className="text-xs text-neutral-400">VOLT</span>
                <span className="text-4xl font-bold text-[#99fa47]">{score[1]}</span>
              </div>
            </div>

            <div className="w-full h-px bg-white/10" />

            {/* Action buttons */}
            <div className="flex gap-3 w-full">
              <button
                onClick={() => handleStartGame(matchMode)}
                className="flex-1 py-3 px-4 rounded bg-[#ff3385] hover:bg-[#ff4d94] font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
              <button
                onClick={handleExitToMenu}
                className="flex-1 py-3 px-4 rounded bg-neutral-800 hover:bg-neutral-700 border border-white/10 font-bold text-sm text-neutral-300 flex items-center justify-center gap-2"
              >
                <span>Main Menu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SETTINGS PANEL MODAL */}
      {/* ============================================================ */}
      {activePanel === "settings" && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
          <div className="bg-neutral-900 border border-white/15 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <header className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-[#99fa47]" />
                <h2 className="text-xl font-bold uppercase tracking-tight text-white">Audio & Physics Settings</h2>
              </div>
              <button onClick={() => setActivePanel(null)} className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </header>

            <div className="p-6 overflow-y-auto flex flex-col gap-6">
              {/* Audio section */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#99fa47] font-semibold mb-3">Audio Levels</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1">
                      <span>Master Volume</span>
                      <span>{cfgState.masterVol}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100" value={cfgState.masterVol}
                      onChange={(e) => handleUpdateConfig("masterVol", Number(e.target.value))}
                      className="w-full accent-[#ff3385]"
                    />
                  </div>
                </div>
              </div>

              {/* Camera & FOV section */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#99fa47] font-semibold mb-3">Camera & Field of View</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1">
                      <span>Field of View (FOV)</span>
                      <span>{cfgState.fov}°</span>
                    </div>
                    <input
                      type="range" min="70" max="120" value={cfgState.fov}
                      onChange={(e) => handleUpdateConfig("fov", Number(e.target.value))}
                      className="w-full accent-[#ff3385]"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1">
                      <span>Camera Distance</span>
                      <span>{cfgState.camDistance}m</span>
                    </div>
                    <input
                      type="range" min="6" max="15" step="0.5" value={cfgState.camDistance}
                      onChange={(e) => handleUpdateConfig("camDistance", Number(e.target.value))}
                      className="w-full accent-[#ff3385]"
                    />
                  </div>
                </div>
              </div>

              {/* Physics customization */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#99fa47] font-semibold mb-3">Physics & Vehicle Tuning</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1">
                      <span>Wheel Size / Radius (چرخ ماشین)</span>
                      <span>{(cfgState.wheelRadius * 100).toFixed(1)} cm</span>
                    </div>
                    <input
                      type="range" min="0.10" max="0.35" step="0.005" value={cfgState.wheelRadius}
                      onChange={(e) => handleUpdateConfig("wheelRadius", Number(e.target.value))}
                      className="w-full accent-[#99fa47]"
                    />
                    <p className="text-[11px] text-neutral-400 mt-1">
                      افزایش سایز چرخ بدنه ماشین و سیستم تعلیق را بالاتر برده و بالا رفتن از رمپ‌ها را روان‌تر می‌کند.
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1">
                      <span>Gravity Acceleration</span>
                      <span>{cfgState.gravity} m/s²</span>
                    </div>
                    <input
                      type="range" min="3.0" max="12.0" step="0.5" value={cfgState.gravity}
                      onChange={(e) => handleUpdateConfig("gravity", Number(e.target.value))}
                      className="w-full accent-[#ff3385]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <footer className="p-4 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => {
                  setCfgState({
                    masterVol: DEFAULT_CFG.audio.master * 100,
                    sfxVol: DEFAULT_CFG.audio.sfx * 100,
                    fov: DEFAULT_CFG.camera.fov,
                    camDistance: DEFAULT_CFG.camera.distance,
                    camHeight: DEFAULT_CFG.camera.height,
                    steerSens: DEFAULT_CFG.input.steerSens * 100,
                    airSens: DEFAULT_CFG.input.airSens * 100,
                    gravity: DEFAULT_CFG.physics.gravity,
                    wheelRadius: DEFAULT_CFG.vehicle.wheel.radius,
                    startBallcam: DEFAULT_CFG.camera.startBallcam
                  });
                  handleUpdateConfig("wheelRadius", DEFAULT_CFG.vehicle.wheel.radius);
                }}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-xs font-mono text-neutral-300"
              >
                Reset Defaults
              </button>
              <button
                onClick={() => setActivePanel(null)}
                className="px-5 py-2 bg-[#ff3385] hover:bg-[#ff4d94] rounded text-xs font-bold text-white uppercase tracking-wider"
              >
                Done
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* CONTROLS GUIDE MODAL */}
      {/* ============================================================ */}
      {activePanel === "controls" && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
          <div className="bg-neutral-900 border border-white/15 rounded-2xl max-w-xl w-full flex flex-col overflow-hidden shadow-2xl">
            <header className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-[#ff3385]" />
                <h2 className="text-xl font-bold uppercase tracking-tight text-white">Full Control Map</h2>
              </div>
              <button onClick={() => setActivePanel(null)} className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </header>

            <div className="p-6 overflow-y-auto space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 py-2 border-b border-white/5">
                <span className="text-neutral-400">Drive / Reverse</span>
                <span className="text-white font-bold">W / S (Gas / Brake)</span>
              </div>
              <div className="grid grid-cols-2 py-2 border-b border-white/5">
                <span className="text-neutral-400">Steer / Ground & Air Yaw</span>
                <span className="text-white font-bold">A / D (Left / Right)</span>
              </div>
              <div className="grid grid-cols-2 py-2 border-b border-white/5 bg-[#99fa47]/5 px-2 rounded">
                <span className="text-[#99fa47] font-semibold">Hold [R] Modifier</span>
                <span className="text-[#99fa47] font-bold">W/S (Pitch Nose) & A/D (Barrel Roll)</span>
              </div>
              <div className="grid grid-cols-2 py-2 border-b border-white/5 bg-[#ff3385]/5 px-2 rounded">
                <span className="text-[#ff3385] font-semibold">Fast 360° Front/Side Flip</span>
                <span className="text-[#ff3385] font-bold">SPACE in Air + Direction (W/S/A/D)</span>
              </div>
              <div className="grid grid-cols-2 py-2 border-b border-white/5">
                <span className="text-neutral-400">Jump / Double Jump</span>
                <span className="text-white font-bold">SPACE (Hold for higher jump)</span>
              </div>
              <div className="grid grid-cols-2 py-2 border-b border-white/5">
                <span className="text-neutral-400">Rocket Boost</span>
                <span className="text-white font-bold">LSHIFT / RMB / F / B</span>
              </div>
              <div className="grid grid-cols-2 py-2 border-b border-white/5">
                <span className="text-neutral-400">Handbrake / Power-Slide</span>
                <span className="text-white font-bold">LCTRL / LALT / X</span>
              </div>
              <div className="grid grid-cols-2 py-2 border-b border-white/5">
                <span className="text-neutral-400">Direct Air Roll</span>
                <span className="text-white font-bold">Q (Roll Left) / E (Roll Right)</span>
              </div>
              <div className="grid grid-cols-2 py-2 border-b border-white/5">
                <span className="text-neutral-400">Toggle Ball Focus Cam</span>
                <span className="text-white font-bold">C</span>
              </div>
              <div className="grid grid-cols-2 py-2 border-b border-white/5">
                <span className="text-neutral-400">Floating Options & Physics Dialog</span>
                <span className="text-[#99fa47] font-bold">T (Or Click Top-Right Button)</span>
              </div>
              <div className="grid grid-cols-2 py-2">
                <span className="text-neutral-400">Gamepad Support</span>
                <span className="text-[#99fa47] font-bold">Xbox / PlayStation / DirectInput</span>
              </div>
            </div>

            <footer className="p-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setActivePanel(null)}
                className="px-5 py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-xs font-bold text-white uppercase tracking-wider"
              >
                Close
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DIAGNOSTICS MODAL */}
      {/* ============================================================ */}
      {activePanel === "diagnostics" && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
          <div className="bg-neutral-900 border border-white/15 rounded-2xl max-w-xl w-full flex flex-col overflow-hidden shadow-2xl">
            <header className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-[#99fa47]" />
                <h2 className="text-xl font-bold uppercase tracking-tight text-white">Engine Diagnostics</h2>
              </div>
              <button onClick={() => setActivePanel(null)} className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </header>

            <div className="p-6 font-mono text-xs space-y-2 text-neutral-300 bg-black/40">
              <p><span className="text-emerald-400">✓ WebGL2 Context:</span> Initialized with Floating Point Depth</p>
              <p><span className="text-emerald-400">✓ Physics Sub-stepping:</span> 240Hz Fixed Timestep Loop</p>
              <p><span className="text-emerald-400">✓ SDF Collision Field:</span> Rounded Octagonal Arena Boundaries</p>
              <p><span className="text-emerald-400">✓ Web Audio Synthesizer:</span> Procedural V8 Rev & Turbo Boost</p>
              <p><span className="text-emerald-400">✓ Circular Replay Buffer:</span> 60 FPS Continuous State Ring</p>
              <p><span className="text-emerald-400">✓ Current Render FPS:</span> {fps} FPS</p>
            </div>

            <footer className="p-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setActivePanel(null)}
                className="px-5 py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-xs font-bold text-white uppercase tracking-wider"
              >
                Close
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Debug Overlay */}
      {showDebug && (
        <div id="debug" className="absolute top-2 left-2 p-3 bg-black/80 border border-white/10 rounded font-mono text-[11px] text-[#99fa47] z-50 pointer-events-none">
          <div>FPS: {fps} | STATE: {gameState}</div>
          <div>BALLCAM: {ballcam ? 'ON' : 'OFF'}</div>
          <div>BOOST: {playerStats.boost}% | SPEED: {playerStats.speed} KM/H</div>
          <div>GROUNDED: {playerStats.isGrounded ? 'YES' : 'AIR'}</div>
          <div>TOGGLE OVERLAY: [~] | TUNING: [T]</div>
        </div>
      )}

      {/* Real-Time Live Tuning Panel Overlay */}
      <RealTimeTuningPanel
        engineRef={engineRef}
        isOpen={showTuningPanel}
        onClose={() => setShowTuningPanel(false)}
        onConfigChange={(key, val) => {
          if (key === "wheelRadius" && engineRef.current && engineRef.current.world && engineRef.current.world.cars) {
            engineRef.current.world.cars.forEach(car => {
              if (car.wheels) {
                car.wheels.forEach(w => {
                  w.radius = val;
                });
              }
            });
          }
        }}
      />
    </main>
  );
}

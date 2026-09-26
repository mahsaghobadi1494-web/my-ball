// @ts-nocheck
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Trophy, Play, Settings, HelpCircle, Activity,
  Volume2, VolumeX, Eye, RotateCcw, Pause, Sparkles,
  Zap, Disc, ChevronRight, Check, X, Shield, FastForward,
  Sliders, Smartphone, Sun, Monitor, Car, Palette, Camera,
  RotateCw, Maximize2, Minimize2
} from "lucide-react";
import { CFG, DEFAULT_CFG, TEAM, TEAM_NAME, TEAM_COLOR, STADIUM_THEMES, CAR_WHEEL_DEFS } from "./game/config.js";
import { GameEngine } from "./game/engine.js";
import { RealTimeTuningPanel } from "./components/RealTimeTuningPanel";
import { CarCustomizerDrawer } from "./components/CarCustomizerDrawer";
import { CarCustomizerDrawerUltra } from "./components/CarCustomizerDrawerUltra";
import { TouchControls } from "./components/TouchControls";
import { TelemetryHUD } from "./components/TelemetryHUD";

export default function App() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  const [gameState, setGameState] = useState("MENU"); // MENU, PLAYING, COUNTDOWN, GOAL, REPLAY, GAMEOVER, PAUSED
  const [activePanel, setActivePanel] = useState(null); // 'settings' | 'controls' | 'diagnostics' | null
  const [matchMode, setMatchMode] = useState("2v2");
  const [playerTeam, setPlayerTeam] = useState(TEAM.PULSE);
  const [botSkill, setBotSkill] = useState(2); // 0=Rookie, 1=Semi-Pro, 2=All-Star
  const [stadiumTheme, setStadiumTheme] = useState(CFG.gfx.stadiumTheme || "NEON_CHAMPIONSHIP");
  const [showCarCustomizer, setShowCarCustomizer] = useState(false);
  const [showCarCustomizerUltra, setShowCarCustomizerUltra] = useState(false);

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
  const [tuningPanelTab, setTuningPanelTab] = useState("graphics");
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isLandscape, setIsLandscape] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth > window.innerHeight;
    }
    return true;
  });
  const [virtualLandscape, setVirtualLandscape] = useState(false);

  const [touchControlsEnabled, setTouchControlsEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem("nvc_touch_controls");
      if (saved !== null) return JSON.parse(saved);
    } catch {}
    return false;
  });
  const [lastMatchResult, setLastMatchResult] = useState(null);
  const [initError, setInitError] = useState<string | null>(null);

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
    startBallcam: CFG.camera.startBallcam,
    perfMode: (CFG.gfx && CFG.gfx.perfMode) || "BALANCED",
    sunIntensity: (CFG.gfx && CFG.gfx.sunIntensity !== undefined) ? CFG.gfx.sunIntensity : 0.95,
    floodlightIntensity: (CFG.gfx && CFG.gfx.floodlightIntensity !== undefined) ? CFG.gfx.floodlightIntensity : 0.35,
    carFlakes: (CFG.gfx && CFG.gfx.carFlakes !== undefined) ? CFG.gfx.carFlakes : 0.00,
    carAmbientOcclusion: (CFG.gfx && CFG.gfx.carAmbientOcclusion !== undefined) ? CFG.gfx.carAmbientOcclusion : 0.85,
    shadowMapping: (CFG.gfx && CFG.gfx.shadowMapping !== undefined) ? CFG.gfx.shadowMapping : true,
    shadowSoftness: (CFG.gfx && CFG.gfx.shadowSoftness !== undefined) ? CFG.gfx.shadowSoftness : 1.0,
    carClearcoat: (CFG.gfx && CFG.gfx.carClearcoat !== undefined) ? CFG.gfx.carClearcoat : 0.95,
    carGloss: (CFG.gfx && CFG.gfx.carGloss !== undefined) ? CFG.gfx.carGloss : 0.96
  });

  useEffect(() => {
    // Detect touch device or mobile screen
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 800;
    setIsTouchDevice(isTouch);
    if (isTouch) {
      setTouchControlsEnabled(prev => {
        if (prev !== null) return prev;
        return true;
      });
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const engine = new GameEngine(canvas, (data) => {
        setGameState(prev => prev === data.state ? prev : data.state);
        setScore(prev => (prev[0] === data.score[0] && prev[1] === data.score[1]) ? prev : [...data.score]);
        setMatchTime(prev => Math.abs(prev - data.matchTime) < 0.2 ? prev : data.matchTime);
        setIsOvertime(prev => prev === data.overtime ? prev : data.overtime);
        setCountdown(prev => prev === data.countdown ? prev : data.countdown);
        setBallcam(prev => prev === data.ballcam ? prev : data.ballcam);
        setFps(prev => prev === data.fps ? prev : data.fps);
        if (data.playerCar) {
          setPlayerStats(prev => {
            if (prev &&
                Math.round(prev.boost) === Math.round(data.playerCar.boost) &&
                Math.abs(prev.speed - data.playerCar.speed) < 0.6 &&
                prev.isGrounded === data.playerCar.isGrounded) {
              return prev;
            }
            return data.playerCar;
          });
        }
        if (data.goalEvent) {
          setGoalEvent(data.goalEvent);
        }
      });

      const ok = engine.init();
      if (ok) {
        engineRef.current = engine;
        setInitError(null);
      } else {
        setInitError("خطا در بارگذاری موتور سه بعدی بازی.");
      }
    } catch (err: any) {
      console.error("GameEngine init caught error:", err);
      setInitError(err?.message || "مرورگر شما از WebGL2 پشتیبانی نمیکند یا شتاب‌دهنده گرافیکی غیرفعال است.");
    }

    const handleKeyDown = (e) => {
      if (e.code === "Escape") {
        if (engineRef.current && (engineRef.current.world.state === "PLAYING" || engineRef.current.world.state === "PAUSED")) {
          engineRef.current.pause();
        }
      } else if (e.code === "Backquote") {
        setShowDebug(prev => !prev);
      } else if (e.code === "KeyT" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setTuningPanelTab("graphics");
        setShowTuningPanel(prev => !prev);
      } else if ((e.code === "KeyV" || e.code === "KeyK") && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setTuningPanelTab("camera");
        setShowTuningPanel(prev => !prev);
      } else if ((e.code === "KeyG" || e.code === "KeyM") && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setShowCarCustomizer(prev => {
          if (!prev) setShowCarCustomizerUltra(false);
          return !prev;
        });
      } else if (e.code === "KeyU" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setShowCarCustomizerUltra(prev => {
          if (!prev) setShowCarCustomizer(false);
          return !prev;
        });
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

  // Camera showcase mode when customizer drawer is open
  useEffect(() => {
    if (engineRef.current && engineRef.current.camera) {
      engineRef.current.camera.customizerMode = showCarCustomizer || showCarCustomizerUltra;
    }
  }, [showCarCustomizer, showCarCustomizerUltra]);

  // Sync announcements with game state
  useEffect(() => {
    let nextTitle = "";
    let nextSub = "";

    if (gameState === "COUNTDOWN") {
      nextTitle = countdown > 0 ? `${countdown}` : "GO!";
      nextSub = countdown > 0 ? "GET READY" : "KICKOFF";
    } else if (gameState === "GOAL" && goalEvent) {
      nextTitle = "GOAL!";
      nextSub = `${goalEvent.scorer.toUpperCase()} SCORED`;
    } else if (gameState === "REPLAY") {
      nextTitle = "INSTANT REPLAY";
      nextSub = "GOAL PLAYBACK";
    } else if (gameState === "GAMEOVER") {
      const winner = score[0] > score[1] ? 0 : (score[1] > score[0] ? 1 : -1);
      nextTitle = winner >= 0 ? `${TEAM_NAME[winner].toUpperCase()} WINS!` : "MATCH DRAW";
      nextSub = `FINAL SCORE: ${score[0]} - ${score[1]}`;
      setLastMatchResult({
        winner,
        score: [score[0], score[1]],
        playerGoals: playerStats.stats ? playerStats.stats.goals : 0
      });
    }

    setAnnounceText(prev => {
      if (prev.title === nextTitle && prev.sub === nextSub) return prev;
      return { title: nextTitle, sub: nextSub };
    });
  }, [gameState, countdown, goalEvent, score[0], score[1]]);

  const handleStartGame = (mode) => {
    if (!engineRef.current) return;
    let size = 2;
    if (mode === "1v1") size = 1;
    if (mode === "2v2") size = 2;
    if (mode === "3v3") size = 3;
    if (mode === "freeplay") size = 1;

    setMatchMode(mode);
    setActivePanel(null);
    setShowCarCustomizer(false);
    setGameState(mode === "freeplay" ? "PLAYING" : "COUNTDOWN");
    if (engineRef.current.camera) {
      engineRef.current.camera.customizerMode = false;
    }
    engineRef.current.startMatch(size, playerTeam, botSkill, mode);
  };

  const handleResume = () => {
    if (engineRef.current) engineRef.current.pause();
  };

  const handleExitToMenu = () => {
    if (engineRef.current) {
      engineRef.current.world.state = "MENU";
      setGameState("MENU");
      const cars = engineRef.current.world.cars;
      const player = (cars && cars.find(c => c.isPlayer)) || (cars && cars[0]);
      if (player) {
        player.body.pos.set(0, 0.35, 0);
        player.body.quat.fromAxisAngle(0, 1, 0, Math.PI * 0.25);
        player.body.vel.zero();
        player.body.angVel.zero();
      }
    }
  };

  const handleToggleBallcam = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.camera.ballcam = !engineRef.current.camera.ballcam;
      setBallcam(engineRef.current.camera.ballcam);
    }
  }, []);

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
    } else if (key === "perfMode") {
      if (!CFG.gfx) CFG.gfx = {};
      CFG.gfx.perfMode = val;
    } else if (key === "sunIntensity") {
      if (!CFG.gfx) CFG.gfx = {};
      CFG.gfx.sunIntensity = Number(val);
    } else if (key === "floodlightIntensity") {
      if (!CFG.gfx) CFG.gfx = {};
      CFG.gfx.floodlightIntensity = Number(val);
    } else if (key === "carFlakes") {
      if (!CFG.gfx) CFG.gfx = {};
      CFG.gfx.carFlakes = Number(val);
    } else if (key === "carAmbientOcclusion") {
      if (!CFG.gfx) CFG.gfx = {};
      CFG.gfx.carAmbientOcclusion = Number(val);
    } else if (key === "shadowMapping") {
      if (!CFG.gfx) CFG.gfx = {};
      CFG.gfx.shadowMapping = Boolean(val);
    } else if (key === "shadowSoftness") {
      if (!CFG.gfx) CFG.gfx = {};
      CFG.gfx.shadowSoftness = Number(val);
    } else if (key === "carClearcoat") {
      if (!CFG.gfx) CFG.gfx = {};
      CFG.gfx.carClearcoat = Number(val);
    } else if (key === "carGloss") {
      if (!CFG.gfx) CFG.gfx = {};
      CFG.gfx.carGloss = Number(val);
    }
  };

  const formatClock = (seconds) => {
    const s = Math.max(0, Math.floor(seconds));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem < 10 ? '0' : ''}${rem}`;
  };

  // Fullscreen & Orientation Management
  const [isFullscreen, setIsFullscreen] = useState(() => {
    return typeof document !== "undefined" && !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
  });

  const toggleFullscreen = useCallback(async () => {
    try {
      const doc = document as any;
      const docEl = document.documentElement as any;

      if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen({ navigationUI: "hide" }).catch(() => docEl.requestFullscreen());
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
        } else if (docEl.mozRequestFullScreen) {
          await docEl.mozRequestFullScreen();
        } else if (docEl.msRequestFullscreen) {
          await docEl.msRequestFullscreen();
        }
        setIsFullscreen(true);

        // On mobile devices, try to lock orientation to landscape
        if (screen.orientation && (screen.orientation as any).lock) {
          try {
            await (screen.orientation as any).lock("landscape");
          } catch {}
        }
      } else {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn("Fullscreen toggle error:", err);
    }
  }, []);

  const toggleLandscapeFullscreen = useCallback(async () => {
    if (virtualLandscape) {
      setVirtualLandscape(false);
      return;
    }

    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch {}

    try {
      if (screen.orientation && (screen.orientation as any).lock) {
        await (screen.orientation as any).lock("landscape");
        return;
      }
    } catch (err) {}

    // Fallback: If device is in portrait, force virtual 90deg landscape layout
    if (window.innerHeight > window.innerWidth) {
      setVirtualLandscape(true);
    }
  }, [virtualLandscape]);

  useEffect(() => {
    const handleOrientation = () => {
      const landscape = window.innerWidth > window.innerHeight;
      setIsLandscape(landscape);
      if (landscape) {
        setVirtualLandscape(false);
      }
      if (engineRef.current && engineRef.current.renderer) {
        engineRef.current.renderer.resize();
      }
    };

    const handleFsChange = () => {
      const doc = document as any;
      const fsActive = !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement);
      setIsFullscreen(fsActive);
      if (engineRef.current && engineRef.current.renderer) {
        setTimeout(() => {
          if (engineRef.current && engineRef.current.renderer) {
            engineRef.current.renderer.resize();
          }
        }, 150);
      }
    };

    window.addEventListener("resize", handleOrientation);
    window.addEventListener("orientationchange", handleOrientation);
    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    document.addEventListener("mozfullscreenchange", handleFsChange);
    document.addEventListener("MSFullscreenChange", handleFsChange);

    return () => {
      window.removeEventListener("resize", handleOrientation);
      window.removeEventListener("orientationchange", handleOrientation);
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
      document.removeEventListener("mozfullscreenchange", handleFsChange);
      document.removeEventListener("MSFullscreenChange", handleFsChange);
    };
  }, []);

  // Virtual touch control handlers (Memoized for zero-lag performance)
  const setVirtualInput = useCallback((key, val) => {
    if (engineRef.current && engineRef.current.input) {
      engineRef.current.input.virtual[key] = val;
    }
  }, []);

  return (
    <main
      id="app"
      className={`relative w-full h-full overflow-hidden select-none font-sans text-neutral-100 ${
        virtualLandscape && !isLandscape ? "virtual-landscape-container" : ""
      }`}
    >
      {/* 3D WebGL2 Canvas */}
      <canvas id="scene" ref={canvasRef} className="fixed inset-0 w-full h-full block touch-none z-0" />

      {/* Fallback alert if WebGL2 / graphics context failed */}
      {initError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-neutral-950/95 backdrop-blur-md">
          <div className="max-w-md w-full bg-neutral-900 border border-red-500/40 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white">پشتیبانی گرافیکی WebGL2 یافت نشد</h2>
            <p className="text-xs text-neutral-300 leading-relaxed text-center">
              {initError}
            </p>
            <p className="text-[11px] text-neutral-400">
              لطفاً اطمینان حاصل کنید که شتاب‌دهنده سخت‌افزاری (Hardware Acceleration) در تنظیمات مرورگر شما فعال است.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm transition-all shadow-lg cursor-pointer"
            >
              بارگذاری مجدد بازی (Reload)
            </button>
          </div>
        </div>
      )}

      {/* Floating Options & Tuning Dialog Button (Always Visible in Top Right) */}
      <div className="fixed top-3 right-3 sm:top-5 sm:right-6 z-40 pointer-events-auto flex items-center gap-1.5 sm:gap-2">
        {/* Dedicated Fullscreen Button */}
        <button
          id="btn-toggle-fullscreen"
          onClick={toggleFullscreen}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-mono font-bold tracking-wider border shadow-2xl transition-all backdrop-blur-xl ${
            isFullscreen
              ? "bg-amber-400 text-neutral-950 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)]"
              : "bg-neutral-950/90 hover:bg-neutral-900 border-amber-400/40 text-amber-300 hover:text-white"
          }`}
          title={isFullscreen ? "خروج از تمام‌صفحه (Exit Fullscreen)" : "حالت تمام‌صفحه (Fullscreen)"}
        >
          {isFullscreen ? (
            <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-950" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
          )}
          <span className="hidden sm:inline font-mono">{isFullscreen ? "EXIT FULL" : "FULLSCREEN"}</span>
          <span className="text-[10px] sm:hidden font-bold">{isFullscreen ? "خروج" : "تمام‌صفحه"}</span>
        </button>

        {/* Landscape Mode Button for Mobile */}
        <button
          id="btn-toggle-landscape"
          onClick={toggleLandscapeFullscreen}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-mono font-bold tracking-wider border shadow-2xl transition-all backdrop-blur-xl ${
            isLandscape || virtualLandscape
              ? "bg-emerald-400 text-neutral-950 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]"
              : "bg-neutral-950/90 hover:bg-neutral-900 border-emerald-500/40 text-emerald-300 hover:text-white"
          }`}
          title="چرخش به حالت افقی (Landscape) برای بازی روی گوشی"
        >
          <RotateCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLandscape || virtualLandscape ? 'text-neutral-950' : 'text-emerald-400'}`} />
          <span className="hidden sm:inline font-mono">LANDSCAPE</span>
          <span className="text-[10px] sm:hidden font-bold">افقی</span>
        </button>

        {/* Quick Mobile Controls Toggle Button */}
        <button
          id="btn-toggle-touch"
          onClick={() => {
            setTouchControlsEnabled(prev => {
              const next = !prev;
              try { localStorage.setItem("nvc_touch_controls", JSON.stringify(next)); } catch {}
              return next;
            });
          }}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-mono font-bold tracking-wider border shadow-2xl transition-all backdrop-blur-xl ${
            touchControlsEnabled
              ? "bg-[#42b8ff] text-neutral-950 border-[#42b8ff] shadow-[0_0_20px_rgba(66,184,255,0.4)]"
              : "bg-neutral-950/90 hover:bg-neutral-900 border-white/20 text-neutral-400 hover:text-white"
          }`}
          title="Toggle Mobile On-Screen Touch Controls (کنترل لمسی روی صفحه)"
        >
          <Smartphone className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${touchControlsEnabled ? 'text-neutral-950' : 'text-[#42b8ff]'}`} />
          <span className="hidden sm:inline font-mono">TOUCH</span>
          <span className={`w-2 h-2 rounded-full ${touchControlsEnabled ? 'bg-neutral-950' : 'bg-neutral-600'}`} />
        </button>

        <button
          id="btn-floating-camera"
          onClick={() => {
            setTuningPanelTab("camera");
            setShowTuningPanel(prev => (tuningPanelTab === "camera" && prev ? false : true));
          }}
          className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wider border shadow-2xl transition-all backdrop-blur-xl ${
            showTuningPanel && tuningPanelTab === "camera"
              ? "bg-cyan-400 text-neutral-950 border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.5)] scale-105"
              : "bg-neutral-950/90 hover:bg-neutral-900 border-cyan-500/40 text-white hover:border-cyan-400 hover:text-cyan-300 shadow-[0_10px_30px_rgba(0,0,0,0.7)]"
          }`}
          title="تنظیمات پیشرفته دوربین و زاویه دید [کلید V]"
        >
          <Camera className={`w-4 h-4 transition-transform group-hover:scale-110 ${showTuningPanel && tuningPanelTab === "camera" ? 'text-neutral-950' : 'text-cyan-400'}`} />
          <span className="font-bold text-xs">دوربین [V]</span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${showTuningPanel && tuningPanelTab === "camera" ? 'bg-neutral-950/20 text-neutral-950' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'}`}>
            CAM
          </span>
        </button>

        <button
          id="btn-floating-options"
          onClick={() => {
            setTuningPanelTab("graphics");
            setShowTuningPanel(prev => (tuningPanelTab === "graphics" && prev ? false : true));
          }}
          className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wider border shadow-2xl transition-all backdrop-blur-xl ${
            showTuningPanel && tuningPanelTab === "graphics"
              ? "bg-[#99fa47] text-neutral-950 border-[#99fa47] shadow-[0_0_25px_rgba(153,250,71,0.5)] scale-105"
              : "bg-neutral-950/90 hover:bg-neutral-900 border-amber-400/40 text-white hover:border-amber-400 hover:text-amber-300 shadow-[0_10px_30px_rgba(0,0,0,0.7)]"
          }`}
          title="تنظیمات گرافیک، سایه‌زنی و نورپردازی بازی [کلید T]"
        >
          <Sun className={`w-4 h-4 transition-transform group-hover:rotate-45 ${showTuningPanel && tuningPanelTab === "graphics" ? 'text-neutral-950' : 'text-amber-400'}`} />
          <span className="font-bold text-xs">تنظیمات گرافیک [T]</span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${showTuningPanel && tuningPanelTab === "graphics" ? 'bg-neutral-950/20 text-neutral-950' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}`}>
            GFX
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
          <div className="absolute top-3 left-3 sm:top-5 sm:left-6 flex flex-col gap-1.5 pointer-events-auto z-30">
            <button
              onClick={handleToggleBallcam}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 rounded-xl text-xs font-mono tracking-wider border backdrop-blur-md transition-all ${ballcam ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-neutral-900/80 border-white/10 text-neutral-400'}`}
              title="Toggle Ballcam [C]"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">BALLCAM:</span>
              <span>{ballcam ? "ON" : "OFF"}</span>
              <span className="hidden sm:inline text-[10px] text-neutral-500">[C]</span>
            </button>

            <button
              onClick={() => {
                setTuningPanelTab("camera");
                setShowTuningPanel(prev => (tuningPanelTab === "camera" && prev ? false : true));
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 rounded-xl text-xs font-mono tracking-wider bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/90 hover:text-white transition backdrop-blur-md shadow-[0_0_12px_rgba(34,211,238,0.3)]"
              title="دوربین و زاویه دید [V]"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span>CAMERA</span>
              <span className="hidden sm:inline text-[10px] text-cyan-400/80">[V]</span>
            </button>

            <button
              onClick={() => setShowCarCustomizer(prev => !prev)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 rounded-xl text-xs font-mono tracking-wider bg-pink-950/80 border border-pink-500/50 text-pink-300 hover:bg-pink-900/90 hover:text-white transition backdrop-blur-md shadow-[0_0_12px_rgba(236,72,153,0.3)]"
              title="گاراژ و رنگ‌آمیزی ماشین [G]"
            >
              <Car className="w-3.5 h-3.5 text-pink-400" />
              <span>GARAGE</span>
              <span className="hidden sm:inline text-[10px] text-pink-400/80">[G]</span>
            </button>

            <button
              onClick={() => engineRef.current && engineRef.current.pause()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 rounded-xl text-xs font-mono tracking-wider bg-neutral-900/80 border border-white/10 text-neutral-300 hover:bg-neutral-800 transition backdrop-blur-md"
              title="Pause Match [ESC]"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>PAUSE</span>
              <span className="hidden sm:inline text-[10px] text-neutral-500">[ESC]</span>
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

          {/* Dynamic Non-Overlapping Telemetry HUD (Speedometer in KM/H + Supersonic + Boost Reactor) */}
          <TelemetryHUD
            speed={playerStats.speed}
            boost={playerStats.boost}
            isGrounded={playerStats.isGrounded}
            touchControlsActive={isTouchDevice || touchControlsEnabled}
          />

          {/* Virtual Touch Controls for Mobile / On-Screen Play */}
          {(isTouchDevice || touchControlsEnabled) && (
            <TouchControls
              onVirtualInput={setVirtualInput}
              ballcam={ballcam}
              onToggleBallcam={handleToggleBallcam}
              boostAmount={playerStats.boost}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
            />
          )}

          {/* Mobile Portrait Suggestion Pill */}
          {isTouchDevice && !isLandscape && !virtualLandscape && (
            <div className="fixed top-14 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
              <button
                type="button"
                onClick={toggleLandscapeFullscreen}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-950/90 border border-emerald-400/50 text-emerald-300 font-mono text-[11px] font-bold shadow-2xl backdrop-blur-xl active:scale-95 transition-transform"
              >
                <RotateCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span>برای تجربه بهتر لمس کنید: حالت لنداسکیپ (افقی)</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* MAIN MENU SCREEN */}
      {/* ============================================================ */}
      {gameState === "MENU" && (
        <div
          id="menu"
          className={`screen z-20 flex flex-col justify-between p-6 sm:p-10 lg:p-16 overflow-y-auto bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#173a63]/95 via-[#0b1b2d]/98 to-[#06101b] transition-all duration-300 ${
            (showCarCustomizer || showCarCustomizerUltra) ? "opacity-0 pointer-events-none -translate-x-12" : "opacity-100 pointer-events-auto translate-x-0"
          }`}
        >
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
                  onClick={() => {
                    setShowCarCustomizer(prev => {
                      if (!prev) setShowCarCustomizerUltra(false);
                      return !prev;
                    });
                  }}
                  className="btn flex items-center gap-2 px-4 py-2.5 rounded bg-gradient-to-r from-pink-600/30 via-pink-700/40 to-purple-600/30 hover:from-pink-600/50 hover:to-purple-600/50 border border-pink-400/60 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(236,72,153,0.35)] transition"
                  title="تغییر مدل ماشین و رنگ‌آمیزی تک‌تک قطعات [G]"
                >
                  <Car className="w-4 h-4 text-pink-300 animate-pulse" />
                  <span>گاراژ و نقاشی ماشین (Paint Shop) [G]</span>
                </button>
                <button
                  onClick={() => {
                    setShowCarCustomizerUltra(prev => {
                      if (!prev) setShowCarCustomizer(false);
                      return !prev;
                    });
                  }}
                  className="btn flex items-center gap-2 px-4 py-2.5 rounded bg-gradient-to-r from-purple-600/45 via-indigo-700/50 to-fuchsia-600/45 hover:from-purple-600/60 hover:to-fuchsia-600/60 border border-purple-400/80 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-[0_0_25px_rgba(168,85,247,0.5)] transition"
                  title="گاراژ فوق پیشرفته اولترا ورژن ۲ [U]"
                >
                  <Zap className="w-4 h-4 text-purple-300 animate-pulse" />
                  <span>گاراژ فوق پیشرفته اولترا (Garage Ultra v2) [U]</span>
                </button>
                <button
                  onClick={() => {
                    setTuningPanelTab("graphics");
                    setShowTuningPanel(prev => !prev);
                  }}
                  className="btn flex items-center gap-2 px-4 py-2.5 rounded bg-gradient-to-r from-amber-500/20 via-[#1689d9] to-[#0ea5e9] hover:from-amber-500/30 hover:to-[#38bdf8] border border-amber-400/50 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-[0_0_18px_rgba(245,158,11,0.3)]"
                >
                  <Sun className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>تنظیمات گرافیک (Graphics) [T]</span>
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
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3">
                  {[
                    { level: 0, label: "Rookie", fa: "تازه‌کار" },
                    { level: 1, label: "Amateur", fa: "نیمه‌حرفه‌ای" },
                    { level: 2, label: "Pro", fa: "حرفه‌ای" },
                    { level: 3, label: "All-Star", fa: "ستاره" },
                    { level: 4, label: "Legendary", fa: "افسانه‌ای" }
                  ].map(b => (
                    <button
                      key={b.level}
                      onClick={() => setBotSkill(b.level)}
                      className={`py-2 px-2 rounded font-mono text-xs font-bold border transition flex flex-col items-center justify-center ${botSkill === b.level ? 'bg-[#1689d9] border-[#55bcff] text-white shadow-[0_0_10px_rgba(85,188,255,0.4)]' : 'bg-[#07101c]/40 border-white/10 text-neutral-400 hover:text-white hover:bg-white/5'}`}
                    >
                      <span className="font-bold text-[11px]">{b.label}</span>
                      <span className="text-[9px] opacity-75 font-sans">{b.fa}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-[#06101b]/80 rounded-lg border border-[#55bcff]/20 text-xs text-neutral-300 font-mono leading-relaxed">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#ffd166] font-bold">Overdrive Controls:</span>
                  <span className="text-[10px] text-[#42b8ff] font-bold bg-[#42b8ff]/10 px-1.5 py-0.5 rounded border border-[#42b8ff]/30">📱 Mobile Touch Ready</span>
                </div>
                <p>PC: WASD drive · Shift boost · Space jump · Ctrl drift · Esc pause</p>
                <p className="text-neutral-400">Mobile: Joystick/D-pad, Jump/Flip, Boost, Drift, Air Roll on screen</p>
                <p className="text-neutral-400">Hold R + WASD for 3D Air Pitch & Roll · C for Ballcam</p>
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
                onClick={() => {
                  setTuningPanelTab("graphics");
                  setShowTuningPanel(prev => !prev);
                }}
                className="btn py-3 px-4 rounded bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-400/40 hover:border-amber-400 font-bold text-sm flex items-center justify-center gap-2 text-amber-300 shadow-sm"
              >
                <Sun className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>تنظیمات گرافیک و شیدرها [T]</span>
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
                <h2 className="text-xl font-bold uppercase tracking-tight text-white">تنظیمات بازی و گرافیک (Game & Visual Settings)</h2>
              </div>
              <button onClick={() => setActivePanel(null)} className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </header>

            <div className="p-6 overflow-y-auto flex flex-col gap-6">
              {/* Graphics & Visuals Section (تنظیمات گرافیک، نور و پرفورمنس) */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-neutral-950/80 to-neutral-950/80 border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun className="w-5 h-5 text-amber-400" />
                    <div>
                      <h3 className="text-sm font-bold text-white">تنظیمات گرافیک و نورپردازی (Graphics & Lighting)</h3>
                      <p className="text-[11px] text-neutral-400">حالت پرفورمنس ۶۰ فریم، شدت نور خورشید، پرژکتورها و استادیوم</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActivePanel(null);
                      setTuningPanelTab("graphics");
                      setShowTuningPanel(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-400 text-neutral-950 font-bold text-xs hover:bg-amber-300 transition shadow flex items-center gap-1.5"
                  >
                    <span>پنل کامل گرافیک [T]</span>
                  </button>
                </div>

                {/* Performance mode */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono text-neutral-300">
                    <span>حالت پردازش و بهینه‌سازی (Performance Mode)</span>
                    <span className="text-amber-400 font-bold">{cfgState.perfMode}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "BALANCED", label: "متعادل (Balanced 60fps)", desc: "کیفیت بالا + فریم روان" },
                      { id: "HIGH", label: "گرافیک بالا (High)", desc: "سایه‌های تیز و شفاف" },
                      { id: "ULTRA", label: "فوق سبک (Ultra)", desc: "حداکثر فریم‌ریت و سرعت" }
                    ].map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleUpdateConfig("perfMode", m.id)}
                        className={`p-2 rounded-lg border text-left transition ${
                          cfgState.perfMode === m.id
                            ? "bg-amber-400/20 border-amber-400 text-white shadow-sm"
                            : "bg-neutral-900 border-white/10 text-neutral-400 hover:text-white"
                        }`}
                      >
                        <div className="text-xs font-bold">{m.label}</div>
                        <div className="text-[10px] text-neutral-400 leading-tight mt-0.5">{m.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sunlight Intensity */}
                <div>
                  <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1">
                    <span>شدت نور مستقیم خورشید (Direct Sunlight)</span>
                    <span className="text-amber-300 font-bold">{Math.round((cfgState.sunIntensity ?? 0.95) * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0.2" max="2.0" step="0.05"
                    value={cfgState.sunIntensity ?? 0.95}
                    onChange={(e) => handleUpdateConfig("sunIntensity", Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                {/* Floodlight Intensity */}
                <div>
                  <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1">
                    <span>نور پرژکتورهای استادیوم (Floodlight Intensity)</span>
                    <span className="text-amber-300 font-bold">{Math.round((cfgState.floodlightIntensity ?? 0.35) * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0.0" max="1.5" step="0.05"
                    value={cfgState.floodlightIntensity ?? 0.35}
                    onChange={(e) => handleUpdateConfig("floodlightIntensity", Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                {/* Sun Shadow Mapping */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div>
                    <span className="text-xs font-bold text-white block">سایه‌اندازی زنده آفتاب (Sun Shadow Mapping)</span>
                    <span className="text-[10px] text-neutral-400">سایه‌های پرسپکتیو و عمق‌دار ماشین و چرخ‌ها بر اساس جهت خورشید</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUpdateConfig("shadowMapping", !(cfgState.shadowMapping !== false))}
                    className={`px-3 py-1 rounded text-xs font-mono font-bold border transition ${
                      cfgState.shadowMapping !== false
                        ? "bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-sm"
                        : "bg-neutral-800 text-neutral-400 border-white/10"
                    }`}
                  >
                    {cfgState.shadowMapping !== false ? "فعال (ON)" : "خاموش (OFF)"}
                  </button>
                </div>

                {/* Car Paint Metallic Flakes */}
                <div>
                  <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1">
                    <span>اکلیل و شاین متالیک بدنه (Metallic Flakes)</span>
                    <span className="text-amber-300 font-bold">{Math.round((cfgState.carFlakes ?? 0.85) * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0.0" max="2.0" step="0.05"
                    value={cfgState.carFlakes ?? 0.85}
                    onChange={(e) => handleUpdateConfig("carFlakes", Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                {/* Car Ambient Occlusion */}
                <div>
                  <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1">
                    <span>سایه‌زنی شیارها و شکاف‌های بدنه (Ambient Occlusion)</span>
                    <span className="text-amber-300 font-bold">{Math.round((cfgState.carAmbientOcclusion ?? 0.85) * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0.0" max="1.5" step="0.05"
                    value={cfgState.carAmbientOcclusion ?? 0.85}
                    onChange={(e) => handleUpdateConfig("carAmbientOcclusion", Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                {/* Car Clearcoat */}
                <div>
                  <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1">
                    <span>پوشش شیشه‌ای کیلر بدنه (Clearcoat & Fresnel)</span>
                    <span className="text-amber-300 font-bold">{Math.round((cfgState.carClearcoat ?? 0.80) * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0.0" max="1.5" step="0.05"
                    value={cfgState.carClearcoat ?? 0.80}
                    onChange={(e) => handleUpdateConfig("carClearcoat", Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>
              </div>

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

              {/* Mobile & Touch Controls */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#42b8ff] font-semibold mb-3">Mobile & Touch Controls (کنترل موبایل)</h3>
                <div className="p-3 bg-neutral-950/60 rounded-xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">On-Screen Virtual Controls</span>
                    <span className="text-[11px] text-neutral-400">نمایش جوی‌استیک، دکمه‌های پرش، بوست، دریفت و رول روی صفحه</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTouchControlsEnabled(prev => {
                        const next = !prev;
                        try { localStorage.setItem("nvc_touch_controls", JSON.stringify(next)); } catch {}
                        return next;
                      });
                    }}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition ${
                      touchControlsEnabled
                        ? "bg-[#42b8ff] text-neutral-950 border-[#42b8ff] shadow-[0_0_12px_rgba(66,184,255,0.4)]"
                        : "bg-neutral-800 border-white/10 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {touchControlsEnabled ? "فعال (ON)" : "غیرفعال (OFF)"}
                  </button>
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
              <div className="grid grid-cols-2 py-2 border-b border-white/5 bg-[#42b8ff]/5 px-2 rounded">
                <span className="text-[#42b8ff] font-semibold">📱 Mobile Touch Controls</span>
                <span className="text-[#42b8ff] font-bold">Virtual Joystick / D-Pad + Jump, Boost, Drift, Air Roll</span>
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

      {/* Left Floating Trigger Button for Car Garage & Customizer */}
      {!showCarCustomizer && (
        <button
          id="car-customizer-left-btn"
          onClick={() => setShowCarCustomizer(true)}
          className="fixed top-1/2 -translate-y-1/2 left-0 z-40 flex items-center gap-2 px-3 py-2.5 rounded-r-2xl bg-neutral-950/90 hover:bg-neutral-900 border-y border-r border-pink-500/40 hover:border-pink-500/80 text-pink-300 hover:text-white shadow-[10px_0_30px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-all duration-200 group cursor-pointer"
          title="گاراژ ماشین و نقاشی قطعات [G]"
        >
          <div className="w-7 h-7 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 group-hover:scale-110 shadow-[0_0_12px_rgba(236,72,153,0.3)] transition">
            <Car className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="hidden sm:flex flex-col text-right pr-1">
            <span className="text-xs font-bold text-white leading-tight flex items-center gap-1.5">
              گاراژ و نقاشی
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
            </span>
            <span className="text-[9px] text-pink-300/80 font-mono">CAR & PAINT [G]</span>
          </div>
        </button>
      )}

      {/* Left Floating Trigger Button for Garage Ultra */}
      {!showCarCustomizerUltra && (
        <button
          id="car-customizer-ultra-left-btn"
          onClick={() => {
            setShowCarCustomizerUltra(true);
            setShowCarCustomizer(false);
          }}
          className="fixed top-[calc(50%+60px)] -translate-y-1/2 left-0 z-40 flex items-center gap-2 px-3 py-2.5 rounded-r-2xl bg-neutral-950/95 hover:bg-neutral-900 border-y border-r border-purple-500/40 hover:border-purple-500/80 text-purple-300 hover:text-white shadow-[10px_0_30px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-all duration-200 group cursor-pointer"
          title="گاراژ فوق پیشرفته اولترا [U]"
        >
          <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:scale-110 shadow-[0_0_12px_rgba(168,85,247,0.3)] transition">
            <Zap className="w-4 h-4 stroke-[2.2] animate-pulse" />
          </div>
          <div className="hidden sm:flex flex-col text-right pr-1">
            <span className="text-xs font-bold text-white leading-tight flex items-center gap-1.5">
              گاراژ Ultra
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            </span>
            <span className="text-[9px] text-purple-300/80 font-mono">GARAGE ULTRA [U]</span>
          </div>
        </button>
      )}

      {/* Floating 360-degree Garage Preview Banner */}
      {showCarCustomizer && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto bg-[#0b1b2d]/85 backdrop-blur-md border border-pink-500/40 rounded-full px-5 py-2 shadow-[0_0_25px_rgba(236,72,153,0.35)] flex items-center gap-3 animate-fade-in text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
          <span className="text-white font-bold">پیش‌نمایش گاراژ ۳۶۰ درجه ماشین</span>
          <span className="text-neutral-400 hidden sm:inline">| برای چرخش موس را بکشید یا اسکرول کنید</span>
          <button
            onClick={() => setShowCarCustomizer(false)}
            className="ml-2 px-2.5 py-0.5 rounded bg-pink-600/70 hover:bg-pink-500 text-white text-[11px] font-bold transition"
          >
            {gameState === "MENU" ? "بازگشت به منو" : "بستن گاراژ"}
          </button>
        </div>
      )}

      {/* Floating 360-degree Garage Ultra Preview Banner */}
      {showCarCustomizerUltra && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto bg-slate-950/90 backdrop-blur-md border border-purple-500/40 rounded-full px-5 py-2 shadow-[0_0_25px_rgba(168,85,247,0.45)] flex items-center gap-3 animate-fade-in text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          <span className="text-white font-bold">پیش‌نمایش گاراژ فوق پیشرفته اولترا (Garage Ultra v2)</span>
          <span className="text-neutral-400 hidden sm:inline">| نسخه دوم • مدل‌های آیرودینامیک</span>
          <button
            onClick={() => setShowCarCustomizerUltra(false)}
            className="ml-2 px-2.5 py-0.5 rounded bg-purple-600/70 hover:bg-purple-500 text-white text-[11px] font-bold transition"
          >
            {gameState === "MENU" ? "بازگشت به منو" : "بستن گاراژ"}
          </button>
        </div>
      )}

      {/* Car Customizer Drawer on Left Side */}
      <CarCustomizerDrawer
        isOpen={showCarCustomizer}
        onClose={() => setShowCarCustomizer(false)}
        engineRef={engineRef}
        onCustomizationChange={(key, val) => {
          // Live feedback: sync wheel radius if defined in CAR_WHEEL_DEFS
          if (key === "wheel" && CAR_WHEEL_DEFS[val]) {
            const r = CAR_WHEEL_DEFS[val].radius || 0.38;
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
          }
        }}
      />

      {/* Car Customizer Drawer Ultra on Left Side */}
      <CarCustomizerDrawerUltra
        isOpen={showCarCustomizerUltra}
        onClose={() => setShowCarCustomizerUltra(false)}
        engineRef={engineRef}
        onCustomizationChange={(key, val) => {
          if (key === "wheel" && CAR_WHEEL_DEFS[val]) {
            const r = CAR_WHEEL_DEFS[val].radius || 0.38;
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
          }
        }}
      />

      {/* Real-Time Live Tuning Panel Overlay */}
      <RealTimeTuningPanel
        engineRef={engineRef}
        isOpen={showTuningPanel}
        initialTab={tuningPanelTab}
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

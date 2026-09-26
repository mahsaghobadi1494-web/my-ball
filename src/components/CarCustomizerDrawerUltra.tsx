// @ts-nocheck
import React, { useState, useMemo, useEffect } from "react";
import { X, Sparkles, Sliders, Check, Palette, Car, Sticker, Crown, Radio, Trophy, Disc } from "lucide-react";
import { CFG } from "../game/config.js";
import {
  getUltraCars,
  getUltraWheels,
  getUltraFinishes,
  getUltraRimFinishes,
  getUltraCelebrations,
  getUltraToppers,
  getUltraAntennas,
  getUltraDecals,
  getUltraPalettes,
} from "../game/ultraCarAdapter.js";

function UltraCardThumb({ kind, id, label }) {
  const [imgSrcIdx, setImgSrcIdx] = useState(0);
  const [hasError, setHasError] = useState(false);

  if (!id || id === 'none') {
    return (
      <div className="thumb bg-[#0c0e13] relative flex items-center justify-center overflow-hidden">
        <span className="text-[10px] text-slate-500">None</span>
      </div>
    );
  }

  const cleanId = String(id).toLowerCase().trim();
  let folder = 'bodies';
  if (kind === 'antenna' || kind === 'antennas') folder = 'antenna';
  else if (kind === 'decal' || kind === 'decals' || kind === 'vinyl') folder = 'decals';
  else if (kind === 'wheel' || kind === 'wheels') folder = 'wheels';
  else if (kind === 'topper' || kind === 'toppers' || kind === 'hat') folder = 'toppers';
  else if (kind === 'celebration' || kind === 'celebrations' || kind === 'goal' || kind === 'goals') folder = 'celebrations';
  else if (kind === 'body' || kind === 'bodies' || kind === 'car' || kind === 'cars') folder = 'bodies';

  const candidates = [
    `/Images/${folder}/${cleanId}.png`,
    `/Images/${folder}/${cleanId.replace(/-/g, '')}.png`,
    `/Images/${folder}/${cleanId.replace(/_/g, '')}.png`,
  ];
  const currentSrc = candidates[imgSrcIdx] || candidates[0];

  const handleImgError = () => {
    if (imgSrcIdx < candidates.length - 1) {
      setImgSrcIdx(prev => prev + 1);
    } else {
      setHasError(true);
    }
  };

  return (
    <div className="thumb bg-[#0c0e13] relative flex items-center justify-center overflow-hidden">
      {!hasError ? (
        <img
          alt={label || id}
          src={currentSrc}
          onError={handleImgError}
          style={{
            width: "100%",
            height: "100%",
            objectFit: (folder === "decals") ? "cover" : "contain"
          }}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-gradient-to-br from-slate-900 via-neutral-900 to-black">
          <Car className="w-7 h-7 text-indigo-400/80 mb-1" />
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider truncate max-w-full">
            {cleanId}
          </span>
        </div>
      )}
    </div>
  );
}

export function CarCustomizerDrawerUltra({
  isOpen,
  onClose,
  engineRef,
  onCustomizationChange
}) {
  const [activeSection, setActiveSection] = useState("cars");
  const [searchQuery, setSearchQuery] = useState("");

  // Equipped states
  const [selectedModel, setSelectedModel] = useState(
    (CFG.customization && CFG.customization.model) || "hooligan"
  );
  const [selectedWheel, setSelectedWheel] = useState(
    (CFG.customization && CFG.customization.wheel) || "falconstar"
  );
  const [selectedDecal, setSelectedDecal] = useState(
    (CFG.customization && CFG.customization.vinyl) || "datastream"
  );
  const [selectedFinish, setSelectedFinish] = useState(
    (CFG.customization && CFG.customization.finish) || "gloss"
  );
  const [selectedRimFinish, setSelectedRimFinish] = useState(
    (CFG.customization && CFG.customization.rimFinish) || "native"
  );
  const [selectedCelebration, setSelectedCelebration] = useState(
    (CFG.customization && CFG.customization.celebration) || "donutstorm"
  );
  const [selectedHat, setSelectedHat] = useState(
    (CFG.customization && CFG.customization.hat) || "none"
  );
  const [selectedAntenna, setSelectedAntenna] = useState(
    (CFG.customization && CFG.customization.antenna) || "none"
  );

  // Paint Colors
  const [bodyColor, setBodyColor] = useState(
    (CFG.customization && CFG.customization.bodyColor) || "#2563eb"
  );
  const [accentColor, setAccentColor] = useState(
    (CFG.customization && CFG.customization.accentColor) || "#1e293b"
  );
  const [hubColor, setHubColor] = useState(
    (CFG.customization && CFG.customization.hubColor) || "#cbd5e1"
  );

  // Dynamic Scale and Physics Fine-Tuning States
  const [topperScale, setTopperScale] = useState(
    (CFG.customization && CFG.customization.topperScale !== undefined) ? CFG.customization.topperScale : 2.125
  );
  const [rideHeight, setRideHeight] = useState(
    (CFG.customization && CFG.customization.rideHeight !== undefined) ? CFG.customization.rideHeight : 1.0
  );
  const [wheelCamber, setWheelCamber] = useState(
    (CFG.customization && CFG.customization.wheelCamber !== undefined) ? CFG.customization.wheelCamber : 0.0
  );

  // Raw data catalogs
  const ultraCars = useMemo(() => getUltraCars(), []);
  const ultraWheels = useMemo(() => getUltraWheels(), []);
  const ultraDecals = useMemo(() => getUltraDecals(), []);
  const ultraFinishes = useMemo(() => getUltraFinishes(), []);
  const ultraRimFinishes = useMemo(() => getUltraRimFinishes(), []);
  const ultraCelebrations = useMemo(() => getUltraCelebrations(), []);
  const ultraToppers = useMemo(() => getUltraToppers(), []);
  const ultraAntennas = useMemo(() => getUltraAntennas(), []);

  const handleImageError = (e) => {
    const img = e.currentTarget;
    img.style.display = "none";
  };

  // Sync state with global CFG on mount or when drawer opens
  useEffect(() => {
    if (CFG.customization) {
      if (CFG.customization.model) setSelectedModel(CFG.customization.model);
      if (CFG.customization.wheel) setSelectedWheel(CFG.customization.wheel);
      if (CFG.customization.vinyl) setSelectedDecal(CFG.customization.vinyl);
      if (CFG.customization.finish) setSelectedFinish(CFG.customization.finish);
      if (CFG.customization.rimFinish) setSelectedRimFinish(CFG.customization.rimFinish);
      if (CFG.customization.celebration) setSelectedCelebration(CFG.customization.celebration);
      if (CFG.customization.hat) setSelectedHat(CFG.customization.hat);
      if (CFG.customization.antenna) setSelectedAntenna(CFG.customization.antenna);
      if (CFG.customization.bodyColor) setBodyColor(CFG.customization.bodyColor);
      if (CFG.customization.accentColor) setAccentColor(CFG.customization.accentColor);
      if (CFG.customization.hubColor) setHubColor(CFG.customization.hubColor);
    }
  }, [isOpen]);

  const commitCustomization = (key, value) => {
    if (!CFG.customization) CFG.customization = {};
    CFG.customization[key] = value;

    try {
      localStorage.setItem(`ultra_garage_${key}`, typeof value === 'object' ? JSON.stringify(value) : String(value));
    } catch (e) {}

    if (onCustomizationChange) {
      onCustomizationChange(key, value);
    }

    if (engineRef && engineRef.current) {
      const eng = engineRef.current;
      if (eng.rebuildPlayerCar) {
        eng.rebuildPlayerCar();
      } else if (eng.cars && eng.cars[0] && eng.cars[0].refreshCustomization) {
        eng.cars[0].refreshCustomization();
      }
    }
  };

  const selectCar = (carId) => {
    setSelectedModel(carId);
    commitCustomization("model", carId);
    commitCustomization("useUltraKit", true);
  };

  const selectWheel = (wheelId) => {
    setSelectedWheel(wheelId);
    commitCustomization("wheel", wheelId);
  };

  const selectDecal = (decalId) => {
    setSelectedDecal(decalId);
    commitCustomization("vinyl", decalId);
  };

  const selectFinish = (finishId) => {
    setSelectedFinish(finishId);
    commitCustomization("finish", finishId);
  };

  const selectRimFinish = (rimFinishId) => {
    setSelectedRimFinish(rimFinishId);
    commitCustomization("rimFinish", rimFinishId);
  };

  const [selectedPalette, setSelectedPalette] = useState(
    (CFG.customization && CFG.customization.palette) || "cobalt"
  );
  const ultraPalettes = useMemo(() => getUltraPalettes(), []);

  const testCelebration = (celebId) => {
    const id = celebId || selectedCelebration || "donutstorm";
    setSelectedCelebration(id);
    commitCustomization("celebration", id);
    try {
      const eng = (engineRef && engineRef.current) || window.__GAME_ENGINE__;
      if (eng && eng.world) {
        var pCar = (eng.world.cars && eng.world.cars[0] && eng.world.cars[0].body) 
          ? eng.world.cars[0].body.pos 
          : { x: 0, y: 2, z: 0 };
        if (eng.world.effects && typeof eng.world.effects.playCelebration === "function") {
          eng.world.effects.playCelebration(id, pCar, 0);
        }
        if (eng.audio && typeof eng.audio.goal === "function") {
          eng.audio.goal(false);
        }
      }
    } catch(err) {
      console.warn("Live test celebration error:", err);
    }
  };

  const applyPalette = (pal) => {
    setSelectedPalette(pal.id);
    if (pal.base) {
      setBodyColor(pal.base);
      commitCustomization("bodyColor", pal.base);
    }
    if (pal.secondary) {
      setAccentColor(pal.secondary);
      commitCustomization("accentColor", pal.secondary);
    }
    if (pal.finish) {
      setSelectedFinish(pal.finish);
      commitCustomization("finish", pal.finish);
    }
    commitCustomization("palette", pal.id);
    commitCustomization("useCustomPaint", true);
  };

  const selectCelebration = (celebId) => {
    setSelectedCelebration(celebId);
    commitCustomization("celebration", celebId);
  };

  const selectHat = (hatId) => {
    setSelectedHat(hatId);
    commitCustomization("hat", hatId);
  };

  const selectAntenna = (antennaId) => {
    setSelectedAntenna(antennaId);
    commitCustomization("antenna", antennaId);
  };

  // Filtered lists based on search
  const filteredCars = useMemo(() => {
    return ultraCars.filter((car) => {
      return (
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.tagline.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [ultraCars, searchQuery]);

  const filteredWheels = useMemo(() => {
    return ultraWheels.filter((wheel) => {
      return (
        wheel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wheel.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wheel.tagline.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [ultraWheels, searchQuery]);

  const filteredDecals = useMemo(() => {
    return ultraDecals.filter((decal) => {
      return (
        decal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        decal.faName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        decal.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [ultraDecals, searchQuery]);

  const filteredFinishes = useMemo(() => {
    return ultraFinishes.filter((finish) => {
      return (
        finish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        finish.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        finish.desc.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [ultraFinishes, searchQuery]);

  const filteredToppers = useMemo(() => {
    return ultraToppers.filter((topper) => {
      return (
        topper.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topper.faName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topper.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [ultraToppers, searchQuery]);

  const filteredAntennas = useMemo(() => {
    return ultraAntennas.filter((antenna) => {
      return (
        antenna.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        antenna.faName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        antenna.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [ultraAntennas, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-y-0 left-0 z-[9999] pointer-events-none flex justify-end items-stretch font-sans"
    >
      {/* Scoped CSS Inject block mimicking Ultra-Garage.html exactly */}
      <style dangerouslySetInnerHTML={{ __html: `
        .ultra-garage-panel {
          --bg: #07080b;
          --panel: rgba(16,18,24,.86);
          --panel-2: rgba(24,27,35,.72);
          --line: rgba(255,255,255,.09);
          --line-2: rgba(255,255,255,.16);
          --ink: #eef1f7;
          --ink-dim: #98a0b3;
          --ink-faint: #5d6577;
          --accent: #37e0c8;
          --accent-2: #7b5cff;
          --hot: #ff3d6e;
          --gold: #ffc857;
          --radius: 11px;
          --side: 340px;
          
          position: fixed;
          inset: 0 auto 0 0;
          width: var(--side);
          background: var(--panel);
          backdrop-filter: blur(20px);
          border-right: 1px solid var(--line);
          display: flex;
          flex-direction: column;
          z-index: 9999;
          color: var(--ink);
          font-family: ui-sans-serif, -apple-system, "Segoe UI", Roboto, Inter, sans-serif;
          overflow: hidden;
          box-shadow: 0 0 50px rgba(0,0,0,0.8);
        }

        .ultra-garage-panel header {
          padding: 15px 16px 12px;
          border-bottom: 1px solid var(--line);
        }

        .ultra-garage-panel .brand {
          font-size: 15px;
          font-weight: 700;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .ultra-garage-panel .brand span {
          background: linear-gradient(92deg, var(--accent), var(--accent-2) 60%, var(--hot));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .ultra-garage-panel .tagline {
          color: var(--ink-faint);
          font-size: 10px;
          margin-top: 3px;
          letter-spacing: .02em;
          line-height: 1.4;
        }

        .ultra-garage-panel .counts {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 11px;
        }

        .ultra-garage-panel .counts b {
          font: 600 10px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
          background: var(--panel-2);
          border: 1px solid var(--line);
          padding: 4px 7px;
          border-radius: 99px;
          color: var(--ink-dim);
          font-weight: 600;
        }

        .ultra-garage-panel .counts b i {
          color: var(--accent);
          font-style: normal;
        }

        /* Tabs */
        .ultra-garage-panel .tabs-nav {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 4px;
          padding: 10px 12px;
          border-bottom: 1px solid var(--line);
        }

        .ultra-garage-panel .tabs-nav button {
          font-size: 10.5px;
          font-weight: 600;
          color: var(--ink-dim);
          background: transparent;
          border: 1px solid transparent;
          padding: 6px 4px;
          border-radius: 8px;
          cursor: pointer;
          white-space: nowrap;
          transition: background .12s, color .12s, border-color .12s;
          text-align: center;
        }

        .ultra-garage-panel .tabs-nav button:hover {
          color: var(--ink);
          background: var(--panel-2);
        }

        .ultra-garage-panel .tabs-nav button.on {
          color: #04121a;
          background: linear-gradient(180deg, var(--accent), #1fbfae);
          border-color: transparent;
          box-shadow: 0 3px 12px -3px var(--accent);
        }

        .ultra-garage-panel .tabs-nav button em {
          font-style: normal;
          opacity: .55;
          font-size: 8.5px;
          margin-left: 2px;
        }

        /* Grid */
        .ultra-garage-panel .grid-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 12px;
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          grid-auto-rows: max-content;
          align-content: start;
        }

        .ultra-garage-panel .grid-content::-webkit-scrollbar {
          width: 9px;
        }

        .ultra-garage-panel .grid-content::-webkit-scrollbar-thumb {
          background: #2a2f3b;
          border-radius: 9px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        .ultra-garage-panel .grid-content::-webkit-scrollbar-thumb:hover {
          background: #3a4152;
          background-clip: padding-box;
        }

        .ultra-garage-panel .card {
          position: relative;
          border: 1px solid var(--line);
          border-radius: var(--radius);
          background: var(--panel-2);
          cursor: pointer;
          overflow: hidden;
          transition: border-color .13s, transform .13s, box-shadow .13s;
          text-align: right;
        }

        .ultra-garage-panel .card:hover {
          border-color: var(--line-2);
          transform: translateY(-1px);
        }

        .ultra-garage-panel .card.on {
          border-color: var(--accent);
          box-shadow: 0 0 0 1px var(--accent), 0 8px 22px -10px var(--accent);
        }

        .ultra-garage-panel .card .thumb {
          width: 100%;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          background-color: #0c0e13;
          position: relative;
          overflow: hidden;
        }

        .ultra-garage-panel .card .thumb img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          transition: transform 0.2s ease;
        }

        .ultra-garage-panel .card:hover .thumb img {
          transform: scale(1.05);
        }

        .ultra-garage-panel .card.wide {
          grid-column: 1 / -1;
        }

        .ultra-garage-panel .card.wide .thumb {
          aspect-ratio: 2.6;
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }

        .ultra-garage-panel .card .meta {
          padding: 6px 8px 7px;
          border-top: 1px solid var(--line);
          text-align: right;
        }

        .ultra-garage-panel .card .nm {
          font-size: 11.5px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          letter-spacing: .01em;
          color: var(--ink);
        }

        .ultra-garage-panel .card .sub {
          font-size: 10px;
          color: var(--ink-faint);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 1px;
        }

        .ultra-garage-panel .card .badge {
          position: absolute;
          top: 6px;
          left: 6px;
          z-index: 2;
          font: 600 9px/1 ui-monospace, monospace;
          letter-spacing: .07em;
          text-transform: uppercase;
          padding: 3px 5px;
          border-radius: 5px;
          background: rgba(4, 6, 10, .8);
          border: 1px solid var(--line-2);
          color: var(--ink-dim);
          backdrop-filter: blur(6px);
        }

        .ultra-garage-panel .card .badge.new {
          color: #04121a;
          background: var(--accent);
          border-color: transparent;
        }

        .ultra-garage-panel .card .badge.anim {
          color: #04121a;
          background: var(--gold);
          border-color: transparent;
        }

        .ultra-garage-panel .card .badge.leg {
          color: var(--accent-2);
          border-color: rgba(123, 92, 255, .5);
        }

        .ultra-garage-panel .card .badge.bm {
          color: var(--hot);
          border-color: rgba(255, 61, 110, .5);
        }

        .ultra-garage-panel .card .swatch {
          width: 100%;
          aspect-ratio: 2.6;
          display: block;
        }

        .ultra-garage-panel .card .chip {
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          font: 600 10px/1 ui-monospace, monospace;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, .9);
          text-shadow: 0 1px 3px rgba(0, 0, 0, .6);
        }

        /* Paint Controls */
        .ultra-garage-panel .paintrow {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          padding: 10px;
          border: 1px solid var(--line);
          border-radius: var(--radius);
          background: var(--panel-2);
        }

        .ultra-garage-panel .paintrow label {
          display: flex;
          flex-direction: column;
          gap: 5px;
          font-size: 10px;
          color: var(--ink-faint);
          text-transform: uppercase;
          letter-spacing: .07em;
          font-weight: 600;
          text-align: center;
        }

        .ultra-garage-panel .paintrow input[type=color] {
          width: 100%;
          height: 30px;
          border: 1px solid var(--line-2);
          border-radius: 7px;
          background: transparent;
          cursor: pointer;
          padding: 2px;
        }

        /* Tuning / Sliders */
        .ultra-garage-panel .tuning-section {
          padding: 10px 12px 11px;
          border-top: 1px solid var(--line);
        }

        .ultra-garage-panel .tuning-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          font-size: 10px;
          color: var(--ink-faint);
          text-transform: uppercase;
          letter-spacing: .07em;
          font-weight: 600;
        }

        .ultra-garage-panel .tuning-row b {
          color: var(--accent);
          font-size: 11px;
          letter-spacing: .02em;
          font-variant-numeric: tabular-nums;
        }

        .ultra-garage-panel input[type=range] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 22px;
          margin: 4px 0 0;
          background: transparent;
          cursor: pointer;
        }

        .ultra-garage-panel input[type=range]::-webkit-slider-runnable-track {
          height: 5px;
          border-radius: 3px;
          background: var(--panel-2);
          border: 1px solid var(--line);
        }

        .ultra-garage-panel input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          margin-top: -5.5px;
          border-radius: 50%;
          background: var(--accent);
          border: none;
          box-shadow: 0 0 0 3px rgba(87, 231, 255, .16);
        }

        /* Footer */
        .ultra-garage-panel footer {
          display: flex;
          gap: 6px;
          padding: 11px 12px;
          border-top: 1px solid var(--line);
        }

        .ultra-garage-panel footer button {
          flex: 1;
          font: inherit;
          font-size: 11.5px;
          font-weight: 600;
          color: var(--ink);
          background: var(--panel-2);
          border: 1px solid var(--line);
          border-radius: 9px;
          padding: 9px 6px;
          cursor: pointer;
          transition: background .12s, border-color .12s, color .12s;
          text-align: center;
        }

        .ultra-garage-panel footer button:hover {
          background: #262b36;
          border-color: var(--line-2);
        }

        .ultra-garage-panel footer button.on {
          color: #04121a;
          background: var(--accent);
          border-color: transparent;
        }

        .ultra-garage-panel footer #btn-fire {
          color: #fff;
          background: linear-gradient(180deg, #ff4d78, #d81e50);
          border-color: transparent;
        }

        .ultra-garage-panel footer #btn-fire:hover {
          filter: brightness(1.1);
        }
      ` }} />

      <aside className="ultra-garage-panel pointer-events-auto">
        {/* Header */}
        <header>
          <div className="flex items-center justify-between">
            <div className="brand">Ultra <span>Garage</span></div>
            <button onClick={onClose} className="text-white/40 hover:text-white transition cursor-pointer">
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
          <div className="tagline">گاراژ اولترا • ۲۰ بدنه جدید، ۴۰ رینگ اسپرت، ۶۲ طرح متحرک و پوسته‌های زنده، ۵۳ کلاه تزیینی، ۱۲ آنتن و ۲۶ افکت انفجار گل</div>
          <div className="counts">
            <b><i>+{ultraCars.length}</i> بدنه</b>
            <b><i>+{ultraWheels.length}</i> رینگ</b>
            <b><i>+{ultraDecals.length}</i> طرح</b>
            <b><i>+{ultraToppers.length}</i> کلاه</b>
            <b><i>+{ultraAntennas.length}</i> آنتن</b>
            <b><i>+{ultraCelebrations.length}</i> انفجار گل</b>
          </div>
        </header>

        {/* Tabs */}
        <nav className="tabs-nav">
          {[
            { id: "cars", label: "بدنه", count: ultraCars.length },
            { id: "decals", label: "طرح", count: ultraDecals.length },
            { id: "materials", label: "رنگ بدنه", count: ultraFinishes.length + ultraRimFinishes.length },
            { id: "wheels", label: "رینگ", count: ultraWheels.length },
            { id: "toppers", label: "کلاه", count: ultraToppers.length },
            { id: "antennas", label: "آنتن", count: ultraAntennas.length },
            { id: "goals", label: "افکت گل", count: ultraCelebrations.length },
            { id: "tuning", label: "تیونینگ", count: 3 }
          ].map((t) => (
            <button
              key={t.id}
              className={activeSection === t.id ? "on" : ""}
              onClick={() => { setActiveSection(t.id); setSearchQuery(""); }}
            >
              {t.label} <em>{t.count}</em>
            </button>
          ))}
        </nav>

        {/* Search bar */}
        {activeSection !== "tuning" && (
          <div className="px-3 pt-3 pb-1">
            <input
              type="text"
              placeholder="جستجوی زنده آیتم‌ها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "7px 12px",
                fontSize: "11px",
                borderRadius: "8px",
                backgroundColor: "rgba(24,27,35,.72)",
                border: "1px solid rgba(255,255,255,.09)",
                color: "#eef1f7",
                outline: "none"
              }}
            />
          </div>
        )}

        {/* Grid Content */}
        <div className="grid-content">
          {/* 1. Cars (Bodies) */}
          {activeSection === "cars" && filteredCars.map((car) => {
            const isSelected = selectedModel.toLowerCase() === car.id.toLowerCase();
            return (
              <div
                key={car.id}
                onClick={() => selectCar(car.id)}
                className={`card ${isSelected ? "on" : ""}`}
              >
                <UltraCardThumb
                  kind="body"
                  id={car.id}
                  label={car.name}
                />
                <div className="meta">
                  <div className="nm">{car.name}</div>
                  <div className="sub">{car.tagline || car.cls || ""}</div>
                </div>
              </div>
            );
          })}

          {/* 2. Decals */}
          {activeSection === "decals" && filteredDecals.map((decal) => {
            const isSelected = selectedDecal.toLowerCase() === decal.id.toLowerCase();
            return (
              <div
                key={decal.id}
                onClick={() => selectDecal(decal.id)}
                className={`card wide ${isSelected ? "on" : ""}`}
              >
                <UltraCardThumb
                  kind="decal"
                  id={decal.id}
                  label={decal.faName || decal.name}
                />
                <div className="meta">
                  <div className="nm">{decal.faName || decal.name}</div>
                  <div className="sub">{decal.desc || decal.tagline || ""}</div>
                </div>
              </div>
            );
          })}

          {/* 3. Paint & Materials */}
          {activeSection === "materials" && (
            <>
              {/* Color Pickers Row */}
              <div className="paintrow">
                <label>
                  رنگ بدنه
                  <input
                    type="color"
                    value={bodyColor}
                    onChange={(e) => {
                      setBodyColor(e.target.value);
                      commitCustomization("bodyColor", e.target.value);
                      commitCustomization("useCustomPaint", true);
                    }}
                  />
                </label>
                <label>
                  رنگ طرح
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => {
                      setAccentColor(e.target.value);
                      commitCustomization("accentColor", e.target.value);
                      commitCustomization("useCustomPaint", true);
                    }}
                  />
                </label>
                <label>
                  رنگ رینگ
                  <input
                    type="color"
                    value={hubColor}
                    onChange={(e) => {
                      setHubColor(e.target.value);
                      commitCustomization("hubColor", e.target.value);
                      commitCustomization("useCustomPaint", true);
                    }}
                  />
                </label>
              </div>

              {/* Palettes */}
              {ultraPalettes.map((pal) => {
                const isSelected = selectedPalette.toLowerCase() === pal.id.toLowerCase();
                return (
                  <div
                    key={pal.id}
                    onClick={() => applyPalette(pal)}
                    className={`card ${isSelected ? "on" : ""}`}
                  >
                    <div
                      className="chip"
                      style={{
                        background: `linear-gradient(112deg, ${pal.base} 0 46%, ${pal.secondary} 46% 70%, ${pal.accent} 70% 100%)`
                      }}
                    >
                      {pal.id}
                    </div>
                    <div className="meta">
                      <div className="nm">{pal.name}</div>
                      <div className="sub">{pal.finish}</div>
                    </div>
                  </div>
                );
              })}

              {/* Header for finishes */}
              <div className="card wide" style={{ cursor: "default", border: "none", background: "transparent" }}>
                <div className="chip" style={{ height: "30px", color: "var(--ink-faint)", fontSize: "10px" }}>
                  روکش‌های بدنه (Finishes)
                </div>
              </div>

              {/* Finishes */}
              {filteredFinishes.map((finish) => {
                const isSelected = selectedFinish.toLowerCase() === finish.id.toLowerCase();
                return (
                  <div
                    key={finish.id}
                    onClick={() => selectFinish(finish.id)}
                    className={`card ${isSelected ? "on" : ""}`}
                  >
                    <div className="thumb" style={{ backgroundColor: "rgba(255,255,255,0.03)" }} />
                    <div className="meta">
                      <div className="nm">{finish.name}</div>
                      <div className="sub">Rough: {finish.rough} • Metal: {finish.metal}</div>
                    </div>
                  </div>
                );
              })}

              {/* Header for rim finishes */}
              <div className="card wide" style={{ cursor: "default", border: "none", background: "transparent" }}>
                <div className="chip" style={{ height: "30px", color: "var(--ink-faint)", fontSize: "10px" }}>
                  آبکاری رینگ (Rim Finishes)
                </div>
              </div>

              {/* Rim finishes */}
              {ultraRimFinishes.map((rf) => {
                const isSelected = selectedRimFinish.toLowerCase() === rf.id.toLowerCase();
                return (
                  <div
                    key={rf.id}
                    onClick={() => selectRimFinish(rf.id)}
                    className={`card ${isSelected ? "on" : ""}`}
                  >
                    <div className="thumb" style={{ backgroundColor: rf.color || "#ffffff" }} />
                    <div className="meta">
                      <div className="nm">{rf.name}</div>
                      <div className="sub">Metal: {rf.metal || 1.0} • Rough: {rf.rough || 0.2}</div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* 4. Wheels */}
          {activeSection === "wheels" && filteredWheels.map((wheel) => {
            const isSelected = selectedWheel.toLowerCase() === wheel.id.toLowerCase();
            return (
              <div
                key={wheel.id}
                onClick={() => selectWheel(wheel.id)}
                className={`card ${isSelected ? "on" : ""}`}
              >
                <UltraCardThumb
                  kind="wheel"
                  id={wheel.id}
                  label={wheel.name}
                />
                <div className="meta">
                  <div className="nm">{wheel.name}</div>
                  <div className="sub">{wheel.tagline || wheel.style || ""}</div>
                </div>
              </div>
            );
          })}

          {/* 5. Toppers */}
          {activeSection === "toppers" && (
            <>
              <div
                onClick={() => selectHat("none")}
                className={`card ${selectedHat === "none" ? "on" : ""}`}
              >
                <div className="thumb flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                  <X className="w-6 h-6 text-slate-500" />
                </div>
                <div className="meta">
                  <div className="nm">هیچ کدام</div>
                  <div className="sub">حذف کلاه از روی ماشین</div>
                </div>
              </div>

              {filteredToppers.map((top) => {
                const isSelected = selectedHat.toLowerCase() === top.id.toLowerCase();
                return (
                  <div
                    key={top.id}
                    onClick={() => selectHat(top.id)}
                    className={`card ${isSelected ? "on" : ""}`}
                  >
                    <UltraCardThumb
                      kind="topper"
                      id={top.id}
                      label={top.faName || top.name}
                    />
                    <div className="meta">
                      <div className="nm">{top.faName || top.name}</div>
                      <div className="sub">{top.grade || "Topper"}</div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* 6. Antennas */}
          {activeSection === "antennas" && (
            <>
              <div
                onClick={() => selectAntenna("none")}
                className={`card ${selectedAntenna === "none" ? "on" : ""}`}
              >
                <div className="thumb flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                  <X className="w-6 h-6 text-slate-500" />
                </div>
                <div className="meta">
                  <div className="nm">هیچ کدام</div>
                  <div className="sub">حذف آنتن از پشت ماشین</div>
                </div>
              </div>

              {filteredAntennas.map((ant) => {
                const isSelected = selectedAntenna.toLowerCase() === ant.id.toLowerCase();
                return (
                  <div
                    key={ant.id}
                    onClick={() => selectAntenna(ant.id)}
                    className={`card ${isSelected ? "on" : ""}`}
                  >
                    <UltraCardThumb
                      kind="antenna"
                      id={ant.id}
                      label={ant.faName || ant.name}
                    />
                    <div className="meta">
                      <div className="nm">{ant.faName || ant.name}</div>
                      <div className="sub">Antenna</div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* 7. Goal FX */}
          {activeSection === "goals" && ultraCelebrations.map((celeb) => {
            const isSelected = selectedCelebration.toLowerCase() === celeb.id.toLowerCase();
            return (
              <div
                key={celeb.id}
                onClick={() => {
                  selectCelebration(celeb.id);
                  testCelebration(celeb.id);
                }}
                className={`card ${isSelected ? "on" : ""}`}
              >
                <UltraCardThumb
                  kind="celebration"
                  id={celeb.id}
                  label={celeb.faName || celeb.name}
                />
                <div className="meta">
                  <div className="nm">{celeb.faName || celeb.name}</div>
                  <div className="sub">{celeb.desc || "افکت انفجار دروازه"}</div>
                </div>
              </div>
            );
          })}

          {/* 8. Tuning */}
          {activeSection === "tuning" && (
            <div className="tuning-section space-y-4" style={{ gridColumn: "1 / -1", width: "100%" }}>
              <div className="p-3 rounded-xl bg-slate-900/70 border border-white/10 space-y-4">
                <div>
                  <div className="tuning-row">
                    <span>ارتفاع فنربندی (Ride Height)</span>
                    <b>{rideHeight.toFixed(2)}x</b>
                  </div>
                  <input
                    type="range"
                    min="0.6"
                    max="1.5"
                    step="0.05"
                    value={rideHeight}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setRideHeight(val);
                      commitCustomization("rideHeight", val);
                    }}
                  />
                </div>

                <div>
                  <div className="tuning-row">
                    <span>کمبر چرخ‌ها (Wheel Camber)</span>
                    <b>{(wheelCamber * 10).toFixed(1)}°</b>
                  </div>
                  <input
                    type="range"
                    min="-0.15"
                    max="0.15"
                    step="0.01"
                    value={wheelCamber}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setWheelCamber(val);
                      commitCustomization("wheelCamber", val);
                    }}
                  />
                </div>

                <div>
                  <div className="tuning-row">
                    <span>اندازه اکسسوری/کلاه (Topper Scale)</span>
                    <b>{topperScale.toFixed(2)}x</b>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="3.5"
                    step="0.1"
                    value={topperScale}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setTopperScale(val);
                      commitCustomization("topperScale", val);
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer>
          <button
            id="btn-random"
            title="سورپرایز"
            onClick={() => {
              const c = ultraCars[Math.floor(Math.random() * ultraCars.length)];
              const w = ultraWheels[Math.floor(Math.random() * ultraWheels.length)];
              const v = ultraDecals[Math.floor(Math.random() * ultraDecals.length)];
              const t = ultraToppers[Math.floor(Math.random() * ultraToppers.length)];
              const a = ultraAntennas[Math.floor(Math.random() * ultraAntennas.length)];
              if (c) selectCar(c.id);
              if (w) selectWheel(w.id);
              if (v) selectDecal(v.id);
              if (t) selectHat(t.id);
              if (a) selectAntenna(a.id);
            }}
          >
            سورپرایز من
          </button>
          <button
            id="btn-fire"
            onClick={() => testCelebration(selectedCelebration)}
          >
            شلیک گل!
          </button>
        </footer>
      </aside>
    </div>
  );
}

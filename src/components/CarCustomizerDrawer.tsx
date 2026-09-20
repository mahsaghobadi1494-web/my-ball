// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Car,
  Disc,
  Palette,
  Sparkles,
  X,
  Check,
  RotateCcw,
  Save,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Eye,
  Shield,
  Zap,
  Flame,
  Sun,
  Layers,
  RefreshCw,
  Activity,
  SlidersHorizontal,
  Compass
} from "lucide-react";
import {
  CFG,
  DEFAULT_CFG,
  CAR_BODY_DEFS,
  CAR_WHEEL_DEFS,
  CAR_VINYL_DEFS,
  CAR_PRESETS,
  TEAM_COLOR,
  saveCurrentConfig
} from "../game/config.js";

const SWATCHES = [
  "#1464ff", "#ff1e27", "#00f0ff", "#ffd700",
  "#e0468c", "#55ff00", "#ff6600", "#a855f7",
  "#ffffff", "#14171d", "#3b82f6", "#10b981"
];

const TEAM_PRESETS = [
  {
    id: "blue",
    nameFa: "تیم آبی قهرمانی (Team Blue)",
    bodyColor: "#1464ff",
    accentColor: "#0a1828",
    trimColor: "#e0f2fe",
    lightsColor: "#38bdf8",
    thrusterColor: "#00d2ff",
    hubColor: "#38bdf8",
    badgeBg: "from-blue-600 to-cyan-600"
  },
  {
    id: "red",
    nameFa: "تیم قرمز قهرمانی (Team Red)",
    bodyColor: "#ff1e27",
    accentColor: "#280a0a",
    trimColor: "#fee2e2",
    lightsColor: "#fb923c",
    thrusterColor: "#ff7700",
    hubColor: "#f87171",
    badgeBg: "from-red-600 to-amber-600"
  }
];

export function CarCustomizerDrawer({
  isOpen,
  onClose,
  engineRef,
  onCustomizationChange
}) {
  const [activeTab, setActiveTab] = useState("models"); // 'models' | 'vinyls' | 'paint' | 'presets'
  const [vinylCategory, setVinylCategory] = useState("ALL");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local state mirrored from CFG.customization and CFG.vehicle
  const [cust, setCust] = useState(() => {
    const current = CFG.customization || {};
    const veh = CFG.vehicle || {};
    return {
      model: current.model || "OCTANE",
      wheel: current.wheel || "SPORT",
      teamVariant: current.teamVariant || "blue",
      vinyl: current.vinyl || "NONE",
      vinylColor: current.vinylColor || "#ffffff",
      vinylEmissive: current.vinylEmissive !== undefined ? current.vinylEmissive : 0.0,
      vinylScale: current.vinylScale !== undefined ? current.vinylScale : 1.0,
      vinylAnimated: current.vinylAnimated !== undefined ? current.vinylAnimated : true,
      useCustomPaint: current.useCustomPaint !== undefined ? current.useCustomPaint : true,
      bodyColor: current.bodyColor || "#1464ff",
      accentColor: current.accentColor || "#181c23",
      trimColor: current.trimColor || "#f0f2f5",
      glassColor: current.glassColor || "#0a0e14",
      lightsColor: current.lightsColor || "#4ca5ff",
      thrusterColor: current.thrusterColor || "#ff7700",
      hubColor: current.hubColor || "#d6dade",
      wheelColor: current.wheelColor || "#121418",
      metallic: current.metallic !== undefined ? current.metallic : 0.65,
      gloss: current.gloss !== undefined ? current.gloss : 0.95,
      flakes: current.flakes !== undefined ? current.flakes : 0.30,
      clearcoat: current.clearcoat !== undefined ? current.clearcoat : 0.90,
      carBump: (CFG.gfx && CFG.gfx.carBump !== undefined) ? CFG.gfx.carBump : (current.carBump ?? 0.90),
      carBumpStyle: (CFG.gfx && CFG.gfx.carBumpStyle) || current.carBumpStyle || "SPORTS_PANELS",
      flapWidthScale: veh.flapWidthScale !== undefined ? veh.flapWidthScale : 0.65,
      flapThickScale: veh.flapThickScale !== undefined ? veh.flapThickScale : 0.60,
      flapScale: veh.flapScale !== undefined ? veh.flapScale : 1.0,
      hideWheelFlaps: veh.hideWheelFlaps !== undefined ? veh.hideWheelFlaps : false
    };
  });

  // Sync state if CFG changes externally
  useEffect(() => {
    if (CFG.customization) {
      setCust(prev => ({
        ...prev,
        ...CFG.customization,
        carBump: CFG.gfx?.carBump ?? 0.90,
        carBumpStyle: CFG.gfx?.carBumpStyle ?? "SPORTS_PANELS",
        flapWidthScale: CFG.vehicle?.flapWidthScale ?? 0.65,
        flapThickScale: CFG.vehicle?.flapThickScale ?? 0.60,
        flapScale: CFG.vehicle?.flapScale ?? 1.0,
        hideWheelFlaps: CFG.vehicle?.hideWheelFlaps ?? false
      }));
    }
  }, [isOpen]);

  const updateParam = (key, value) => {
    const next = { ...cust, [key]: value };
    setCust(next);
    if (!CFG.customization) CFG.customization = {};
    CFG.customization[key] = value;

    if (key === "carBump" || key === "bump") {
      if (!CFG.gfx) CFG.gfx = {};
      CFG.gfx.carBump = value;
      CFG.customization.carBump = value;
      CFG.customization.bump = value;
    }
    if (key === "carBumpStyle") {
      if (!CFG.gfx) CFG.gfx = {};
      CFG.gfx.carBumpStyle = value;
      CFG.customization.carBumpStyle = value;
    }

    if (key === "model" || key === "wheel") {
      if (engineRef && engineRef.current && typeof engineRef.current.rebuildCarModels === "function") {
        engineRef.current.rebuildCarModels();
      }
    }

    if (onCustomizationChange) {
      onCustomizationChange(key, value);
    }
  };

  const updateFlapParam = (key, value) => {
    if (!CFG.vehicle) CFG.vehicle = {};
    CFG.vehicle[key] = value;
    setCust(prev => ({ ...prev, [key]: value }));

    if (engineRef && engineRef.current && typeof engineRef.current.rebuildCarModels === "function") {
      engineRef.current.rebuildCarModels();
    }

    saveCurrentConfig();
    if (onCustomizationChange) {
      onCustomizationChange(key, value);
    }
  };

  const handleApplyTeam = (teamObj) => {
    const updated = {
      ...cust,
      teamVariant: teamObj.id,
      bodyColor: teamObj.bodyColor,
      accentColor: teamObj.accentColor,
      trimColor: teamObj.trimColor,
      lightsColor: teamObj.lightsColor,
      thrusterColor: teamObj.thrusterColor,
      hubColor: teamObj.hubColor,
      useCustomPaint: true
    };
    setCust(updated);
    CFG.customization = { ...updated };
    if (onCustomizationChange) {
      onCustomizationChange("teamVariant", teamObj.id);
    }
  };

  const handleApplyPreset = (preset) => {
    const updated = {
      ...cust,
      model: preset.model || cust.model,
      wheel: preset.wheel || cust.wheel,
      vinyl: preset.vinyl || cust.vinyl,
      vinylColor: preset.vinylColor || cust.vinylColor,
      vinylEmissive: preset.vinylEmissive !== undefined ? preset.vinylEmissive : cust.vinylEmissive,
      vinylScale: preset.vinylScale !== undefined ? preset.vinylScale : cust.vinylScale,
      vinylAnimated: preset.vinylAnimated !== undefined ? preset.vinylAnimated : cust.vinylAnimated,
      bodyColor: preset.bodyColor,
      accentColor: preset.accentColor,
      trimColor: preset.trimColor,
      glassColor: preset.glassColor,
      lightsColor: preset.lightsColor,
      thrusterColor: preset.thrusterColor,
      hubColor: preset.hubColor,
      wheelColor: preset.wheelColor,
      metallic: preset.metallic !== undefined ? preset.metallic : cust.metallic,
      gloss: preset.gloss !== undefined ? preset.gloss : cust.gloss,
      flakes: preset.flakes !== undefined ? preset.flakes : cust.flakes,
      clearcoat: preset.clearcoat !== undefined ? preset.clearcoat : cust.clearcoat,
      useCustomPaint: true
    };

    setCust(updated);
    CFG.customization = { ...updated };
    if (onCustomizationChange) {
      onCustomizationChange("preset", preset.id);
    }
  };

  const handleResetToDefault = () => {
    const defaultCust = {
      model: "OCTANE",
      wheel: "SPORT",
      teamVariant: "blue",
      vinyl: "RACING_STRIPES",
      vinylColor: "#ffffff",
      vinylEmissive: 0.2,
      vinylScale: 1.0,
      vinylAnimated: true,
      useCustomPaint: true,
      bodyColor: "#1464ff",
      accentColor: "#181c23",
      trimColor: "#f0f2f5",
      glassColor: "#0a0e14",
      lightsColor: "#4ca5ff",
      thrusterColor: "#00d2ff",
      hubColor: "#38bdf8",
      wheelColor: "#121418",
      metallic: 0.65,
      gloss: 0.95,
      flakes: 0.30,
      clearcoat: 0.90
    };
    setCust(defaultCust);
    CFG.customization = { ...defaultCust };
    saveCurrentConfig();
    if (onCustomizationChange) {
      onCustomizationChange("reset", true);
    }
  };

  const handleSave = () => {
    saveCurrentConfig();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      id="car-customizer-drawer"
      dir="rtl"
      className="fixed inset-y-0 left-0 z-50 w-full sm:w-[450px] bg-neutral-950/95 backdrop-blur-2xl border-r border-white/15 shadow-[25px_0_60px_rgba(0,0,0,0.9)] flex flex-col text-neutral-100 animate-in slide-in-from-left duration-300 select-none"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-neutral-900/90 via-neutral-900/60 to-neutral-950/90 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-red-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Car className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-white">گاراژ و سفارشی‌سازی ماشین</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                PRO GARAGE
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">۲۵ طرح وینیل پیشرفته، تنظیمات فلپ گلگیر، رنگ‌های دو تیم و قطعات</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition"
          title="بستن [Close]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 4 Navigation Tabs */}
      <div className="grid grid-cols-4 border-b border-white/10 bg-neutral-900/50 p-1.5 gap-1">
        <button
          onClick={() => setActiveTab("models")}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[11px] font-medium transition ${
            activeTab === "models"
              ? "bg-white/15 text-white font-bold shadow-[0_2px_10px_rgba(0,0,0,0.4)] border border-white/10"
              : "text-neutral-400 hover:text-neutral-200 hover:bg-white/5"
          }`}
        >
          <Car className="w-3.5 h-3.5 text-pink-400 mb-0.5" />
          <span>بدنه و فلپ</span>
        </button>

        <button
          onClick={() => setActiveTab("vinyls")}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[11px] font-medium transition ${
            activeTab === "vinyls"
              ? "bg-white/15 text-white font-bold shadow-[0_2px_10px_rgba(0,0,0,0.4)] border border-white/10"
              : "text-neutral-400 hover:text-neutral-200 hover:bg-white/5"
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-amber-400 mb-0.5" />
          <span>طرح و وینیل</span>
        </button>

        <button
          onClick={() => setActiveTab("paint")}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[11px] font-medium transition ${
            activeTab === "paint"
              ? "bg-white/15 text-white font-bold shadow-[0_2px_10px_rgba(0,0,0,0.4)] border border-white/10"
              : "text-neutral-400 hover:text-neutral-200 hover:bg-white/5"
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-cyan-400 mb-0.5" />
          <span>رنگ و تیم</span>
        </button>

        <button
          onClick={() => setActiveTab("presets")}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[11px] font-medium transition ${
            activeTab === "presets"
              ? "bg-white/15 text-white font-bold shadow-[0_2px_10px_rgba(0,0,0,0.4)] border border-white/10"
              : "text-neutral-400 hover:text-neutral-200 hover:bg-white/5"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 mb-0.5" />
          <span>پریست‌ها</span>
        </button>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">

        {/* ========================================================= */}
        {/* TAB 1: MODELS & WHEELS & FLAPS */}
        {/* ========================================================= */}
        {activeTab === "models" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* 1. Body Models */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
                    انتخاب مدل بدنه (Car Body)
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-pink-400 font-bold">
                  {cust.model}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {CAR_BODY_DEFS.map((m) => {
                  const isSelected = cust.model === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => updateParam("model", m.id)}
                      className={`relative text-right p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? "bg-pink-950/30 border-pink-500/70 shadow-[0_0_16px_rgba(236,72,153,0.25)] ring-1 ring-pink-500/50"
                          : "bg-neutral-900/60 border-white/10 hover:border-white/20 hover:bg-neutral-800/60"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-pink-500 text-neutral-950 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}

                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{m.nameFa}</span>
                        </div>
                        <div className="text-[10px] text-pink-300/80 font-mono mt-0.5">
                          {m.sub}
                        </div>
                      </div>

                      <p className="text-[10px] text-neutral-400 leading-relaxed mt-2 border-t border-white/5 pt-1.5">
                        {m.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Wheel Flaps Width & Thickness Tuning (Requested Feature) */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-purple-950/30 to-neutral-900/90 border border-purple-500/30 space-y-3.5 shadow-lg">
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">تنظیمات عرض و ضخامت Flap گلگیرها</h4>
                    <span className="text-[10px] text-purple-300/80 font-mono">Wheel Arch Flaps & Aero Tuning</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateFlapParam("hideWheelFlaps", !cust.hideWheelFlaps)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition border ${
                    cust.hideWheelFlaps
                      ? "bg-neutral-800 text-neutral-400 border-white/10"
                      : "bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                  }`}
                >
                  {cust.hideWheelFlaps ? "فلپ‌ها: مخفی (Hidden)" : "فلپ‌ها: فعال (Visible)"}
                </button>
              </div>

              {!cust.hideWheelFlaps && (
                <div className="space-y-3 pt-1">
                  {/* Flap Width Scale (سایز عرضی) */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                      <span className="text-neutral-200 font-bold flex items-center gap-1.5">
                        <span>سایز عرضی فلپ‌ها (Flap Width)</span>
                        {cust.flapWidthScale < 0.7 && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">باریک و اسپرت</span>
                        )}
                        {cust.flapWidthScale > 1.1 && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30">عریض (Wide)</span>
                        )}
                      </span>
                      <span className="text-purple-300 font-bold font-mono">{cust.flapWidthScale?.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.10"
                      max="1.80"
                      step="0.05"
                      value={cust.flapWidthScale ?? 0.65}
                      onChange={(e) => updateFlapParam("flapWidthScale", parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                    />
                    <div className="flex justify-between text-[9px] text-neutral-500 font-mono mt-1">
                      <span>۰.۱۰x (فوق‌العاده باریک)</span>
                      <span>۰.۶۵x (پیشنهادی اسپرت)</span>
                      <span>۱.۸۰x (عریض مسابقه‌ای)</span>
                    </div>
                  </div>

                  {/* Flap Thickness Scale (ضخامت و کلفتی) */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                      <span className="text-neutral-200 font-bold flex items-center gap-1.5">
                        <span>ضخامت و کلفتی فلپ‌ها (Flap Thickness)</span>
                        {cust.flapThickScale < 0.7 && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">ظریف و دقیق</span>
                        )}
                      </span>
                      <span className="text-purple-300 font-bold font-mono">{cust.flapThickScale?.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.15"
                      max="1.80"
                      step="0.05"
                      value={cust.flapThickScale ?? 0.60}
                      onChange={(e) => updateFlapParam("flapThickScale", parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                    />
                    <div className="flex justify-between text-[9px] text-neutral-500 font-mono mt-1">
                      <span>۰.۱۵x (اسلیم و ظریف)</span>
                      <span>۰.۶۰x (پیشنهادی متناسب)</span>
                      <span>۱.۸۰x (کلفت و زرهی)</span>
                    </div>
                  </div>

                  {/* Flap Overall Scale (مقیاس کلی) */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                      <span className="text-neutral-200 font-bold">اندازه کلی گلگیرها (Overall Scale)</span>
                      <span className="text-purple-300 font-bold font-mono">{cust.flapScale?.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.40"
                      max="1.60"
                      step="0.05"
                      value={cust.flapScale ?? 1.0}
                      onChange={(e) => updateFlapParam("flapScale", parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                    />
                  </div>

                  {/* Quick Preset Buttons for Flaps */}
                  <div className="pt-2 border-t border-purple-500/20">
                    <span className="text-[10px] text-neutral-400 font-mono block mb-1.5">پریست‌های سریع آیرودینامیک فلپ:</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          updateFlapParam("flapWidthScale", 0.35);
                          updateFlapParam("flapThickScale", 0.40);
                          updateFlapParam("hideWheelFlaps", false);
                        }}
                        className="p-1.5 rounded-lg bg-neutral-900 hover:bg-purple-900/40 border border-white/10 hover:border-purple-500/40 text-[10px] text-white font-bold transition text-center"
                      >
                        ⚡ فوق باریک
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateFlapParam("flapWidthScale", 0.65);
                          updateFlapParam("flapThickScale", 0.60);
                          updateFlapParam("hideWheelFlaps", false);
                        }}
                        className="p-1.5 rounded-lg bg-neutral-900 hover:bg-purple-900/40 border border-purple-500/30 text-[10px] text-purple-300 font-bold transition text-center"
                      >
                        🏎️ اسپرت متناسب
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateFlapParam("flapWidthScale", 1.25);
                          updateFlapParam("flapThickScale", 1.15);
                          updateFlapParam("hideWheelFlaps", false);
                        }}
                        className="p-1.5 rounded-lg bg-neutral-900 hover:bg-purple-900/40 border border-white/10 hover:border-purple-500/40 text-[10px] text-white font-bold transition text-center"
                      >
                        🛡️ وایدبادی عریض
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Wheel Models */}
            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
                    انتخاب مدل رینگ (Wheel Rims)
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 font-bold">
                  {cust.wheel}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {CAR_WHEEL_DEFS.map((w) => {
                  const isSelected = cust.wheel === w.id;
                  return (
                    <button
                      key={w.id}
                      onClick={() => updateParam("wheel", w.id)}
                      className={`relative text-right p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? "bg-cyan-950/30 border-cyan-500/70 shadow-[0_0_16px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/50"
                          : "bg-neutral-900/60 border-white/10 hover:border-white/20 hover:bg-neutral-800/60"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-cyan-400 text-neutral-950 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}

                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Disc className="w-3 h-3 text-cyan-400" />
                          <span>{w.nameFa}</span>
                        </div>
                        <div className="text-[10px] text-cyan-300/80 font-mono mt-0.5">
                          {w.sub}
                        </div>
                      </div>

                      <p className="text-[10px] text-neutral-400 leading-relaxed mt-2 border-t border-white/5 pt-1.5">
                        {w.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: VINYLS & DECALS (25 DESIGNS & DYNAMIC SHADERS) */}
        {/* ========================================================= */}
        {activeTab === "vinyls" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Header info */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 border border-amber-500/20">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>طرح‌های وینیل و متریال‌های پویا (۲۵ طرح با کیفیت بالا)</span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                طرح‌های اژدهای آتشین، ابرقهرمان‌ها، تم‌های کارتونی و کیوت، و طرح‌های مسابقه‌ای با شیدر گرافیکی زنده و انیمیشن متحرک.
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-[11px] font-medium">
              {[
                { id: "ALL", label: "همه (All)" },
                { id: "dragon", label: "🐉 اژدها و اساطیری" },
                { id: "hero", label: "⚡ ابرقهرمان" },
                { id: "cute", label: "🦄 کیوت و کارتونی" },
                { id: "racing", label: "🏁 مسابقه‌ای و پرو" }
              ].map((cat) => {
                const isCatActive = vinylCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setVinylCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition border ${
                      isCatActive
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold shadow-sm"
                        : "bg-neutral-900/60 text-neutral-400 hover:text-white border-white/5 hover:border-white/10"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Vinyl Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {CAR_VINYL_DEFS.filter(v => {
                if (vinylCategory === "ALL") return true;
                if (vinylCategory === "dragon") return v.category === "dragon";
                if (vinylCategory === "hero") return v.category === "hero";
                if (vinylCategory === "cute") return v.category === "cute";
                if (vinylCategory === "racing") return v.category === "racing" || !v.category;
                return true;
              }).map((v) => {
                const isSelected = cust.vinyl === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => updateParam("vinyl", v.id)}
                    className={`relative text-right p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? "bg-amber-950/30 border-amber-500/80 shadow-[0_0_18px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/50"
                        : "bg-neutral-900/60 border-white/10 hover:border-white/20 hover:bg-neutral-800/60"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-white">
                          {v.nameFa}
                        </div>
                      </div>
                      <div className="text-[10px] text-amber-300/80 font-mono mt-0.5">
                        {v.sub}
                      </div>
                    </div>

                    <div className="mt-2.5 pt-1.5 border-t border-white/5 flex items-center justify-between">
                      <p className="text-[10px] text-neutral-400 leading-tight">
                        {v.desc}
                      </p>
                    </div>

                    {v.animated && (
                      <div className="mt-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-bold self-start border border-amber-500/30">
                        <Zap className="w-2.5 h-2.5 animate-pulse" />
                        <span>پویا و متحرک</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Vinyl Parameters Control Box (If not NONE) */}
            {cust.vinyl !== "NONE" && (
              <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-white/15 space-y-3.5 animate-in fade-in duration-150">
                <div className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                  <span>تنظیمات دقیق طرح وینیل انتخابی</span>
                </div>

                {/* 1. Vinyl Color */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-white">رنگ وینیل (Decal Color)</div>
                    <div className="text-[10px] text-neutral-400">رنگ خطوط و طرح روی ماشین</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-neutral-300">{cust.vinylColor}</span>
                    <label className="relative w-7 h-7 rounded-lg border border-white/20 overflow-hidden cursor-pointer shadow-sm">
                      <input
                        type="color"
                        value={cust.vinylColor}
                        onChange={(e) => updateParam("vinylColor", e.target.value)}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                      <div className="w-full h-full" style={{ backgroundColor: cust.vinylColor }} />
                    </label>
                  </div>
                </div>

                {/* Quick Swatches for Vinyl */}
                <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
                  {SWATCHES.map((sw) => (
                    <button
                      key={sw}
                      onClick={() => updateParam("vinylColor", sw)}
                      className={`w-4 h-4 rounded-full border transition-transform flex-shrink-0 ${
                        cust.vinylColor.toLowerCase() === sw.toLowerCase()
                          ? "border-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                          : "border-black/40 hover:scale-110"
                      }`}
                      style={{ backgroundColor: sw }}
                      title={sw}
                    />
                  ))}
                </div>

                {/* 2. Emissive Glow */}
                <div>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                    <span>درخشش نئونی طرح (Emissive Glow):</span>
                    <span className="font-mono text-amber-400 font-bold">{Math.round(cust.vinylEmissive * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2.0"
                    step="0.05"
                    value={cust.vinylEmissive}
                    onChange={(e) => updateParam("vinylEmissive", parseFloat(e.target.value))}
                    className="w-full accent-amber-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* 3. Vinyl Scale / Density */}
                <div>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                    <span>تراکم و مقیاس طرح (Scale / Density):</span>
                    <span className="font-mono text-white font-bold">{cust.vinylScale.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.05"
                    value={cust.vinylScale}
                    onChange={(e) => updateParam("vinylScale", parseFloat(e.target.value))}
                    className="w-full accent-amber-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* 4. Dynamic Animation Toggle */}
                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <div>
                    <div className="text-[11px] font-bold text-white">انیمیشن و حرکت پویا روی متریال</div>
                    <div className="text-[10px] text-neutral-400">جریان متحرک امواج، کد ماتریکس و پالس نئونی</div>
                  </div>
                  <button
                    onClick={() => updateParam("vinylAnimated", !cust.vinylAnimated)}
                    className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                      cust.vinylAnimated ? "bg-amber-500" : "bg-neutral-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                        cust.vinylAnimated ? "translate-x-[-18px]" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PAINT SHOP & TEAM COLORS */}
        {/* ========================================================= */}
        {activeTab === "paint" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Quick Team Color Scheme Selector */}
            <div>
              <div className="text-xs font-bold text-neutral-200 mb-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>رنگ‌های رسمی دو تیم مسابقه (Team Colors):</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {TEAM_PRESETS.map((t) => {
                  const isCurrent = cust.teamVariant === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleApplyTeam(t)}
                      className={`p-2.5 rounded-xl border text-right transition flex items-center justify-between ${
                        isCurrent
                          ? "bg-white/10 border-white/40 shadow-lg ring-1 ring-white/30"
                          : "bg-neutral-900/60 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: t.bodyColor }}
                        />
                        <span className="text-xs font-bold text-white">{t.nameFa}</span>
                      </div>
                      {isCurrent && <Check className="w-3 h-3 text-white stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Paint Enable Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/80 border border-white/10">
              <div>
                <div className="text-xs font-bold text-white">فعال‌سازی رنگ‌آمیزی دستی قطعات</div>
                <div className="text-[10px] text-neutral-400">تنظیم آزادانه رنگ هر قطعه به صورت مستقل</div>
              </div>
              <button
                onClick={() => updateParam("useCustomPaint", !cust.useCustomPaint)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                  cust.useCustomPaint ? "bg-pink-500" : "bg-neutral-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    cust.useCustomPaint ? "translate-x-[-20px]" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* 1. Main Body Paint */}
            <PartColorControl
              title="۱. بدنه اصلی (Primary Body Paint)"
              description="رنگ کلی بدنه خودرو و روکش بیرونی"
              colorKey="bodyColor"
              value={cust.bodyColor}
              onChange={updateParam}
            />

            {/* Body Finish & Lacquer Controls */}
            <div className="p-3 rounded-xl bg-neutral-900/50 border border-white/10 space-y-3">
              <div className="text-[11px] font-bold text-neutral-300 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>جلوه‌های رنگ بدنه (Metallic & Gloss Finish)</span>
              </div>

              {/* Metallic */}
              <div>
                <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                  <span>متالیک (Metallic):</span>
                  <span className="font-mono text-white">{Math.round(cust.metallic * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={cust.metallic}
                  onChange={(e) => updateParam("metallic", parseFloat(e.target.value))}
                  className="w-full accent-pink-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Gloss / Clearcoat */}
              <div>
                <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                  <span>براقیت لاک و کیلرکت (Clearcoat):</span>
                  <span className="font-mono text-white">{Math.round(cust.clearcoat * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.02"
                  value={cust.clearcoat}
                  onChange={(e) => updateParam("clearcoat", parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Flakes */}
              <div>
                <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                  <span>اکلیل و پولک رنگ (Flakes):</span>
                  <span className="font-mono text-white">{Math.round(cust.flakes * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={cust.flakes}
                  onChange={(e) => updateParam("flakes", parseFloat(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* 3D Surface Relief & Bump Mapping Controls (پستی‌بلندی و برجستگی بدنه) */}
            <div className="p-3 rounded-xl bg-neutral-900/50 border border-white/10 space-y-3">
              <div className="text-[11px] font-bold text-neutral-300 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-pink-400" />
                  <span>پستی‌بلندی و برجستگی بدنه (3D Bump Mapping)</span>
                </div>
                <span className="font-mono text-xs text-pink-400 font-bold">
                  {Math.round(cust.carBump * 100)}%
                </span>
              </div>

              {/* Bump Intensity Slider */}
              <input
                type="range"
                min="0.0"
                max="2.0"
                step="0.05"
                value={cust.carBump}
                onChange={(e) => updateParam("carBump", parseFloat(e.target.value))}
                className="w-full accent-pink-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
              />

              {/* 3D Panel Styles */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {[
                  { id: "SPORTS_PANELS", label: "شیارهای اسپرت و کاپوت" },
                  { id: "CARBON_WEAVE", label: "بافت فیبرکربن عمیق" },
                  { id: "RACING_LOUVERS", label: "هواکش‌های موتور و بالچه" },
                  { id: "CYBER_PLATING", label: "صفحات زرهی سایبری" }
                ].map((style) => (
                  <button
                    key={style.id}
                    onClick={() => updateParam("carBumpStyle", style.id)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-medium border text-center transition ${
                      cust.carBumpStyle === style.id
                        ? "bg-pink-500/20 border-pink-500/60 text-pink-200 font-bold"
                        : "bg-neutral-900/80 border-white/5 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Roll Cage & Titanium Chassis */}
            <PartColorControl
              title="۲. شاسی و رول‌کیج (Chassis & Roll Cage)"
              description="رول‌کیج لوله‌ای، دیفیوزر عقب و اجزای موتور"
              colorKey="accentColor"
              value={cust.accentColor}
              onChange={updateParam}
            />

            {/* 3. Trim / Stripes / Flaps */}
            <PartColorControl
              title="۳. خطوط و بالچه‌ها (Trim & Aero Flaps)"
              description="خطوط نواری روی بدنه و بالچه‌های چرخ"
              colorKey="trimColor"
              value={cust.trimColor}
              onChange={updateParam}
            />

            {/* 4. Tinted Glass */}
            <PartColorControl
              title="۴. شیشه کابین (Cockpit Glass)"
              description="تیرگی و رنگ شیشه‌های جلو و طرفین"
              colorKey="glassColor"
              value={cust.glassColor}
              onChange={updateParam}
            />

            {/* 5. Lights & Neon Glow */}
            <PartColorControl
              title="۵. چراغ‌ها و نئون (Lights & Neon)"
              description="چراغ‌های جلو و نوارهای نوری بدنه"
              colorKey="lightsColor"
              value={cust.lightsColor}
              onChange={updateParam}
            />

            {/* 6. Nitro Thruster Bell */}
            <PartColorControl
              title="۶. اگزوز نیترو (Nitro Thruster)"
              description="محفظه و شعله خروجی توربو نیترو"
              colorKey="thrusterColor"
              value={cust.thrusterColor}
              onChange={updateParam}
            />

            {/* 7. Wheel Hubs & Spokes */}
            <PartColorControl
              title="۷. رینگ و پره‌ها (Rims & Alloy Spokes)"
              description="رنگ فلزی آلیاژ پره‌های چرخ و مهره وسط"
              colorKey="hubColor"
              value={cust.hubColor}
              onChange={updateParam}
            />

            {/* 8. Tyre Rubber */}
            <PartColorControl
              title="۸. لاستیک‌ها (Tyre Rubber)"
              description="تُن لاستیک و عاج چرخ‌ها"
              colorKey="wheelColor"
              value={cust.wheelColor}
              onChange={updateParam}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: READY PRESETS */}
        {/* ========================================================= */}
        {activeTab === "presets" && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div className="text-xs text-neutral-300">
              طرح‌های آماده و جذاب مسابقه‌ای با ست کامل رنگ بدنه، رینگ، وینیل و قطعات:
            </div>

            <div className="space-y-2.5">
              {CAR_PRESETS.map((preset) => {
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset)}
                    className="w-full text-right p-3 rounded-xl bg-neutral-900/70 border border-white/10 hover:border-white/20 hover:bg-neutral-800/70 transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      {/* Color Palette Swatches Preview */}
                      <div className="flex items-center -space-x-1.5 space-x-reverse">
                        <span
                          className="w-5 h-5 rounded-full border border-black/50 shadow-sm"
                          style={{ backgroundColor: preset.bodyColor }}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-black/50 shadow-sm"
                          style={{ backgroundColor: preset.accentColor }}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-black/50 shadow-sm"
                          style={{ backgroundColor: preset.trimColor }}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-black/50 shadow-sm"
                          style={{ backgroundColor: preset.lightsColor }}
                        />
                      </div>

                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                          {preset.nameFa}
                        </div>
                        <div className="text-[10px] text-neutral-400 font-mono">
                          {preset.model} + {preset.wheel} {preset.vinyl ? `• ${preset.vinyl}` : ""}
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-neutral-400 group-hover:text-white flex items-center gap-1">
                      <span>انتخاب</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-white/10 bg-neutral-950 flex items-center justify-between gap-2">
        <button
          onClick={handleResetToDefault}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/10 transition"
          title="بازگشت به رنگ‌های پیش‌فرض"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>ریست</span>
        </button>

        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
            saveSuccess
              ? "bg-emerald-600 text-white"
              : "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]"
          }`}
        >
          {saveSuccess ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Save className="w-3.5 h-3.5" />}
          <span>{saveSuccess ? "ذخیره شد!" : "ذخیره تغییرات"}</span>
        </button>
      </div>
    </div>
  );
}

// Sub-component for individual part color control
function PartColorControl({ title, description, colorKey, value, onChange }) {
  return (
    <div className="p-3 rounded-xl bg-neutral-900/60 border border-white/10 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-white">{title}</div>
          <div className="text-[10px] text-neutral-400">{description}</div>
        </div>

        {/* Color input box */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-neutral-300">{value}</span>
          <label className="relative w-7 h-7 rounded-lg border border-white/20 overflow-hidden cursor-pointer shadow-sm">
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(colorKey, e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
            <div className="w-full h-full" style={{ backgroundColor: value }} />
          </label>
        </div>
      </div>

      {/* Quick Swatches */}
      <div className="flex items-center gap-1.5 pt-1 overflow-x-auto custom-scrollbar pb-0.5">
        {SWATCHES.map((sw) => (
          <button
            key={sw}
            onClick={() => onChange(colorKey, sw)}
            className={`w-4 h-4 rounded-full border transition-transform flex-shrink-0 ${
              value.toLowerCase() === sw.toLowerCase()
                ? "border-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                : "border-black/40 hover:scale-110"
            }`}
            style={{ backgroundColor: sw }}
            title={sw}
          />
        ))}
      </div>
    </div>
  );
}

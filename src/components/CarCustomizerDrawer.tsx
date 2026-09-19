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
  RefreshCw
} from "lucide-react";
import {
  CFG,
  DEFAULT_CFG,
  CAR_BODY_DEFS,
  CAR_WHEEL_DEFS,
  CAR_PRESETS,
  saveCurrentConfig
} from "../game/config.js";

const SWATCHES = [
  "#e0468c", "#00f0ff", "#d91424", "#ffd700",
  "#55ff00", "#ff6600", "#a855f7", "#ffffff",
  "#14171d", "#3b82f6", "#06b6d4", "#10b981"
];

export function CarCustomizerDrawer({
  isOpen,
  onClose,
  engineRef,
  onCustomizationChange
}) {
  const [activeTab, setActiveTab] = useState("models"); // 'models' | 'paint' | 'presets'
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local state mirrored from CFG.customization
  const [cust, setCust] = useState(() => {
    const current = CFG.customization || {};
    return {
      model: current.model || "OCTANE",
      wheel: current.wheel || "SPORT",
      useCustomPaint: current.useCustomPaint !== undefined ? current.useCustomPaint : true,
      bodyColor: current.bodyColor || "#e0468c",
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
      carBumpStyle: (CFG.gfx && CFG.gfx.carBumpStyle) || current.carBumpStyle || "SPORTS_PANELS"
    };
  });

  // Sync state if CFG changes externally
  useEffect(() => {
    if (CFG.customization) {
      setCust({
        ...CFG.customization,
        carBump: CFG.gfx?.carBump ?? 0.90,
        carBumpStyle: CFG.gfx?.carBumpStyle ?? "SPORTS_PANELS"
      });
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

    if (onCustomizationChange) {
      onCustomizationChange(key, value);
    }
  };

  const handleApplyPreset = (preset) => {
    const updated = {
      ...cust,
      model: preset.model || cust.model,
      wheel: preset.wheel || cust.wheel,
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
      useCustomPaint: true,
      bodyColor: "#e0468c",
      accentColor: "#181c23",
      trimColor: "#f0f2f5",
      glassColor: "#0a0e14",
      lightsColor: "#4ca5ff",
      thrusterColor: "#ff7700",
      hubColor: "#d6dade",
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
      className="fixed inset-y-0 left-0 z-50 w-full sm:w-[420px] bg-neutral-950/95 backdrop-blur-2xl border-r border-white/15 shadow-[25px_0_60px_rgba(0,0,0,0.9)] flex flex-col text-neutral-100 animate-in slide-in-from-left duration-300 select-none"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-neutral-900/90 via-neutral-900/60 to-neutral-950/90 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-pink-500/40 flex items-center justify-center text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
            <Car className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-white">گاراژ و نقاشی ماشین</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                GARAGE
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">شخصی‌سازی دقیق مدل، رینگ و قطعات بدنه</p>
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

      {/* Tabs Bar */}
      <div className="flex items-center border-b border-white/10 bg-neutral-900/40 p-1.5 gap-1">
        <button
          onClick={() => setActiveTab("models")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-medium transition ${
            activeTab === "models"
              ? "bg-white/15 text-white font-bold shadow-[0_2px_10px_rgba(0,0,0,0.4)] border border-white/10"
              : "text-neutral-400 hover:text-neutral-200 hover:bg-white/5"
          }`}
        >
          <Car className="w-3.5 h-3.5 text-pink-400" />
          <span>مدل و رینگ</span>
        </button>

        <button
          onClick={() => setActiveTab("paint")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-medium transition ${
            activeTab === "paint"
              ? "bg-white/15 text-white font-bold shadow-[0_2px_10px_rgba(0,0,0,0.4)] border border-white/10"
              : "text-neutral-400 hover:text-neutral-200 hover:bg-white/5"
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-cyan-400" />
          <span>رنگ‌آمیزی قطعات</span>
        </button>

        <button
          onClick={() => setActiveTab("presets")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-medium transition ${
            activeTab === "presets"
              ? "bg-white/15 text-white font-bold shadow-[0_2px_10px_rgba(0,0,0,0.4)] border border-white/10"
              : "text-neutral-400 hover:text-neutral-200 hover:bg-white/5"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>طرح‌های آماده</span>
        </button>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">

        {/* ========================================================= */}
        {/* TAB 1: MODELS & WHEELS */}
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

            {/* 2. Wheel Models */}
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
        {/* TAB 2: PART-BY-PART PAINT SHOP */}
        {/* ========================================================= */}
        {activeTab === "paint" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Custom Paint Enable Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/80 border border-white/10">
              <div>
                <div className="text-xs font-bold text-white">فعال‌سازی رنگ‌آمیزی اختصاصی</div>
                <div className="text-[10px] text-neutral-400">استفاده از رنگ دلخواه به جای رنگ استاندارد تیم</div>
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
                  {Math.round((cust.carBump ?? 0.9) * 100)}%
                </span>
              </div>

              {/* Intensity Slider */}
              <div>
                <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                  <span>عمق برجستگی و خطوط (Bump Depth):</span>
                  <span className="font-mono text-white">{(cust.carBump ?? 0.9).toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2.0"
                  step="0.05"
                  value={cust.carBump ?? 0.9}
                  onChange={(e) => updateParam("carBump", parseFloat(e.target.value))}
                  className="w-full accent-pink-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Style Presets Grid */}
              <div>
                <div className="text-[10px] text-neutral-400 mb-1.5">سبک طرح و بافت پستی‌بلندی:</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: "SPORTS_PANELS", label: "پنل‌های مسابقه‌ای", icon: "🏎️" },
                    { id: "AERO_LOUVERS", label: "شیارهای آیرودینامیک", icon: "⚡" },
                    { id: "CARBON_WEAVE", label: "بافت کربن ۳D", icon: "💎" },
                    { id: "ARMOR_PLATES", label: "صفحات زرهی تیتانیوم", icon: "🛡️" }
                  ].map((style) => {
                    const activeStyle = (cust.carBumpStyle || CFG.gfx?.carBumpStyle) === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => updateParam("carBumpStyle", style.id)}
                        className={`p-2 rounded-lg border text-right text-[11px] font-medium transition flex items-center gap-1.5 ${
                          activeStyle
                            ? "bg-pink-950/40 border-pink-500/80 text-pink-200 font-bold shadow-[0_0_12px_rgba(236,72,153,0.3)]"
                            : "bg-neutral-800/50 border-white/10 text-neutral-300 hover:bg-neutral-700/50"
                        }`}
                      >
                        <span>{style.icon}</span>
                        <span className="truncate">{style.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. Roll Cage & Accent */}
            <PartColorControl
              title="۲. شاسی و رول‌کیج (Chassis & Roll Cage)"
              description="لوله‌های محافظتی، زیربندی و قطعات تیتانیومی"
              colorKey="accentColor"
              value={cust.accentColor}
              onChange={updateParam}
            />

            {/* 3. Racing Stripes & Livery Trim */}
            <PartColorControl
              title="۳. طرح و خطوط مسابقه‌ای (Racing Stripes)"
              description="خطوط طرح‌دار، باله عقب و نوارهای آیرودینامیک"
              colorKey="trimColor"
              value={cust.trimColor}
              onChange={updateParam}
            />

            {/* 4. Canopy Glass */}
            <PartColorControl
              title="۴. شیشه‌های کابین (Cockpit Canopy Glass)"
              description="رنگ دودی، آینه‌ای یا نئونی شیشه‌های خودرو"
              colorKey="glassColor"
              value={cust.glassColor}
              onChange={updateParam}
            />

            {/* 5. Headlights & LED Lights */}
            <PartColorControl
              title="۵. چراغ‌های جلو و نئون (LED Headlights)"
              description="رنگ درخشش چراغ‌ها و لایت‌بار روی سقف"
              colorKey="lightsColor"
              value={cust.lightsColor}
              onChange={updateParam}
            />

            {/* 6. Rocket Thruster Core */}
            <PartColorControl
              title="۶. نازل اگزوز و بوست (Rocket Thruster)"
              description="رنگ هسته اگزوز موشکی و شعله نیترو"
              colorKey="thrusterColor"
              value={cust.thrusterColor}
              onChange={updateParam}
            />

            {/* 7. Wheel Hubs & Rims */}
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
        {/* TAB 3: READY PRESETS */}
        {/* ========================================================= */}
        {activeTab === "presets" && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div className="text-xs text-neutral-300">
              طرح‌های آماده و جذاب مسابقه‌ای با ست کامل رنگ بدنه، رینگ و قطعات:
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
                        <div className="text-xs font-bold text-white group-hover:text-pink-300 transition">
                          {preset.nameFa}
                        </div>
                        <div className="text-[10px] text-neutral-400 font-mono">
                          {preset.model} + {preset.wheel}
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
              : "bg-pink-600 hover:bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]"
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

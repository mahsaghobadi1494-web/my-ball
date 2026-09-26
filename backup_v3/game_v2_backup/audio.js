// @ts-nocheck
import { clamp } from './math.js';
import { CFG } from './config.js';

export function AudioManager() {
  this.ctx = null;
  this.ready = false;
  this.enabled = true;
  this.engineNodes = [];
  this.muted = false;
}
AudioManager.prototype.init = function () {
  if (this.ctx) return true;
  var AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) { this.enabled = false; return false; }
  try { this.ctx = new AC(); } catch (e) { this.enabled = false; return false; }
  var ctx = this.ctx;
  this.master = ctx.createGain();
  this.master.gain.value = CFG.audio.master;
  this.comp = ctx.createDynamicsCompressor();
  this.comp.threshold.value = -14;
  this.comp.knee.value = 22;
  this.comp.ratio.value = 5;
  this.comp.attack.value = 0.004;
  this.comp.release.value = 0.18;
  this.comp.connect(this.master);
  this.master.connect(ctx.destination);
  this.sfxBus = ctx.createGain(); this.sfxBus.gain.value = CFG.audio.sfx; this.sfxBus.connect(this.comp);
  this.engineBus = ctx.createGain(); this.engineBus.gain.value = 0; this.engineBus.connect(this.comp);
  var len = Math.floor(ctx.sampleRate * 1.6);
  this.noise = ctx.createBuffer(1, len, ctx.sampleRate);
  var data = this.noise.getChannelData(0);
  var last = 0;
  for (var i = 0; i < len; i++) {
    var w = Math.random() * 2 - 1;
    last = (last + w * 0.42) * 0.72;
    data[i] = clamp(last, -1, 1);
  }
  this.engFilter = ctx.createBiquadFilter();
  this.engFilter.type = "lowpass";
  this.engFilter.frequency.value = 700;
  this.engFilter.Q.value = 3.5;
  this.engFilter.connect(this.engineBus);
  this.engGain = ctx.createGain();
  this.engGain.gain.value = 0.5;
  this.engGain.connect(this.engFilter);
  for (var o = 0; o < 3; o++) {
    var osc = ctx.createOscillator();
    osc.type = o === 2 ? "square" : "sawtooth";
    osc.frequency.value = 70 + o * 3;
    var g = ctx.createGain();
    g.gain.value = o === 2 ? 0.12 : 0.3;
    osc.connect(g); g.connect(this.engGain);
    osc.start();
    this.engineNodes.push(osc);
  }
  this.rumble = ctx.createBufferSource();
  this.rumble.buffer = this.noise;
  this.rumble.loop = true;
  var rf = ctx.createBiquadFilter();
  rf.type = "bandpass"; rf.frequency.value = 180; rf.Q.value = 1.2;
  this.rumbleGain = ctx.createGain();
  this.rumbleGain.gain.value = 0;
  this.rumble.connect(rf); rf.connect(this.rumbleGain); this.rumbleGain.connect(this.engineBus);
  this.rumble.start();
  this.boostSrc = ctx.createBufferSource();
  this.boostSrc.buffer = this.noise;
  this.boostSrc.loop = true;
  this.boostFilter = ctx.createBiquadFilter();
  this.boostFilter.type = "bandpass";
  this.boostFilter.frequency.value = 900;
  this.boostFilter.Q.value = 0.9;
  this.boostGain = ctx.createGain();
  this.boostGain.gain.value = 0;
  this.boostSrc.connect(this.boostFilter);
  this.boostFilter.connect(this.boostGain);
  this.boostGain.connect(this.sfxBus);
  this.boostSrc.start();
  this.ready = true;
  return true;
};
AudioManager.prototype.resume = function () {
  if (!this.ctx) this.init();
  if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
};
AudioManager.prototype.setVolumes = function () {
  if (!this.ready) return;
  if (this.master && this.master.gain) {
    this.master.gain.value = this.muted ? 0 : CFG.audio.master;
  }
  if (this.sfxBus && this.sfxBus.gain) {
    this.sfxBus.gain.value = CFG.audio.sfx;
  }
};
AudioManager.prototype.setMaster = function (val) {
  if (val !== undefined && !isNaN(val)) {
    CFG.audio.master = Number(val);
  }
  if (this.ready && this.master && this.master.gain) {
    this.master.gain.value = this.muted ? 0 : CFG.audio.master;
  }
};
AudioManager.prototype.setSfx = function (val) {
  if (val !== undefined && !isNaN(val)) {
    CFG.audio.sfx = Number(val);
  }
  if (this.ready && this.sfxBus && this.sfxBus.gain) {
    this.sfxBus.gain.value = CFG.audio.sfx;
  }
};
AudioManager.prototype.setMuted = function (muted) {
  this.muted = !!muted;
  this.setVolumes();
};
AudioManager.prototype.now = function () { return this.ctx ? this.ctx.currentTime : 0; };
AudioManager.prototype.burst = function (opts) {
  if (!this.ready || this.muted) return;
  var ctx = this.ctx, t = ctx.currentTime;
  var vol = (opts.vol === undefined ? 0.5 : opts.vol) * CFG.audio.sfx;
  if (vol <= 0.001) return;
  var dur = opts.dur || 0.18;
  if (opts.noise !== false) {
    var src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.playbackRate.value = opts.rate || 1;
    var f = ctx.createBiquadFilter();
    f.type = opts.filter || "bandpass";
    f.frequency.value = opts.freq || 700;
    f.Q.value = opts.q === undefined ? 1.1 : opts.q;
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(this.sfxBus);
    src.start(t, Math.random() * 0.6, dur + 0.05);
    src.stop(t + dur + 0.06);
  }
  if (opts.tone) {
    var osc = ctx.createOscillator();
    osc.type = opts.wave || "sine";
    osc.frequency.setValueAtTime(opts.tone, t);
    if (opts.toneEnd) osc.frequency.exponentialRampToValueAtTime(Math.max(24, opts.toneEnd), t + dur);
    var og = ctx.createGain();
    og.gain.setValueAtTime(0.0001, t);
    og.gain.linearRampToValueAtTime(vol * (opts.toneVol || 0.9), t + 0.008);
    og.gain.exponentialRampToValueAtTime(0.0001, t + dur * 1.1);
    osc.connect(og); og.connect(this.sfxBus);
    osc.start(t); osc.stop(t + dur * 1.2 + 0.02);
  }
};
AudioManager.prototype.chord = function (freqs, dur, vol, wave) {
  if (!this.ready || this.muted) return;
  var ctx = this.ctx, t = ctx.currentTime;
  for (var i = 0; i < freqs.length; i++) {
    var osc = ctx.createOscillator();
    osc.type = wave || "triangle";
    osc.frequency.value = freqs[i];
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime((vol || 0.3) * CFG.audio.sfx / freqs.length * 1.6, t + 0.02 + i * 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(this.sfxBus);
    osc.start(t + i * 0.02); osc.stop(t + dur + 0.05);
  }
};
AudioManager.prototype.ballHit = function (speed, surface) {
  var s = clamp(speed / 22, 0.08, 1);
  this.burst({ vol: 0.22 + s * 0.7, dur: 0.1 + s * 0.14, freq: 320 + s * 900, q: 0.8,
               tone: 90 + s * 130, toneEnd: 50 + s * 60, wave: "triangle", toneVol: 0.8 + s });
};
AudioManager.prototype.wallHit = function (speed) {
  var s = clamp(speed / 25, 0.05, 1);
  this.burst({ vol: 0.12 + s * 0.5, dur: 0.14, freq: 180 + s * 340, q: 0.6, filter: "lowpass", tone: 60 + s * 40, toneEnd: 40, toneVol: 0.7 });
};
AudioManager.prototype.jump = function () { this.burst({ vol: 0.3, dur: 0.1, freq: 1400, q: 2.5, tone: 420, toneEnd: 740, wave: "square", toneVol: 0.3 }); };
AudioManager.prototype.dodge = function () { this.burst({ vol: 0.32, dur: 0.16, freq: 900, q: 1.4, rate: 1.4, tone: 300, toneEnd: 620, wave: "sawtooth", toneVol: 0.28 }); };
AudioManager.prototype.land = function (impact) {
  var s = clamp(Math.abs(impact) / 12, 0.05, 1);
  this.burst({ vol: 0.14 + s * 0.5, dur: 0.13, freq: 140 + s * 200, filter: "lowpass", q: 0.8, tone: 70, toneEnd: 45, toneVol: 0.9 });
};
AudioManager.prototype.pad = function (big) {
  this.burst({ noise: false, tone: big ? 520 : 760, toneEnd: big ? 980 : 1220, dur: big ? 0.3 : 0.16, vol: big ? 0.34 : 0.22, wave: "triangle" });
};
AudioManager.prototype.countdown = function (n) {
  if (n > 0) this.burst({ noise: false, tone: 480, dur: 0.16, vol: 0.4, wave: "square", toneVol: 0.5 });
  else this.chord([523.25, 659.25, 783.99], 0.5, 0.34, "triangle");
};
AudioManager.prototype.goal = function (own) {
  this.chord(own ? [261.6, 311.1, 392.0] : [329.6, 415.3, 493.9, 659.3], 1.5, 0.42, "triangle");
  this.burst({ vol: 0.7, dur: 0.9, freq: 400, q: 0.4, rate: 0.6, filter: "lowpass", tone: 70, toneEnd: 40, toneVol: 1.2 });
};
AudioManager.prototype.whistle = function () {
  this.burst({ noise: false, tone: 1180, toneEnd: 1500, dur: 0.5, vol: 0.3, wave: "sine" });
};
AudioManager.prototype.ui = function (kind) {
  if (kind === "confirm") this.burst({ noise: false, tone: 620, toneEnd: 880, dur: 0.12, vol: 0.26, wave: "triangle" });
  else this.burst({ noise: false, tone: 340, toneEnd: 300, dur: 0.07, vol: 0.16, wave: "square" });
};
AudioManager.prototype.updateEngine = function (dt, car, playing) {
  if (!this.ready) return;
  var target = 0, freq = 70, filt = 600, rumble = 0, boost = 0;
  if (playing && car) {
    var sp = car.speed(), t = clamp(sp / CFG.physics.maxCarSpeed, 0, 1);
    var load = clamp(Math.abs(car.input.throttle) * 0.7 + t * 0.6, 0, 1);
    freq = 58 + t * 210 + (car.grounded ? 0 : 24);
    filt = 420 + t * 2400 + load * 700;
    target = CFG.audio.engine * (0.22 + load * 0.5);
    rumble = CFG.audio.engine * (car.grounded ? 0.05 + t * 0.22 : 0.02);
    boost = car.boostActive ? 0.5 * CFG.audio.sfx : 0;
  }
  var now = this.ctx.currentTime, k = 0.06;
  this.engineBus.gain.setTargetAtTime(this.muted ? 0 : target, now, k);
  this.rumbleGain.gain.setTargetAtTime(this.muted ? 0 : rumble, now, k);
  this.boostGain.gain.setTargetAtTime(this.muted ? 0 : boost, now, 0.03);
  for (var i = 0; i < this.engineNodes.length; i++) {
    this.engineNodes[i].frequency.setTargetAtTime(freq * (1 + i * 0.505), now, 0.05);
  }
  this.engFilter.frequency.setTargetAtTime(filt, now, 0.05);
  if (this.boostFilter) this.boostFilter.frequency.setTargetAtTime(700 + (car && car.boostActive ? 900 : 0), now, 0.05);
};

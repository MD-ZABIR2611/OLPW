// OLPW:night-flyer/game.js | script for game
/* =====================================================================
   NIGHT FLYER — neon-noir Flappy. Vanilla JS, no deps.
   Modules: Utils, Storage, AudioSys, Particles, Background, Player,
            Obstacles, Pickups, Game, UI, boot.
   ===================================================================== */
(() => {
'use strict';

/* ---------------- Utils ---------------- */
const $ = id => document.getElementById(id);
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);
const irand = (a, b) => Math.floor(rand(a, b + 1));
const TAU = Math.PI * 2;
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

/* ---------------- Storage ---------------- */
const DEFAULT_SAVE = {
  best: 0,
  totalCoins: 0,
  skin: 0,
  unlocked: [0],
  settings: { sound: true, volume: 0.7, particles: 'medium', vibrate: true, reduced: false },
  scores: [],           // local leaderboard [{score, coins, date, skin}]
  seenTutorial: false,
};
const Storage = {
  key: 'nightFlyer.v1',
  data: null,
  load() {
    try { this.data = Object.assign({}, DEFAULT_SAVE, JSON.parse(localStorage.getItem(this.key) || '{}')); }
    catch { this.data = { ...DEFAULT_SAVE }; }
    this.data.settings = Object.assign({}, DEFAULT_SAVE.settings, this.data.settings);
  },
  save() { try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch {} },
};

/* ---------------- Skins catalog ---------------- */
const SKINS = [
  { name: 'Neon Bird',   color: '#19e6ff', accent: '#bff6ff', shape: 'bird',     unlock: () => true,                       req: '' },
  { name: 'Cyber Jet',   color: '#b26bff', accent: '#f3d1ff', shape: 'jet',      unlock: d => d.best >= 10,               req: 'Best 10+' },
  { name: 'Night Bat',   color: '#ff3fd4', accent: '#ffc4ee', shape: 'bat',      unlock: d => d.totalCoins >= 40,         req: '40 ◈' },
  { name: 'Dragonfly',   color: '#7dff5e', accent: '#d8ffc9', shape: 'dragonfly',unlock: d => d.best >= 25,               req: 'Best 25+' },
  { name: 'UFO',         color: '#ffe873', accent: '#fff7c2', shape: 'ufo',      unlock: d => d.totalCoins >= 120,        req: '120 ◈' },
  { name: 'Crystal Bird',color: '#7df9ff', accent: '#ffffff', shape: 'crystal',  unlock: d => d.best >= 40,               req: 'Best 40+' },
];

/* ---------------- Audio (WebAudio, generated — no files needed) ---------------- */
class AudioSys {
  constructor() { this.ctx = null; this.master = null; this.musicGain = null; this.muted = false; this.musicTimer = null; this.step = 0; }
  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = Storage.data.settings.volume;
    this.master.connect(this.ctx.destination);
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.35;
    this.musicGain.connect(this.master);
    this.startMusic();
  }
  resume() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); }
  setVolume(v) { if (this.master) this.master.gain.value = v; }
  setMuted(m) { this.muted = m; if (this.master) this.master.gain.value = m ? 0 : Storage.data.settings.volume; }

  tone({ f = 440, t = 0.15, type = 'sine', vol = 0.5, slide = 0, dest }) {
    if (!this.ctx || this.muted) return;
    const c = this.ctx, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f, c.currentTime);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + slide), c.currentTime + t);
    g.gain.setValueAtTime(vol, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + t);
    o.connect(g); g.connect(dest || this.master);
    o.start(); o.stop(c.currentTime + t + 0.02);
  }
  noise({ t = 0.2, vol = 0.4, freq = 1200 }) {
    if (!this.ctx || this.muted) return;
    const c = this.ctx, len = c.sampleRate * t, buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource(); src.buffer = buf;
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq;
    const g = c.createGain(); g.gain.value = vol;
    src.connect(f); f.connect(g); g.connect(this.master); src.start();
  }
  flap()  { this.noise({ t: 0.12, vol: 0.25, freq: 900 }); this.tone({ f: 300, slide: 250, t: 0.14, type: 'triangle', vol: 0.25 }); }
  score() { this.tone({ f: 660, t: 0.08, type: 'square', vol: 0.2 }); this.tone({ f: 990, t: 0.12, type: 'square', vol: 0.15 }); }
  coin()  { this.tone({ f: 1245, t: 0.07, type: 'sine', vol: 0.3 }); setTimeout(() => this.tone({ f: 1660, t: 0.1, type: 'sine', vol: 0.25 }), 60); }
  power() { this.tone({ f: 440, slide: 880, t: 0.3, type: 'sawtooth', vol: 0.2 }); }
  hit()   { this.noise({ t: 0.35, vol: 0.5, freq: 300 }); this.tone({ f: 160, slide: -120, t: 0.4, type: 'sawtooth', vol: 0.4 }); }
  ui()    { this.tone({ f: 520, t: 0.06, type: 'sine', vol: 0.2 }); }

  startMusic() {
    if (!this.ctx || this.musicTimer) return;
    const bass = [110, 110, 98, 130.8, 110, 110, 87.3, 98];
    const arp  = [440, 523, 659, 523, 587, 523, 440, 392];
    this.musicTimer = setInterval(() => {
      if (this.muted || document.hidden) return;
      const i = this.step % 8;
      this.tone({ f: bass[i], t: 0.35, type: 'sine', vol: 0.22, dest: this.musicGain });
      if (this.step % 2 === 0) this.tone({ f: arp[i], t: 0.18, type: 'triangle', vol: 0.07, dest: this.musicGain });
      this.step++;
    }, 300);
  }
}
const Audio = new AudioSys();

/* ---------------- Particles (object pool) ---------------- */
class Particles {
  constructor() { this.pool = []; this.active = []; this.quality = 1; }
  setQuality() { this.quality = Storage.data.settings.particles === 'low' ? 0.4 : Storage.data.settings.particles === 'high' ? 1.4 : 1; }
  spawn(x, y, opts = {}) {
    const n = Math.max(1, Math.round((opts.n || 8) * this.quality));
    for (let i = 0; i < n; i++) {
      let p = this.pool.pop();
      if (!p) p = {};
      p.x = x; p.y = y;
      p.vx = rand(-1, 1) * (opts.speed || 160);
      p.vy = rand(-1, 1) * (opts.speed || 160);
      p.life = p.maxLife = rand(0.4, 0.9) * (opts.life || 1);
      p.size = rand(1.5, opts.size || 5);
      p.color = opts.color || '#19e6ff';
      p.grav = opts.grav ?? 220;
      this.active.push(p);
    }
  }
  burst(x, y, color, n = 26) { this.spawn(x, y, { n, color, speed: 320, life: 1.1, size: 7, grav: 500 }); }
  update(dt) {
    for (let i = this.active.length - 1; i >= 0; i--) {
      const p = this.active[i];
      p.life -= dt;
      if (p.life <= 0) { this.pool.push(p); this.active.splice(i, 1); continue; }
      p.vy += p.grav * dt; p.x += p.vx * dt; p.y += p.vy * dt;
    }
  }
  draw(ctx) {
    for (const p of this.active) {
      const a = clamp(p.life / p.maxLife, 0, 1);
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size * a + 0.5, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  }
}

/* ---------------- Background: starfield, shooting stars, city ---------------- */
class Background {
  constructor() { this.layers = []; this.shooters = []; this.cityFar = []; this.cityNear = []; this.moonPhase = 0.5; this.t = 0; this.timer = rand(2, 5); }
  build(W, H) {
    this.layers = [];
    const cfgs = [{ n: 90, s: 1, v: 8, a: 0.5 }, { n: 55, s: 1.8, v: 20, a: 0.75 }, { n: 30, s: 2.8, v: 42, a: 1 }];
    for (const c of cfgs) {
      const stars = [];
      for (let i = 0; i < c.n; i++) stars.push({ x: rand(0, W), y: rand(0, H * 0.75), tw: rand(0, TAU), r: rand(0.5, c.s) });
      this.layers.push({ ...c, stars });
    }
    this.cityFar = this.makeCity(W, H * 0.70, 60, '#141a3d');
    this.cityNear = this.makeCity(W, H * 0.78, 90, '#0a0d26');
  }
  makeCity(W, baseY, maxH, color) {
    const b = []; let x = 0;
    while (x < W * 2) { const w = rand(24, 64), h = rand(30, maxH); b.push({ x, w, h, color, win: irand(2, 6) }); x += w + rand(2, 10); }
    return b;
  }
  update(dt, W, H, speed) {
    this.t += dt;
    for (const L of this.layers) for (const s of L.stars) { s.tw += dt * 2; s.x -= L.v * dt * 0.3; if (s.x < -4) s.x += W + 8; }
    this.timer -= dt;
    if (this.timer <= 0) { this.shooters.push({ x: rand(0, W), y: rand(0, H * 0.3), vx: rand(-260, -520), vy: rand(120, 260), life: 1 }); this.timer = rand(3, 8); }
    for (let i = this.shooters.length - 1; i >= 0; i--) { const s = this.shooters[i]; s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt; if (s.life <= 0) this.shooters.splice(i, 1); }
    const scroll = dt * speed * 0.15;
    for (const c of this.cityFar) { c.x -= scroll * 0.4; if (c.x + c.w < 0) c.x += W * 2; }
    for (const c of this.cityNear) { c.x -= scroll; if (c.x + c.w < 0) c.x += W * 2; }
  }
  draw(ctx, W, H, groundY) {
    // sky gradient
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#04051a'); g.addColorStop(0.6, '#0a1030'); g.addColorStop(1, '#1a0f38');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // moon with phase glow
    const mx = W * 0.78, my = H * 0.16, mr = Math.min(W, H) * 0.07;
    const phase = 0.5 + 0.5 * Math.sin(this.t * 0.02); // subtle slow phase drift
    const glow = ctx.createRadialGradient(mx, my, mr * 0.2, mx, my, mr * 5);
    glow.addColorStop(0, `rgba(200,220,255,${0.18 + phase * 0.12})`); glow.addColorStop(1, 'rgba(200,220,255,0)');
    ctx.fillStyle = glow; ctx.fillRect(mx - mr * 5, my - mr * 5, mr * 10, mr * 10);
    ctx.fillStyle = '#e9f2ff'; ctx.shadowColor = '#cfe4ff'; ctx.shadowBlur = 30;
    ctx.beginPath(); ctx.arc(mx, my, mr, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = `rgba(10,14,40,${0.25 + phase * 0.5})`;
    ctx.beginPath(); ctx.arc(mx - mr * 0.35, my - mr * 0.2, mr * 0.85, 0, TAU); ctx.fill();
    // stars
    for (const L of this.layers) { ctx.fillStyle = '#dff4ff'; for (const s of L.stars) { ctx.globalAlpha = L.a * (0.5 + 0.5 * Math.sin(s.tw)); ctx.fillRect(s.x, s.y, s.r, s.r); } }
    ctx.globalAlpha = 1;
    // shooting stars
    for (const s of this.shooters) {
      ctx.strokeStyle = `rgba(255,255,255,${clamp(s.life, 0, 1)})`; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * 0.08, s.y - s.vy * 0.08); ctx.stroke();
    }
    // city skyline
    this.drawCity(ctx, this.cityFar, H * 0.70, false);
    this.drawCity(ctx, this.cityNear, H * 0.78, true);
  }
  drawCity(ctx, buildings, baseY, lights) {
    for (const b of buildings) {
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, baseY - b.h, b.w, b.h + 200);
      if (lights) {
        ctx.fillStyle = 'rgba(255,220,130,0.5)';
        for (let i = 0; i < b.win; i++) ctx.fillRect(b.x + 4 + (i % 3) * (b.w / 3.4), baseY - b.h + 8 + Math.floor(i / 3) * 18, 4, 6);
      }
    }
  }
}

/* ---------------- Player ---------------- */
const GRAV = 1500, FLAP_V = -500, P_R = 15;
class Player {
  constructor() { this.reset(); }
  reset() { this.x = 0; this.y = 0; this.vy = 0; this.rot = 0; this.alive = true; this.shield = 0; this.slow = 0; this.magnet = 0; this.double = 0; this.wing = 0; }
  flap() { this.vy = FLAP_V; this.wing = 10; Audio.flap(); }
  update(dt, groundY) {
    this.vy = Math.min(this.vy + GRAV * dt, 900);
    this.y += this.vy * dt;
    this.rot = clamp(this.vy / 700, -0.55, 1.3);
    this.wing = Math.max(0, this.wing - dt * 22);
    if (this.y < 10) { this.y = 10; this.vy = 0; }
    this.slow = Math.max(0, this.slow - dt);
    this.magnet = Math.max(0, this.magnet - dt);
    this.double = Math.max(0, this.double - dt);
  }
  draw(ctx, t) {
    const skin = SKINS[Storage.data.skin] || SKINS[0];
    ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.rot);
    ctx.shadowColor = skin.color; ctx.shadowBlur = 22;
    ctx.strokeStyle = skin.color; ctx.fillStyle = skin.color; ctx.lineWidth = 2.4;
    const flap = this.wing > 0 ? Math.sin(this.wing) * 0.9 : Math.sin(t * 6) * 0.25;
    switch (skin.shape) {
      case 'bird':
        ctx.beginPath(); ctx.ellipse(0, 0, 16, 10, 0, 0, TAU); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-4, 0); ctx.lineTo(-18, -8 - flap * 10); ctx.lineTo(-6, 4); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(14, -2); ctx.lineTo(24, 1); ctx.lineTo(14, 5); ctx.closePath(); ctx.fillStyle = skin.accent; ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(7, -3, 2.4, 0, TAU); ctx.fill();
        break;
      case 'jet':
        ctx.beginPath(); ctx.moveTo(20, 0); ctx.lineTo(-14, -9); ctx.lineTo(-8, 0); ctx.lineTo(-14, 9); ctx.closePath(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-2, -4); ctx.lineTo(-18, -16 - flap * 8); ctx.lineTo(6, -4); ctx.closePath(); ctx.fill();
        ctx.fillStyle = skin.accent; ctx.beginPath(); ctx.arc(10, -2, 2.4, 0, TAU); ctx.fill();
        break;
      case 'bat':
        ctx.beginPath(); ctx.arc(0, 0, 8, 0, TAU); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-2, -2); ctx.quadraticCurveTo(-20, -14 - flap * 12, -26, 2); ctx.quadraticCurveTo(-14, -2, -4, 5); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(2, -2); ctx.quadraticCurveTo(20, -14 - flap * 12, 26, 2); ctx.quadraticCurveTo(14, -2, 4, 5); ctx.closePath(); ctx.fill();
        break;
      case 'dragonfly':
        ctx.beginPath(); ctx.ellipse(0, 0, 14, 5, 0, 0, TAU); ctx.stroke();
        ctx.globalAlpha = 0.6;
        ctx.beginPath(); ctx.ellipse(-4, -8 - flap * 6, 10, 4, -0.4, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.ellipse(-4, 8 + flap * 6, 10, 4, 0.4, 0, TAU); ctx.fill();
        ctx.globalAlpha = 1;
        break;
      case 'ufo':
        ctx.beginPath(); ctx.ellipse(0, 3, 17, 7, 0, 0, TAU); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, -1, 8, Math.PI, 0); ctx.stroke();
        ctx.fillStyle = skin.accent; ctx.beginPath(); ctx.ellipse(0, 8 + flap * 3, 6, 3, 0, 0, TAU); ctx.fill();
        break;
      case 'crystal':
        ctx.beginPath(); ctx.moveTo(18, 0); ctx.lineTo(2, -11); ctx.lineTo(-14, -4); ctx.lineTo(-14, 4); ctx.lineTo(2, 11); ctx.closePath(); ctx.stroke();
        ctx.globalAlpha = 0.5; ctx.fill(); ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-22, -9 - flap * 8); ctx.lineTo(-14, 2); ctx.closePath(); ctx.fill();
        break;
    }
    ctx.restore();
    // shield aura
    if (this.shield > 0) {
      ctx.save(); ctx.strokeStyle = '#7df9ff'; ctx.shadowColor = '#7df9ff'; ctx.shadowBlur = 20; ctx.globalAlpha = 0.5 + 0.3 * Math.sin(t * 8);
      ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(this.x, this.y, 26, 0, TAU); ctx.stroke(); ctx.restore();
    }
    if (this.magnet > 0) {
      ctx.save(); ctx.strokeStyle = '#ffe873'; ctx.globalAlpha = 0.35; ctx.setLineDash([6, 8]);
      ctx.beginPath(); ctx.arc(this.x, this.y, 90, 0, TAU); ctx.stroke(); ctx.restore();
    }
  }
}

/* ---------------- Obstacles ---------------- */
const OBSTACLE_W = 54;
class Obstacles {
  constructor() { this.list = []; this.spacing = 300; this.sinceSpawn = 0; }
  reset() { this.list.length = 0; this.sinceSpawn = 0; }
  unlockedTypes(score) {
    const t = ['pipes'];
    if (score >= 5) t.push('barrier');
    if (score >= 12) t.push('ring');
    if (score >= 20) t.push('laser');
    return t;
  }
  maybeSpawn(score, H, groundY, speed) {
    this.sinceSpawn += speed * (1 / 60);
    const spacing = Math.max(250, 320 - score * 3);
    if (this.sinceSpawn < spacing || this.list.length > 8) return;
    this.sinceSpawn = 0;
    const types = this.unlockedTypes(score);
    const type = types[irand(0, types.length - 1)];
    const gap = clamp(190 - score * 2.2, 120, 190);
    const gy = rand(H * 0.28, groundY - H * 0.18);
    this.list.push({ type, x: W(), passed: false, gy, gap, t: rand(0, TAU), w: OBSTACLE_W, phase: rand(0, TAU) });
  }
  update(dt, speed, H, groundY) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const o = this.list[i];
      o.x -= speed * dt; o.t += dt;
      if (o.type === 'barrier') o.gy = clamp(o.gy + Math.sin(o.t * 1.6) * 90 * dt, H * 0.22, groundY - o.gap / 2 - 40);
      if (o.type === 'laser') o.curGap = o.gap * (0.7 + 0.3 * Math.sin(o.t * 3));
      if (o.x + o.w < -60) this.list.splice(i, 1);
    }
  }
  collides(p) {
    for (const o of this.list) {
      const half = o.w / 2, gapHalf = (o.type === 'laser' ? (o.curGap || o.gap) : o.gap) / 2;
      const cx = clamp(p.x, o.x - half, o.x + half);
      // pipes / barrier / laser: vertical gap between old gy-gapHalf .. gy+gapHalf
      if (o.type !== 'ring') {
        // solid parts are ABOVE (gy-gapHalf) and BELOW (gy+gapHalf) the gap.
        // circle vs top rect and bottom rect, using their inner edges.
        const rr = P_R - 2;
        const topEdge = o.gy - gapHalf, botEdge = o.gy + gapHalf;
        const dyT = p.y - Math.min(p.y, topEdge);
        const dyB = p.y - Math.max(p.y, botEdge);
        const dxC = p.x - cx;
        if (dxC * dxC + dyT * dyT < rr * rr || dxC * dxC + dyB * dyB < rr * rr) return o;
      } else {
        // ring: solid only in a thin annulus at the ring radius
        const d = Math.hypot(p.x - o.x, p.y - o.gy);
        const r = o.gap / 2 + 3;
        if (Math.abs(d - r) < P_R + 4) return o;
      }
    }
    return null;
  }
  draw(ctx, t) {
    for (const o of this.list) {
      ctx.save();
      if (o.type === 'pipes') this.drawPipes(ctx, o);
      else if (o.type === 'barrier') this.drawBarrier(ctx, o);
      else if (o.type === 'ring') this.drawRing(ctx, o, t);
      else this.drawLaser(ctx, o, t);
      ctx.restore();
    }
  }
  drawPipes(ctx, o) {
    const gh = o.gap / 2;
    ctx.strokeStyle = '#19e6ff'; ctx.fillStyle = 'rgba(25,230,255,0.12)';
    ctx.shadowColor = '#19e6ff'; ctx.shadowBlur = 14; ctx.lineWidth = 3;
    ctx.fillRect(o.x - o.w / 2, -20, o.w, o.gy - gh + 20); ctx.strokeRect(o.x - o.w / 2, -20, o.w, o.gy - gh + 20);
    ctx.fillRect(o.x - o.w / 2, o.gy + gh, o.w, 900); ctx.strokeRect(o.x - o.w / 2, o.gy + gh, o.w, 900);
  }
  drawBarrier(ctx, o) {
    const gh = o.gap / 2;
    ctx.strokeStyle = '#ff3fd4'; ctx.fillStyle = 'rgba(255,63,212,0.12)';
    ctx.shadowColor = '#ff3fd4'; ctx.shadowBlur = 14; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(o.x - o.w / 2, 0); ctx.lineTo(o.x + o.w / 2, 0); ctx.lineTo(o.x + o.w / 2, o.gy - gh); ctx.lineTo(o.x - o.w / 2, o.gy - gh); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(o.x - o.w / 2, o.gy + gh); ctx.lineTo(o.x + o.w / 2, o.gy + gh); ctx.lineTo(o.x + o.w / 2, 900); ctx.lineTo(o.x - o.w / 2, 900); ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  drawRing(ctx, o, t) {
    const r = o.gap / 2 + 3;
    ctx.strokeStyle = '#b26bff'; ctx.shadowColor = '#b26bff'; ctx.shadowBlur = 18; ctx.lineWidth = 5;
    ctx.save(); ctx.translate(o.x, o.gy); ctx.rotate(t * 1.4);
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(0, 0, r, i * Math.PI / 2, i * Math.PI / 2 + Math.PI / 3.2); ctx.stroke(); }
    ctx.restore();
    ctx.globalAlpha = 0.25; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(o.x, o.gy, r, 0, TAU); ctx.stroke(); ctx.globalAlpha = 1;
  }
  drawLaser(ctx, o, t) {
    const gap = o.curGap || o.gap, gh = gap / 2;
    const on = Math.sin(o.t * 3) > -0.2;
    ctx.strokeStyle = on ? '#ffe873' : 'rgba(255,232,115,0.25)';
    ctx.shadowColor = '#ffe873'; ctx.shadowBlur = on ? 22 : 4; ctx.lineWidth = on ? 6 : 2;
    ctx.beginPath(); ctx.moveTo(o.x, 0); ctx.lineTo(o.x, o.gy - gh); ctx.moveTo(o.x, o.gy + gh); ctx.lineTo(o.x, 900); ctx.stroke();
    ctx.fillStyle = '#ffe873'; ctx.fillRect(o.x - 4, o.gy - gh - 8, 8, 8); ctx.fillRect(o.x - 4, o.gy + gh, 8, 8);
  }
}

/* ---------------- Pickups: coins & power-ups ---------------- */
class Pickups {
  constructor() { this.coins = []; this.powerups = []; }
  reset() { this.coins.length = 0; this.powerups.length = 0; }
  maybeSpawn(score, H, groundY) {
    if (Math.random() < 0.5) {
      const y = rand(H * 0.2, groundY - 60);
      for (let i = 0; i < 3; i++) this.coins.push({ x: W() + i * 34, y: y + Math.sin(i) * 18, got: false });
    }
    if (Math.random() < 0.16) {
      const types = ['shield', 'slow', 'magnet', 'double'];
      this.powerups.push({ x: W(), y: rand(H * 0.2, groundY - 80), type: types[irand(0, 3)], t: 0 });
    }
  }
  update(dt, speed, p) {
    const mag = p.magnet > 0;
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const c = this.coins[i]; c.x -= speed * dt;
      if (mag) { const dx = p.x - c.x, dy = p.y - c.y, d = Math.hypot(dx, dy) || 1; if (d < 130) { c.x += dx / d * 420 * dt; c.y += dy / d * 420 * dt; } }
      if (Math.hypot(p.x - c.x, p.y - c.y) < P_R + 12) { this.coins.splice(i, 1); Game.onCoin(c.x, c.y); continue; }
      if (c.x < -20) this.coins.splice(i, 1);
    }
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const u = this.powerups[i]; u.x -= speed * dt; u.t += dt;
      if (mag) { const dx = p.x - u.x, dy = p.y - u.y, d = Math.hypot(dx, dy) || 1; if (d < 130) { u.x += dx / d * 420 * dt; u.y += dy / d * 420 * dt; } }
      if (Math.hypot(p.x - u.x, p.y - u.y) < P_R + 16) { this.powerups.splice(i, 1); Game.onPowerup(u.type, u.x, u.y); continue; }
      if (u.x < -30) this.powerups.splice(i, 1);
    }
  }
  draw(ctx, t) {
    for (const c of this.coins) {
      const s = 1 + Math.sin(t * 5 + c.x * 0.05) * 0.15;
      ctx.save(); ctx.translate(c.x, c.y); ctx.scale(s, s);
      ctx.fillStyle = '#ffe873'; ctx.shadowColor = '#ffe873'; ctx.shadowBlur = 12;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * TAU / 5; const a2 = a + TAU / 10; ctx.lineTo(Math.cos(a) * 9, Math.sin(a) * 9); ctx.lineTo(Math.cos(a2) * 4, Math.sin(a2) * 4); }
      ctx.closePath(); ctx.fill(); ctx.restore();
    }
    for (const u of this.powerups) {
      ctx.save(); ctx.translate(u.x, u.y + Math.sin(u.t * 3) * 6);
      const col = u.type === 'shield' ? '#7df9ff' : u.type === 'slow' ? '#b26bff' : u.type === 'magnet' ? '#ffe873' : '#ff3fd4';
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 16; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(0, 0, 14, 0, TAU); ctx.stroke();
      ctx.font = '16px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(u.type === 'shield' ? '🛡' : u.type === 'slow' ? '⏳' : u.type === 'magnet' ? '🧲' : '×2', 0, 1);
      ctx.restore();
    }
  }
}

/* ---------------- Canvas / sizing ---------------- */
const canvas = $('game'), ctx = canvas.getContext('2d');
let VW = 0, VH = 0, SCALE = 1, WW = 0, WH = 800, GROUND_H = 84;
function W() { return WW; }
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  VW = window.innerWidth; VH = window.innerHeight;
  canvas.width = VW * dpr; canvas.height = VH * dpr;
  WH = 800;
  WW = clamp(WH * (VW / VH), 420, 1100);
  SCALE = VH / WH;
  ctx.setTransform(dpr * SCALE, 0, 0, dpr * SCALE, (VW * dpr - WW * SCALE * dpr) / 2, 0);
  // center horizontally: offsetX
  ctx.setTransform(dpr * SCALE, 0, 0, dpr * SCALE, dpr * (VW - WW * SCALE) / 2, 0);
  if (Game.bg) Game.bg.build(WW, WH);
}
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', () => setTimeout(resize, 200));

/* ---------------- Game state ---------------- */
const Game = {
  state: 'loading', score: 0, coins: 0, combo: 0, comboTimer: 0, mult: 1,
  speed: 210, timeScale: 1, targetScale: 1, shake: 0, flash: 0, t: 0,
  player: new Player(), obs: new Obstacles(), picks: new Pickups(), parts: new Particles(), bg: null,
  spawnT: 0, trailT: 0, overT: 0, hoverY: 0,

  init() {
    this.bg = new Background();
    this.parts.setQuality();
    resize();
  },
  start() {
    this.state = 'ready';
    this.score = 0; this.coins = 0; this.combo = 0; this.mult = 1; this.comboTimer = 0;
    this.speed = 210; this.timeScale = 1; this.targetScale = 1; this.t = 0; this.spawnT = 0;
    this.player.reset(); this.player.x = WW * 0.3; this.player.y = WH * 0.45;
    this.obs.reset(); this.picks.reset(); this.parts.active.length = 0;
    if (!Storage.data.seenTutorial) UI.showTutorial();
    HUD.update();
  },
  flap() {
    Audio.init(); Audio.resume();
    if (this.state === 'ready') { this.state = 'playing'; this.player.flap(); UI.hideTutorial(); Storage.data.seenTutorial = true; Storage.save(); }
    else if (this.state === 'playing') { this.player.flap(); this.trailBurst(); }
  },
  trailBurst() { this.parts.spawn(this.player.x - 14, this.player.y + 4, { n: 6, color: SKINS[Storage.data.skin].color, speed: 90, life: 0.7, size: 4, grav: 0 }); },
  onCoin(x, y) { this.coins++; Storage.data.totalCoins++; Audio.coin(); this.parts.burst(x, y, '#ffe873', 10); HUD.update(); },
  onPowerup(type, x, y) {
    Audio.power(); this.parts.burst(x, y, '#7df9ff', 16);
    const p = this.player;
    if (type === 'shield') p.shield = 999;
    if (type === 'slow') { p.slow = 6; this.targetScale = 0.45; }
    if (type === 'magnet') p.magnet = 8;
    if (type === 'double') p.double = 8;
  },
  hitObstacle(o) {
    if (this.player.shield > 0) {
      this.player.shield = 0;
      this.parts.burst(this.player.x, this.player.y, '#7df9ff', 22);
      this.flash = 0.35; this.shake = 6; Audio.power();
      // destroy the obstacle
      const i = this.obs.list.indexOf(o); if (i >= 0) this.obs.list.splice(i, 1);
      return;
    }
    this.die();
  },
  die() {
    if (this.state !== 'playing') return;
    this.state = 'over'; this.player.alive = false; this.overT = 0;
    Audio.hit(); this.parts.burst(this.player.x, this.player.y, SKINS[Storage.data.skin].color, 34);
    this.flash = 0.7; this.shake = 16;
    if (Storage.data.settings.vibrate && navigator.vibrate) navigator.vibrate(200);
    // persist
    const isBest = this.score > Storage.data.best;
    if (isBest) Storage.data.best = this.score;
    Storage.data.scores.unshift({ score: this.score, coins: this.coins, date: new Date().toISOString().slice(0, 10), skin: Storage.data.skin });
    Storage.data.scores = Storage.data.scores.slice(0, 10);
    // unlock skins
    for (let i = 0; i < SKINS.length; i++) if (SKINS[i].unlock(Storage.data) && !Storage.data.unlocked.includes(i)) Storage.data.unlocked.push(i);
    this.targetScale = 1; this.timeScale = 1; this.player.slow = 0;
    Storage.save();
    const wasBest = isBest;
    setTimeout(() => { if (this.state === 'over') UI.showGameOver(wasBest); }, 900);
  },
  update(dt) {
    this.t += dt;
    this.timeScale = lerp(this.timeScale, this.targetScale, dt * 4);
    if (this.player.slow <= 0) this.targetScale = 1;
    const sdt = dt * this.timeScale;
    if (this.state !== 'paused') this.bg.update(sdt, WW, WH, this.speed);
    this.shake = Math.max(0, this.shake - dt * 30);
    this.flash = Math.max(0, this.flash - dt * 2.2);

    if (this.state === 'ready') {
      this.hoverY = Math.sin(this.t * 3) * 10;
      this.player.y = WH * 0.45 + this.hoverY;
      this.player.rot = Math.sin(this.t * 3) * 0.1;
      return;
    }
    if (this.state === 'over') {
      this.overT += dt;
      this.player.vy = Math.min(this.player.vy + GRAV * sdt, 900);
      this.player.y += this.player.vy * sdt;
      this.player.rot = Math.min(this.player.rot + dt * 4, 1.5);
      this.parts.update(sdt);
      return;
    }
    if (this.state !== 'playing') return;

    // difficulty ramp
    this.speed = Math.min(210 + this.score * 7, 430);
    this.player.update(sdt, WH - GROUND_H);
    this.player.x = WW * 0.3;
    this.obs.maybeSpawn(this.score, WH, WH - GROUND_H, this.speed);
    this.obs.update(sdt, this.speed, WH, WH - GROUND_H);
    if (this.picks.coins.length === 0 || Math.random() < 0.01) this.picks.maybeSpawn(this.score, WH, WH - GROUND_H);
    this.picks.update(sdt, this.speed, this.player);
    this.parts.update(sdt);
    // trail
    this.trailT -= dt;
    if (this.trailT <= 0 && !Storage.data.settings.reduced) {
      this.parts.spawn(this.player.x - 12, this.player.y + 2, { n: 2, color: SKINS[Storage.data.skin].color, speed: 40, life: 0.6, size: 3.5, grav: 0 });
      this.trailT = 0.03;
    }
    // scoring
    for (const o of this.obs.list) {
      if (!o.passed && o.x + o.w / 2 < this.player.x) {
        o.passed = true;
        this.combo++; this.comboTimer = 3;
        this.mult = this.player.double > 0 ? 2 : Math.min(1 + Math.floor(this.combo / 4), 5);
        const pts = this.mult;
        this.score += pts;
        Audio.score(); HUD.update();
        this.parts.spawn(this.player.x + 20, this.player.y, { n: 8, color: '#7df9ff', speed: 120, life: 0.6, size: 4, grav: 0 });
        if (Storage.data.settings.vibrate && navigator.vibrate) navigator.vibrate(12);
      }
    }
    this.comboTimer -= dt;
    if (this.comboTimer <= 0) { this.combo = 0; this.mult = this.player.double > 0 ? 2 : 1; HUD.update(); }
    // collisions
    const hit = this.obs.collides(this.player);
    if (hit) this.hitObstacle(hit);
    if (this.player.y > WH - GROUND_H - P_R || this.player.y < -30) this.die();
  },
  draw() {
    const reduced = Storage.data.settings.reduced;
    ctx.save();
    if (this.shake > 0 && !reduced) ctx.translate(rand(-this.shake, this.shake) * 0.5, rand(-this.shake, this.shake) * 0.5);
    this.bg.draw(ctx, WW, WH, WH - GROUND_H);
    this.obs.draw(ctx, this.t);
    this.picks.draw(ctx, this.t);
    if (this.state !== 'menu' && this.state !== 'loading') this.player.draw(ctx, this.t);
    this.parts.draw(ctx);
    // ground
    ctx.fillStyle = '#0a0d26'; ctx.fillRect(-50, WH - GROUND_H, WW + 100, GROUND_H + 50);
    ctx.strokeStyle = '#19e6ff66'; ctx.shadowColor = '#19e6ff'; ctx.shadowBlur = 10; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-50, WH - GROUND_H); ctx.lineTo(WW + 50, WH - GROUND_H); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();
    if (this.flash > 0) { ctx.fillStyle = `rgba(255,80,140,${this.flash * 0.55})`; ctx.fillRect(-100, -100, WW + 200, WH + 200); }
    // letterbox sides
    ctx.fillStyle = '#05060f';
    const sideW = (VW - WW * SCALE) / 2 / SCALE;
    // (canvas is scaled; draw bars in device space via reset)
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const dprX = canvas.width, sidePx = (canvas.width - WW * SCALE * (canvas.width / VW)) / 2;
    ctx.fillRect(0, 0, sidePx, canvas.height);
    ctx.fillRect(canvas.width - sidePx, 0, sidePx, canvas.height);
    ctx.restore();
  },
  loop(now) {
    const dt = Math.min((now - (this._last || now)) / 1000, 0.05);
    this._last = now;
    this.update(dt);
    this.draw();
    requestAnimationFrame(this.loop.bind(this));
  },
};

/* ---------------- HUD ---------------- */
const HUD = {
  el: { score: $('hud-score'), coins: $('hud-coins'), combo: $('hud-combo'), powerups: $('hud-powerups') },
  update() {
    this.el.score.textContent = Game.score;
    this.el.coins.textContent = '◈ ' + Storage.data.totalCoins;
    if (Game.mult > 1) { this.el.combo.textContent = 'x' + Game.mult; this.el.combo.classList.remove('hidden'); }
    else this.el.combo.classList.add('hidden');
  },
  tickPowerups() {
    const p = Game.player, tags = [];
    if (p.shield) tags.push('🛡');
    if (p.slow > 0) tags.push(`⏳ ${p.slow.toFixed(1)}`);
    if (p.magnet > 0) tags.push(`🧲 ${p.magnet.toFixed(1)}`);
    if (p.double > 0) tags.push(`×2 ${p.double.toFixed(1)}`);
    this.el.powerups.innerHTML = tags.map(t => `<span class="pu">${t}</span>`).join('');
  },
};

/* ---------------- UI wiring ---------------- */
const UI = {
  screens: ['loading', 'menu', 'skins', 'settings', 'tutorial', 'pause', 'over'],
  show(id) { this.screens.forEach(s => $('screen-' + s).classList.toggle('hidden', s !== id)); $('hud').classList.toggle('hidden', id !== null); },
  hideAll() { this.screens.forEach(s => $('screen-' + s).classList.add('hidden')); $('hud').classList.remove('hidden'); },
  showTutorial() { $('screen-tutorial').classList.remove('hidden'); },
  hideTutorial() { $('screen-tutorial').classList.add('hidden'); },
  showGameOver(isBest) {
    $('over-score').textContent = Game.score;
    $('over-best').textContent = Storage.data.best;
    $('over-coins').textContent = Game.coins;
    $('newbest').classList.toggle('hidden', !isBest);
    this.show('over');
  },
  refreshMenu() {
    $('menu-best').textContent = Storage.data.best;
    $('menu-coins').textContent = Storage.data.totalCoins;
  },
  buildSkins() {
    const grid = $('skin-grid'); grid.innerHTML = '';
    SKINS.forEach((s, i) => {
      const unlocked = Storage.data.unlocked.includes(i);
      const card = document.createElement('div');
      card.className = 'skin-card' + (unlocked ? '' : ' locked') + (Storage.data.skin === i ? ' selected' : '');
      const c = document.createElement('canvas'); c.width = 144; c.height = 112;
      const cc = c.getContext('2d'); cc.scale(2, 2); cc.translate(36, 28);
      const tmp = new Player(); const sw = SKINS[i];
      // mini preview using the same shapes via a temp skin override
      cc.strokeStyle = sw.color; cc.fillStyle = sw.color; cc.shadowColor = sw.color; cc.shadowBlur = 14; cc.lineWidth = 2.4;
      cc.beginPath(); cc.ellipse(0, 0, 16, 10, 0, 0, TAU); cc.stroke();
      cc.beginPath(); cc.moveTo(-4, 0); cc.lineTo(-18, -8); cc.lineTo(-6, 4); cc.closePath(); cc.fill();
      tmp.x = 0; tmp.y = 0;
      card.appendChild(c);
      card.insertAdjacentHTML('beforeend', `<small>${s.name}${unlocked ? '' : '<br>🔒 ' + s.req}</small>`);
      card.onclick = () => {
        if (Storage.data.unlocked.includes(i)) { Storage.data.skin = i; Storage.save(); Audio.ui(); this.buildSkins(); }
        else Audio.ui();
      };
      grid.appendChild(card);
    });
  },
};

function bindUI() {
  const play = () => { Audio.init(); Audio.resume(); Audio.ui(); UI.hideAll(); Game.start(); };
  $('btn-play').onclick = play;
  $('btn-restart').onclick = () => { Audio.ui(); UI.hideAll(); Game.start(); };
  $('btn-menu').onclick = () => { Audio.ui(); UI.show('menu'); UI.refreshMenu(); Game.state = 'menu'; };
  $('btn-skins').onclick = () => { Audio.ui(); UI.buildSkins(); UI.show('skins'); };
  $('btn-skins-back').onclick = () => { Audio.ui(); UI.show('menu'); };
  $('btn-settings').onclick = () => { Audio.ui(); UI.show('settings'); };
  $('btn-settings-back').onclick = () => { Audio.ui(); UI.show('menu'); };
  $('btn-resume').onclick = () => { Audio.ui(); UI.hideAll(); Game.state = 'playing'; };
  $('btn-quit').onclick = () => { Audio.ui(); UI.show('menu'); UI.refreshMenu(); Game.state = 'menu'; };
  $('btn-pause').onclick = () => { if (Game.state === 'playing' || Game.state === 'ready') { Game.state = 'paused'; UI.show('pause'); } };
  $('btn-mute').onclick = () => { const m = !Audio.muted; Audio.setMuted(m); $('btn-mute').textContent = m ? '✕' : '♪'; };
  $('btn-share').onclick = async () => {
    const text = `I scored ${Game.score} on Night Flyer! 🌙 Can you beat me?`;
    try { await navigator.share({ title: 'Night Flyer', text }); }
    catch { try { await navigator.clipboard.writeText(text); alert('Copied to clipboard!'); } catch {} }
  };
  // settings
  $('set-sound').checked = Storage.data.settings.sound;
  $('set-volume').value = Math.round(Storage.data.settings.volume * 100);
  $('set-particles').value = Storage.data.settings.particles;
  $('set-vibrate').checked = Storage.data.settings.vibrate;
  $('set-reduced').checked = Storage.data.settings.reduced;
  $('set-sound').onchange = e => { Storage.data.settings.sound = e.target.checked; Audio.setMuted(!e.target.checked); Storage.save(); };
  $('set-volume').oninput = e => { Storage.data.settings.volume = e.target.value / 100; Audio.setVolume(Storage.data.settings.volume); Storage.save(); };
  $('set-particles').onchange = e => { Storage.data.settings.particles = e.target.value; Game.parts.setQuality(); Storage.save(); };
  $('set-vibrate').onchange = e => { Storage.data.settings.vibrate = e.target.checked; Storage.save(); };
  $('set-reduced').onchange = e => { Storage.data.settings.reduced = e.target.checked; Storage.save(); };
  // input
  const flap = e => { e.preventDefault(); if (Game.state === 'playing' || Game.state === 'ready') Game.flap(); };
  canvas.addEventListener('pointerdown', flap);
  $('screen-tutorial').addEventListener('pointerdown', flap);
  window.addEventListener('keydown', e => {
    if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); if (Game.state === 'playing' || Game.state === 'ready') Game.flap(); }
    if (e.code === 'Escape') {
      if (Game.state === 'playing' || Game.state === 'ready') { Game.state = 'paused'; UI.show('pause'); }
      else if (Game.state === 'paused') { UI.hideAll(); Game.state = 'playing'; }
    }
    if (e.code === 'Enter' && Game.state === 'menu') play();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && Game.state === 'playing') { Game.state = 'paused'; UI.show('pause'); } });
}

/* ---------------- Boot / loading ---------------- */
Storage.load();
Game.init();
bindUI();
UI.buildSkins();
UI.refreshMenu();
Game.state = 'menu';
requestAnimationFrame(Game.loop.bind(Game));

// fake-but-smooth loading progress
let lp = 0;
const lt = setInterval(() => {
  lp += rand(8, 22);
  if (lp >= 100) { lp = 100; clearInterval(lt); UI.show('menu'); Game.state = 'menu'; }
  $('loadfill').style.width = lp + '%';
}, 140);

// HUD powerup ticker
setInterval(() => { if (Game.state === 'playing') HUD.tickPowerups(); }, 120);

// PWA stub
if ('serviceWorker' in navigator) { navigator.serviceWorker.register('sw.js').catch(() => {}); }
})();

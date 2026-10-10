// OLPW:js/memory.js | script for memory
/* ============================================================
   ARCANUM — Memory of the Spheres
   A celestial memory-matching game
   ============================================================ */

// Sigils used as card faces (celestial / alchemical glyphs)
const SYMBOLS = ['☉','☽','★','✦','♄','♃','♂','♀','☿','♆','♅','⚸','⚹','✧','☄','❋','⚛','◊'];

const DIFFICULTIES = {
  apprentice: { cols: 4, rows: 4, pairs: 8,  maxWidth: 480, title: 'Apprentice Complete' },
  adept:      { cols: 6, rows: 4, pairs: 12, maxWidth: 660, title: 'Adept Ascended' },
  master:     { cols: 6, rows: 6, pairs: 18, maxWidth: 720, title: 'Master of the Arcane' },
};

const STATE = {
  difficulty: 'apprentice',
  cards: [],
  flippedCards: [],
  matchedCount: 0,
  moves: 0,
  streak: 0,
  maxStreak: 0,
  startTime: null,
  elapsedTime: 0,
  timerInterval: null,
  locked: true,
  gameStarted: false,
  gameComplete: false,
};

/* ============================================================
   AUDIO ENGINE — Web Audio API, fully synthesized
   ============================================================ */
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.musicPlaying = false;
    this.musicLayers = [];
    this.arpeggioTimeout = null;
    this.reverbNode = null;
  }

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.75;
    this.masterGain.connect(this.ctx.destination);

    // Simple reverb-like effect using delay + feedback
    this.reverbNode = this.ctx.createDelay(1.0);
    this.reverbNode.delayTime.value = 0.18;
    const feedback = this.ctx.createGain();
    feedback.gain.value = 0.32;
    const reverbWet = this.ctx.createGain();
    reverbWet.gain.value = 0.35;
    this.reverbNode.connect(feedback);
    feedback.connect(this.reverbNode);
    this.reverbNode.connect(reverbWet);
    reverbWet.connect(this.masterGain);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.42;
    this.musicGain.connect(this.masterGain);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.85;
    this.sfxGain.connect(this.masterGain);
    this.sfxGain.connect(this.reverbNode);
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  // Bell-like chime for a successful match
  playChime(baseFreq = 523.25) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const harmonics = [
      { f: baseFreq,       type: 'sine',     g: 0.32, d: 1.8 },
      { f: baseFreq * 1.5, type: 'sine',     g: 0.18, d: 1.4 },
      { f: baseFreq * 2,   type: 'triangle', g: 0.12, d: 1.0 },
      { f: baseFreq * 3,   type: 'sine',     g: 0.06, d: 0.6 },
    ];
    harmonics.forEach(h => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = h.type;
      osc.frequency.value = h.f;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(h.g, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + h.d);
      osc.connect(gain).connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + h.d + 0.05);
    });
  }

  // Descending dissonant tone for a miss
  playMiss() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.55);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(242, now);
    osc2.frequency.exponentialRampToValueAtTime(88, now + 0.55);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.55);
    filter.Q.value = 4;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain).connect(this.sfxGain);
    osc.start(now); osc2.start(now);
    osc.stop(now + 0.7); osc2.stop(now + 0.7);
  }

  // Quick soft click on flip
  playFlip() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.08);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    osc.connect(gain).connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Ascending arpeggio + sparkles for streak fanfare
  playStreakFanfare(streakCount) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Pitch climbs with streak (cap at +7 semitones)
    const semitones = Math.min(Math.max(streakCount - 2, 0), 7);
    const baseFreq = 392 * Math.pow(2, semitones / 12); // G4 base
    const scale = [1, 1.25, 1.5, 2, 2.5, 3];
    const notes = scale.map(s => baseFreq * s);

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const start = now + i * 0.06;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.22, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.7);
      osc.connect(gain).connect(this.sfxGain);
      osc.start(start);
      osc.stop(start + 0.75);
    });

    // High sparkles
    setTimeout(() => {
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      for (let i = 0; i < 6; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 2200 + Math.random() * 2500;
        const start = t + i * 0.035;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.07, start + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
        osc.connect(gain).connect(this.sfxGain);
        osc.start(start);
        osc.stop(start + 0.2);
      }
    }, 180);
  }

  // Triumphant chord sweep on game completion
  playCompletion() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // I - V - vi - IV in C major, layered
    const progression = [
      { root: 261.63, third: 329.63, fifth: 392.0,  oct: 523.25 }, // C
      { root: 392.0,  third: 493.88, fifth: 587.33, oct: 783.99 }, // G
      { root: 220.0,  third: 261.63, fifth: 329.63, oct: 440.0  }, // Am
      { root: 349.23, third: 440.0,  fifth: 523.25, oct: 698.46 }, // F
      { root: 523.25, third: 659.25, fifth: 783.99, oct: 1046.5 }, // C oct up
    ];
    progression.forEach((chord, idx) => {
      const start = now + idx * 0.32;
      [chord.root, chord.third, chord.fifth, chord.oct].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = i === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.value = freq;
        const peak = 0.12 / (i + 1);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(peak, start + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.4);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 2200;
        osc.connect(filter).connect(gain).connect(this.sfxGain);
        osc.start(start);
        osc.stop(start + 1.45);
      });
    });
  }

  // Layered ambient background music
  startMusic() {
    if (!this.ctx || this.musicPlaying) return;
    this.musicPlaying = true;
    const ctx = this.ctx;

    // LAYER 1: Deep drone — C2 + G2 sine
    const drone1 = ctx.createOscillator();
    const drone2 = ctx.createOscillator();
    const droneGain = ctx.createGain();
    drone1.type = 'sine'; drone1.frequency.value = 65.41;
    drone2.type = 'sine'; drone2.frequency.value = 98.0;
    droneGain.gain.value = 0.11;
    drone1.connect(droneGain); drone2.connect(droneGain);
    droneGain.connect(this.musicGain);
    drone1.start(); drone2.start();

    // LAYER 2: Pad — sawtooth through filter with slow LFO
    const pad = ctx.createOscillator();
    const padGain = ctx.createGain();
    const padFilter = ctx.createBiquadFilter();
    const padLfo = ctx.createOscillator();
    const padLfoGain = ctx.createGain();
    pad.type = 'sawtooth'; pad.frequency.value = 261.63;
    padFilter.type = 'lowpass'; padFilter.frequency.value = 600; padFilter.Q.value = 3;
    padGain.gain.value = 0.05;
    padLfo.frequency.value = 0.13;
    padLfoGain.gain.value = 4;
    padLfo.connect(padLfoGain).connect(pad.frequency);
    pad.connect(padFilter).connect(padGain).connect(this.musicGain);
    pad.start(); padLfo.start();

    // LAYER 3: High shimmer — sine with tremolo
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    const shimmerLfo = ctx.createOscillator();
    const shimmerLfoGain = ctx.createGain();
    shimmer.type = 'sine'; shimmer.frequency.value = 1046.5;
    shimmerGain.gain.value = 0.015;
    shimmerLfo.type = 'sine'; shimmerLfo.frequency.value = 0.27;
    shimmerLfoGain.gain.value = 0.012;
    shimmerLfo.connect(shimmerLfoGain).connect(shimmerGain.gain);
    shimmer.connect(shimmerGain).connect(this.musicGain);
    shimmer.start(); shimmerLfo.start();

    this.musicLayers = [drone1, drone2, pad, padLfo, shimmer, shimmerLfo];

    // LAYER 4: Random arpeggios from C major pentatonic
    this._scheduleArpeggio();
  }

  _scheduleArpeggio() {
    if (!this.musicPlaying || !this.ctx) return;
    const notes = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
    const note = notes[Math.floor(Math.random() * notes.length)];
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = note;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.045, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);
    osc.connect(gain).connect(this.musicGain);
    osc.start(now);
    osc.stop(now + 2.85);

    this.arpeggioTimeout = setTimeout(() => this._scheduleArpeggio(), 2400 + Math.random() * 2800);
  }

  stopMusic() {
    if (!this.musicPlaying) return;
    this.musicPlaying = false;
    clearTimeout(this.arpeggioTimeout);
    this.musicLayers.forEach(osc => { try { osc.stop(); } catch(e){} });
    this.musicLayers = [];
  }
}
const audio = new AudioEngine();

/* ============================================================
   STARFIELD — twinkling background canvas
   ============================================================ */
function initStarfield() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.floor((w * h) / 7000);
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.3,
        baseAlpha: Math.random() * 0.5 + 0.25,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.6 + 0.2,
        hue: Math.random() < 0.15 ? 'gold' : 'cream',
      });
    }
  }
  window.addEventListener('resize', resize);
  resize();

  let t = 0;
  function animate() {
    ctx.clearRect(0, 0, w, h);
    t += 0.016;
    stars.forEach(s => {
      const alpha = Math.max(0, s.baseAlpha + Math.sin(t * s.speed + s.phase) * 0.4);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.hue === 'gold'
        ? `rgba(244, 210, 122, ${alpha})`
        : `rgba(245, 230, 211, ${alpha})`;
      ctx.fill();
      if (s.r > 1) {
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
        const color = s.hue === 'gold'
          ? `rgba(232, 182, 90, ${alpha * 0.35})`
          : `rgba(245, 230, 211, ${alpha * 0.25})`;
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ============================================================
   GAME LOGIC
   ============================================================ */
function initGame() {
  const diff = DIFFICULTIES[STATE.difficulty];
  const symbols = SYMBOLS.slice(0, diff.pairs);

  // Build paired deck
  let cards = [];
  symbols.forEach((sym, idx) => {
    cards.push({ id: idx * 2,     symbol: sym, matched: false });
    cards.push({ id: idx * 2 + 1, symbol: sym, matched: false });
  });

  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  STATE.cards = cards;
  STATE.flippedCards = [];
  STATE.matchedCount = 0;
  STATE.moves = 0;
  STATE.streak = 0;
  STATE.maxStreak = 0;
  STATE.elapsedTime = 0;
  STATE.locked = true;
  STATE.gameStarted = false;
  STATE.gameComplete = false;

  if (STATE.timerInterval) {
    clearInterval(STATE.timerInterval);
    STATE.timerInterval = null;
  }

  renderBoard();
  updateStats();

  // Brief preview of all cards at start
  setTimeout(() => startPreview(), 700);
}

function renderBoard() {
  const board = document.getElementById('board');
  const diff = DIFFICULTIES[STATE.difficulty];
  board.style.gridTemplateColumns = `repeat(${diff.cols}, minmax(0, 1fr))`;
  board.style.maxWidth = `${diff.maxWidth}px`;

  board.innerHTML = '';

  STATE.cards.forEach((card, idx) => {
    const el = document.createElement('div');
    el.className = 'card dealing';
    el.dataset.index = idx;
    el.setAttribute('role', 'gridcell');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', `Card ${idx + 1}`);
    el.style.animationDelay = `${idx * 0.035}s`;

    el.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back">
          <svg class="card-back-seal" viewBox="0 0 60 60" aria-hidden="true">
            <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(232,182,90,0.55)" stroke-width="0.6"/>
            <circle cx="30" cy="30" r="18" fill="none" stroke="rgba(232,182,90,0.4)" stroke-width="0.4"/>
            <circle cx="30" cy="30" r="12" fill="none" stroke="rgba(232,182,90,0.3)" stroke-width="0.4"/>
            <path d="M30 6 L33 27 L54 30 L33 33 L30 54 L27 33 L6 30 L27 27 Z"
                  fill="rgba(232,182,90,0.45)" stroke="rgba(244,210,122,0.7)" stroke-width="0.4"/>
            <circle cx="30" cy="30" r="2.5" fill="rgba(244,210,122,0.9)"/>
            <circle cx="30" cy="6" r="1" fill="rgba(232,182,90,0.7)"/>
            <circle cx="30" cy="54" r="1" fill="rgba(232,182,90,0.7)"/>
            <circle cx="6" cy="30" r="1" fill="rgba(232,182,90,0.7)"/>
            <circle cx="54" cy="30" r="1" fill="rgba(232,182,90,0.7)"/>
          </svg>
        </div>
        <div class="card-face card-front">
          <span class="card-symbol">${card.symbol}</span>
        </div>
      </div>
    `;

    el.addEventListener('click', () => handleCardClick(idx));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCardClick(idx);
      }
    });

    board.appendChild(el);
  });
}

function startPreview() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(c => c.classList.add('flipped'));
  setTimeout(() => {
    cards.forEach(c => c.classList.remove('flipped'));
    setTimeout(() => { STATE.locked = false; }, 650);
  }, 1600);
}

function handleCardClick(idx) {
  audio.init();
  audio.resume();

  if (STATE.locked || STATE.gameComplete) return;
  if (STATE.flippedCards.includes(idx)) return;
  if (STATE.cards[idx].matched) return;

  if (!STATE.gameStarted) {
    STATE.gameStarted = true;
    startTimer();
    // Auto-start music on first interaction unless user explicitly disabled
    if (!audio.musicPlaying && !window._userDisabledMusic) {
      audio.startMusic();
      document.getElementById('musicToggle').classList.add('active');
      document.getElementById('musicLabel').textContent = 'Playing';
    }
  }

  const cardEl = document.querySelector(`.card[data-index="${idx}"]`);
  audio.playFlip();
  cardEl.classList.add('flipped');
  STATE.flippedCards.push(idx);

  if (STATE.flippedCards.length === 2) {
    STATE.locked = true;
    STATE.moves++;
    updateStats();
    setTimeout(() => checkMatch(), 720);
  }
}

function checkMatch() {
  const [a, b] = STATE.flippedCards;
  const cardA = STATE.cards[a];
  const cardB = STATE.cards[b];
  const elA = document.querySelector(`.card[data-index="${a}"]`);
  const elB = document.querySelector(`.card[data-index="${b}"]`);

  if (cardA.symbol === cardB.symbol) {
    // MATCH
    cardA.matched = true;
    cardB.matched = true;
    STATE.matchedCount++;
    STATE.streak++;
    STATE.maxStreak = Math.max(STATE.maxStreak, STATE.streak);

    // Chime pitch rises slightly with each match
    const baseFreq = 523.25 * Math.pow(2, Math.min(STATE.matchedCount - 1, 8) / 12);
    audio.playChime(baseFreq);

    if (STATE.streak >= 3) {
      setTimeout(() => {
        audio.playStreakFanfare(STATE.streak);
        triggerStreakEffect(STATE.streak);
      }, 180);
    }

    // Float-fade after a brief beat
    setTimeout(() => {
      elA.classList.add('matched');
      elB.classList.add('matched');
      burstParticles(elA, 'gold');
      burstParticles(elB, 'gold');
    }, 320);

    STATE.flippedCards = [];
    STATE.locked = false;
    updateStats();

    if (STATE.matchedCount === DIFFICULTIES[STATE.difficulty].pairs) {
      setTimeout(() => completeGame(), 1100);
    }
  } else {
    // MISS
    STATE.streak = 0;
    audio.playMiss();

    elA.classList.add('miss');
    elB.classList.add('miss');

    setTimeout(() => {
      elA.classList.remove('miss', 'flipped');
      elB.classList.remove('miss', 'flipped');
      STATE.flippedCards = [];
      STATE.locked = false;
      updateStats();
    }, 680);
  }
}

/* ============================================================
   VISUAL EFFECTS
   ============================================================ */
function triggerStreakEffect(streak) {
  const streakStat = document.getElementById('streakStat');

  // Floating "STREAK ×N" text
  const text = document.createElement('div');
  text.className = 'streak-text';
  text.textContent = `STREAK ×${streak}`;
  document.body.appendChild(text);
  text.animate([
    { transform: 'translate(-50%, 20px) scale(0.4)', opacity: 0 },
    { transform: 'translate(-50%, -20px) scale(1.15)', opacity: 1, offset: 0.25 },
    { transform: 'translate(-50%, -60px) scale(1)', opacity: 1, offset: 0.65 },
    { transform: 'translate(-50%, -120px) scale(0.9)', opacity: 0 }
  ], { duration: 1700, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' })
  .onfinish = () => text.remove();

  // Golden particle burst from streak stat
  const rect = streakStat.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 3 + Math.random() * 6;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${cx - size/2}px`;
    p.style.top = `${cy - size/2}px`;
    const hue = 30 + Math.random() * 30;
    p.style.background = `hsl(${hue}, 90%, 65%)`;
    p.style.boxShadow = `0 0 12px hsl(${hue}, 90%, 65%)`;
    document.body.appendChild(p);

    const angle = Math.random() * Math.PI * 2;
    const speed = 70 + Math.random() * 130;
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed - 40;

    p.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0 }
    ], { duration: 900 + Math.random() * 500, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' })
    .onfinish = () => p.remove();
  }

  // Subtle screen-edge glow
  const flash = document.createElement('div');
  flash.style.cssText = `
    position: fixed; inset: 0; pointer-events: none; z-index: 30;
    background: radial-gradient(circle at center, transparent 50%, rgba(255,154,139,0.18) 100%);
    opacity: 0;
  `;
  document.body.appendChild(flash);
  flash.animate([
    { opacity: 0 }, { opacity: 1 }, { opacity: 0 }
  ], { duration: 600, easing: 'ease-out' }).onfinish = () => flash.remove();
}

function burstParticles(cardEl, kind = 'gold') {
  const rect = cardEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const count = 22;
  const baseHue = kind === 'gold' ? 40 : 0;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 3 + Math.random() * 6;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${cx - size/2}px`;
    p.style.top = `${cy - size/2}px`;
    const hue = baseHue + (Math.random() - 0.5) * 30;
    const sat = kind === 'gold' ? 90 : 80;
    const light = 60 + Math.random() * 15;
    p.style.background = `hsl(${hue}, ${sat}%, ${light}%)`;
    p.style.boxShadow = `0 0 12px hsl(${hue}, ${sat}%, ${light}%)`;
    document.body.appendChild(p);

    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
    const speed = 70 + Math.random() * 110;
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed - 50;

    p.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0 }
    ], { duration: 950 + Math.random() * 400, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' })
    .onfinish = () => p.remove();
  }
}

/* ============================================================
   TIMER & STATS
   ============================================================ */
function startTimer() {
  STATE.startTime = Date.now();
  STATE.timerInterval = setInterval(() => {
    STATE.elapsedTime = Math.floor((Date.now() - STATE.startTime) / 1000);
    updateStats();
  }, 250);
}

function updateStats() {
  document.getElementById('streakVal').textContent = STATE.streak;
  document.getElementById('movesVal').textContent = STATE.moves;
  const diff = DIFFICULTIES[STATE.difficulty];
  document.getElementById('pairsVal').textContent = `${STATE.matchedCount}/${diff.pairs}`;

  const mins = Math.floor(STATE.elapsedTime / 60);
  const secs = STATE.elapsedTime % 60;
  document.getElementById('timeVal').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

  const streakStat = document.getElementById('streakStat');
  if (STATE.streak >= 3) streakStat.classList.add('streak-active');
  else streakStat.classList.remove('streak-active');
}

/* ============================================================
   GAME COMPLETION
   ============================================================ */
function completeGame() {
  STATE.gameComplete = true;
  clearInterval(STATE.timerInterval);

  audio.playCompletion();

  // Calculate star rating
  const diff = DIFFICULTIES[STATE.difficulty];
  const minMoves = diff.pairs;
  const ratio = STATE.moves / minMoves;
  let stars = 1;
  if (ratio <= 1.6) stars = 3;
  else if (ratio <= 2.3) stars = 2;

  // Update modal content
  document.getElementById('modalTitle').textContent = diff.title;
  document.getElementById('finalMoves').textContent = STATE.moves;
  const mins = Math.floor(STATE.elapsedTime / 60);
  const secs = STATE.elapsedTime % 60;
  document.getElementById('finalTime').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
  document.getElementById('finalStreak').textContent = STATE.maxStreak;

  // Render stars
  const starsContainer = document.getElementById('starsContainer');
  starsContainer.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.innerHTML = `
      <svg viewBox="0 0 60 60" width="64" height="64">
        <defs>
          <linearGradient id="starGrad${i}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#fff5d6"/>
            <stop offset="0.5" stop-color="#f4d27a"/>
            <stop offset="1" stop-color="#a87a30"/>
          </linearGradient>
        </defs>
        <path d="M30 4 L37 22 L56 22 L41 33 L47 52 L30 41 L13 52 L19 33 L4 22 L23 22 Z"
              fill="url(#starGrad${i})"
              stroke="#fff5d6"
              stroke-width="1.2"/>
      </svg>
    `;
    starsContainer.appendChild(star);
    setTimeout(() => {
      if (i < stars) {
        star.classList.add('lit');
        addStarSparkles(star);
      }
    }, 700 + i * 320);
  }

  setTimeout(() => {
    document.getElementById('modalOverlay').classList.add('active');
    startConfetti();
  }, 900);
}

function addStarSparkles(starEl) {
  const rect = starEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = 3 + Math.random() * 3;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${cx - size/2}px`;
      p.style.top = `${cy - size/2}px`;
      p.style.background = '#fff5d6';
      p.style.boxShadow = '0 0 10px #f4d27a';
      document.body.appendChild(p);
      const angle = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 50;
      p.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px) scale(0)`, opacity: 0 }
      ], { duration: 800, easing: 'ease-out' }).onfinish = () => p.remove();
    }, i * 60);
  }
}

/* ============================================================
   CONFETTI — multi-burst canvas particles
   ============================================================ */
let confettiActive = false;
let confettiParticles = [];

function startConfetti() {
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  confettiActive = true;
  confettiParticles = [];

  const colors = ['#f4d27a','#e8b65a','#fff5d6','#3dd68c','#6ff0b0','#ff9a8b','#ff6b6b','#f5e6d3'];

  // Top-center burst
  for (let i = 0; i < 220; i++) {
    confettiParticles.push(makeConfetti(
      window.innerWidth / 2 + (Math.random() - 0.5) * 240,
      -20,
      (Math.random() - 0.5) * 10,
      Math.random() * 4 + 2,
      colors
    ));
  }
  // Side bursts (staggered)
  setTimeout(() => {
    if (!confettiActive) return;
    for (let i = 0; i < 80; i++) {
      confettiParticles.push(makeConfetti(
        0,
        window.innerHeight * 0.45,
        Math.random() * 8 + 3,
        -(Math.random() * 9 + 3),
        colors
      ));
      confettiParticles.push(makeConfetti(
        window.innerWidth,
        window.innerHeight * 0.45,
        -(Math.random() * 8 + 3),
        -(Math.random() * 9 + 3),
        colors
      ));
    }
  }, 450);

  // Continuous gentle rain
  let rainCount = 0;
  const rainInterval = setInterval(() => {
    if (!confettiActive || rainCount > 30) { clearInterval(rainInterval); return; }
    for (let i = 0; i < 12; i++) {
      confettiParticles.push(makeConfetti(
        Math.random() * window.innerWidth,
        -20,
        (Math.random() - 0.5) * 4,
        Math.random() * 2 + 1,
        colors
      ));
    }
    rainCount++;
  }, 400);

  animateConfetti();
}

function makeConfetti(x, y, vx, vy, colors) {
  return {
    x, y, vx, vy,
    gravity: 0.18,
    friction: 0.99,
    size: Math.random() * 8 + 5,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.35,
    shape: Math.random() < 0.4 ? 'rect' : (Math.random() < 0.7 ? 'circle' : 'star'),
    life: 1,
    flutter: Math.random() * Math.PI * 2,
    flutterSpeed: 0.05 + Math.random() * 0.05,
  };
}

function drawConfettiShape(ctx, p) {
  ctx.fillStyle = p.color;
  if (p.shape === 'rect') {
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
  } else if (p.shape === 'circle') {
    ctx.beginPath();
    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // 5-point star
    const r1 = p.size / 2;
    const r2 = r1 * 0.45;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? r1 : r2;
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }
}

function animateConfetti() {
  if (!confettiActive) return;
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confettiParticles = confettiParticles.filter(p => {
    p.vy += p.gravity;
    p.vx *= p.friction;
    p.flutter += p.flutterSpeed;
    p.x += p.vx + Math.sin(p.flutter) * 0.8;
    p.y += p.vy;
    p.rotation += p.rotationSpeed;
    p.life -= 0.004;

    if (p.y > canvas.height + 60 || p.life <= 0) return false;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
    drawConfettiShape(ctx, p);
    ctx.restore();
    return true;
  });

  if (confettiParticles.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiActive = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

/* ============================================================
   EVENT WIRING
   ============================================================ */
document.getElementById('musicToggle').addEventListener('click', (e) => {
  audio.init();
  audio.resume();
  const btn = e.currentTarget;
  const label = document.getElementById('musicLabel');
  if (audio.musicPlaying) {
    audio.stopMusic();
    btn.classList.remove('active');
    label.textContent = 'Music';
    window._userDisabledMusic = true;
  } else {
    audio.startMusic();
    btn.classList.add('active');
    label.textContent = 'Playing';
    window._userDisabledMusic = false;
  }
});

document.getElementById('resetBtn').addEventListener('click', () => {
  document.getElementById('modalOverlay').classList.remove('active');
  confettiActive = false;
  initGame();
});

document.getElementById('playAgainBtn').addEventListener('click', () => {
  document.getElementById('modalOverlay').classList.remove('active');
  confettiActive = false;
  setTimeout(() => initGame(), 300);
});

document.querySelectorAll('[data-diff]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-diff]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    STATE.difficulty = btn.dataset.diff;
    document.getElementById('modalOverlay').classList.remove('active');
    confettiActive = false;
    initGame();
  });
});

// Resize confetti canvas with window
window.addEventListener('resize', () => {
  const canvas = document.getElementById('confetti');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

/* ============================================================
   INITIALIZE
   ============================================================ */
initStarfield();
initGame();

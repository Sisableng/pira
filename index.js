// ===============================
// LENIS SMOOTH SCROLL
// ===============================
// Load Lenis from CDN via a dynamic script tag
// (function () {
//   const script = document.createElement('script');
//   script.src = 'https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js';
//   script.onload = function () {
//     const lenis = new Lenis({
//       duration: 1.2,
//       easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//       smoothWheel: true,
//       touchMultiplier: 1.5,
//     });
//     function raf(time) {
//       lenis.raf(time);
//       requestAnimationFrame(raf);
//     }
//     requestAnimationFrame(raf);
//     window.__lenis = lenis;
//   };
//   document.head.appendChild(script);
// })();

// ===============================
// CURRENT YEAR
// ===============================
const elYear = document.getElementById("cpr-year");
elYear.textContent = new Date().getFullYear();

// ===============================
// CURSOR (desktop only)
// ===============================
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');
let mx = 0, my = 0, tx = 0, ty = 0;
const isTouchDevice = window.matchMedia('(hover: none)').matches;

if (!isTouchDevice) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });
  (function animTrail() {
    tx += (mx - tx) * 0.15;
    ty += (my - ty) * 0.15;
    cursorTrail.style.left = tx + 'px';
    cursorTrail.style.top = ty + 'px';
    requestAnimationFrame(animTrail);
  })();
  document.addEventListener('mousedown', () => {
    cursor.style.width = '14px'; cursor.style.height = '14px';
  });
  document.addEventListener('mouseup', () => {
    cursor.style.width = '20px'; cursor.style.height = '20px';
  });
} else {
  cursor.style.display = 'none';
  cursorTrail.style.display = 'none';
}

// ===============================
// FLOATING PARTICLES — CSS-only, GPU composited
// No canvas, no per-frame JS loop, mobile friendly
// ===============================
const PARTICLE_EMOJIS = ['💕','✨','⭐','🌸','💫','🎀','🌟','🦋','🫧','💖'];
const PARTICLE_COUNT = isTouchDevice ? 10 : 18;
const particleContainer = document.getElementById('particles-canvas');

// Replace canvas with a plain div overlay
const pDiv = document.createElement('div');
pDiv.style.cssText = `
  position:fixed;top:0;left:0;width:100%;height:100%;
  pointer-events:none;z-index:0;overflow:hidden;
`;
particleContainer.replaceWith(pDiv);

// Inject keyframes once
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes floatUp {
    0%   { transform: translateY(0)   translateX(0)  rotate(0deg);   opacity: 0; }
    5%   { opacity: 1; }
    90%  { opacity: 0.7; }
    100% { transform: translateY(-105vh) translateX(var(--drift)) rotate(var(--spin)); opacity: 0; }
  }
  .p-particle {
    position: absolute;
    bottom: -2rem;
    will-change: transform, opacity;
    animation: floatUp var(--dur) var(--delay) ease-in infinite;
    font-size: var(--size);
    line-height: 1;
    user-select: none;
  }
`;
document.head.appendChild(styleSheet);

function makeParticle() {
  const el = document.createElement('span');
  el.className = 'p-particle';
  el.textContent = PARTICLE_EMOJIS[Math.floor(Math.random() * PARTICLE_EMOJIS.length)];
  const size = (10 + Math.random() * 18).toFixed(1);
  const dur  = (12 + Math.random() * 14).toFixed(1);       // slower = fewer repaints
  const delay = -(Math.random() * parseFloat(dur)).toFixed(1); // stagger across the cycle
  const left = (Math.random() * 100).toFixed(1);
  const drift = ((Math.random() - 0.5) * 80).toFixed(1);
  const spin  = ((Math.random() - 0.5) * 120).toFixed(0);
  el.style.cssText = `
    --dur: ${dur}s;
    --delay: ${delay}s;
    --drift: ${drift}px;
    --spin: ${spin}deg;
    --size: ${size}px;
    left: ${left}%;
    opacity: 0;
  `;
  return el;
}

for (let i = 0; i < PARTICLE_COUNT; i++) pDiv.appendChild(makeParticle());

// ===============================
// ONBOARDING & TRANSITION
// ===============================
const loadingTexts = [
  "spawning confetti particles...",
  "loading kasih sayang berlebih...",
  "compiling absurd jokes...",
  "installing birthday vibes...",
  "calibrating cringe level... 100%",
  "warming up heart.exe...",
  "memuat kenangan-kenangan lucu...",
  "siapkan mental kamu...",
  "almost there!! hampir!!"
];

function enterPortal() {
  const ob = document.getElementById('onboarding');
  const fl = document.getElementById('fake-loading');
  const audio = document.getElementById('onboarding-audio');
  ob.classList.add('fade-out');
  audio.src = '/public/faaah.mp3';
  audio.play().catch(() => {});
  setTimeout(() => {
    ob.style.display = 'none';
    fl.classList.add('active');
    animateLoading();
  }, 800);
}

function animateLoading() {
  const bar = document.getElementById('loading-bar');
  const textEl = document.getElementById('loading-text-el');
  let i = 0;
  const interval = setInterval(() => {
    if (i < loadingTexts.length) {
      textEl.textContent = loadingTexts[i++];
    } else {
      clearInterval(interval);
      finishLoading();
    }
  }, 280);
}

function finishLoading() {
  const fl = document.getElementById('fake-loading');
  const ov = document.getElementById('transition-overlay');
  const mc = document.getElementById('main-content');
  fl.style.opacity = '0';
  setTimeout(() => fl.style.display = 'none', 500);
  ov.classList.add('active');
  setTimeout(() => {
    ov.classList.remove('active');
    mc.classList.add('visible');
    launchWelcomeConfetti();
  }, 600);
}

// ===============================
// CONFETTI
// ===============================
const CONFETTI_COLORS = ['#ff69b4','#c8a0ff','#ffd700','#ff9ec8','#b0f5e8','#ffa0d0','#ffe4b5','#e0b0ff'];

function spawnConfetti(x, y, count = 40) {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.cssText = `
      left:${x + (Math.random() - 0.5) * 100}px;
      top:${y}px;
      background:${CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]};
      width:${6 + Math.random() * 10}px;
      height:${6 + Math.random() * 10}px;
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      animation-duration:${1.5 + Math.random() * 2}s;
      animation-delay:${Math.random() * 0.4}s;
    `;
    frag.appendChild(el);
  }
  document.body.appendChild(frag);
  setTimeout(() => {
    document.querySelectorAll('.confetti-piece').forEach(el => el.remove());
  }, 4000);
}

function launchWelcomeConfetti() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => spawnConfetti(
      window.innerWidth * 0.1 + Math.random() * window.innerWidth * 0.8, -10, 25
    ), i * 200);
  }
}

// ===============================
// HEART BURST
// ===============================
function spawnHearts(x, y) {
  const hearts = ['❤️','💕','💖','🩷','💗','💓'];
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 8; i++) {
    const el = document.createElement('div');
    el.className = 'heart-burst';
    const angle = (i / 8) * Math.PI * 2;
    const dist = 60 + Math.random() * 60;
    el.style.cssText = `
      left:${x}px;top:${y}px;
      --tx:${Math.cos(angle) * dist}px;
      --ty:${Math.sin(angle) * dist - 40}px;
      animation-duration:${0.8 + Math.random() * 0.4}s;
    `;
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    frag.appendChild(el);
  }
  document.body.appendChild(frag);
  setTimeout(() => document.querySelectorAll('.heart-burst').forEach(el => el.remove()), 2000);
}

function spawnFloatText(x, y, text) {
  const el = document.createElement('div');
  el.className = 'float-text';
  const rot = (Math.random() - 0.5) * 20;
  el.style.cssText = `
    left:${x - 60}px;top:${y}px;
    --rot:${rot}deg;
    --rot2:${rot + (Math.random() - 0.5) * 15}deg;
  `;
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2500);
}

// ===============================
// POPUP QUOTES
// ===============================
const QUOTES = {
  sad: [
    { e: '🫂', t: 'hey... kamu boleh sedih. tapi inget ya, kamu udah sejauh ini... ceritamu bakal lebih hebat dari sebelumnya. jangan lupa minum air.' },
    { e: '💌', t: 'kalau lagi down, inget: ada orang yang genuinely happy kamu exists di dunia ini. suirr ✌️' },
    { e: '🌸', t: 'sedih itu valid. tapi kamu juga valid. dan kamu worth it untuk bahagia. even kalau sekarang belum kerasa.' },
    { e: '☁️', t: 'hey... kamu ga harus baik baik aja. kamu ngga sendirian juga kok:)' },
  ],
  danger: [
    { e: '🚨', t: 'UDAH W BILANG JANGAN DI PENCET!! AKOWAKOWKOAWK.' },
  ],
  happiness: [
    { e: '⚡', t: 'EMERGENCY HAPPINESS ACTIVATED!! dosis harian: kamu itu lucu, kamu itu baik, dan kamu tuh ngangenin banget.' },
    { e: '✨', t: 'INJECTING: serotonin buatan manusia yang genuinely peduli sama kamu. check. moodboost terkirim.' },
    { e: '🌈', t: 'happiness protocol launched! kamu allowed to be happy today. dan besok. dan tiap hari sebenernya.' },
    { e: '🎆', t: 'FIREWORKS FOR YOU!! karena kamu layak dapat fireworks. no reason needed. kamu aja udah cukup.' },
  ],
  bday: [
    { e: '🎂', t: 'Selamat ulang tahun ke-24, Syafira Yudhanti Cahya Utami!! semoga tahun ini penuh hal-hal baik yang kamu deserving.' },
    { e: '🎉', t: 'Happy birthday Syafari!! semoga umur panjang, sehat, dan semakin tau betapa berartinyamu buat orang-orang di sekitar kamu.' },
    { e: '🩷', t: '28 Mei 2001 → hari yang cukup iconic buat dunia ini. karena dari situ ada kamu. dan itu literally wonderful.' },
    { e: '🌟', t: 'Level 24 loaded. stats: +wisdom, +pengalaman, +aura. semoga questline hidup kamu makin smooth ke depannya 🥹' },
  ],
  random: [
    { e: '🌸', t: '"kadang kamu perlu inget: kamu itu cukup. bukan terlalu banyak, bukan terlalu kurang. pas banget."' },
    { e: '🦋', t: '"capek itu boleh. berhenti sebentar itu boleh. yang penting jangan berhenti jadi diri sendiri."' },
    { e: '🎀', t: '"friendship reminder: ada orang yang text kamu bukan karena mau sesuatu. tapi karena kamu sendiri sudah cukup alasan."' },
    { e: '🌟', t: '"fun fact absurd: kamu itu salah satu bagian terbaik dari hari-hari yang kamu ada di dalamnya."' },
  ]
};

let currentEvent = null;
document.addEventListener('click', e => { currentEvent = e; });

let sadInterval = null;
let sadIndex = 0;
const SAD_DURATION = 5000;

function startSadRotate(pool) {
  sadIndex = 0;
  const wrap = document.getElementById('sad-progress-wrap');
  const bar  = document.getElementById('sad-progress-bar');
  wrap.style.display = 'block';

  function runCycle() {
    bar.style.transition = 'none';
    bar.style.width = '0%';
    bar.offsetWidth; // force reflow
    bar.style.transition = `width ${SAD_DURATION}ms linear`;
    bar.style.width = '100%';
    sadInterval = setTimeout(() => {
      sadIndex = (sadIndex + 1) % pool.length;
      const next = pool[sadIndex];
      document.getElementById('popup-emoji').textContent = next.e;
      document.getElementById('popup-text').textContent  = next.t;
      runCycle();
    }, SAD_DURATION);
  }
  runCycle();
}

function stopSadRotate() {
  clearTimeout(sadInterval);
  sadInterval = null;
  const wrap = document.getElementById('sad-progress-wrap');
  const bar  = document.getElementById('sad-progress-bar');
  wrap.style.display = 'none';
  bar.style.width = '0%';
}

function triggerPopup(type) {
  const e = currentEvent;
  const pool = QUOTES[type] || QUOTES.random;
  const q = pool[Math.floor(Math.random() * pool.length)];

  document.getElementById('popup-emoji').textContent = q.e;
  document.getElementById('popup-text').textContent  = q.t;

  const gif        = document.getElementById('popup-gif');
  const audio      = document.getElementById('popup-audio');
  const audioKicau = document.getElementById('popup-audio-kicau');
  const audioOpen  = document.getElementById('popup-audio-open');

  stopSadRotate();

  if (type === 'danger') {
    gif.style.display = 'block';
    audioKicau.src = '/public/kicau-mania.mp3';
    audioKicau.play().catch(() => {});
  } else if (type === 'sad') {
    audio.src = '/public/sad-meow-song.mp3';
    audio.play().catch(() => {});
    gif.style.display = 'none';
    audioKicau.pause();
    startSadRotate(pool);
  } else {
    audioOpen.src = '/public/anime-wow.mp3';
    audioOpen.play().catch(() => {});
    gif.style.display = 'none';
    audioKicau.pause();
  }

  document.getElementById('popup-overlay').classList.add('active');

  const cx = e ? e.clientX : window.innerWidth / 2;
  const cy = e ? e.clientY : window.innerHeight / 3;
  spawnConfetti(cx, cy, 28);
  spawnHearts(cx, cy);

  const texts = ['uwu 🥹','HEYYYY!!','luv u!!','hai hai!!','🎉✨','bestie!!','kamu baik!!'];
  spawnFloatText(cx, cy - 30, texts[Math.floor(Math.random() * texts.length)]);
}

function closePopup() {
  document.getElementById('popup-overlay').classList.remove('active');
  stopSadRotate();
  ['popup-audio','popup-audio-kicau'].forEach(id => {
    const a = document.getElementById(id);
    a.pause(); a.currentTime = 0;
  });
  document.getElementById('popup-gif').style.display = 'none';
}

// ===============================
// EASTER EGG
// ===============================
function showEasterEgg()  { document.getElementById('easter-egg-popup').classList.add('active'); }
function closeEasterEgg() { document.getElementById('easter-egg-popup').classList.remove('active'); }

let easterClicks = 0, easterTimer;
document.getElementById('easter-egg-trigger').addEventListener('click', () => {
  easterClicks++;
  clearTimeout(easterTimer);
  easterTimer = setTimeout(() => easterClicks = 0, 3000);
});

// ===============================
// SCROLL REVEAL
// ===============================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); });
}, { threshold: 0.15 });
document.querySelectorAll('.scroll-reveal').forEach(r => revealObserver.observe(r));

// ===============================
// DOUBLE-CLICK HEARTS
// ===============================
document.addEventListener('dblclick', e => {
  spawnHearts(e.clientX, e.clientY);
  spawnConfetti(e.clientX, e.clientY, 15);
});

// ===============================
// TITLE CYCLE
// ===============================
let titleIndex = 0;
const titles = [
  'HAPPY BIRTHDAY SYAFARI 158CM !!!!',
  '🎂 selamat ulang tahun!!',
  '💕 makasih udah ada di dunia',
  '✨ 28 Mei 2001 — iconic date',
  '🌸 syafari yudhanti cahya utami!!',
  '😭 kenapa kamu ngangenin banget sih',
];
setInterval(() => {
  titleIndex = (titleIndex + 1) % titles.length;
  document.title = titles[titleIndex];
}, 4000);

// ===============================
// TOUCH HEARTS (mobile)
// ===============================
document.addEventListener('touchstart', e => {
  if (Math.random() > 0.7) {
    const t = e.touches[0];
    spawnHearts(t.clientX, t.clientY);
  }
}, { passive: true });

// ===============================
// SCROLL TO TOP
// ===============================
function scrollToTop() {
  if (window.__lenis) {
    window.__lenis.scrollTo(0, { duration: 1.5 });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

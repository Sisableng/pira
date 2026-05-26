// ===============================
// CURRENT YEAR
// ===============================

const year = new Date().getFullYear();
const elYear = document.getElementById("cpr-year");

elYear.textContent = year;


// ===============================
// CURSOR
// ===============================
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

function animTrail() {
  tx += (mx - tx) * 0.15;
  ty += (my - ty) * 0.15;
  cursorTrail.style.left = tx + 'px';
  cursorTrail.style.top = ty + 'px';
  requestAnimationFrame(animTrail);
}
animTrail();

document.addEventListener('mousedown', () => {
  cursor.style.width = '14px';
  cursor.style.height = '14px';
});
document.addEventListener('mouseup', () => {
  cursor.style.width = '20px';
  cursor.style.height = '20px';
});

// ===============================
// FLOATING PARTICLES
// ===============================
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const EMOJIS = ['💕','✨','⭐','🌸','💫','🎀','🌟','🦋','🫧','💖'];

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: canvas.height + 20,
    size: 10 + Math.random() * 18,
    speed: 0.4 + Math.random() * 0.8,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    opacity: 0.4 + Math.random() * 0.5,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.02 + Math.random() * 0.03,
    drift: (Math.random() - 0.5) * 0.5
  };
}

for (let i = 0; i < 18; i++) {
  let p = createParticle();
  p.y = Math.random() * canvas.height;
  particles.push(p);
}

function animParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    p.y -= p.speed;
    p.wobble += p.wobbleSpeed;
    p.x += Math.sin(p.wobble) * 0.6 + p.drift;
    ctx.globalAlpha = p.opacity;
    ctx.font = p.size + 'px serif';
    ctx.fillText(p.emoji, p.x, p.y);
    if (p.y < -30) particles[i] = createParticle();
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(animParticles);
}
animParticles();

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
  audio.play().catch(() => {}); // catch jika browser blokir autoplay

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
      textEl.textContent = loadingTexts[i];
      bar.style.animationDuration = '0.05s';
      i++;
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
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.cssText = `
      left: ${x + (Math.random()-0.5)*100}px;
      top: ${y}px;
      background: ${CONFETTI_COLORS[Math.floor(Math.random()*CONFETTI_COLORS.length)]};
      width: ${6+Math.random()*10}px;
      height: ${6+Math.random()*10}px;
      border-radius: ${Math.random()>0.5?'50%':'2px'};
      animation-duration: ${1.5+Math.random()*2}s;
      animation-delay: ${Math.random()*0.4}s;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

function launchWelcomeConfetti() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => spawnConfetti(
      window.innerWidth * 0.1 + Math.random() * window.innerWidth * 0.8,
      -10, 25
    ), i * 200);
  }
}

// ===============================
// HEART BURST
// ===============================
function spawnHearts(x, y) {
  const hearts = ['❤️','💕','💖','🩷','💗','💓'];
  for (let i = 0; i < 8; i++) {
    const el = document.createElement('div');
    el.className = 'heart-burst';
    const angle = (i / 8) * Math.PI * 2;
    const dist = 60 + Math.random() * 60;
    el.style.cssText = `
      left: ${x}px; top: ${y}px;
      --tx: ${Math.cos(angle)*dist}px;
      --ty: ${Math.sin(angle)*dist - 40}px;
      animation-duration: ${0.8+Math.random()*0.4}s;
    `;
    el.textContent = hearts[Math.floor(Math.random()*hearts.length)];
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  }
}

function spawnFloatText(x, y, text) {
  const el = document.createElement('div');
  el.className = 'float-text';
  const rot = (Math.random()-0.5)*20;
  el.style.cssText = `
    left: ${x - 60}px; top: ${y}px;
    --rot: ${rot}deg;
    --rot2: ${rot + (Math.random()-0.5)*15}deg;
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
    { e: '🫂', t: 'hey. kamu boleh sedih. tapi inget ya, kamu udah sejauh ini. itu tuh keren banget padahal. jangan lupa minum air.' },
    { e: '💌', t: 'kalau lagi down, inget: ada orang yang genuinely happy kamu exists di dunia ini. iya, beneran.' },
    { e: '🌸', t: 'sedih itu valid. tapi kamu juga valid. dan kamu worth it untuk bahagia. even kalau sekarang belum kerasa.' },
    { e: '☁️', t: 'cloud itu lewat. kamu gak harus baik-baik aja terus. tapi kamu nggak sendirian juga kok.' },
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

// patch event passing
document.querySelectorAll('.fun-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    // already handled by onclick attr with type param
    // but pass event for position
    currentEvent = e;
  });
});

// Override onclick to also get event
let currentEvent = null;
document.addEventListener('click', e => { currentEvent = e; });

let sadInterval = null;
let sadProgressInterval = null;
let sadIndex = 0;
const SAD_DURATION = 5000; // ms, ganti sesuai selera

function startSadRotate(pool) {
  // Reset index ke posisi awal (quote pertama sudah ditampilkan di triggerPopup)
  sadIndex = 0;

  const wrap = document.getElementById('sad-progress-wrap');
  const bar = document.getElementById('sad-progress-bar');
  wrap.style.display = 'block';

  function runCycle() {
    // Reset & animasi progress bar
    bar.style.transition = 'none';
    bar.style.width = '0%';

    // Paksa reflow supaya transition reset benar-benar terjadi
    bar.offsetWidth;

    bar.style.transition = `width ${SAD_DURATION}ms linear`;
    bar.style.width = '100%';

    // Ganti konten setelah durasi habis
    sadInterval = setTimeout(() => {
      sadIndex = (sadIndex + 1) % pool.length; // looping balik ke 0
      const next = pool[sadIndex];
      document.getElementById('popup-emoji').textContent = next.e;
      document.getElementById('popup-text').textContent = next.t;
      runCycle(); // rekursif → looping
    }, SAD_DURATION);
  }

  runCycle();
}

function stopSadRotate() {
  clearTimeout(sadInterval);
  sadInterval = null;

  const wrap = document.getElementById('sad-progress-wrap');
  const bar = document.getElementById('sad-progress-bar');
  wrap.style.display = 'none';
  bar.style.width = '0%';
}

function triggerPopup(type) {
  const e = currentEvent;
  const pool = QUOTES[type] || QUOTES.random;
  const q = pool[Math.floor(Math.random() * pool.length)];

  document.getElementById('popup-emoji').textContent = q.e;
  document.getElementById('popup-text').textContent = q.t;

  const gif = document.getElementById('popup-gif');
  const audio = document.getElementById('popup-audio');
  const audioKicau = document.getElementById('popup-audio-kicau');
  const audioOpen = document.getElementById('popup-audio-open');

  stopSadRotate(); // selalu clear dulu

  if (type === 'danger') {
    gif.style.display = 'block';
    audioKicau.src = '/public/kicau-mania.mp3';
    audioKicau.play().catch(() => {});
  } else if (type === 'sad') {
    audio.src = '/public/sad-meow-song.mp3';
    audio.play().catch(() => {});
    gif.style.display = 'none';
    audioKicau.pause();
    startSadRotate(pool); // mulai rotate + progress bar
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

  const audio = document.getElementById('popup-audio');
  audio.pause();
  audio.currentTime = 0;

  const audioKicau = document.getElementById('popup-audio-kicau');
  audioKicau.pause();
  audioKicau.currentTime = 0;

  const gif = document.getElementById('popup-gif');
  gif.style.display = 'none';
}

// ===============================
// EASTER EGG
// ===============================
function showEasterEgg() {
  document.getElementById('easter-egg-popup').classList.add('active');
}
function closeEasterEgg() {
  document.getElementById('easter-egg-popup').classList.remove('active');
}

// konami-like: click bottom-right 5 times fast
let easterClicks = 0, easterTimer;
document.getElementById('easter-egg-trigger').addEventListener('click', () => {
  easterClicks++;
  clearTimeout(easterTimer);
  easterTimer = setTimeout(() => easterClicks = 0, 3000);
});

// ===============================
// SCROLL REVEAL
// ===============================
const reveals = document.querySelectorAll('.scroll-reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
    }
  });
}, { threshold: 0.15 });
reveals.forEach(r => revealObserver.observe(r));

// ===============================
// RANDOM HEART on double-click
// ===============================
document.addEventListener('dblclick', e => {
  spawnHearts(e.clientX, e.clientY);
  spawnConfetti(e.clientX, e.clientY, 15);
});

// ===============================
// SUBTLE TITLE EASTER EGG
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
// TOUCH SUPPORT for mobile hearts
// ===============================
document.addEventListener('touchstart', e => {
  const t = e.touches[0];
  if (Math.random() > 0.7) {
    spawnHearts(t.clientX, t.clientY);
  }
}, { passive: true });

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })

}
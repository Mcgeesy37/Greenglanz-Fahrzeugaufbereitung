/* ══════════════════════════════════════════════════
   GREENGLANZ FAHRZEUG – fv-app.js
   Full interactive — Mobile-safe
══════════════════════════════════════════════════ */
'use strict';

/* ── 1. Loader ───────────────────────────────────── */
(function () {
  const loader = document.getElementById('loader');
  const fill   = document.getElementById('loaderFill');
  if (!loader) return;
  document.body.style.overflow = 'hidden';
  let v = 0;
  const t = setInterval(() => {
    v += Math.random() * 14 + 6;
    if (v >= 100) { v = 100; clearInterval(t); }
    if (fill) fill.style.width = v + '%';
    if (v === 100) setTimeout(() => {
      loader.classList.add('out');
      document.body.style.overflow = '';
      onLoaded();
    }, 500);
  }, 55);
})();

function onLoaded() {
  // Animate water bar
  setTimeout(() => {
    const bar = document.getElementById('waterFill');
    if (bar) bar.style.width = '72%';
    const val = document.getElementById('waterVal');
    if (val) animateWaterVal(val, 47);
  }, 600);
  // Animate eco bars
  setTimeout(() => {
    document.querySelectorAll('.ec-bar').forEach(b => {
      b.style.width = b.dataset.w + '%';
    });
  }, 400);
}

function animateWaterVal(el, target) {
  let v = 0;
  const t = setInterval(() => {
    v += 1;
    if (v >= target) { v = target; clearInterval(t); }
    el.textContent = v + ' L';
  }, 40);
}

/* ── 2. Scroll Progress ──────────────────────────── */
(function () {
  const bar = document.getElementById('scrollProg');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    bar.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
  }, { passive: true });
})();

/* ── 3. Custom Cursor ────────────────────────────── */
(function () {
  if ('ontouchstart' in window) return;
  const c = document.getElementById('cur');
  const r = document.getElementById('curRing');
  if (!c || !r) return;
  let mx = 0, my = 0, fx = 0, fy = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    c.style.left = mx + 'px'; c.style.top = my + 'px';
  }, { passive: true });
  (function loop() {
    fx += (mx - fx) * 0.1; fy += (my - fy) * 0.1;
    r.style.left = fx + 'px'; r.style.top  = fy + 'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('button, a, .paket-card, .nf-item').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cur-lg'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cur-lg'));
  });
})();

/* ── 4. Hero Canvas — Neon Particles ─────────────── */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts = [], mouse = { x: -999, y: -999 };
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });

  const N = window.innerWidth < 768 ? 35 : 75;
  for (let i = 0; i < N; i++) {
    pts.push({
      x: Math.random() * 1920, y: Math.random() * 1080,
      r: Math.random() * 1.8 + 0.3,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      o: Math.random() * 0.28 + 0.04,
      pulse: Math.random() * Math.PI * 2,
      green: Math.random() > 0.25 // 75% green particles
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // Connections
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          ctx.beginPath();
          const alpha = (1 - d / 130) * 0.06;
          ctx.strokeStyle = pts[i].green ? `rgba(0,230,118,${alpha})` : `rgba(21,101,192,${alpha * 0.6})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }
    // Particles
    pts.forEach(p => {
      p.pulse += 0.016;
      const r = p.r + Math.sin(p.pulse) * 0.4;
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 110) { const f = (110 - d) / 110; p.vx += (dx / d) * f * 0.3; p.vy += (dy / d) * f * 0.3; }
      p.vx *= 0.98; p.vy *= 0.98;
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      if (p.green) {
        ctx.fillStyle = `rgba(0,230,118,${p.o})`;
        ctx.shadowColor = 'rgba(0,230,118,0.5)';
        ctx.shadowBlur = 6;
      } else {
        ctx.fillStyle = `rgba(21,101,192,${p.o * 0.6})`;
        ctx.shadowBlur = 0;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── 5. Navigation ───────────────────────────────── */
(function () {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mobMenu');
  if (!nav) return;
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60), { passive: true });
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      burger.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    document.querySelectorAll('.mob-menu a').forEach(a => a.addEventListener('click', () => {
      menu.classList.remove('open'); burger.classList.remove('open'); document.body.style.overflow = '';
    }));
  }
})();

/* ── 6. Trust Bar Duplicate ──────────────────────── */
(function () {
  const el = document.getElementById('tbTrack');
  if (el) el.parentNode.appendChild(el.cloneNode(true));
})();

/* ── 7. Scroll Reveal ────────────────────────────── */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const d = parseInt(e.target.dataset.delay || 0);
      setTimeout(() => e.target.classList.add('on'), d);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
}

/* ── 8. Neon Counters ────────────────────────────── */
function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, end = parseFloat(el.dataset.target);
      let v = 0;
      const inc = end / (1800 / 16);
      const t = setInterval(() => {
        v += inc; if (v >= end) { v = end; clearInterval(t); }
        el.textContent = Math.floor(v);
      }, 16);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.neon-counter[data-target]').forEach(el => obs.observe(el));
}

/* ── 9. Eco Bar Animation ────────────────────────── */
(function () {
  const cmp = document.getElementById('ecoCompare');
  if (!cmp) return;
  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    document.querySelectorAll('.ec-bar').forEach(b => {
      setTimeout(() => { b.style.width = b.dataset.w + '%'; }, 200);
    });
    obs.unobserve(cmp);
  }, { threshold: 0.3 });
  obs.observe(cmp);
})();

/* ── 10. Prozess Timeline Progress ───────────────── */
(function () {
  const steps = document.querySelectorAll('.ptl-step');
  const prog  = document.getElementById('ptlProg');
  if (!steps.length || !prog) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('active');
      let active = 0;
      steps.forEach(s => { if (s.classList.contains('active')) active++; });
      prog.style.height = (active / steps.length * 100) + '%';
    });
  }, { threshold: 0.4 });
  steps.forEach(s => obs.observe(s));
})();

/* ── 11. Float Animations (data-float) ───────────── */
(function () {
  const floatMap = {
    '1': 'float-a 7s ease-in-out infinite',
    '2': 'float-b 9s ease-in-out infinite 1.2s',
    '3': 'float-c 6s ease-in-out infinite 2.5s',
  };
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float-a { 0%,100%{ transform:translateY(0) rotate(0deg); } 40%{ transform:translateY(-12px) rotate(1.2deg); } }
    @keyframes float-b { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-14px) rotate(-1deg); } }
    @keyframes float-c { 0%,100%{ transform:translateY(0); } 45%{ transform:translateY(-8px); } }
  `;
  document.head.appendChild(style);
  document.querySelectorAll('[data-float]').forEach(el => {
    el.style.animation = floatMap[el.dataset.float] || '';
  });
})();

/* ── 12. Smooth Anchors ──────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const el = document.getElementById(a.getAttribute('href').slice(1));
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ── 13. Magnetic Buttons ────────────────────────── */
(function () {
  if ('ontouchstart' in window) return;
  document.querySelectorAll('.btn-neon, .btn-submit-neon, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px, ${(e.clientY - r.top - r.height / 2) * 0.22}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
  });
})();

/* ── 14. Ripple on Click ─────────────────────────── */
(function () {
  document.addEventListener('click', e => {
    const el = document.createElement('div');
    const size = 80;
    el.style.cssText = `
      position:fixed; left:${e.clientX - size/2}px; top:${e.clientY - size/2}px;
      width:${size}px; height:${size}px; border-radius:50%;
      border: 1.5px solid rgba(0,230,118,0.4);
      pointer-events:none; z-index:9996;
      animation: ripple-click 0.6s ease-out forwards;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 600);
  });
  const s = document.createElement('style');
  s.textContent = `@keyframes ripple-click { from{ transform:scale(0); opacity:0.8; } to{ transform:scale(3); opacity:0; } }`;
  document.head.appendChild(s);
})();

/* ── 15. Water Counter Live Update ───────────────── */
(function () {
  const val = document.getElementById('waterVal');
  if (!val) return;
  let base = 47;
  setInterval(() => {
    base += Math.floor(Math.random() * 4 - 1.5);
    base = Math.max(38, Math.min(58, base));
    val.textContent = base + ' L';
  }, 3500);
})();

/* ── 16. Atom Parallax on Mouse ──────────────────── */
(function () {
  if ('ontouchstart' in window) return;
  const scene = document.querySelector('.nano-atom');
  if (!scene) return;
  scene.addEventListener('mousemove', e => {
    const r = scene.getBoundingClientRect();
    const dx = ((e.clientX - r.left) / r.width - 0.5) * 14;
    const dy = ((e.clientY - r.top)  / r.height - 0.5) * 14;
    scene.style.transform = `perspective(600px) rotateX(${-dy}deg) rotateY(${dx}deg)`;
    scene.style.transformStyle = 'preserve-3d';
  });
  scene.addEventListener('mouseleave', () => { scene.style.transform = ''; });
})();

/* ── 17. Parallax blobs (Desktop) ────────────────── */
(function () {
  if (window.innerWidth < 900 || 'ontouchstart' in window) return;
  const blobs = document.querySelectorAll('.hero-blob');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    blobs.forEach((b, i) => { b.style.transform = `translateY(${sy * (i + 1) * 0.05}px)`; });
  }, { passive: true });
})();

/* ── 18. Form Submit ─────────────────────────────── */
(function () {
  const form    = document.getElementById('kForm');
  const btn     = document.getElementById('submitBtn');
  const success = document.getElementById('kSuccess');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const fn   = form.querySelector('#fn')?.value.trim();
    const em   = form.querySelector('#em')?.value.trim();
    const tel  = form.querySelector('#tel')?.value.trim();
    const type = form.querySelector('#fvType')?.value;
    const dsgvo= form.querySelector('#dsgvo')?.checked;
    if (!fn || !em || !tel || !type || !dsgvo) {
      [form.querySelector('#fn'), form.querySelector('#em'), form.querySelector('#tel')]
        .filter(el => el && !el.value.trim())
        .forEach(el => { el.style.borderColor = '#ff6b6b'; setTimeout(() => el.style.borderColor = '', 2500); });
      return;
    }
    btn.classList.add('loading');
    await new Promise(r => setTimeout(r, 1800));
    btn.classList.remove('loading');
    success.classList.add('show');
    setTimeout(() => { success.classList.remove('show'); form.reset(); }, 6000);
  });
})();

/* ── 19. ESC Key ─────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const m = document.getElementById('mobMenu');
    const b = document.getElementById('burger');
    if (m?.classList.contains('open')) { m.classList.remove('open'); b?.classList.remove('open'); document.body.style.overflow = ''; }
  }
});

/* ── 20. Nav Active ──────────────────────────────── */
(function () {
  const secs  = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');
  secs.forEach(s => new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      links.forEach(l => l.classList.remove('active'));
      const l = document.querySelector(`.nav-links a[href="#${s.id}"]`);
      if (l) l.classList.add('active');
    }
  }, { threshold: 0.4 }).observe(s));
})();

/* ── Init ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => { initReveal(); initCounters(); });

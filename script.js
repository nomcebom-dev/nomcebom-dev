/* ═══════════════════════════════════════════════════
   NOMCEBO MTSHALI — PORTFOLIO
   Interactive starfield + cursor + scroll reveals
═══════════════════════════════════════════════════ */

/* ─── STARFIELD ───────────────────────────────────── */
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let W, H, stars = [], mouse = { x: -999, y: -999 };

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function mkStar() {
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.2 + 0.2,
    vx: (Math.random() - 0.5) * 0.12,
    vy: (Math.random() - 0.5) * 0.12,
    alpha: Math.random() * 0.6 + 0.1,
    pulse: Math.random() * Math.PI * 2,
  };
}

function initStars() {
  stars = [];
  const count = Math.floor((W * H) / 4000);
  for (let i = 0; i < count; i++) stars.push(mkStar());
}

function drawStars() {
  ctx.clearRect(0, 0, W, H);

  stars.forEach(s => {
    s.pulse += 0.008;
    s.x += s.vx;
    s.y += s.vy;
    if (s.x < 0) s.x = W;
    if (s.x > W) s.x = 0;
    if (s.y < 0) s.y = H;
    if (s.y > H) s.y = 0;

    // mouse repulsion
    const dx = s.x - mouse.x;
    const dy = s.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      const force = (120 - dist) / 120;
      s.x += (dx / dist) * force * 1.2;
      s.y += (dy / dist) * force * 1.2;
    }

    const pulse = Math.sin(s.pulse) * 0.3 + 0.7;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200, 190, 255, ${s.alpha * pulse})`;
    ctx.fill();
  });

  // draw connection lines near mouse
  stars.forEach(s => {
    const dx = s.x - mouse.x;
    const dy = s.y - mouse.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 160) {
      stars.forEach(s2 => {
        const d2x = s.x - s2.x;
        const d2y = s.y - s2.y;
        const d2 = Math.sqrt(d2x*d2x + d2y*d2y);
        if (d2 < 80) {
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s2.x, s2.y);
          const alpha = (1 - d2/80) * 0.15 * (1 - dist/160);
          ctx.strokeStyle = `rgba(255,45,155,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    }
  });

  requestAnimationFrame(drawStars);
}

window.addEventListener('resize', () => { resize(); initStars(); });
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

resize();
initStars();
drawStars();

/* ─── CUSTOM CURSOR ───────────────────────────────── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let rx = 0, ry = 0, mx = 0, my = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .proj-card, .grade-chip, .seeking-pills span').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width  = '56px';
    ring.style.height = '56px';
    ring.style.borderColor = 'rgba(45,221,255,0.7)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width  = '32px';
    ring.style.height = '32px';
    ring.style.borderColor = 'rgba(255,45,155,0.5)';
  });
});

/* ─── SCROLL REVEALS ──────────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal-block').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 0.1}s`;
  revealObs.observe(el);
});

/* ─── SKILL BARS triggered separately ────────────── */
const skillsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      skillsObs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skills-wrap').forEach(el => skillsObs.observe(el));

/* ─── PROJECT CARD STAGGER ────────────────────────── */
document.querySelectorAll('.proj-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.07}s`;
  revealObs.observe(card);
});

/* ─── NAV SMOOTH SCROLL ───────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ─── HERO NAME SPLIT ON LOAD ─────────────────────── */
['#heroN', '#heroSurname'].forEach((sel, i) => {
  const el = document.querySelector(sel);
  if (!el) return;
  el.style.opacity = '0';
  el.style.transform = 'translateY(40px)';
  el.style.transition = `opacity 1s ease, transform 1s cubic-bezier(0.16,1,0.3,1)`;
  el.style.transitionDelay = `${0.3 + i * 0.15}s`;
  requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
});

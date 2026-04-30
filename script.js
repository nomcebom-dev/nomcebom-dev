// ----- star background -----

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

let stars = [];
let mouse = { x: -999, y: -999 };

function makeStar() {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.2 + 0.2,
    vx: (Math.random() - 0.5) * 0.12,
    vy: (Math.random() - 0.5) * 0.12,
    alpha: Math.random() * 0.6 + 0.1,
    pulse: Math.random() * Math.PI * 2,
  };
}

function createStars() {
  stars = [];
  let count = Math.floor((width * height) / 4000);
  for (let i = 0; i < count; i++) {
    stars.push(makeStar());
  }
}

function drawStars() {
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < stars.length; i++) {
    let s = stars[i];

    // twinkling effect
    s.pulse += 0.008;
    let brightness = Math.sin(s.pulse) * 0.3 + 0.7;

    s.x += s.vx;
    s.y += s.vy;

    // wrap around screen edges
    if (s.x < 0) s.x = width;
    if (s.x > width) s.x = 0;
    if (s.y < 0) s.y = height;
    if (s.y > height) s.y = 0;

    // push stars away from mouse
    let dx = s.x - mouse.x;
    let dy = s.y - mouse.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      let force = (120 - dist) / 120;
      s.x += (dx / dist) * force * 1.2;
      s.y += (dy / dist) * force * 1.2;
    }

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(200, 190, 255, " + (s.alpha * brightness) + ")";
    ctx.fill();
  }

  // draw lines between nearby stars when mouse is close
  for (let i = 0; i < stars.length; i++) {
    let s = stars[i];
    let dx = s.x - mouse.x;
    let dy = s.y - mouse.y;
    let d = Math.sqrt(dx * dx + dy * dy);

    if (d < 160) {
      for (let j = 0; j < stars.length; j++) {
        let s2 = stars[j];
        let d2x = s.x - s2.x;
        let d2y = s.y - s2.y;
        let d2 = Math.sqrt(d2x * d2x + d2y * d2y);

        if (d2 < 80) {
          let lineAlpha = (1 - d2 / 80) * 0.15 * (1 - d / 160);
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s2.x, s2.y);
          ctx.strokeStyle = "rgba(255, 45, 155, " + lineAlpha + ")";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  requestAnimationFrame(drawStars);
}

window.addEventListener("mousemove", function(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("resize", function() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  createStars();
});

createStars();
drawStars();


// ----- custom cursor -----

const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");

let mx = 0;
let my = 0;
let rx = 0;
let ry = 0;

document.addEventListener("mousemove", function(e) {
  mx = e.clientX;
  my = e.clientY;
  cursorDot.style.left = mx + "px";
  cursorDot.style.top = my + "px";
});

// ring follows mouse but a bit slower (lerp)
function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cursorRing.style.left = rx + "px";
  cursorRing.style.top = ry + "px";
  requestAnimationFrame(animateRing);
}
animateRing();

// ring gets bigger when hovering on clickable stuff
let clickableEls = document.querySelectorAll(
  "a, button, .proj-card, .grade-chip, .seeking-pills span"
);

clickableEls.forEach(function(el) {
  el.addEventListener("mouseenter", function() {
    cursorRing.style.width = "56px";
    cursorRing.style.height = "56px";
    cursorRing.style.borderColor = "rgba(45, 221, 255, 0.7)";
  });
  el.addEventListener("mouseleave", function() {
    cursorRing.style.width = "32px";
    cursorRing.style.height = "32px";
    cursorRing.style.borderColor = "rgba(255, 45, 155, 0.5)";
  });
});


// ----- scroll reveal -----
// sections start invisible and fade in when you scroll to them

const revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".reveal-block").forEach(function(el, i) {
  el.style.transitionDelay = (i % 4) * 0.1 + "s";
  revealObserver.observe(el);
});

document.querySelectorAll(".proj-card").forEach(function(card, i) {
  card.style.transitionDelay = i * 0.07 + "s";
  revealObserver.observe(card);
});


// ----- skill bars -----
// bars animate to their width when the skills section is visible

const skillsObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".skills-wrap").forEach(function(el) {
  skillsObserver.observe(el);
});


// ----- smooth scroll for nav links -----

document.querySelectorAll("a[href^='#']").forEach(function(link) {
  link.addEventListener("click", function(e) {
    let target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});


// ----- hero name slides in on load -----

let nameEls = ["#heroN", "#heroSurname"];

nameEls.forEach(function(selector, i) {
  let el = document.querySelector(selector);
  if (!el) return;

  el.style.opacity = "0";
  el.style.transform = "translateY(40px)";
  el.style.transition = "opacity 1s ease, transform 1s cubic-bezier(0.16, 1, 0.3, 1)";
  el.style.transitionDelay = (0.3 + i * 0.15) + "s";

  requestAnimationFrame(function() {
    el.style.opacity = "1";
    el.style.transform = "none";
  });
});


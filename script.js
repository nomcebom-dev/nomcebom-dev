const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let stars = [];
let w = window.innerWidth;
let h = window.innerHeight;

canvas.width = w;
canvas.height = h;

let mouse = { x: -1000, y: -1000 };

// create stars
function init() {
  stars = [];

  let amount = Math.floor((w * h) / 4000);

  for (let i = 0; i < amount; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 1.2,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.15,
      alpha: Math.random()
    });
  }
}

// animation
function animate() {
  ctx.clearRect(0, 0, w, h);

  for (let i = 0; i < stars.length; i++) {
    let s = stars[i];

    s.x += s.speedX;
    s.y += s.speedY;

    if (s.x > w) s.x = 0;
    if (s.x < 0) s.x = w;
    if (s.y > h) s.y = 0;
    if (s.y < 0) s.y = h;

    let dx = s.x - mouse.x;
    let dy = s.y - mouse.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 120) {
      s.x += dx * 0.02;
      s.y += dy * 0.02;
    }

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(200,190,255," + s.alpha + ")";
    ctx.fill();
  }

  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
  init();
});

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

init();
animate();


// cursor
const dot = document.getElementById("cursorDot");
const ring = document.getElementById("cursorRing");

let mx = 0, my = 0;
let rx = 0, ry = 0;

document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;

  dot.style.left = mx + "px";
  dot.style.top = my + "px";
});

function follow() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;

  ring.style.left = rx + "px";
  ring.style.top = ry + "px";

  requestAnimationFrame(follow);
}

follow();

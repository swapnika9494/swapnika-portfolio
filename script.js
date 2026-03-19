// ---------- Utils ----------
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

const isLowPower = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Typing effect (UPDATED for your profile) ----------
const typedEl = $("#typed");

const roles = [
  "AI/ML Enthusiast",
  "Full Stack Developer",
  "Problem Solver",
  "Data-driven Developer"
];

let ri = 0, ci = 0, deleting = false;

function typeLoop() {
  if (!typedEl) return;

  const current = roles[ri];

  if (!deleting) {
    typedEl.textContent = current.substring(0, ++ci);
    if (ci === current.length) {
      deleting = true;
      return setTimeout(typeLoop, 1000);
    }
  } else {
    typedEl.textContent = current.substring(0, --ci);
    if (ci === 0) {
      deleting = false;
      ri = (ri + 1) % roles.length;
    }
  }

  setTimeout(typeLoop, deleting ? 50 : 100);
}

typeLoop();

// ---------- Year ----------
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Smooth Navigation ----------
const slides = $$(".slide");

$$(".topnav button, .hero-ctas .btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;
    if (!target) return;
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
  });
});

// ---------- Dots Navigation ----------
const dotsRoot = $("#dots");

if (dotsRoot) {
  slides.forEach((slide) => {
    const dot = document.createElement("button");
    dot.addEventListener("click", () => {
      slide.scrollIntoView({ behavior: "smooth" });
    });
    dotsRoot.appendChild(dot);
  });
}

const dots = $$("#dots button");

function updateDots() {
  const scrollPos = window.scrollY + window.innerHeight * 0.4;

  let activeIndex = 0;

  slides.forEach((slide, i) => {
    if (slide.offsetTop <= scrollPos) activeIndex = i;
  });

  dots.forEach((d, i) => d.classList.toggle("active", i === activeIndex));
}

window.addEventListener("scroll", updateDots);
window.addEventListener("resize", updateDots);
updateDots();

// ---------- Keyboard Navigation ----------
let current = 0;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    current = Math.min(current + 1, slides.length - 1);
    slides[current].scrollIntoView({ behavior: "smooth" });
  }

  if (e.key === "ArrowUp") {
    current = Math.max(current - 1, 0);
    slides[current].scrollIntoView({ behavior: "smooth" });
  }
});

// ---------- Reveal Animation ----------
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("in");
    });
  },
  { threshold: 0.1 }
);

$$(".glass, .proj-card, .skill, .edu-card, .portrait-card").forEach((el) => {
  el.classList.add("fade-up");
  observer.observe(el);
});

// ---------- Card Tilt Effect (lighter + smoother) ----------
$$(".proj-card").forEach((card) => {
  if (isLowPower) return;

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateX = (y - 0.5) * 10;
    const rotateY = (x - 0.5) * 15;

    card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0) rotateY(0) scale(1)";
  });
});

// ---------- Lightweight Background (IMPROVED PERFORMANCE) ----------
(function backgroundEffect() {
  if (isLowPower || window.innerWidth < 700) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  document.getElementById("three-root").appendChild(canvas);

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5
  }));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
})();

// ---------- Floating Profile ----------
(function () {
  const el = document.querySelector(".portrait-card");
  if (!el || isLowPower) return;

  let direction = 1;

  setInterval(() => {
    el.style.transform = `translateY(${direction * 8}px)`;
    direction *= -1;
  }, 2000);
})();
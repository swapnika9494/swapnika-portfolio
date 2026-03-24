// ---------- Utils ----------
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
const isLowPower = (() => {
  try {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    return mq && mq.matches;
  } catch (e) {
    return false;
  }
})();

// ---------- Typing effect ----------
const typedEl = $("#typed");
const roles = [
  "AI & ML Student",
  "Full Stack Developer",
  "Machine Learning Enthusiast",
  "Problem Solver",
  "Tech Explorer"
];
let ri = 0, ci = 0, deleting = false;
(function typeLoop() {
  if (!typedEl) return;
  const cur = roles[ri];
  if (!deleting) {
    typedEl.textContent = cur.slice(0, ++ci);
    if (ci === cur.length) {
      deleting = true;
      setTimeout(typeLoop, 900);
      return;
    }
  } else {
    typedEl.textContent = cur.slice(0, --ci);
    if (ci === 0) {
      deleting = false;
      ri = (ri + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 45 : 110);
})();

// ---------- Year ----------
$("#year") && ($("#year").textContent = new Date().getFullYear());

// ---------- Smooth nav & dots ----------
const slides = $$(".slide");
const dotsRoot = $("#dots");
function buildDots() {
  if (!dotsRoot) return;
  dotsRoot.innerHTML = "";
  slides.forEach((s) => {
    const btn = document.createElement("button");
    btn.setAttribute("aria-label", s.id);
    btn.addEventListener("click", () =>
      s.scrollIntoView({ behavior: "smooth" })
    );
    dotsRoot.appendChild(btn);
  });
}
buildDots();
const dotButtons = $$("#dots button");

function syncDots() {
  if (!dotButtons) return;
  const viewportTop = window.scrollY + window.innerHeight * 0.3;
  let active = 0;
  slides.forEach((s, i) => {
    const top = s.offsetTop;
    if (top <= viewportTop) active = i;
  });
  dotButtons.forEach((b, i) => b.classList.toggle("active", i === active));
}
window.addEventListener("scroll", throttle(syncDots, 80));
window.addEventListener("resize", throttle(syncDots, 120));
syncDots();

// topnav wiring and hero CTA
$$(".topnav button, .hero-ctas .btn, .btn[data-target]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const t = btn.dataset.target || btn.getAttribute("data-target");
    if (t) {
      const el = document.getElementById(t);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// keyboard nav
let currentSectionIndex = 0;
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    currentSectionIndex = Math.min(currentSectionIndex + 1, slides.length - 1);
    slides[currentSectionIndex].scrollIntoView({ behavior: "smooth" });
  }
  if (e.key === "ArrowUp") {
    currentSectionIndex = Math.max(currentSectionIndex - 1, 0);
    slides[currentSectionIndex].scrollIntoView({ behavior: "smooth" });
  }
});

// ---------- Intersection reveal ----------
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) en.target.classList.add("in");
    });
  },
  { threshold: 0.12 }
);

$$(
  ".glass, .proj-card, .skill, .edu-card, .portrait-card, .slide-head, .hero-title, .lead"
).forEach((el) => {
  el.classList.add("fade-up");
  io.observe(el);
});

// ---------- Project card 3D tilt ----------
function applyTilt(card) {
  const height = card.clientHeight,
    width = card.clientWidth;
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / width;
    const y = (e.clientY - rect.top) / height;
    const rotateY = (x - 0.5) * 14;
    const rotateX = -(y - 0.5) * 10;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`;
    card.style.boxShadow = `${(x - 0.5) * -60}px ${Math.abs(y - 0.5) * -30}px 60px rgba(0,0,0,0.5)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
    card.style.boxShadow = "";
  });
  card.animate(
    [{ transform: "translateY(8px)" }, { transform: "translateY(0)" }],
    { duration: 800, easing: "cubic-bezier(.2,.9,.2,1)" }
  );
}
$$(".proj-card[data-tilt]").forEach((c) => {
  if (!isLowPower) applyTilt(c);
});

// ---------- Throttle helper ----------
function throttle(fn, wait = 100) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last > wait) {
      last = now;
      fn.apply(this, args);
    }
  };
}

// ---------- Three.js Neural Network Background ----------
(function initThreeNetwork() {
  const prefersReduced =
    navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
  const smallScreen = window.innerWidth < 720;
  if (isLowPower || prefersReduced || smallScreen) {
    initCanvasFallback();
    return;
  }

  const root = document.getElementById("three-root");
  if (!root) return;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = "fixed";
  renderer.domElement.style.inset = "0";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.zIndex = "0";
  renderer.domElement.style.pointerEvents = "none";
  root.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(0, 0, 120);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const pointCount = Math.floor(Math.max(120, window.innerWidth * 0.12));
  const positions = new Float32Array(pointCount * 3);
  for (let i = 0; i < pointCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 260;
    positions[i3 + 1] = (Math.random() - 0.5) * 160;
    positions[i3 + 2] = (Math.random() - 0.5) * 60;
  }

  const pointsGeom = new THREE.BufferGeometry();
  pointsGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const sprite = new THREE.TextureLoader().load(
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><circle cx="32" cy="32" r="30" fill="%23ffffff" opacity="0.9"/></svg>'
  );
  const pointsMat = new THREE.PointsMaterial({
    size: 6,
    map: sprite,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: 0xffffff,
  });

  const points = new THREE.Points(pointsGeom, pointsMat);
  scene.add(points);

  const maxDistance = 36;
  const linePositions = [];
  for (let i = 0; i < pointCount; i++) {
    for (let j = i + 1; j < pointCount; j++) {
      const ix = i * 3,
        jx = j * 3;
      const dx = positions[ix] - positions[jx];
      const dy = positions[ix + 1] - positions[jx + 1];
      const dz = positions[ix + 2] - positions[jx + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < maxDistance) {
        linePositions.push(positions[ix], positions[ix + 1], positions[ix + 2]);
        linePositions.push(positions[jx], positions[jx + 1], positions[jx + 2]);
      }
    }
  }
  const lineGeom = new THREE.BufferGeometry();
  lineGeom.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(linePositions, 3)
  );
  const lineMat = new THREE.LineBasicMaterial({
    color: 0xff7a33,
    transparent: true,
    opacity: 0.06,
  });
  const lines = new THREE.LineSegments(lineGeom, lineMat);
  scene.add(lines);

  scene.fog = new THREE.FogExp2(0x000009, 0.002);

  const mouse = { x: 0, y: 0 };
  window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  let last = performance.now();
  function animate(now) {
    const dt = (now - last) * 0.001;
    last = now;
    scene.rotation.y += dt * 0.04;
    scene.rotation.x += Math.sin(now / 6000) * 0.0006;

    camera.position.x += (mouse.x * 30 - camera.position.x) * 0.06;
    camera.position.y += (mouse.y * 20 - camera.position.y) * 0.06;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();

// ---------- Canvas fallback ----------
function initCanvasFallback() {
  const root = document.getElementById("three-root");
  if (!root) return;
  const canvas = document.createElement("canvas");
  canvas.id = "bg-fallback";
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = "0";
  canvas.style.pointerEvents = "none";
  root.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  let DPR = Math.max(1, window.devicePixelRatio || 1);
  function resize() {
    DPR = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.floor(window.innerWidth * DPR);
    canvas.height = Math.floor(window.innerHeight * DPR);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  const nodes = [];
  const count = Math.max(40, Math.floor(window.innerWidth * 0.04));
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2.4 + 0.6,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    });
  }
  function loop() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const g = ctx.createRadialGradient(
      window.innerWidth * 0.15,
      window.innerHeight * 0.2,
      0,
      window.innerWidth * 0.15,
      window.innerHeight * 0.2,
      window.innerWidth * 0.9
    );
    g.addColorStop(0, "rgba(255,106,0,0.03)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = 0; i < nodes.length; i++) {
      const p = nodes[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = window.innerWidth + 10;
      if (p.x > window.innerWidth + 10) p.x = -10;
      if (p.y < -10) p.y = window.innerHeight + 10;
      if (p.y > window.innerHeight + 10) p.y = -10;
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      for (let j = i + 1; j < nodes.length; j++) {
        const q = nodes[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 1600) {
          ctx.strokeStyle = "rgba(255,106,0," + (0.06 * (1 - d2 / 1600)).toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  }
  loop();
}

// ---------- Floating portrait ----------
(function floatPortrait() {
  const p = document.querySelector(".portrait-card.floating");
  if (!p || isLowPower) return;
  let dir = 1;
  setInterval(() => {
    p.style.transform = `translateY(${dir * 6}px)`;
    dir *= -1;
  }, 3000);
})();

// ---------- Sync dots on load ----------
setTimeout(syncDots, 300);

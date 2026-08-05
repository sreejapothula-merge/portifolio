import "./style.css";
import * as THREE from "three";
import { profile, projects, education, skills } from "./content.js";

/* ─────────────────────────────────────────────────────────────
   Content injection
──────────────────────────────────────────────────────────────*/
document.title = `${profile.name} — Portfolio`;
document.getElementById("hero-name").innerHTML = `Hi, I'm <span class="accent-coral">${profile.name}</span>`;
document.getElementById("hero-role").textContent = profile.role;
document.getElementById("hero-tagline").textContent = profile.tagline;

document.getElementById("contact-email").href = `mailto:${profile.email}`;
document.getElementById("contact-linkedin").href = profile.linkedin;

const accentMap = { coral: "var(--coral)", teal: "var(--teal)", yellow: "var(--yellow)", pink: "var(--pink)" };

const grid = document.getElementById("project-grid");
projects.forEach((p) => {
  const card = document.createElement("article");
  card.className = "card";
  card.style.setProperty("--card-accent", accentMap[p.color] || "var(--coral)");
  card.innerHTML = `
    <div class="card-top">
      <span class="card-tag">${p.tag}</span>
      <span>${p.year}</span>
    </div>
    <h3>${p.title}</h3>
    <p>${p.blurb}</p>
    <div class="card-stack">${p.stack.map((s) => `<span>${s}</span>`).join("")}</div>
  `;
  grid.appendChild(card);

  // subtle 3D tilt on hover, respects reduced-motion
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReduced) {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateY(0) rotateX(0) translateY(0)";
    });
  }
});

const eduList = document.getElementById("education-list");
education.forEach((e) => {
  const item = document.createElement("div");
  item.className = "edu-item";
  item.innerHTML = `
    <span class="edu-degree">${e.degree}</span>
    <span class="edu-date">${e.date}</span>
    <span class="edu-school">${e.school}</span>
    <span class="edu-detail">${e.detail}</span>
  `;
  eduList.appendChild(item);
});

// Radial skill hub — nodes arranged like blades around a hub,
// echoing the rotating-machinery theme without being literal
const ring = document.getElementById("skill-ring");
const nodeColors = ["var(--coral)", "var(--teal)", "var(--yellow)", "var(--pink)"];
const radius = 220;
skills.forEach((skill, i) => {
  const angle = (i / skills.length) * Math.PI * 2 - Math.PI / 2;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  const spoke = document.createElement("div");
  spoke.className = "skill-spoke";
  spoke.style.width = `${radius}px`;
  spoke.style.transform = `rotate(${angle}rad)`;
  ring.appendChild(spoke);

  const node = document.createElement("div");
  node.className = "skill-node";
  node.textContent = skill;
  node.style.setProperty("--node-color", nodeColors[i % nodeColors.length]);
  node.style.left = `calc(50% + ${x}px)`;
  node.style.top = `calc(50% + ${y}px)`;
  ring.appendChild(node);
});

/* ─────────────────────────────────────────────────────────────
   Hero scene — a kinetic sculpture, not an engine: a painted
   torus knot (color flowing around it like a brush stroke) with
   small satellite particles orbiting in their own orbits. A nod
   to art + code rather than turbine hardware.
──────────────────────────────────────────────────────────────*/
const canvas = document.getElementById("hero-canvas");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0.4, 8.5);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

// lighting: a few colored points so the playful palette reads in 3D
const ambient = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambient);

const lightCoral = new THREE.PointLight(0xff6b4a, 18, 20);
lightCoral.position.set(4, 3, 4);
scene.add(lightCoral);

const lightTeal = new THREE.PointLight(0x2de1c2, 14, 20);
lightTeal.position.set(-4, -2, 3);
scene.add(lightTeal);

const lightPink = new THREE.PointLight(0xff3d8a, 10, 20);
lightPink.position.set(0, -3, -3);
scene.add(lightPink);

// the sculpture group holds the knot and its orbiting particles
const sculpture = new THREE.Group();
scene.add(sculpture);

const palette = [
  new THREE.Color(0xff6b4a), // coral
  new THREE.Color(0x2de1c2), // teal
  new THREE.Color(0xffd23f), // yellow
  new THREE.Color(0xff3d8a), // pink
];

// painted torus knot: vertex colors sweep through the palette
// around the knot so it reads like a single flowing brush stroke
const knotGeo = new THREE.TorusKnotGeometry(1.3, 0.4, 220, 32, 2, 3);
const posAttr = knotGeo.attributes.position;
const vColors = new Float32Array(posAttr.count * 3);
const v = new THREE.Vector3();
for (let i = 0; i < posAttr.count; i++) {
  v.fromBufferAttribute(posAttr, i);
  const t = (Math.atan2(v.z, v.x) + Math.PI) / (Math.PI * 2); // 0..1 around the knot
  const scaled = t * palette.length;
  const a = palette[Math.floor(scaled) % palette.length];
  const b = palette[(Math.floor(scaled) + 1) % palette.length];
  const c = a.clone().lerp(b, scaled - Math.floor(scaled));
  vColors[i * 3] = c.r;
  vColors[i * 3 + 1] = c.g;
  vColors[i * 3 + 2] = c.b;
}
knotGeo.setAttribute("color", new THREE.BufferAttribute(vColors, 3));

const knotMat = new THREE.MeshStandardMaterial({
  vertexColors: true,
  roughness: 0.3,
  metalness: 0.2,
  emissive: 0xffffff,
  emissiveIntensity: 0.05,
});
const knot = new THREE.Mesh(knotGeo, knotMat);
sculpture.add(knot);

// satellite particles — small orbiting points of color, each on
// its own tilted, offset orbit around the knot
const orbitGroup = new THREE.Group();
sculpture.add(orbitGroup);

const ORBITER_COUNT = 16;
const orbiters = [];
for (let i = 0; i < ORBITER_COUNT; i++) {
  const color = palette[i % palette.length];
  const geo = new THREE.IcosahedronGeometry(0.06 + Math.random() * 0.035, 0);
  const mat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.5,
    roughness: 0.4,
    metalness: 0.1,
  });
  const mesh = new THREE.Mesh(geo, mat);
  const orbiter = {
    mesh,
    radius: 2.15 + Math.random() * 0.7,
    speed: 0.14 + Math.random() * 0.22,
    phase: Math.random() * Math.PI * 2,
    tilt: (Math.random() - 0.5) * 2.4,
  };
  orbiters.push(orbiter);
  orbitGroup.add(mesh);
}

sculpture.rotation.x = 0.3;
sculpture.scale.setScalar(0.001); // start collapsed for entrance animation

// entrance animation
let entranceStart = null;
function animateEntrance(ts) {
  if (entranceStart === null) entranceStart = ts;
  const t = Math.min((ts - entranceStart) / 1200, 1);
  const eased = 1 - Math.pow(1 - t, 3);
  sculpture.scale.setScalar(0.001 + eased * 0.999);
  sculpture.rotation.y = -Math.PI * 0.6 * (1 - eased);
  if (t < 1) requestAnimationFrame(animateEntrance);
}
requestAnimationFrame(animateEntrance);

// mouse parallax
let mouseX = 0;
let mouseY = 0;
let targetRotY = 0;
let targetRotX = 0.3;

window.addEventListener("pointermove", (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  targetRotY = mouseX * 0.35;
  targetRotX = 0.3 + mouseY * 0.15;
});

// scroll-driven drift so the sculpture still feels alive while reading
let scrollT = 0;
window.addEventListener(
  "scroll",
  () => {
    scrollT = Math.min(window.scrollY / window.innerHeight, 1);
  },
  { passive: true }
);

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
window.addEventListener("resize", resize);

const clock = new THREE.Clock();

function tick() {
  const dt = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  if (!prefersReducedMotion) {
    sculpture.rotation.z += dt * 0.09; // slow tumble, like a mobile turning in still air
    knot.rotation.x += dt * 0.05;
    sculpture.rotation.y += (targetRotY - sculpture.rotation.y) * 0.04;
    sculpture.rotation.x += (targetRotX - sculpture.rotation.x) * 0.04;

    orbiters.forEach((o) => {
      const a = elapsed * o.speed + o.phase;
      o.mesh.position.set(Math.cos(a) * o.radius, Math.sin(a * 0.6) * o.tilt, Math.sin(a) * o.radius);
    });
  }

  sculpture.position.y = -scrollT * 1.4;
  sculpture.position.z = -scrollT * 2.2;
  camera.position.x = Math.sin(elapsed * 0.05) * 0.15;

  knotMat.emissiveIntensity = 0.05 + Math.sin(elapsed * 1.1) * 0.03;

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

/* ─────────────────────────────────────────────────────────────
   Scroll reveal for sections
──────────────────────────────────────────────────────────────*/
const revealTargets = document.querySelectorAll(".card, .edu-item, .section-head, #skill-hub, #contact h2, .contact-links");
revealTargets.forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(24px)";
  el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
});

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealTargets.forEach((el) => io.observe(el));

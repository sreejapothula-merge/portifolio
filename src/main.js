import "./style.css";
import * as THREE from "three";
import { profile, projects, skills } from "./content.js";

/* ─────────────────────────────────────────────────────────────
   Content injection
──────────────────────────────────────────────────────────────*/
document.title = `${profile.name} — Portfolio`;
document.getElementById("hero-name").innerHTML = `Hi, I'm <span class="accent-coral">${profile.name}</span>`;
document.getElementById("hero-role").textContent = profile.role;
document.getElementById("hero-tagline").textContent = profile.tagline;

document.getElementById("contact-email").href = `mailto:${profile.email}`;
document.getElementById("contact-github").href = profile.github;
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
   Hero scene — a rotating "blade hub": abstract twisted-blade
   geometry arranged radially, colored with the site's playful
   accent palette. Nods to gas-turbine rotor geometry without
   attempting a literal render of one.
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

// the hub group holds all blades and rotates as a whole
const hub = new THREE.Group();
scene.add(hub);

const bladeColors = [0xff6b4a, 0x2de1c2, 0xffd23f, 0xff3d8a];
const BLADE_COUNT = 9;
const blades = [];

for (let i = 0; i < BLADE_COUNT; i++) {
  // a twisted, tapered blade made from a stretched, curved box
  const geo = new THREE.BoxGeometry(0.34, 2.6, 0.06, 4, 20, 1);
  const pos = geo.attributes.position;
  for (let v = 0; v < pos.count; v++) {
    const y = pos.getY(v);
    const t = (y + 1.3) / 2.6; // 0 at base .. 1 at tip
    const twist = t * 1.1;
    const x0 = pos.getX(v);
    const z0 = pos.getZ(v);
    const cosT = Math.cos(twist);
    const sinT = Math.sin(twist);
    pos.setX(v, x0 * cosT - z0 * sinT);
    pos.setZ(v, x0 * sinT + z0 * cosT);
    // taper the tip slightly
    pos.setX(v, pos.getX(v) * (1 - t * 0.35));
  }
  geo.computeVertexNormals();

  const color = bladeColors[i % bladeColors.length];
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.35,
    metalness: 0.15,
    emissive: color,
    emissiveIntensity: 0.12,
  });

  const blade = new THREE.Mesh(geo, mat);
  const angle = (i / BLADE_COUNT) * Math.PI * 2;
  blade.position.set(Math.cos(angle) * 1.15, 0, Math.sin(angle) * 1.15);
  blade.rotation.y = -angle + Math.PI / 2;
  blade.rotation.z = 0.18;
  hub.add(blade);
  blades.push(blade);
}

// central hub sphere
const coreGeo = new THREE.IcosahedronGeometry(0.85, 2);
const coreMat = new THREE.MeshStandardMaterial({
  color: 0x1c1a3f,
  roughness: 0.2,
  metalness: 0.4,
  emissive: 0xff3d8a,
  emissiveIntensity: 0.08,
});
const core = new THREE.Mesh(coreGeo, coreMat);
hub.add(core);

hub.rotation.x = 0.3;
hub.scale.setScalar(0.001); // start collapsed for entrance animation

// entrance animation
let entranceStart = null;
function animateEntrance(ts) {
  if (entranceStart === null) entranceStart = ts;
  const t = Math.min((ts - entranceStart) / 1200, 1);
  const eased = 1 - Math.pow(1 - t, 3);
  hub.scale.setScalar(0.001 + eased * 0.999);
  hub.rotation.y = -Math.PI * 0.6 * (1 - eased);
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

// scroll-driven drift so the hub still feels alive while reading
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
    hub.rotation.z += dt * 0.18; // continuous idle spin, like a turbine at low idle
    hub.rotation.y += (targetRotY - hub.rotation.y) * 0.04;
    hub.rotation.x += (targetRotX - hub.rotation.x) * 0.04;
  }

  hub.position.y = -scrollT * 1.4;
  hub.position.z = -scrollT * 2.2;
  camera.position.x = Math.sin(elapsed * 0.05) * 0.15;

  blades.forEach((b, i) => {
    b.material.emissiveIntensity = 0.1 + Math.sin(elapsed * 1.4 + i) * 0.05;
  });

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

/* ─────────────────────────────────────────────────────────────
   Scroll reveal for sections
──────────────────────────────────────────────────────────────*/
const revealTargets = document.querySelectorAll(".card, .section-head, #skill-hub, #contact h2, .contact-links");
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

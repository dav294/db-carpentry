/* ============================================================
   DB CARPENTRY — SCENE.JS
   Floating sawdust particle system — Three.js r160
   ============================================================ */

import * as THREE from 'three';

const canvas = document.getElementById('hero-canvas');
if (!canvas) throw new Error('hero-canvas not found');

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 80);
camera.position.z = 5;

const COUNT = 900;
const positions = new Float32Array(COUNT * 3);
const speeds    = new Float32Array(COUNT);
const phaseOff  = new Float32Array(COUNT);

for (let i = 0; i < COUNT; i++) {
  positions[i * 3    ] = (Math.random() - 0.5) * 22;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  speeds[i]   = 0.15 + Math.random() * 0.3;
  phaseOff[i] = Math.random() * Math.PI * 2;
}

const geo = new THREE.BufferGeometry();
geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const mat = new THREE.PointsMaterial({
  size: 0.04,
  color: new THREE.Color(0x6BAE7A),
  transparent: true,
  opacity: 0.48,
  sizeAttenuation: true,
});

const particles = new THREE.Points(geo, mat);
scene.add(particles);

const origPos = positions.slice();

function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
resize();
window.addEventListener('resize', resize);

let mx = 0, my = 0;
window.addEventListener('mousemove', e => {
  mx = (e.clientX / innerWidth  - 0.5) * 2;
  my = (e.clientY / innerHeight - 0.5) * 2;
}, { passive: true });

const posAttr = geo.attributes.position;
const clock   = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  for (let i = 0; i < COUNT; i++) {
    const sp  = speeds[i];
    const off = phaseOff[i];
    posAttr.array[i * 3    ] = origPos[i * 3    ] + Math.sin(t * sp + off) * 0.2;
    posAttr.array[i * 3 + 1] = origPos[i * 3 + 1] + Math.cos(t * sp * 0.7 + off * 1.3) * 0.16;
    posAttr.array[i * 3 + 2] = origPos[i * 3 + 2] + Math.sin(t * sp * 0.5 + off * 0.8) * 0.1;
  }
  posAttr.needsUpdate = true;

  camera.position.x += (mx * 0.2 - camera.position.x) * 0.04;
  camera.position.y += (-my * 0.12 - camera.position.y) * 0.04;
  camera.rotation.z  = t * 0.005;

  renderer.render(scene, camera);
}
animate();

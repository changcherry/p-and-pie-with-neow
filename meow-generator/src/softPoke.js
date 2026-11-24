import * as THREE from 'three';

/**
 * 軟體抓捏形變系統。
 * 每個"抓點"= 世界座標錨點 + 三維偏移向量：
 *   - 戳：偏移沿視線壓進去
 *   - 捏臉頰：偏移跟隨鼠標左右扯（外部負責限幅）
 *   - 提後頸：皮膚局部上提（整貓位移由 main 負責）
 * 頂點著色器裡以錨點為中心做高斯衰減位移 + 法線方向的體積擠出環；
 * 五官等獨立小件由 JS 側用同一公式計算偏移，保證不陷進模型。
 * 鬆手後偏移向量做欠阻尼彈簧回零（果凍回彈）。
 */

export const MAX_POKES = 6;

export const pokeUniforms = {
  uPokePos: { value: Array.from({ length: MAX_POKES }, () => new THREE.Vector3(0, -99, 0)) },
  uPokeOff: { value: Array.from({ length: MAX_POKES }, () => new THREE.Vector3()) },
  uPokeRadius: { value: 0.42 },
};

const GLSL_DECL = `
uniform vec3 uPokePos[${MAX_POKES}];
uniform vec3 uPokeOff[${MAX_POKES}];
uniform float uPokeRadius;
`;

// 貓組只有整體平移/縮放，形變在 object space 做即可；normal 屬性所有內置材質都有
const GLSL_APPLY = `
for (int pi = 0; pi < ${MAX_POKES}; pi++) {
  float amp = length(uPokeOff[pi]);
  if (amp < 1e-4) continue;
  float pd = distance(transformed, uPokePos[pi]);
  float r = uPokeRadius;
  float dent = exp(-(pd * pd) / (r * r));
  float bodyDrag = exp(-(pd * pd) / (r * r * 4.2));
  float ring = exp(-pow(pd - r * 1.7, 2.0) / (r * r * 0.62));
  transformed += uPokeOff[pi] * dent;
  transformed += uPokeOff[pi] * (bodyDrag * 0.24);
  transformed += normal * (amp * 0.34 * ring);
}
`;

// 往任意 three 內置材質的頂點著色器裡注入形變
export function injectPoke(material) {
  const prev = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    if (prev) prev(shader, renderer);
    Object.assign(shader.uniforms, pokeUniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${GLSL_DECL}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>\n${GLSL_APPLY}`);
  };
  material.customProgramCacheKey = () => 'poke';
  return material;
}

// JS 側同款位移（五官小件用）。normalDir 傳小件的表面外法線以獲得擠出環項，
// 缺省可傳 null 只算主凹陷。
export function pokeOffsetAt(point, normalDir, out) {
  out.set(0, 0, 0);
  const r = pokeUniforms.uPokeRadius.value;
  for (let i = 0; i < MAX_POKES; i++) {
    const off = pokeUniforms.uPokeOff.value[i];
    const amp = off.length();
    if (amp < 1e-4) continue;
    const d = point.distanceTo(pokeUniforms.uPokePos.value[i]);
    const dent = Math.exp(-(d * d) / (r * r));
    out.addScaledVector(off, dent);
    const bodyDrag = Math.exp(-(d * d) / (r * r * 4.2));
    out.addScaledVector(off, bodyDrag * 0.24);
    if (normalDir) {
      const ring = Math.exp(-((d - r * 1.7) ** 2) / (r * r * 0.62));
      out.addScaledVector(normalDir, amp * 0.34 * ring);
    }
  }
  return out;
}

// ---------------------------------------------------------------- 彈簧手感
export const pokeFeel = {
  maxDepth: 0.15,  // 戳的力度：按到底的凹陷深度
  freq: 4.2,       // 軟硬：回彈振盪頻率 Hz（越高越"硬"）
  damping: 0.075,  // Q 彈：阻尼比（越小抖越久）
};

const slots = Array.from({ length: MAX_POKES }, () => ({
  active: false, pressing: false,
  off: new THREE.Vector3(), vel: new THREE.Vector3(), target: new THREE.Vector3(),
}));
const pulseDirection = new THREE.Vector3();
const springAcceleration = new THREE.Vector3();

function quietestSlot() {
  return slots.find((s) => !s.active)
    ?? slots.reduce((a, b) => (
      a.off.lengthSq() + a.vel.lengthSq() < b.off.lengthSq() + b.vel.lengthSq()
        ? a
        : b
    ));
}

function activateSlot(slot, point, pressing) {
  const i = slots.indexOf(slot);
  slot.active = true;
  slot.pressing = pressing;
  slot.target.set(0, 0, 0);
  pokeUniforms.uPokePos.value[i].copy(point);
  return i;
}

export function beginGrab(point) {
  return activateSlot(quietestSlot(), point, true);
}

/**
 * Immediate rua feedback for taps and fast strokes.
 * Nearby repeated impacts reuse the same spring and accumulate energy, while
 * hard limits keep rapid clicking from tearing the surface apart.
 */
export function pulsePoke(point, inwardDirection, strength = 1) {
  const reuseDistanceSq = (pokeUniforms.uPokeRadius.value * 0.62) ** 2;
  let slot = slots.find((candidate, index) => (
    candidate.active
    && !candidate.pressing
    && pokeUniforms.uPokePos.value[index].distanceToSquared(point) < reuseDistanceSq
  ));
  const reusing = !!slot;
  slot ??= quietestSlot();
  const i = slots.indexOf(slot);
  if (reusing) {
    slot.active = true;
    slot.pressing = false;
    slot.target.set(0, 0, 0);
    pokeUniforms.uPokePos.value[i].lerp(point, 0.45);
  } else {
    activateSlot(slot, point, false);
  }

  const direction = pulseDirection.copy(inwardDirection);
  if (direction.lengthSq() < 1e-6) direction.set(0, 0, -1);
  else direction.normalize();

  const impact = pokeFeel.maxDepth * THREE.MathUtils.clamp(
    0.72 + strength * 0.45,
    0.68,
    1.65
  );
  if (reusing) {
    slot.off.addScaledVector(direction, impact * 0.62);
    slot.vel.addScaledVector(direction, impact * pokeFeel.freq * 2.2);
  } else {
    slot.off.copy(direction).multiplyScalar(impact);
    slot.vel.copy(direction).multiplyScalar(impact * pokeFeel.freq * 1.65);
  }

  const maxOffset = pokeFeel.maxDepth * 2.05;
  const maxVelocity = pokeFeel.maxDepth * pokeFeel.freq * 4.8;
  if (slot.off.length() > maxOffset) slot.off.setLength(maxOffset);
  if (slot.vel.length() > maxVelocity) slot.vel.setLength(maxVelocity);
  pokeUniforms.uPokeOff.value[i].copy(slot.off);
  return i;
}

export function setGrabPoint(i, point) {
  if (i < 0 || !slots[i].active) return;
  pokeUniforms.uPokePos.value[i].copy(point);
}

export function setGrabTarget(i, targetOffset) {
  if (i < 0 || !slots[i].active) return;
  slots[i].target.copy(targetOffset);
}

export function endGrab(i) {
  if (i < 0) return;
  slots[i].pressing = false;
}

export function updatePokes(dt) {
  dt = Math.min(dt, 1 / 30);
  const w = 2 * Math.PI * pokeFeel.freq;
  for (let i = 0; i < MAX_POKES; i++) {
    const s = slots[i];
    if (!s.active) continue;
    if (s.pressing) {
      // 跟手：快速趨近目標，不振盪
      s.off.lerp(s.target, Math.min(1, dt * 16));
      s.vel.set(0, 0, 0);
    } else {
      // 欠阻尼向量彈簧回零
      springAcceleration
        .copy(s.off)
        .multiplyScalar(-w * w)
        .addScaledVector(s.vel, -2 * pokeFeel.damping * w);
      s.vel.addScaledVector(springAcceleration, dt);
      s.off.addScaledVector(s.vel, dt);
      if (s.off.lengthSq() < 2.5e-7 && s.vel.lengthSq() < 2.5e-5) {
        s.active = false;
        s.off.set(0, 0, 0);
        s.vel.set(0, 0, 0);
        pokeUniforms.uPokePos.value[i].set(0, -99, 0);
      }
    }
    pokeUniforms.uPokeOff.value[i].copy(s.off);
  }
}

export function anyPokeActive() {
  return slots.some((s) => s.active);
}

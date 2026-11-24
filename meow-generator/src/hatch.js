import * as THREE from 'three';

/**
 * 手繪排線系統（地面影子 + 貓身暗面）。
 * 兩套完全獨立的線條參數：
 *   影子排線：uHatch*（樣式 / 粗細 / 密度 / 抖動 / 傾斜）
 *   身上排線：uBody*（同一組參數，獨立調節）
 * 屏幕對齊開關 uHatchScreen：開啟後線條方向鎖定屏幕，轉鏡頭時所有排線始終朝同一方向傾斜。
 * 貓身暗面色塊：uShadeColor 乘色 + uShadeAlpha 濃度。
 */

export const hatchUniforms = {
  // —— 影子排線 ——
  uHatchFreq: { value: 130.0 },
  uHatchWidth: { value: 0.88 },   // 閾值越高線越細（UI 用 0.95-粗細 映射）
  uHatchJitter: { value: 0.06 },
  uHatchStyle: { value: 0 },      // 0 平行線 / 1 虛線
  uHatchAngle: { value: Math.PI / 4 },
  uHatchDashStretch: { value: 1.0 },
  uGroundShadowColor: { value: new THREE.Color('#9e8a70') },
  uGroundShadowAlpha: { value: 0.24 },
  uGroundHatchColor: { value: new THREE.Color('#5f4d3e') },
  uGroundHatchAlpha: { value: 0.58 },
  // —— 身上排線 ——
  uBodyFreq: { value: 130.0 },
  uBodyWidth: { value: 0.88 },
  uBodyJitter: { value: 0.06 },
  uBodyStyle: { value: 0 },
  uBodyAngle: { value: Math.PI / 4 },
  uBodyDashStretch: { value: 1.0 },
  uBodyHatch: { value: 0.3 },     // 身上排線濃度
  // —— 貓身暗面色塊 ——
  uShadeAlpha: { value: 0.5 },
  uShadeColor: { value: new THREE.Color('#cfc2b8') },
  // —— 屏幕對齊 ——
  uHatchScreen: { value: 0 },     // 0 世界空間 / 1 屏幕空間（跟隨鏡頭）
  uScreenScale: { value: 1 / 400 }, // gl_FragCoord 像素 → 排線座標（每幀按緩衝高度更新）
  // —— 主光方向 ——
  uKeyDir: { value: new THREE.Vector3(3.2, 5.5, 4.2).normalize() },
};

// 樣式只決定連續或斷續；粗細、密度、抖動、傾斜由兩種樣式共享。
export const HATCH_PRESETS = [
  { id: 0, name: '平行線' },
  { id: 1, name: '虛線' },
];

// 共用 GLSL：參數化的線條函數（q 為排線平面二維座標）
export const HATCH_GLSL = `
uniform int uHatchScreen;
uniform float uScreenScale;
float hatchLineF(float coord, float wob, float freq, float width) {
  float w = sin(coord * freq + wob) * 0.5 + 0.5;
  return smoothstep(width, min(width + 0.22, 1.0), w);
}
float hatchPatternF(
  vec2 q,
  float freq,
  float width,
  float jitter,
  float angle,
  int style,
  float dashStretch
) {
  // 旋轉排線座標系：r.x 沿線方向，r.y 跨線方向
  float ca = cos(angle), sa = sin(angle);
  vec2 r = vec2(q.x * ca + q.y * sa, -q.x * sa + q.y * ca);
  // 雙頻正弦擾動模擬手繪線的波浪抖動
  float wobble = (sin(r.y * 17.3 + r.x * 5.1) * 0.6
                + sin((r.x + r.y) * 43.7) * 0.4) * jitter * 8.0;
  if (style == 0) {
    return hatchLineF(r.y, wobble, freq, width);
  }
  // 一長一短交替的斷續虛線：長劃:短劃 = 3:1，隔行錯開半個週期（磚縫式）
  float line = hatchLineF(r.y * 1.2, wobble * 0.6, freq, width);
  float lc = r.y * 1.2 * freq + wobble * 0.6;
  float row = floor((lc - 1.5707963) / 6.2831853 + 0.5);
  float t = fract(
    r.x * freq * 0.1 / max(dashStretch, 0.05)
    + wobble * 0.03
    + row * 0.5
  );
  float dash = smoothstep(0.0, 0.02, t) * (1.0 - smoothstep(0.45, 0.47, t))   // 長劃 0.45
             + smoothstep(0.57, 0.59, t) * (1.0 - smoothstep(0.72, 0.74, t)); // 短劃 0.15
  return line * clamp(dash, 0.0, 1.0);
}
`;

// 地毯曲面直接接收真實 ShadowMap，再在同一曲面上疊加排線。
// 不使用懸空平面或接觸陰影貼片，因此不會在貓腳附近形成深度衝突和鏤空環。
export function injectGroundHatch(material) {
  const prev = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    if (prev) prev(shader, renderer);
    Object.assign(shader.uniforms, hatchUniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vGroundHatchPos;')
      .replace(
        '#include <project_vertex>',
        `vGroundHatchPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
         #include <project_vertex>`
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <shadowmap_pars_fragment>',
        '#include <shadowmap_pars_fragment>\n#include <shadowmask_pars_fragment>'
      )
      .replace(
        '#include <common>',
        `#include <common>
         varying vec3 vGroundHatchPos;
         uniform vec3 uGroundShadowColor;
         uniform float uGroundShadowAlpha;
         uniform vec3 uGroundHatchColor;
         uniform float uGroundHatchAlpha;
         uniform float uHatchFreq;
         uniform float uHatchWidth;
         uniform float uHatchJitter;
         uniform int uHatchStyle;
         uniform float uHatchAngle;
         uniform float uHatchDashStretch;
         ${HATCH_GLSL}`
      )
      .replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>
         {
           float groundShadow = 0.0;
           #if defined( USE_SHADOWMAP )
             // 將 ShadowMap 的邊緣明確二值化，避免不同接收材質重新帶回灰色羽化。
             groundShadow = step(0.5, clamp(1.0 - getShadowMask(), 0.0, 1.0));
           #endif
           // 色塊只在真實投影里乘色，不再鋪一層獨立的灰色橢圓。
           gl_FragColor.rgb = mix(
             gl_FragColor.rgb,
             gl_FragColor.rgb * uGroundShadowColor,
             groundShadow * uGroundShadowAlpha
           );
           vec2 q = uHatchScreen == 1
             ? gl_FragCoord.xy * uScreenScale
             : vec2(vGroundHatchPos.x, vGroundHatchPos.z);
           float line = hatchPatternF(
             q,
             uHatchFreq,
             uHatchWidth,
             uHatchJitter,
             uHatchAngle,
             uHatchStyle,
             uHatchDashStretch
           );
           gl_FragColor.rgb = mix(
             gl_FragColor.rgb,
             gl_FragColor.rgb * uGroundHatchColor * 0.78,
             line * groundShadow * uGroundHatchAlpha
           );
         }`
      );
  };
  material.customProgramCacheKey = () => 'rug-ground-shadow-hatch-v1';
  return material;
}

// 貓身暗面：注入 MeshToonMaterial。
// 暗面色塊（uShadeColor/uShadeAlpha）+ 獨立參數的排線（uBody*）。
export function injectBodyHatch(material) {
  const prev = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    if (prev) prev(shader, renderer);
    Object.assign(shader.uniforms, hatchUniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vHatchPos;\nvarying vec3 vHatchN;')
      .replace(
        '#include <project_vertex>',
        `vHatchPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
         vHatchN = normalize(mat3(modelMatrix) * objectNormal);
         #include <project_vertex>`
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
         varying vec3 vHatchPos;
         varying vec3 vHatchN;
         uniform float uBodyFreq;
         uniform float uBodyWidth;
         uniform float uBodyJitter;
         uniform int uBodyStyle;
         uniform float uBodyAngle;
         uniform float uBodyDashStretch;
         uniform float uBodyHatch;
         uniform float uShadeAlpha;
         uniform vec3 uShadeColor;
         uniform vec3 uKeyDir;
         ${HATCH_GLSL}`
      )
      .replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>
         {
            float dnl = dot(normalize(vHatchN), uKeyDir);
            // 二次元硬切：不再用 smoothstep 在明暗交界製造灰色過渡帶。
            float darkM = 1.0 - step(0.02, dnl);
           // 暗面色塊：底色乘 uShadeColor，濃度 uShadeAlpha 可調
           gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * uShadeColor, darkM * uShadeAlpha);
           // 排線座標：世界空間用身體表面 x/y 混合座標；屏幕空間直接用像素座標（跟隨鏡頭）
           vec2 q = uHatchScreen == 1
             ? gl_FragCoord.xy * uScreenScale
             : vec2(vHatchPos.x * 0.8 + vHatchPos.z * 0.3, vHatchPos.y);
           float bl = hatchPatternF(
             q,
             uBodyFreq,
             uBodyWidth,
             uBodyJitter,
             uBodyAngle,
             uBodyStyle,
             uBodyDashStretch
           );
           gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * uShadeColor * 0.82, bl * darkM * uBodyHatch);
         }`
      );
  };
  return material;
}

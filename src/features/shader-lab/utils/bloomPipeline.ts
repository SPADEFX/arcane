import * as THREE from "three";
import { FULLSCREEN_VERT } from "./shaders";

const COPY_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  void main() { gl_FragColor = texture2D(uTex, vUv); }
`;

const PROGRESSIVE_COMPOSITE_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uSharp;
  uniform sampler2D uBlurred;
  uniform float uAngle;
  uniform float uStart;
  uniform float uEnd;
  uniform float uCurve;
  uniform float uOpacity;
  uniform int uBlendMode;
  vec3 applyBlendP(vec3 base, vec3 src, int m){
    if(m == 1) return base * src;
    if(m == 2) return 1.0 - (1.0 - base) * (1.0 - src);
    return src;
  }
  void main() {
    vec2 axis = vec2(cos(uAngle), sin(uAngle));
    float t = dot(vUv - 0.5, axis) + 0.5;
    float ramp = smoothstep(uStart, uEnd, t);
    ramp = pow(ramp, uCurve);
    vec3 sharp = texture2D(uSharp, vUv).rgb;
    vec3 blurred = texture2D(uBlurred, vUv).rgb;
    vec3 col = mix(sharp, blurred, ramp);
    vec3 blended = applyBlendP(sharp, col, uBlendMode);
    gl_FragColor = vec4(mix(sharp, blended, uOpacity), 1.0);
  }
`;

const TILT_COMPOSITE_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uSharp;
  uniform sampler2D uBlurred;
  uniform float uFocus;
  uniform float uWidth;
  uniform float uFalloff;
  uniform int uDirection;
  uniform float uDesaturate;
  uniform float uOpacity;
  uniform int uBlendMode;
  vec3 applyBlendT(vec3 base, vec3 src, int m){
    if(m == 1) return base * src;
    if(m == 2) return 1.0 - (1.0 - base) * (1.0 - src);
    return src;
  }
  void main() {
    float d;
    if(uDirection == 0) d = abs(vUv.y - uFocus);
    else if(uDirection == 1) d = abs(vUv.x - uFocus);
    else d = length(vUv - vec2(0.5, uFocus));
    float m = smoothstep(uWidth, uWidth + uFalloff, d);
    vec3 sharp = texture2D(uSharp, vUv).rgb;
    vec3 blurred = texture2D(uBlurred, vUv).rgb;
    vec3 col = mix(sharp, blurred, m);
    float L = dot(col, vec3(0.2126, 0.7152, 0.0722));
    col = mix(col, vec3(L), uDesaturate * m);
    vec3 blended = applyBlendT(sharp, col, uBlendMode);
    gl_FragColor = vec4(mix(sharp, blended, uOpacity), 1.0);
  }
`;

const BRIGHT_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform float uThresh;
  uniform float uKnee;
  void main() {
    vec3 c = texture2D(uTex, vUv).rgb;
    float l = max(max(c.r, c.g), c.b);
    float soft = smoothstep(uThresh - uKnee * 0.5, uThresh + uKnee * 0.5, l);
    gl_FragColor = vec4(c * soft, 1.0);
  }
`;

// Kawase dual-filter down: 5-tap (center ×4 + 4 diagonals ×1)
const DOWN_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform vec2 uTexel;
  void main() {
    vec4 sum = texture2D(uTex, vUv) * 4.0;
    sum += texture2D(uTex, vUv - uTexel);
    sum += texture2D(uTex, vUv + uTexel);
    sum += texture2D(uTex, vUv + vec2(uTexel.x, -uTexel.y));
    sum += texture2D(uTex, vUv - vec2(uTexel.x, -uTexel.y));
    gl_FragColor = sum / 8.0;
  }
`;

// Kawase dual-filter up: 8-tap (4 axis ×1 + 4 diagonals ×2)
const UP_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform vec2 uTexel;
  void main() {
    vec4 sum = texture2D(uTex, vUv + vec2(-uTexel.x * 2.0, 0.0));
    sum += texture2D(uTex, vUv + vec2(-uTexel.x, uTexel.y)) * 2.0;
    sum += texture2D(uTex, vUv + vec2(0.0, uTexel.y * 2.0));
    sum += texture2D(uTex, vUv + vec2(uTexel.x, uTexel.y)) * 2.0;
    sum += texture2D(uTex, vUv + vec2(uTexel.x * 2.0, 0.0));
    sum += texture2D(uTex, vUv + vec2(uTexel.x, -uTexel.y)) * 2.0;
    sum += texture2D(uTex, vUv + vec2(0.0, -uTexel.y * 2.0));
    sum += texture2D(uTex, vUv + vec2(-uTexel.x, -uTexel.y)) * 2.0;
    gl_FragColor = sum / 12.0;
  }
`;

const COMPOSITE_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uBackground;
  uniform sampler2D uBloom;
  uniform float uStrength;
  uniform vec3 uTint;
  uniform float uOpacity;
  uniform int uBlendMode;
  vec3 applyBlend(vec3 base, vec3 src, int m){
    if(m == 1) return base * src;
    if(m == 2) return 1.0 - (1.0 - base) * (1.0 - src);
    if(m == 3) return mix(2.0*base*src, 1.0 - 2.0*(1.0-base)*(1.0-src), step(0.5, base));
    if(m == 4) return max(base, src);
    if(m == 5) return min(base, src);
    if(m == 6) return min(base + src, vec3(1.0));
    return src;
  }
  void main() {
    vec3 base = texture2D(uBackground, vUv).rgb;
    vec3 bloom = texture2D(uBloom, vUv).rgb;
    vec3 added = base + bloom * uStrength * uTint;
    vec3 blended = applyBlend(base, added, uBlendMode);
    gl_FragColor = vec4(mix(base, blended, uOpacity), 1.0);
  }
`;

export interface BloomPipeline {
  brightMat: THREE.RawShaderMaterial;
  copyMat: THREE.RawShaderMaterial;
  downMat: THREE.RawShaderMaterial;
  upMat: THREE.RawShaderMaterial;
  compositeMat: THREE.RawShaderMaterial;
  tiltMat: THREE.RawShaderMaterial;
  progMat: THREE.RawShaderMaterial;
  geom: THREE.BufferGeometry;
  scene: THREE.Scene;
  quad: THREE.Mesh<THREE.BufferGeometry, THREE.Material>;
  camera: THREE.Camera;
}

export function createBloomPipeline(): BloomPipeline {
  const geom = new THREE.BufferGeometry();
  const verts = new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0]);
  const uvs = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]);
  geom.setAttribute("position", new THREE.BufferAttribute(verts, 3));
  geom.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

  const brightMat = new THREE.RawShaderMaterial({
    vertexShader: FULLSCREEN_VERT,
    fragmentShader: BRIGHT_FRAG,
    uniforms: {
      uTex: { value: null },
      uThresh: { value: 0.6 },
      uKnee: { value: 0.5 },
    },
  });
  const downMat = new THREE.RawShaderMaterial({
    vertexShader: FULLSCREEN_VERT,
    fragmentShader: DOWN_FRAG,
    uniforms: {
      uTex: { value: null },
      uTexel: { value: new THREE.Vector2() },
    },
  });
  const upMat = new THREE.RawShaderMaterial({
    vertexShader: FULLSCREEN_VERT,
    fragmentShader: UP_FRAG,
    uniforms: {
      uTex: { value: null },
      uTexel: { value: new THREE.Vector2() },
    },
  });
  const compositeMat = new THREE.RawShaderMaterial({
    vertexShader: FULLSCREEN_VERT,
    fragmentShader: COMPOSITE_FRAG,
    uniforms: {
      uBackground: { value: null },
      uBloom: { value: null },
      uStrength: { value: 1 },
      uTint: { value: new THREE.Vector3(1, 1, 1) },
      uOpacity: { value: 1 },
      uBlendMode: { value: 0 },
    },
  });
  const copyMat = new THREE.RawShaderMaterial({
    vertexShader: FULLSCREEN_VERT,
    fragmentShader: COPY_FRAG,
    uniforms: { uTex: { value: null } },
  });
  const tiltMat = new THREE.RawShaderMaterial({
    vertexShader: FULLSCREEN_VERT,
    fragmentShader: TILT_COMPOSITE_FRAG,
    uniforms: {
      uSharp: { value: null },
      uBlurred: { value: null },
      uFocus: { value: 0.5 },
      uWidth: { value: 0.15 },
      uFalloff: { value: 0.2 },
      uDirection: { value: 0 },
      uDesaturate: { value: 0 },
      uOpacity: { value: 1 },
      uBlendMode: { value: 0 },
    },
  });

  const quad = new THREE.Mesh(geom, brightMat as unknown as THREE.Material);
  const scene = new THREE.Scene();
  scene.add(quad);
  const camera = new THREE.Camera();

  const progMat = new THREE.RawShaderMaterial({
    vertexShader: FULLSCREEN_VERT,
    fragmentShader: PROGRESSIVE_COMPOSITE_FRAG,
    uniforms: {
      uSharp: { value: null },
      uBlurred: { value: null },
      uAngle: { value: Math.PI / 2 },
      uStart: { value: 0.2 },
      uEnd: { value: 0.9 },
      uCurve: { value: 1 },
      uOpacity: { value: 1 },
      uBlendMode: { value: 0 },
    },
  });
  return { brightMat, copyMat, downMat, upMat, compositeMat, tiltMat, progMat, geom, scene, quad, camera };
}

function runDownUp(
  renderer: THREE.WebGLRenderer,
  pipeline: BloomPipeline,
  chain: BloomMipChain,
  levels: number,
) {
  const { downMat, upMat, scene, camera, quad } = pipeline;
  const mips = chain.mips;
  for (let i = 1; i < levels; i++) {
    const src = mips[i - 1];
    const dst = mips[i];
    downMat.uniforms.uTex.value = src.texture;
    (downMat.uniforms.uTexel.value as THREE.Vector2).set(1 / src.width, 1 / src.height);
    quad.material = downMat as unknown as THREE.Material;
    renderer.setRenderTarget(dst);
    renderer.render(scene, camera);
  }
  for (let i = levels - 2; i >= 0; i--) {
    const src = mips[i + 1];
    const dst = mips[i];
    upMat.uniforms.uTex.value = src.texture;
    (upMat.uniforms.uTexel.value as THREE.Vector2).set(1 / src.width, 1 / src.height);
    quad.material = upMat as unknown as THREE.Material;
    renderer.setRenderTarget(dst);
    renderer.render(scene, camera);
  }
}

export function renderBlurToMip0(
  renderer: THREE.WebGLRenderer,
  pipeline: BloomPipeline,
  chain: BloomMipChain,
  source: THREE.Texture,
  radius01: number,
) {
  const { copyMat, scene, camera, quad } = pipeline;
  const mips = chain.mips;
  if (mips.length < 2) return;
  // Copy source to mips[0]
  copyMat.uniforms.uTex.value = source;
  quad.material = copyMat as unknown as THREE.Material;
  renderer.setRenderTarget(mips[0]);
  renderer.render(scene, camera);
  // Down/up chain sized by radius01
  const levels = Math.max(2, Math.min(mips.length, 2 + Math.floor(radius01 * (mips.length - 2) + 0.5)));
  runDownUp(renderer, pipeline, chain, levels);
}

export interface TiltShiftParams {
  focus: number;
  width: number;
  falloff: number;
  direction: number;
  desaturate: number;
  opacity: number;
  blendMode: number;
  radius01: number;
}

export function renderTiltShift(
  renderer: THREE.WebGLRenderer,
  pipeline: BloomPipeline,
  chain: BloomMipChain,
  source: THREE.Texture,
  target: THREE.WebGLRenderTarget | null,
  params: TiltShiftParams,
) {
  renderBlurToMip0(renderer, pipeline, chain, source, params.radius01);
  const { tiltMat, scene, camera, quad } = pipeline;
  tiltMat.uniforms.uSharp.value = source;
  tiltMat.uniforms.uBlurred.value = chain.mips[0].texture;
  tiltMat.uniforms.uFocus.value = params.focus;
  tiltMat.uniforms.uWidth.value = params.width;
  tiltMat.uniforms.uFalloff.value = params.falloff;
  tiltMat.uniforms.uDirection.value = params.direction;
  tiltMat.uniforms.uDesaturate.value = params.desaturate;
  tiltMat.uniforms.uOpacity.value = params.opacity;
  tiltMat.uniforms.uBlendMode.value = params.blendMode;
  quad.material = tiltMat as unknown as THREE.Material;
  renderer.setRenderTarget(target);
  renderer.render(scene, camera);
}

export interface BloomMipChain {
  mips: THREE.WebGLRenderTarget[];
  width: number;
  height: number;
}

export function createBloomMips(width: number, height: number, levels: number): BloomMipChain {
  const mips: THREE.WebGLRenderTarget[] = [];
  let w = Math.max(8, Math.floor(width / 2));
  let h = Math.max(8, Math.floor(height / 2));
  for (let i = 0; i < levels; i++) {
    mips.push(
      new THREE.WebGLRenderTarget(w, h, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.UnsignedByteType,
      }),
    );
    w = Math.max(4, Math.floor(w / 2));
    h = Math.max(4, Math.floor(h / 2));
  }
  return { mips, width, height };
}

export function resizeBloomMips(chain: BloomMipChain, width: number, height: number) {
  chain.width = width;
  chain.height = height;
  let w = Math.max(8, Math.floor(width / 2));
  let h = Math.max(8, Math.floor(height / 2));
  for (const rt of chain.mips) {
    rt.setSize(w, h);
    w = Math.max(4, Math.floor(w / 2));
    h = Math.max(4, Math.floor(h / 2));
  }
}

export function disposeBloomMips(chain: BloomMipChain) {
  chain.mips.forEach((rt) => rt.dispose());
}

export interface BloomParams {
  thresh: number;
  knee: number;
  radius: number; // 0..1 — controls how many mip levels contribute
  strength: number;
  tint: [number, number, number];
  opacity: number;
  blendMode: number;
}

export function renderBloom(
  renderer: THREE.WebGLRenderer,
  pipeline: BloomPipeline,
  chain: BloomMipChain,
  source: THREE.Texture,
  target: THREE.WebGLRenderTarget | null,
  params: BloomParams,
) {
  const { brightMat, compositeMat, scene, camera, quad } = pipeline;
  const mips = chain.mips;
  if (mips.length < 2) return;

  // 1. Bright pass into mips[0]
  brightMat.uniforms.uTex.value = source;
  brightMat.uniforms.uThresh.value = params.thresh;
  brightMat.uniforms.uKnee.value = params.knee;
  quad.material = brightMat as unknown as THREE.Material;
  renderer.setRenderTarget(mips[0]);
  renderer.render(scene, camera);

  // 2. Downsample + upsample chain
  const levels = Math.max(2, Math.min(mips.length, 2 + Math.floor(params.radius * (mips.length - 2) + 0.5)));
  runDownUp(renderer, pipeline, chain, levels);

  // 4. Composite: source + mips[0] -> target
  compositeMat.uniforms.uBackground.value = source;
  compositeMat.uniforms.uBloom.value = mips[0].texture;
  compositeMat.uniforms.uStrength.value = params.strength;
  (compositeMat.uniforms.uTint.value as THREE.Vector3).set(
    params.tint[0],
    params.tint[1],
    params.tint[2],
  );
  compositeMat.uniforms.uOpacity.value = params.opacity;
  compositeMat.uniforms.uBlendMode.value = params.blendMode;
  quad.material = compositeMat as unknown as THREE.Material;
  renderer.setRenderTarget(target);
  renderer.render(scene, camera);
}

export interface ProgressiveParams {
  angle: number;
  start: number;
  end: number;
  curve: number;
  radius01: number;
  opacity: number;
  blendMode: number;
}

export function renderProgressive(
  renderer: THREE.WebGLRenderer,
  pipeline: BloomPipeline,
  chain: BloomMipChain,
  source: THREE.Texture,
  target: THREE.WebGLRenderTarget | null,
  params: ProgressiveParams,
) {
  renderBlurToMip0(renderer, pipeline, chain, source, params.radius01);
  const { progMat, scene, camera, quad } = pipeline;
  progMat.uniforms.uSharp.value = source;
  progMat.uniforms.uBlurred.value = chain.mips[0].texture;
  progMat.uniforms.uAngle.value = params.angle;
  progMat.uniforms.uStart.value = params.start;
  progMat.uniforms.uEnd.value = params.end;
  progMat.uniforms.uCurve.value = params.curve;
  progMat.uniforms.uOpacity.value = params.opacity;
  progMat.uniforms.uBlendMode.value = params.blendMode;
  quad.material = progMat as unknown as THREE.Material;
  renderer.setRenderTarget(target);
  renderer.render(scene, camera);
}

export function disposeBloomPipeline(p: BloomPipeline) {
  p.brightMat.dispose();
  p.copyMat.dispose();
  p.downMat.dispose();
  p.upMat.dispose();
  p.compositeMat.dispose();
  p.tiltMat.dispose();
  p.progMat.dispose();
  p.geom.dispose();
}

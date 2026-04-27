import type { LayerKind } from "../types";

export const FULLSCREEN_VERT = /* glsl */ `
  attribute vec3 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const PREAMBLE = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uDuration;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec2 uMouseVel;
  uniform float uScroll;
  uniform float uOpacity;
  uniform int uBlendMode;
  uniform sampler2D uBackground;
  // 2π * speed * t / duration → seamless at loop boundary. Speed is snapped to
  // the nearest integer-cycles-per-scene so fractional speed values still loop.
  float loopPhase(float speed) {
    float n = max(1.0, floor(abs(speed) + 0.5));
    return sign(speed) * 6.2831853 * n * uTime / max(uDuration, 1e-4);
  }
  // Drop-in replacement for (k * uTime) inside sin/cos — snaps the effective
  // radian-rate so the expression completes an integer number of cycles per
  // uDuration, producing a seamless loop.
  float tMul(float k) {
    float n = max(1.0, floor(abs(k) * uDuration / 6.2831853 + 0.5));
    float kSnap = sign(k) * 6.2831853 * n / max(uDuration, 1e-4);
    return kSnap * uTime;
  }
  // Drop-in replacement for (rate * uTime) used inside floor() / hash seeds /
  // noise-domain offsets — snaps to an integer step count per scene so the
  // stepped animation wraps back to its starting state at uDuration.
  float tStep(float rate) {
    float n = max(1.0, floor(abs(rate) * uDuration + 0.5));
    return sign(rate) * n * (uTime / max(uDuration, 1e-4));
  }
`;

const HELPERS = /* glsl */ `
  float luma(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
  vec3 rgb2hsv(vec3 c){
    vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
  }
  vec3 hsv2rgb(vec3 c){
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
  float hash11(float x){ return fract(sin(x * 127.1) * 43758.5453); }
  float hash12(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  vec2 hash22(vec2 p){
    p = vec2(dot(p, vec2(127.1,311.7)), dot(p, vec2(269.5,183.3)));
    return fract(sin(p) * 43758.5453) * 2.0 - 1.0;
  }
  float vnoise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f*f*(3.0 - 2.0*f);
    float a = hash12(i), b = hash12(i + vec2(1.0,0.0));
    float c = hash12(i + vec2(0.0,1.0)), d = hash12(i + vec2(1.0,1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbmN(vec2 p, int oct, float gain){
    float v = 0.0, a = 0.5;
    for(int i = 0; i < 8; i++){
      if(i >= oct) break;
      v += a * vnoise(p);
      p *= 2.02;
      a *= gain;
    }
    return v;
  }
  float fbm(vec2 p){ return fbmN(p, 5, 0.5); }
  mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c,-s,s,c); }
  float bmLum(vec3 c){ return 0.3*c.r + 0.59*c.g + 0.11*c.b; }
  float bmSat(vec3 c){ return max(max(c.r,c.g),c.b) - min(min(c.r,c.g),c.b); }
  vec3 bmClipColor(vec3 c){
    float L = bmLum(c);
    float n = min(min(c.r,c.g),c.b);
    float x = max(max(c.r,c.g),c.b);
    if(n < 0.0) c = L + ((c - L) * L) / (L - n + 1e-6);
    if(x > 1.0) c = L + ((c - L) * (1.0 - L)) / (x - L + 1e-6);
    return c;
  }
  vec3 bmSetLum(vec3 c, float L){
    float d = L - bmLum(c);
    return bmClipColor(c + d);
  }
  vec3 bmSetSat(vec3 c, float s){
    float mn = min(min(c.r,c.g),c.b);
    float mx = max(max(c.r,c.g),c.b);
    if(mx > mn) return (c - mn) * s / (mx - mn);
    return vec3(0.0);
  }
  vec3 applyBlend(vec3 base, vec3 src, int m){
    if(m == 1) return base * src;
    if(m == 2) return 1.0 - (1.0 - base) * (1.0 - src);
    if(m == 3) return mix(2.0*base*src, 1.0 - 2.0*(1.0-base)*(1.0-src), step(0.5, base));
    if(m == 4) return max(base, src);
    if(m == 5) return min(base, src);
    if(m == 6) return min(base + src, vec3(1.0));
    if(m == 7){ vec3 r = base / max(1.0 - src, 1e-4); return clamp(r, 0.0, 1.0); }
    if(m == 8){ vec3 r = 1.0 - (1.0 - base) / max(src, 1e-4); return clamp(r, 0.0, 1.0); }
    if(m == 9) return mix(2.0*base*src, 1.0 - 2.0*(1.0-base)*(1.0-src), step(0.5, src));
    if(m == 10){
      vec3 t1 = 2.0 * base * src + base * base * (1.0 - 2.0 * src);
      vec3 t2 = sqrt(base) * (2.0 * src - 1.0) + 2.0 * base * (1.0 - src);
      return mix(t1, t2, step(0.5, src));
    }
    if(m == 11) return abs(base - src);
    if(m == 12) return base + src - 2.0 * base * src;
    if(m == 13) return bmSetLum(bmSetSat(src, bmSat(base)), bmLum(base));
    if(m == 14) return bmSetLum(bmSetSat(base, bmSat(src)), bmLum(base));
    if(m == 15) return bmSetLum(src, bmLum(base));
    if(m == 16) return bmSetLum(base, bmLum(src));
    return src;
  }
  vec4 compose(vec3 col){
    vec3 bg = texture2D(uBackground, vUv).rgb;
    vec3 blended = applyBlend(bg, col, uBlendMode);
    return vec4(mix(bg, blended, uOpacity), 1.0);
  }
`;

function wrap(body: string, extras = "") {
  return `${PREAMBLE}\n${extras}\n${HELPERS}\n${body}`;
}

// ---------------- Source / Procedural ----------------

const SOLID = wrap(
  `uniform vec3 uColor;
  uniform float uBrightness;
  uniform float uContrast;
  uniform float uNoise;
  uniform float uNoiseScale;
  void main(){
    vec3 c = uColor * uBrightness;
    c = (c - 0.5) * uContrast + 0.5;
    if(uNoise > 0.0){
      float n = hash12(floor(vUv * uNoiseScale) + floor(tStep(10.0)));
      c += (n - 0.5) * uNoise;
    }
    gl_FragColor = compose(c);
  }`,
);

const GRADIENT = wrap(
  `uniform int uMode;
  uniform float uAngle;
  uniform vec2 uCenter;
  uniform float uScale;
  uniform float uPower;
  uniform vec3 uColorA, uColorB, uColorC;
  uniform float uStopB;
  uniform int uUseC;
  uniform int uInvert;
  uniform float uNoise;
  uniform float uNoiseScale;
  void main(){
    vec2 uv = (vUv - uCenter) / max(uScale, 1e-3);
    float t;
    if(uMode == 0){
      vec2 d = vec2(cos(uAngle), sin(uAngle));
      t = dot(uv, d) + 0.5;
    } else if(uMode == 1){
      t = length(uv) * 1.4142;
    } else if(uMode == 2){
      t = (atan(uv.y, uv.x) + 3.14159265) / 6.2831853;
      t = fract(t + uAngle / 6.2831853);
    } else {
      t = (abs(uv.x) + abs(uv.y)) * 1.4142;
    }
    t = clamp(t, 0.0, 1.0);
    t = pow(t, uPower);
    if(uInvert == 1) t = 1.0 - t;
    if(uNoise > 0.0) t += (vnoise(vUv * uNoiseScale + tStep(0.3)) - 0.5) * uNoise;
    t = clamp(t, 0.0, 1.0);
    vec3 col;
    if(uUseC == 1){
      if(t < uStopB) col = mix(uColorA, uColorC, t / max(uStopB, 1e-3));
      else col = mix(uColorC, uColorB, (t - uStopB) / max(1.0 - uStopB, 1e-3));
    } else {
      col = mix(uColorA, uColorB, t);
    }
    gl_FragColor = compose(col);
  }`,
);

const MESH_GRADIENT = wrap(
  `uniform vec3 uC00, uC10, uC01, uC11;
  uniform float uAnim;
  uniform float uSpeed;
  uniform float uSoftness;
  uniform float uDistort;
  uniform float uDistortFreq;
  uniform float uGrain;
  void main(){
    vec2 uv = vUv;
    float ph = loopPhase(uSpeed);
    uv += vec2(
      sin(uv.y * uDistortFreq + ph),
      cos(uv.x * uDistortFreq * 0.9 - ph + 1.7)
    ) * uDistort;
    vec2 w = vec2(
      smoothstep(0.0, 1.0, pow(clamp(uv.x + uAnim*0.15*sin(ph + uv.y*6.0), 0.0, 1.0), 1.0/max(uSoftness, 0.2))),
      smoothstep(0.0, 1.0, pow(clamp(uv.y + uAnim*0.15*cos(ph + uv.x*6.0 + 2.3), 0.0, 1.0), 1.0/max(uSoftness, 0.2)))
    );
    vec3 top = mix(uC00, uC10, w.x);
    vec3 bot = mix(uC01, uC11, w.x);
    vec3 col = mix(top, bot, w.y);
    if(uGrain > 0.0){
      float n = hash12(floor(vUv * uResolution) + floor(tStep(8.0)));
      col += (n - 0.5) * uGrain;
    }
    gl_FragColor = compose(col);
  }`,
);

const PATTERN = wrap(
  `uniform int uKind;
  uniform float uScale;
  uniform float uAngle;
  uniform vec2 uOffset;
  uniform float uThickness;
  uniform float uSoftness;
  uniform vec3 uFg, uBg;
  uniform int uInvert;
  float sdHex(vec2 p){
    p = abs(p);
    return max(p.x * 0.8660254 + p.y * 0.5, p.y) - 0.5;
  }
  void main(){
    vec2 uv = (vUv - 0.5) * rot(uAngle) + 0.5 + uOffset;
    uv *= uScale;
    float m = 0.0;
    float soft = max(uSoftness, 0.001);
    if(uKind == 0){
      vec2 c = fract(uv) - 0.5;
      float r = uThickness * 0.5;
      m = 1.0 - smoothstep(r, r + soft, length(c));
    } else if(uKind == 1){
      float d = abs(fract(uv.x) - 0.5);
      m = smoothstep(uThickness * 0.5, uThickness * 0.5 - soft, d);
    } else if(uKind == 2){
      vec2 g = floor(uv);
      m = mod(g.x + g.y, 2.0);
    } else if(uKind == 3){
      vec2 h = vec2(1.0, 1.7320508);
      vec2 a = mod(uv, h) - h*0.5;
      vec2 b = mod(uv + h*0.5, h) - h*0.5;
      vec2 gv = length(a) < length(b) ? a : b;
      float d = sdHex(gv);
      m = 1.0 - smoothstep(-uThickness + 0.5, -uThickness + 0.5 + soft, d);
    } else if(uKind == 4){
      vec2 p = fract(uv);
      m = step(p.x + p.y, uThickness * 2.0);
    } else if(uKind == 5){
      vec2 c = fract(uv) - 0.5;
      float arm = uThickness * 0.15;
      float cross = step(abs(c.x), arm) + step(abs(c.y), arm);
      m = clamp(cross, 0.0, 1.0);
    } else {
      vec2 c = fract(uv) - 0.5;
      float d = abs(c.x) + abs(c.y);
      m = 1.0 - smoothstep(uThickness * 0.5, uThickness * 0.5 + soft, d);
    }
    if(uInvert == 1) m = 1.0 - m;
    gl_FragColor = compose(mix(uBg, uFg, m));
  }`,
);

const NOISE_FRAG = wrap(
  `uniform vec3 uColA, uColB;
  uniform float uContrast;
  uniform float uScale;
  uniform float uOctaves;
  uniform float uGain;
  uniform float uWarp;
  uniform float uSpeed;
  uniform vec2 uDirection;
  void main(){
    vec2 p = vUv * uScale;
    // Loop-synced flow via rotating noise domain — seamless at uTime=uDuration
    float ph = loopPhase(uSpeed);
    vec2 flow = uDirection * vec2(cos(ph), sin(ph));
    int oct = int(clamp(uOctaves, 1.0, 8.0));
    vec2 warp = vec2(
      fbmN(p + flow, oct, uGain),
      fbmN(p + flow.yx + 3.17, oct, uGain)
    ) - 0.5;
    p += warp * uWarp;
    float n = fbmN(p + flow, oct, uGain);
    float m = (n - 0.5) * uContrast + 0.5;
    m = clamp(m, 0.0, 1.0);
    gl_FragColor = compose(mix(uColA, uColB, m));
  }`,
);

const VORONOI = wrap(
  `uniform float uScale;
  uniform float uJitter;
  uniform float uEdgeWidth;
  uniform int uMetric;
  uniform float uSpeed;
  uniform vec3 uCellCol;
  uniform vec3 uEdgeCol;
  uniform float uVariation;
  float metric(vec2 r){
    if(uMetric == 1) return abs(r.x) + abs(r.y);
    if(uMetric == 2) return max(abs(r.x), abs(r.y));
    return sqrt(dot(r, r));
  }
  void main(){
    vec2 p = vUv * uScale;
    vec2 i = floor(p), f = fract(p);
    float d1 = 1e9, d2 = 1e9;
    vec2 cell1 = vec2(0.0);
    float vph = loopPhase(uSpeed);
    for(int y = -1; y <= 1; y++){
      for(int x = -1; x <= 1; x++){
        vec2 g = vec2(float(x), float(y));
        vec2 o = 0.5 + 0.5 * sin(vph + hash22(i + g) * 6.28318);
        o = mix(vec2(0.5), o, uJitter);
        vec2 r = g + o - f;
        float d = metric(r);
        if(d < d1){ d2 = d1; d1 = d; cell1 = i + g; }
        else if(d < d2){ d2 = d; }
      }
    }
    float edge = smoothstep(0.0, max(uEdgeWidth, 0.001), d2 - d1);
    vec3 cellC = mix(uCellCol, uCellCol * (0.3 + 0.7 * hash12(cell1)), uVariation);
    vec3 col = mix(uEdgeCol, cellC, edge);
    gl_FragColor = compose(col);
  }`,
);

// ---------------- Samplers ----------------

const IMAGE_SAMPLER = wrap(
  `uniform sampler2D uTexture;
  uniform vec2 uOffset;
  uniform vec2 uScale;
  uniform float uRotation;
  uniform int uFit;
  uniform vec2 uTexSize;
  uniform float uFlipY;
  uniform int uMirror;
  uniform float uExposure;
  uniform float uContrast;
  uniform float uSaturation;
  uniform vec3 uTint;
  uniform float uTintMix;
  void main(){
    vec2 uv = vUv;
    if(uFit != 0){
      float tAsp = uTexSize.x / max(uTexSize.y, 1.0);
      float sAsp = uResolution.x / max(uResolution.y, 1.0);
      vec2 s = vec2(1.0);
      if(uFit == 1){
        if(tAsp > sAsp) s.x = sAsp / tAsp; else s.y = tAsp / sAsp;
      } else {
        if(tAsp > sAsp) s.y = tAsp / sAsp; else s.x = sAsp / tAsp;
      }
      uv = (uv - 0.5) * s + 0.5;
    }
    uv = rot(-uRotation) * (uv - 0.5) + 0.5;
    uv = (uv - 0.5) / max(uScale, vec2(1e-4)) + 0.5 + uOffset;
    if(uFlipY > 0.5) uv.y = 1.0 - uv.y;
    if(uMirror == 1) uv.x = 1.0 - uv.x;
    vec4 tex;
    if(uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0){
      tex = vec4(0.0);
    } else {
      tex = texture2D(uTexture, uv);
    }
    vec3 col = tex.rgb * pow(2.0, uExposure);
    col = (col - 0.5) * uContrast + 0.5;
    float l = luma(col);
    col = mix(vec3(l), col, uSaturation);
    col = mix(col, col * uTint, uTintMix);
    vec3 bg = texture2D(uBackground, vUv).rgb;
    vec3 blended = applyBlend(bg, col, uBlendMode);
    float a = tex.a * uOpacity;
    gl_FragColor = vec4(mix(bg, blended, a), 1.0);
  }`,
);

// ---------------- Post-process ----------------

const CRT = wrap(
  `uniform sampler2D uPrev;
  uniform int uMode;
  uniform float uMaskScale;
  uniform float uMask;
  uniform float uScanline;
  uniform float uScanCount;
  uniform int uScanDir;
  uniform float uBarrel;
  uniform float uCurvature;
  uniform float uConverge;
  uniform float uBeam;
  uniform float uPersist;
  uniform float uFlicker;
  uniform float uFlickerSpeed;
  uniform float uNoise;
  uniform float uBloom;
  uniform float uBloomThresh;
  uniform float uBloomRadius;
  uniform float uBloomSoft;
  uniform float uVignette;
  uniform float uVigSoft;
  uniform float uGlitch;
  uniform float uGlitchSpeed;
  uniform vec3 uTint;
  uniform float uBrightness;
  uniform float uContrast;
  uniform float uChromaRetention;
  vec2 barrel(vec2 uv, float k){
    vec2 c = uv - 0.5;
    float r2 = dot(c, c);
    return 0.5 + c * (1.0 + k * r2);
  }
  void main(){
    vec2 uv = barrel(vUv, uBarrel);
    if(uGlitch > 0.0){
      float row = floor(uv.y * 40.0) + floor(tStep(uGlitchSpeed * 8.0));
      float h = hash11(row);
      uv.x += (h - 0.5) * uGlitch * 0.1 * step(0.6, hash11(row * 1.7));
    }
    if(uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0){
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return;
    }
    float r = texture2D(uBackground, uv + vec2( uConverge, 0.0)).r;
    float g = texture2D(uBackground, uv).g;
    float b = texture2D(uBackground, uv - vec2( uConverge, 0.0)).b;
    vec3 col = vec3(r, g, b);
    vec2 px = 1.0 / uResolution;
    col += uBeam * 0.5 * texture2D(uBackground, uv + vec2(0.0, px.y)).rgb;
    col += uBeam * 0.5 * texture2D(uBackground, uv - vec2(0.0, px.y)).rgb;
    col /= (1.0 + uBeam);
    // mask
    vec3 mask = vec3(1.0);
    if(uMode != 4){
      vec2 mp = vUv * uResolution / max(uMaskScale, 0.1);
      if(uMode == 0){ // aperture grille
        float s = mod(floor(mp.x), 3.0);
        mask = vec3(step(s, 0.5)*1.25 + 0.7, step(0.5,s)*step(s,1.5)*1.25 + 0.7, step(1.5,s)*1.25 + 0.7);
      } else if(uMode == 1){ // slot-mask
        float sx = mod(floor(mp.x), 3.0);
        float sy = mod(floor(mp.y * 0.5), 2.0);
        mask = vec3(step(sx, 0.5)*1.25 + 0.7, step(0.5,sx)*step(sx,1.5)*1.25 + 0.7, step(1.5,sx)*1.25 + 0.7);
        mask *= (0.85 + 0.3 * sy);
      } else if(uMode == 2){ // shadow mask (dots)
        vec2 cell = fract(mp * 0.5) - 0.5;
        float dd = length(cell);
        mask = mix(vec3(0.7), vec3(1.25), 1.0 - smoothstep(0.2, 0.35, dd));
      } else { // composite TV: YIQ bleed + rolling hum bar
        vec3 yiq;
        yiq.x = dot(col, vec3(0.299, 0.587, 0.114));
        yiq.y = dot(col, vec3(0.596, -0.274, -0.322));
        yiq.z = dot(col, vec3(0.211, -0.523, 0.312));
        float cphase = sin(vUv.x * uResolution.x * 0.5 + tMul(40.0));
        yiq.y += cphase * 0.05;
        yiq.z += cphase * 0.03;
        col = vec3(
          dot(yiq, vec3(1.0, 0.956, 0.621)),
          dot(yiq, vec3(1.0, -0.272, -0.647)),
          dot(yiq, vec3(1.0, -1.106, 1.703))
        );
        float hum = 0.9 + 0.1 * sin(vUv.y * 30.0 - tMul(4.0));
        col *= hum;
        mask = vec3(1.0);
      }
      col *= mix(vec3(1.0), mask, uMask);
    }
    // scanlines
    float sAxis = uScanDir == 0 ? vUv.y : vUv.x;
    float scan = 0.5 + 0.5 * cos(sAxis * uScanCount * 3.14159);
    col *= mix(1.0, scan, uScanline);
    // persistence
    vec3 prev = texture2D(uPrev, vUv).rgb;
    col = max(col, prev * uPersist);
    // flicker
    col *= 1.0 - uFlicker * hash11(floor(tStep(uFlickerSpeed)));
    // noise grain
    if(uNoise > 0.0){
      float n = hash12(vUv * uResolution + tStep(60.0));
      col += (n - 0.5) * uNoise;
    }
    // bloom (Vogel disk)
    if(uBloom > 0.0){
      vec3 glow = vec3(0.0);
      float gw = 0.0;
      float aspectB = uResolution.x / max(uResolution.y, 1.0);
      const int GN = 36;
      for(int i = 0; i < GN; i++){
        float fi = float(i) + 0.5;
        float a = fi * 2.399963;
        float r = sqrt(fi / float(GN));
        vec2 off = vec2(cos(a), sin(a)) * r * uBloomRadius;
        off.x /= aspectB;
        vec3 s = texture2D(uBackground, vUv + off).rgb;
        float lum = max(max(s.r, s.g), s.b);
        float soft = smoothstep(uBloomThresh - uBloomSoft, uBloomThresh + uBloomSoft, lum);
        float gw1 = exp(-r * r * 2.0);
        glow += s * soft * gw1;
        gw += gw1;
      }
      glow /= max(gw, 1e-4);
      col += glow * uBloom;
    }
    // vignette
    float d = length(vUv - 0.5) * 1.4142;
    float vig = 1.0 - smoothstep(0.4 + (1.0-uVigSoft)*0.3, 0.9, d);
    col *= mix(1.0, vig, uVignette);
    // edge curvature fade (mask)
    if(uCurvature > 0.0){
      vec2 ec = (vUv - 0.5) * 2.0;
      float eg = smoothstep(1.0 - uCurvature * 0.2, 1.0, max(abs(ec.x), abs(ec.y)));
      col *= 1.0 - eg;
    }
    // tone
    float L = luma(col);
    col = mix(vec3(L), col, uChromaRetention);
    col *= uTint * uBrightness;
    col = (col - 0.5) * uContrast + 0.5;
    gl_FragColor = compose(col);
  }`,
);

const ASCII_FRAG = wrap(
  `uniform float uCellPx;
  uniform float uAspect;
  uniform float uThreshold;
  uniform float uContrast;
  uniform int uInvert;
  uniform int uColorMode;
  uniform vec3 uInk;
  uniform vec3 uPaper;
  float glyph(float l, vec2 p){
    float tier = floor(l * 8.0);
    p = p - 0.5;
    float d = length(p);
    if(tier < 1.0) return 0.0;
    if(tier < 2.0) return 1.0 - smoothstep(0.04, 0.08, d);
    if(tier < 3.0) return 1.0 - smoothstep(0.35, 0.4, abs(p.y));
    if(tier < 4.0) return 1.0 - smoothstep(0.08, 0.12, min(abs(p.x), abs(p.y)));
    if(tier < 5.0) return 1.0 - smoothstep(0.1, 0.14, abs(abs(p.x) - abs(p.y)));
    if(tier < 6.0) return 1.0 - smoothstep(0.2, 0.25, max(abs(p.x), abs(p.y)));
    if(tier < 7.0) return 1.0 - smoothstep(0.35, 0.4, max(abs(p.x), abs(p.y)));
    return 1.0;
  }
  void main(){
    vec2 cell = vec2(uCellPx * uAspect, uCellPx) / uResolution;
    vec2 c = floor(vUv / cell) * cell + cell*0.5;
    vec3 samp = texture2D(uBackground, c).rgb;
    float l = luma(samp);
    l = (l - 0.5) * uContrast + 0.5 - uThreshold;
    l = clamp(l, 0.0, 1.0);
    if(uInvert == 1) l = 1.0 - l;
    vec2 lp = fract(vUv / cell);
    float g = glyph(l, lp);
    vec3 src = uColorMode == 1 ? samp : uInk;
    vec3 col = mix(uPaper, src, g);
    gl_FragColor = compose(col);
  }`,
);

const HALFTONE = wrap(
  `uniform float uCellPx;
  uniform float uAngle;
  uniform float uDotScale;
  uniform int uShape;
  uniform float uSoftness;
  uniform vec3 uInk;
  uniform vec3 uPaper;
  uniform int uInvert;
  void main(){
    vec2 uv = vUv - 0.5;
    uv = rot(uAngle) * uv + 0.5;
    vec2 cell = vec2(uCellPx) / uResolution;
    vec2 g = floor(uv / cell);
    vec2 cUv = (g + 0.5) * cell;
    vec2 sampleUv = rot(-uAngle) * (cUv - 0.5) + 0.5;
    vec3 samp = texture2D(uBackground, sampleUv).rgb;
    float l = 1.0 - luma(samp);
    if(uInvert == 1) l = 1.0 - l;
    vec2 p = fract(uv / cell) - 0.5;
    float r = l * 0.7 * uDotScale;
    float d;
    if(uShape == 0) d = length(p);
    else if(uShape == 1) d = max(abs(p.x), abs(p.y));
    else if(uShape == 2) d = abs(p.x) + abs(p.y);
    else d = abs(p.y);
    float dotm = 1.0 - smoothstep(r, r + uSoftness, d);
    vec3 col = mix(uPaper, uInk, dotm);
    gl_FragColor = compose(col);
  }`,
);

const DITHER = wrap(
  `uniform int uMode;
  uniform float uLevels;
  uniform float uScale;
  uniform float uContrast;
  uniform int uPreserveColor;
  float bayer4(vec2 p){
    int x = int(mod(p.x, 4.0));
    int y = int(mod(p.y, 4.0));
    int idx = x + y * 4;
    float m[16];
    m[0]=0.0; m[1]=8.0; m[2]=2.0; m[3]=10.0;
    m[4]=12.0;m[5]=4.0; m[6]=14.0;m[7]=6.0;
    m[8]=3.0; m[9]=11.0;m[10]=1.0;m[11]=9.0;
    m[12]=15.0;m[13]=7.0;m[14]=13.0;m[15]=5.0;
    float v = 0.0;
    for(int i = 0; i < 16; i++){ if(i == idx) v = m[i]; }
    return (v + 0.5) / 16.0;
  }
  float bayer8(vec2 p){
    vec2 q = floor(p / 2.0);
    vec2 r = mod(p, 2.0);
    float inner = (r.x + r.y * 2.0 + 0.5) / 4.0;
    return mix(bayer4(q), inner, 0.25);
  }
  void main(){
    vec3 c = texture2D(uBackground, vUv).rgb;
    c = (c - 0.5) * uContrast + 0.5;
    if(uPreserveColor == 0) c = vec3(luma(c));
    vec2 px = vUv * uResolution / max(uScale, 0.01);
    float t;
    if(uMode == 0)      t = bayer4(px);
    else if(uMode == 1) t = bayer8(px);
    else if(uMode == 2){
      vec2 q = floor(px);
      t = hash12(q) * 0.3 + hash12(q + vec2(13.0, 7.0)) * 0.7;
    } else {
      t = hash12(floor(px) + hash11(tStep(1.0)));
    }
    c += (t - 0.5) / uLevels;
    vec3 col = floor(c * uLevels) / uLevels;
    gl_FragColor = compose(col);
  }`,
);

const PIXELATION = wrap(
  `uniform float uBlocks;
  uniform float uAspect;
  uniform vec2 uOffset;
  uniform float uSmoothing;
  uniform float uQuantize;
  void main(){
    vec2 blocks = vec2(uBlocks * uAspect, uBlocks);
    vec2 uv = vUv + uOffset / blocks;
    vec2 cell = floor(uv * blocks);
    vec2 center = (cell + 0.5) / blocks;
    vec3 src = texture2D(uBackground, center).rgb;
    if(uSmoothing > 0.0){
      vec2 nb = center + vec2(1.0, 0.0) / blocks;
      vec2 nr = center + vec2(0.0, 1.0) / blocks;
      vec3 c1 = texture2D(uBackground, nb).rgb;
      vec3 c2 = texture2D(uBackground, nr).rgb;
      vec2 f = fract(uv * blocks);
      vec3 top = mix(src, c1, smoothstep(0.5 - uSmoothing*0.5, 0.5 + uSmoothing*0.5, f.x));
      vec3 bot = mix(src, c2, smoothstep(0.5 - uSmoothing*0.5, 0.5 + uSmoothing*0.5, f.y));
      src = (top + bot) * 0.5;
    }
    if(uQuantize > 1.5){
      src = floor(src * uQuantize + 0.5) / uQuantize;
    }
    gl_FragColor = compose(src);
  }`,
);

const THRESHOLD_FRAG = wrap(
  `uniform float uT;
  uniform float uSoft;
  uniform int uChannel;
  uniform int uInvert;
  uniform vec3 uOn, uOff;
  void main(){
    vec3 c = texture2D(uBackground, vUv).rgb;
    float v;
    if(uChannel == 1) v = c.r;
    else if(uChannel == 2) v = c.g;
    else if(uChannel == 3) v = c.b;
    else v = luma(c);
    float m = smoothstep(uT - uSoft, uT + uSoft, v);
    if(uInvert == 1) m = 1.0 - m;
    gl_FragColor = compose(mix(uOff, uOn, m));
  }`,
);

const POSTERIZE = wrap(
  `uniform float uSteps;
  uniform float uRSteps;
  uniform float uGSteps;
  uniform float uBSteps;
  uniform float uGamma;
  uniform float uMix;
  void main(){
    vec3 c = texture2D(uBackground, vUv).rgb;
    vec3 g = pow(c, vec3(uGamma));
    float sR = uRSteps > 0.0 ? uRSteps : uSteps;
    float sG = uGSteps > 0.0 ? uGSteps : uSteps;
    float sB = uBSteps > 0.0 ? uBSteps : uSteps;
    vec3 col = vec3(
      floor(g.r * sR + 0.5) / sR,
      floor(g.g * sG + 0.5) / sG,
      floor(g.b * sB + 0.5) / sB
    );
    col = pow(col, vec3(1.0 / max(uGamma, 0.01)));
    col = mix(c, col, uMix);
    gl_FragColor = compose(col);
  }`,
);

const BLOOM_FRAG = wrap(
  `uniform float uThresh;
  uniform float uKnee;
  uniform float uRadius;
  uniform float uStrength;
  uniform float uAnamorphic;
  uniform vec3 uTint;
  void main(){
    vec3 base = texture2D(uBackground, vUv).rgb;
    vec3 acc = vec3(0.0);
    float w = 0.0;
    vec2 stretch = mix(vec2(1.0), vec2(3.0, 0.4), uAnamorphic);
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    const int N = 48;
    for(int i = 0; i < N; i++){
      float fi = float(i) + 0.5;
      float angle = fi * 2.399963; // golden angle
      float r = sqrt(fi / float(N));
      vec2 off = vec2(cos(angle), sin(angle)) * r * uRadius * stretch;
      off.x /= aspect;
      vec3 s = texture2D(uBackground, vUv + off).rgb;
      float l = max(max(s.r, s.g), s.b);
      float soft = smoothstep(uThresh - uKnee*0.5, uThresh + uKnee*0.5, l);
      float gauss = exp(-r * r * 2.2);
      acc += s * soft * gauss;
      w += gauss;
    }
    acc /= max(w, 1e-4);
    vec3 col = base + acc * uStrength * uTint;
    gl_FragColor = compose(col);
  }`,
);

const VIGNETTE_FRAG = wrap(
  `uniform float uStart;
  uniform float uEnd;
  uniform float uRoundness;
  uniform vec2 uCenter;
  uniform vec3 uTint;
  uniform float uTintMix;
  void main(){
    vec3 c = texture2D(uBackground, vUv).rgb;
    vec2 p = (vUv - uCenter);
    float asp = uResolution.x / max(uResolution.y, 1.0);
    p.x *= mix(1.0, asp, uRoundness);
    float d = length(p) * 1.4142;
    float v = 1.0 - smoothstep(uStart, uEnd, d);
    vec3 col = mix(uTint, c, v);
    col = mix(c, col, uTintMix);
    gl_FragColor = compose(col);
  }`,
);

const GLITCH_FRAG = wrap(
  `uniform float uAmount;
  uniform float uSpeed;
  uniform float uWaveFreq;
  uniform float uSplit;
  uniform float uBlock;
  uniform float uBlockSize;
  uniform float uNoiseAmt;
  void main(){
    float rowSeed = floor(vUv.y * uWaveFreq) + floor(tStep(uSpeed));
    float h = hash11(rowSeed);
    float shift = (h - 0.5) * uAmount * step(0.6, hash11(rowSeed * 1.7));
    vec2 uv = vUv + vec2(shift, 0.0);
    float r = texture2D(uBackground, uv + vec2( uSplit, 0.0)).r;
    float g = texture2D(uBackground, uv).g;
    float b = texture2D(uBackground, uv - vec2( uSplit, 0.0)).b;
    vec3 col = vec3(r, g, b);
    vec2 block = floor(vUv * uBlockSize);
    float br = hash12(block + floor(tStep(4.0)));
    if(br > 1.0 - uBlock){
      col = texture2D(uBackground, fract(vUv + vec2(hash11(br)*0.3, hash11(br*3.1)*0.2))).rgb;
    }
    if(uNoiseAmt > 0.0){
      float n = hash12(vUv * uResolution + tStep(60.0));
      col += (n - 0.5) * uNoiseAmt;
    }
    gl_FragColor = compose(col);
  }`,
);

const DIR_BLUR = wrap(
  `uniform vec2 uDir;
  uniform float uLength;
  uniform float uCurve;
  uniform int uBidirectional;
  void main(){
    vec2 d = uDir * uLength;
    vec3 acc = vec3(0.0);
    float wsum = 0.0;
    const int N = 24;
    for(int i = 0; i < N; i++){
      float t = (float(i) + 0.5) / float(N);
      float f = uBidirectional == 1 ? (t * 2.0 - 1.0) : t;
      float w = mix(1.0, exp(-f*f*3.0), uCurve);
      acc += texture2D(uBackground, vUv + d * f).rgb * w;
      wsum += w;
    }
    vec3 col = acc / max(wsum, 1e-4);
    gl_FragColor = compose(col);
  }`,
);

const CHROMATIC = wrap(
  `uniform float uStrength;
  uniform float uFalloff;
  uniform float uAngle;
  uniform int uRadial;
  uniform float uSplitR;
  uniform float uSplitB;
  void main(){
    vec2 dir;
    float amp;
    if(uRadial == 1){
      vec2 c = vUv - 0.5;
      float r = length(c);
      dir = c / max(r, 1e-4);
      amp = pow(r, max(uFalloff, 0.01)) * uStrength;
    } else {
      dir = vec2(cos(uAngle), sin(uAngle));
      amp = uStrength;
    }
    float R = texture2D(uBackground, vUv + dir * amp * uSplitR).r;
    float G = texture2D(uBackground, vUv).g;
    float B = texture2D(uBackground, vUv + dir * amp * uSplitB).b;
    gl_FragColor = compose(vec3(R, G, B));
  }`,
);

const INK_FRAG = wrap(
  `uniform float uEdgeThresh;
  uniform float uEdgeSoft;
  uniform float uEdgeThick;
  uniform float uGrain;
  uniform float uGrainScale;
  uniform vec3 uPaper;
  uniform vec3 uInk;
  float lumaAt(vec2 uv){ return luma(texture2D(uBackground, uv).rgb); }
  void main(){
    vec2 px = uEdgeThick / uResolution;
    float tl = lumaAt(vUv + vec2(-px.x,  px.y));
    float  t = lumaAt(vUv + vec2(  0.0,  px.y));
    float tr = lumaAt(vUv + vec2( px.x,  px.y));
    float  l = lumaAt(vUv + vec2(-px.x,  0.0));
    float  r = lumaAt(vUv + vec2( px.x,  0.0));
    float bl = lumaAt(vUv + vec2(-px.x, -px.y));
    float  b = lumaAt(vUv + vec2(  0.0, -px.y));
    float br = lumaAt(vUv + vec2( px.x, -px.y));
    float gx = -tl - 2.0*l - bl + tr + 2.0*r + br;
    float gy = -tl - 2.0*t - tr + bl + 2.0*b + br;
    float g = sqrt(gx*gx + gy*gy);
    float edge = smoothstep(uEdgeThresh, uEdgeThresh + uEdgeSoft, g);
    float grain = (hash12(vUv * uResolution * uGrainScale + tStep(1.0)) - 0.5) * uGrain;
    vec3 col = mix(uPaper, uInk, edge) + grain;
    gl_FragColor = compose(col);
  }`,
);

const DISTORTION = wrap(
  `uniform int uMode;
  uniform int uDirection;
  uniform float uAmp;
  uniform float uFreq;
  uniform float uSpeed;
  uniform float uPhase;
  uniform float uOctaves;
  uniform vec2 uCenter;
  void main(){
    vec2 uv = vUv;
    vec2 d = vec2(0.0);
    float phA = loopPhase(uSpeed);
    if(uMode == 0){
      d = vec2(
        sin(uv.y * uFreq + phA + uPhase),
        cos(uv.x * uFreq + phA + uPhase + 1.3)
      );
    } else if(uMode == 1){
      int oct = int(clamp(uOctaves, 1.0, 5.0));
      vec2 flow = vec2(cos(phA), sin(phA));
      d = vec2(
        fbmN(uv * uFreq + flow, oct, 0.5),
        fbmN(uv * uFreq + flow.yx + 3.17, oct, 0.5)
      ) - 0.5;
      d *= 2.0;
    } else if(uMode == 2){
      vec2 c = uv - uCenter;
      float r = length(c);
      float w = sin(r * uFreq - phA + uPhase);
      d = normalize(c + 1e-5) * w;
    } else {
      vec2 c = uv - uCenter;
      float r = length(c);
      float a = uAmp * 10.0 * exp(-r * 4.0);
      d = rot(a + phA) * c - c;
    }
    if(uDirection == 1) d.y = 0.0;
    if(uDirection == 2) d.x = 0.0;
    uv += d * uAmp;
    vec3 col = texture2D(uBackground, uv).rgb;
    gl_FragColor = compose(col);
  }`,
);

const PARTICLE_GRID = wrap(
  `uniform float uGrid;
  uniform float uAspect;
  uniform float uSize;
  uniform int uShape;
  uniform float uSpeed;
  uniform float uPhase;
  uniform int uColorMode;
  uniform vec3 uTint;
  void main(){
    vec2 grid = vec2(uGrid * uAspect, uGrid);
    vec2 uv = vUv * grid;
    vec2 g = floor(uv);
    vec2 f = fract(uv) - 0.5;
    float ph = hash12(g) * 6.2831853 * uPhase;
    float pulse = 0.5 + 0.5 * sin(loopPhase(uSpeed) + ph);
    float r = uSize * pulse * 0.5;
    float d;
    if(uShape == 0) d = length(f);
    else if(uShape == 1) d = max(abs(f.x), abs(f.y));
    else d = abs(f.x) + abs(f.y);
    float m = 1.0 - smoothstep(r, r + 0.05, d);
    vec3 src = texture2D(uBackground, (g + 0.5) / grid).rgb;
    vec3 base = uColorMode == 0 ? src : uTint;
    vec3 col = base * m;
    gl_FragColor = compose(col);
  }`,
);

const CIRCUIT_BENT = wrap(
  `uniform float uBands;
  uniform float uSliceHeight;
  uniform float uShuffle;
  uniform float uInvertAmt;
  uniform float uSpeed;
  void main(){
    float band = floor(vUv.y * uSliceHeight + floor(tStep(uSpeed)));
    float jag = (hash11(band) - 0.5) * uBands * 0.2;
    vec2 uv = vUv + vec2(jag, 0.0);
    vec3 s = texture2D(uBackground, uv).rgb;
    float sel = hash11(band * 3.17);
    vec3 col = s;
    if(sel < uShuffle * 0.33)      col = s.gbr;
    else if(sel < uShuffle * 0.66) col = s.brg;
    else if(sel < uShuffle)        col = s.bgr;
    col = mix(col, 1.0 - col, uInvertAmt * step(0.5, hash11(band * 1.9)));
    gl_FragColor = compose(col);
  }`,
);

const PLOTTER_FRAG = wrap(
  `uniform float uThresh;
  uniform float uThickness;
  uniform int uHatch;
  uniform float uHatchDensity;
  uniform float uHatchAngle;
  uniform vec3 uPaper;
  uniform vec3 uInk;
  void main(){
    vec2 px = 1.0 / uResolution;
    float c  = luma(texture2D(uBackground, vUv).rgb);
    float rx = luma(texture2D(uBackground, vUv + vec2(px.x, 0.0)).rgb);
    float ry = luma(texture2D(uBackground, vUv + vec2(0.0, px.y)).rgb);
    float g = length(vec2(rx - c, ry - c));
    float line = smoothstep(uThresh - uThickness*0.2, uThresh + uThickness, g);
    float shade = 0.0;
    if(uHatch >= 1){
      vec2 rp = rot(uHatchAngle) * (vUv - 0.5);
      float h1 = step(0.5, fract(rp.y * uHatchDensity));
      shade = max(shade, h1 * (1.0 - c));
    }
    if(uHatch == 2){
      vec2 rp = rot(uHatchAngle + 1.5708) * (vUv - 0.5);
      float h2 = step(0.5, fract(rp.y * uHatchDensity));
      shade = max(shade, h2 * (1.0 - c));
    }
    float ink = max(line, shade * 0.5);
    vec3 col = mix(uPaper, uInk, ink);
    gl_FragColor = compose(col);
  }`,
);

const POSTERIZE_OUTLINE = wrap(
  `uniform float uSteps;
  uniform float uOutline;
  uniform float uOutlineSoft;
  uniform vec3 uLineCol;
  uniform float uSaturation;
  void main(){
    vec2 px = 1.0 / uResolution;
    vec3 c  = texture2D(uBackground, vUv).rgb;
    vec3 cr = texture2D(uBackground, vUv + vec2(px.x, 0.0)).rgb;
    vec3 cu = texture2D(uBackground, vUv + vec2(0.0, px.y)).rgb;
    vec3 post = floor(c * uSteps + 0.5) / uSteps;
    float L = luma(post);
    post = mix(vec3(L), post, uSaturation);
    float edge = length(cr - c) + length(cu - c);
    float m = smoothstep(uOutline, uOutline + uOutlineSoft, edge);
    vec3 col = mix(post, uLineCol, m);
    gl_FragColor = compose(col);
  }`,
);

const TILT_SHIFT = wrap(
  `uniform float uFocus;
  uniform float uWidth;
  uniform float uBlur;
  uniform float uFalloff;
  uniform int uDirection;
  uniform float uDesaturate;
  void main(){
    float d;
    if(uDirection == 0) d = abs(vUv.y - uFocus);
    else if(uDirection == 1) d = abs(vUv.x - uFocus);
    else d = length(vUv - vec2(0.5, uFocus));
    float m = smoothstep(uWidth, uWidth + uFalloff, d);
    float r = uBlur * m;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec3 acc = vec3(0.0);
    float wsum = 0.0;
    const int N = 32;
    for(int i = 0; i < N; i++){
      float fi = float(i) + 0.5;
      float a = fi * 2.399963;
      float rr = sqrt(fi / float(N));
      vec2 off = vec2(cos(a), sin(a)) * rr * r;
      off.x /= aspect;
      float w = exp(-rr * rr * 2.0);
      acc += texture2D(uBackground, vUv + off).rgb * w;
      wsum += w;
    }
    vec3 col = acc / max(wsum, 1e-4);
    float L = luma(col);
    col = mix(col, vec3(L), uDesaturate * m);
    gl_FragColor = compose(col);
  }`,
);

const HUE_ROTATE = wrap(
  `uniform float uHue;
  uniform float uSat;
  uniform float uVal;
  uniform float uTemperature;
  uniform float uGamma;
  uniform float uContrast;
  uniform vec3 uTint;
  uniform float uTintMix;
  void main(){
    vec3 c = texture2D(uBackground, vUv).rgb;
    vec3 hsv = rgb2hsv(c);
    hsv.x = fract(hsv.x + uHue / 6.2831853);
    hsv.y *= uSat;
    hsv.z *= uVal;
    vec3 col = hsv2rgb(hsv);
    col.r += uTemperature * 0.15;
    col.b -= uTemperature * 0.15;
    col = pow(max(col, 0.0), vec3(uGamma));
    col = (col - 0.5) * uContrast + 0.5;
    col = mix(col, col * uTint, uTintMix);
    gl_FragColor = compose(col);
  }`,
);

const PIXEL_SORTING = wrap(
  `uniform float uThreshold;
  uniform float uUpper;
  uniform float uRange;
  uniform int uDirection;
  uniform int uMode;
  uniform int uReverse;
  uniform float uSpeed;
  float mkey(vec3 c){
    if(uMode == 1){ return rgb2hsv(c).x; }
    if(uMode == 2){ return rgb2hsv(c).y; }
    return luma(c);
  }
  void main(){
    vec2 uv = vUv;
    vec2 axis = uDirection == 0 ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec3 base = texture2D(uBackground, uv).rgb;
    float gate = smoothstep(uThreshold, min(uUpper, uThreshold + 0.05), luma(base));
    gate *= (1.0 - smoothstep(uUpper, uUpper + 0.05, luma(base)));
    float span = uRange * (0.3 + 0.3 * sin(tMul(uSpeed)));
    vec3 best = base;
    float bestKey = mkey(base);
    const int STEPS = 18;
    for(int i = 1; i <= STEPS; i++){
      float t = float(i) / float(STEPS) * span;
      vec3 s = texture2D(uBackground, uv + axis * t).rgb;
      float k = mkey(s);
      bool take = uReverse == 1 ? (k < bestKey) : (k > bestKey);
      if(take){ best = s; bestKey = k; }
    }
    vec3 col = mix(base, best, gate);
    gl_FragColor = compose(col);
  }`,
);

const SLICE = wrap(
  `uniform float uAmount;
  uniform float uSliceHeight;
  uniform float uBlockWidth;
  uniform float uDensity;
  uniform float uDispersion;
  uniform float uSpeed;
  uniform int uDirection;
  void main(){
    vec2 uv = vUv;
    float timeSeed = floor(tStep(uSpeed));
    if(uDirection == 0){
      float row = floor(uv.y * uSliceHeight);
      float h = hash12(vec2(row, timeSeed));
      if(h > 1.0 - uDensity){
        float shift = (hash12(vec2(row * 1.7, timeSeed)) - 0.5) * uAmount;
        uv.x += shift;
      }
    } else {
      float col = floor(uv.x * uSliceHeight);
      float h = hash12(vec2(col, timeSeed));
      if(h > 1.0 - uDensity){
        float shift = (hash12(vec2(col * 1.7, timeSeed)) - 0.5) * uAmount;
        uv.y += shift;
      }
    }
    vec2 blk = floor(vUv * uBlockWidth);
    float br = hash12(blk + vec2(timeSeed));
    vec3 col1 = texture2D(uBackground, uv).rgb;
    if(br > 1.0 - uDensity * 0.5){
      float dx = (hash11(br * 3.7) - 0.5) * uDispersion;
      float dy = (hash11(br * 5.1) - 0.5) * uDispersion;
      col1 = texture2D(uBackground, fract(vUv + vec2(dx, dy))).rgb;
    }
    gl_FragColor = compose(col1);
  }`,
);

const EDGE_DETECT = wrap(
  `uniform float uThreshold;
  uniform float uStrength;
  uniform float uThickness;
  uniform int uInvert;
  uniform int uColorMode;
  uniform vec3 uLineColor;
  uniform vec3 uBgColor;
  float lumaAt(vec2 uv){ return luma(texture2D(uBackground, uv).rgb); }
  void main(){
    vec2 px = uThickness / uResolution;
    float tl = lumaAt(vUv + vec2(-px.x,  px.y));
    float  t = lumaAt(vUv + vec2(  0.0,  px.y));
    float tr = lumaAt(vUv + vec2( px.x,  px.y));
    float  l = lumaAt(vUv + vec2(-px.x,  0.0));
    float  r = lumaAt(vUv + vec2( px.x,  0.0));
    float bl = lumaAt(vUv + vec2(-px.x, -px.y));
    float  b = lumaAt(vUv + vec2(  0.0, -px.y));
    float br = lumaAt(vUv + vec2( px.x, -px.y));
    float gx = -tl - 2.0*l - bl + tr + 2.0*r + br;
    float gy = -tl - 2.0*t - tr + bl + 2.0*b + br;
    float g = sqrt(gx*gx + gy*gy) * uStrength;
    float edge = smoothstep(uThreshold, uThreshold + 0.1, g);
    if(uInvert == 1) edge = 1.0 - edge;
    vec3 src = texture2D(uBackground, vUv).rgb;
    vec3 line = uColorMode == 1 ? src : uLineColor;
    vec3 col = mix(uBgColor, line, edge);
    gl_FragColor = compose(col);
  }`,
);

const DISPLACEMENT_MAP = wrap(
  `uniform float uStrength;
  uniform float uMidpoint;
  uniform vec2 uDirection;
  uniform int uChannel;
  uniform float uScale;
  void main(){
    vec3 map = texture2D(uBackground, vUv / uScale).rgb;
    float v;
    if(uChannel == 0) v = map.r;
    else if(uChannel == 1) v = map.g;
    else if(uChannel == 2) v = map.b;
    else v = luma(map);
    float disp = (v - uMidpoint) * uStrength;
    vec2 uv = vUv + uDirection * disp;
    vec3 col = texture2D(uBackground, uv).rgb;
    gl_FragColor = compose(col);
  }`,
);

const PROGRESSIVE_BLUR = wrap(
  `uniform float uAngle;
  uniform float uStart;
  uniform float uEnd;
  uniform float uStrength;
  uniform float uCurve;
  void main(){
    vec2 axis = vec2(cos(uAngle), sin(uAngle));
    float t = dot(vUv - 0.5, axis) + 0.5;
    float ramp = smoothstep(uStart, uEnd, t);
    ramp = pow(ramp, uCurve);
    float r = ramp * uStrength;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec3 acc = vec3(0.0);
    float wsum = 0.0;
    const int N = 40;
    for(int i = 0; i < N; i++){
      float fi = float(i) + 0.5;
      float a = fi * 2.399963;
      float rr = sqrt(fi / float(N));
      vec2 off = vec2(cos(a), sin(a)) * rr * r;
      off.x /= aspect;
      float w = exp(-rr * rr * 2.0);
      acc += texture2D(uBackground, vUv + off).rgb * w;
      wsum += w;
    }
    vec3 col = acc / max(wsum, 1e-4);
    gl_FragColor = compose(col);
  }`,
);

const FLUTED_GLASS = wrap(
  `uniform float uFrequency;
  uniform float uAmplitude;
  uniform float uAngle;
  uniform float uWarp;
  uniform float uIrregularity;
  uniform float uEdgeShade;
  void main(){
    vec2 p = (vUv - 0.5);
    p = rot(uAngle) * p;
    float phase = p.x * uFrequency;
    float warp = (vnoise(vec2(p.y * 3.0, tStep(0.1))) - 0.5) * uWarp;
    phase += warp * 6.28;
    float irr = (hash11(floor(phase / 6.28)) - 0.5) * uIrregularity;
    phase += irr;
    float n = sin(phase);
    vec2 disp = rot(-uAngle) * vec2(n * uAmplitude, 0.0);
    vec3 col = texture2D(uBackground, vUv + disp).rgb;
    float edge = smoothstep(0.9, 1.0, abs(n));
    col *= 1.0 - edge * uEdgeShade;
    gl_FragColor = compose(col);
  }`,
);

export function customShaderSource(body: string): string {
  return wrap(
    `uniform float uU1;
     uniform float uU2;
     uniform float uU3;
     uniform float uU4;
     uniform vec3 uCol1;
     uniform vec3 uCol2;
     void main() {
      ${body}
    }`,
  );
}

export const SHADER_SOURCES: Partial<Record<LayerKind, string>> = {
  solid: SOLID,
  gradient: GRADIENT,
  meshGradient: MESH_GRADIENT,
  pattern: PATTERN,
  noise: NOISE_FRAG,
  voronoi: VORONOI,
  image: IMAGE_SAMPLER,
  video: IMAGE_SAMPLER,
  webcam: IMAGE_SAMPLER,
  text: IMAGE_SAMPLER,
  model: IMAGE_SAMPLER,
  crt: CRT,
  ascii: ASCII_FRAG,
  halftone: HALFTONE,
  dithering: DITHER,
  pixelation: PIXELATION,
  threshold: THRESHOLD_FRAG,
  posterize: POSTERIZE,
  bloom: BLOOM_FRAG,
  vignette: VIGNETTE_FRAG,
  glitch: GLITCH_FRAG,
  directionalBlur: DIR_BLUR,
  chromaticAberration: CHROMATIC,
  ink: INK_FRAG,
  distortion: DISTORTION,
  particleGrid: PARTICLE_GRID,
  circuitBent: CIRCUIT_BENT,
  plotter: PLOTTER_FRAG,
  posterizeOutline: POSTERIZE_OUTLINE,
  tiltShift: TILT_SHIFT,
  hueRotate: HUE_ROTATE,
  pixelSorting: PIXEL_SORTING,
  slice: SLICE,
  edgeDetect: EDGE_DETECT,
  displacementMap: DISPLACEMENT_MAP,
  progressiveBlur: PROGRESSIVE_BLUR,
  flutedGlass: FLUTED_GLASS,
};

export const BLEND_MODE_MAP: Record<string, number> = {
  normal: 0,
  multiply: 1,
  screen: 2,
  overlay: 3,
  lighten: 4,
  darken: 5,
  additive: 6,
  colorDodge: 7,
  colorBurn: 8,
  hardLight: 9,
  softLight: 10,
  difference: 11,
  exclusion: 12,
  hue: 13,
  saturation: 14,
  color: 15,
  luminosity: 16,
};

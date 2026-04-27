precision highp float;

uniform float time;
uniform float hue;
uniform float saturation;
uniform float brightness;
uniform float scanlineIntensity;
uniform float scanlineCount;
uniform float convergence;
uniform float barrelDistortion;
uniform float phosphorPersistence;
uniform float beamFocus;
uniform float flicker;

uniform sampler2D tInput;

varying vec2 vUv;

vec3 hsb2rgb(vec3 hsb) {
  vec3 rgb = clamp(abs(mod(hsb.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  rgb = rgb * rgb * (3.0 - 2.0 * rgb);
  return hsb.z * mix(vec3(1.0), rgb, hsb.y);
}

void main() {
  vec2 uv = vUv;

  // Base gradient
  vec3 color = mix(
    vec3(0.05, 0.05, 0.1),
    vec3(0.15, 0.25, 0.45),
    uv.y
  );

  // Scanlines effect
  float scanline = sin(uv.y * scanlineCount * 6.28) * 0.5 + 0.5;
  scanline = mix(1.0, scanline, scanlineIntensity);
  color *= scanline;

  // CRT mask/phosphor effect
  float mask = sin(uv.x * 100.0) * 0.5 + 0.5;
  color *= mix(1.0, mask, 0.2);

  // Flicker
  float flick = sin(time * 10.0) * flicker;
  color += flick * 0.1;

  // Apply HSB
  vec3 hsb = vec3(hue, saturation, brightness);
  color = mix(color, hsb2rgb(hsb), 0.3);

  gl_FragColor = vec4(color, 1.0);
}

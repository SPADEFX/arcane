precision highp float;

uniform sampler2D tInput;
uniform float vignetteStrength;

varying vec2 vUv;

void main() {
  vec3 color = texture2D(tInput, vUv).rgb;

  // Calculate vignette
  vec2 position = (vUv - 0.5) * 2.0;
  float vignette = 1.0 - length(position) * vignetteStrength;
  vignette = smoothstep(0.0, 1.0, vignette);

  color *= mix(1.0, vignette, vignetteStrength);

  gl_FragColor = vec4(color, 1.0);
}

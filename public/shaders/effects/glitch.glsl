precision highp float;

uniform sampler2D tInput;
uniform float glitchStrength;
uniform float time;

varying vec2 vUv;

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

void main() {
  vec2 uv = vUv;

  // Random glitch distortion
  float glitch = glitchStrength * 0.1;
  float rand = hash(floor(time * 10.0));

  // RGB channel shift
  float r = texture2D(tInput, uv + vec2(glitch * rand, 0.0)).r;
  float g = texture2D(tInput, uv).g;
  float b = texture2D(tInput, uv - vec2(glitch * rand, 0.0)).b;

  vec3 color = vec3(r, g, b);

  // Add horizontal scan glitch
  if(mod(uv.y * 100.0, 10.0) < 5.0 && rand > 0.7) {
    color = mix(color, texture2D(tInput, uv + vec2(glitch * 5.0, 0.0)).rgb, 0.5);
  }

  gl_FragColor = vec4(color, 1.0);
}

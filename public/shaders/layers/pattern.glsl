precision highp float;

uniform float time;
uniform float hue;
uniform float saturation;
uniform float brightness;
uniform float patternScale;

varying vec2 vUv;

float hash(vec2 p) {
  float h = dot(p, vec2(127.1, 311.7));
  return fract(sin(h) * 43758.5453123);
}

void main() {
  vec2 uv = vUv * patternScale;

  // Dot pattern
  vec2 center = floor(uv) + 0.5;
  float dist = length(uv - center);
  float pattern = 1.0 - smoothstep(0.0, 0.3, dist);

  // Add some animation
  pattern *= 0.5 + 0.5 * sin(time + hash(center) * 6.28);

  vec3 color = vec3(pattern);

  // HSB adjustments
  color = mix(color, vec3(hue, saturation, brightness), 0.5);

  gl_FragColor = vec4(color, 1.0);
}

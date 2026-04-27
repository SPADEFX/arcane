precision highp float;

uniform float time;
uniform float hue;
uniform float saturation;
uniform float brightness;

varying vec2 vUv;

vec3 hsb2rgb(vec3 hsb) {
  vec3 rgb = clamp(abs(mod(hsb.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  rgb = rgb * rgb * (3.0 - 2.0 * rgb);
  return hsb.z * mix(vec3(1.0), rgb, hsb.y);
}

void main() {
  vec2 uv = vUv;

  // Gradient from left (bottom) to right (top)
  vec3 color = mix(
    vec3(0.1, 0.1, 0.15),
    vec3(0.2, 0.3, 0.5),
    uv.y
  );

  // Apply HSB adjustments
  vec3 hsb = vec3(hue, saturation, brightness);
  color = hsb2rgb(hsb + vec3(atan(uv.y, uv.x) / 6.28, length(uv) * 0.5, 0.5));

  gl_FragColor = vec4(color, 1.0);
}

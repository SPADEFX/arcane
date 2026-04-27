precision highp float;

uniform sampler2D tInput;
uniform float distortion;

varying vec2 vUv;

void main() {
  vec2 uv = vUv - 0.5;
  float length = length(uv);

  // Barrel distortion
  uv *= 1.0 + length * length * distortion;

  uv += 0.5;

  // Check bounds
  if(uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }

  vec3 color = texture2D(tInput, uv).rgb;

  gl_FragColor = vec4(color, 1.0);
}

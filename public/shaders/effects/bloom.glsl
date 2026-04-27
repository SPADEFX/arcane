precision highp float;

uniform sampler2D tInput;
uniform float bloomStrength;

varying vec2 vUv;

void main() {
  vec3 color = texture2D(tInput, vUv).rgb;

  // Simple bloom by sampling surrounding pixels
  vec3 bloom = vec3(0.0);
  float kernelSize = 0.01 * bloomStrength;

  for(int i = -2; i <= 2; i++) {
    for(int j = -2; j <= 2; j++) {
      vec2 offset = vec2(float(i), float(j)) * kernelSize;
      bloom += texture2D(tInput, vUv + offset).rgb;
    }
  }

  bloom /= 25.0;

  // Blend bloom with original
  color = mix(color, bloom, bloomStrength * 0.5);

  // Add glow to bright areas
  float brightness = dot(color, vec3(0.299, 0.587, 0.114));
  color += brightness * bloomStrength * 0.3;

  gl_FragColor = vec4(color, 1.0);
}

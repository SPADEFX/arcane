import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useLayerStore } from "../stores/layerStore";
import { useSceneStore } from "../stores/sceneStore";
import { useTimelineStore } from "../stores/timelineStore";
import type { Layer, UniformValue } from "../types";
import {
  type BloomMipChain,
  type BloomPipeline,
  createBloomMips,
  createBloomPipeline,
  disposeBloomMips,
  disposeBloomPipeline,
  renderBloom,
  renderProgressive,
  renderTiltShift,
  resizeBloomMips,
} from "../utils/bloomPipeline";
import { EFFECTS_BY_KIND } from "../utils/effectCatalog";
import { evalLayer } from "../utils/keyframes";
import {
  createModelScene,
  disposeModelScene,
  type ModelScene,
  updateModelScene,
} from "../utils/modelScene";
import {
  BLEND_MODE_MAP,
  customShaderSource,
  FULLSCREEN_VERT,
  SHADER_SOURCES,
} from "../utils/shaders";
import {
  loadImageTexture,
  makeTextTexture,
  makeVideoTexture,
  makeWebcamTexture,
} from "../utils/textTexture";

interface LayerGpu {
  material: THREE.ShaderMaterial;
  kind: string;
  customFragment?: string;
  // For CRT: an extra FBO to hold previous frame
  prevRt?: THREE.WebGLRenderTarget;
  // For samplers: the current texture + metadata
  textureKey?: string;
  texture?: THREE.Texture;
  texSize?: [number, number];
  video?: HTMLVideoElement;
  stream?: MediaStream;
  // For text: cached canvas key
  textKey?: string;
  // For model: 3D scene + RT
  modelScene?: ModelScene;
  modelRt?: THREE.WebGLRenderTarget;
  modelUrl?: string;
  // For bloom: multi-pass mip chain
  bloomMips?: BloomMipChain;
}

function uniformToThree(value: UniformValue): unknown {
  if (typeof value === "number") return value;
  if (Array.isArray(value)) {
    if (value.length === 2) return new THREE.Vector2(value[0], value[1]);
    if (value.length === 3)
      return new THREE.Vector3(value[0], value[1], value[2]);
    if (value.length === 4)
      return new THREE.Vector4(value[0], value[1], value[2], value[3]);
  }
  return value;
}

function capitalizeFirst(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const Canvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const canvas = document.createElement("canvas");
    canvas.dataset.editorCanvas = "true";
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;";
    container.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 1);
    const dpr = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);

    const camera = new THREE.Camera();

    const quadGeom = new THREE.BufferGeometry();
    const verts = new Float32Array([
      -1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0,
    ]);
    const uvs = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]);
    quadGeom.setAttribute("position", new THREE.BufferAttribute(verts, 3));
    quadGeom.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

    const placeholderMat: THREE.Material = new THREE.MeshBasicMaterial();
    const quad: THREE.Mesh<THREE.BufferGeometry, THREE.Material> = new THREE.Mesh(
      quadGeom,
      placeholderMat,
    );
    const scene = new THREE.Scene();
    scene.add(quad);

    const makeRT = (w: number, h: number) =>
      new THREE.WebGLRenderTarget(w, h, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.UnsignedByteType,
      });

    let rtA = makeRT(width * dpr, height * dpr);
    let rtB = makeRT(width * dpr, height * dpr);
    const rtMask = makeRT(width * dpr, height * dpr);
    let rtGroupA = makeRT(width * dpr, height * dpr);
    let rtGroupB = makeRT(width * dpr, height * dpr);
    const bloomPipeline: BloomPipeline = createBloomPipeline();

    const clearScene = new THREE.Scene();
    const clearMat = new THREE.RawShaderMaterial({
      vertexShader: FULLSCREEN_VERT,
      fragmentShader:
        "precision highp float; void main(){ gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); }",
    });
    const clearQuad = new THREE.Mesh(quadGeom, clearMat);
    clearScene.add(clearQuad);

    const maskApplyMat = new THREE.RawShaderMaterial({
      vertexShader: FULLSCREEN_VERT,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uBase;
        uniform sampler2D uMask;
        uniform int uSource;
        uniform int uMode;
        uniform float uInvert;
        uniform float uThreshold;
        float luma(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
        void main(){
          vec4 base = texture2D(uBase, vUv);
          vec4 mask = texture2D(uMask, vUv);
          float m;
          if(uSource == 0) m = luma(mask.rgb);
          else if(uSource == 1) m = mask.a;
          else if(uSource == 2) m = mask.r;
          else if(uSource == 3) m = mask.g;
          else m = mask.b;
          if(uInvert > 0.5) m = 1.0 - m;
          if(uMode == 1) m = step(uThreshold, m);
          gl_FragColor = vec4(base.rgb * m, base.a * m);
        }
      `,
      uniforms: {
        uBase: { value: null },
        uMask: { value: null },
        uSource: { value: 0 },
        uMode: { value: 0 },
        uInvert: { value: 0 },
        uThreshold: { value: 0.5 },
      },
    });

    const groupCompositeMat = new THREE.RawShaderMaterial({
      vertexShader: FULLSCREEN_VERT,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uBase;
        uniform sampler2D uOverlay;
        uniform int uBlendMode;
        uniform float uOpacity;
        vec3 applyBlend(vec3 base, vec3 src, int m){
          if(m == 1) return base * src;
          if(m == 2) return 1.0 - (1.0 - base) * (1.0 - src);
          if(m == 3) return mix(2.0*base*src, 1.0 - 2.0*(1.0-base)*(1.0-src), step(0.5, base));
          if(m == 4) return max(base, src);
          if(m == 5) return min(base, src);
          if(m == 6) return min(base + src, vec3(1.0));
          return src;
        }
        void main(){
          vec3 base = texture2D(uBase, vUv).rgb;
          vec3 overlay = texture2D(uOverlay, vUv).rgb;
          float lum = max(max(overlay.r, overlay.g), overlay.b);
          vec3 blended = applyBlend(base, overlay, uBlendMode);
          float alpha = clamp(lum * 3.0, 0.0, 1.0) * uOpacity;
          gl_FragColor = vec4(mix(base, blended, alpha), 1.0);
        }
      `,
      uniforms: {
        uBase: { value: null },
        uOverlay: { value: null },
        uBlendMode: { value: 0 },
        uOpacity: { value: 1 },
      },
    });

    const copyMat = new THREE.RawShaderMaterial({
      vertexShader: FULLSCREEN_VERT,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uTex;
        uniform vec3 uBg;
        uniform float uBrightness;
        uniform float uContrast;
        uniform float uInvert;
        void main(){
          vec4 t = texture2D(uTex, vUv);
          vec3 col = t.rgb * uBrightness;
          col = (col - 0.5) * uContrast + 0.5;
          col = mix(col, 1.0 - col, uInvert);
          col = mix(uBg, col, t.a);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      uniforms: {
        uTex: { value: null },
        uBg: { value: new THREE.Vector3(0, 0, 0) },
        uBrightness: { value: 1 },
        uContrast: { value: 1 },
        uInvert: { value: 0 },
      },
    });

    const gpuMap = new Map<string, LayerGpu>();

    // Auto-size the scene to the longest loaded video (ignores webcam streams).
    // Runs when a video's metadata loads, and when a video layer is removed.
    function syncDurationToVideos() {
      let maxDur = 0;
      for (const g of gpuMap.values()) {
        if (g.video && !g.stream) {
          const d = g.video.duration;
          if (isFinite(d) && d > 0) maxDur = Math.max(maxDur, d);
        }
      }
      if (maxDur > 0) {
        const store = useTimelineStore.getState();
        if (Math.abs(store.duration - maxDur) > 0.01) {
          store.setDuration(maxDur);
        }
      }
    }

    // Mouse + scroll tracking
    const mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, velX: 0, velY: 0 };
    const scrollState = { y: 0, targetY: 0 };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      mouse.targetY = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
    };
    window.addEventListener("pointermove", onPointer);

    const onScroll = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      scrollState.targetY = Math.max(0, Math.min(1, window.scrollY / max));
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    function buildMaterial(layer: Layer): THREE.ShaderMaterial {
      const src =
        layer.kind === "customShader"
          ? customShaderSource(layer.asset?.fragmentSource ?? "")
          : SHADER_SOURCES[layer.kind];
      if (!src) {
        throw new Error(`No shader source for kind: ${layer.kind}`);
      }
      const uniforms: Record<string, THREE.IUniform> = {
        uTime: { value: 0 },
        uDuration: { value: 8 },
        uResolution: { value: new THREE.Vector2(width * dpr, height * dpr) },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uMouseVel: { value: new THREE.Vector2(0, 0) },
        uScroll: { value: 0 },
        uOpacity: { value: layer.opacity },
        uBlendMode: { value: BLEND_MODE_MAP[layer.blendMode] ?? 0 },
        uBackground: { value: null },
      };
      const def = EFFECTS_BY_KIND[layer.kind];
      if (def) {
        for (const p of def.params) {
          if (p.kind === "text" || p.kind === "font") continue;
          const name = `u${capitalizeFirst(p.key)}`;
          const val = layer.uniforms[p.key] ?? p.default;
          uniforms[name] = { value: uniformToThree(val) };
        }
      }
      // Sampler specific
      if (
        layer.kind === "image" ||
        layer.kind === "video" ||
        layer.kind === "webcam" ||
        layer.kind === "text" ||
        layer.kind === "model"
      ) {
        uniforms.uTexture = { value: null };
        uniforms.uTexSize = { value: new THREE.Vector2(1, 1) };
        // Image/Video/Webcam/Text textures have flipY=true at upload; only model RTs need shader flip
        uniforms.uFlipY = { value: 0 };
        // Ensure sampler shader uniforms always exist with neutral defaults
        if (!uniforms.uFit) uniforms.uFit = { value: 1 };
        if (!uniforms.uOffset) uniforms.uOffset = { value: new THREE.Vector2(0, 0) };
        if (!uniforms.uScale) uniforms.uScale = { value: new THREE.Vector2(1, 1) };
        if (!uniforms.uMirror) uniforms.uMirror = { value: layer.kind === "webcam" ? 1 : 0 };
        if (!uniforms.uRotation) uniforms.uRotation = { value: 0 };
        if (!uniforms.uExposure) uniforms.uExposure = { value: 0 };
        if (!uniforms.uContrast) uniforms.uContrast = { value: 1 };
        if (!uniforms.uSaturation) uniforms.uSaturation = { value: 1 };
        if (!uniforms.uTint) uniforms.uTint = { value: new THREE.Vector3(1, 1, 1) };
        if (!uniforms.uTintMix) uniforms.uTintMix = { value: 0 };
      }
      if (layer.kind === "crt") {
        uniforms.uPrev = { value: null };
      }
      const mat = new THREE.RawShaderMaterial({
        vertexShader: FULLSCREEN_VERT,
        fragmentShader: src,
        uniforms,
      });
      return mat;
    }

    async function ensureAssetTexture(layer: Layer, gpu: LayerGpu) {
      const key = assetKey(layer);
      if (gpu.textureKey === key && gpu.texture) return;
      // Clean up previous
      if (gpu.video && !gpu.stream) {
        gpu.video.pause();
      }
      if (gpu.stream) {
        gpu.stream.getTracks().forEach((t) => t.stop());
        gpu.stream = undefined;
      }
      if (gpu.texture) gpu.texture.dispose();
      gpu.texture = undefined;
      gpu.video = undefined;
      gpu.textureKey = key;

      try {
        if (layer.kind === "image" && layer.asset?.url) {
          const { texture, width, height } = await loadImageTexture(layer.asset.url);
          gpu.texture = texture;
          gpu.texSize = [width, height];
        } else if (layer.kind === "video" && layer.asset?.url) {
          const { video, texture } = makeVideoTexture(layer.asset.url);
          gpu.texture = texture;
          gpu.video = video;
          const onMeta = () => {
            gpu.texSize = [video.videoWidth || 1280, video.videoHeight || 720];
            syncDurationToVideos();
          };
          video.addEventListener("loadedmetadata", onMeta);
        } else if (layer.kind === "webcam") {
          const { video, texture, stream } = await makeWebcamTexture();
          gpu.texture = texture;
          gpu.video = video;
          gpu.stream = stream;
          gpu.texSize = [video.videoWidth || 1280, video.videoHeight || 720];
        }
      } catch (err) {
        console.error("Asset load failed", err);
      }
    }

    function assetKey(layer: Layer): string {
      const a = layer.asset ?? {};
      if (layer.kind === "text") {
        const u = layer.uniforms;
        const c = (u.color as number[] | undefined) ?? [1, 1, 1];
        const sc = (u.strokeColor as number[] | undefined) ?? [0, 0, 0];
        return [
          "text",
          a.text,
          a.fontSize,
          a.fontWeight,
          a.fontFamily,
          u.italic ?? 0,
          u.letterSpacing ?? 0,
          u.align ?? 1,
          u.stroke ?? 0,
          u.yOffset ?? 0,
          c.join(","),
          sc.join(","),
        ].join("|");
      }
      if (layer.kind === "customShader") {
        return `custom|${a.fragmentSource?.length ?? 0}|${a.fragmentSource?.slice(0, 32) ?? ""}`;
      }
      return `${layer.kind}|${a.url ?? ""}`;
    }

    function ensureTextTexture(layer: Layer, gpu: LayerGpu) {
      const key = assetKey(layer);
      if (gpu.textKey === key && gpu.texture) return;
      if (gpu.texture) gpu.texture.dispose();
      const a = layer.asset ?? {};
      const canvasW = Math.max(1024, Math.floor(width * dpr));
      const canvasH = Math.max(512, Math.floor(height * dpr));
      const u = layer.uniforms;
      const color = (u.color as [number, number, number] | undefined) ?? [1, 1, 1];
      const strokeColor =
        (u.strokeColor as [number, number, number] | undefined) ?? [0, 0, 0];
      const alignMap: Array<"left" | "center" | "right"> = [
        "left",
        "center",
        "right",
      ];
      const alignIdx = Math.max(0, Math.min(2, Number(u.align ?? 1)));
      const { texture } = makeTextTexture({
        text: a.text ?? "basement",
        fontSize: a.fontSize ?? 240,
        fontFamily: a.fontFamily ?? "Inter, system-ui, sans-serif",
        fontWeight: a.fontWeight ?? 700,
        italic: Number(u.italic ?? 0) > 0.5,
        color,
        stroke: Number(u.stroke ?? 0),
        strokeColor,
        letterSpacing: Number(u.letterSpacing ?? 0),
        align: alignMap[alignIdx],
        yOffset: Number(u.yOffset ?? 0),
        width: canvasW,
        height: canvasH,
      });
      gpu.texture = texture;
      gpu.texSize = [canvasW, canvasH];
      gpu.textKey = key;
    }

    function ensureGpu(layer: Layer): LayerGpu {
      let gpu = gpuMap.get(layer.id);
      const needNew =
        !gpu ||
        gpu.kind !== layer.kind ||
        (layer.kind === "customShader" && gpu.customFragment !== layer.asset?.fragmentSource);
      if (needNew) {
        if (gpu) disposeGpu(gpu);
        const mat = buildMaterial(layer);
        gpu = {
          material: mat,
          kind: layer.kind,
          customFragment:
            layer.kind === "customShader" ? layer.asset?.fragmentSource : undefined,
        };
        if (layer.kind === "crt") {
          gpu.prevRt = makeRT(width * dpr, height * dpr);
        }
        gpuMap.set(layer.id, gpu);
      }
      return gpu!;
    }

    function disposeGpu(gpu: LayerGpu) {
      gpu.material.dispose();
      if (gpu.prevRt) gpu.prevRt.dispose();
      if (gpu.texture) gpu.texture.dispose();
      if (gpu.stream) gpu.stream.getTracks().forEach((t) => t.stop());
      if (gpu.modelRt) gpu.modelRt.dispose();
      if (gpu.modelScene) disposeModelScene(gpu.modelScene);
      if (gpu.bloomMips) disposeBloomMips(gpu.bloomMips);
    }

    function ensureModel(layer: Layer, gpu: LayerGpu) {
      if (!gpu.modelScene) {
        gpu.modelScene = createModelScene(renderer);
      }
      if (!gpu.modelRt) {
        gpu.modelRt = new THREE.WebGLRenderTarget(width * dpr, height * dpr, {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBAFormat,
          type: THREE.UnsignedByteType,
        });
      }
      const u = layer.uniforms;
      const tup3 = (k: string, fb: [number, number, number]) =>
        ((u[k] as number[] | undefined) ?? fb) as [number, number, number];
      updateModelScene(gpu.modelScene, {
        source: Number(u.source ?? 0),
        primitive: Number(u.primitive ?? 2),
        size: Number(u.size ?? 1),
        segments: Number(u.segments ?? 48),
        tubeRatio: Number(u.tubeRatio ?? 0.3),
        extrudeDepth: Number(u.extrudeDepth ?? 0.2),
        bevel: Number(u.bevel ?? 0.02),
        svgScale: Number(u.svgScale ?? 0.008),
        url: layer.asset?.url,
        material: Number(u.material ?? 0),
        color: tup3("color", [0.9, 0.92, 1]),
        metalness: Number(u.metalness ?? 0.1),
        roughness: Number(u.roughness ?? 0.2),
        transmission: Number(u.transmission ?? 0.95),
        ior: Number(u.ior ?? 1.45),
        thickness: Number(u.thickness ?? 0.5),
        clearcoat: Number(u.clearcoat ?? 0),
        emissive: tup3("emissive", [0, 0, 0]),
        emissiveIntensity: Number(u.emissiveIntensity ?? 0),
        envStrength: Number(u.envStrength ?? 1),
        ambient: Number(u.ambient ?? 0.35),
        keyIntensity: Number(u.keyIntensity ?? 2.2),
        keyColor: tup3("keyColor", [1, 0.95, 0.85]),
        rimIntensity: Number(u.rimIntensity ?? 1),
        rimColor: tup3("rimColor", [0.6, 0.8, 1]),
        bgColor: tup3("bgColor", [0, 0, 0]),
      });
      const ms = gpu.modelScene;
      const distance = Number(u.distance ?? 3);
      const autoRotate = Number(u.autoRotate ?? 0.6);
      const yawU = Number(u.yaw ?? 0.6);
      const pitch = Number(u.pitch ?? 0.15);
      const tStore2 = useTimelineStore.getState();
      const tNow = tStore2.currentTime;
      const dur = Math.max(tStore2.duration, 1e-4);
      // Snap rotation rate so the scene loops seamlessly at uDuration
      const cycles = autoRotate === 0
        ? 0
        : Math.max(1, Math.round(Math.abs(autoRotate) * dur / (2 * Math.PI)));
      const snappedRate = autoRotate === 0
        ? 0
        : Math.sign(autoRotate) * cycles * 2 * Math.PI / dur;
      const yaw = yawU + snappedRate * tNow;
      const fov = Number(u.fov ?? 40);
      const yOffset = Number(u.yOffset ?? 0);
      ms.camera.fov = fov;
      ms.camera.aspect = gpu.modelRt.width / Math.max(1, gpu.modelRt.height);
      ms.camera.position.set(
        distance * Math.cos(pitch) * Math.sin(yaw),
        distance * Math.sin(pitch) + yOffset,
        distance * Math.cos(pitch) * Math.cos(yaw),
      );
      ms.camera.lookAt(0, yOffset, 0);
      ms.camera.updateProjectionMatrix();
      renderer.setRenderTarget(gpu.modelRt);
      renderer.render(ms.scene, ms.camera);
      gpu.texture = gpu.modelRt.texture;
      gpu.texSize = [gpu.modelRt.width, gpu.modelRt.height];
    }

    const startTime = performance.now();
    let lastFrame = performance.now();
    let animId = 0;

    function animate() {
      animId = requestAnimationFrame(animate);

      const now = performance.now();
      const dt = (now - lastFrame) / 1000;
      lastFrame = now;

      // Smooth mouse and scroll
      mouse.velX = mouse.targetX - mouse.x;
      mouse.velY = mouse.targetY - mouse.y;
      mouse.x += mouse.velX * 0.12;
      mouse.y += mouse.velY * 0.12;
      scrollState.y += (scrollState.targetY - scrollState.y) * 0.12;

      const tStore = useTimelineStore.getState();
      tStore.tick(dt);
      const globalTime = tStore.currentTime;
      const loopCount = tStore.loopCount;
      const duration = tStore.duration;
      const isPlaying = tStore.isPlaying;

      // Drive every loaded video from the timeline (play only while the timeline
      // plays; scrubbing seeks the frame; webcam streams are left alone).
      for (const g of gpuMap.values()) {
        const v = g.video;
        if (!v || g.stream) continue;
        const vDur = v.duration;
        if (isFinite(vDur) && vDur > 0) {
          const expected = globalTime % vDur;
          if (Math.abs(v.currentTime - expected) > 0.15) {
            try { v.currentTime = expected; } catch { /* seek not ready */ }
          }
        }
        if (isPlaying) {
          if (v.paused) v.play().catch(() => {});
        } else if (!v.paused) {
          v.pause();
        }
      }
      const ctx = {
        time: globalTime,
        duration,
        mouseX: mouse.x,
        mouseY: mouse.y,
        scrollY: scrollState.y,
      };
      // Per-layer effective time: "once" layers freeze at duration after first pass
      const effectiveTime = (layer: Layer) =>
        layer.loopMode === "once" && loopCount > 0 ? duration : globalTime;
      void startTime; // kept for future use

      const layers = useLayerStore.getState().layers;

      // Clean up removed layers
      const liveIds = new Set(layers.map((l) => l.id));
      let removedVideo = false;
      for (const [id, gpu] of Array.from(gpuMap.entries())) {
        if (!liveIds.has(id)) {
          if (gpu.video && !gpu.stream) removedVideo = true;
          disposeGpu(gpu);
          gpuMap.delete(id);
        }
      }
      if (removedVideo) syncDurationToVideos();

      // Clear accumulator
      quad.material = clearMat;
      renderer.setRenderTarget(rtA);
      renderer.render(clearScene, camera);

      let read = rtA;
      let write = rtB;

      // Build tree: parentId -> [children]
      const childrenByParent = new Map<string, typeof layers>();
      for (const l of layers) {
        if (l.parentId) {
          const arr = childrenByParent.get(l.parentId);
          if (arr) arr.push(l);
          else childrenByParent.set(l.parentId, [l]);
        }
      }

      function drawLayer(
        layer: Layer,
        srcRT: THREE.WebGLRenderTarget,
        dstRT: THREE.WebGLRenderTarget,
        overrideBlend?: number,
        overrideOpacity?: number,
      ) {
        const gpu = ensureGpu(layer);
        const u = gpu.material.uniforms;

        const layerTime = effectiveTime(layer);
        u.uTime.value = layerTime;
        if (u.uDuration) u.uDuration.value = ctx.duration;
        u.uResolution.value.set(dstRT.width, dstRT.height);
        u.uMouse.value.set(mouse.x, mouse.y);
        u.uMouseVel.value.set(mouse.velX, mouse.velY);
        u.uScroll.value = scrollState.y;
        u.uOpacity.value = overrideOpacity ?? layer.opacity;
        u.uBlendMode.value = overrideBlend ?? (BLEND_MODE_MAP[layer.blendMode] ?? 0);
        u.uBackground.value = srcRT.texture;

        // Per-effect uniforms
        const def = EFFECTS_BY_KIND[layer.kind];
        if (def) {
          for (const p of def.params) {
            if (p.kind === "text" || p.kind === "font") continue;
            const name = `u${capitalizeFirst(p.key)}`;
            if (!u[name]) continue;
            const raw = layer.uniforms[p.key] ?? p.default;
            const v = u[name].value;
            if (typeof raw === "number") {
              u[name].value = raw;
            } else if (Array.isArray(raw)) {
              const r0 = raw[0] ?? 0;
              const r1 = raw[1] ?? 0;
              const r2 = raw[2] ?? 0;
              const r3 = raw[3] ?? 0;
              if (v instanceof THREE.Vector2) v.set(r0, r1);
              else if (v instanceof THREE.Vector3) v.set(r0, r1, r2);
              else if (v instanceof THREE.Vector4) v.set(r0, r1, r2, r3);
            }
          }
        }

        // Sampler texture
        if (layer.kind === "text") {
          ensureTextTexture(layer, gpu);
          u.uTexture.value = gpu.texture;
          if (gpu.texSize) u.uTexSize.value.set(gpu.texSize[0], gpu.texSize[1]);
        } else if (
          layer.kind === "image" ||
          layer.kind === "video" ||
          layer.kind === "webcam"
        ) {
          void ensureAssetTexture(layer, gpu);
          if (
            gpu.video &&
            (gpu.texSize?.[0] ?? 0) !== gpu.video.videoWidth &&
            gpu.video.videoWidth > 0
          ) {
            gpu.texSize = [gpu.video.videoWidth, gpu.video.videoHeight];
          }
          u.uTexture.value = gpu.texture ?? null;
          if (gpu.texSize) u.uTexSize.value.set(gpu.texSize[0], gpu.texSize[1]);
        } else if (layer.kind === "model") {
          ensureModel(layer, gpu);
          u.uTexture.value = gpu.texture ?? null;
          u.uFlipY.value = 1; // WebGLRenderTarget sampled upside down
          if (gpu.texSize) u.uTexSize.value.set(gpu.texSize[0], gpu.texSize[1]);
        }

        // CRT prev frame
        if (layer.kind === "crt" && gpu.prevRt) {
          u.uPrev.value = gpu.prevRt.texture;
        }

        if (
          layer.kind === "bloom" ||
          layer.kind === "tiltShift" ||
          layer.kind === "progressiveBlur"
        ) {
          if (!gpu.bloomMips) {
            gpu.bloomMips = createBloomMips(width * dpr, height * dpr, 5);
          }
          const opacity = overrideOpacity ?? layer.opacity;
          const blendMode = overrideBlend ?? (BLEND_MODE_MAP[layer.blendMode] ?? 0);
          if (layer.kind === "bloom") {
            const tint =
              (layer.uniforms.tint as [number, number, number] | undefined) ?? [1, 1, 1];
            renderBloom(renderer, bloomPipeline, gpu.bloomMips, srcRT.texture, dstRT, {
              thresh: Number(layer.uniforms.thresh ?? 0.6),
              knee: Number(layer.uniforms.knee ?? 0.5),
              radius: Math.max(0, Math.min(1, Number(layer.uniforms.radius ?? 0.5) * 25)),
              strength: Number(layer.uniforms.strength ?? 1),
              tint,
              opacity,
              blendMode,
            });
          } else if (layer.kind === "tiltShift") {
            const blurRaw = Number(layer.uniforms.blur ?? 0.02);
            renderTiltShift(renderer, bloomPipeline, gpu.bloomMips, srcRT.texture, dstRT, {
              focus: Number(layer.uniforms.focus ?? 0.5),
              width: Number(layer.uniforms.width ?? 0.15),
              falloff: Number(layer.uniforms.falloff ?? 0.2),
              direction: Number(layer.uniforms.direction ?? 0),
              desaturate: Number(layer.uniforms.desaturate ?? 0),
              opacity,
              blendMode,
              radius01: Math.max(0, Math.min(1, blurRaw * 30)),
            });
          } else {
            const strengthRaw = Number(layer.uniforms.strength ?? 0.05);
            renderProgressive(renderer, bloomPipeline, gpu.bloomMips, srcRT.texture, dstRT, {
              angle: Number(layer.uniforms.angle ?? Math.PI / 2),
              start: Number(layer.uniforms.start ?? 0.2),
              end: Number(layer.uniforms.end ?? 0.9),
              curve: Number(layer.uniforms.curve ?? 1),
              radius01: Math.max(0, Math.min(1, strengthRaw * 15)),
              opacity,
              blendMode,
            });
          }
          return;
        }
        if (layer.compositeMode === "mask") {
          quad.material = clearMat;
          renderer.setRenderTarget(rtMask);
          renderer.render(clearScene, camera);
          u.uBackground.value = rtMask.texture;
          quad.material = gpu.material;
          renderer.setRenderTarget(rtMask);
          renderer.render(scene, camera);
          maskApplyMat.uniforms.uBase.value = srcRT.texture;
          maskApplyMat.uniforms.uMask.value = rtMask.texture;
          const src =
            layer.mask.source === "luminance"
              ? 0
              : layer.mask.source === "alpha"
                ? 1
                : layer.mask.source === "red"
                  ? 2
                  : layer.mask.source === "green"
                    ? 3
                    : 4;
          maskApplyMat.uniforms.uSource.value = src;
          maskApplyMat.uniforms.uMode.value = layer.mask.mode === "stencil" ? 1 : 0;
          maskApplyMat.uniforms.uInvert.value = layer.mask.invert ? 1 : 0;
          maskApplyMat.uniforms.uThreshold.value = layer.mask.threshold;
          quad.material = maskApplyMat;
          renderer.setRenderTarget(dstRT);
          renderer.render(scene, camera);
          return;
        }
        quad.material = gpu.material;
        renderer.setRenderTarget(dstRT);
        renderer.render(scene, camera);
        if (layer.kind === "crt" && gpu.prevRt) {
          copyMat.uniforms.uTex.value = dstRT.texture;
          copyMat.uniforms.uBg.value.set(0, 0, 0);
          copyMat.uniforms.uBrightness.value = 1;
          copyMat.uniforms.uContrast.value = 1;
          copyMat.uniforms.uInvert.value = 0;
          quad.material = copyMat;
          renderer.setRenderTarget(gpu.prevRt);
          renderer.render(scene, camera);
        }
      }

      const inClip = (l: Layer) => {
        const start = l.clipIn ?? -Infinity;
        const end = l.clipOut ?? Infinity;
        return globalTime >= start && globalTime <= end;
      };
      for (const raw of layers) {
        if (raw.parentId) continue;
        if (!raw.visible) continue;
        if (!inClip(raw)) continue;
        const layer = evalLayer(raw, { ...ctx, time: effectiveTime(raw) });
        const rawChildren = childrenByParent.get(layer.id) ?? [];
        const visibleChildren = rawChildren.filter((c) => c.visible);

        if (visibleChildren.length === 0) {
          drawLayer(layer, read, write);
        } else {
          // Isolated group pipeline
          quad.material = clearMat;
          renderer.setRenderTarget(rtGroupA);
          renderer.render(clearScene, camera);
          let gRead = rtGroupA;
          let gWrite = rtGroupB;
          // Render parent onto black, forced normal blend + full opacity
          drawLayer(layer, gRead, gWrite, 0, 1);
          const swap0 = gRead;
          gRead = gWrite;
          gWrite = swap0;
          for (const childRaw of visibleChildren) {
            if (!inClip(childRaw)) continue;
            const child = evalLayer(childRaw, { ...ctx, time: effectiveTime(childRaw) });
            drawLayer(child, gRead, gWrite);
            const sw = gRead;
            gRead = gWrite;
            gWrite = sw;
          }
          // Composite group output onto global with parent's blend+opacity
          groupCompositeMat.uniforms.uBase.value = read.texture;
          groupCompositeMat.uniforms.uOverlay.value = gRead.texture;
          groupCompositeMat.uniforms.uBlendMode.value =
            BLEND_MODE_MAP[layer.blendMode] ?? 0;
          groupCompositeMat.uniforms.uOpacity.value = layer.opacity;
          quad.material = groupCompositeMat;
          renderer.setRenderTarget(write);
          renderer.render(scene, camera);
        }

        const swap = read;
        read = write;
        write = swap;
      }

      const sceneCfg = useSceneStore.getState();
      quad.material = copyMat;
      copyMat.uniforms.uTex.value = read.texture;
      (copyMat.uniforms.uBg.value as THREE.Vector3).set(
        sceneCfg.backgroundColor[0],
        sceneCfg.backgroundColor[1],
        sceneCfg.backgroundColor[2],
      );
      copyMat.uniforms.uBrightness.value = sceneCfg.brightness;
      copyMat.uniforms.uContrast.value = sceneCfg.contrast;
      copyMat.uniforms.uInvert.value = sceneCfg.invert;
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
    }

    animate();

    function handleResize() {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;
      renderer.setSize(width, height);
      const pw = Math.floor(width * dpr);
      const ph = Math.floor(height * dpr);
      rtA.setSize(pw, ph);
      rtB.setSize(pw, ph);
      rtMask.setSize(pw, ph);
      rtGroupA.setSize(pw, ph);
      rtGroupB.setSize(pw, ph);
      for (const gpu of gpuMap.values()) {
        if (gpu.prevRt) gpu.prevRt.setSize(pw, ph);
        if (gpu.bloomMips) resizeBloomMips(gpu.bloomMips, pw, ph);
        if (gpu.modelRt) gpu.modelRt.setSize(pw, ph);
        if (gpu.kind === "text") {
          gpu.textKey = undefined; // force rebuild
        }
      }
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      for (const gpu of gpuMap.values()) disposeGpu(gpu);
      gpuMap.clear();
      rtA.dispose();
      rtB.dispose();
      rtMask.dispose();
      rtGroupA.dispose();
      rtGroupB.dispose();
      groupCompositeMat.dispose();
      maskApplyMat.dispose();
      copyMat.dispose();
      disposeBloomPipeline(bloomPipeline);
      clearMat.dispose();
      quadGeom.dispose();
      renderer.dispose();
      if (canvas.parentNode === container) container.removeChild(canvas);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        background: "var(--ds-color-canvas)",
        overflow: "hidden",
      }}
    />
  );
};

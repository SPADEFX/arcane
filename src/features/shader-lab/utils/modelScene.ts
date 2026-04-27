import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

export interface ModelConfig {
  source: number; // 0=primitive, 1=glb, 2=svg
  primitive: number; // 0..10
  size: number;
  segments: number;
  tubeRatio: number;
  extrudeDepth: number;
  bevel: number;
  svgScale: number;
  url?: string;
  material: number; // 0=physical, 1=glass, 2=metal, 3=basic, 4-6=matcap, 7=wireframe, 8=normal
  color: [number, number, number];
  metalness: number;
  roughness: number;
  transmission: number;
  ior: number;
  thickness: number;
  clearcoat: number;
  emissive: [number, number, number];
  emissiveIntensity: number;
  envStrength: number;
  ambient: number;
  keyIntensity: number;
  keyColor: [number, number, number];
  rimIntensity: number;
  rimColor: [number, number, number];
  bgColor: [number, number, number];
}

export interface ModelScene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  group: THREE.Group;
  keyLight: THREE.DirectionalLight;
  rimLight: THREE.DirectionalLight;
  ambient: THREE.AmbientLight;
  mesh?: THREE.Object3D;
  disposed: boolean;
  envMap?: THREE.Texture;
  // Cache keys
  geometryKey: string;
  materialKey: string;
  gltfUrl?: string;
  svgUrl?: string;
  loadingUrl?: string;
}

let matcapCache: Record<number, THREE.Texture> = {};

function makeMatcap(kind: number): THREE.Texture {
  if (matcapCache[kind]) return matcapCache[kind];
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const cx = size / 2;
  const cy = size / 2;
  const radial = ctx.createRadialGradient(cx * 0.7, cy * 0.6, 0, cx, cy, size * 0.65);
  if (kind === 4) {
    // Silver
    radial.addColorStop(0, "#ffffff");
    radial.addColorStop(0.4, "#d3d6dc");
    radial.addColorStop(0.7, "#74797f");
    radial.addColorStop(1, "#20232a");
  } else if (kind === 5) {
    // Gold
    radial.addColorStop(0, "#fff3c2");
    radial.addColorStop(0.35, "#f8c763");
    radial.addColorStop(0.7, "#b4762a");
    radial.addColorStop(1, "#2a1a08");
  } else {
    // Chrome
    radial.addColorStop(0, "#ffffff");
    radial.addColorStop(0.3, "#aacfff");
    radial.addColorStop(0.55, "#3e5a8c");
    radial.addColorStop(0.85, "#0b1426");
    radial.addColorStop(1, "#000");
  }
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, size, size);
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.46, 0, Math.PI * 2);
  ctx.fillStyle = radial;
  ctx.fill();
  // Specular highlight
  const spec = ctx.createRadialGradient(cx * 0.6, cy * 0.45, 0, cx * 0.6, cy * 0.45, size * 0.18);
  spec.addColorStop(0, "rgba(255,255,255,0.9)");
  spec.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = spec;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  matcapCache[kind] = tex;
  return tex;
}

function buildPrimitive(cfg: ModelConfig): THREE.BufferGeometry {
  const s = cfg.size;
  const seg = Math.max(3, Math.floor(cfg.segments));
  switch (cfg.primitive) {
    case 0:
      return new THREE.BoxGeometry(s, s, s);
    case 1:
      return new THREE.SphereGeometry(s * 0.7, seg, Math.max(3, Math.floor(seg / 2)));
    case 2:
      return new THREE.TorusGeometry(s * 0.55, s * cfg.tubeRatio, Math.max(8, Math.floor(seg / 2)), seg);
    case 3:
      return new THREE.TorusKnotGeometry(s * 0.5, s * cfg.tubeRatio * 0.6, seg * 2, Math.max(8, Math.floor(seg / 3)));
    case 4:
      return new THREE.CylinderGeometry(s * 0.5, s * 0.5, s, seg);
    case 5:
      return new THREE.ConeGeometry(s * 0.55, s, seg);
    case 6:
      return new THREE.PlaneGeometry(s * 1.5, s);
    case 7:
      return new THREE.DodecahedronGeometry(s * 0.7, 0);
    case 8:
      return new THREE.IcosahedronGeometry(s * 0.7, 0);
    case 9:
      return new THREE.OctahedronGeometry(s * 0.7, 0);
    case 10:
      return new THREE.TetrahedronGeometry(s * 0.8, 0);
    default:
      return new THREE.BoxGeometry(s, s, s);
  }
}

function disposeMesh(obj: THREE.Object3D) {
  obj.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
    const mat = m.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
    else if (mat) mat.dispose();
  });
  if (obj.parent) obj.parent.remove(obj);
}

function buildMaterial(
  cfg: ModelConfig,
  envMap?: THREE.Texture,
): THREE.Material {
  const color = new THREE.Color(cfg.color[0], cfg.color[1], cfg.color[2]);
  const emissive = new THREE.Color(cfg.emissive[0], cfg.emissive[1], cfg.emissive[2]);
  if (cfg.material === 3) {
    return new THREE.MeshBasicMaterial({ color });
  }
  if (cfg.material === 7) {
    return new THREE.MeshBasicMaterial({ color, wireframe: true });
  }
  if (cfg.material === 8) {
    return new THREE.MeshNormalMaterial({ flatShading: false });
  }
  if (cfg.material === 4 || cfg.material === 5 || cfg.material === 6) {
    return new THREE.MeshMatcapMaterial({ matcap: makeMatcap(cfg.material), color });
  }
  if (cfg.material === 1) {
    // Glass
    const m = new THREE.MeshPhysicalMaterial({
      color,
      metalness: cfg.metalness,
      roughness: cfg.roughness,
      transmission: cfg.transmission,
      ior: cfg.ior,
      thickness: cfg.thickness,
      clearcoat: cfg.clearcoat,
      emissive,
      emissiveIntensity: cfg.emissiveIntensity,
      envMap,
      envMapIntensity: cfg.envStrength,
      transparent: true,
    });
    return m;
  }
  if (cfg.material === 2) {
    // Metal
    return new THREE.MeshPhysicalMaterial({
      color,
      metalness: Math.max(cfg.metalness, 0.8),
      roughness: cfg.roughness,
      clearcoat: cfg.clearcoat,
      emissive,
      emissiveIntensity: cfg.emissiveIntensity,
      envMap,
      envMapIntensity: cfg.envStrength,
    });
  }
  // Physical (standard PBR)
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: cfg.metalness,
    roughness: cfg.roughness,
    clearcoat: cfg.clearcoat,
    emissive,
    emissiveIntensity: cfg.emissiveIntensity,
    envMap,
    envMapIntensity: cfg.envStrength,
  });
}

export function createModelScene(renderer: THREE.WebGLRenderer): ModelScene {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.position.set(0, 0, 3);

  const group = new THREE.Group();
  scene.add(group);

  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xfff2d6, 2);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xaaccff, 1);
  rimLight.position.set(-3, 2, -4);
  scene.add(rimLight);

  const fill = new THREE.DirectionalLight(0xffffff, 0.25);
  fill.position.set(0, -2, 3);
  scene.add(fill);

  // Env map for PBR
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  pmrem.dispose();

  return {
    scene,
    camera,
    group,
    keyLight,
    rimLight,
    ambient,
    disposed: false,
    envMap: env,
    geometryKey: "",
    materialKey: "",
  };
}

export function updateModelScene(s: ModelScene, cfg: ModelConfig) {
  if (s.disposed) return;
  const geoKey = [cfg.source, cfg.primitive, cfg.size, cfg.segments, cfg.tubeRatio, cfg.url, cfg.extrudeDepth, cfg.bevel, cfg.svgScale].join("|");
  const matKey = [cfg.material, ...cfg.color, cfg.metalness, cfg.roughness, cfg.transmission, cfg.ior, cfg.thickness, cfg.clearcoat, ...cfg.emissive, cfg.emissiveIntensity, cfg.envStrength].join("|");

  if (s.geometryKey !== geoKey) {
    s.geometryKey = geoKey;
    if (cfg.source === 0) {
      if (s.mesh) disposeMesh(s.mesh);
      const geo = buildPrimitive(cfg);
      const mat = buildMaterial(cfg, s.envMap);
      const mesh = new THREE.Mesh(geo, mat);
      s.group.add(mesh);
      s.mesh = mesh;
      s.materialKey = matKey;
    } else if (cfg.source === 1 && cfg.url) {
      if (s.gltfUrl !== cfg.url) {
        s.gltfUrl = cfg.url;
        if (s.loadingUrl === cfg.url) return;
        s.loadingUrl = cfg.url;
        new GLTFLoader().load(
          cfg.url,
          (gltf) => {
            if (s.disposed) return;
            if (s.mesh) disposeMesh(s.mesh);
            const obj = gltf.scene;
            fitAndCenter(obj, cfg.size || 1);
            applyMaterial(obj, cfg, s.envMap);
            s.group.add(obj);
            s.mesh = obj;
            s.materialKey = matKey;
            s.loadingUrl = undefined;
          },
          undefined,
          (err) => {
            console.error("GLB load failed", err);
            s.loadingUrl = undefined;
          },
        );
      }
    } else if (cfg.source === 2 && cfg.url) {
      if (s.svgUrl !== cfg.url) {
        s.svgUrl = cfg.url;
        if (s.loadingUrl === cfg.url) return;
        s.loadingUrl = cfg.url;
        new SVGLoader().load(
          cfg.url,
          (data) => {
            if (s.disposed) return;
            if (s.mesh) disposeMesh(s.mesh);
            const grp = new THREE.Group();
            for (const path of data.paths) {
              const shapes = SVGLoader.createShapes(path);
              for (const shape of shapes) {
                const geo = new THREE.ExtrudeGeometry(shape, {
                  depth: Math.max(0.01, cfg.extrudeDepth / cfg.svgScale),
                  bevelEnabled: cfg.bevel > 0,
                  bevelThickness: cfg.bevel / cfg.svgScale,
                  bevelSize: cfg.bevel / cfg.svgScale,
                  bevelSegments: 3,
                  steps: 1,
                });
                geo.center();
                const mat = buildMaterial(cfg, s.envMap);
                const mesh = new THREE.Mesh(geo, mat);
                grp.add(mesh);
              }
            }
            grp.scale.setScalar(cfg.svgScale);
            grp.rotation.x = Math.PI;
            fitAndCenter(grp, cfg.size || 1);
            s.group.add(grp);
            s.mesh = grp;
            s.materialKey = matKey;
            s.loadingUrl = undefined;
          },
          undefined,
          (err) => {
            console.error("SVG load failed", err);
            s.loadingUrl = undefined;
          },
        );
      }
    }
  }

  if (s.materialKey !== matKey && s.mesh) {
    applyMaterial(s.mesh, cfg, s.envMap);
    s.materialKey = matKey;
  }

  // Apply per-frame lighting
  s.ambient.intensity = cfg.ambient;
  s.keyLight.intensity = cfg.keyIntensity;
  s.keyLight.color.setRGB(cfg.keyColor[0], cfg.keyColor[1], cfg.keyColor[2]);
  s.rimLight.intensity = cfg.rimIntensity;
  s.rimLight.color.setRGB(cfg.rimColor[0], cfg.rimColor[1], cfg.rimColor[2]);
  s.scene.background = new THREE.Color(cfg.bgColor[0], cfg.bgColor[1], cfg.bgColor[2]);
}

function applyMaterial(obj: THREE.Object3D, cfg: ModelConfig, envMap?: THREE.Texture) {
  obj.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh) {
      const old = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(old)) old.forEach((x) => x.dispose());
      else if (old) old.dispose();
      m.material = buildMaterial(cfg, envMap);
    }
  });
}

function fitAndCenter(obj: THREE.Object3D, target: number) {
  const box = new THREE.Box3().setFromObject(obj);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = (1.5 * target) / maxDim;
  obj.scale.multiplyScalar(scale);
  box.setFromObject(obj);
  const center = box.getCenter(new THREE.Vector3());
  obj.position.sub(center);
}

export function disposeModelScene(s: ModelScene) {
  s.disposed = true;
  if (s.mesh) disposeMesh(s.mesh);
  s.envMap?.dispose();
}

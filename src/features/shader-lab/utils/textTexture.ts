import * as THREE from "three";

export interface TextTextureOptions {
  text: string;
  fontSize: number;
  fontFamily?: string;
  fontWeight?: number;
  italic?: boolean;
  color?: [number, number, number];
  stroke?: number;
  strokeColor?: [number, number, number];
  letterSpacing?: number;
  align?: "left" | "center" | "right";
  yOffset?: number;
  width: number;
  height: number;
}

function rgbString([r, g, b]: [number, number, number]) {
  const to = (v: number) => Math.max(0, Math.min(255, Math.round(v * 255)));
  return `rgb(${to(r)}, ${to(g)}, ${to(b)})`;
}

export function makeTextTexture(
  opts: TextTextureOptions,
): { texture: THREE.CanvasTexture; width: number; height: number } {
  const canvas = document.createElement("canvas");
  canvas.width = opts.width;
  canvas.height = opts.height;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, opts.width, opts.height);

  const weight = opts.fontWeight ?? 700;
  const family = opts.fontFamily ?? "Inter, system-ui, sans-serif";
  const style = opts.italic ? "italic " : "";
  ctx.font = `${style}${weight} ${opts.fontSize}px ${family}`;
  const align: CanvasTextAlign = opts.align ?? "center";
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing =
    `${opts.letterSpacing ?? 0}px`;

  const x =
    align === "left"
      ? opts.width * 0.05
      : align === "right"
        ? opts.width * 0.95
        : opts.width / 2;
  const y = opts.height / 2 + (opts.yOffset ?? 0) * opts.height;

  if (opts.stroke && opts.stroke > 0) {
    ctx.lineWidth = opts.stroke;
    ctx.strokeStyle = rgbString(opts.strokeColor ?? [0, 0, 0]);
    ctx.lineJoin = "round";
    ctx.miterLimit = 2;
    ctx.strokeText(opts.text, x, y);
  }

  ctx.fillStyle = rgbString(opts.color ?? [1, 1, 1]);
  ctx.fillText(opts.text, x, y);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.LinearSRGBColorSpace;
  texture.needsUpdate = true;
  return { texture, width: opts.width, height: opts.height };
}

export async function loadImageTexture(
  url: string,
): Promise<{ texture: THREE.Texture; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const texture = new THREE.Texture(img);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.colorSpace = THREE.LinearSRGBColorSpace;
      texture.needsUpdate = true;
      resolve({ texture, width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = url;
  });
}

export function makeVideoTexture(url: string): {
  video: HTMLVideoElement;
  texture: THREE.VideoTexture;
} {
  const video = document.createElement("video");
  video.src = url;
  video.crossOrigin = "anonymous";
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  const texture = new THREE.VideoTexture(video);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.LinearSRGBColorSpace;
  return { video, texture };
}

export async function makeWebcamTexture(): Promise<{
  video: HTMLVideoElement;
  texture: THREE.VideoTexture;
  stream: MediaStream;
}> {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: false,
  });
  const video = document.createElement("video");
  video.srcObject = stream;
  video.muted = true;
  video.playsInline = true;
  await video.play();
  const texture = new THREE.VideoTexture(video);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.LinearSRGBColorSpace;
  return { video, texture, stream };
}

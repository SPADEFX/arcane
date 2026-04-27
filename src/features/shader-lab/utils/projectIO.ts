import type { Layer, Project } from "../types";

export function downloadJson(name: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function pickFile(accept: string): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = () => {
      resolve(input.files?.[0] ?? null);
    };
    input.click();
  });
}

export async function exportPng(canvas: HTMLCanvasElement, name = "shader.png") {
  return new Promise<void>((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve();
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      resolve();
    }, "image/png");
  });
}

export function projectFromState(layers: Layer[]): Project {
  // Strip blob: URLs (they don't survive reload). Save raw asset metadata.
  const safeLayers = layers.map((l) => ({
    ...l,
    asset: l.asset
      ? {
          ...l.asset,
          url: l.asset.url?.startsWith("blob:") ? undefined : l.asset.url,
        }
      : undefined,
  }));
  return {
    version: 1,
    layers: safeLayers,
    scene: {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: [0, 0, 0],
      dpi: 1.5,
      fps: 60,
    },
    timeline: {
      isPlaying: false,
      currentTime: 0,
      duration: 8,
      loop: true,
      autoKey: false,
      loopCount: 0,
    },
  };
}

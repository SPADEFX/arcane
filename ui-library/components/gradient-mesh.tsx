"use client";

import { useRef, useEffect } from "react";
import { cn } from "@uilibrary/utils";

export interface GradientMeshProps {
  colors?: string[];
  speed?: number;
  blur?: number;
  className?: string;
}

export function GradientMesh({
  colors = ["#7c3aed", "#2563eb", "#db2777", "#0891b2"],
  speed = 0.003,
  blur = 80,
  className,
}: GradientMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<
    { x: number; y: number; vx: number; vy: number; color: string }[]
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas!.width = canvas!.offsetWidth * dpr;
      canvas!.height = canvas!.offsetHeight * dpr;
      ctx!.scale(dpr, dpr);
    }

    resize();
    window.addEventListener("resize", resize);

    blobsRef.current = colors.map((color, i) => ({
      x: 0.2 + (i * 0.6) / Math.max(colors.length - 1, 1),
      y: 0.2 + ((i % 2) * 0.6),
      vx: (Math.random() - 0.5) * speed * 2,
      vy: (Math.random() - 0.5) * speed * 2,
      color,
    }));

    function draw() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      ctx!.clearRect(0, 0, w, h);

      for (const blob of blobsRef.current) {
        blob.x += blob.vx;
        blob.y += blob.vy;
        if (blob.x < 0 || blob.x > 1) blob.vx *= -1;
        if (blob.y < 0 || blob.y > 1) blob.vy *= -1;
        blob.x = Math.max(0, Math.min(1, blob.x));
        blob.y = Math.max(0, Math.min(1, blob.y));

        const gradient = ctx!.createRadialGradient(
          blob.x * w,
          blob.y * h,
          0,
          blob.x * w,
          blob.y * h,
          w * 0.5,
        );
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(1, "transparent");

        ctx!.globalCompositeOperation = "lighter";
        ctx!.fillStyle = gradient;
        ctx!.fillRect(0, 0, w, h);
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [colors, speed]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ filter: `blur(${blur}px)` }}
      />
    </div>
  );
}

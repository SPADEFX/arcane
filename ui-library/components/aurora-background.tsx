"use client";

import { cn } from "@uilibrary/utils";

export interface AuroraBackgroundProps {
  colors?: [string, string, string];
  speed?: "slow" | "normal" | "fast";
  className?: string;
}

const speeds = {
  slow: "30s",
  normal: "20s",
  fast: "12s",
};

export function AuroraBackground({
  colors = ["#7c3aed", "#2563eb", "#db2777"],
  speed = "normal",
  className,
}: AuroraBackgroundProps) {
  const duration = speeds[speed];

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {colors.map((color, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            width: "60%",
            height: "60%",
            left: `${10 + i * 20}%`,
            top: `${10 + (i % 2) * 30}%`,
            filter: "blur(80px)",
            animation: `aurora-${i} ${duration} ease-in-out infinite`,
            mixBlendMode: "screen",
          }}
        />
      ))}
      <style>{`
        @keyframes aurora-0 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          33% { transform: translate(30%, 20%) rotate(120deg) scale(1.1); }
          66% { transform: translate(-20%, 10%) rotate(240deg) scale(0.9); }
        }
        @keyframes aurora-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          33% { transform: translate(-30%, -20%) rotate(-120deg) scale(1.2); }
          66% { transform: translate(20%, -10%) rotate(-240deg) scale(0.8); }
        }
        @keyframes aurora-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          33% { transform: translate(20%, -30%) rotate(60deg) scale(0.9); }
          66% { transform: translate(-10%, 20%) rotate(180deg) scale(1.1); }
        }
      `}</style>
    </div>
  );
}

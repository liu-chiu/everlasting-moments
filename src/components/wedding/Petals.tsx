import { useEffect, useRef } from "react";
import { cssColor, fitCanvas, prefersReducedMotion, runLoop } from "./canvas-utils";
import { cn } from "@/lib/utils";

type Petal = { x: number; y: number; s: number; vy: number; vx: number; rot: number; vr: number; sway: number; hue: number };

/** Soft falling rose petals + gold flecks. */
export function Petals({ className, count = 26 }: { className?: string; count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || prefersReducedMotion()) return;
    let { ctx, width, height } = fitCanvas(canvas);
    const colors = [cssColor("--rose", "#d88a80"), cssColor("--rose-soft", "#f1d7d2"), cssColor("--gold-soft", "#f5e1b0")];
    const n = width < 640 ? Math.round(count * 0.6) : count;
    const make = (initial: boolean): Petal => ({
      x: Math.random() * width,
      y: initial ? Math.random() * height : -20,
      s: 6 + Math.random() * 9,
      vy: 0.35 + Math.random() * 0.8,
      vx: -0.2 + Math.random() * 0.4,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.02,
      sway: Math.random() * Math.PI * 2,
      hue: Math.floor(Math.random() * colors.length),
    });
    const petals = Array.from({ length: n }, () => make(true));
    const onResize = () => ({ ctx, width, height } = fitCanvas(canvas));
    window.addEventListener("resize", onResize);

    const stop = runLoop(canvas, (_t, dt) => {
      const k = dt / 16;
      ctx.clearRect(0, 0, width, height);
      for (const p of petals) {
        p.sway += 0.015 * k;
        p.y += p.vy * k;
        p.x += (p.vx + Math.sin(p.sway) * 0.5) * k;
        p.rot += p.vr * k;
        if (p.y > height + 20) Object.assign(p, make(false));
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(p.sway)));
        ctx.globalAlpha = 0.75;
        ctx.fillStyle = colors[p.hue] ?? "transparent";
        ctx.beginPath();
        ctx.moveTo(0, -p.s / 2);
        ctx.bezierCurveTo(p.s / 2, -p.s / 2, p.s / 2, p.s / 3, 0, p.s / 2);
        ctx.bezierCurveTo(-p.s / 2, p.s / 3, -p.s / 2, -p.s / 2, 0, -p.s / 2);
        ctx.fill();
        ctx.restore();
      }
    });
    return () => {
      stop();
      window.removeEventListener("resize", onResize);
    };
  }, [count]);

  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} />;
}

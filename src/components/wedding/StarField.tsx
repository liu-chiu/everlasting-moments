import { useEffect, useRef } from "react";
import { cssColor, fitCanvas, prefersReducedMotion, runLoop } from "./canvas-utils";
import { cn } from "@/lib/utils";

type Star = { x: number; y: number; r: number; p: number; s: number; gold: boolean };
type Meteor = { x: number; y: number; vx: number; vy: number; life: number };

export function StarField({ className, density = 1 }: { className?: string; density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let { ctx, width, height } = fitCanvas(canvas);
    const gold = cssColor("--gold", "#e9ad32");
    const light = cssColor("--night-foreground", "#fff8ee");
    let stars: Star[] = [];
    const meteors: Meteor[] = [];

    const seed = () => {
      const count = Math.round(((width * height) / 5200) * density);
      stars = Array.from({ length: Math.min(count, 380) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.3 + 0.25,
        p: Math.random() * Math.PI * 2,
        s: 0.6 + Math.random() * 1.6,
        gold: Math.random() < 0.12,
      }));
    };
    seed();

    const onResize = () => {
      ({ ctx, width, height } = fitCanvas(canvas));
      seed();
    };
    window.addEventListener("resize", onResize);

    const reduced = prefersReducedMotion();
    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const st of stars) {
        const a = reduced ? 0.7 : 0.35 + 0.65 * Math.abs(Math.sin(st.p + (t / 1000) * st.s));
        ctx.globalAlpha = a;
        ctx.fillStyle = st.gold ? gold : light;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduced && Math.random() < 0.012 && meteors.length < 3) {
        meteors.push({
          x: Math.random() * width * 0.8 + width * 0.2,
          y: Math.random() * height * 0.4,
          vx: -(6 + Math.random() * 5),
          vy: 2.2 + Math.random() * 2,
          life: 1,
        });
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx;
        m.y += m.vy;
        m.life -= 0.014;
        const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 14, m.y - m.vy * 14);
        grad.addColorStop(0, light);
        grad.addColorStop(1, "transparent");
        ctx.globalAlpha = Math.max(0, m.life);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * 14, m.y - m.vy * 14);
        ctx.stroke();
        if (m.life <= 0 || m.x < -100 || m.y > height + 100) meteors.splice(i, 1);
      }
      ctx.globalAlpha = 1;
    };

    if (reduced) {
      draw(0);
      return () => window.removeEventListener("resize", onResize);
    }
    const stop = runLoop(canvas, (t) => draw(t));
    return () => {
      stop();
      window.removeEventListener("resize", onResize);
    };
  }, [density]);

  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} />;
}

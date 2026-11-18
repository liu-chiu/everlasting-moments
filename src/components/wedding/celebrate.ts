// Lightweight one-shot burst of gold confetti and hearts (no library).
import { cssColor, prefersReducedMotion } from "./canvas-utils";

export function celebrate(origin?: { x: number; y: number }) {
  if (typeof window === "undefined" || prefersReducedMotion()) return;
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, { position: "fixed", inset: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: "90" });
  document.body.appendChild(canvas);
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);
  const colors = [cssColor("--gold", "#e9ad32"), cssColor("--gold-soft", "#f5e1b0"), cssColor("--rose", "#d88a80"), cssColor("--wax", "#962826")];
  const ox = origin?.x ?? W / 2;
  const oy = origin?.y ?? H / 2;
  const parts = Array.from({ length: W < 640 ? 90 : 150 }, () => {
    const a = Math.random() * Math.PI * 2;
    const v = 4 + Math.random() * 9;
    return {
      x: ox, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 5,
      r: 3 + Math.random() * 5, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
      c: colors[Math.floor(Math.random() * colors.length)], heart: Math.random() < 0.25, life: 1,
    };
  });
  const heart = (s: number) => {
    ctx.beginPath();
    ctx.moveTo(0, s * 0.3);
    ctx.bezierCurveTo(-s, -s * 0.4, -s * 0.4, -s, 0, -s * 0.45);
    ctx.bezierCurveTo(s * 0.4, -s, s, -s * 0.4, 0, s * 0.3);
    ctx.fill();
  };
  let frame = 0;
  const tick = () => {
    frame++;
    ctx.clearRect(0, 0, W, H);
    let alive = 0;
    for (const p of parts) {
      p.vy += 0.22; p.vx *= 0.985; p.vy *= 0.985;
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      p.life -= 0.008;
      if (p.life <= 0 || p.y > H + 30) continue;
      alive++;
      ctx.save();
      ctx.globalAlpha = Math.min(1, p.life * 1.5);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      if (p.heart) heart(p.r * 1.6);
      else ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
      ctx.restore();
    }
    if (alive && frame < 400) requestAnimationFrame(tick);
    else canvas.remove();
  };
  requestAnimationFrame(tick);
}

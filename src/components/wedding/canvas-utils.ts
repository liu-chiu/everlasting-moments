export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Sizes a canvas to its box with a capped pixel ratio (perf on phones). */
export function fitCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.round(width * dpr));
  canvas.height = Math.max(1, Math.round(height * dpr));
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

/**
 * Drives an rAF loop that only runs while the canvas is visible and the tab is
 * active. Returns a cleanup function.
 */
export function runLoop(canvas: HTMLCanvasElement, frame: (t: number, dt: number) => void) {
  let raf = 0;
  let last = 0;
  let onScreen = true;
  const tick = (t: number) => {
    const dt = Math.min(48, last ? t - last : 16);
    last = t;
    frame(t, dt);
    raf = requestAnimationFrame(tick);
  };
  const start = () => {
    if (!raf && onScreen && !document.hidden) {
      last = 0;
      raf = requestAnimationFrame(tick);
    }
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };
  const io = new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    if (onScreen) start();
    else stop();
  });
  io.observe(canvas);
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVis);
  start();
  return () => {
    stop();
    io.disconnect();
    document.removeEventListener("visibilitychange", onVis);
  };
}

/** Reads a CSS custom property as a usable canvas color. */
export function cssColor(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { GALLERY } from "@/lib/wedding";
import { GALLERY_AUTOPLAY_MS, shouldAutoAdvance } from "@/lib/gallery-autoplay";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const VISIBLE_OFFSETS = [-3, -2, -1, 0, 1, 2, 3] as const;

function wrapIndex(slot: number, total: number) {
  return ((slot % total) + total) % total;
}

function shortestDelta(fromIndex: number, toIndex: number, total: number) {
  let diff = (toIndex - fromIndex + total) % total;
  if (diff > total / 2) diff -= total;
  return diff;
}

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const [activeSlot, setActiveSlot] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [inView, setInView] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLSpanElement | null>(null);
  const activeSlideRef = useRef<HTMLButtonElement | null>(null);
  const restoreAfterClose = useRef(false);
  const suppressClick = useRef(false);
  const dragState = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startTime: number;
    locked: "x" | "y" | null;
  } | null>(null);

  const total = GALLERY.length;
  const currentIndex = wrapIndex(activeSlot, total);

  const go = useCallback((delta: number) => {
    if (delta === 0) return;
    setActiveSlot((prev) => prev + delta);
  }, []);

  const openPhoto = (i: number) => {
    setOpen(i);
  };

  const handleLightboxIndex = useCallback(
    (nextIndex: number) => {
      setOpen(nextIndex);
      setActiveSlot((prev) => prev + shortestDelta(wrapIndex(prev, total), nextIndex, total));
    },
    [total],
  );

  const closePhoto = useCallback(() => {
    restoreAfterClose.current = true;
    setOpen(null);
  }, []);

  useEffect(() => {
    if (open !== null || !restoreAfterClose.current) return;
    restoreAfterClose.current = false;
    const frame = requestAnimationFrame(() => {
      activeSlideRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const getStepPx = () => {
    const width = trackRef.current?.clientWidth ?? 900;
    return Math.max(130, Math.min(250, width * 0.32));
  };

  // Guests who ask for less movement start with the album on hold.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setPlaying(false);
    const onChange = (event: MediaQueryListEvent) => setPlaying(!event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onVisibility = () => setPageHidden(document.visibilityState === "hidden");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    const node = sliderRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setInView(entry.isIntersecting);
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const autoplayRunning = shouldAutoAdvance({
    enabled: playing,
    lightboxOpen: open !== null,
    dragging: isDragging,
    hovered,
    focused,
    pageHidden,
    inView,
  });

  // One timer per photo: the gold bar fills as the seconds run out, then the
  // album slides on. Writing the bar straight to the DOM keeps the loop free of
  // re-renders, and a pause simply stops the loop with the bar left where it is.
  useEffect(() => {
    const bar = progressBarRef.current;
    if (!autoplayRunning) {
      if (!playing) bar?.style.setProperty("--auto-progress", "0");
      return;
    }
    bar?.style.setProperty("--auto-progress", "0");
    let frame = 0;
    let elapsed = 0;
    let last = performance.now();
    const tick = (now: number) => {
      elapsed += now - last;
      last = now;
      const ratio = Math.min(1, elapsed / GALLERY_AUTOPLAY_MS);
      bar?.style.setProperty("--auto-progress", String(ratio));
      if (ratio >= 1) {
        go(1);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [autoplayRunning, activeSlot, go, playing]);

  const onTrackPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    dragState.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startTime: performance.now(),
      locked: null,
    };
    suppressClick.current = false;
  };

  const onTrackPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    if (drag.locked === null) {
      if (Math.hypot(dx, dy) < 7) return;
      drag.locked = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
      if (drag.locked === "x") {
        e.currentTarget.setPointerCapture(e.pointerId);
        setIsDragging(true);
      }
    }

    if (drag.locked === "x") {
      setDragOffset(dx);
    }
  };

  const finishDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    dragState.current = null;

    if (drag.locked === "x") {
      const dx = e.clientX - drag.startX;
      const dt = Math.max(1, performance.now() - drag.startTime);
      const velocity = dx / dt;
      const stepPx = getStepPx();

      if (Math.abs(dx) > 8) {
        suppressClick.current = true;
      }
      if (Math.abs(dx) > 40 || Math.abs(velocity) > 0.35) {
        const projected = Math.abs(dx + velocity * 140);
        const steps = Math.max(1, Math.min(2, Math.round(projected / stepPx)));
        go(dx < 0 ? steps : -steps);
      }
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  const dragProgress = isDragging ? dragOffset / getStepPx() : 0;

  return (
    <section id="gallery" className="paper-grain relative overflow-hidden py-24 sm:py-32">
      <div className="px-4 sm:px-6">
        <SectionHeading eyebrow="Selected moments">
          Wedding <em>Gallery</em>
        </SectionHeading>
      </div>

      <Reveal className="mt-10 sm:mt-14">
        <div
          ref={sliderRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Album ảnh cưới"
          className="gallery-slider"
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") setHovered(true);
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") setHovered(false);
          }}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
          }}
        >
          <div
            ref={trackRef}
            className={`gallery-track${isDragging ? " is-grabbing" : ""}`}
            data-dragging={isDragging ? "true" : undefined}
            tabIndex={0}
            onPointerDown={onTrackPointerDown}
            onPointerMove={onTrackPointerMove}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                go(1);
              }
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                go(-1);
              }
            }}
            aria-label="Danh sách ảnh cưới, dùng phím trái phải để chuyển ảnh"
          >
            {VISIBLE_OFFSETS.map((offset) => {
              const slot = activeSlot + offset;
              const photoIndex = wrapIndex(slot, total);
              const photo = GALLERY[photoIndex];
              if (!photo) return null;

              const eff = offset + dragProgress;
              const absEff = Math.abs(eff);
              const state = absEff < 0.45 ? "active" : absEff < 1.55 ? "near" : "far";
              const aspect = photo.landscape ? "4 / 3" : "3 / 4";
              const scale = Math.max(0.68, 1 - absEff * 0.13);
              const rotY = Math.max(-34, Math.min(34, eff * -21));
              const rotZ = Math.max(-6, Math.min(6, eff * 2.2));
              const arcY = Math.pow(absEff, 1.55) * 14;
              const opacity = absEff >= 2.55 ? 0 : Math.max(0, 1 - absEff * 0.34);
              const zIndex = 10 - Math.round(absEff * 2);

              return (
                <button
                  key={slot}
                  ref={(node) => {
                    if (offset === 0) activeSlideRef.current = node;
                  }}
                  type="button"
                  aria-roledescription="slide"
                  aria-label={
                    offset === 0
                      ? `Xem ảnh ${photoIndex + 1} trên ${total}`
                      : `Chuyển tới ảnh ${photoIndex + 1} trên ${total}`
                  }
                  aria-current={offset === 0 ? "true" : undefined}
                  tabIndex={offset === 0 ? 0 : -1}
                  onClick={() => {
                    if (suppressClick.current) {
                      suppressClick.current = false;
                      return;
                    }
                    if (offset === 0) {
                      openPhoto(photoIndex);
                    } else {
                      go(offset);
                    }
                  }}
                  className="photo"
                  data-state={state}
                  style={{
                    zIndex,
                    pointerEvents: absEff > 2.2 ? "none" : "auto",
                    ["--eff" as string]: eff,
                    ["--abs-eff" as string]: absEff,
                    ["--slide-scale" as string]: scale,
                    ["--slide-roty" as string]: `${rotY}deg`,
                    ["--slide-rotz" as string]: `${rotZ}deg`,
                    ["--slide-y" as string]: `${arcY}px`,
                    ["--slide-opacity" as string]: opacity,
                    ["--slide-aspect" as string]: aspect,
                  }}
                >
                  <img
                    ref={(img) => {
                      if (img?.complete) img.dataset["loaded"] = "true";
                    }}
                    src={photo.thumb}
                    alt={photo.alt}
                    loading={Math.abs(offset) <= 2 ? "eager" : "lazy"}
                    decoding="async"
                    width={photo.landscape ? 640 : 426}
                    height={photo.landscape ? 426 : 640}
                    draggable={false}
                    onLoad={(e) => {
                      e.currentTarget.dataset["loaded"] = "true";
                    }}
                  />
                </button>
              );
            })}
          </div>

          <div className="gallery-progress" aria-hidden="true">
            <span ref={progressBarRef} className="gallery-progress__fill" />
          </div>

          <div className="gallery-controls">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Ảnh trước trong album"
              className="gallery-arrow"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <span aria-live="polite" className="gallery-counter">
              {currentIndex + 1} / {total}
            </span>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Ảnh tiếp theo trong album"
              className="gallery-arrow"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setPlaying((prev) => !prev)}
              aria-pressed={playing}
              aria-label={playing ? "Tạm dừng tự chuyển ảnh" : "Bật tự chuyển ảnh"}
              title={playing ? "Tạm dừng tự chuyển ảnh" : "Bật tự chuyển ảnh"}
              className="gallery-arrow gallery-toggle"
              data-playing={playing ? "true" : "false"}
            >
              {playing ? (
                <Pause className="size-4" aria-hidden="true" />
              ) : (
                <Play className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>

          {playing && (
            <p className="gallery-hint">
              Ảnh tự chuyển sau {GALLERY_AUTOPLAY_MS / 1000} giây — rê chuột, bấm phím hoặc
              kéo ảnh là album sẽ chờ bạn.
            </p>
          )}
        </div>
      </Reveal>

      {open !== null && (
        <Lightbox index={open} onClose={closePhoto} onIndex={handleLightboxIndex} />
      )}
    </section>
  );
}

function Lightbox({
  index,
  onClose,
  onIndex,
}: {
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const total = GALLERY.length;
  const [scale, setScale] = useState(1);
  const closeRef = useRef<HTMLButtonElement>(null);
  const gestureStart = useRef<{ x: number; y: number; id: number } | null>(null);
  const go = useCallback(
    (d: number) => onIndex((index + d + total) % total),
    [index, onIndex, total],
  );

  useEffect(() => {
    document.documentElement.classList.add("is-locked");
    closeRef.current?.focus({ preventScroll: true });
    return () => document.documentElement.classList.remove("is-locked");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  useEffect(() => {
    setScale(1);
    // Warm up neighbours for instant swipes.
    [1, -1].forEach((d) => {
      const n = GALLERY[(index + d + total) % total];
      if (n) new Image().src = n.full;
    });
  }, [index, total]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (scale > 1.01 || (e.target as HTMLElement).closest("button")) return;
    gestureStart.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const start = gestureStart.current;
    gestureStart.current = null;
    if (!start || start.id !== e.pointerId || scale > 1.01) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.25) go(dx < 0 ? 1 : -1);
  };

  const g = GALLERY[index];
  if (!g) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Xem ảnh ${index + 1} trên ${total}`}
      className="lightbox-enter fixed inset-0 z-[70] overflow-hidden bg-night/95 backdrop-blur-sm"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        gestureStart.current = null;
      }}
    >
      <TransformWrapper
        key={g.id}
        initialScale={1}
        minScale={1}
        maxScale={5}
        centerOnInit
        centerZoomedOut
        limitToBounds
        wheel={{ step: 0.12 }}
        pinch={{ step: 5 }}
        doubleClick={{ mode: "toggle", step: 2 }}
        panning={{ disabled: scale <= 1.01, velocityDisabled: true }}
        onTransform={(ref) => setScale(ref.state.scale)}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <TransformComponent
              wrapperClass="!absolute !inset-0 !h-full !w-full"
              contentClass="!flex !h-full !w-full !items-center !justify-center"
              wrapperStyle={{ touchAction: "none" }}
            >
              <img
                src={g.full}
                alt={g.alt}
                decoding="async"
                className="lightbox-photo-enter max-h-[76svh] max-w-[92vw] select-none rounded-xl object-contain shadow-card"
                draggable={false}
              />
            </TransformComponent>

            <div className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-20 flex -translate-x-1/2 items-center overflow-hidden rounded-full border border-gold/40 glass-night text-night-foreground shadow-card">
              <button
                type="button"
                onClick={() => zoomOut()}
                disabled={scale <= 1.01}
                aria-label="Thu nhỏ ảnh"
                className="grid size-11 place-items-center transition hover:bg-gold/10 disabled:opacity-35"
              >
                <Minus className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => resetTransform()}
                aria-label="Đặt lại tỉ lệ ảnh"
                className="flex h-11 w-20 items-center justify-center gap-1 text-xs font-medium tabular-nums transition hover:bg-gold/10"
              >
                <RotateCcw className="size-3.5" />
                {Math.round(scale * 100)}%
              </button>
              <button
                type="button"
                onClick={() => zoomIn()}
                disabled={scale >= 4.95}
                aria-label="Phóng to ảnh"
                className="grid size-11 place-items-center transition hover:bg-gold/10 disabled:opacity-35"
              >
                <Plus className="size-5" />
              </button>
            </div>
          </>
        )}
      </TransformWrapper>

      <p className="pointer-events-none absolute bottom-[calc(env(safe-area-inset-bottom)+5rem)] left-1/2 w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-full glass-night px-4 py-2 text-center text-[0.65rem] leading-relaxed text-night-foreground/80 shadow-soft sm:text-xs">
        Chạm hai lần, cuộn hoặc chụm hai ngón để thu phóng
      </p>
      <p className="pointer-events-none absolute left-4 top-[max(1rem,env(safe-area-inset-top))] rounded-full glass-night px-4 py-2 font-serif text-sm tracking-[0.2em] text-gold-soft sm:left-6">
        {index + 1} / {total}
      </p>
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Đóng ảnh và quay lại gallery"
        className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-30 grid size-11 place-items-center rounded-full glass-night text-night-foreground shadow-soft transition hover:scale-105 sm:right-6"
      >
        <X className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Ảnh trước"
        className="absolute left-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full glass-night text-night-foreground shadow-soft transition hover:scale-105 sm:left-6 sm:size-12"
      >
        <ChevronLeft />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Ảnh sau"
        className="absolute right-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full glass-night text-night-foreground shadow-soft transition hover:scale-105 sm:right-6 sm:size-12"
      >
        <ChevronRight />
      </button>
    </div>
  );
}

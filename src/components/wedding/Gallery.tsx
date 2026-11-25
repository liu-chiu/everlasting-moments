import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, RotateCcw, X } from "lucide-react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { GALLERY } from "@/lib/wedding";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const [index, setIndex] = useState(0);
  const [virtualIndex, setVirtualIndex] = useState(20);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const openedFrom = useRef<number | null>(null);
  const restoreAfterClose = useRef(false);
  const scrollFrame = useRef<number | null>(null);
  const total = GALLERY.length;
  const VIRTUAL_TOTAL = total * 3;

  const go = useCallback(
    (d: number) => {
      const next = (virtualIndex + d + VIRTUAL_TOTAL) % VIRTUAL_TOTAL;
      setVirtualIndex(next);
      setIndex(next % total);
    },
    [virtualIndex, total, VIRTUAL_TOTAL],
  );

  // Start with the middle set centred.
  useEffect(() => {
    setVirtualIndex(20);
    setIndex(0);
  }, []);

  const openPhoto = (i: number) => {
    openedFrom.current = i;
    setOpen(i);
  };

  const closePhoto = useCallback(() => {
    restoreAfterClose.current = true;
    setOpen(null);
  }, []);

  useEffect(() => {
    if (open !== null || !restoreAfterClose.current) return;
    restoreAfterClose.current = false;
    const frame = requestAnimationFrame(() => {
      slideRefs.current[openedFrom.current ?? 0]?.focus({ preventScroll: true });
      openedFrom.current = null;
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  return (
    <section id="gallery" className="paper-grain relative overflow-hidden py-24 sm:py-32">
      <div className="px-4 sm:px-6">
        <SectionHeading eyebrow="Selected moments">
          Wedding <em>Gallery</em>
        </SectionHeading>
      </div>

      <Reveal className="mt-10 sm:mt-14">
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Album ảnh cưới"
          className="gallery-slider"
        >
          <div
            ref={trackRef}
            className="gallery-track"
            tabIndex={0}
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
            {Array.from({ length: VIRTUAL_TOTAL }).map((_, vi) => {
              const g = GALLERY[vi % total];
              const distance = vi - virtualIndex;
              const aspect = g.landscape ? "4 / 3" : "3 / 4";
              return (
                <button
                  key={`slide-${vi}`}
                  ref={(node) => {
                    slideRefs.current[vi] = node;
                  }}
                  type="button"
                  aria-roledescription="slide"
                  aria-label={`Xem ảnh ${(vi % total) + 1} trên ${total}`}
                  aria-current={vi === virtualIndex ? "true" : undefined}
                  onClick={() => openPhoto(vi % total)}
                  className="photo"
                  data-state={distance === 0 ? "active" : Math.abs(distance) === 1 ? "near" : "far"}
                  style={{
                    ["--slide-scale" as string]: distance === 0 ? 1 : 0.86,
                    ["--slide-rotate" as string]: `${Math.max(-9, Math.min(9, distance * -4))}deg`,
                    ["--slide-z" as string]: distance === 0 ? "0px" : "-90px",
                    ["--slide-opacity" as string]: Math.abs(distance) > 2 ? 0.35 : 1,
                    ["--slide-aspect" as string]: aspect,
                  }}
                >
                  <img
                    src={g.thumb}
                    alt={g.alt}
                    loading={Math.abs(distance) <= 1 ? "eager" : "lazy"}
                    decoding="async"
                    width={g.landscape ? 640 : 426}
                    height={g.landscape ? 426 : 640}
                    draggable={false}
                  />
                </button>
              );
            })}
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
              {index + 1} / {total}
            </span>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Ảnh tiếp theo trong album"
              className="gallery-arrow"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </Reveal>

      {open !== null && <Lightbox index={open} onClose={closePhoto} onIndex={setOpen} />}
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
      className="fixed inset-0 z-[70] overflow-hidden bg-night/95 backdrop-blur-sm"
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
                className="max-h-[76svh] max-w-[92vw] select-none rounded-xl object-contain shadow-card"
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

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
  const [showAll, setShowAll] = useState(false);
  const triggerRefs = useRef(new Map<number, HTMLButtonElement>());
  const scrollPosition = useRef(0);
  const openedFrom = useRef<number | null>(null);
  const restoreAfterClose = useRef(false);
  const items = showAll ? GALLERY : GALLERY.slice(0, 12);

  const openPhoto = (index: number) => {
    scrollPosition.current = window.scrollY;
    openedFrom.current = index;
    setOpen(index);
  };

  const closePhoto = useCallback(() => {
    restoreAfterClose.current = true;
    setOpen(null);
  }, []);

  useEffect(() => {
    if (open !== null || !restoreAfterClose.current) return;
    restoreAfterClose.current = false;
    // Run after the lightbox cleanup has released the page's scroll lock.
    const frame = requestAnimationFrame(() => {
      const originalIndex = openedFrom.current;
      window.scrollTo({ top: scrollPosition.current, left: 0, behavior: "instant" });
      if (originalIndex !== null) {
        triggerRefs.current.get(originalIndex)?.focus({ preventScroll: true });
      }
      openedFrom.current = null;
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  return (
    <section id="gallery" className="paper-grain relative px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeading eyebrow="Selected moments">
        Wedding <em>Gallery</em>
      </SectionHeading>

      <div className="mx-auto mt-14 max-w-6xl columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
        {items.map((g, i) => (
          <Reveal key={g.id} delay={(i % 4) * 90} className="mb-3 break-inside-avoid sm:mb-4">
            <button
              ref={(node) => {
                if (node) triggerRefs.current.set(i, node);
                else triggerRefs.current.delete(i);
              }}
              type="button"
              onClick={() => openPhoto(i)}
              className="group relative block w-full overflow-hidden rounded-2xl bg-muted shadow-soft"
              aria-label={`Xem ảnh ${g.id}`}
            >
              <img
                src={g.thumb}
                alt={g.alt}
                loading="lazy"
                decoding="async"
                width={g.landscape ? 640 : 426}
                height={g.landscape ? 426 : 640}
                className="h-auto w-full transition duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-night/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            </button>
          </Reveal>
        ))}
      </div>

      {!showAll && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="rounded-full bg-night px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-night-foreground shadow-gold transition hover:scale-[1.03]"
          >
            Xem thêm {GALLERY.length - 12} khoảnh khắc
          </button>
        </div>
      )}

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

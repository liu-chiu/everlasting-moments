import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { GALLERY } from "@/lib/wedding";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const items = showAll ? GALLERY : GALLERY.slice(0, 12);

  return (
    <section id="gallery" className="paper-grain relative px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeading eyebrow="Selected moments">
        Wedding <em>Gallery</em>
      </SectionHeading>

      <div className="mx-auto mt-14 max-w-6xl columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
        {items.map((g, i) => (
          <Reveal key={g.id} delay={(i % 4) * 90} className="mb-3 break-inside-avoid sm:mb-4">
            <button
              type="button"
              onClick={() => setOpen(i)}
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

      {open !== null && <Lightbox index={open} onClose={() => setOpen(null)} onIndex={setOpen} />}
    </section>
  );
}

function Lightbox({ index, onClose, onIndex }: { index: number; onClose: () => void; onIndex: (i: number) => void }) {
  const total = GALLERY.length;
  const go = useCallback((d: number) => onIndex((index + d + total) % total), [index, onIndex, total]);
  const startX = useRef<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("is-locked");
    // Warm up neighbours for instant swipes.
    [1, -1].forEach((d) => {
      const n = GALLERY[(index + d + total) % total];
      if (n) new Image().src = n.full;
    });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("is-locked");
    };
  }, [go, index, onClose, total]);

  const g = GALLERY[index];
  if (!g) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-night/95 backdrop-blur-sm"
      onClick={onClose}
      onPointerDown={(e) => (startX.current = e.clientX)}
      onPointerUp={(e) => {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current;
        startX.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
    >
      <img
        key={g.id}
        src={g.full}
        alt={g.alt}
        decoding="async"
        onClick={(e) => e.stopPropagation()}
        className="rise-in max-h-[86svh] max-w-[92vw] select-none rounded-xl object-contain shadow-card"
        draggable={false}
      />
      <button type="button" onClick={onClose} aria-label="Đóng" className="absolute right-4 top-4 grid size-11 place-items-center rounded-full glass-night text-night-foreground">
        <X className="size-5" />
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); go(-1); }}
        aria-label="Ảnh trước"
        className="absolute left-3 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full glass-night text-night-foreground sm:grid"
      >
        <ChevronLeft />
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); go(1); }}
        aria-label="Ảnh sau"
        className="absolute right-3 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full glass-night text-night-foreground sm:grid"
      >
        <ChevronRight />
      </button>
      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-serif text-lg tracking-[0.3em] text-gold-soft">
        {index + 1} / {total}
      </p>
    </div>
  );
}

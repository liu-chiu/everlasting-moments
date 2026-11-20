import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Minus, Plus, RotateCcw, RotateCw } from "lucide-react";
import {
  COUPLE,
  eventsForSide,
  WEDDING_DATE_LABEL,
  WEDDING_WEEKDAY,
  type Side,
} from "@/lib/wedding";
import { track } from "@/lib/analytics";
import { Logo } from "./Logo";
import { FloralCorner, OrnamentalFrame } from "./Ornaments";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const MIN_ZOOM = 0.65;
const MAX_ZOOM = 1.65;
const REST = { x: -6, y: -10 };
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function InviteCard({ guest, side }: { guest: string; side?: Side | undefined }) {
  const [rot, setRot] = useState(REST);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef({ moved: 0, pinch: 0, zoom: 1 });
  const events = eventsForSide(side);
  const name = guest || "bạn";

  // Which face is towards the viewer decides what screen readers hear.
  const front = Math.cos((rot.x * Math.PI) / 180) * Math.cos((rot.y * Math.PI) / 180) >= 0;

  const flip = () => {
    setRot((r) => ({ ...r, y: r.y + 180 }));
    track("card_view", { action: "flip" });
  };
  const reset = () => {
    setRot(REST);
    setZoom(1);
  };

  const onDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    gesture.current.moved = 0;
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current.pinch = Math.hypot(a!.x - b!.x, a!.y - b!.y);
      gesture.current.zoom = zoom;
    }
    setDragging(true);
  };
  const onMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const cur = { x: e.clientX, y: e.clientY };
    pointers.current.set(e.pointerId, cur);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a!.x - b!.x, a!.y - b!.y);
      if (gesture.current.pinch)
        setZoom(clamp((gesture.current.zoom * d) / gesture.current.pinch, MIN_ZOOM, MAX_ZOOM));
      gesture.current.moved += 10;
      return;
    }
    const dx = cur.x - prev.x;
    const dy = cur.y - prev.y;
    gesture.current.moved += Math.abs(dx) + Math.abs(dy);
    setRot((r) => ({ x: clamp(r.x - dy * 0.35, -40, 40), y: r.y + dx * 0.5 }));
  };
  const onUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) {
      setDragging(false);
      if (gesture.current.moved < 6) flip();
    }
  };
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    // Trackpad pinch arrives as ctrl+wheel; plain wheel keeps scrolling the page.
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      setZoom((z) => clamp(z - e.deltaY * 0.01, MIN_ZOOM, MAX_ZOOM));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const holo = {
    "--holo-x": `${50 + ((rot.y % 360) / 360) * 100}%`,
    "--holo-angle": `${rot.x}deg`,
  } as CSSProperties;

  return (
    <section
      id="invite"
      className="paper-grain relative overflow-hidden px-5 py-20 sm:px-6 sm:py-28 lg:py-32"
    >
      <SectionHeading
        eyebrow="Thiệp mời"
        sub="Kéo thiệp để xoay · chạm để lật · chụm hai ngón (hoặc Ctrl + cuộn) để thu phóng."
      >
        Thiệp mời <em>gửi riêng bạn</em>
      </SectionHeading>

      <Reveal zoom className="mt-12 flex flex-col items-center sm:mt-14">
        <div className="relative grid h-[min(132vw,600px)] w-full max-w-xl place-items-center [perspective:1600px] sm:h-[620px]">
          <div className="pointer-events-none absolute inset-x-10 bottom-6 h-10 rounded-[100%] bg-night/25 blur-2xl" />
          <div
            role="img"
            aria-label={front ? "Mặt trước thiệp cưới" : "Mặt sau thiệp cưới"}
            className="card-3d relative aspect-[3/4.3] w-[min(78vw,380px)] cursor-grab touch-pan-y select-none active:cursor-grabbing"
            style={{
              transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg) scale(${zoom})`,
              transition: dragging ? "none" : undefined,
            }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            ref={cardRef}
          >
            {/* Front */}
            <div className="card-face absolute inset-0 overflow-hidden rounded-2xl bg-card shadow-card ring-1 ring-gold/40">
              <img
                src="/images/gallery/13-sm.webp"
                alt=""
                draggable={false}
                loading="lazy"
                decoding="async"
                className="h-[55%] w-full object-cover object-[50%_30%]"
              />
              <div className="absolute inset-x-0 top-[41%] h-[14%] bg-gradient-to-b from-transparent to-card" />
              <OrnamentalFrame
                corners="bottom"
                className="inset-3"
                cornerClassName="size-14 opacity-40 sm:size-20"
              />
              <FloralCorner className="absolute left-2 top-2 z-[3] size-20 text-gold-soft/75 sm:size-24" />
              <Logo className="absolute right-4 top-4 z-10 size-11 sm:size-12" />
              <div className="relative z-10 px-5 pt-2 text-center">
                <p className="eyebrow text-[0.58rem]">Wedding invitation</p>
                <p className="mt-2 pb-1 pt-5 font-signature text-[2rem] leading-[1.6] text-foreground sm:text-[2.5rem]">
                  {COUPLE.bride.short} <span className="font-script text-[0.62em] text-wax">&</span>{" "}
                  {COUPLE.groom.short}
                </p>
                <p className="mt-2 font-serif text-sm tracking-[0.22em] text-gold-deep sm:text-base">
                  {WEDDING_WEEKDAY} · {WEDDING_DATE_LABEL}
                </p>
                <p className="mt-1.5 truncate text-xs text-muted-foreground">
                  Thân mời: <span className="font-script text-xl text-wax">{name}</span>
                </p>
              </div>
              <div className="card-holo absolute inset-0" style={holo} />
            </div>
            {/* Back */}
            <div className="card-face card-back card-back-surface absolute inset-0 flex flex-col items-center justify-between overflow-hidden rounded-2xl px-4 py-4 text-center text-foreground shadow-card ring-1 ring-gold/50 sm:px-7 sm:py-8">
              <OrnamentalFrame
                tone="light"
                className="inset-3"
                cornerClassName="size-14 opacity-60 sm:size-24"
              />
              <Logo className="relative z-10 size-10 sm:size-16" />
              <div className="relative z-10 space-y-2 sm:space-y-5">
                {events.map((e) => (
                  <div key={e.side}>
                    <p className="font-serif text-xl text-gold-deep sm:text-3xl">{e.time}</p>
                    <p className="text-[0.52rem] uppercase tracking-[0.22em] text-wax sm:text-[0.6rem] sm:tracking-[0.3em]">
                      {e.label}
                    </p>
                    <p className="mt-0.5 font-serif text-base text-ocean-deep sm:mt-1 sm:text-xl">
                      {e.venue} {e.venueLine2}
                    </p>
                    <p className="mx-auto mt-0.5 max-w-[16rem] text-[0.58rem] leading-snug text-muted-foreground sm:mt-1 sm:text-[0.68rem] sm:leading-relaxed">
                      {e.address}
                    </p>
                  </div>
                ))}
              </div>
              <p className="relative z-10 font-serif text-xs italic text-wax sm:text-sm">
                Rất mong được đón {name} trong ngày vui của chúng mình.
              </p>
              <div className="card-holo absolute inset-0 opacity-40" style={holo} />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
          <div className="flex items-center overflow-hidden rounded-full border border-gold/50 bg-card shadow-soft">
            <button
              type="button"
              onClick={() => setZoom((z) => clamp(z - 0.1, MIN_ZOOM, MAX_ZOOM))}
              disabled={zoom <= MIN_ZOOM}
              aria-label="Thu nhỏ thiệp"
              className="grid size-10 place-items-center text-gold-deep transition hover:bg-gold/10 disabled:opacity-40"
            >
              <Minus className="size-4" />
            </button>
            <output
              className="w-14 text-center font-medium tabular-nums text-foreground"
              aria-live="polite"
            >
              {Math.round(zoom * 100)}%
            </output>
            <button
              type="button"
              onClick={() => setZoom((z) => clamp(z + 0.1, MIN_ZOOM, MAX_ZOOM))}
              disabled={zoom >= MAX_ZOOM}
              aria-label="Phóng to thiệp"
              className="grid size-10 place-items-center text-gold-deep transition hover:bg-gold/10 disabled:opacity-40"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={flip}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-night px-5 uppercase tracking-[0.2em] text-night-foreground shadow-gold transition hover:scale-[1.03]"
          >
            <RotateCw className="size-3.5" /> Lật thiệp
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 uppercase tracking-[0.2em] text-muted-foreground transition hover:bg-muted"
          >
            <RotateCcw className="size-3.5" /> Đặt lại
          </button>
        </div>
      </Reveal>
    </section>
  );
}

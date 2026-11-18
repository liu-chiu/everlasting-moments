import { useRef, useState } from "react";
import { RotateCw } from "lucide-react";
import { COUPLE, eventsForSide, WEDDING_DATE_LABEL, WEDDING_WEEKDAY, type Side } from "@/lib/wedding";
import { Monogram } from "./Monogram";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function InviteCard({ guest, side }: { guest: string; side?: Side }) {
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const box = useRef<HTMLDivElement>(null);
  const events = eventsForSide(side);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !box.current) return;
    const r = box.current.getBoundingClientRect();
    setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -14, y: ((e.clientX - r.left) / r.width - 0.5) * 18 });
  };

  return (
    <section id="invite" className="paper-grain relative overflow-hidden px-6 py-24 sm:py-32">
      <SectionHeading eyebrow="Thiệp mời" sub="Chạm vào thiệp để lật xem mặt sau.">
        Thiệp mời <em>gửi riêng bạn</em>
      </SectionHeading>

      <Reveal zoom className="mt-14 flex flex-col items-center">
        <div
          ref={box}
          className="relative [perspective:1600px]"
          onPointerMove={onMove}
          onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        >
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            aria-label={flipped ? "Xem mặt trước thiệp" : "Xem mặt sau thiệp"}
            className="card-3d relative block aspect-[3/4.3] w-[min(84vw,380px)] text-left"
            style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y + (flipped ? 180 : 0)}deg)` }}
          >
            {/* Front */}
            <div className="card-face absolute inset-0 overflow-hidden rounded-2xl bg-card shadow-card ring-1 ring-gold/30">
              <img src="/images/gallery/13-sm.webp" alt="" loading="lazy" decoding="async" className="h-[62%] w-full object-cover object-top" />
              <div className="absolute inset-x-0 top-[48%] h-[14%] bg-gradient-to-b from-transparent to-card" />
              <div className="relative px-6 pt-3 text-center">
                <p className="eyebrow text-[0.6rem]">Wedding invitation</p>
                <p className="mt-2 font-signature text-5xl leading-none text-foreground">
                  {COUPLE.bride.short} <span className="font-script text-3xl text-wax">&</span> {COUPLE.groom.short}
                </p>
                <p className="mt-6 font-serif text-base tracking-[0.25em] text-gold-deep">
                  {WEDDING_WEEKDAY} · {WEDDING_DATE_LABEL}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Thân mời: <span className="font-script text-xl text-wax">{guest || "bạn"}</span>
                </p>
              </div>
            </div>
            {/* Back */}
            <div className="card-face card-back absolute inset-0 flex flex-col items-center justify-between overflow-hidden rounded-2xl bg-night px-7 py-8 text-center text-night-foreground shadow-card ring-1 ring-gold/40">
              <div className="absolute inset-3 rounded-xl border border-gold/30" />
              <Monogram className="relative text-5xl text-gold" />
              <div className="relative space-y-5">
                {events.map((e) => (
                  <div key={e.side}>
                    <p className="font-serif text-3xl text-gold-soft">{e.time}</p>
                    <p className="text-[0.65rem] uppercase tracking-[0.3em] text-gold">{e.label}</p>
                    <p className="mt-1 font-serif text-xl">
                      {e.venue} {e.venueLine2}
                    </p>
                    <p className="mx-auto mt-1 max-w-[16rem] text-[0.7rem] leading-relaxed text-night-foreground/70">{e.address}</p>
                  </div>
                ))}
              </div>
              <p className="relative font-serif text-sm italic text-night-foreground/80">
                Rất mong được đón {guest || "bạn"} trong ngày vui của chúng mình.
              </p>
            </div>
          </button>
        </div>
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-gold/50 px-5 py-2.5 text-xs uppercase tracking-[0.25em] text-gold-deep transition hover:bg-gold/10"
        >
          <RotateCw className="size-3.5" /> Lật thiệp
        </button>
      </Reveal>
    </section>
  );
}

import { useState } from "react";
import { CalendarPlus, Copy, MapPin, Navigation } from "lucide-react";
import { toast } from "sonner";
import { eventsForSide, googleCalendarUrl, WEDDING_DATE_LABEL, WEDDING_WEEKDAY, type Side, type WeddingEvent } from "@/lib/wedding";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Events({ side }: { side?: Side | undefined }) {
  const events = eventsForSide(side);
  return (
    <section id="events" className="paper-grain relative px-6 py-24 sm:py-32">
      <SectionHeading eyebrow="Wedding events">
        Trân trọng <em>kính mời</em>
      </SectionHeading>
      <div className={`mx-auto mt-14 grid max-w-5xl gap-8 ${events.length > 1 ? "md:grid-cols-2" : "max-w-xl"}`}>
        {events.map((e, i) => (
          <Reveal key={e.side} delay={i * 150}>
            <EventCard e={e} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function EventCard({ e }: { e: WeddingEvent }) {
  const [map, setMap] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${e.placeTitle}, ${e.address}`);
      toast.success("Đã sao chép địa chỉ");
    } catch {
      toast.error("Không thể sao chép");
    }
  };
  return (
    <article className="group relative overflow-hidden rounded-[2rem] bg-card shadow-card ring-1 ring-border transition duration-500 hover:-translate-y-1">
      <div className="relative overflow-hidden bg-night px-5 pb-7 pt-6 text-night-foreground sm:px-7 sm:pb-8 sm:pt-7">
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-sunset opacity-30 blur-2xl transition group-hover:opacity-50" />
        <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <span className="min-w-0 font-serif text-5xl text-gold/50">{e.index}</span>
          <span className="shrink-0 rounded-full border border-gold/40 px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-gold sm:text-[0.65rem] sm:tracking-[0.3em]">{e.label}</span>
        </div>
        <h3 className="relative mt-4 font-serif text-3xl font-medium leading-tight sm:text-4xl">
          {e.venue} <span className="font-script text-gold-soft">{e.venueLine2}</span>
        </h3>
        <div className="relative mt-6 flex items-end gap-3 sm:gap-5">
          <span className="text-gold-shimmer font-serif text-5xl font-medium leading-none sm:text-6xl">{e.time}</span>
          <span className="pb-1 text-xs uppercase leading-relaxed tracking-[0.2em] text-night-foreground/75">
            {WEDDING_WEEKDAY}
            <br />
            {WEDDING_DATE_LABEL}
          </span>
        </div>
      </div>
      <div className="px-7 py-6">
        <p className="flex items-start gap-2 font-medium text-foreground">
          <MapPin className="mt-0.5 size-4 shrink-0 text-wax" /> {e.placeTitle}
        </p>
        <p className="mt-1 pl-6 text-sm leading-relaxed text-muted-foreground">{e.address}</p>

        {map ? (
          <iframe
            title={`Bản đồ ${e.label}`}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(e.mapQuery)}&output=embed`}
            loading="lazy"
            className="mt-5 h-56 w-full rounded-2xl border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setMap(true)}
            className="mt-5 grid h-24 w-full place-items-center rounded-2xl border border-dashed border-gold/50 bg-muted/60 text-xs uppercase tracking-[0.25em] text-gold-deep transition hover:bg-gold/10"
          >
            Hiện bản đồ
          </button>
        )}

        <div className="mt-5 grid grid-cols-3 gap-2 text-[0.7rem] font-medium">
          <a href={e.mapDirections} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1.5 rounded-xl bg-primary px-2 py-3 text-primary-foreground transition hover:opacity-90">
            <Navigation className="size-4" /> Chỉ đường
          </a>
          <a href={googleCalendarUrl(e)} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1.5 rounded-xl bg-secondary px-2 py-3 text-secondary-foreground transition hover:bg-gold/20">
            <CalendarPlus className="size-4" /> Lưu lịch
          </a>
          <button type="button" onClick={copy} className="flex flex-col items-center gap-1.5 rounded-xl bg-secondary px-2 py-3 text-secondary-foreground transition hover:bg-gold/20">
            <Copy className="size-4" /> Sao chép
          </button>
        </div>
      </div>
    </article>
  );
}

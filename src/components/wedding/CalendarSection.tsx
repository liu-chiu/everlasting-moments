import { CalendarPlus } from "lucide-react";
import { eventsForSide, googleCalendarUrl, monthGrid, type Side } from "@/lib/wedding";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/utils";

const WEEK = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export function CalendarSection({ side }: { side?: Side | undefined }) {
  const cells = monthGrid(2026, 11);
  const events = eventsForSide(side);
  return (
    <section id="calendar" className="relative bg-background px-6 py-24 sm:py-32">
      <SectionHeading eyebrow="Save the date">
        December <em>2026</em>
      </SectionHeading>
      <Reveal zoom className="mx-auto mt-14 max-w-md rounded-[2rem] bg-card p-6 shadow-card ring-1 ring-border sm:p-9">
        <div className="grid grid-cols-7 gap-y-2 text-center">
          {WEEK.map((w, i) => (
            <span key={w} className={cn("pb-3 text-[0.68rem] font-semibold tracking-widest", i === 5 ? "text-wax" : "text-muted-foreground")}>
              {w}
            </span>
          ))}
          {cells.map((d, i) =>
            d === 12 ? (
              <span key={i} className="relative grid aspect-square place-items-center">
                <span className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-gold" />
                <span className="absolute -inset-1 overflow-hidden rounded-full ring-2 ring-gold shadow-glow">
                  <img src="/images/couple.webp" alt="" loading="lazy" className="h-full w-full object-cover object-top" />
                  <span className="absolute inset-0 bg-wax/45" />
                </span>
                <span className="relative font-serif text-xl font-semibold text-primary-foreground">12</span>
                <span className="absolute -bottom-1 -right-1 animate-heartbeat text-base text-wax">♥</span>
              </span>
            ) : (
              <span key={i} className={cn("grid aspect-square place-items-center font-serif text-lg", d ? "text-foreground/80" : "")}>
                {d ?? ""}
              </span>
            ),
          )}
        </div>
      </Reveal>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {events.map((e) => (
          <a
            key={e.side}
            href={googleCalendarUrl(e)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-card px-5 py-3 text-xs uppercase tracking-[0.2em] text-foreground shadow-soft transition hover:-translate-y-0.5 hover:border-gold"
          >
            <CalendarPlus className="size-4 text-gold-deep" /> Lưu {e.label.toLowerCase()}
          </a>
        ))}
      </div>
    </section>
  );
}

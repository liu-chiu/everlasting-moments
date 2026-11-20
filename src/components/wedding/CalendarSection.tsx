import { Apple, CalendarPlus, Download } from "lucide-react";
import { toast } from "sonner";
import { buildIcs, COUPLE_SHORT_LABEL, eventsForSide, googleCalendarUrl, monthGrid, outlookCalendarUrl, type Side, type WeddingEvent } from "@/lib/wedding";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/utils";

const WEEK = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export function CalendarSection({ side }: { side?: Side | undefined }) {
  const cells = monthGrid(2026, 11);
  const events = eventsForSide(side);
  return (
    <section id="calendar" className="relative bg-background px-5 py-20 sm:px-6 sm:py-28 lg:py-32">
      <SectionHeading eyebrow="Save the date" sub={`Chọn lịch bạn đang dùng để không bỏ lỡ ngày vui của ${COUPLE_SHORT_LABEL}.`}>
        December <em>2026</em>
      </SectionHeading>
      <div className="mx-auto mt-14 grid max-w-5xl items-center gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-16">
        <Reveal zoom className="mx-auto w-full max-w-md rounded-[2rem] bg-card p-5 shadow-card ring-1 ring-border sm:p-9">
          <div className="grid grid-cols-7 gap-y-2 text-center">
            {WEEK.map((day, index) => (
              <span key={day} className={cn("pb-3 text-[0.68rem] font-semibold tracking-widest", index === 5 ? "text-wax" : "text-muted-foreground")}>{day}</span>
            ))}
            {cells.map((day, index) =>
              day === 12 ? (
                <span key={index} className="relative grid aspect-square place-items-center">
                  <span className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-gold" />
                  <span className="absolute -inset-1 overflow-hidden rounded-full shadow-glow ring-2 ring-gold">
                    <img src="/images/couple.webp" alt="" loading="lazy" className="h-full w-full object-cover object-top" />
                    <span className="absolute inset-0 bg-wax/45" />
                  </span>
                  <span className="relative font-serif text-xl font-semibold text-primary-foreground">12</span>
                  <span className="absolute -bottom-1 -right-1 animate-heartbeat text-base text-wax">♥</span>
                </span>
              ) : (
                <span key={index} className={cn("grid aspect-square place-items-center font-serif text-lg", day ? "text-foreground/80" : "")}>{day ?? ""}</span>
              ),
            )}
          </div>
        </Reveal>

        <Reveal delay={150} className="min-w-0 space-y-4">
          {events.map((event) => <CalendarDownloads key={event.side} event={event} />)}
        </Reveal>
      </div>
    </section>
  );
}

function CalendarDownloads({ event }: { event: WeddingEvent }) {
  const saveIcs = () => {
    const blob = new Blob([buildIcs(event)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lan-chung-${event.side === "bride" ? "tiec-nha-gai" : "tiec-nha-trai"}.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("Đã tải lịch — mở tệp để thêm vào Apple Calendar hoặc Outlook");
  };

  return (
    <div className="rounded-3xl bg-card p-5 shadow-soft ring-1 ring-border sm:p-6">
      <p className="eyebrow">{event.label}</p>
      <p className="mt-2 font-serif text-2xl text-foreground">{event.time} · 12.12.2026</p>
      <div className="mt-5 grid grid-cols-3 gap-2">
        <a
          href={googleCalendarUrl(event)}
          target="_blank"
          rel="noreferrer"
          aria-label={`Lưu ${event.label} vào Google Calendar`}
          className="flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-2xl bg-primary px-2 py-3 text-center text-[0.68rem] font-medium text-primary-foreground transition hover:-translate-y-0.5 sm:text-xs"
        >
          <CalendarPlus className="size-4 shrink-0" /> Google
        </a>
        <button
          type="button"
          onClick={saveIcs}
          aria-label={`Tải ${event.label} cho Apple Calendar`}
          className="flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-2xl bg-secondary px-2 py-3 text-center text-[0.68rem] font-medium text-secondary-foreground transition hover:-translate-y-0.5 hover:bg-gold/20 sm:text-xs"
        >
          <Apple className="size-4 shrink-0" /> Apple
        </button>
        <a
          href={outlookCalendarUrl(event)}
          target="_blank"
          rel="noreferrer"
          aria-label={`Lưu ${event.label} vào Outlook`}
          className="flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-2xl bg-secondary px-2 py-3 text-center text-[0.68rem] font-medium text-secondary-foreground transition hover:-translate-y-0.5 hover:bg-gold/20 sm:text-xs"
        >
          <Download className="size-4 shrink-0" /> Outlook
        </a>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Apple tải tệp .ics; Outlook mở trang thêm sự kiện.</p>
    </div>
  );
}

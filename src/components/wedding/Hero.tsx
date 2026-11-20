import { ChevronDown } from "lucide-react";
import { COUPLE, COUPLE_SHORT_LABEL, WEDDING_WEEKDAY } from "@/lib/wedding";
import { Petals } from "./Petals";
import { StarField } from "./StarField";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

export function Hero({ guest, started }: { guest: string; started: boolean }) {
  const d = (ms: number) => ({ ["--delay" as string]: `${ms}ms` });
  const anim = started ? "rise-in" : "opacity-0";
  return (
    <section id="hero" className="relative isolate flex min-h-svh items-end overflow-hidden bg-night-sky text-night-foreground lg:items-center">
      <StarField className="hidden lg:block" density={0.7} />
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:relative lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10">
        {/* Photo: full-bleed on phones, a glowing arch on desktop */}
        <div className="absolute inset-x-0 top-0 -z-10 h-[74svh] lg:relative lg:inset-auto lg:z-0 lg:order-2 lg:flex lg:h-auto lg:justify-center">
          <div className="relative h-full w-full overflow-hidden lg:h-[82vh] lg:max-h-[820px] lg:w-auto lg:aspect-[2/3] lg:rounded-t-full lg:shadow-glow lg:ring-1 lg:ring-gold/40">
            <img
              src="/images/hero.webp"
              alt={`${COUPLE_SHORT_LABEL} trong trang phục cưới`}
              width={1066}
              height={1600}
              fetchPriority="high"
              decoding="async"
              className="h-full w-full animate-kenburns object-cover object-[50%_30%]"
            />
            <div className="hero-veil absolute inset-0 lg:opacity-40" />
            <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-night via-night/70 to-transparent lg:hidden" />
          </div>
          {/* Rotating seal */}
          <div className="absolute -left-6 bottom-24 hidden size-36 lg:block xl:-left-10">
            <svg viewBox="0 0 200 200" className="h-full w-full animate-spin-slow text-gold">
              <defs>
                <path id="ring" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
              </defs>
              <text fill="currentColor" fontSize="13" letterSpacing="3.2" className="font-sans uppercase">
                <textPath href="#ring">Save the date · 12.12.2026 · {COUPLE_SHORT_LABEL} ·</textPath>
              </text>
            </svg>
            <Logo className="absolute inset-[18%] rounded-full shadow-gold" ring={false} eager />
          </div>
        </div>

        <Petals className="z-10" />

        <div className="relative z-20 px-6 pb-24 pt-[46svh] text-center lg:order-1 lg:px-0 lg:py-0 lg:text-left">
          <p className={cn("eyebrow text-gold-soft lg:text-gold", anim)} style={d(150)}>
            Save our date
          </p>
          <h1 className="mt-6 font-signature lg:mt-10 leading-[0.95] text-glow">
            <span className={cn("block text-[4.6rem] sm:text-[7rem] xl:text-[9rem]", anim)} style={d(300)}>
              {COUPLE.bride.short}
            </span>
            <span className={cn("block font-script text-5xl text-gold sm:text-6xl lg:pl-24", anim)} style={d(550)}>
              &
            </span>
            <span className={cn("block text-[4.6rem] sm:text-[7rem] lg:pl-10 xl:text-[9rem]", anim)} style={d(800)}>
              {COUPLE.groom.short}
            </span>
          </h1>
          <div className={cn("mt-12 flex items-center lg:mt-16 justify-center gap-3 font-serif sm:gap-5 lg:justify-start", anim)} style={d(1050)}>
            <span className="text-xs uppercase tracking-[0.18em] text-night-foreground/80 sm:text-sm sm:tracking-[0.3em]">{WEDDING_WEEKDAY}</span>
            <span className="h-10 w-px shrink-0 bg-gold/60" />
            <span className="text-gold-shimmer text-4xl font-medium sm:text-6xl">12.12</span>
            <span className="h-10 w-px shrink-0 bg-gold/60" />
            <span className="text-xs uppercase tracking-[0.18em] text-night-foreground/80 sm:text-sm sm:tracking-[0.3em]">2026</span>
          </div>
          <p className={cn("mx-auto mt-8 max-w-md text-[0.95rem] leading-relaxed text-night-foreground/80 lg:mx-0", anim)} style={d(1250)}>
            <strong className="font-medium text-night-foreground">{COUPLE.bride.full}</strong> và{" "}
            <strong className="font-medium text-night-foreground">{COUPLE.groom.full}</strong> trân trọng kính mời{" "}
            {guest || "bạn"} đến chung vui và lưu giữ những khoảnh khắc đáng nhớ cùng chúng mình.
          </p>
        </div>
      </div>

      <a
        href="#invite"
        aria-label="Cuộn xuống"
        className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-gold-soft"
      >
        <ChevronDown className="size-7 animate-bounce-soft" />
      </a>
    </section>
  );
}

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { COUPLE, COUPLE_SHORT_LABEL, WEDDING_DATE_LABEL } from "@/lib/wedding";
import { track } from "@/lib/analytics";
import { StarField } from "./StarField";
import { Logo } from "./Logo";
import { FloralFlourish, OrnamentalFrame } from "./Ornaments";
import { useMusic } from "./music";
import { celebrate } from "./celebrate";
import { prefersReducedMotion } from "./canvas-utils";
import { cn } from "@/lib/utils";

type Phase = "closed" | "opening" | "leaving" | "done";

const ARRIVAL_DELAY = 900;
const ARRIVAL_MS = 2600;
const AUTO_OPEN_SECONDS = 6;

// Comet trail sparks that ride behind the flying envelope.
const SPARKS = [
  [-170, 90, 0.05, 9],
  [-120, -60, 0.15, 6],
  [-210, 30, 0.25, 7],
  [-90, 110, 0.32, 5],
  [-150, -100, 0.4, 8],
  [-60, -30, 0.5, 6],
  [-190, 70, 0.6, 5],
  [-110, 20, 0.7, 7],
] as const;

const v = (o: Record<string, string | number>) => o as CSSProperties;

export function Intro({ guest, onDone }: { guest: string; onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [landed, setLanded] = useState(false);
  const [seconds, setSeconds] = useState(AUTO_OPEN_SECONDS);
  const tiltRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLButtonElement>(null);
  const { play } = useMusic();
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    document.documentElement.classList.add("is-locked");
    const t = window.setTimeout(
      () => setLanded(true),
      prefersReducedMotion() ? 0 : ARRIVAL_DELAY + ARRIVAL_MS,
    );
    return () => {
      window.clearTimeout(t);
      document.documentElement.classList.remove("is-locked");
    };
  }, []);

  const open = (auto = false) => {
    if (phaseRef.current !== "closed") return;
    play();
    track("envelope_open", { method: auto ? "auto" : "tap" });
    setPhase("opening");
    window.setTimeout(() => {
      const r = sealRef.current?.getBoundingClientRect();
      celebrate(r ? { x: r.left + r.width / 2, y: r.top } : undefined);
      setPhase("leaving");
      document.documentElement.classList.remove("is-locked");
      onDone();
    }, 1900);
    window.setTimeout(() => setPhase("done"), 3100);
  };

  // Auto-open countdown once the envelope has landed (like the original invitation).
  useEffect(() => {
    if (!landed || phase !== "closed") return;
    if (seconds <= 0) {
      open(true);
      return;
    }
    const t = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [landed, seconds, phase]);

  const onTilt = (e: React.PointerEvent) => {
    const el = tiltRef.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 22}deg`);
    el.style.setProperty("--rx", `${((e.clientY - r.top) / r.height - 0.5) * -18}deg`);
  };
  const resetTilt = () => {
    tiltRef.current?.style.setProperty("--rx", "0deg");
    tiltRef.current?.style.setProperty("--ry", "0deg");
  };

  if (phase === "done") return null;
  const name = guest || "bạn";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Thiệp mời ${COUPLE_SHORT_LABEL}`}
      className={cn(
        "fixed inset-0 z-[80] overflow-y-auto overflow-x-hidden bg-night-sky text-night-foreground",
        phase === "leaving" && "intro-leave pointer-events-none",
      )}
      onPointerMove={onTilt}
      onPointerLeave={resetTilt}
    >
      <StarField className="fixed" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-gold/15 to-transparent" />

      <div className="intro-layout relative z-10 mx-auto flex min-h-full w-full max-w-5xl flex-col items-center justify-center gap-8 px-5 py-10 text-center short:flex-row short:gap-10 short:py-6 sm:gap-10">
        <div className="flex flex-col items-center">
          <p
            className="eyebrow gold-rule rise-in whitespace-nowrap text-[0.6rem] tracking-[0.3em] text-gold sm:text-[0.7rem] sm:tracking-[0.38em]"
            style={v({ "--delay": "100ms" })}
          >
            The Wedding Invitation
          </p>
          <h1 className="mt-4 font-signature text-[clamp(2.9rem,12vw,4.6rem)] leading-[1.25] short:text-[2.6rem]">
            <span className="rise-in block" style={v({ "--delay": "300ms" })}>
              {COUPLE.bride.display}
            </span>
            <span
              className="rise-in block font-script text-[0.6em] text-rose"
              style={v({ "--delay": "550ms" })}
            >
              &
            </span>
            <span className="rise-in block" style={v({ "--delay": "800ms" })}>
              {COUPLE.groom.display}
            </span>
          </h1>
          <p
            className="intro-date rise-in mt-6 font-serif text-lg tracking-[0.45em] text-gold-soft sm:text-xl short:mt-3"
            style={v({ "--delay": "1000ms" })}
          >
            {WEDDING_DATE_LABEL.replaceAll(".", " · ")}
          </p>
        </div>

        <div className="flex flex-col items-center">
          {/* Envelope: arrival flight > pointer tilt > gentle float */}
          <div
            className="envelope-arrive relative [perspective:1400px]"
            style={v({ "--delay": `${ARRIVAL_DELAY}ms` })}
          >
            {!landed &&
              SPARKS.map(([sx, sy, d, sz], i) => (
                <span
                  key={i}
                  className="comet-spark"
                  style={v({
                    "--sx": `${sx}px`,
                    "--sy": `${sy}px`,
                    "--d": `${ARRIVAL_DELAY / 1000 + d}s`,
                    "--sz": `${sz}px`,
                  })}
                />
              ))}
            <span
              className="landing-ring"
              style={v({ "--d": `${(ARRIVAL_DELAY + ARRIVAL_MS - 250) / 1000}s` })}
            />

            <div ref={tiltRef} className="envelope-tilt">
              <div className={cn(landed && phase === "closed" && "animate-float")}>
                <div className="envelope-halo pointer-events-none absolute -inset-12 rounded-full" />
                <span
                  className="orbit-spark"
                  style={v({ "--r": "min(48vw, 210px)", "--t": "11s" })}
                />
                <span
                  className="orbit-spark"
                  style={v({ "--r": "min(40vw, 175px)", "--t": "8s", "--d": "-3s" })}
                />
                <span
                  className="orbit-spark opacity-70"
                  style={v({ "--r": "min(52vw, 230px)", "--t": "14s", "--d": "-7s" })}
                />

                <div
                  className="envelope relative aspect-[1.55] w-[min(84vw,360px,calc(40svh*1.55))] short:w-[min(44vw,calc(62svh*1.55))] lg:w-[min(30vw,440px,calc(40svh*1.55))]"
                  data-open={phase !== "closed"}
                >
                  <div className="absolute inset-0 rounded-xl bg-paper-deep shadow-card ring-1 ring-gold/50" />
                  <div className="envelope-letter absolute inset-x-4 bottom-3 top-3 z-10 flex flex-col items-center justify-center overflow-hidden rounded-lg bg-card px-4 text-foreground">
                    <OrnamentalFrame
                      className="inset-1.5"
                      cornerClassName="size-10 opacity-40 sm:size-12"
                    />
                    <Logo className="relative z-10 size-12 sm:size-14" eager />
                    <p className="relative z-10 mt-2 text-[0.58rem] uppercase tracking-[0.3em] text-muted-foreground">
                      Trân trọng kính mời
                    </p>
                    <p className="relative z-10 mt-0.5 max-w-full truncate font-script text-2xl text-wax">
                      {name}
                    </p>
                    <FloralFlourish className="relative z-10 mt-1.5 w-24 text-gold-deep/45" />
                  </div>
                  <div className="envelope-pocket absolute inset-0 z-20 rounded-xl bg-paper shadow-[inset_0_-12px_30px_-20px_var(--gold-deep)]">
                    <OrnamentalFrame
                      corners="bottom"
                      className="inset-[6px]"
                      cornerClassName="size-16 opacity-40 sm:size-20"
                    />
                    <div className="absolute inset-x-0 bottom-2.5 z-10 px-6 text-center">
                      <p className="text-[0.55rem] uppercase tracking-[0.35em] text-muted-foreground">
                        Kính gửi
                      </p>
                      <p className="truncate font-script text-xl leading-tight text-wax sm:text-2xl">
                        {guest || "Quý khách"}
                      </p>
                    </div>
                  </div>
                  <div className="envelope-flap absolute inset-x-0 top-0 h-full rounded-t-xl bg-gradient-to-b from-paper-deep to-paper">
                    <FloralFlourish className="absolute left-1/2 top-4 w-32 -translate-x-1/2 text-gold-deep/45 sm:w-40" />
                  </div>
                  <div className="envelope-sheen pointer-events-none absolute inset-0 z-[35] overflow-hidden rounded-xl" />
                  <button
                    ref={sealRef}
                    type="button"
                    onClick={() => open()}
                    aria-label="Mở thiệp"
                    className="wax-seal absolute left-1/2 top-[52%] z-40 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full p-1.5 sm:size-16"
                  >
                    {landed && phase === "closed" && (
                      <span className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-gold" />
                    )}
                    <Logo className="h-full w-full" ring={false} eager />
                    <span className="absolute inset-1 rounded-full ring-1 ring-gold/70" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => open()}
            className={cn(
              "intro-open-button rise-in glass-night mt-10 rounded-full px-9 py-3.5 text-xs font-medium uppercase tracking-[0.35em] text-night-foreground shadow-glow transition hover:bg-gold/20 short:mt-6",
              phase !== "closed" && "opacity-0",
            )}
            style={v({ "--delay": "1500ms" })}
          >
            Mở thiệp
          </button>
          <p
            className="rise-in mt-4 text-[0.7rem] tracking-wider text-night-foreground/65"
            style={v({ "--delay": "1700ms" })}
            aria-live="polite"
          >
            {landed && phase === "closed" ? (
              <>
                Thiệp sẽ tự mở sau <strong className="text-gold">{seconds}</strong>s
              </>
            ) : (
              "Chạm vào con dấu sáp để mở thiệp"
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

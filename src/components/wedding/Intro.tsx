import { useEffect, useState } from "react";
import { COUPLE, WEDDING_DATE_LABEL } from "@/lib/wedding";
import { StarField } from "./StarField";
import { Monogram } from "./Monogram";
import { useMusic } from "./music";
import { celebrate } from "./celebrate";
import { cn } from "@/lib/utils";

type Phase = "closed" | "opening" | "leaving" | "done";

export function Intro({ guest, onDone }: { guest: string; onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>("closed");
  const { play } = useMusic();

  useEffect(() => {
    document.documentElement.classList.add("is-locked");
    return () => document.documentElement.classList.remove("is-locked");
  }, []);

  const open = () => {
    if (phase !== "closed") return;
    play();
    setPhase("opening");
    window.setTimeout(() => {
      celebrate();
      setPhase("leaving");
      document.documentElement.classList.remove("is-locked");
      onDone();
    }, 1900);
    window.setTimeout(() => setPhase("done"), 3100);
  };

  if (phase === "done") return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Thiệp mời Lan & Chung"
      className={cn(
        "fixed inset-0 z-[80] flex flex-col items-center justify-center overflow-hidden bg-night-sky px-6 text-night-foreground",
        phase === "leaving" && "intro-leave pointer-events-none",
      )}
    >
      <StarField />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-gold/15 to-transparent" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <p className="eyebrow gold-rule rise-in whitespace-nowrap text-[0.6rem] tracking-[0.3em] text-gold sm:text-[0.7rem] sm:tracking-[0.38em]" style={{ ["--delay" as string]: "100ms" }}>
          The Wedding Invitation
        </p>
        <h1 className="mt-4 font-signature text-[3.4rem] leading-[1.05] sm:text-7xl">
          <span className="rise-in block" style={{ ["--delay" as string]: "300ms" }}>{COUPLE.bride.display}</span>
          <span className="rise-in block font-script text-4xl text-rose sm:text-5xl" style={{ ["--delay" as string]: "550ms" }}>&</span>
          <span className="rise-in block" style={{ ["--delay" as string]: "800ms" }}>{COUPLE.groom.display}</span>
        </h1>
        <p className="rise-in mt-7 font-serif text-xl tracking-[0.5em] text-gold-soft" style={{ ["--delay" as string]: "1000ms" }}>
          {WEDDING_DATE_LABEL.replaceAll(".", " · ")}
        </p>

        {/* Envelope */}
        <div
          className="envelope rise-in relative mt-10 aspect-[1.55] w-[min(84vw,360px)]"
          data-open={phase !== "closed"}
          style={{ ["--delay" as string]: "1200ms" }}
        >
          <div className="absolute inset-0 rounded-xl bg-paper-deep shadow-card" />
          <div className="envelope-letter absolute inset-x-4 bottom-3 top-3 z-10 flex flex-col items-center justify-center rounded-lg bg-card px-4 text-foreground shadow-soft">
            <Monogram className="text-4xl text-wax" />
            <p className="mt-1 text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">Trân trọng kính mời</p>
            <p className="mt-1 font-script text-2xl text-foreground">{guest || "bạn"}</p>
          </div>
          <div className="envelope-pocket absolute inset-0 z-20 rounded-xl bg-paper shadow-[inset_0_-12px_30px_-20px_var(--gold-deep)]">
            <div className="absolute inset-x-0 bottom-2.5 text-center">
              <p className="text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground">Kính gửi</p>
              <p className="font-script text-2xl leading-tight text-wax">{guest || "Quý khách"}</p>
            </div>
          </div>
          <div className="envelope-flap absolute inset-x-0 top-0 h-full rounded-t-xl bg-gradient-to-b from-paper-deep to-paper" />
          <button
            type="button"
            onClick={open}
            aria-label="Mở thiệp"
            className="wax-seal absolute left-1/2 top-[52%] z-40 grid size-14 sm:size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-gold-soft"
          >
            <Monogram className="text-2xl" />
          </button>
        </div>

        <button
          type="button"
          onClick={open}
          className={cn(
            "rise-in glass-night mt-10 rounded-full px-9 py-3.5 text-xs font-medium uppercase tracking-[0.35em] text-night-foreground shadow-glow transition hover:bg-gold/20",
            phase !== "closed" && "opacity-0",
          )}
          style={{ ["--delay" as string]: "1500ms" }}
        >
          Mở thiệp
        </button>
        <p className="rise-in mt-4 text-[0.7rem] tracking-wider text-night-foreground/60" style={{ ["--delay" as string]: "1700ms" }}>
          Chạm vào con dấu sáp để mở · bật âm thanh để trọn vẹn hơn
        </p>
      </div>
    </div>
  );
}

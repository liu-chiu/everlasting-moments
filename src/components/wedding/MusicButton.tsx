import { useEffect, useState } from "react";
import { Music2, Pause, SkipForward } from "lucide-react";
import { PLAYLIST } from "@/lib/wedding";
import { useMusic } from "./music";
import { cn } from "@/lib/utils";

export function MusicButton() {
  const { playing, track, toggle, next } = useMusic();
  const [overForm, setOverForm] = useState(false);
  const [overHero, setOverHero] = useState(true);
  const [overFinale, setOverFinale] = useState(false);

  // Keep the floating control clear of form fields and the footer action.
  useEffect(() => {
    const el = document.getElementById("rsvp");
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOverForm(!!entry?.isIntersecting), {
      rootMargin: "80px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const finale = document.getElementById("finale");
    if (!hero || !finale) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target.id === "hero") setOverHero(entry.isIntersecting);
          if (entry.target.id === "finale") setOverFinale(entry.isIntersecting);
        }
      },
      { threshold: 0.05 },
    );
    io.observe(hero);
    io.observe(finale);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "fixed right-4 z-50 flex items-center gap-2 transition-all duration-300 sm:right-6",
        overHero
          ? "top-20 sm:top-24 lg:bottom-6 lg:top-auto"
          : "bottom-5 sm:bottom-6",
        (overForm || overFinale) && "invisible opacity-0",
      )}
    >
      <div
        className={cn(
          "hidden overflow-hidden bg-night/90 backdrop-blur-md ring-1 ring-gold/20 rounded-full py-2 pl-4 pr-2 text-xs text-night-foreground transition-all duration-500 sm:flex sm:items-center sm:gap-2",
          playing ? "max-w-64 opacity-100" : "max-w-0 px-0 opacity-0",
        )}
      >
        <span className="truncate whitespace-nowrap">♫ {PLAYLIST[track]?.title}</span>
        <button
          type="button"
          onClick={next}
          aria-label="Bài tiếp theo"
          className="grid size-7 shrink-0 place-items-center rounded-full transition-colors hover:bg-gold/20"
        >
          <SkipForward className="size-3.5" />
        </button>
      </div>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Tắt nhạc nền" : "Phát nhạc nền"}
        className="relative grid size-14 place-items-center rounded-full bg-night text-gold shadow-gold transition-transform hover:scale-105 active:scale-95"
      >
        {playing && (
          <span className="absolute inset-0 animate-pulse-ring rounded-full border border-gold" />
        )}
        <span
          className={cn(
            "absolute inset-1.5 rounded-full border border-gold/30 bg-[repeating-radial-gradient(circle,transparent_0,transparent_3px,var(--night-soft)_4px)]",
            playing && "animate-vinyl",
          )}
        />
        <span className="relative">
          {playing ? <Pause className="size-5" /> : <Music2 className="size-5" />}
        </span>
      </button>
    </div>
  );
}

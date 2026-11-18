import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { PLAYLIST } from "@/lib/wedding";

type MusicCtx = { playing: boolean; track: number; play: () => void; toggle: () => void; next: () => void };
const Ctx = createContext<MusicCtx | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState(0);

  const ensure = useCallback(() => {
    if (!audio.current) {
      const a = new Audio();
      a.preload = "none";
      a.volume = 0.7;
      a.src = (PLAYLIST[0]?.src ?? "");
      a.addEventListener("play", () => setPlaying(true));
      a.addEventListener("pause", () => setPlaying(false));
      a.addEventListener("ended", () => {
        setTrack((t) => {
          const n = (t + 1) % PLAYLIST.length;
          a.src = (PLAYLIST[n]?.src ?? "");
          a.play().catch(() => {});
          return n;
        });
      });
      audio.current = a;
    }
    return audio.current;
  }, []);

  const play = useCallback(() => {
    ensure().play().catch(() => {});
  }, [ensure]);

  const toggle = useCallback(() => {
    const a = ensure();
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  }, [ensure]);

  const next = useCallback(() => {
    const a = ensure();
    setTrack((t) => {
      const n = (t + 1) % PLAYLIST.length;
      a.src = (PLAYLIST[n]?.src ?? "");
      a.play().catch(() => {});
      return n;
    });
  }, [ensure]);

  useEffect(() => () => audio.current?.pause(), []);

  return <Ctx.Provider value={{ playing, track, play, toggle, next }}>{children}</Ctx.Provider>;
}

export function useMusic() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useMusic must be inside MusicProvider");
  return c;
}

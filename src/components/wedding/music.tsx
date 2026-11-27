import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { PLAYLIST } from "@/lib/wedding";
import { shuffledTracks } from "@/lib/music-playback";

type MusicCtx = {
  playing: boolean;
  track: number;
  play: () => void;
  toggle: () => void;
  next: () => void;
};
const Ctx = createContext<MusicCtx | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const currentTrack = useRef(0);
  const queue = useRef<number[]>([]);
  const awaitingGesture = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState(0);

  const play = useCallback(() => {
    const a = audio.current;
    if (!a) return;
    const requestedSource = a.src;
    awaitingGesture.current = false;
    a.play().catch((error: unknown) => {
      // Ignore promises interrupted by switching songs; retry only browser policy blocks.
      if (
        audio.current === a &&
        a.src === requestedSource &&
        error instanceof DOMException &&
        error.name === "NotAllowedError"
      ) {
        awaitingGesture.current = true;
      }
    });
  }, []);

  const toggle = useCallback(() => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) play();
    else {
      awaitingGesture.current = false;
      a.pause();
    }
  }, [play]);

  const next = useCallback(() => {
    const a = audio.current;
    if (!a) return;
    if (queue.current.length === 0)
      queue.current = shuffledTracks(PLAYLIST.length, currentTrack.current);
    const n = queue.current.shift() ?? currentTrack.current;
    const song = PLAYLIST[n];
    if (!song) return;
    currentTrack.current = n;
    setTrack(n);
    a.src = song.src;
    play();
  }, [play]);

  useEffect(() => {
    const a = new Audio(PLAYLIST[0]?.src ?? "");
    a.preload = "auto";
    a.volume = 0.7;
    audio.current = a;
    currentTrack.current = 0;
    queue.current = [];
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const retry = () => {
      if (awaitingGesture.current) play();
    };
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", next);
    document.addEventListener("pointerdown", retry);
    document.addEventListener("keydown", retry);
    play();
    return () => {
      document.removeEventListener("pointerdown", retry);
      document.removeEventListener("keydown", retry);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", next);
      audio.current = null;
      awaitingGesture.current = false;
      a.pause();
      a.removeAttribute("src");
      a.load();
    };
  }, [next, play]);

  return <Ctx.Provider value={{ playing, track, play, toggle, next }}>{children}</Ctx.Provider>;
}

export function useMusic() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useMusic must be inside MusicProvider");
  return c;
}

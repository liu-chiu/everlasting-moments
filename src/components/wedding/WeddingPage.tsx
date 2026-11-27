import { useEffect, useState } from "react";
import type { Side } from "@/lib/wedding";
import { fetchWishes, type Wish } from "@/lib/wedding-api";
import { MusicProvider } from "./music";
import { MusicButton } from "./MusicButton";
import { Intro } from "./Intro";
import { Hero } from "./Hero";
import { InviteCard } from "./InviteCard";
import { Story } from "./Story";
import { QuoteBand } from "./QuoteBand";
import { Gallery } from "./Gallery";
import { Countdown } from "./Countdown";
import { CalendarSection } from "./CalendarSection";
import { Events } from "./Events";
import { Families } from "./Families";
import { Rsvp } from "./Rsvp";
import { Guestbook } from "./Guestbook";
import { Gifts } from "./Gifts";
import { Finale } from "./Finale";
import { TopBar } from "./TopBar";

export function WeddingPage({ guest, side }: { guest: string; side?: Side | undefined }) {
  const [started, setStarted] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loadingWishes, setLoadingWishes] = useState(true);

  useEffect(() => {
    // Load guestbook after the page is idle so it never competes with first paint.
    const run = () =>
      fetchWishes()
        .then(setWishes)
        .catch(() => {})
        .finally(() => setLoadingWishes(false));
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(run);
    else setTimeout(run, 1200);
  }, []);

  return (
    <MusicProvider>
      <Intro guest={guest} onDone={() => setStarted(true)} />
      <TopBar />
      <main>
        <Hero guest={guest} started={started} />
        <InviteCard guest={guest} side={side} />
        <Story />
        <QuoteBand />
        <Gallery />
        <Countdown />
        <CalendarSection side={side} />
        <Events side={side} />
        <Families />
        <Rsvp guest={guest} side={side} onWish={(w) => setWishes((list) => [w, ...list])} />
        <Guestbook wishes={wishes} loading={loadingWishes} />
        <Gifts guest={guest} side={side} />
      </main>
      <Finale />
      <MusicButton />
    </MusicProvider>
  );
}

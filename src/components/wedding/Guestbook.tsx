import { useState } from "react";
import { MessagesSquare, Quote } from "lucide-react";
import type { Wish } from "@/lib/wedding-api";
import { SectionHeading } from "./SectionHeading";
import { WeddingDialog } from "./WeddingDialog";

const SAMPLE: Wish[] = [
  { name: "Người bạn thân", wish: "Chúc hai bạn luôn giữ được sự dịu dàng, sẻ chia và cùng nhau đi qua thật nhiều mùa hạnh phúc." },
];

export function Guestbook({ wishes, loading }: { wishes: Wish[]; loading: boolean }) {
  const [showAll, setShowAll] = useState(false);
  const list = wishes.length ? wishes : SAMPLE;
  const rows = list.length > 6 ? [list.filter((_, i) => i % 2 === 0), list.filter((_, i) => i % 2 === 1)] : [list];

  return (
    <section id="wishes" className="relative overflow-hidden bg-background px-5 py-20 sm:px-6 sm:py-28 lg:py-32">
      <SectionHeading eyebrow="Guestbook" sub={`${wishes.length ? wishes.length + " lời yêu thương" : "Những lời yêu thương"} gửi đến Lan & Chung.`}>
        Lời chúc <em>từ khách mời</em>
      </SectionHeading>

      {loading ? (
        <div className="mx-auto mt-14 flex max-w-5xl gap-4 overflow-hidden">
          {[0, 1, 2].map((i) => <div key={i} className="h-44 w-80 shrink-0 animate-pulse rounded-3xl bg-muted" />)}
        </div>
      ) : (
        <div className="mask-fade-x mt-14 space-y-5">
          {rows.map((row, rowIndex) => {
            const loop = row.length >= 3;
            const items = loop ? [...row, ...row] : row;
            return (
              <div key={rowIndex} className="group overflow-hidden">
                <div
                  className={loop ? "flex w-max animate-marquee gap-5 group-hover:[animation-play-state:paused] motion-reduce:animate-none" : "flex justify-center gap-5 px-1"}
                  style={loop ? { animationDuration: `${Math.max(40, row.length * 9)}s`, animationDirection: rowIndex ? "reverse" : "normal" } : undefined}
                >
                  {items.map((wish, index) => (
                    <WishCard key={`${wish.id ?? wish.name}-${index}`} wish={wish} hidden={loop && index >= row.length} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <button
          type="button"
          onClick={() => setShowAll(true)}
          disabled={loading}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-night px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-night-foreground shadow-soft transition hover:-translate-y-0.5 disabled:opacity-50"
        >
          <MessagesSquare className="size-4" /> Xem tất cả lời chúc
        </button>
        <a href="#rsvp" className="inline-flex min-h-11 items-center font-serif text-lg italic text-gold-deep underline decoration-gold/40 underline-offset-8 hover:decoration-gold">
          Gửi lời chúc của bạn →
        </a>
      </div>

      <WeddingDialog
        open={showAll}
        onOpenChange={setShowAll}
        title={`Tất cả lời chúc (${list.length})`}
        closeLabel="Đóng danh sách lời chúc"
        className="sm:w-[min(92vw,52rem)]"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((wish, index) => <WishCard key={`${wish.id ?? wish.name}-all-${index}`} wish={wish} full />)}
        </div>
      </WeddingDialog>
    </section>
  );
}

function WishCard({ wish, hidden = false, full = false }: { wish: Wish; hidden?: boolean; full?: boolean }) {
  return (
    <figure
      aria-hidden={hidden}
      className={full
        ? "relative rounded-3xl bg-muted/60 p-5 ring-1 ring-border"
        : "relative w-[18rem] shrink-0 rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border sm:w-[22rem]"}
    >
      <Quote className="absolute right-5 top-5 size-7 text-gold/30" />
      <blockquote className={full ? "pr-5 font-serif text-lg leading-relaxed text-foreground" : "line-clamp-5 font-serif text-lg leading-snug text-foreground"}>
        {wish.wish}
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-3 border-t border-border pt-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sunset font-serif text-base text-primary-foreground">
          {wish.name.trim().split(" ").pop()?.charAt(0).toUpperCase() || "L"}
        </span>
        <span className="min-w-0 break-words text-sm font-medium text-wax">{wish.name}</span>
      </figcaption>
    </figure>
  );
}

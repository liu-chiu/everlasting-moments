import { useState } from "react";
import { Heart, MessagesSquare, Quote, Sparkles } from "lucide-react";
import { COUPLE_SHORT_LABEL } from "@/lib/wedding";
import type { Wish } from "@/lib/wedding-api";
import { SectionHeading } from "./SectionHeading";
import { WeddingDialog } from "./WeddingDialog";

const COUPLE_WISH: Wish = {
  id: "couple-thank-you",
  name: "Vợ chồng Lan & Chung",
  wish: "Cảm ơn gia đình, người thân và bạn bè đã hiện diện để chung vui cùng chúng tôi trong ngày trọng đại này. Kính chúc mọi người nhiều sức khỏe, hạnh phúc và bình an!",
};

const SAMPLE: Wish[] = [
  COUPLE_WISH,
  {
    id: "sample-1",
    name: "Chị Phương",
    wish: "Thật vui được đồng hành, chúc 2 em luôn gắn kết, hòa thuận, mỉm cười cùng nhip đập và luôn ngập tràn yêu thương. Trăm năm hạnh phúc!",
  },
  {
    id: "sample-2",
    name: "Bạn Phương",
    wish: "Chúc hai bạn luôn giữ được sự dịu dàng, sẻ chia và cùng nhau đi qua thật nhiều mùa hạnh phúc.",
  },
];

export function Guestbook({ wishes, loading }: { wishes: Wish[]; loading: boolean }) {
  const [showAll, setShowAll] = useState(false);
  const list = wishes.length ? wishes : SAMPLE;
  
  // Ensure COUPLE_WISH is included if backend doesn't return it
  const hasCoupleWish = list.some((w) => w.name.includes("Lan & Chung") || w.name.includes("Vợ chồng"));
  const allWishes = hasCoupleWish ? list : [COUPLE_WISH, ...list];

  const rows =
    allWishes.length > 6
      ? [allWishes.filter((_, i) => i % 2 === 0), allWishes.filter((_, i) => i % 2 === 1)]
      : [allWishes];

  return (
    <section
      id="wishes"
      className="relative overflow-hidden bg-background px-5 py-20 sm:px-6 sm:py-28 lg:py-32"
    >
      <SectionHeading
        eyebrow="Guestbook"
        sub={`${allWishes.length ? allWishes.length + " lời yêu thương" : "Những lời yêu thương"} gửi đến ${COUPLE_SHORT_LABEL}.`}
      >
        Lời chúc <em>từ khách mời</em>
      </SectionHeading>

      {/* Featured Highlight Card for Vợ chồng Lan & Chung */}
      <div className="mx-auto mt-10 max-w-2xl sm:mt-12">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-night via-dusk to-night p-6 text-night-foreground shadow-card ring-2 ring-gold/40 backdrop-blur-md sm:p-8">
          <div className="absolute -right-8 -top-8 size-32 rounded-full bg-gold/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 size-32 rounded-full bg-wax/10 blur-2xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/15 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                <Sparkles className="size-3 text-gold fill-gold/20" /> Tri ân từ Dâu & Rể
              </span>
              <Heart className="size-5 text-gold/60 fill-gold/20" />
            </div>

            <blockquote className="mt-5 font-serif text-lg leading-relaxed italic text-gold-soft sm:text-xl">
              “{COUPLE_WISH.wish}”
            </blockquote>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-gold/20 pt-4">
              <div className="text-right">
                <p className="font-signature text-2xl text-gold sm:text-3xl">
                  {COUPLE_WISH.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mx-auto mt-12 flex max-w-5xl gap-4 overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-44 w-80 shrink-0 animate-pulse rounded-3xl bg-muted" />
          ))}
        </div>
      ) : (
        <div className="mask-fade-x mt-12 space-y-5">
          {rows.map((row, rowIndex) => {
            const loop = row.length >= 3;
            const items = loop ? [...row, ...row] : row;
            return (
              <div key={rowIndex} className="group overflow-hidden">
                <div
                  className={
                    loop
                      ? "flex w-max animate-marquee gap-5 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
                      : "flex justify-center gap-5 px-1"
                  }
                  style={
                    loop
                      ? {
                          animationDuration: `${Math.max(40, row.length * 9)}s`,
                          animationDirection: rowIndex ? "reverse" : "normal",
                        }
                      : undefined
                  }
                >
                  {items.map((wish, index) => (
                    <WishCard
                      key={`${wish.id ?? wish.name}-${index}`}
                      wish={wish}
                      hidden={loop && index >= row.length}
                    />
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
        <a
          href="#rsvp"
          className="inline-flex min-h-11 items-center font-serif text-lg italic text-gold-deep underline decoration-gold/40 underline-offset-8 hover:decoration-gold"
        >
          Gửi lời chúc của bạn →
        </a>
      </div>

      <WeddingDialog
        open={showAll}
        onOpenChange={setShowAll}
        title={`Tất cả lời chúc (${allWishes.length})`}
        closeLabel="Đóng danh sách lời chúc"
        className="sm:w-[min(92vw,52rem)]"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {allWishes.map((wish, index) => (
            <WishCard key={`${wish.id ?? wish.name}-all-${index}`} wish={wish} full />
          ))}
        </div>
      </WeddingDialog>
    </section>
  );
}

function WishCard({
  wish,
  hidden = false,
  full = false,
}: {
  wish: Wish;
  hidden?: boolean;
  full?: boolean;
}) {
  const isCouple = wish.name.includes("Lan & Chung") || wish.name.includes("Vợ chồng");

  if (isCouple) {
    return (
      <figure
        aria-hidden={hidden}
        className={
          full
            ? "relative rounded-3xl bg-gradient-to-br from-night via-dusk to-night p-5 text-night-foreground ring-2 ring-gold/40 shadow-soft"
            : "relative w-[18rem] shrink-0 rounded-3xl bg-gradient-to-br from-night via-dusk to-night p-6 text-night-foreground shadow-card ring-2 ring-gold/40 sm:w-[22rem]"
        }
      >
        <Sparkles className="absolute right-5 top-5 size-6 text-gold/60" />
        <span className="mb-2 inline-block rounded-full bg-gold/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold border border-gold/30">
          Dâu & Rể
        </span>
        <blockquote
          className={
            full
              ? "pr-5 font-serif text-lg leading-relaxed text-gold-soft italic"
              : "line-clamp-5 font-serif text-lg leading-snug text-gold-soft italic"
          }
        >
          “{wish.wish}”
        </blockquote>
        <figcaption className="mt-4 flex items-center justify-between border-t border-gold/20 pt-4">
          <span className="font-signature text-xl text-gold">{wish.name}</span>
          <Heart className="size-4 text-gold/60 fill-gold/20" />
        </figcaption>
      </figure>
    );
  }

  return (
    <figure
      aria-hidden={hidden}
      className={
        full
          ? "relative rounded-3xl bg-muted/60 p-5 ring-1 ring-border"
          : "relative w-[18rem] shrink-0 rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border sm:w-[22rem]"
      }
    >
      <Quote className="absolute right-5 top-5 size-7 text-gold/30" />
      <blockquote
        className={
          full
            ? "pr-5 font-serif text-lg leading-relaxed text-foreground"
            : "line-clamp-5 font-serif text-lg leading-snug text-foreground"
        }
      >
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

import { Quote } from "lucide-react";
import type { Wish } from "@/lib/wedding-api";
import { SectionHeading } from "./SectionHeading";

const SAMPLE: Wish[] = [
  { name: "Người bạn thân", wish: "Chúc hai bạn luôn giữ được sự dịu dàng, sẻ chia và cùng nhau đi qua thật nhiều mùa hạnh phúc." },
];

export function Guestbook({ wishes, loading }: { wishes: Wish[]; loading: boolean }) {
  const list = wishes.length ? wishes : SAMPLE;
  const rows = list.length > 6 ? [list.filter((_, i) => i % 2 === 0), list.filter((_, i) => i % 2 === 1)] : [list];

  return (
    <section id="wishes" className="relative overflow-hidden bg-background py-24 sm:py-32">
      <div className="px-6">
        <SectionHeading eyebrow="Guestbook" sub={`${wishes.length ? wishes.length + " lời yêu thương" : "Những lời yêu thương"} gửi đến Lan & Chung.`}>
          Lời chúc <em>từ khách mời</em>
        </SectionHeading>
      </div>

      {loading ? (
        <div className="mx-auto mt-14 flex max-w-5xl gap-4 overflow-hidden px-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-44 w-80 shrink-0 animate-pulse rounded-3xl bg-muted" />
          ))}
        </div>
      ) : (
        <div className="mask-fade-x mt-14 space-y-5">
          {rows.map((row, r) => {
            const loop = row.length >= 3;
            const items = loop ? [...row, ...row] : row;
            return (
              <div key={r} className="group overflow-hidden">
                <div
                  className={loop ? "flex w-max animate-marquee gap-5 group-hover:[animation-play-state:paused]" : "flex justify-center gap-5 px-6"}
                  style={loop ? { animationDuration: `${Math.max(40, row.length * 9)}s`, animationDirection: r ? "reverse" : "normal" } : undefined}
                >
                  {items.map((w, i) => (
                    <figure
                      key={`${w.id ?? w.name}-${i}`}
                      aria-hidden={loop && i >= row.length}
                      className="relative w-[18rem] shrink-0 rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border sm:w-[22rem]"
                    >
                      <Quote className="absolute right-5 top-5 size-7 text-gold/30" />
                      <blockquote className="line-clamp-5 font-serif text-lg leading-snug text-foreground">{w.wish}</blockquote>
                      <figcaption className="mt-4 flex items-center gap-3">
                        <span className="grid size-9 place-items-center rounded-full bg-sunset font-serif text-base text-primary-foreground">
                          {w.name.trim().split(" ").pop()?.charAt(0).toUpperCase()}
                        </span>
                        <span className="text-sm font-medium text-wax">{w.name}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <p className="mt-10 text-center">
        <a href="#rsvp" className="font-serif text-lg italic text-gold-deep underline decoration-gold/40 underline-offset-8 hover:decoration-gold">
          Gửi lời chúc của bạn →
        </a>
      </p>
    </section>
  );
}

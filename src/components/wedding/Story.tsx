import { useEffect, useRef } from "react";
import { STORY } from "@/lib/wedding";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/utils";

export function Story() {
  const section = useRef<HTMLElement>(null);
  const line = useRef<HTMLDivElement>(null);

  // Draws the gold timeline as the reader scrolls through the chapters.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = section.current;
      if (!el || !line.current) return;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / r.height));
      line.current.style.transform = `scaleY(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="story" ref={section} className="relative overflow-hidden bg-background px-6 py-24 sm:py-32">
      <SectionHeading eyebrow="Chapter one" sub="“Giữa hàng triệu cuộc gặp gỡ, chúng mình đã chọn ở lại bên nhau.”">
        Câu chuyện <em>của chúng mình</em>
      </SectionHeading>

      <div className="relative mx-auto mt-20 max-w-5xl">
        <div className="absolute bottom-0 left-5 top-0 w-px bg-border md:left-1/2" />
        <div ref={line} className="absolute bottom-0 left-5 top-0 w-px origin-top bg-gradient-to-b from-gold via-rose to-wax md:left-1/2" style={{ transform: "scaleY(0)" }} />

        <div className="space-y-20 md:space-y-28">
          {STORY.map((s, i) => (
            <div key={s.no} className="relative grid gap-8 pl-14 md:grid-cols-2 md:gap-16 md:pl-0">
              <span className="absolute left-5 top-2 z-10 grid size-4 -translate-x-1/2 place-items-center rounded-full bg-gold shadow-glow md:left-1/2">
                <span className="size-1.5 rounded-full bg-card" />
              </span>
              <Reveal zoom className={cn("md:pr-6", i % 2 && "md:order-2 md:pl-6 md:pr-0")}>
                <div className={cn("relative mx-auto max-w-sm", i % 2 ? "md:mr-auto md:ml-0" : "md:ml-auto md:mr-0")}>
                  <div className="absolute -inset-3 rotate-[-3deg] rounded-[2rem] bg-sunset opacity-30" />
                  <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    decoding="async"
                    width={426}
                    height={640}
                    className="relative aspect-[4/5] w-full rounded-[1.75rem] object-cover shadow-card"
                  />
                </div>
              </Reveal>
              <Reveal delay={150} className={cn("self-center", i % 2 ? "md:order-1 md:text-right" : "")}>
                <p className="font-serif text-7xl font-medium leading-none text-gold/40">{s.no}</p>
                <p className="eyebrow mt-2">{s.year}</p>
                <h3 className="mt-3 font-serif text-4xl font-medium text-foreground">{s.title}</h3>
                <p className="mt-4 font-serif text-xl italic text-wax">{s.lead}</p>
                <p className="mt-3 leading-relaxed text-muted-foreground">{s.body}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef } from "react";
import { COUPLE_SHORT_LABEL } from "@/lib/wedding";
import { Reveal } from "./Reveal";

/** Full-bleed sunset photo band with a gentle parallax. */
export function QuoteBand() {
  const img = useRef<HTMLImageElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = img.current;
      if (!el) return;
      const r = el.parentElement!.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      el.style.transform = `translate3d(0, ${p * -12}%, 0) scale(1.25)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative isolate grid h-[80svh] min-h-[480px] place-items-center overflow-hidden px-6 text-center text-night-foreground">
      <img
        ref={img}
        src="/images/gallery/5.webp"
        alt={`${COUPLE_SHORT_LABEL} bên hoàng hôn vịnh Hạ Long`}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-10 h-full w-full object-cover will-change-transform"
        style={{ transform: "scale(1.25)" }}
      />
      <div className="hero-veil absolute inset-0 -z-10" />
      <Reveal className="max-w-3xl">
        {/* Ẩn phần eyebrow “Hạ Long · hoàng hôn” — giữ lại khi cần */}
        {/* <p className="eyebrow text-gold-soft">Hạ Long · hoàng hôn</p> */}
        <blockquote className="mt-6 font-serif text-3xl italic leading-snug sm:text-5xl">
          “Từ tình bạn, chúng mình trở thành người thương — và từ hôm nay, là{" "}
          <span className="font-script not-italic text-gold-soft">gia đình</span>.”
        </blockquote>
      </Reveal>
    </section>
  );
}

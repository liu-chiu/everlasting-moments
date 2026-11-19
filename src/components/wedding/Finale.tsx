import { COUPLE, WEDDING_DATE_LABEL } from "@/lib/wedding";
import { Reveal } from "./Reveal";
import { StarField } from "./StarField";

export function Finale() {
  return (
    <footer className="relative isolate grid min-h-[90svh] place-items-center overflow-hidden px-6 py-24 text-center text-night-foreground">
      <img
        src="/images/gallery/19.webp"
        alt="Lan và Chung ngắm hoàng hôn trên vịnh"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[50%_55%]"
      />
      <div className="hero-veil absolute inset-0 -z-10 bg-night/40" />
      <StarField className="-z-10 h-1/2" density={0.5} />
      <Reveal className="max-w-2xl">
        <p className="eyebrow text-gold-soft">Thank you</p>
        <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-6xl">
          Cảm ơn bạn <span className="font-script text-gold-soft">đã là một phần</span> trong ngày đặc biệt.
        </h2>
        <p className="text-glow mt-10 font-signature text-6xl sm:text-7xl">
          {COUPLE.bride.short} <span className="font-script text-4xl text-gold">&</span> {COUPLE.groom.short}
        </p>
        <p className="mt-4 font-serif text-lg tracking-[0.5em] text-gold-soft">{WEDDING_DATE_LABEL}</p>
      </Reveal>
    </footer>
  );
}

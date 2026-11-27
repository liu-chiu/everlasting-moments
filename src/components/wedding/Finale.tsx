import { COUPLE, COUPLE_SHORT_LABEL, WEDDING_DATE_LABEL } from "@/lib/wedding";
import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { StarField } from "./StarField";
import { LinkGeneratorDialog } from "./LinkGeneratorDialog";

export function Finale() {
  const [linkOpen, setLinkOpen] = useState(false);
  return (
    <footer id="finale" className="text-night-foreground scroll-mt-0">
      <div className="relative isolate flex min-h-[90svh] flex-col items-center justify-between overflow-hidden px-6 pb-16 pt-12 text-center sm:pb-20 sm:pt-16">
        <img
          src="/images/gallery/19.webp"
          alt={`${COUPLE_SHORT_LABEL} ngắm hoàng hôn trên vịnh`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[50%_55%]"
        />
        <div className="hero-veil absolute inset-0 -z-10 bg-night/40" />
        <StarField className="-z-10 h-1/2" density={0.5} />

        <Reveal className="pt-2">
          <p className="eyebrow gold-rule justify-center text-gold-soft">Thank you</p>
        </Reveal>

        <Reveal className="mt-14 max-w-4xl sm:mt-24 md:mt-auto">
          <h2 className="font-serif text-3xl leading-snug sm:text-5xl lg:text-6xl">
            Cảm ơn bạn
            <br />
            <span className="font-script text-gold-soft">đã là một phần</span>
            <br />
            trong ngày đặc biệt.
          </h2>
        </Reveal>

        <Reveal className="mt-auto md:mt-10">
          <p className="font-signature text-[clamp(2.75rem,12vw,4rem)] leading-[1.3] text-glow sm:text-6xl lg:text-7xl">
            <span className="block sm:inline">{COUPLE.bride.display}</span>{" "}
            <span className="block font-script text-[0.65em] leading-[1.1] text-gold sm:inline">
              &
            </span>{" "}
            <span className="block sm:inline">{COUPLE.groom.display}</span>
          </p>
          <p className="mt-3 font-serif text-base tracking-[0.5em] text-gold-soft sm:text-lg">
            {WEDDING_DATE_LABEL}
          </p>
        </Reveal>
      </div>
      <div className="border-t border-night-foreground/15 bg-foreground px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-xs font-medium uppercase sm:flex-row">
          <p>{COUPLE_SHORT_LABEL}</p>
          <p>Hạ Long · Hà Nội</p>
          <Button
            variant="ghost"
            onClick={() => setLinkOpen(true)}
            aria-haspopup="dialog"
            className="h-auto rounded-full border border-night-foreground/30 bg-night-foreground/10 px-5 py-2.5 text-night-foreground hover:bg-night-foreground/20 hover:text-night-foreground"
          >
            <Mail aria-hidden="true" className="text-rose-soft" /> Tạo link khách mời
          </Button>
        </div>
      </div>
      <LinkGeneratorDialog open={linkOpen} onOpenChange={setLinkOpen} />
    </footer>
  );
}

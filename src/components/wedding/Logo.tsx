import { cn } from "@/lib/utils";
import { COUPLE_SHORT_LABEL } from "@/lib/wedding";

const LOGO_URL = "/images/logo-con-dau.png";

/** The couple's con dấu (L&C) logo in a round gold-ringed frame. */
export function Logo({
  className,
  ring = true,
  eager,
}: {
  className?: string;
  ring?: boolean;
  eager?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-full",
        ring && "ring-1 ring-gold/60 shadow-[0_0_24px_-4px_var(--ocean)]",
        className,
      )}
    >
      <img
        src={LOGO_URL}
        alt={`Logo ${COUPLE_SHORT_LABEL}`}
        width={512}
        height={512}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-contain"
      />
    </span>
  );
}

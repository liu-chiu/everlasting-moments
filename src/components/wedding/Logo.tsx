import { cn } from "@/lib/utils";
import { COUPLE_SHORT_LABEL } from "@/lib/wedding";

const LOGO_URL = "/images/logo-liu_chiu-removebg.webp";

/** The couple's con dấu (L&C) logo — transparent PNG, no outer frame. */
export function Logo({
  className,
  ring: _ring,
  eager,
}: {
  className?: string;
  /** Deprecated: the frame was removed from the source image. Kept so existing callers compile. */
  ring?: boolean;
  eager?: boolean;
}) {
  return (
    <span className={cn("relative inline-block shrink-0", className)}>
      <img
        src={LOGO_URL}
        alt={`Logo ${COUPLE_SHORT_LABEL}`}
        width={256}
        height={256}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-contain"
      />
    </span>
  );
}

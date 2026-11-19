import logo from "@/assets/logo-lc.webp.asset.json";
import { cn } from "@/lib/utils";

/** The couple's L&C logo in a round gold-ringed frame. */
export function Logo({ className, ring = true, eager }: { className?: string; ring?: boolean; eager?: boolean }) {
  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-full bg-night",
        ring && "ring-1 ring-gold/60 shadow-[0_0_24px_-4px_var(--ocean)]",
        className,
      )}
    >
      <img
        src={logo.url}
        alt="Logo Lan & Chung"
        width={480}
        height={480}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-cover"
      />
    </span>
  );
}

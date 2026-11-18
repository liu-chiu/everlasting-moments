import { cn } from "@/lib/utils";

export function Monogram({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline font-signature leading-none", className)} aria-label="Lan và Chung">
      L<span className="mx-[0.05em] font-script text-[0.7em] text-gold">&</span>C
    </span>
  );
}

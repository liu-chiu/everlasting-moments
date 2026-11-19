import type { ReactNode } from "react";
import * as D from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Paper-styled popup with the "Lan & Chung · 12.12.2026" header used across the invitation. */
export function WeddingDialog({
  open,
  onOpenChange,
  title,
  children,
  className,
  closeLabel = "Đóng",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  children: ReactNode;
  className?: string;
  closeLabel?: string;
}) {
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Portal>
        <D.Overlay className="fixed inset-0 z-[75] bg-night/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <D.Content
          aria-describedby={undefined}
          className={cn(
            "fixed inset-x-0 bottom-0 z-[76] max-h-[92svh] overflow-y-auto rounded-t-[2rem] bg-card px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 shadow-card ring-1 ring-gold/30 duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[min(92vw,34rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[2rem] sm:px-8 sm:pb-8 sm:pt-6 sm:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=open]:slide-in-from-bottom-0 sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95",
            className,
          )}
        >
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border sm:hidden" />
          <div className="flex items-center justify-between gap-4">
            <span className="eyebrow">Lan & Chung · 12.12.2026</span>
            <D.Close
              aria-label={closeLabel}
              className="grid size-9 shrink-0 place-items-center rounded-full border border-gold/40 text-gold-deep transition hover:bg-gold/10"
            >
              <X className="size-4" />
            </D.Close>
          </div>
          <D.Title className="mt-3 font-serif text-3xl font-medium leading-tight text-foreground sm:text-4xl">{title}</D.Title>
          <div className="mt-4">{children}</div>
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}

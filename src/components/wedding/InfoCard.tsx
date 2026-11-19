import { useState } from "react";
import { Check, Copy, Phone } from "lucide-react";
import type { InfoCard as InfoCardData } from "@/lib/wedding";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Card of label/value rows with a "Sao chép thông tin" button, like the original RSVP popup. */
export function InfoCard({ card }: { card: InfoCardData }) {
  const [state, setState] = useState<"idle" | "ok" | "fail">("idle");
  const copy = async () => {
    const ok = await copyText(card.items.map(([k, v]) => `${k}: ${v}`).join("\n"));
    setState(ok ? "ok" : "fail");
    window.setTimeout(() => setState("idle"), 1800);
  };
  return (
    <section className="rounded-2xl bg-muted/70 p-4 ring-1 ring-border sm:p-5">
      <h3 className="font-serif text-xl font-medium text-foreground">{card.title}</h3>
      <dl className="mt-3 divide-y divide-border text-sm">
        {card.items.map(([label, value, type]) => (
          <div key={label} className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-3 py-2">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="min-w-0 break-words text-right font-medium text-foreground">
              {type === "phone" && /\d/.test(value) ? (
                <a href={`tel:${value.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline">
                  <Phone className="size-3.5 shrink-0" /> {value}
                </a>
              ) : (
                value
              )}
            </dd>
          </div>
        ))}
      </dl>
      <button
        type="button"
        onClick={copy}
        className="mt-3 inline-flex items-center gap-2 rounded-full border border-gold/50 bg-card px-4 py-2 text-xs font-medium text-gold-deep transition hover:bg-gold/10"
      >
        {state === "ok" ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        {state === "ok" ? "Đã sao chép" : state === "fail" ? "Không thể sao chép" : "Sao chép thông tin"}
      </button>
    </section>
  );
}

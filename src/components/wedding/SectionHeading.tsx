import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  children,
  sub,
  className,
  tone = "paper",
}: {
  eyebrow: string;
  children: ReactNode;
  sub?: ReactNode;
  className?: string;
  tone?: "paper" | "night";
}) {
  return (
    <Reveal className={cn("mx-auto max-w-2xl text-center", className)}>
      <p className={cn("eyebrow gold-rule justify-center", tone === "night" && "text-gold")}>
        {eyebrow}
      </p>
      <h2
        className={cn(
          "section-title mt-5",
          tone === "night" ? "text-night-foreground [&_em]:text-gold" : "text-foreground",
        )}
      >
        {children}
      </h2>
      {sub && (
        <p
          className={cn(
            "mx-auto mt-5 max-w-lg text-[0.95rem] leading-relaxed",
            tone === "night" ? "text-night-foreground/70" : "text-muted-foreground",
          )}
        >
          {sub}
        </p>
      )}
    </Reveal>
  );
}

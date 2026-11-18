import type { CSSProperties, ElementType, ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

type Props = {
  as?: ElementType;
  delay?: number;
  zoom?: boolean;
  className?: string;
  children: ReactNode;
};

export function Reveal({ as: Tag = "div", delay = 0, zoom, className, children }: Props) {
  const ref = useReveal<HTMLElement>();
  return (
    <Tag
      ref={ref}
      className={cn(zoom ? "reveal-zoom" : "reveal", className)}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

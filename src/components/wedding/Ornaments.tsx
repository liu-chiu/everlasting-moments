import { cn } from "@/lib/utils";

type Corner = "topLeft" | "topRight" | "bottomRight" | "bottomLeft";

const cornerPositions: Record<Corner, string> = {
  topLeft: "-left-1 -top-1",
  topRight: "-right-1 -top-1 rotate-90",
  bottomRight: "-bottom-1 -right-1 rotate-180",
  bottomLeft: "-bottom-1 -left-1 -rotate-90",
};

const cornerSets = {
  all: ["topLeft", "topRight", "bottomRight", "bottomLeft"],
  bottom: ["bottomRight", "bottomLeft"],
} satisfies Record<string, Corner[]>;

/** Fine botanical line work, drawn to sit quietly around the invitation text. */
export function FloralCorner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
    >
      <path
        d="M6 114C11 82 28 51 58 31C75 20 94 12 114 6"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <path d="M8 106C28 102 43 103 58 108" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" opacity="0.55" />
      <path d="M14 86C29 84 40 74 45 59C28 59 17 69 14 86Z" fill="currentColor" fillOpacity="0.09" stroke="currentColor" strokeWidth="0.85" />
      <path d="M27 63C28 48 38 38 53 35C52 50 43 60 27 63Z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="0.85" />
      <path d="M47 43C48 28 58 19 73 18C71 33 62 41 47 43Z" fill="currentColor" fillOpacity="0.09" stroke="currentColor" strokeWidth="0.85" />
      <path d="M67 29C77 37 90 36 101 27C91 18 78 19 67 29Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.85" />
      <path d="M85 18C91 8 101 5 111 8C106 18 97 22 85 18Z" fill="currentColor" fillOpacity="0.09" stroke="currentColor" strokeWidth="0.85" />
      <path d="M15 84C25 76 34 69 43 61M29 61C37 53 44 45 51 37M49 41C57 33 64 26 71 20M70 28C80 27 89 27 98 27" stroke="currentColor" strokeWidth="0.55" opacity="0.65" />
      <path d="M56 34C52 24 56 15 66 10C70 20 66 29 56 34Z" fill="currentColor" fillOpacity="0.13" stroke="currentColor" strokeWidth="0.75" />
      <g transform="translate(80 13)" stroke="currentColor" strokeWidth="0.7">
        <path d="M0 0C-8-1-10-8-5-11C0-13 3-8 0 0Z" fill="currentColor" fillOpacity="0.16" />
        <path d="M0 0C1-8 8-10 11-5C13 0 8 3 0 0Z" fill="currentColor" fillOpacity="0.16" />
        <path d="M0 0C8 1 10 8 5 11C0 13-3 8 0 0Z" fill="currentColor" fillOpacity="0.16" />
        <path d="M0 0C-1 8-8 10-11 5C-13 0-8-3 0 0Z" fill="currentColor" fillOpacity="0.16" />
        <circle r="2.2" fill="currentColor" fillOpacity="0.65" stroke="none" />
      </g>
      <circle cx="20" cy="98" r="1.4" fill="currentColor" opacity="0.55" />
      <circle cx="102" cy="15" r="1.1" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

export function OrnamentalFrame({
  tone = "light",
  corners = "all",
  className,
  cornerClassName,
}: {
  tone?: "light" | "dark";
  corners?: keyof typeof cornerSets;
  className?: string;
  cornerClassName?: string;
}) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-2 z-[2] rounded-[inherit]", className)}>
      <div
        className={cn(
          "absolute inset-0 rounded-[inherit] border",
          tone === "light" ? "border-gold-deep/25" : "border-gold-soft/30",
        )}
      />
      {cornerSets[corners].map((corner) => (
        <FloralCorner
          key={corner}
          className={cn(
            "absolute size-16 sm:size-20",
            tone === "light" ? "text-gold-deep/55" : "text-gold-soft/55",
            cornerPositions[corner],
            cornerClassName,
          )}
        />
      ))}
    </div>
  );
}

/** A small symmetrical floral flourish for flaps, seals and section dividers. */
export function FloralFlourish({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 30" fill="none" aria-hidden="true" className={cn("pointer-events-none", className)}>
      <path d="M4 18C35 18 48 8 72 15M176 18C145 18 132 8 108 15" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M29 16C24 8 16 7 10 11C15 18 22 20 29 16ZM49 12C45 5 38 3 32 6C36 13 42 16 49 12ZM151 16C156 8 164 7 170 11C165 18 158 20 151 16ZM131 12C135 5 142 3 148 6C144 13 138 16 131 12Z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="0.7" />
      <path d="M72 15C79 4 85 5 90 15C95 5 101 4 108 15C101 25 95 24 90 15C85 24 79 25 72 15Z" fill="currentColor" fillOpacity="0.09" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="90" cy="15" r="2.3" fill="currentColor" />
      <circle cx="4" cy="18" r="1.2" fill="currentColor" opacity="0.6" />
      <circle cx="176" cy="18" r="1.2" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

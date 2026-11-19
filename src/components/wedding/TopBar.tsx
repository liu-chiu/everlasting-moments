import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const LINKS = [
  ["#story", "Câu chuyện"],
  ["#gallery", "Album"],
  ["#events", "Sự kiện"],
  ["#rsvp", "Xác nhận"],
  ["#wishes", "Lời chúc"],
  ["#gift", "Mừng cưới"],
];

/** Scroll progress line + compact nav that appears after the hero. */
export function TopBar() {
  const bar = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      setShown(window.scrollY > window.innerHeight * 0.8);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div ref={bar} className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-sunset" style={{ transform: "scaleX(0)" }} />
      <header
        className={cn(
          "fixed left-1/2 top-3 z-50 hidden -translate-x-1/2 items-center gap-6 rounded-full px-5 py-2.5 shadow-soft transition-all duration-500 glass-paper md:flex",
          shown ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-6 opacity-0",
        )}
      >
        <a href="#hero" aria-label="Về đầu trang">
          <Monogram className="text-2xl text-wax" />
        </a>
        <nav className="flex gap-5 whitespace-nowrap text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href} className="transition hover:text-gold-deep">
              {label}
            </a>
          ))}
        </nav>
      </header>
    </>
  );
}

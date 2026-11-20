import { useEffect, useRef, useState } from "react";
import * as D from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
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

export function TopBar() {
  const bar = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
      setShown(window.scrollY > window.innerHeight * 0.8);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={bar}
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-sunset"
        style={{ transform: "scaleX(0)" }}
      />
      <header
        className={cn(
          "fixed left-1/2 top-3 z-50 hidden -translate-x-1/2 items-center gap-6 rounded-full px-5 py-2.5 shadow-soft transition-all duration-500 glass-paper md:flex",
          shown ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-6 opacity-0",
        )}
      >
        <a href="#hero" aria-label="Về đầu trang">
          <Logo className="size-9" />
        </a>
        <nav
          className="flex gap-5 whitespace-nowrap text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground"
          aria-label="Mục lục"
        >
          {LINKS.map(([href, label]) => (
            <a key={href} href={href} className="transition hover:text-gold-deep">
              {label}
            </a>
          ))}
        </nav>
      </header>

      <div
        className={cn(
          "fixed inset-x-4 top-[max(0.75rem,env(safe-area-inset-top))] z-50 flex items-center justify-between transition-all duration-500 md:hidden",
          shown ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-6 opacity-0",
        )}
      >
        <a
          href="#hero"
          aria-label="Về đầu trang"
          className="glass-paper grid size-11 place-items-center rounded-full shadow-soft"
        >
          <Logo className="size-9" />
        </a>
        <D.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <D.Trigger asChild>
            <button
              type="button"
              aria-label="Mở mục lục"
              className="glass-paper grid size-11 place-items-center rounded-full text-foreground shadow-soft"
            >
              <Menu className="size-5" />
            </button>
          </D.Trigger>
          <D.Portal>
            <D.Overlay className="fixed inset-0 z-[65] bg-night/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <D.Content className="fixed inset-y-0 right-0 z-[66] flex w-[min(88vw,22rem)] flex-col overflow-y-auto bg-night px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] text-night-foreground shadow-card duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
              <div className="flex items-center justify-between gap-4">
                <Logo className="size-12" eager />
                <D.Close
                  aria-label="Đóng mục lục"
                  className="grid size-11 shrink-0 place-items-center rounded-full border border-gold/40 text-gold-soft"
                >
                  <X className="size-5" />
                </D.Close>
              </div>
              <D.Title className="mt-10 font-serif text-4xl font-medium">
                Lan <span className="font-script text-gold">&</span> Chung
              </D.Title>
              <D.Description className="mt-2 text-xs uppercase tracking-[0.28em] text-gold-soft">
                12 · 12 · 2026
              </D.Description>
              <nav className="mt-10 flex flex-col" aria-label="Mục lục điện thoại">
                {LINKS.map(([href, label], index) => (
                  <D.Close asChild key={href}>
                    <a
                      href={href}
                      className="flex items-center gap-4 border-b border-gold/15 py-4 font-serif text-2xl text-night-foreground transition hover:text-gold-soft"
                    >
                      <span className="text-[0.65rem] tracking-widest text-gold">0{index + 1}</span>
                      {label}
                    </a>
                  </D.Close>
                ))}
              </nav>
              <D.Close asChild>
                <a
                  href="#rsvp"
                  className="mt-auto inline-flex min-h-12 items-center justify-center rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-night shadow-gold"
                >
                  Xác nhận tham dự
                </a>
              </D.Close>
            </D.Content>
          </D.Portal>
        </D.Root>
      </div>
    </>
  );
}

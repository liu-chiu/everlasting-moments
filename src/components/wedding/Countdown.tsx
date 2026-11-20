import { useEffect, useState } from "react";
import { getCountdown, WEDDING_DATE } from "@/lib/wedding";
import { StarField } from "./StarField";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

export function Countdown() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const c = now ? getCountdown(WEDDING_DATE, now) : null;
  const units = [
    { label: "Ngày", value: c?.days },
    { label: "Giờ", value: c?.hours },
    { label: "Phút", value: c?.minutes },
    { label: "Giây", value: c?.seconds },
  ];

  return (
    <section
      id="countdown"
      className="relative isolate overflow-hidden bg-dusk px-6 py-24 text-night-foreground sm:py-32"
    >
      <StarField className="-z-10 h-2/3" density={0.8} />
      <SectionHeading tone="night" eyebrow="Until our day">
        Đếm từng <em>khoảnh khắc</em>
      </SectionHeading>
      <Reveal className="mx-auto mt-14 grid max-w-3xl grid-cols-4 gap-2 sm:gap-5">
        {units.map((u) => (
          <div
            key={u.label}
            className="glass-night rounded-2xl px-1 py-5 text-center sm:rounded-3xl sm:py-8"
          >
            <div className="overflow-hidden font-serif text-4xl font-medium tabular-nums [perspective:400px] sm:text-7xl">
              <span key={u.value ?? "x"} className="digit-flip text-gold-shimmer">
                {u.value === undefined ? "--" : String(u.value).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-2 text-[0.65rem] uppercase tracking-[0.3em] text-night-foreground/75 sm:text-xs">
              {u.label}
            </p>
          </div>
        ))}
      </Reveal>
      <p className="mt-10 text-center font-serif text-xl italic text-night-foreground/90">
        {c?.done
          ? "Hôm nay là ngày chung đôi của chúng mình!"
          : "Hẹn gặp bạn vào ngày 12 tháng 12 năm 2026."}
      </p>
    </section>
  );
}

import { COUPLE, FAMILIES } from "@/lib/wedding";
import { Logo } from "./Logo";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Families() {
  const sides = [
    { fam: FAMILIES.bride, person: COUPLE.bride, label: "Cô dâu" },
    { fam: FAMILIES.groom, person: COUPLE.groom, label: "Chú rể" },
  ];
  return (
    <section id="family" className="relative bg-background px-6 py-24 sm:py-32">
      <SectionHeading eyebrow="Together with our families">
        Gia đình <em>hai bên</em>
      </SectionHeading>
      <div className="relative mx-auto mt-14 grid max-w-5xl items-center gap-10 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-6 lg:gap-12">
        {sides.map((s, i) => (
          <Reveal key={s.label} delay={i * 150} className={i === 1 ? "md:order-3" : ""}>
            <div className="mx-auto w-full max-w-sm text-center">
              <p className="eyebrow">{s.fam.title}</p>
              <div className="mt-5 grid gap-2 font-serif text-2xl font-medium italic leading-relaxed text-ocean-deep sm:text-[1.75rem] md:min-h-24 md:text-2xl lg:text-[1.75rem]">
                <p>
                  <span className="mr-1 text-lg font-normal not-italic text-muted-foreground">
                    Ông
                  </span>{" "}
                  {s.fam.father}
                </p>
                <p>
                  <span className="mr-1 text-lg font-normal not-italic text-muted-foreground">
                    Bà
                  </span>{" "}
                  {s.fam.mother}
                </p>
              </div>
              <div className="mx-auto my-6 h-px w-16 bg-gold/60" />
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground">
                {s.label} · {s.person.role}
              </p>
              <p className="mt-3 block min-w-0 break-words px-2 pb-3 pt-8 font-signature text-[2.5rem] leading-[1.8] text-wax lg:text-5xl">
                {s.person.display}
              </p>
            </div>
          </Reveal>
        ))}
        <Reveal zoom className="order-first mx-auto md:order-2">
          <div className="relative">
            <span className="absolute -inset-3 animate-spin-slow rounded-full border border-dashed border-gold/50" />
            <Logo className="size-28 sm:size-32" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

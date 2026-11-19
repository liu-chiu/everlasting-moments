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
      <div className="relative mx-auto mt-16 grid max-w-4xl items-center gap-10 md:grid-cols-[1fr_auto_1fr]">
        {sides.map((s, i) => (
          <Reveal key={s.label} delay={i * 150} className={i === 1 ? "md:order-3" : ""}>
            <div className="text-center">
              <p className="eyebrow">{s.fam.title}</p>
              <p className="mt-4 font-serif text-lg text-muted-foreground">
                Ông <span className="text-foreground">{s.fam.father}</span>
              </p>
              <p className="font-serif text-lg text-muted-foreground">
                Bà <span className="text-foreground">{s.fam.mother}</span>
              </p>
              <div className="mx-auto my-6 h-px w-16 bg-gold/60" />
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground">
                {s.label} · {s.person.role}
              </p>
              <p className="mt-2 font-signature text-5xl text-wax">{s.person.display}</p>
            </div>
          </Reveal>
        ))}
        <Reveal zoom className="order-first mx-auto md:order-2">
          <div className="relative">
            <span className="absolute -inset-3 animate-spin-slow rounded-full border border-dashed border-gold/50" />
            <Logo className="size-28 shadow-gold sm:size-32" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

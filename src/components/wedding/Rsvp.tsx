import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Phone, Send } from "lucide-react";
import {
  EVENT_OPTIONS,
  RSVP_DEADLINE_LABEL,
  TRANSPORT_OPTIONS,
  TRAVEL,
  type Side,
} from "@/lib/wedding";
import { submitAndVerify, type Wish } from "@/lib/wedding-api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { celebrate } from "./celebrate";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "ok" | "error";
const ATTEND = "Sẽ tham dự";
const DECLINE = "Không thể tham dự";

export function Rsvp({ guest, side, onWish }: { guest: string; side?: Side; onWish: (w: Wish) => void }) {
  const [name, setName] = useState(guest);
  const [attendance, setAttendance] = useState(ATTEND);
  const defaultEvent = side ? EVENT_OPTIONS[side] : EVENT_OPTIONS.both;
  const [event, setEvent] = useState<string>(defaultEvent);
  const [transport, setTransport] = useState<string>(side === "groom" ? TRANSPORT_OPTIONS.groom : TRANSPORT_OPTIONS.self);
  const [status, setStatus] = useState<Status>("idle");
  const [dialog, setDialog] = useState<null | { attendance: string; transport: string }>(null);
  const submitBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => setName(guest), [guest]);

  const attending = attendance === ATTEND;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (data.website) return; // honeypot
    setStatus("sending");
    setDialog({ attendance, transport: attending ? transport : "" });
    try {
      await submitAndVerify({
        type: "rsvp",
        website: "",
        name: data.name.trim(),
        guests: data.guests,
        event: attending ? event : EVENT_OPTIONS.both,
        attendance,
        transportation: attending ? transport : "",
        phone: data.phone || "",
        message: data.message || "",
      });
      const wish = (data.wish || "").trim();
      if (wish) {
        submitAndVerify({ type: "wish", website: "", name: data.name.trim(), wish }).catch(() => {});
        onWish({ name: data.name.trim(), wish });
      }
      setStatus("ok");
      const r = submitBtn.current?.getBoundingClientRect();
      celebrate(r ? { x: r.left + r.width / 2, y: r.top } : undefined);
      form.reset();
      setName(guest);
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="rsvp" className="relative overflow-hidden bg-dusk px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeading
        tone="night"
        eyebrow="Répondez s’il vous plaît"
        sub={`Vui lòng xác nhận trước ngày ${RSVP_DEADLINE_LABEL} để chúng mình chuẩn bị chỗ ngồi và tiệc cưới chu đáo nhất.`}
      >
        Bạn sẽ <em>đến chung vui?</em>
      </SectionHeading>

      <Reveal zoom className="mx-auto mt-14 max-w-2xl">
        <form onSubmit={onSubmit} className="rounded-[2rem] bg-card/95 p-6 shadow-card ring-1 ring-gold/20 backdrop-blur sm:p-10">
          <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

          <div className="grid grid-cols-2 gap-3">
            {[ATTEND, DECLINE].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setAttendance(v)}
                aria-pressed={attendance === v}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-2xl border px-3 py-4 text-sm font-medium transition",
                  attendance === v
                    ? v === ATTEND
                      ? "border-primary bg-primary text-primary-foreground shadow-soft"
                      : "border-wax bg-wax text-primary-foreground shadow-soft"
                    : "border-input bg-card/60 text-foreground hover:border-gold",
                )}
              >
                {attendance === v && <Check className="size-4" />} {v}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_8rem]">
            <label>
              <span className="field-label">Họ và tên</span>
              <input name="name" required maxLength={80} value={name} onChange={(e) => setName(e.target.value)} className="field" placeholder="Tên của bạn" />
            </label>
            <label>
              <span className="field-label">Số người</span>
              <input name="guests" type="number" min={1} max={20} defaultValue={1} required className="field" />
            </label>
          </div>

          <label className="mt-5 block">
            <span className="field-label">Số điện thoại (không bắt buộc)</span>
            <input name="phone" type="tel" maxLength={30} autoComplete="tel" className="field" placeholder="09xx xxx xxx" />
          </label>

          {attending && (
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label>
                <span className="field-label">Buổi tiệc</span>
                <select
                  value={event}
                  onChange={(e) => {
                    setEvent(e.target.value);
                    if (transport !== TRANSPORT_OPTIONS.self)
                      setTransport(e.target.value === EVENT_OPTIONS.groom ? TRANSPORT_OPTIONS.groom : TRANSPORT_OPTIONS.bride);
                  }}
                  className="field"
                >
                  {(side ? [EVENT_OPTIONS[side]] : Object.values(EVENT_OPTIONS)).map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="field-label">Di chuyển</span>
                <select value={transport} onChange={(e) => setTransport(e.target.value)} className="field">
                  {Object.values(TRANSPORT_OPTIONS).map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
            </div>
          )}

          <label className="mt-5 block">
            <span className="field-label">Lời chúc dành cho Lan & Chung</span>
            <textarea name="wish" maxLength={500} rows={3} className="field resize-none" placeholder="Gửi một lời chúc thật dễ thương nhé…" />
          </label>
          <label className="mt-5 block">
            <span className="field-label">Điều chúng mình cần lưu ý</span>
            <textarea name="message" maxLength={500} rows={2} className="field resize-none" placeholder="Ăn chay, dị ứng, đi cùng em bé…" />
          </label>

          <button
            ref={submitBtn}
            type="submit"
            disabled={status === "sending"}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-night py-4 text-sm font-medium uppercase tracking-[0.25em] text-night-foreground shadow-gold transition hover:scale-[1.01] disabled:opacity-70"
          >
            {status === "sending" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            Gửi lời chúc & xác nhận
          </button>
          {status === "error" && (
            <p role="alert" className="mt-4 text-center text-sm text-wax">
              Chưa gửi được xác nhận. Bạn thử lại hoặc nhắn trực tiếp cho Lan & Chung nhé.
            </p>
          )}
        </form>
      </Reveal>

      <Dialog open={!!dialog} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent className="max-h-[90svh] overflow-y-auto rounded-3xl border-gold/30 bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-3xl font-medium">
              {dialog?.attendance === DECLINE ? "Cảm ơn bạn đã phản hồi" : "Hẹn gặp bạn trong ngày vui"}
            </DialogTitle>
            <DialogDescription asChild>
              <p
                role="status"
                className={cn(
                  "flex items-center gap-2 text-sm",
                  status === "ok" && "text-primary",
                  status === "error" && "text-wax",
                )}
              >
                {status === "sending" && <Loader2 className="size-4 animate-spin" />}
                {status === "sending" && "Đang gửi xác nhận…"}
                {status === "ok" && "✓ Đã gửi xác nhận thành công. Cảm ơn bạn!"}
                {status === "error" && "Chưa gửi được. Vui lòng đóng cửa sổ và thử lại."}
              </p>
            </DialogDescription>
          </DialogHeader>
          {dialog?.attendance === DECLINE ? (
            <p className="leading-relaxed text-muted-foreground">
              Lan & Chung rất tiếc vì chưa thể đón bạn trong ngày vui. Cảm ơn bạn đã luôn yêu thương và đồng hành cùng chúng mình — hẹn gặp bạn trong dịp gần nhất nhé!
            </p>
          ) : (
            <TravelInfo transport={dialog?.transport ?? ""} />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function TravelInfo({ transport }: { transport: string }) {
  const sideKey: Side | null =
    transport === TRANSPORT_OPTIONS.bride ? "bride" : transport === TRANSPORT_OPTIONS.groom ? "groom" : null;
  if (!sideKey)
    return (
      <p className="leading-relaxed text-muted-foreground">
        Cảm ơn bạn đã xác nhận tham dự. Chúc bạn di chuyển an toàn và hẹn gặp bạn tại buổi tiệc nhé!
      </p>
    );
  const t = TRAVEL[sideKey];
  return (
    <div className="rounded-2xl bg-muted p-5">
      <p className="eyebrow">{t.title}</p>
      <dl className="mt-3 space-y-2 text-sm">
        {t.items.map(([k, v, type]) => (
          <div key={k} className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-right font-medium text-foreground">
              {type === "phone" ? (
                <a href={`tel:${v}`} className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline">
                  <Phone className="size-3.5" /> {v}
                </a>
              ) : (
                v
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

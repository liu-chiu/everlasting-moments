import { useEffect, useRef, useState } from "react";
import { Bus, Check, Loader2, Send } from "lucide-react";
import {
  confirmationFor,
  defaultTransportFor,
  EVENT_OPTIONS,
  RSVP_DEADLINE_LABEL,
  RSVP_TEXT,
  TRANSPORT_OPTIONS,
  TRAVEL,
  type Side,
} from "@/lib/wedding";
import { checkHealth, submitAndVerify, type Wish } from "@/lib/wedding-api";
import { track } from "@/lib/analytics";
import { celebrate } from "./celebrate";
import { InfoCard } from "./InfoCard";
import { Reveal } from "./Reveal";
import { WeddingDialog } from "./WeddingDialog";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "ok" | "error";
const ATTEND = "Sẽ tham dự";
const DECLINE = "Không thể tham dự";

export function Rsvp({ guest, side, onWish }: { guest: string; side?: Side | undefined; onWish: (w: Wish) => void }) {
  const eventChoices = side ? [EVENT_OPTIONS[side]] : Object.values(EVENT_OPTIONS);
  const defaultEvent: string = side ? EVENT_OPTIONS[side] : EVENT_OPTIONS.both;

  const [name, setName] = useState(guest);
  const [attendance, setAttendance] = useState("");
  const [attendanceError, setAttendanceError] = useState(false);
  const [event, setEvent] = useState<string>(defaultEvent);
  const [transport, setTransport] = useState<string>(defaultTransportFor(defaultEvent));
  const [status, setStatus] = useState<Status>("idle");
  const [backend, setBackend] = useState("Tụi mình đang chuẩn bị biểu mẫu một chút nhé…");
  const [result, setResult] = useState<null | { attendance: string; transport: string }>(null);
  const [schedule, setSchedule] = useState(false);
  const submitBtn = useRef<HTMLButtonElement>(null);
  const section = useRef<HTMLElement>(null);

  useEffect(() => setName(guest), [guest]);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      io.disconnect();
      checkHealth()
        .then((ok) =>
          setBackend(
            ok
              ? "Biểu mẫu đã sẵn sàng. Cảm ơn bạn đã ghé thăm!"
              : "Biểu mẫu đang gặp chút trục trặc. Bạn vui lòng thử lại sau hoặc nhắn trực tiếp cho Chúng mình nhé.",
          ),
        )
        .catch(() => setBackend("Không kết nối được với biểu mẫu. Bạn vui lòng thử lại sau hoặc nhắn trực tiếp cho Chúng mình nhé."));
    }, { rootMargin: "400px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const attending = attendance === ATTEND;

  const chooseAttendance = (value: string) => {
    setAttendance(value);
    setAttendanceError(false);
    if (status !== "sending") setStatus("idle");
    if (value === DECLINE) setEvent(EVENT_OPTIONS.both);
    else setTransport(defaultTransportFor(event));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!attendance) {
      setAttendanceError(true);
      form.querySelector<HTMLInputElement>("[data-attendance]")?.focus();
      return;
    }
    const fd = new FormData(form);
    const get = (key: string) => String(fd.get(key) ?? "");
    if (get("website")) return;
    const finalTransport = attending ? transport : "";
    setStatus("sending");
    setResult({ attendance, transport: finalTransport });
    try {
      await submitAndVerify({
        type: "rsvp",
        website: "",
        name: get("name").trim(),
        guests: get("guests"),
        event: attending ? event : EVENT_OPTIONS.both,
        attendance,
        transportation: finalTransport,
        phone: get("phone"),
        message: get("message"),
      });
      const wish = get("wish").trim();
      if (wish) {
        submitAndVerify({ type: "wish", website: "", name: get("name").trim(), wish }).catch(() => {});
        onWish({ name: get("name").trim(), wish });
      }
      track("rsvp_success", { event_slot: event, attendance, guests: Number(get("guests")) || 0 });
      setStatus("ok");
      if (attending) {
        const rect = submitBtn.current?.getBoundingClientRect();
        celebrate(rect ? { x: rect.left + rect.width / 2, y: rect.top } : undefined);
      }
      form.reset();
      setName(guest);
      setAttendance("");
      setEvent(defaultEvent);
      setTransport(defaultTransportFor(defaultEvent));
    } catch {
      track("rsvp_error");
      setStatus("error");
    }
  };

  const conf = result ? confirmationFor(result.attendance, result.transport) : null;

  return (
    <section ref={section} id="rsvp" className="rsvp-scene relative overflow-hidden px-5 py-20 text-night-foreground sm:px-8 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute -left-24 top-24 size-72 rounded-full border border-gold/15" />
      <div className="pointer-events-none absolute -bottom-36 -right-24 size-96 rounded-full border border-gold/15" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20 xl:gap-28">
        <Reveal className="min-w-0 self-start text-center lg:sticky lg:top-32 lg:text-left">
          <p className="eyebrow gold-rule justify-center text-gold-soft lg:justify-start">Répondez s’il vous plaît</p>
          <h2 className="section-title mt-5 text-night-foreground [&_em]:text-gold-soft">
            Bạn sẽ <em className="block lg:block">đến chung vui?</em>
          </h2>
          <p className="mx-auto mt-6 max-w-lg leading-relaxed text-night-foreground/80 lg:mx-0">
            Hãy cho chúng mình biết bạn có thể đến chung vui và gửi một lời chúc nhé. Tụi mình rất mong được gặp bạn!
          </p>
          <p className="mx-auto mt-5 max-w-lg font-serif text-lg italic leading-relaxed text-gold-soft lg:mx-0">
            ✨ Vui lòng xác nhận tham dự trước ngày {RSVP_DEADLINE_LABEL} để chúng mình thuận tiện sắp xếp chỗ ngồi và chuẩn bị tiệc cưới chu đáo nhất.
          </p>
          <p role="status" className="mt-5 text-xs leading-relaxed text-night-foreground/65">{backend}</p>
          <button
            type="button"
            onClick={() => setSchedule(true)}
            aria-haspopup="dialog"
            className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-gold/60 px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-night-foreground transition hover:-translate-y-0.5 hover:bg-gold/15"
          >
            <Bus className="size-4 shrink-0 text-gold-soft" /> Thông tin lịch trình
          </button>
        </Reveal>

        <Reveal zoom className="min-w-0">
          <form onSubmit={onSubmit} className="rsvp-form lg:pl-10 xl:pl-14">
            <label className="hidden" aria-hidden>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>

            <label className="rsvp-label">
              <span>Họ và tên</span>
              <input name="name" required maxLength={80} value={name} onChange={(e) => setName(e.target.value)} className="rsvp-field" placeholder="Tên của bạn" />
            </label>
            <label className="rsvp-label">
              <span>Số người</span>
              <input name="guests" type="number" inputMode="numeric" min={1} max={20} defaultValue={1} required className="rsvp-field" />
            </label>
            <label className="rsvp-label">
              <span>Số điện thoại, không bắt buộc</span>
              <input name="phone" type="tel" maxLength={30} autoComplete="tel" className="rsvp-field" placeholder="09xx xxx xxx" />
            </label>

            <fieldset className="mt-7">
              <legend className="rsvp-legend">Trạng thái</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {[ATTEND, DECLINE].map((value, index) => (
                  <label key={value} className={cn("rsvp-choice", attendance === value && "rsvp-choice-selected")}>
                    <input
                      type="radio"
                      name="attendance"
                      value={value}
                      checked={attendance === value}
                      data-attendance={index === 0 ? "" : undefined}
                      onChange={() => chooseAttendance(value)}
                      className="size-4 shrink-0 accent-gold"
                    />
                    <span>{value}</span>
                    {attendance === value && <Check className="ml-auto size-4 shrink-0 text-gold-soft" />}
                  </label>
                ))}
              </div>
              {attendanceError && <p className="mt-2 text-sm text-gold-soft">Bạn vui lòng chọn trạng thái tham dự nhé.</p>}
            </fieldset>

            <label className="rsvp-label">
              <span>Sự kiện</span>
              <select
                name="event"
                value={event}
                required
                disabled={attendance === DECLINE}
                onChange={(e) => {
                  setEvent(e.target.value);
                  if (attending) setTransport(defaultTransportFor(e.target.value));
                }}
                className="rsvp-field disabled:opacity-60"
              >
                {eventChoices.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            {attending && (
              <label className="rsvp-label rise-in">
                <span>Phương tiện di chuyển</span>
                <select name="transportation" value={transport} required onChange={(e) => setTransport(e.target.value)} className="rsvp-field">
                  <option value={TRANSPORT_OPTIONS.self}>Tự di chuyển</option>
                  <option value={TRANSPORT_OPTIONS.bride}>Đi cùng xe đoàn về nhà Gái</option>
                  <option value={TRANSPORT_OPTIONS.groom}>Đi cùng xe đoàn về nhà trai</option>
                </select>
              </label>
            )}

            <label className="rsvp-label">
              <span>Lời chúc dành cho Lan & Chung</span>
              <textarea name="wish" maxLength={500} rows={3} className="rsvp-field resize-none" placeholder="Gửi một lời chúc thật dễ thương nhé…" />
            </label>
            <label className="rsvp-label">
              <span>Điều chúng mình cần lưu ý</span>
              <textarea name="message" maxLength={500} rows={2} className="rsvp-field resize-none" placeholder="Ăn chay, dị ứng, đi cùng em bé…" />
            </label>

            <button
              ref={submitBtn}
              type="submit"
              disabled={status === "sending"}
              className="mt-8 flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-night px-5 py-4 text-xs font-medium uppercase tracking-[0.16em] text-night-foreground shadow-gold transition hover:-translate-y-0.5 hover:bg-night-soft disabled:translate-y-0 disabled:opacity-70 sm:text-sm sm:tracking-[0.2em]"
            >
              {status === "sending" ? <Loader2 className="size-4 shrink-0 animate-spin" /> : <Send className="size-4 shrink-0" />}
              Gửi lời chúc và xác nhận
            </button>
            <p role="status" className="mt-4 min-h-5 text-center text-sm leading-relaxed text-night-foreground/75">
              {status === "sending" ? RSVP_TEXT.formSending : status === "error" ? RSVP_TEXT.formError : ""}
            </p>
          </form>
        </Reveal>
      </div>

      <WeddingDialog open={!!result} onOpenChange={(open) => !open && setResult(null)} title={conf?.title} closeLabel="Đóng thông tin xác nhận">
        <p
          role="status"
          aria-live="polite"
          className={cn(
            "flex items-start gap-2 rounded-xl px-3 py-2 text-sm",
            status === "ok" && "bg-primary/10 text-primary",
            status === "error" && "bg-wax/10 text-wax",
            status === "sending" && "bg-muted text-muted-foreground",
          )}
        >
          {status === "sending" && <Loader2 className="mt-0.5 size-4 shrink-0 animate-spin" />}
          {status === "ok" && <Check className="mt-0.5 size-4 shrink-0" />}
          {status === "sending" ? RSVP_TEXT.sending : status === "error" ? RSVP_TEXT.error : RSVP_TEXT.success}
        </p>
        {conf?.body && <p className="mt-4 leading-relaxed text-muted-foreground">{conf.body}</p>}
        <div className="mt-4 space-y-3">
          {conf?.cards.map((card) => <InfoCard key={card.title} card={card} />)}
        </div>
      </WeddingDialog>

      <WeddingDialog open={schedule} onOpenChange={setSchedule} title={RSVP_TEXT.scheduleTitle} closeLabel="Đóng lịch trình">
        <div className="space-y-3">
          <InfoCard card={TRAVEL.bride} />
          <InfoCard card={TRAVEL.groom} />
        </div>
      </WeddingDialog>
    </section>
  );
}

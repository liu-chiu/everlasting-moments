import { useEffect, useRef, useState } from "react";
import { Bus, Check, Loader2, Send, X } from "lucide-react";
import {
  confirmationFor,
  COUPLE_SHORT_LABEL,
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
import { SectionHeading } from "./SectionHeading";
import { WeddingDialog } from "./WeddingDialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { rsvpFieldsFor } from "@/lib/rsvp-fields";

type Status = "idle" | "sending" | "ok" | "error";
const ATTEND = "Sẽ tham dự";
const DECLINE = "Không thể tham dự";

export function Rsvp({
  guest,
  side,
  onWish,
}: {
  guest: string;
  side?: Side | undefined;
  onWish: (w: Wish) => void;
}) {
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

  // Check the Google Sheets form once the section is near the screen.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
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
          .catch(() =>
            setBackend(
              "Không kết nối được với biểu mẫu. Bạn vui lòng thử lại sau hoặc nhắn trực tiếp cho Chúng mình nhé.",
            ),
          );
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const attending = attendance === ATTEND;
  const fields = rsvpFieldsFor(attendance);

  const chooseAttendance = (value: string) => {
    setAttendance(value);
    setAttendanceError(false);
    if (status !== "sending") setStatus("idle");
    if (value === ATTEND) setTransport(defaultTransportFor(event));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!attendance) {
      setAttendanceError(true);
      form.querySelector<HTMLElement>("[data-attendance]")?.focus();
      return;
    }
    const fd = new FormData(form);
    const get = (key: string) => String(fd.get(key) ?? "");
    if (get("website")) return; // honeypot
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
        submitAndVerify({ type: "wish", website: "", name: get("name").trim(), wish }).catch(
          () => {},
        );
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
    <section
      ref={section}
      id="rsvp"
      className="relative overflow-hidden bg-dusk px-4 py-20 sm:px-6 sm:py-28 lg:py-32"
    >
      <SectionHeading
        tone="night"
        eyebrow="Répondez s’il vous plaît"
        sub="Hãy cho chúng mình biết bạn có thể đến chung vui và gửi một lời chúc nhé. Tụi mình rất mong được gặp bạn!"
      >
        Bạn sẽ <em>đến chung vui?</em>
      </SectionHeading>
      <Reveal className="mx-auto mt-5 max-w-xl text-center">
        <p className="font-serif text-lg italic leading-snug text-gold-soft">
          Vui lòng xác nhận trước ngày{" "}
          <strong className="not-italic font-bold text-gold">{RSVP_DEADLINE_LABEL}</strong> để chúng
          mình chuẩn bị chỗ ngồi và tiệc cưới chu đáo nhất.
        </p>
        <p role="status" className="mt-4 text-xs text-night-foreground/70">
          {backend}
        </p>
        <Button
          variant="ghost"
          type="button"
          onClick={() => setSchedule(true)}
          aria-haspopup="dialog"
          className="glass-night mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-night-foreground transition hover:bg-gold/20"
        >
          <Bus className="size-4 shrink-0 text-gold" /> Thông tin lịch trình
        </Button>
      </Reveal>

      <Reveal zoom className="mx-auto mt-10 max-w-2xl">
        <form
          onSubmit={onSubmit}
          className="rounded-[2rem] bg-card/95 p-5 shadow-card ring-1 ring-gold/20 backdrop-blur sm:p-10"
        >
          <label className="hidden" aria-hidden>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>

          <fieldset className="mb-5">
            <legend className="field-label">Trạng thái</legend>
            <div className="grid grid-cols-2 gap-3">
              {[ATTEND, DECLINE].map((value, index) => (
                <Button
                  variant="ghost"
                  key={value}
                  type="button"
                  data-attendance={index === 0 ? "" : undefined}
                  onClick={() => chooseAttendance(value)}
                  aria-pressed={attendance === value}
                  className={cn(
                    "flex h-auto min-h-14 whitespace-normal items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-sm font-medium transition",
                    attendance === value
                      ? value === ATTEND
                        ? "border-primary bg-primary text-primary-foreground shadow-soft"
                        : "border-wax bg-wax text-primary-foreground shadow-soft"
                      : cn(
                          "bg-card/60 text-foreground hover:border-gold",
                          attendanceError ? "border-wax" : "border-input",
                        ),
                  )}
                >
                  {attendance === value &&
                    (value === ATTEND ? (
                      <Check className="size-4 shrink-0" />
                    ) : (
                      <X className="size-4 shrink-0" />
                    ))}{" "}
                  {value}
                </Button>
              ))}
            </div>
            {attendanceError && (
              <p className="mt-2 text-xs text-wax">Bạn vui lòng chọn trạng thái tham dự nhé.</p>
            )}
          </fieldset>

          <div className={cn("grid gap-5", fields.guests && "sm:grid-cols-[minmax(0,1fr)_8rem]")}>
            <label className="min-w-0">
              <span className="field-label">Họ và tên</span>
              <input
                name="name"
                required
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="field"
                placeholder="Tên của bạn"
              />
            </label>
            {fields.guests && (
              <label>
                <span className="field-label">Số người</span>
                <input
                  name="guests"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={20}
                  defaultValue={1}
                  required
                  className="field"
                />
              </label>
            )}
          </div>

          {fields.phone && (
            <label className="mt-5 block">
              <span className="field-label">Số điện thoại, không bắt buộc</span>
              <input
                name="phone"
                type="tel"
                maxLength={30}
                autoComplete="tel"
                className="field"
                placeholder="09xx xxx xxx"
              />
            </label>
          )}

          {fields.declinedMessage && (
            <p
              role="status"
              className="mt-5 flex items-start gap-2 rounded-xl bg-muted/60 px-4 py-3 text-sm italic leading-relaxed text-muted-foreground"
            >
              <span aria-hidden className="inline-block animate-bounce text-lg leading-none">
                &#58515;
              </span>
              <span>
                {COUPLE_SHORT_LABEL} rất tiếc vì chưa thể đón bạn trong ngày vui. Cảm ơn bạn đã luôn
                yêu thương và đồng hành cùng chúng mình – hẹn gặp bạn trong dịp gần nhất nhé!
              </span>
            </p>
          )}

          {fields.event && (
            <div className={cn("mt-5 grid gap-5", attending && "sm:grid-cols-2")}>
              <label className="min-w-0">
                <span className="field-label">Sự kiện</span>
                <select
                  value={event}
                  required
                  onChange={(e) => {
                    setEvent(e.target.value);
                    if (attending) setTransport(defaultTransportFor(e.target.value));
                  }}
                  className="field disabled:opacity-60"
                >
                  {eventChoices.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
              {attending && (
                <label className="min-w-0">
                  <span className="field-label">Phương tiện di chuyển</span>
                  <select
                    value={transport}
                    required
                    onChange={(e) => setTransport(e.target.value)}
                    className="field"
                  >
                    <option value={TRANSPORT_OPTIONS.self}>Tự di chuyển</option>
                    <option value={TRANSPORT_OPTIONS.bride}>Đi cùng xe đoàn về nhà Gái</option>
                    <option value={TRANSPORT_OPTIONS.groom}>Đi cùng xe đoàn về nhà trai</option>
                  </select>
                </label>
              )}
            </div>
          )}

          <label className="mt-5 block">
            <span className="field-label">Lời chúc dành cho {COUPLE_SHORT_LABEL}</span>
            <textarea
              name="wish"
              maxLength={500}
              rows={3}
              className="field resize-none"
              placeholder="Gửi một lời chúc thật dễ thương nhé…"
            />
          </label>
          {fields.notes && (
            <label className="mt-5 block">
              <span className="field-label">Điều chúng mình cần lưu ý</span>
              <textarea
                name="message"
                maxLength={500}
                rows={2}
                className="field resize-none"
                placeholder="Ăn chay, dị ứng, đi cùng em bé…"
              />
            </label>
          )}

          <Button
            variant="ghost"
            ref={submitBtn}
            type="submit"
            disabled={status === "sending"}
            className="mt-8 flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-night px-4 py-4 text-xs font-medium uppercase tracking-[0.2em] text-night-foreground shadow-gold transition hover:scale-[1.01] disabled:opacity-70 sm:text-sm sm:tracking-[0.25em]"
          >
            {status === "sending" ? (
              <Loader2 className="size-4 shrink-0 animate-spin" />
            ) : (
              <Send className="size-4 shrink-0" />
            )}
            Gửi lời chúc và xác nhận
          </Button>
          <p
            role="status"
            className={cn(
              "mt-4 min-h-5 text-center text-sm",
              status === "error" ? "text-wax" : "text-muted-foreground",
            )}
          >
            {status === "sending"
              ? RSVP_TEXT.formSending
              : status === "error"
                ? RSVP_TEXT.formError
                : ""}
          </p>
        </form>
      </Reveal>

      {/* Confirmation after sending — same wording and cards as the original invitation */}
      <WeddingDialog
        open={!!result}
        onOpenChange={(open) => !open && setResult(null)}
        title={conf?.title}
        closeLabel="Đóng thông tin xác nhận"
      >
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
          {status === "sending"
            ? RSVP_TEXT.sending
            : status === "error"
              ? RSVP_TEXT.error
              : RSVP_TEXT.success}
        </p>
        {conf?.body && <p className="mt-4 leading-relaxed text-muted-foreground">{conf.body}</p>}
        <div className="mt-4 space-y-3">
          {conf?.cards.map((card) => (
            <InfoCard key={card.title} card={card} />
          ))}
        </div>
      </WeddingDialog>

      <WeddingDialog
        open={schedule}
        onOpenChange={setSchedule}
        title={RSVP_TEXT.scheduleTitle}
        closeLabel="Đóng lịch trình"
      >
        <div className="space-y-3">
          <InfoCard card={TRAVEL.bride} />
          <InfoCard card={TRAVEL.groom} />
        </div>
      </WeddingDialog>
    </section>
  );
}

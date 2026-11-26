import { useEffect, useState, type CSSProperties } from "react";
import { Copy, Download, Gift } from "lucide-react";
import { toast } from "sonner";
import { deliverFile } from "@/lib/download-file";
import { qrResponseToPng } from "@/lib/qr-image";
import { GIFTS, vietQrUrl, type Side } from "@/lib/wedding";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Gifts({ guest, side }: { guest: string; side?: Side }) {
  const [selectedSide, setSelectedSide] = useState<"bride" | "groom">(
    side === "groom" ? "groom" : "bride",
  );
  const activeGift = GIFTS.find((item) => item.side === selectedSide) ?? GIFTS[0]!;

  return (
    <section id="gift" className="paper-grain relative px-5 py-20 sm:px-6 sm:py-28 lg:py-32">
      <SectionHeading
        eyebrow="A little blessing"
        sub="Sự hiện diện của bạn đã là món quà quý giá nhất. Nếu muốn gửi lời chúc mừng từ xa, hãy chạm mở hộp quà nhé."
      >
        Gửi lời <em>chúc mừng</em>
      </SectionHeading>
      <Reveal>
        <div className="mx-auto mt-12 max-w-md">
          <div
            role="tablist"
            aria-label="Chọn hộp mừng cưới"
            className="gift-switcher grid grid-cols-2 gap-1.5 rounded-full p-1.5"
          >
            {GIFTS.map((gift) => {
              const active = gift.side === activeGift.side;
              return (
                <button
                  key={gift.side}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`gift-panel-${gift.side}`}
                  id={`gift-tab-${gift.side}`}
                  onClick={() => setSelectedSide(gift.side === "groom" ? "groom" : "bride")}
                  className={`gift-switcher__btn min-h-11 rounded-full px-3 py-2.5 text-xs font-medium tracking-wide transition sm:px-4 sm:text-sm ${
                    active ? "gift-switcher__btn--active" : ""
                  }`}
                >
                  {gift.label}
                </button>
              );
            })}
          </div>

          <div
            id={`gift-panel-${activeGift.side}`}
            role="tabpanel"
            aria-labelledby={`gift-tab-${activeGift.side}`}
            className="gift-card mt-5 rounded-[2rem] bg-card px-5 py-8 shadow-card ring-1 ring-gold/30 sm:px-8 sm:py-10"
          >
            <GiftBox key={activeGift.side} gift={activeGift} guest={guest} />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function GiftBox({ gift, guest }: { gift: (typeof GIFTS)[number]; guest: string }) {
  const [open, setOpen] = useState(false);
  const [png, setPng] = useState<Blob | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const qr = vietQrUrl(gift.bankCode, gift.account, gift.holder, guest);
  const downloadUrl = `/api/public/gift-qr?${new URLSearchParams({ side: gift.side, ...(guest ? { to: guest } : {}) })}`;
  const filename = `ma-qr-mung-cuoi-${gift.side === "bride" ? "co-dau" : "chu-re"}.png`;

  useEffect(() => {
    if (!open || png) return;
    let cancelled = false;
    setPreparing(true);
    setDownloadError(false);
    const prepare = async () => {
      try {
        const response = await fetch(downloadUrl);
        const image = await qrResponseToPng(response);
        if (!cancelled) setPng(image);
      } catch {
        if (!cancelled) setDownloadError(true);
      } finally {
        if (!cancelled) setPreparing(false);
      }
    };
    void prepare();
    return () => {
      cancelled = true;
    };
  }, [attempt, downloadUrl, open, png]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(gift.account);
      toast.success("Đã sao chép số tài khoản");
    } catch {
      toast.error("Không thể sao chép");
    }
  };

  const savePng = () => {
    if (png) {
      void deliverFile(png, filename);
      return;
    }
    if (downloadError) setAttempt((value) => value + 1);
  };

  return (
    <div className="gift text-center" data-open={open}>
      <p className="eyebrow">{gift.label}</p>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative mx-auto mt-6 flex w-full flex-col items-center focus-visible:outline-none"
          aria-label={`Mở hộp quà ${gift.label}`}
        >
          <span className="relative block h-56 w-52">
            <span className="gift-halo" />
            {[
              { left: "8%", top: "12%", size: "text-sm", delay: "0s", char: "✦" },
              { left: "86%", top: "22%", size: "text-base", delay: "0.7s", char: "✧" },
              { left: "16%", top: "56%", size: "text-xs", delay: "1.3s", char: "✦" },
              { left: "80%", top: "62%", size: "text-sm", delay: "1.9s", char: "✧" },
            ].map((s, i) => (
              <span
                key={i}
                className={`gift-sparkle ${s.size}`}
                style={{ left: s.left, top: s.top, animationDelay: s.delay }}
                aria-hidden
              >
                {s.char}
              </span>
            ))}
            <span className="gift-wobble relative block h-full w-full">
              <span className="absolute inset-x-4 bottom-0 h-36 rounded-b-2xl gift-box-body shadow-card" />
              <span className="gift-ribbon absolute bottom-0 left-1/2 h-36 w-6 -translate-x-1/2" />
              <span className="gift-lid absolute inset-x-0 bottom-36 h-10 rounded-xl shadow-soft transition group-hover:-translate-y-2">
                <span className="gift-ribbon absolute left-1/2 top-0 h-full w-6 -translate-x-1/2" />
                <span className="absolute -top-9 left-1/2 -translate-x-1/2 text-5xl text-gold drop-shadow-[0_0_10px_oklch(0.85_0.13_88_/_70%)]">
                  ❀
                </span>
              </span>
            </span>
            {[-40, -14, 12, 44].map((angle, i) => (
              <span
                key={i}
                className="gift-burst"
                style={
                  {
                    "--burst-x": `${Math.cos((angle * Math.PI) / 180) * 70}px`,
                    "--burst-y": `${-70 - (i % 2) * 25}px`,
                    animationDelay: `${i * 60}ms`,
                  } as CSSProperties
                }
              />
            ))}
          </span>
          <span className="mt-7 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-background px-6 py-3 text-xs font-medium uppercase tracking-[0.22em] text-foreground shadow-soft transition group-hover:border-gold group-hover:text-gold-deep group-focus-visible:ring-2 group-focus-visible:ring-gold">
            <Gift className="size-4 text-wax" aria-hidden />
            <span>Chạm để mở hộp</span>
          </span>
        </button>
      ) : (
        <div className="rise-in mx-auto mt-5 w-full max-w-xs">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{gift.bank}</p>
          <p className="mt-1 font-serif text-2xl font-medium">{gift.holder}</p>
          <button
            type="button"
            onClick={copy}
            className="mt-1 inline-flex max-w-full items-center gap-2 break-all font-mono text-lg tracking-wider text-wax hover:underline"
          >
            {gift.account} <Copy className="size-4 shrink-0" />
          </button>
          <img
            src={qr}
            alt={`Mã QR chuyển khoản cho ${gift.holder}`}
            loading="lazy"
            width={300}
            height={300}
            className="mx-auto mt-4 aspect-square w-full max-w-[15rem] rounded-2xl bg-muted object-contain"
          />
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={savePng}
              disabled={!png && !downloadError}
              aria-label={`Lưu ảnh PNG mã QR cho ${gift.holder}`}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-night px-3 py-2 text-night-foreground disabled:cursor-wait disabled:opacity-50"
            >
              <Download className="size-3.5" />
              {preparing ? "Đang tạo PNG…" : downloadError && !png ? "Thử lại" : "Lưu ảnh PNG"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="min-h-10 rounded-full border border-border px-3 py-2 text-muted-foreground hover:bg-muted"
            >
              Thu gọn
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

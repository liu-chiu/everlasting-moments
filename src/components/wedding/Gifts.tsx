import { useState } from "react";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { GIFTS, vietQrUrl } from "@/lib/wedding";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Gifts({ guest }: { guest: string }) {
  return (
    <section id="gift" className="paper-grain relative px-5 py-20 sm:px-6 sm:py-28 lg:py-32">
      <SectionHeading
        eyebrow="A little blessing"
        sub="Sự hiện diện của bạn đã là món quà quý giá nhất. Nếu muốn gửi lời chúc mừng từ xa, hãy chạm mở hộp quà nhé."
      >
        Gửi lời <em>chúc mừng</em>
      </SectionHeading>
      <div className="mx-auto mt-16 grid max-w-4xl gap-16 sm:grid-cols-2 sm:gap-10">
        {GIFTS.map((gift, index) => (
          <Reveal key={gift.side} delay={index * 150}>
            <GiftBox gift={gift} guest={guest} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function GiftBox({ gift, guest }: { gift: (typeof GIFTS)[number]; guest: string }) {
  const [open, setOpen] = useState(false);
  const qr = vietQrUrl(gift.bankCode, gift.account, gift.holder, guest);
  const downloadUrl = `/api/public/gift-qr?${new URLSearchParams({ side: gift.side, ...(guest ? { to: guest } : {}) })}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(gift.account);
      toast.success("Đã sao chép số tài khoản");
    } catch {
      toast.error("Không thể sao chép");
    }
  };

  return (
    <div className="gift text-center" data-open={open}>
      <p className="eyebrow">{gift.label}</p>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative mx-auto mt-6 block h-56 w-52"
          aria-label={`Mở hộp quà ${gift.label}`}
        >
          <span className="absolute inset-x-4 bottom-0 h-36 rounded-b-2xl bg-wax shadow-card" />
          <span className="absolute bottom-0 left-1/2 h-36 w-6 -translate-x-1/2 bg-gold" />
          <span className="gift-lid absolute inset-x-0 bottom-36 h-10 rounded-xl bg-wax-deep shadow-soft transition group-hover:-translate-y-2">
            <span className="absolute left-1/2 top-0 h-full w-6 -translate-x-1/2 bg-gold" />
            <span className="absolute -top-9 left-1/2 -translate-x-1/2 text-5xl text-gold">❀</span>
          </span>
          <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs uppercase tracking-[0.3em] text-muted-foreground transition group-hover:text-gold-deep">
            Chạm để mở hộp
          </span>
        </button>
      ) : (
        <div className="rise-in mx-auto mt-6 w-full max-w-xs rounded-[2rem] bg-card p-5 shadow-card ring-1 ring-gold/30 sm:p-6">
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
            <a
              href={downloadUrl}
              download
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-night px-3 py-2 text-night-foreground"
            >
              <Download className="size-3.5" /> Lưu mã QR
            </a>
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

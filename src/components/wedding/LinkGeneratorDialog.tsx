import { useState } from "react";
import { Copy, X } from "lucide-react";
import { toast } from "sonner";
import { buildGuestLink, COUPLE_SHORT_LABEL } from "@/lib/wedding";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { WeddingDialog } from "./WeddingDialog";

/** Guest-link generator body — used inside the popup on the invitation. */
export function LinkGeneratorForm() {
  const [name, setName] = useState("");
  const [side, setSide] = useState<"" | "bride" | "groom">("");
  const [copied, setCopied] = useState(false);
  const guest = name.trim();
  const link = guest ? buildGuestLink("https://lan-chung-invitation.lovable.app/", guest, side || undefined) : "";

  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Đã sao chép link gửi khách");
      setCopied(true);
    } catch {
      toast.error("Không thể sao chép");
    }
  };

  return (
    <div>
      <Logo className="size-16" eager />
      <p className="eyebrow mt-4">Dành cho {COUPLE_SHORT_LABEL}</p>
      <h2 className="mt-2 font-serif text-3xl font-medium sm:text-4xl">Tạo link gửi khách mời</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Nhập tên khách mời để tạo đường link thiệp riêng — tên sẽ hiện trên phong bì, thiệp và biểu
        mẫu xác nhận.
      </p>
      <label className="mt-6 block">
        <span className="field-label">Tên khách mời</span>
        <input
          value={name}
          maxLength={60}
          onChange={(e) => setName(e.target.value)}
          className="field"
          placeholder="Ví dụ: chị Phương, Anh Tuấn & Chị Linh…"
        />
      </label>
      <label className="mt-4 block">
        <span className="field-label">Buổi tiệc mời</span>
        <select
          value={side}
          onChange={(e) => setSide(e.target.value as "" | "bride" | "groom")}
          className="field"
        >
          <option value="">Cả hai buổi tiệc</option>
          <option value="bride">Tiệc nhà gái (Hạ Long)</option>
          <option value="groom">Tiệc nhà trai (Sóc Sơn)</option>
        </select>
      </label>
      <div aria-live="polite" className="mt-5 flex items-center gap-2 rounded-2xl bg-muted p-3 pl-4">
        <p className="min-w-0 flex-1 break-all font-mono text-xs text-foreground">
          {link || "https://lan-chung-invitation.lovable.app/"}
        </p>
        <button
          type="button"
          onClick={copy}
          disabled={!link}
          aria-label="Sao chép link"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-night text-night-foreground shadow-gold transition hover:bg-night-soft disabled:opacity-60"
        >
          <Copy className="size-4" />
        </button>
      </div>
      <Button
        variant="ghost"
        type="button"
        onClick={copy}
        disabled={!link}
        className="mt-4 flex h-auto min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-night py-3.5 text-sm text-night-foreground shadow-gold hover:bg-night-soft hover:text-night-foreground disabled:opacity-60"
      >
        <Copy className="size-4" /> Sao chép link
      </Button>
      {copied && (
        <div
          role="status"
          className="rise-in mt-3 rounded-2xl border-gold/40 bg-gold/10 px-4 py-3 text-sm text-foreground"
        >
          <p className="break-words">Đã sao chép link — dán vào Zalo/Messenger để gửi khách nhé!</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Nhấn dấu ✕ góc trên để đóng khung này.
          </p>
        </div>
      )}
    </div>
  );
}

/** Popup wrapper used directly on the invitation (Finale footer). */
export function LinkGeneratorDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <WeddingDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Tạo link khách mời"
      closeLabel="Đóng khung tạo link"
    >
      <LinkGeneratorForm />
    </WeddingDialog>
  );
}

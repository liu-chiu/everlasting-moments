import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { buildGuestLink, type Side } from "@/lib/wedding";
import { Logo } from "@/components/wedding/Logo";

export const Route = createFileRoute("/tao-link")({
  head: () => ({
    meta: [
      { title: "Tạo link mời · Lan & Chung" },
      { name: "description", content: "Công cụ tạo đường link thiệp cưới riêng cho từng khách mời của Lan & Chung." },
      { property: "og:title", content: "Tạo link mời · Lan & Chung" },
      { property: "og:description", content: "Tạo link thiệp cưới hiển thị tên riêng từng khách mời." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LinkGenerator,
});

function LinkGenerator() {
  const [name, setName] = useState("");
  const [side, setSide] = useState<"" | Side>("");
  const [base, setBase] = useState("");
  useEffect(() => setBase(window.location.origin + "/"), []);
  const link = base ? buildGuestLink(base, name, side || undefined) : "";

  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Đã sao chép link gửi khách");
    } catch {
      toast.error("Không thể sao chép");
    }
  };

  return (
    <main className="paper-grain grid min-h-svh place-items-center px-5 py-16">
      <div className="w-full max-w-lg rounded-[2rem] bg-card p-8 shadow-card ring-1 ring-border">
        <Logo className="size-16" eager />
        <p className="eyebrow mt-4">Dành cho Lan & Chung</p>
        <h1 className="mt-2 font-serif text-4xl font-medium">Tạo link gửi khách mời</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Nhập tên khách mời để tạo đường link thiệp riêng — tên sẽ hiện trên phong bì, thiệp và biểu mẫu xác nhận.
        </p>
        <label className="mt-6 block">
          <span className="field-label">Tên khách mời</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="field" placeholder="Ví dụ: chị Phương, Anh Tuấn & Chị Linh…" />
        </label>
        <label className="mt-4 block">
          <span className="field-label">Buổi tiệc mời</span>
          <select value={side} onChange={(e) => setSide(e.target.value as "" | Side)} className="field">
            <option value="">Cả hai buổi tiệc</option>
            <option value="bride">Tiệc nhà gái (Hạ Long)</option>
            <option value="groom">Tiệc nhà trai (Sóc Sơn)</option>
          </select>
        </label>
        <div className="mt-5 break-all rounded-2xl bg-muted p-4 font-mono text-xs text-foreground">{link || "Đang tạo đường link…"}</div>
        <div className="mt-5 flex gap-3">
          <button type="button" onClick={copy} disabled={!link} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-night py-3.5 text-sm text-night-foreground shadow-gold disabled:opacity-60">
            <Copy className="size-4" /> Sao chép link
          </button>
          <Link to="/" search={{ ...(name.trim() ? { to: name.trim() } : {}), ...(side ? { side } : {}) }} className="rounded-2xl border border-border px-5 py-3.5 text-sm text-foreground hover:bg-muted">
            Xem thử
          </Link>
        </div>
      </div>
    </main>
  );
}

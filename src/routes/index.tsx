import { createFileRoute } from "@tanstack/react-router";
import { WeddingPage } from "@/components/wedding/WeddingPage";
import { normalizeGuestName, normalizeSide, OG_IMAGE, type Side } from "@/lib/wedding";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { to?: string; side?: Side } => {
    const to = normalizeGuestName(search["to"]);
    const side = normalizeSide(search["side"]);
    return { ...(to ? { to } : {}), ...(side ? { side } : {}) };
  },
  head: () => ({
    meta: [
      { title: "Lan & Chung · Thiệp cưới 12.12.2026" },
      {
        name: "description",
        content: "Ngọc Lan và Văn Chung trân trọng mời bạn cùng hiện diện trong ngày khởi đầu hành trình mới — Thứ Bảy, 12.12.2026.",
      },
      { property: "og:title", content: "Lan & Chung · 12.12.2026" },
      {
        property: "og:description",
        content: "Lan và Chung trân trọng mời bạn cùng hiện diện trong ngày khởi đầu hành trình mới — 12.12.2026.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "theme-color", content: "#0b1526" },
    ],
    links: [{ rel: "preload", as: "image", href: "/images/hero.webp", fetchPriority: "high" }],
  }),
  component: Index,
});

function Index() {
  const { to, side } = Route.useSearch();
  return <WeddingPage guest={to ?? ""} side={side} />;
}

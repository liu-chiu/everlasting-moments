import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { GIFTS, normalizeGuestName, vietQrUrl } from "@/lib/wedding";

const querySchema = z.object({
  side: z.enum(["bride", "groom"]),
  to: z.string().max(120).optional(),
}).strict();

/** Downloads one of the two fixed wedding QR codes; it is not a general-purpose proxy. */
export const Route = createFileRoute("/api/public/gift-qr")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams));
        if (!parsed.success) return new Response("Thông tin mã QR không hợp lệ", { status: 400 });
        const gift = GIFTS.find((item) => item.side === parsed.data.side);
        if (!gift) return new Response("Không tìm thấy mã QR", { status: 404 });
        const guest = normalizeGuestName(parsed.data.to);
        try {
          const upstream = await fetch(vietQrUrl(gift.bankCode, gift.account, gift.holder, guest), {
            signal: AbortSignal.timeout(12000),
          });
          if (!upstream.ok || !upstream.body) return new Response("Chưa tải được mã QR", { status: 502 });
          const contentType = upstream.headers.get("content-type") ?? "image/png";
          const extension = contentType.includes("svg") ? "svg" : "png";
          return new Response(upstream.body, {
            headers: {
              "Content-Type": contentType,
              "Content-Disposition": `attachment; filename="ma-qr-mung-cuoi-${gift.side === "bride" ? "co-dau" : "chu-re"}.${extension}"`,
              "Cache-Control": "public, max-age=300",
              "X-Content-Type-Options": "nosniff",
            },
          });
        } catch {
          return new Response("Chưa tải được mã QR", { status: 502 });
        }
      },
    },
  },
});

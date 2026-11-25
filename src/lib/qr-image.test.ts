import { describe, expect, it } from "vitest";
import { isPng, qrResponseToPng } from "./qr-image";

const png = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 1, 2]);

describe("QR image downloads", () => {
  it("recognizes a real PNG signature and rejects an SVG wrapper", () => {
    expect(isPng(png)).toBe(true);
    expect(isPng(new TextEncoder().encode("<svg><image /></svg>"))).toBe(false);
  });

  it("keeps a valid upstream PNG as an image download", async () => {
    const response = new Response(png, { headers: { "Content-Type": "image/png" } });
    const result = await qrResponseToPng(response);
    expect(result.type).toBe("image/png");
    expect(new Uint8Array(await result.arrayBuffer())).toEqual(png);
  });

  it("rejects unsupported or invalid source images", async () => {
    const text = new Response("not an image", { headers: { "Content-Type": "text/plain" } });
    await expect(qrResponseToPng(text)).rejects.toThrow("Unsupported QR format");
    const invalid = new Response("not a PNG", { headers: { "Content-Type": "image/png" } });
    await expect(qrResponseToPng(invalid)).rejects.toThrow("Invalid PNG");
  });
});

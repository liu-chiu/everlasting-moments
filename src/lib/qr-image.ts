const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];

export function isPng(bytes: Uint8Array) {
  return (
    bytes.length >= PNG_SIGNATURE.length &&
    PNG_SIGNATURE.every((byte, index) => bytes[index] === byte)
  );
}

/** Convert the fixed VietQR response to a real PNG, including its vector QR paths. */
export async function qrResponseToPng(response: Response): Promise<Blob> {
  if (!response.ok) throw new Error("QR source unavailable");
  const source = await response.blob();
  const contentType = response.headers.get("content-type") ?? source.type;
  if (contentType.includes("image/png")) {
    const bytes = new Uint8Array(await source.arrayBuffer());
    if (!isPng(bytes)) throw new Error("Invalid PNG");
    return new Blob([bytes], { type: "image/png" });
  }
  if (!contentType.includes("image/svg+xml")) throw new Error("Unsupported QR format");

  const svgUrl = URL.createObjectURL(source);
  try {
    const image = new Image();
    image.src = svgUrl;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = (image.naturalWidth || 540) * 2;
    canvas.height = (image.naturalHeight || 640) * 2;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("PNG conversion failed"));
      }, "image/png");
    });
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

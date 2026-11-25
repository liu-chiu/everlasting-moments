/**
 * jsdom's Blob implementation lacks `arrayBuffer()` / `text()` / `stream()`.
 * Replace the jsdom window's Blob with Node's `buffer.Blob` (which implements
 * the full spec) so code under test that reads blob contents works in tests.
 */
export function installJsdomBlobFix(): void {
  const jsdomWindow = (globalThis as unknown as { window?: unknown }).window as
    Record<string, unknown> | undefined;
  if (!jsdomWindow) return;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nodeBlob = require("node:buffer").Blob as
    (new (parts: BlobPart[]) => { arrayBuffer(): Promise<ArrayBuffer> }) | undefined;
  if (typeof nodeBlob !== "function") return;
  if (typeof new nodeBlob([]).arrayBuffer !== "function") return;
  const jsdomBlobProto = (
    jsdomWindow["Blob"] as { prototype?: Record<string, unknown> } | undefined
  )?.prototype;
  if (typeof jsdomBlobProto?.["arrayBuffer"] === "function") return;
  Object.defineProperty(jsdomWindow, "Blob", {
    configurable: true,
    writable: true,
    value: nodeBlob,
  });
}

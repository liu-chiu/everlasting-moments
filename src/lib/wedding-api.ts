// Talks to the couple's existing Google Sheets (Apps Script) backend, browser-only.
import { API_URL } from "./wedding";

export type Wish = { id?: string; name: string; wish: string; timestamp?: string };

function jsonp<T>(params: Record<string, string>, timeout = 10000): Promise<T> {
  return new Promise((resolve, reject) => {
    const cb = `lc_cb_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const w = window as unknown as Record<string, unknown>;
    const timer = window.setTimeout(() => finish(new Error("timeout")), timeout);
    function finish(err: Error | null, data?: T) {
      window.clearTimeout(timer);
      delete w[cb];
      script.remove();
      if (err) reject(err);
      else resolve(data as T);
    }
    w[cb] = (data: T) => finish(null, data);
    script.onerror = () => finish(new Error("network"));
    script.src = `${API_URL}?${new URLSearchParams({ ...params, callback: cb })}`;
    document.head.appendChild(script);
  });
}

export async function checkHealth(): Promise<boolean> {
  const res = await jsonp<{ ok?: boolean }>({ action: "health" });
  return !!res?.ok;
}

export async function fetchWishes(): Promise<Wish[]> {
  const res = await jsonp<{ ok: boolean; wishes?: Wish[] }>({ action: "wishes" });
  return res?.ok && Array.isArray(res.wishes) ? res.wishes : [];
}

function submissionId() {
  const r = (crypto.getRandomValues(new Uint32Array(1))[0] ?? 0).toString(36);
  return `lc_${Date.now().toString(36)}_${r}`;
}

/** Posts a row then polls until the sheet confirms it was saved. */
export async function submitAndVerify(payload: Record<string, string>) {
  const id = submissionId();
  await fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ ...payload, id }),
  });
  for (const delay of [300, 700, 1200, 2000]) {
    await new Promise((r) => setTimeout(r, delay));
    try {
      const res = await jsonp<{ saved?: boolean }>({ action: "status", id, type: payload["type"] ?? "" }, 3000);
      if (res?.saved) return id;
    } catch {
      /* retry */
    }
  }
  throw new Error("not-verified");
}

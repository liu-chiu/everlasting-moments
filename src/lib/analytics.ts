// Google Analytics 4 (same property as the original site). Loaded after idle so it never slows first paint.
import { GA_MEASUREMENT_ID } from "./wedding";

type Gtag = (...args: unknown[]) => void;
type W = Window & { dataLayer?: unknown[]; gtag?: Gtag };

let started = false;

export function initAnalytics(guest: string) {
  if (started || typeof window === "undefined" || !GA_MEASUREMENT_ID) return;
  started = true;
  const w = window as W;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    guest_name: guest || "(none)",
    debug_mode: /[?&]debug=1/.test(window.location.search) || undefined,
  });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(s);
}

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  (window as W).gtag?.("event", event, params);
}

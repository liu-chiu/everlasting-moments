// Google Tag Manager container GTM-TDDBVZVC. The GTM snippet is installed in
// src/routes/__root.tsx (__root head + noscript). Events below are pushed to
// window.dataLayer so tags (incl. GA4) configured in the container can fire.
import { GTM_CONTAINER_ID } from "./wedding";

type W = Window & { dataLayer?: unknown[] };

let started = false;

export function initAnalytics(guest: string) {
  if (started || typeof window === "undefined") return;
  started = true;
  const w = window as W;
  w.dataLayer = w.dataLayer || [];
  // Identify the guest so GTM/GA4 can segment reports by guest name.
  w.dataLayer.push({
    event: "guest_identified",
    guest_name: guest || "(none)",
    gtm_container: GTM_CONTAINER_ID,
  });
}

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  (window as W).dataLayer?.push({ event, ...params });
}

import { describe, expect, it } from "vitest";
import { GALLERY_AUTOPLAY_MS, shouldAutoAdvance } from "./gallery-autoplay";

const calm: Parameters<typeof shouldAutoAdvance>[0] = {
  enabled: true,
  lightboxOpen: false,
  dragging: false,
  hovered: false,
  focused: false,
  pageHidden: false,
  inView: true,
};

describe("gallery autoplay", () => {
  it("waits just over four seconds on each photo", () => {
    expect(GALLERY_AUTOPLAY_MS).toBe(4500);
  });

  it("advances while the guest is simply watching", () => {
    expect(shouldAutoAdvance(calm)).toBe(true);
  });

  it("stops when the guest turns autoplay off", () => {
    expect(shouldAutoAdvance({ ...calm, enabled: false })).toBe(false);
  });

  it("stops while a photo is open, being dragged, hovered or focused", () => {
    expect(shouldAutoAdvance({ ...calm, lightboxOpen: true })).toBe(false);
    expect(shouldAutoAdvance({ ...calm, dragging: true })).toBe(false);
    expect(shouldAutoAdvance({ ...calm, hovered: true })).toBe(false);
    expect(shouldAutoAdvance({ ...calm, focused: true })).toBe(false);
  });

  it("stops when the tab is hidden or the album is scrolled away", () => {
    expect(shouldAutoAdvance({ ...calm, pageHidden: true })).toBe(false);
    expect(shouldAutoAdvance({ ...calm, inView: false })).toBe(false);
  });
});

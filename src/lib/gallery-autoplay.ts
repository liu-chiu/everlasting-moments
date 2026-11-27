/** How long a photo stays centred before the album slides to the next one. */
export const GALLERY_AUTOPLAY_MS = 4500;

export type AutoplaySignals = {
  /** The guest's own play/pause choice. */
  enabled: boolean;
  /** A photo is open in the full-screen viewer. */
  lightboxOpen: boolean;
  /** A finger or mouse is dragging the album. */
  dragging: boolean;
  /** The mouse is resting over the album. */
  hovered: boolean;
  /** Keyboard focus is inside the album. */
  focused: boolean;
  /** The browser tab is in the background. */
  pageHidden: boolean;
  /** The album is scrolled into view. */
  inView: boolean;
};

/**
 * The album only advances on its own while the guest is actually looking at it
 * and has not taken over. An explicit play choice always wins over any
 * environment signal — reduced motion only changes the starting choice.
 */
export function shouldAutoAdvance(s: AutoplaySignals): boolean {
  return (
    s.enabled &&
    !s.lightboxOpen &&
    !s.dragging &&
    !s.hovered &&
    !s.focused &&
    !s.pageHidden &&
    s.inView
  );
}

import { describe, expect, it } from "vitest";
import { INVITATION_AUTO_OPEN_MS, shuffledTracks } from "./music-playback";

describe("invitation music", () => {
  it("automatically opens five seconds after arrival", () => {
    expect(INVITATION_AUTO_OPEN_MS).toBe(5000);
  });

  it("changes to a different song on opening", () => {
    for (let current = 0; current < 4; current++) {
      const queue = shuffledTracks(4, current, () => 0.5);
      expect(queue).toHaveLength(3);
      expect(queue).not.toContain(current);
      expect(new Set(queue).size).toBe(3);
    }
  });

  it("shuffles rather than always following the playlist order", () => {
    expect(shuffledTracks(4, 0, () => 0)).toEqual([2, 3, 1]);
    expect(shuffledTracks(4, 0, () => 0.99)).toEqual([1, 2, 3]);
  });
});
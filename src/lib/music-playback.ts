export const INVITATION_AUTO_OPEN_MS = 5000;

/** Shuffle the remaining songs without repeating the currently playing song. */
export function shuffledTracks(count: number, current: number, random = Math.random): number[] {
  const tracks = Array.from({ length: count }, (_, index) => index).filter(
    (index) => index !== current,
  );
  for (let index = tracks.length - 1; index > 0; index--) {
    const swap = Math.floor(random() * (index + 1));
    const left = tracks[index];
    const right = tracks[swap];
    if (left === undefined || right === undefined) continue;
    tracks[index] = right;
    tracks[swap] = left;
  }
  return tracks;
}

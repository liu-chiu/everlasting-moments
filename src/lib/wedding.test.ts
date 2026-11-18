import { describe, expect, it } from "vitest";
import {
  buildGuestLink,
  EVENTS,
  eventsForSide,
  getCountdown,
  monthGrid,
  normalizeGuestName,
  normalizeSide,
  WEDDING_DATE,
} from "./wedding";

describe("wedding rules", () => {
  it("wedding day is Saturday 12 Dec 2026, 10:30 Vietnam time", () => {
    expect(WEDDING_DATE.toISOString()).toBe("2026-12-12T03:30:00.000Z");
  });

  it("bride's party is 10:30 and groom's party is 16:30", () => {
    expect(EVENTS.find((e) => e.side === "bride")?.time).toBe("10:30");
    expect(EVENTS.find((e) => e.side === "groom")?.time).toBe("16:30");
  });

  it("a guest invited to one side sees only that party", () => {
    expect(eventsForSide("groom").map((e) => e.side)).toEqual(["groom"]);
    expect(eventsForSide(undefined)).toHaveLength(2);
  });

  it("cleans the guest name from the link", () => {
    expect(normalizeGuestName("  chị   Phương ")).toBe("chị Phương");
    expect(normalizeGuestName(undefined)).toBe("");
    expect(normalizeSide("hacker")).toBeUndefined();
  });

  it("builds a personal guest link", () => {
    expect(buildGuestLink("https://x.dev/", "chị Phương", "bride")).toBe(
      "https://x.dev/?to=ch%E1%BB%8B+Ph%C6%B0%C6%A1ng&side=bride",
    );
  });

  it("counts down to the wedding and stops at zero", () => {
    const c = getCountdown(WEDDING_DATE, new Date("2026-12-11T02:29:59Z"));
    expect(c).toMatchObject({ days: 1, hours: 1, minutes: 0, seconds: 1, done: false });
    expect(getCountdown(WEDDING_DATE, new Date("2027-01-01")).done).toBe(true);
  });

  it("December 2026 starts on a Tuesday in a Monday-first calendar", () => {
    const grid = monthGrid(2026, 11);
    expect(grid.indexOf(1)).toBe(1);
    expect(grid.indexOf(12) % 7).toBe(5); // Saturday column
  });
});

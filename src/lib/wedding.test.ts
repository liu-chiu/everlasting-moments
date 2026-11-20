import { describe, expect, it } from "vitest";
import {
  buildGuestLink,
  buildIcs,
  confirmationFor,
  defaultTransportFor,
  EVENTS,
  eventsForSide,
  getCountdown,
  monthGrid,
  normalizeGuestName,
  normalizeSide,
  outlookCalendarUrl,
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
      "https://x.dev/?to=chị+Phương&side=bride",
    );
  });

  it("keeps the guest name in links sent from the invitation domain", () => {
    const url = new URL(buildGuestLink("https://lan-chung-invitation.lovable.app/", "  chị   Phương ", "groom"));
    expect(url.origin).toBe("https://lan-chung-invitation.lovable.app");
    expect(normalizeGuestName(url.searchParams.get("to"))).toBe("chị Phương");
    expect(normalizeSide(url.searchParams.get("side"))).toBe("groom");
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

  it("guests who decline get the thank-you message and no travel cards", () => {
    const c = confirmationFor("Không thể tham dự", "");
    expect(c.title).toBe("Cảm ơn bạn đã phản hồi");
    expect(c.cards).toHaveLength(0);
  });

  it("guests on the bride's bus see the 7:00 pickup at Giang Văn Minh", () => {
    const c = confirmationFor("Sẽ tham dự", "Đi cùng xe đoàn về nhà gái");
    expect(c.title).toBe("Cảm ơn bạn sẽ đến chung vui");
    expect(c.cards[0]?.title).toBe("Thông tin di chuyển về nhà gái");
    expect(c.cards[0]?.items[0]?.[1]).toBe("7:00 sáng ngày 12/12/2026");
  });

  it("guests on the groom's bus see the 15:00 pickup at Cát Linh", () => {
    const c = confirmationFor("Sẽ tham dự", "Đi cùng xe đoàn về nhà trai");
    expect(c.cards[0]?.items[1]?.[1]).toBe("11 A Cát Linh, Ô Chợ Dừa, Hà Nội");
  });

  it("guests travelling on their own see contacts and both parties", () => {
    const c = confirmationFor("Sẽ tham dự", "Tự di chuyển");
    expect(c.title).toBe("Hẹn gặp bạn trong ngày vui");
    expect(c.cards.map((x) => x.title)).toEqual(["Liên hệ cô dâu & chú rể", "Tiệc nhà gái", "Tiệc nhà trai"]);
  });

  it("attending guests default to the groom's bus only for the groom's party", () => {
    expect(defaultTransportFor("Tiệc nhà trai")).toBe("Đi cùng xe đoàn về nhà trai");
    expect(defaultTransportFor("Cả hai buổi tiệc")).toBe("Đi cùng xe đoàn về nhà gái");
  });

  it("calendar file starts at 10:30 Vietnam time for the bride's party", () => {
    expect(buildIcs(EVENTS[0]!)).toContain("DTSTART:20261212T033000Z");
    expect(buildIcs(EVENTS[1]!)).toContain("DTSTART:20261212T093000Z");
  });

  it("Outlook opens the native event composer with the groom's 16:30 Vietnam start", () => {
    const url = new URL(outlookCalendarUrl(EVENTS[1]!));
    expect(url.origin + url.pathname).toBe("https://outlook.live.com/calendar/0/deeplink/compose");
    expect(url.searchParams.get("rru")).toBe("addevent");
    expect(url.searchParams.get("startdt")).toBe("2026-12-12T16:30:00+07:00");
    expect(url.searchParams.get("enddt")).toBe("2026-12-12T20:00:00+07:00");
  });
});

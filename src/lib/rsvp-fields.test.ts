import { describe, expect, it } from "vitest";
import { rsvpFieldsFor } from "./rsvp-fields";

describe("RSVP attendance fields", () => {
  it("hides the event when the guest cannot attend", () => {
    expect(rsvpFieldsFor("Không thể tham dự").event).toBe(false);
    expect(rsvpFieldsFor("Sẽ tham dự").event).toBe(true);
    expect(rsvpFieldsFor("").event).toBe(true);
  });
  it("hides special notes when the guest cannot attend", () => {
    expect(rsvpFieldsFor("Không thể tham dự").notes).toBe(false);
    expect(rsvpFieldsFor("Sẽ tham dự").notes).toBe(true);
    expect(rsvpFieldsFor("").notes).toBe(true);
  });
  it("hides guest count and phone when the guest cannot attend", () => {
    const fields = rsvpFieldsFor("Không thể tham dự");
    expect(fields.guests).toBe(false);
    expect(fields.phone).toBe(false);
    expect(fields.declinedMessage).toBe(true);
    expect(rsvpFieldsFor("Sẽ tham dự")).toMatchObject({
      guests: true,
      phone: true,
      declinedMessage: false,
    });
    expect(rsvpFieldsFor("")).toMatchObject({ guests: true, phone: true, declinedMessage: false });
  });
});

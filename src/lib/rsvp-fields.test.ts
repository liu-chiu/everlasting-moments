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
});
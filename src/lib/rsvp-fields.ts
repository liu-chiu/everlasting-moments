/** Attendance-specific fields; undecided guests can still see the event and notes. */
export function rsvpFieldsFor(attendance: string) {
  const declined = attendance === "Không thể tham dự";
  return {
    event: !declined,
    notes: !declined,
    guests: !declined,
    phone: !declined,
    declinedMessage: declined,
  };
}

/** The existing Google Sheet requires a guest count from 1–20 for every RSVP. */
export function guestCountForSubmission(attendance: string, guests: string) {
  return attendance === "Không thể tham dự" ? "1" : guests;
}

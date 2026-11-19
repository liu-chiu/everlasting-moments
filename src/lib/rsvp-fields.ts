/** Attendance-specific fields; undecided guests can still see the event and notes. */
export function rsvpFieldsFor(attendance: string) {
  const declined = attendance === "Không thể tham dự";
  return { event: !declined, notes: !declined };
}
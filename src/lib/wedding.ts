// All invitation content lives here so details can be updated in one place.

export type Side = "bride" | "groom";

export const SITE_URL = "https://liu-chiu.github.io/LanChung-wedding/";
export const OG_IMAGE = "https://liu-chiu.github.io/LanChung-wedding/assets/images/11-preview.jpg";
export const API_URL =
  "https://script.google.com/macros/s/AKfycbzzSe6UJWm-wCwzQmeHksnWv4UEM6qaXWt4ulHUhwYDvTj1tIBfe4kD9G8I02XqYmxfKA/exec";

export const COUPLE = {
  bride: {
    display: "Ngọc Lan",
    full: "Bùi Ngọc Lan",
    role: "Thứ nữ",
    phone: "0325022345",
  },
  groom: {
    display: "Văn Chung",
    full: "Nguyễn Văn Chung",
    role: "Út nam",
    phone: "0376147556",
  },
};

/** Full guest-facing label, shared by every section, calendar and confirmation. */
export const COUPLE_SHORT_LABEL = `${COUPLE.bride.display} & ${COUPLE.groom.display}`;
export const COUPLE_DISPLAY_NAMES = `${COUPLE.bride.display} và ${COUPLE.groom.display}`;

/** Wedding day, Vietnam time (UTC+7). Countdown targets the first party. */
export const WEDDING_DATE = new Date("2026-12-12T10:30:00+07:00");
export const WEDDING_DATE_LABEL = "12.12.2026";
export const WEDDING_WEEKDAY = "Thứ Bảy";
export const RSVP_DEADLINE_LABEL = "05/12/2026";

export type WeddingEvent = {
  side: Side;
  index: string;
  label: string;
  venue: string;
  venueLine2?: string;
  time: string;
  start: string; // ISO with offset
  end: string;
  placeTitle: string;
  address: string;
  mapQuery: string;
  mapDirections: string;
};

export const EVENTS: WeddingEvent[] = [
  {
    side: "bride",
    index: "01",
    label: "Tiệc nhà gái",
    venue: "Seabay",
    venueLine2: "Hạ Long",
    time: "10:30",
    start: "2026-12-12T10:30:00+07:00",
    end: "2026-12-12T13:30:00+07:00",
    placeTitle: "Ô số H32",
    address: "Khu đô thị dịch vụ Hùng Thắng, phường Bãi Cháy, Hạ Long",
    mapQuery: "X232+7MW, Bãi Cháy, Quảng Ninh",
    mapDirections:
      "https://www.google.com/maps/dir/?api=1&destination=X232%2B7MW%2C+B%C3%A3i+Ch%C3%A1y%2C+Qu%E1%BA%A3ng+Ninh",
  },
  {
    side: "groom",
    index: "02",
    label: "Tiệc nhà trai",
    venue: "Tư gia",
    venueLine2: "nhà Trai",
    time: "16:30",
    start: "2026-12-12T16:30:00+07:00",
    end: "2026-12-12T20:00:00+07:00",
    placeTitle: "Tại tư gia",
    address: "Số 8, ngõ 3, đường Văn Hoá, Khối 8 (Xóm Đồng), Sóc Sơn, Hà Nội",
    mapQuery: "21.195472,105.849139",
    mapDirections: "https://www.google.com/maps/dir/?api=1&destination=21.195472%2C105.849139",
  },
];

export const FAMILIES = {
  bride: { title: "Nhà gái", father: "Bùi Văn Thái", mother: "Nguyễn Thị Hà" },
  groom: { title: "Nhà trai", father: "Nguyễn Văn Năng", mother: "Nguyễn Thị Cầm" },
};

export const STORY = [
  {
    no: "01",
    year: "2022",
    title: "Lần đầu gặp gỡ",
    lead: "Có lẽ duyên phận bắt đầu từ những điều giản dị nhất.",
    body: "Từ ngày cùng làm việc tại một công ty, chúng mình quen biết, trở thành bạn bè và bắt đầu một câu chuyện mà khi ấy, chẳng ai ngờ sẽ đặc biệt đến vậy.",
    image: "/images/gallery/2-sm.webp",
  },
  {
    no: "02",
    year: "2026",
    title: "Ngày mình có nhau",
    lead: "Từ tình bạn, chúng mình trở thành người thương.",
    body: "Từ những câu chuyện nhỏ, những lần gặp gỡ và những chuyến đi, chúng mình dần tìm thấy sự đồng điệu — cùng sẻ chia, trưởng thành và trở thành một phần trong cuộc sống của nhau.",
    image: "/images/gallery/7-sm.webp",
  },
  {
    no: "03",
    year: "12.12.2026",
    title: "Lời hẹn trọn đời",
    lead: "Tình yêu viết tiếp chương mới — mang tên Gia đình.",
    body: "Sau những tháng ngày yêu thương và đồng hành, chúng mình chọn nắm tay nhau đi hết chặng đường phía trước.",
    image: "/images/gallery/17-sm.webp",
  },
];

export const GALLERY = Array.from({ length: 20 }, (_, i) => {
  const n = i + 1;
  return {
    id: n,
    thumb: `/images/gallery/${n}-sm.webp`,
    full: `/images/gallery/${n}.webp`,
    landscape: false,
    alt: `Khoảnh khắc cưới ${COUPLE_SHORT_LABEL} ${n}`,
  };
});

const AUDIO_BASE = "https://liu-chiu.github.io/LanChung-wedding/assets/audio/";
export const PLAYLIST = [
  { title: "Beautiful In White", src: AUDIO_BASE + encodeURIComponent("Beautiful In White.mp3") },
  {
    title: "Hoa và Váy (RnB ver)",
    src: AUDIO_BASE + encodeURIComponent("Hoa và Váy (RnB ver).mp3"),
  },
  { title: "Hơn Cả Yêu", src: AUDIO_BASE + encodeURIComponent("Hon-Ca-Yeu-Duc-Phuc.mp3") },
  { title: "Thế Giới Của Anh", src: AUDIO_BASE + encodeURIComponent("THẾ GIỚI CỦA ANH.mp3") },
];

export const GIFTS = [
  {
    side: "bride" as Side,
    label: "Mừng cưới cô dâu",
    bank: "Techcombank",
    bankCode: "TCB",
    holder: "BUI NGOC LAN",
    account: "19037213961014",
  },
  {
    side: "groom" as Side,
    label: "Mừng cưới chú rể",
    bank: "Techcombank",
    bankCode: "TCB",
    holder: "NGUYEN VAN CHUNG",
    account: "19031119300014",
  },
];

export const GA_MEASUREMENT_ID = "G-WWTQ09Y9DT";

/** Google Tag Manager container. GA4 property (G-WWTQ09Y9DT) is managed inside this container. */
export const GTM_CONTAINER_ID = "GTM-TDDBVZVC";

/* ---- RSVP confirmation content (kept word-for-word with the original site) ---- */
export type InfoRow = [label: string, value: string, type?: "phone"];
export type InfoCard = { title: string; items: InfoRow[] };

export const TRAVEL: Record<Side, InfoCard> = {
  bride: {
    title: "Thông tin di chuyển về nhà gái",
    items: [
      ["Thời gian đoàn di chuyển", "7:00 sáng ngày 12/12/2026"],
      ["Địa điểm đón khách", "Ngõ 36 Giang Văn Minh, Phường Kim Mã, Hà Nội"],
      ["Trưởng đoàn", "Updating"],
      ["Số điện thoại trưởng đoàn", "Updating", "phone"],
      ["Cô dâu", COUPLE.bride.display],
      ["Số điện thoại cô dâu", "0325022345", "phone"],
    ],
  },
  groom: {
    title: "Thông tin di chuyển về nhà trai",
    items: [
      ["Thời gian đoàn di chuyển", "15:00 chiều ngày 12/12/2026"],
      ["Địa điểm đón khách", "11 A Cát Linh, Ô Chợ Dừa, Hà Nội"],
      ["Trưởng đoàn", "Updating"],
      ["Số điện thoại trưởng đoàn", "Updating", "phone"],
      ["Chú rể", COUPLE.groom.display],
      ["Số điện thoại chú rể", "0376147556", "phone"],
    ],
  },
};

export const SELF_TRAVEL_CARDS: InfoCard[] = [
  {
    title: "Liên hệ cô dâu & chú rể",
    items: [
      ["Cô dâu", COUPLE.bride.display],
      ["Số điện thoại cô dâu", "0325022345", "phone"],
      ["Chú rể", COUPLE.groom.display],
      ["Số điện thoại chú rể", "0376147556", "phone"],
    ],
  },
  {
    title: "Tiệc nhà gái",
    items: [
      ["Thời gian", "10:30, Thứ Bảy 12/12/2026"],
      ["Địa điểm", "Tư gia nhà gái"],
      ["Địa chỉ", "Ô Số H32, Khu đô thị dịch vụ Hùng Thắng, Phường Bãi Cháy, Hạ Long"],
    ],
  },
  {
    title: "Tiệc nhà trai",
    items: [
      ["Thời gian", "17:00, Thứ Bảy 12/12/2026"],
      ["Địa điểm", "Tư gia nhà trai"],
      ["Địa chỉ", "Số 8, ngõ 3, đường Văn Hoá, Khối 8 (Xóm Đồng), Sóc Sơn, Hà Nội"],
    ],
  },
];

export const RSVP_TEXT = {
  sending: "Đang gửi xác nhận…",
  success: "Đã gửi xác nhận thành công. Cảm ơn bạn!",
  error: "Chưa gửi được xác nhận. Vui lòng đóng cửa sổ này và thử gửi lại.",
  formSending: `Cảm ơn bạn, tụi mình đang gửi phản hồi đến ${COUPLE_SHORT_LABEL} nhé…`,
  formError: `Tụi mình chưa nhận được xác nhận gửi thành công. Bạn thử lại sau hoặc nhắn trực tiếp cho ${COUPLE_SHORT_LABEL} nhé.`,
  declineTitle: "Cảm ơn bạn đã phản hồi",
  declineBody: `${COUPLE_SHORT_LABEL} rất tiếc vì chưa thể đón bạn trong ngày vui. Cảm ơn bạn đã gửi lời chúc và luôn yêu thương, đồng hành cùng chúng mình. Hẹn gặp bạn trong dịp gần nhất nhé!`,
  busTitle: "Cảm ơn bạn sẽ đến chung vui",
  selfTitle: "Hẹn gặp bạn trong ngày vui",
  selfBody:
    "Cảm ơn bạn đã xác nhận tham dự. Chúc bạn di chuyển an toàn và hẹn gặp bạn tại buổi tiệc nhé!",
  scheduleTitle: "Lịch trình di chuyển",
};

/** Which confirmation the guest sees after sending the RSVP (mirrors the original site). */
export function confirmationFor(attendance: string, transportation: string) {
  if (attendance === "Không thể tham dự")
    return { title: RSVP_TEXT.declineTitle, body: RSVP_TEXT.declineBody, cards: [] as InfoCard[] };
  if (transportation === TRANSPORT_OPTIONS.bride)
    return { title: RSVP_TEXT.busTitle, body: "", cards: [TRAVEL.bride] };
  if (transportation === TRANSPORT_OPTIONS.groom)
    return { title: RSVP_TEXT.busTitle, body: "", cards: [TRAVEL.groom] };
  return { title: RSVP_TEXT.selfTitle, body: RSVP_TEXT.selfBody, cards: SELF_TRAVEL_CARDS };
}

/** Default bus when a guest says they will attend: groom's bus only for the groom's party. */
export function defaultTransportFor(event: string) {
  return event === "Tiệc nhà trai" ? TRANSPORT_OPTIONS.groom : TRANSPORT_OPTIONS.bride;
}

export const TRANSPORT_OPTIONS = {
  self: "Tự di chuyển",
  bride: "Đi cùng xe đoàn về nhà gái",
  groom: "Đi cùng xe đoàn về nhà trai",
} as const;

export const EVENT_OPTIONS = {
  bride: "Tiệc nhà gái",
  groom: "Tiệc nhà trai",
  both: "Cả hai buổi tiệc",
} as const;

/* ---------------- helpers (pure, unit-tested) ---------------- */

/** Cleans the ?to= guest name: trims, collapses spaces, caps length. */
export function normalizeGuestName(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw.replace(/\s+/g, " ").trim().slice(0, 60);
}

export function normalizeSide(raw: unknown): Side | undefined {
  return raw === "bride" || raw === "groom" ? raw : undefined;
}

/** A guest invited to one side only sees that party; otherwise both. */
export function eventsForSide(side?: Side): WeddingEvent[] {
  return side ? EVENTS.filter((e) => e.side === side) : EVENTS;
}

export function getCountdown(target: Date, now: Date) {
  const diff = Math.max(0, target.getTime() - now.getTime());
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: diff === 0,
  };
}

function toGCalStamp(iso: string) {
  return new Date(iso)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

export function googleCalendarUrl(e: WeddingEvent) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Đám cưới ${COUPLE_SHORT_LABEL} · ${e.label}`,
    dates: `${toGCalStamp(e.start)}/${toGCalStamp(e.end)}`,
    details: `${COUPLE_SHORT_LABEL} trân trọng kính mời bạn đến chung vui.`,
    location: `${e.placeTitle}, ${e.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Outlook's native add-event composer; Apple uses the ICS file below. */
export function outlookCalendarUrl(e: WeddingEvent) {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: `Đám cưới ${COUPLE_SHORT_LABEL} · ${e.label}`,
    startdt: e.start,
    enddt: e.end,
    body: `${COUPLE_SHORT_LABEL} trân trọng kính mời bạn đến chung vui.`,
    location: `${e.placeTitle}, ${e.address}`,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function vietQrUrl(bankCode: string, account: string, holder: string, guest: string) {
  const info = `${guest ? guest + " - " : ""}Mung cuoi Ngoc Lan Van Chung`;
  const params = new URLSearchParams({ addInfo: info, accountName: holder });
  return `https://img.vietqr.io/image/${bankCode}-${account}-compact2.png?${params.toString()}`;
}

export function buildGuestLink(base: string, name: string, side?: Side) {
  const url = new URL(base);
  const clean = normalizeGuestName(name);
  if (clean) url.searchParams.set("to", clean);
  if (side) url.searchParams.set("side", side);
  // Keep UTF-8 characters readable when guests copy and share the link.
  // Reserved ASCII characters stay escaped, so the query remains unambiguous.
  return url.toString().replace(/(?:%[89a-f][0-9a-f])+/gi, (encoded) => {
    try {
      return decodeURIComponent(encoded);
    } catch {
      return encoded;
    }
  });
}

/** Monday-first grid of a month; null = padding cell. */
export function monthGrid(year: number, monthIndex: number): (number | null)[] {
  const first = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay(); // 0 = Sun
  const offset = (first + 6) % 7;
  const days = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const cells: (number | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  return cells;
}

function icsStamp(iso: string) {
  return new Date(iso)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

/** iCalendar file for Apple Calendar / Outlook users. */
export function buildIcs(e: WeddingEvent) {
  const esc = (t: string) => t.replace(/([,;\\])/g, "\\$1");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ngoc Lan Van Chung Wedding//VI",
    "BEGIN:VEVENT",
    `UID:lanchung-${e.side}-20261212@wedding`,
    `DTSTAMP:${icsStamp("2026-01-01T00:00:00Z")}`,
    `DTSTART:${icsStamp(e.start)}`,
    `DTEND:${icsStamp(e.end)}`,
    `SUMMARY:${esc(`Đám cưới ${COUPLE_SHORT_LABEL} · ${e.label}`)}`,
    `LOCATION:${esc(`${e.placeTitle}, ${e.address}`)}`,
    `DESCRIPTION:${COUPLE_SHORT_LABEL} trân trọng kính mời bạn đến chung vui.`,
    "BEGIN:VALARM",
    "TRIGGER:-PT3H",
    "ACTION:DISPLAY",
    `DESCRIPTION:Đám cưới ${COUPLE_SHORT_LABEL}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

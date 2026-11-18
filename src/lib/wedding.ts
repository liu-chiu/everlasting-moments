// All invitation content lives here so details can be updated in one place.

export type Side = "bride" | "groom";

export const SITE_URL = "https://liu-chiu.github.io/LanChung-wedding/";
export const OG_IMAGE = "https://liu-chiu.github.io/LanChung-wedding/assets/images/11-preview.jpg";
export const API_URL =
  "https://script.google.com/macros/s/AKfycbzzSe6UJWm-wCwzQmeHksnWv4UEM6qaXWt4ulHUhwYDvTj1tIBfe4kD9G8I02XqYmxfKA/exec";

export const COUPLE = {
  bride: {
    short: "Lan",
    display: "Ngọc Lan",
    full: "Bùi Ngọc Lan",
    role: "Thứ nữ",
    phone: "0325022345",
  },
  groom: {
    short: "Chung",
    display: "Văn Chung",
    full: "Nguyễn Văn Chung",
    role: "Út nam",
    phone: "0376147556",
  },
};

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
    venueLine2: "nhà trai",
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
    landscape: n === 7,
    alt: `Khoảnh khắc cưới Lan và Chung ${n}`,
  };
});

const AUDIO_BASE = "https://liu-chiu.github.io/LanChung-wedding/assets/audio/";
export const PLAYLIST = [
  { title: "Beautiful In White", src: AUDIO_BASE + encodeURIComponent("Beautiful In White.mp3") },
  { title: "Hoa và Váy (RnB ver)", src: AUDIO_BASE + encodeURIComponent("Hoa và Váy (RnB ver).mp3") },
  { title: "Hơn Cả Yêu", src: AUDIO_BASE + encodeURIComponent("Hon-Ca-Yeu-Duc-Phuc.mp3") },
  { title: "Thế Giới Của Anh", src: AUDIO_BASE + encodeURIComponent("THẾ GIỚI CỦA ANH.mp3") },
];

export const GIFTS = [
  { side: "bride" as Side, label: "Mừng cưới cô dâu", bank: "Techcombank", bankCode: "TCB", holder: "BUI NGOC LAN", account: "19037213961014" },
  { side: "groom" as Side, label: "Mừng cưới chú rể", bank: "Techcombank", bankCode: "TCB", holder: "NGUYEN VAN CHUNG", account: "19031119300014" },
];

export const TRAVEL: Record<Side, { title: string; items: [string, string, "phone"?][] }> = {
  bride: {
    title: "Xe đoàn về nhà gái",
    items: [
      ["Khởi hành", "7:00 sáng 12/12/2026"],
      ["Điểm đón", "Ngõ 36 Giang Văn Minh, phường Kim Mã, Hà Nội"],
      ["Trưởng đoàn", "Đang cập nhật"],
      ["Cô dâu Ngọc Lan", "0325022345", "phone"],
    ],
  },
  groom: {
    title: "Xe đoàn về nhà trai",
    items: [
      ["Khởi hành", "15:00 chiều 12/12/2026"],
      ["Điểm đón", "11A Cát Linh, Ô Chợ Dừa, Hà Nội"],
      ["Trưởng đoàn", "Đang cập nhật"],
      ["Chú rể Văn Chung", "0376147556", "phone"],
    ],
  },
};

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
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function googleCalendarUrl(e: WeddingEvent) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Đám cưới Lan & Chung · ${e.label}`,
    dates: `${toGCalStamp(e.start)}/${toGCalStamp(e.end)}`,
    details: "Lan & Chung trân trọng kính mời bạn đến chung vui.",
    location: `${e.placeTitle}, ${e.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function vietQrUrl(bankCode: string, account: string, holder: string, guest: string) {
  const info = `${guest ? guest + " - " : ""}Mung cuoi Lan Chung`;
  const params = new URLSearchParams({ addInfo: info, accountName: holder });
  return `https://img.vietqr.io/image/${bankCode}-${account}-compact2.png?${params.toString()}`;
}

export function buildGuestLink(base: string, name: string, side?: Side) {
  const url = new URL(base);
  const clean = normalizeGuestName(name);
  if (clean) url.searchParams.set("to", clean);
  if (side) url.searchParams.set("side", side);
  return url.toString();
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

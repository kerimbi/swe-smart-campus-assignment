export type AvailabilityStatus = "available" | "unavailable" | "invalid";

export interface AvailabilityResult {
  status: AvailabilityStatus;
  message: string;
}

export interface AvailabilityConfig {
  now: number;
  blocked: boolean;
  bookings: [number, number][];
}

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const INTEGER_RE = /^-?\d+$/;

export function checkAvailability(
  startInput: string,
  endInput: string,
  config: AvailabilityConfig
): AvailabilityResult {
  const { now, blocked, bookings } = config;

  const startTrim = startInput.trim();
  const endTrim = endInput.trim();

  if (startTrim === "" || endTrim === "") {
    return { status: "invalid", message: "Please enter both start and end times." };
  }

  if (!INTEGER_RE.test(startTrim) || !INTEGER_RE.test(endTrim)) {
    return { status: "invalid", message: "Start and end must be whole numbers (minutes after midnight)." };
  }

  const start = parseInt(startTrim, 10);
  const end = parseInt(endTrim, 10);

  if (start >= end) {
    return { status: "invalid", message: "Start time must be earlier than end time." };
  }

  if (start < 0 || end > 1440) {
    return { status: "invalid", message: "Times must be between 0 and 1440 minutes (00:00–24:00)." };
  }

  if (start <= now) {
    return {
      status: "invalid",
      message: `Start time must be after the current time (${formatTime(now)}).`,
    };
  }

  if (end - start > 120) {
    return { status: "invalid", message: "Duration must not exceed 120 minutes." };
  }

  if (blocked) {
    return { status: "unavailable", message: "Room 301 is blocked and unavailable." };
  }

  for (const [bStart, bEnd] of bookings) {
    if (start < bEnd && bStart < end) {
      return {
        status: "unavailable",
        message: `Overlaps existing booking ${formatTime(bStart)}–${formatTime(bEnd)}.`,
      };
    }
  }

  return { status: "available", message: "Room 301 is available for the requested time." };
}

export type AvailabilityStatus = "available" | "unavailable" | "invalid";

export interface AvailabilityResult {
  status: AvailabilityStatus;
  message: string;
}

export interface AvailabilityConfig {
  now: number;
  blocked: boolean;
  bookings: [number, number][];
  roomName?: string;
}

export const MAX_DURATION_MINUTES = 120;
export const MINUTES_PER_DAY = 1440;
const DEFAULT_ROOM_NAME = "This room";
const INTEGER_RE = /^-?\d+$/;

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function makeResult(status: AvailabilityStatus, message: string): AvailabilityResult {
  return { status, message };
}

type ParsedTimes =
  | { ok: true; start: number; end: number }
  | { ok: false; result: AvailabilityResult };

function fail(message: string): ParsedTimes {
  return { ok: false, result: makeResult("invalid", message) };
}

function parseAndValidate(startInput: string, endInput: string, now: number): ParsedTimes {
  const startTrim = startInput.trim();
  const endTrim = endInput.trim();

  if (startTrim === "" || endTrim === "") {
    return fail("Please enter both start and end times.");
  }
  if (!INTEGER_RE.test(startTrim) || !INTEGER_RE.test(endTrim)) {
    return fail("Start and end must be whole numbers (minutes after midnight).");
  }

  const start = parseInt(startTrim, 10);
  const end = parseInt(endTrim, 10);

  if (start >= end) {
    return fail("Start time must be earlier than end time.");
  }
  if (start < 0 || end > MINUTES_PER_DAY) {
    return fail(`Times must be between 0 and ${MINUTES_PER_DAY} minutes (00:00–24:00).`);
  }
  if (start <= now) {
    return fail(`Start time must be after the current time (${formatTime(now)}).`);
  }
  if (end - start > MAX_DURATION_MINUTES) {
    return fail(`Duration must not exceed ${MAX_DURATION_MINUTES} minutes.`);
  }
  return { ok: true, start, end };
}

function findOverlap(
  start: number,
  end: number,
  bookings: [number, number][]
): [number, number] | undefined {
  return bookings.find(([bStart, bEnd]) => start < bEnd && bStart < end);
}

export function checkAvailability(
  startInput: string,
  endInput: string,
  config: AvailabilityConfig
): AvailabilityResult {
  const { now, blocked, bookings, roomName = DEFAULT_ROOM_NAME } = config;

  const parsed = parseAndValidate(startInput, endInput, now);
  if (!parsed.ok) return parsed.result;
  const { start, end } = parsed;

  if (blocked) {
    return makeResult("unavailable", `${roomName} is blocked and unavailable.`);
  }

  const conflict = findOverlap(start, end, bookings);
  if (conflict) {
    return makeResult(
      "unavailable",
      `Overlaps existing booking ${formatTime(conflict[0])}–${formatTime(conflict[1])}.`
    );
  }

  return makeResult("available", `${roomName} is available for the requested time.`);
}
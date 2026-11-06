import { describe, it, expect } from "vitest";
import { checkAvailability, AvailabilityConfig } from "./availability";

// now = 540 (09:00), one existing booking 600-660 (10:00-11:00)
const config: AvailabilityConfig = {
  now: 540,
  blocked: false,
  bookings: [[600, 660]],
};

describe("checkAvailability", () => {
  // T01 - AC1: invalid input
  it("T01 rejects empty input", () => {
    expect(checkAvailability("", "", config).status).toBe("invalid");
  });
  it("T01 rejects non-numeric input", () => {
    expect(checkAvailability("abc", "700", config).status).toBe("invalid");
  });
  it("T01 rejects end before start", () => {
    expect(checkAvailability("700", "650", config).status).toBe("invalid");
  });
  it("T01 rejects start equal to now", () => {
    expect(checkAvailability("540", "600", config).status).toBe("invalid");
  });

  // T02 / T03 - AC2: 120-minute limit
  it("T02 accepts exactly 120 minutes", () => {
    expect(checkAvailability("661", "781", config).status).toBe("available");
  });
  it("T03 rejects 121 minutes", () => {
    expect(checkAvailability("661", "782", config).status).toBe("invalid");
  });

  // T04 - AC3: blocked room
  it("T04 rejects booking of a blocked room", () => {
    const r = checkAvailability("700", "760", { ...config, blocked: true });
    expect(r.status).toBe("unavailable");
  });

  // T05 / T06 - AC4: overlap vs touching
  it("T05 rejects overlapping interval", () => {
    expect(checkAvailability("590", "650", config).status).toBe("unavailable");
  });
  it("T06 accepts interval touching after a booking", () => {
    expect(checkAvailability("660", "720", config).status).toBe("available");
  });
  it("T06 accepts interval touching before a booking", () => {
    expect(checkAvailability("541", "600", config).status).toBe("available");
  });

  // T07 - AC5: data not changed
  it("T07 does not modify the bookings data", () => {
    const bookings: [number, number][] = [[600, 660]];
    const copy = JSON.parse(JSON.stringify(bookings));
    checkAvailability("590", "650", { now: 540, blocked: false, bookings });
    expect(bookings).toEqual(copy);
  });
});
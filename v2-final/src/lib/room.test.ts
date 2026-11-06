import { describe, it, expect } from "vitest";
import { ROOMS } from "./rooms";
import { checkRoomAvailability } from "./roomAvailability";

describe("room switching", () => {
  const r301 = ROOMS.find((r) => r.id === "R301")!;
  const r302 = ROOMS.find((r) => r.id === "R302")!;

  it("T13 F5 uses the chosen room's bookings, not another room's", () => {
    // same slot 620-680: overlaps Room 301 booking (600-660), free in Room 302 (720-780)
    expect(checkRoomAvailability(r301, "620", "680", 540).status).toBe("unavailable");
    expect(checkRoomAvailability(r302, "620", "680", 540).status).toBe("available");
  });

  it("catalog has at least four rooms with all required fields", () => {
    expect(ROOMS.length).toBeGreaterThanOrEqual(4);
    for (const r of ROOMS) {
      expect(r.id && r.name).toBeTruthy();
      expect(r.capacity).toBeGreaterThan(0);
      expect(Array.isArray(r.equipment)).toBe(true);
      expect(typeof r.blocked).toBe("boolean");
      expect(Array.isArray(r.bookings)).toBe(true);
    }
  });
});
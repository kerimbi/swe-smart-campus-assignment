import { describe, it, expect } from "vitest";
import { ROOMS } from "./rooms";
import { filterRooms } from "./filters";
import { checkRoomAvailability } from "./roomAvailability";

const ids = (rooms: { id: string }[]) => rooms.map((r) => r.id);

describe("filterRooms", () => {
  it("T08 F1 accepts exact capacity (30 attendees, Room 301 has 30)", () => {
    expect(ids(filterRooms(ROOMS, { attendees: 30, equipment: [] }))).toContain("R301");
  });

  it("T09 F1 excludes insufficient capacity (31 attendees)", () => {
    expect(ids(filterRooms(ROOMS, { attendees: 31, equipment: [] }))).toEqual(["R303"]);
  });

  it("T10 F2 requires ALL selected equipment", () => {
    const result = filterRooms(ROOMS, { attendees: 1, equipment: ["projector", "microphone"] });
    expect(ids(result)).toEqual(["R303"]);
  });

  it("T11 F3 a blocked room is never reported as available", () => {
    const listed = filterRooms(ROOMS, { attendees: 1, equipment: ["computers"] });
    expect(ids(listed)).toEqual(["R304"]);
    for (const [s, e] of [["700", "760"], ["900", "960"], ["1000", "1100"]]) {
      expect(checkRoomAvailability(listed[0], s, e, 540).status).toBe("unavailable");
    }
  });

  it("T12 F4 returns an empty list when no room matches", () => {
    expect(filterRooms(ROOMS, { attendees: 200, equipment: [] })).toEqual([]);
    expect(filterRooms(ROOMS, { attendees: 100, equipment: ["computers"] })).toEqual([]);
  });
});
import type { Room } from "./rooms";

export interface RoomFilter {
  attendees: number;
  equipment: string[];
}

export function filterRooms(rooms: Room[], filter: RoomFilter): Room[] {
  return rooms.filter(
    (r) =>
      r.capacity >= filter.attendees &&
      filter.equipment.every((e) => r.equipment.includes(e))
  );
}
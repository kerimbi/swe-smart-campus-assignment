import { checkAvailability, AvailabilityResult } from "./availability";
import type { Room } from "./rooms";

export function checkRoomAvailability(
  room: Room,
  start: string,
  end: string,
  now: number
): AvailabilityResult {
  return checkAvailability(start, end, {
    now,
    blocked: room.blocked,
    bookings: room.bookings,
    roomName: room.name,
  });
}
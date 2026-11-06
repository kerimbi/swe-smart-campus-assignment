export interface Room {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: [number, number][];
}

export const ROOMS: Room[] = [
  { id: "R301", name: "Room 301", capacity: 30, equipment: ["projector", "whiteboard"], blocked: false, bookings: [[600, 660]] },
  { id: "R302", name: "Seminar Room 302", capacity: 12, equipment: ["whiteboard"], blocked: false, bookings: [[720, 780]] },
  { id: "R303", name: "Lecture Hall A", capacity: 120, equipment: ["projector", "microphone", "whiteboard"], blocked: false, bookings: [[600, 720], [780, 840]] },
  { id: "R304", name: "Computer Lab 304", capacity: 25, equipment: ["computers", "projector"], blocked: true, bookings: [] },
];
# Smart Campus Room Availability Checker (v2-final)

Final four-room version with filters and automated tests.
The original single-room version is in the folder v1-baseline.

## Setup
npm install

## Run
npm run dev

## Test
npm test

## Structure
- src/lib/rooms.ts           room type and 4 fictional rooms
- src/lib/availability.ts    time validation, 120-minute limit, overlap rules
- src/lib/roomAvailability.ts  applies a room's bookings and blocked status
- src/lib/filters.ts         capacity and equipment filters
- src/App.tsx                user interface
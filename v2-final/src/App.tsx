import { useState, type FormEvent } from "react";
import { AlertTriangle, Ban, CheckCircle2, Clock, Users, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ROOMS } from "./lib/rooms";
import { filterRooms } from "./lib/filters";
import { checkRoomAvailability } from "./lib/roomAvailability";
import { formatTime } from "./lib/availability";
import type { AvailabilityResult } from "./lib/availability";

const FIXED_NOW = 540; // 09:00, fixed current time in minutes after midnight
const EQUIPMENT_OPTIONS = ["projector", "whiteboard", "microphone", "computers"];

const RESULT_STYLE: Record<
  AvailabilityResult["status"],
  { box: string; Icon: LucideIcon; title: string }
> = {
  available: { box: "border-green-300 bg-green-50 text-green-800", Icon: CheckCircle2, title: "Available" },
  unavailable: { box: "border-red-300 bg-red-50 text-red-800", Icon: XCircle, title: "Not available" },
  invalid: { box: "border-amber-300 bg-amber-50 text-amber-800", Icon: AlertTriangle, title: "Check your input" },
};

export default function App() {
  const [attendeesText, setAttendeesText] = useState("1");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [result, setResult] = useState<AvailabilityResult | null>(null);

  const attendees = Math.max(1, parseInt(attendeesText, 10) || 1);
  const matching = filterRooms(ROOMS, { attendees, equipment });
  const selectedRoom = matching.find((r) => r.id === selectedId) ?? null;

  // F5: any change of room, filters or times clears the old result
  function changeAttendees(value: string) {
    setAttendeesText(value);
    setResult(null);
  }
  function toggleEquipment(item: string) {
    setEquipment((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]
    );
    setResult(null);
  }
  function selectRoom(id: string) {
    setSelectedId(id);
    setResult(null);
  }
  function changeStart(value: string) {
    setStart(value);
    setResult(null);
  }
  function changeEnd(value: string) {
    setEnd(value);
    setResult(null);
  }

  function handleCheck(e: FormEvent) {
    e.preventDefault();
    if (!selectedRoom) {
      setResult({ status: "invalid", message: "Please select a room first." });
      return;
    }
    setResult(checkRoomAvailability(selectedRoom, start, end, FIXED_NOW));
  }

  const style = result ? RESULT_STYLE[result.status] : null;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-bold text-slate-900">Room Availability</h1>
        <p className="mb-4 text-sm text-slate-500">Smart Campus Room Availability Checker</p>

        <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-sm">
            <span className="flex items-center gap-2 text-slate-600">
              <Clock size={16} /> Current time
            </span>
            <span className="font-mono font-semibold">{formatTime(FIXED_NOW)}</span>
          </div>

          {/* Filters */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-slate-700">Requirements</legend>
            <label className="block text-sm text-slate-600">
              Attendees
              <input
                type="number"
                min={1}
                value={attendeesText}
                onChange={(e) => changeAttendees(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              {EQUIPMENT_OPTIONS.map((item) => (
                <label key={item} className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={equipment.includes(item)}
                    onChange={() => toggleEquipment(item)}
                  />
                  <span className="capitalize">{item}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Room list */}
          <section>
            <div className="mb-2 flex items-center justify-between text-sm">
              <h2 className="font-semibold text-slate-700">Rooms</h2>
              <span className="text-slate-400">{matching.length} matches</span>
            </div>

            {matching.length === 0 ? (
              <p
                role="status"
                className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-sm text-slate-600"
              >
                No rooms match your requirements. Try fewer attendees or less equipment.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {matching.map((room) => {
                  const selected = room.id === selectedId;
                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => selectRoom(room.id)}
                      aria-pressed={selected}
                      className={`rounded-lg border p-3 text-left text-sm transition ${
                        selected
                          ? "border-blue-500 ring-2 ring-blue-300"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-900">{room.name}</span>
                        {room.blocked && (
                          <span className="flex items-center gap-1 text-xs font-medium text-red-600">
                            <Ban size={12} /> Blocked
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <Users size={12} /> Capacity {room.capacity}
                      </div>
                      <div className="mt-1 text-xs capitalize text-slate-500">
                        {room.equipment.join(" · ")}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* Existing bookings of the chosen room (read-only) */}
          {selectedRoom && (
            <section className="text-sm">
              <h2 className="mb-1 font-semibold text-slate-700">
                Existing bookings <span className="font-normal text-slate-400">(read-only)</span>
              </h2>
              {selectedRoom.bookings.length === 0 ? (
                <p className="text-slate-500">No bookings for {selectedRoom.name}.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedRoom.bookings.map(([s, e]) => (
                    <span key={`${s}-${e}`} className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">
                      {formatTime(s)} – {formatTime(e)}
                    </span>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Time form */}
          <form onSubmit={handleCheck} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm text-slate-600">
                Start (minutes)
                <input
                  inputMode="numeric"
                  value={start}
                  onChange={(e) => changeStart(e.target.value)}
                  placeholder="e.g. 590"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="block text-sm text-slate-600">
                End (minutes)
                <input
                  inputMode="numeric"
                  value={end}
                  onChange={(e) => changeEnd(e.target.value)}
                  placeholder="e.g. 650"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
            </div>
            <p className="text-xs text-slate-400">Minutes after midnight (590 = 09:50). Maximum 120 minutes.</p>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Check availability
            </button>
          </form>

          {/* Result */}
          {result && style && (
            <div
              role="status"
              aria-live="polite"
              className={`flex items-start gap-3 rounded-lg border p-3 text-sm ${style.box}`}
            >
              <style.Icon size={20} className="mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold">{style.title}</div>
                <div>{result.message}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

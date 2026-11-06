import { useState } from "react";
import {
  Clock,
  DoorClosed,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  CalendarDays,
  RotateCcw,
} from "lucide-react";
import { checkAvailability, formatTime, type AvailabilityResult } from "@/lib/availability";

const FIXED_NOW = 540;
const FIXED_BOOKINGS: [number, number][] = [[600, 660]];

export default function App() {
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [result, setResult] = useState<AvailabilityResult | null>(null);

  const handleCheck = () => {
    setResult(
      checkAvailability(startInput, endInput, {
        now: FIXED_NOW,
        blocked,
        bookings: FIXED_BOOKINGS,
      })
    );
  };

  const handleReset = () => {
    setStartInput("");
    setEndInput("");
    setBlocked(false);
    setResult(null);
  };

  const clearResult = () => result && setResult(null);

  const startMin = parseInt(startInput, 10);
  const endMin = parseInt(endInput, 10);
  const startPreview = !isNaN(startMin) && startMin >= 0 && startMin <= 1440 ? formatTime(startMin) : "—";
  const endPreview = !isNaN(endMin) && endMin >= 0 && endMin <= 1440 ? formatTime(endMin) : "—";

  const resultStyles: Record<AvailabilityResult["status"], string> = {
    available: "border-emerald-200 bg-emerald-50",
    unavailable: "border-rose-200 bg-rose-50",
    invalid: "border-amber-200 bg-amber-50",
  };

  const resultIcon: Record<AvailabilityResult["status"], typeof CheckCircle2> = {
    available: CheckCircle2,
    unavailable: XCircle,
    invalid: AlertTriangle,
  };

  const resultIconColor: Record<AvailabilityResult["status"], string> = {
    available: "text-emerald-600",
    unavailable: "text-rose-600",
    invalid: "text-amber-600",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
            <DoorClosed className="h-7 w-7 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Room 301
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Smart Campus Room Availability Checker
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-7">
          {/* Current Time */}
          <div className="mb-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Clock className="h-4 w-4 text-blue-600" />
              Current Time
            </div>
            <span className="font-mono text-lg font-semibold text-slate-900">
              {formatTime(FIXED_NOW)}
            </span>
          </div>

          {/* Blocked Toggle */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-slate-700">Room is blocked</span>
              <p className="text-xs text-slate-400">When on, all requests are unavailable</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={blocked}
              onClick={() => {
                setBlocked((prev) => !prev);
                clearResult();
              }}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                blocked ? "bg-rose-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  blocked ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Inputs */}
          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="start" className="mb-1.5 block text-sm font-medium text-slate-700">
                Start <span className="text-slate-400 font-normal">(minutes)</span>
              </label>
              <input
                id="start"
                type="text"
                inputMode="numeric"
                value={startInput}
                onChange={(e) => {
                  setStartInput(e.target.value);
                  clearResult();
                }}
                placeholder="e.g. 555"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <p className="mt-1 text-xs text-slate-400">
                = <span className="font-mono font-medium text-slate-500">{startPreview}</span>
              </p>
            </div>
            <div>
              <label htmlFor="end" className="mb-1.5 block text-sm font-medium text-slate-700">
                End <span className="text-slate-400 font-normal">(minutes)</span>
              </label>
              <input
                id="end"
                type="text"
                inputMode="numeric"
                value={endInput}
                onChange={(e) => {
                  setEndInput(e.target.value);
                  clearResult();
                }}
                placeholder="e.g. 615"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <p className="mt-1 text-xs text-slate-400">
                = <span className="font-mono font-medium text-slate-500">{endPreview}</span>
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCheck}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Check Availability
            </button>
            <button
              type="button"
              onClick={handleReset}
              aria-label="Reset"
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-slate-600 transition hover:bg-slate-50 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* Result */}
          {result && (
            <div
              className={`mt-5 flex items-start gap-3 rounded-xl border px-4 py-3.5 animate-slide-in-from-bottom-2 ${resultStyles[result.status]}`}
            >
              {(() => {
                const Icon = resultIcon[result.status];
                return <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${resultIconColor[result.status]}`} />;
              })()}
              <div>
                <p className={`text-sm font-semibold ${resultIconColor[result.status]}`}>
                  {result.status === "available"
                    ? "Available"
                    : result.status === "unavailable"
                      ? "Unavailable"
                      : "Invalid input"}
                </p>
                <p className="mt-0.5 text-sm text-slate-600">{result.message}</p>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="my-6 border-t border-slate-100" />

          {/* Existing Bookings */}
          <div>
            <div className="mb-2.5 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-600">Existing Bookings</span>
              <span className="text-xs text-slate-400">(read-only)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {FIXED_BOOKINGS.map(([bStart, bEnd], i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  {formatTime(bStart)} – {formatTime(bEnd)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <p className="mt-4 text-center text-xs text-slate-400">
          Times are in minutes after midnight (0–1440). Max duration: 120 minutes.
        </p>
      </div>
    </div>
  );
}

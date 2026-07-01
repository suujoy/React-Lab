import { GESTURES } from "../lib/gestureClassifier";

// Purely presentational: takes a gesture id + label, renders the info card.
// No logic, no state — reused once per hand.
export default function GestureStatusPanel({ handNumber, gestureId }) {
  const gesture = GESTURES[gestureId || "none"] || GESTURES.none;

  return (
    <div className="rounded-2xl border border-white/10 bg-black/55 p-4 backdrop-blur-md">
      <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Hand {handNumber}</div>
      <div className="mt-2 text-xl font-bold text-amber-400">{gesture.label}</div>
      <div className="mt-1 text-sm text-cyan-300">{gesture.action}</div>
    </div>
  );
}
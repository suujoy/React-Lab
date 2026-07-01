import { distance } from "./geometry";

// Everything the UI needs to know about each gesture lives here.
// Add/remove a gesture by editing this object + classifyGesture() below.
export const GESTURES = {
    open_palm: { label: "Open Palm", action: "Idle / Nothing" },
    pinch: { label: "Pinch (Thumb + Index)", action: "Move cursor" },
    pinch_hold: { label: "Pinch + Hold", action: "Place block" },
    fist: { label: "Fist", action: "Delete block" },
    index: { label: "Index Finger", action: "Point / Aim" },
    peace: { label: "Peace Sign", action: "Switch build mode" },
    thumbs_up: { label: "Thumbs Up", action: "Confirm / Save" },
    thumbs_down: { label: "Thumbs Down", action: "Undo" },
    spread: { label: "Five Fingers Spread", action: "Reset selection" },
    three: { label: "Three Fingers", action: "Rotate block" },
    none: { label: "No hand detected", action: "-" },
};

export const PINCH_HOLD_MS = 500; // how long a pinch must be held to count as "pinch_hold"

// A finger is "extended" if its tip is meaningfully farther from the wrist
// than its middle joint is. Simple, fast heuristic — works well when the
// palm faces the camera.
function getExtendedFingers(landmarks) {
    const wrist = landmarks[0];

    const isExtended = (tipIdx, midJointIdx) =>
        distance(landmarks[tipIdx], wrist) >
        distance(landmarks[midJointIdx], wrist) * 1.15;

    // Thumb doesn't fold toward the wrist the same way, so we measure it
    // against the base of the pinky instead.
    const pinkyBase = landmarks[17];
    const thumbExtended =
        distance(landmarks[4], pinkyBase) >
        distance(landmarks[3], pinkyBase) * 1.05;

    return {
        thumb: thumbExtended,
        index: isExtended(8, 6),
        middle: isExtended(12, 10),
        ring: isExtended(16, 14),
        pinky: isExtended(20, 18),
    };
}

// Turns raw landmark positions into one of our named gestures.
// `pinchTracker` carries the pinch-start timestamp across calls so we can
// detect "pinch held for 500ms" vs. a quick pinch.
export function classifyGesture(landmarks, pinchTracker) {
    const handSize = distance(landmarks[0], landmarks[9]); // wrist -> middle knuckle, scales thresholds to hand size/distance from camera
    const pinchDistance = distance(landmarks[4], landmarks[8]); // thumb tip -> index tip
    const isPinching = pinchDistance < handSize * 0.32;

    if (isPinching) {
        if (pinchTracker.startedAt === null)
            pinchTracker.startedAt = Date.now();
        const heldFor = Date.now() - pinchTracker.startedAt;
        return heldFor >= PINCH_HOLD_MS ? "pinch_hold" : "pinch";
    }
    pinchTracker.startedAt = null; // reset once the pinch releases

    const { thumb, index, middle, ring, pinky } = getExtendedFingers(landmarks);
    const extendedCount = [thumb, index, middle, ring, pinky].filter(
        Boolean,
    ).length;

    if (extendedCount === 0) return "fist";

    if (thumb && !index && !middle && !ring && !pinky) {
        // Thumb tip above the wrist (in image space, lower y = higher up) = thumbs up
        return landmarks[4].y < landmarks[0].y ? "thumbs_up" : "thumbs_down";
    }
    if (!thumb && index && !middle && !ring && !pinky) return "index";
    if (index && middle && !ring && !pinky) return "peace";
    if (index && middle && ring && !pinky) return "three";

    if (thumb && index && middle && ring && pinky) {
        const spread = distance(landmarks[8], landmarks[20]); // index tip -> pinky tip
        return spread > handSize * 1.3 ? "spread" : "open_palm";
    }

    return "open_palm";
}

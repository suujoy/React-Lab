import { distance } from "./geometry";

// Everything the UI needs to know about each gesture lives here.
// Add/remove a gesture by editing this object + classifyGesture() below.
export const GESTURES = {
    open_palm: { label: "Open Palm", action: "Idle" },
    pinch: { label: "Pinch", action: "Aim" },
    pinch_hold: { label: "Pinch Hold", action: "Build" },
    fist: { label: "Fist", action: "Delete" },
    peace: { label: "Victory", action: "Confirm" },
    thumbs_up: { label: "Thumbs Up", action: "Accept" },
    thumbs_down: { label: "Thumbs Down", action: "Cancel" },
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
    const handSize = distance(landmarks[0], landmarks[9]); // wrist -> middle knuckle
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
    
    // Fist: all fingers folded (including thumb, or at most thumb barely extended but not in thumbs up position)
    const extendedCountNonThumb = [index, middle, ring, pinky].filter(Boolean).length;
    if (extendedCountNonThumb === 0 && !thumb) {
        return "fist";
    }

    // Thumbs Up / Thumbs Down: only thumb extended
    if (thumb && extendedCountNonThumb === 0) {
        // In MediaPipe space, Y increases downwards, so lower Y means higher up
        // Compare thumb tip (4) with the thumb base IP joint (2)
        return landmarks[4].y < landmarks[2].y ? "thumbs_up" : "thumbs_down";
    }

    // Victory (Peace): index and middle fingers extended, ring and pinky folded
    if (index && middle && !ring && !pinky) {
        return "peace";
    }

    // Open Palm: 4 or 5 fingers extended
    const totalExtended = [thumb, index, middle, ring, pinky].filter(Boolean).length;
    if (totalExtended >= 4) {
        return "open_palm";
    }

    return "open_palm"; // Default to Idle
}

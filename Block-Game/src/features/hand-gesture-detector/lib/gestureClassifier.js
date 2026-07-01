import { distance } from "./geometry";

// Everything the UI needs to know about each gesture lives here.
export const GESTURES = {
    open_palm: { label: "Open Palm", action: "Idle" },
    pinch: { label: "Pinch", action: "Draw" },
    pinch_hold: { label: "Pinch Hold", action: "Draw" },
    fist: { label: "Fist", action: "Erase" },
    peace: { label: "Victory", action: "Undo" },
    thumbs_up: { label: "Thumbs Up", action: "Save" },
    thumbs_down: { label: "Thumbs Down", action: "Clear" },
    none: { label: "No hand detected", action: "-" },
};

export const PINCH_HOLD_MS = 500;

function getExtendedFingers(landmarks) {
    const wrist = landmarks[0];

    const isExtended = (tipIdx, midJointIdx) =>
        distance(landmarks[tipIdx], wrist) >
        distance(landmarks[midJointIdx], wrist) * 1.12;

    const pinkyBase = landmarks[17];
    const thumbExtended =
        distance(landmarks[4], pinkyBase) >
        distance(landmarks[3], pinkyBase) * 1.08;

    return {
        thumb: thumbExtended,
        index: isExtended(8, 6),
        middle: isExtended(12, 10),
        ring: isExtended(16, 14),
        pinky: isExtended(20, 18),
    };
}

export function classifyGesture(landmarks, pinchTracker) {
    if (!landmarks || landmarks.length < 21) {
        return "none";
    }

    // 1. PINCH DETECTION
    const handSize = distance(landmarks[0], landmarks[9]);
    const pinchDistance = distance(landmarks[4], landmarks[8]);
    const isPinching = pinchDistance < handSize * 0.35;

    if (isPinching) {
        if (pinchTracker.startedAt === null) {
            pinchTracker.startedAt = Date.now();
        }
        const heldFor = Date.now() - pinchTracker.startedAt;
        return heldFor >= PINCH_HOLD_MS ? "pinch_hold" : "pinch";
    }
    pinchTracker.startedAt = null;

    const { thumb, index, middle, ring, pinky } = getExtendedFingers(landmarks);
    const extendedCountNonThumb = [index, middle, ring, pinky].filter(
        Boolean,
    ).length;
    const totalExtended = extendedCountNonThumb + (thumb ? 1 : 0);

    // 2. FIST DETECTION
    if (extendedCountNonThumb === 0) {
        if (!thumb || distance(landmarks[4], landmarks[9]) < handSize * 0.65) {
            return "fist";
        }
    }

    // 3. THUMBS UP / THUMBS DOWN (Sensitivity Fix Applied Here)
    if (thumb && extendedCountNonThumb === 0) {
        // Find the average height (Y) of the main knuckles to establish a baseline for the palm
        const knuckleRowY =
            (landmarks[5].y +
                landmarks[9].y +
                landmarks[13].y +
                landmarks[17].y) /
            4;

        // Remember: MediaPipe Y increases DOWNWARDS. Higher Y value = lower on screen.

        // THUMBS UP: Thumb tip must be noticeably HIGHER (lesser Y) than the knuckle row
        if (
            landmarks[4].y < knuckleRowY - 0.05 &&
            landmarks[4].y < landmarks[2].y
        ) {
            return "thumbs_up";
        }

        // THUMBS DOWN: Thumb tip must be noticeably LOWER (greater Y) than the knuckle row
        if (
            landmarks[4].y > knuckleRowY + 0.05 &&
            landmarks[4].y > landmarks[2].y
        ) {
            return "thumbs_down";
        }

        // If the thumb is extended out to the side but not clearly up or down, it falls through
    }

    // 4. VICTORY (Peace)
    if (index && middle && !ring && extendedCountNonThumb <= 2) {
        return "peace";
    }

    // 5. OPEN PALM
    if (totalExtended >= 4) {
        return "open_palm";
    }

    return "none";
}

import { classifyGesture } from "./gestureClassifier";

export const STABLE_FRAMES_REQUIRED = 3; // a gesture must repeat this many times before we trust it
export const MISSING_FRAMES_BEFORE_RESET = 4; // how many empty frames before we say "hand is gone"

// Each tracked hand gets one of these. It smooths out noisy per-frame
// predictions so the UI doesn't flicker between gestures every frame.
// This is a small, self-contained state machine — independent of MediaPipe
// or canvas — so it can be unit tested with fake landmark arrays.
export function createHandState() {
  return {
    pinchTracker: { startedAt: null },
    candidateGesture: "none", // gesture seen on the most recent processed frame
    candidateStreak: 0, // how many frames in a row we've seen candidateGesture
    stableGesture: "none", // the gesture we actually trust/display
    missingFrames: 0, // consecutive frames this hand hasn't been detected
  };
}

// Feeds one frame's classification result into a hand's smoothing state.
// Call this every frame the hand IS visible.
export function updateHandStateWithGesture(handState, landmarks, shouldClassify) {
  handState.missingFrames = 0;
  if (!shouldClassify) return; // classification is skipped on some frames to save CPU

  const detected = classifyGesture(landmarks, handState.pinchTracker);

  if (handState.candidateGesture === detected) {
    handState.candidateStreak += 1;
  } else {
    handState.candidateGesture = detected;
    handState.candidateStreak = 1;
  }

  // Only "commit" to a new gesture once it's been consistent for a few frames.
  if (handState.candidateStreak >= STABLE_FRAMES_REQUIRED) {
    handState.stableGesture = detected;
  }
}

// Call this every frame the hand is NOT visible. After enough missing frames,
// we give up and reset to "none" instead of showing a stale gesture forever.
export function updateHandStateAsMissing(handState, shouldClassify) {
  if (!shouldClassify) return;
  handState.missingFrames += 1;
  if (handState.missingFrames >= MISSING_FRAMES_BEFORE_RESET) {
    handState.candidateGesture = "none";
    handState.candidateStreak = 0;
    handState.stableGesture = "none";
  }
}

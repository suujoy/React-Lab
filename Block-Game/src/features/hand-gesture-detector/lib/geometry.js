// Pure math/geometry helpers — no React, no DOM, no MediaPipe knowledge.
// Safe to unit test in isolation.

// 3D distance between two MediaPipe landmark points ({x, y, z}, all 0-1 normalized).
export function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0));
}

// MediaPipe gives landmarks in normalized (0-1) video space. We need to convert
// them into actual pixel positions on our <canvas>, which may be a different
// size/aspect-ratio than the video (because the video is displayed "cover"-style).
export function getCoverRect(
    sourceWidth,
    sourceHeight,
    targetWidth,
    targetHeight,
) {
    const scale = Math.max(
        targetWidth / sourceWidth,
        targetHeight / sourceHeight,
    );
    const width = sourceWidth * scale;
    const height = sourceHeight * scale;
    return {
        x: (targetWidth - width) / 2,
        y: (targetHeight - height) / 2,
        width,
        height,
    };
}

export function landmarkToCanvasPoint(landmark, rect) {
    return {
        x: rect.x + landmark.x * rect.width,
        y: rect.y + landmark.y * rect.height,
    };
}

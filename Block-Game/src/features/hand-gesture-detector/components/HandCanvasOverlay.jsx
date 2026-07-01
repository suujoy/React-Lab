import { forwardRef } from "react";
import { landmarkToCanvasPoint } from "../lib/geometry";

// Pure drawing helper — draws one hand's skeleton (bones + joints) onto a
// canvas context. Knows nothing about gestures, camera lifecycle, or state.
export function drawHandSkeleton(
    ctx,
    landmarks,
    rect,
    connections,
    lineColor,
    dotColor,
) {
    ctx.save();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 3;

    // Bones: lines between connected landmark points
    connections.forEach(([startIdx, endIdx]) => {
        const start = landmarkToCanvasPoint(landmarks[startIdx], rect);
        const end = landmarkToCanvasPoint(landmarks[endIdx], rect);
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    });

    // Joints: a dot at each landmark
    ctx.fillStyle = dotColor;
    landmarks.forEach((landmark) => {
        const point = landmarkToCanvasPoint(landmark, rect);
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.restore();
}

// Thin wrapper around <canvas>. The actual drawing happens imperatively
// (via the exported drawHandSkeleton + a ref) from the tracking hook, since
// canvas drawing doesn't fit React's declarative render model well.
const HandCanvasOverlay = forwardRef(function HandCanvasOverlay(_props, ref) {
    return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
});

export default HandCanvasOverlay;

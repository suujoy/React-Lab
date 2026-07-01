import React, { useEffect, useRef, useState } from "react";

// Neon palette — same family as the rest of the HUD, tuned for glow-on-black.
export const COLOR_MAP = {
    pink: "#ff1493",
    cyan: "#00f0ff",
    purple: "#bd00ff",
    orange: "#ff8c00",
};

export const BRUSH_SIZES = {
    s: 3,
    m: 7,
    l: 14,
};

export const ERASER_RADIUS = 34;
const MIN_POINT_DISTANCE = 1.5; // px — drop points that are basically on top of the last one

// ── geometry helpers ──────────────────────────────────────────────────────

// The tracking hook hands us normalized device coords in [-1, 1] (Y up),
// meant for 3D unprojection. We just need plain screen pixels for a flat
// canvas, so invert that mapping here.
function ndcToPixel(ndc, width, height) {
    return {
        x: ((ndc.x + 1) / 2) * width,
        y: ((1 - ndc.y) / 2) * height,
    };
}

// Points are stored normalized (0-1) so strokes replay correctly at any
// canvas size (window resize, different device, etc).
function toNormalized(point, width, height) {
    return { x: point.x / width, y: point.y / height };
}

function toPixel(point, width, height) {
    return { x: point.x * width, y: point.y * height };
}

function distancePx(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

// ── drawing primitives ────────────────────────────────────────────────────

// A soft neon line: a wide, blurred glow pass underneath a crisp core pass.
function strokeGlowSegment(ctx, from, to, color, width) {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalCompositeOperation = "lighter";

    ctx.shadowColor = color;
    ctx.shadowBlur = width * 2.2;
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = width * 1.8;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    ctx.shadowBlur = width * 0.6;
    ctx.globalAlpha = 0.95;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    ctx.restore();
}

function strokeGlowDot(ctx, point, color, width) {
    strokeGlowSegment(ctx, point, { x: point.x + 0.01, y: point.y + 0.01 }, color, width);
}

function eraseSegment(ctx, from, to, radius) {
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = radius * 2;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();
}

function eraseDot(ctx, point, radius) {
    eraseSegment(ctx, point, { x: point.x + 0.01, y: point.y + 0.01 }, radius);
}

// Replays one committed stroke in full (used for the base redraw pass).
function drawFullStroke(ctx, stroke, width, height) {
    if (stroke.points.length === 0) return;
    const pixelPoints = stroke.points.map((p) => toPixel(p, width, height));

    if (stroke.tool === "eraser") {
        if (pixelPoints.length === 1) {
            eraseDot(ctx, pixelPoints[0], stroke.width / 2);
            return;
        }
        for (let i = 1; i < pixelPoints.length; i += 1) {
            eraseSegment(ctx, pixelPoints[i - 1], pixelPoints[i], stroke.width / 2);
        }
        return;
    }

    if (pixelPoints.length === 1) {
        strokeGlowDot(ctx, pixelPoints[0], stroke.color, stroke.width);
        return;
    }
    for (let i = 1; i < pixelPoints.length; i += 1) {
        strokeGlowSegment(ctx, pixelPoints[i - 1], pixelPoints[i], stroke.color, stroke.width);
    }
}

// ── component ──────────────────────────────────────────────────────────────

export default function AirCanvas({
    strokes,
    onAddStroke,
    activeColor,
    brushSize,
    handNDC,
    activeGesture,
    onCursorChange,
}) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const currentStrokeRef = useRef(null); // { color, width, tool, points: normalized[] }
    const lastPixelPointRef = useRef(null);

    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    const isPenDown = activeGesture === "pinch" || activeGesture === "pinch_hold";
    const isErasing = activeGesture === "fist";
    const isDrawing = isPenDown || isErasing;

    // Keep the latest color/brush size in refs so the per-frame interaction
    // effect below doesn't need to re-run (and re-wire) every time they change.
    const activeColorHex = COLOR_MAP[activeColor] ?? COLOR_MAP.pink;
    const liveConfigRef = useRef({ color: activeColorHex, width: brushSize });
    liveConfigRef.current = { color: activeColorHex, width: brushSize };

    useEffect(() => {
        const node = containerRef.current;
        if (!node) return undefined;

        const resizeObserver = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;
            setCanvasSize({
                width: Math.round(entry.contentRect.width),
                height: Math.round(entry.contentRect.height),
            });
        });

        resizeObserver.observe(node);
        return () => resizeObserver.disconnect();
    }, []);

    // Base layer: full redraw whenever committed strokes change size, or the
    // canvas is resized. Cheap relative to interaction frames since it only
    // fires once per finished stroke (or on window resize), not every frame.
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || canvasSize.width === 0 || canvasSize.height === 0) return;

        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        strokes.forEach((stroke) => drawFullStroke(ctx, stroke, canvasSize.width, canvasSize.height));

        // Any in-progress stroke was lost across the resize/redraw — that's
        // an acceptable edge case (resizing mid-stroke is rare).
        currentStrokeRef.current = null;
        lastPixelPointRef.current = null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [strokes, canvasSize.width, canvasSize.height]);

    // Interaction layer: fires every hand-tracking frame. Draws the live
    // segment imperatively (fast — no full redraw) and commits the finished
    // stroke to state once the gesture releases.
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || canvasSize.width === 0 || canvasSize.height === 0) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const handPresent = handNDC && !(handNDC.x === 0 && handNDC.y === 0);

        if (!handPresent) {
            onCursorChange?.(null, "idle");
        }

        if (!handPresent || !isDrawing) {
            if (handPresent) {
                onCursorChange?.(ndcToPixel(handNDC, canvasSize.width, canvasSize.height), "idle");
            }
            if (currentStrokeRef.current) {
                onAddStroke(currentStrokeRef.current);
                currentStrokeRef.current = null;
                lastPixelPointRef.current = null;
            }
            return;
        }

        const pixelPoint = ndcToPixel(handNDC, canvasSize.width, canvasSize.height);
        const tool = isErasing ? "eraser" : "pen";
        const { color, width } = liveConfigRef.current;
        const strokeWidth = tool === "eraser" ? ERASER_RADIUS * 2 : width;

        onCursorChange?.(pixelPoint, tool);

        const toolChanged = currentStrokeRef.current && currentStrokeRef.current.tool !== tool;

        if (!currentStrokeRef.current || toolChanged) {
            // Starting a new stroke — commit whatever was in progress first.
            if (currentStrokeRef.current) onAddStroke(currentStrokeRef.current);

            currentStrokeRef.current = {
                id: `stroke_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
                color,
                width: strokeWidth,
                tool,
                points: [toNormalized(pixelPoint, canvasSize.width, canvasSize.height)],
            };
            lastPixelPointRef.current = pixelPoint;

            if (tool === "eraser") {
                eraseDot(ctx, pixelPoint, strokeWidth / 2);
            } else {
                strokeGlowDot(ctx, pixelPoint, color, strokeWidth);
            }
            return;
        }

        const last = lastPixelPointRef.current;
        if (last && distancePx(last, pixelPoint) < MIN_POINT_DISTANCE) return;

        if (tool === "eraser") {
            eraseSegment(ctx, last, pixelPoint, strokeWidth / 2);
        } else {
            strokeGlowSegment(ctx, last, pixelPoint, color, strokeWidth);
        }

        currentStrokeRef.current.points.push(toNormalized(pixelPoint, canvasSize.width, canvasSize.height));
        lastPixelPointRef.current = pixelPoint;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handNDC, activeGesture, canvasSize.width, canvasSize.height]);

    return (
        <div ref={containerRef} className="absolute inset-0 h-full w-full bg-transparent">
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ display: "block" }} />
        </div>
    );
}

import React, { useEffect, useMemo, useRef, useState } from "react";

export const COLOR_MAP = {
    pink: "#ff1493",
    cyan: "#00f0ff",
    purple: "#bd00ff",
    orange: "#ff8c00",
};

const PREVIEW_COLOR_MAP = {
    pink: "#67e8f9",
    cyan: "#fde047",
    purple: "#86efac",
    orange: "#93c5fd",
};

const GRID_RADIUS = 8;
const GRID_SIZE = GRID_RADIUS * 2 + 1;
const PLACEMENT_INITIAL_DELAY_MS = 700;
const PLACEMENT_COOLDOWN_MS = 800;

function hexToRgb(hex) {
    const normalized = hex.replace("#", "");
    const value = normalized.length === 3
        ? normalized.split("").map((char) => char + char).join("")
        : normalized;

    const int = Number.parseInt(value, 16);
    return {
        r: (int >> 16) & 255,
        g: (int >> 8) & 255,
        b: int & 255,
    };
}

function rgba(hex, alpha) {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function shade(hex, amount) {
    const { r, g, b } = hexToRgb(hex);
    const clamp = (value) => Math.max(0, Math.min(255, Math.round(value)));
    return `rgb(${clamp(r + amount)}, ${clamp(g + amount)}, ${clamp(b + amount)})`;
}

function getColumnBlocks(blocks, x, z) {
    return blocks
        .filter((block) => block.position[0] === x && block.position[2] === z)
        .sort((a, b) => a.position[1] - b.position[1]);
}

function getTopBlock(blocks, x, z) {
    const column = getColumnBlocks(blocks, x, z);
    return column[column.length - 1] ?? null;
}

function getNextPlacementCell(blocks, x, z) {
    const topBlock = getTopBlock(blocks, x, z);
    return [x, topBlock ? topBlock.position[1] + 1 : 0, z];
}

function clampGrid(value) {
    return Math.max(-GRID_RADIUS, Math.min(GRID_RADIUS, value));
}

function projectCell(x, y, z, metrics) {
    const isoX = (x - z) * metrics.cellWidth * 0.5;
    const isoY = (x + z) * metrics.cellHeight * 0.5 - y * metrics.blockHeight;

    return {
        x: metrics.originX + isoX,
        y: metrics.originY + isoY,
    };
}

function drawDiamond(ctx, centerX, centerY, width, height) {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - height * 0.5);
    ctx.lineTo(centerX + width * 0.5, centerY);
    ctx.lineTo(centerX, centerY + height * 0.5);
    ctx.lineTo(centerX - width * 0.5, centerY);
    ctx.closePath();
}

function drawBlock(ctx, block, metrics) {
    const [x, y, z] = block.position;
    const top = projectCell(x, y, z, metrics);
    const bottomY = top.y + metrics.blockHeight;
    const halfW = metrics.cellWidth * 0.5;
    const halfH = metrics.cellHeight * 0.5;

    ctx.save();

    ctx.beginPath();
    ctx.moveTo(top.x, top.y - halfH);
    ctx.lineTo(top.x + halfW, top.y);
    ctx.lineTo(top.x + halfW, bottomY);
    ctx.lineTo(top.x, bottomY - halfH);
    ctx.closePath();
    ctx.fillStyle = shade(block.color, -26);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(top.x, top.y - halfH);
    ctx.lineTo(top.x - halfW, top.y);
    ctx.lineTo(top.x - halfW, bottomY);
    ctx.lineTo(top.x, bottomY - halfH);
    ctx.closePath();
    ctx.fillStyle = shade(block.color, -46);
    ctx.fill();

    drawDiamond(ctx, top.x, top.y, metrics.cellWidth, metrics.cellHeight);
    ctx.fillStyle = rgba(block.color, 0.94);
    ctx.fill();
    ctx.strokeStyle = rgba("#ffffff", 0.22);
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
}

function drawPreviewCell(ctx, cell, metrics, fillColor, strokeColor, alpha) {
    const [x, y, z] = cell;
    const point = projectCell(x, y, z, metrics);

    ctx.save();
    ctx.globalCompositeOperation = "screen";

    drawDiamond(ctx, point.x, point.y, metrics.cellWidth, metrics.cellHeight);
    ctx.fillStyle = rgba(fillColor, alpha);
    ctx.fill();

    drawDiamond(ctx, point.x, point.y, metrics.cellWidth + 2, metrics.cellHeight + 2);
    ctx.strokeStyle = rgba(strokeColor, 0.95);
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
}

function drawGrid(ctx, metrics) {
    ctx.save();
    ctx.lineWidth = 1;

    for (let x = -GRID_RADIUS; x <= GRID_RADIUS; x += 1) {
        for (let z = -GRID_RADIUS; z <= GRID_RADIUS; z += 1) {
            const point = projectCell(x, 0, z, metrics);
            drawDiamond(ctx, point.x, point.y, metrics.cellWidth, metrics.cellHeight);
            ctx.fillStyle = (x + z) % 2 === 0
                ? "rgba(255,255,255,0.025)"
                : "rgba(255,255,255,0.04)";
            ctx.fill();
            ctx.strokeStyle = "rgba(255,20,147,0.14)";
            ctx.stroke();
        }
    }

    ctx.restore();
}

function getGhostCells(blocks, targetCell) {
    if (!targetCell) return [];

    const [x, , z] = targetCell;
    return [
        getNextPlacementCell(blocks, clampGrid(x), clampGrid(z - 1)),
        getNextPlacementCell(blocks, clampGrid(x - 1), clampGrid(z)),
        getNextPlacementCell(blocks, clampGrid(x + 1), clampGrid(z)),
    ];
}

export default function VoxelGridCanvas({
    blocks,
    onAddBlock,
    onRemoveBlock,
    activeColor,
    handNDC,
    activeGesture,
    onTargetCellChange,
}) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const pinchHoldStartRef = useRef(null);
    const lastPlacementTimeRef = useRef(null);
    const lastPlacedCellRef = useRef(null);
    const lastDeletedCellRef = useRef(null);

    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [targetCell, setTargetCell] = useState(null);

    const isInteracting =
        activeGesture === "pinch" ||
        activeGesture === "pinch_hold" ||
        activeGesture === "fist";

    const metrics = useMemo(() => {
        const width = canvasSize.width || 1;
        const height = canvasSize.height || 1;
        const base = Math.max(20, Math.min(width / 16, height / 12));

        return {
            width,
            height,
            cellWidth: base * 1.2,
            cellHeight: base * 0.62,
            blockHeight: base * 0.8,
            originX: width * 0.5,
            originY: height * 0.72,
        };
    }, [canvasSize.height, canvasSize.width]);

    useEffect(() => {
        const node = containerRef.current;
        if (!node) return;

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

    useEffect(() => {
        if (!handNDC || !isInteracting || (handNDC.x === 0 && handNDC.y === 0)) {
            setTargetCell(null);
            onTargetCellChange?.(null);
            return;
        }

        const gridX = clampGrid(Math.round(handNDC.x * GRID_RADIUS));
        const gridZ = clampGrid(Math.round(-handNDC.y * GRID_RADIUS));

        if (activeGesture === "fist") {
            const topBlock = getTopBlock(blocks, gridX, gridZ);
            if (!topBlock) {
                setTargetCell(null);
                onTargetCellChange?.(null);
                return;
            }

            setTargetCell(topBlock.position);
            onTargetCellChange?.(topBlock.position);
            return;
        }

        const nextCell = getNextPlacementCell(blocks, gridX, gridZ);
        setTargetCell(nextCell);
        onTargetCellChange?.(nextCell);
    }, [activeGesture, blocks, handNDC, isInteracting, onTargetCellChange]);

    useEffect(() => {
        if (!targetCell) {
            lastDeletedCellRef.current = null;
            if (activeGesture !== "pinch_hold") {
                pinchHoldStartRef.current = null;
                lastPlacedCellRef.current = null;
            }
            return;
        }

        const currentTargetKey = targetCell.join(",");

        if (activeGesture === "pinch_hold") {
            lastDeletedCellRef.current = null;
            const now = Date.now();

            if (pinchHoldStartRef.current === null) {
                pinchHoldStartRef.current = now;
            }

            if (now - pinchHoldStartRef.current < PLACEMENT_INITIAL_DELAY_MS) return;

            const timeSinceLastPlacement =
                lastPlacementTimeRef.current !== null
                    ? now - lastPlacementTimeRef.current
                    : Infinity;

            if (timeSinceLastPlacement < PLACEMENT_COOLDOWN_MS) return;

            if (lastPlacedCellRef.current !== currentTargetKey) {
                const exists = blocks.some(
                    (block) =>
                        block.position[0] === targetCell[0] &&
                        block.position[1] === targetCell[1] &&
                        block.position[2] === targetCell[2],
                );

                if (!exists) {
                    onAddBlock(targetCell);
                    lastPlacementTimeRef.current = now;
                }

                lastPlacedCellRef.current = currentTargetKey;
            }
        } else if (activeGesture === "fist") {
            pinchHoldStartRef.current = null;
            lastPlacedCellRef.current = null;

            if (lastDeletedCellRef.current !== currentTargetKey) {
                onRemoveBlock(targetCell);
                lastDeletedCellRef.current = currentTargetKey;
            }
        } else {
            pinchHoldStartRef.current = null;
            lastPlacedCellRef.current = null;
            lastDeletedCellRef.current = null;
        }
    }, [activeGesture, blocks, onAddBlock, onRemoveBlock, targetCell]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || canvasSize.width === 0 || canvasSize.height === 0) return;

        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawGrid(ctx, metrics);

        const orderedBlocks = [...blocks].sort((a, b) => {
            const aDepth = a.position[0] + a.position[2] + a.position[1];
            const bDepth = b.position[0] + b.position[2] + b.position[1];
            return aDepth - bDepth;
        });

        orderedBlocks.forEach((block) => drawBlock(ctx, block, metrics));

        if (!targetCell) return;

        const isDeleting = activeGesture === "fist";
        const previewColor = isDeleting ? "#fb7185" : PREVIEW_COLOR_MAP[activeColor];
        const skeletonColor = isDeleting ? "#ffe4e6" : "#f8fafc";

        if (!isDeleting) {
            const ghostCells = getGhostCells(blocks, targetCell);
            ghostCells.forEach((cell, index) => {
                drawPreviewCell(
                    ctx,
                    cell,
                    metrics,
                    previewColor,
                    skeletonColor,
                    index === 0 ? 0.14 : 0.09,
                );
            });
        }

        drawPreviewCell(ctx, targetCell, metrics, previewColor, skeletonColor, 0.2);
    }, [activeColor, activeGesture, blocks, canvasSize.height, canvasSize.width, metrics, targetCell]);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 h-full w-full bg-transparent"
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 h-full w-full"
                style={{ display: "block" }}
            />
        </div>
    );
}

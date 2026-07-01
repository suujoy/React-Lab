import React from "react";
import { Terminal, Cpu } from "lucide-react";

/**
 * ARStatusBar — Two floating HUD chips for telemetry + camera status.
 * Designed per the Stitch "Neon Lattice" design system (Cyberpunk Glassmorphism).
 */

// Shared glass panel style
const glassStyle = {
    background: "rgba(0,0,0,0.48)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,20,147,0.18)",
    boxShadow: "0 4px 24px rgba(0,0,0,0.45), inset 0 0 0 0.5px rgba(255,255,255,0.04)",
    borderRadius: "5px",
};

const monoStyle = {
    fontFamily: "'Space Mono', monospace",
};

const soraStyle = {
    fontFamily: "'Sora', sans-serif",
};

// ── Top-left telemetry chip ──────────────────────────────────────────────────
export function TelemetryHUD({ hoveredCell, blocks, statusText }) {
    const xyz = hoveredCell
        ? `${hoveredCell[0]}, ${hoveredCell[1]}, ${hoveredCell[2]}`
        : "---, ---, ---";

    return (
        <div style={{ ...glassStyle, minWidth: 0 }}>
            {/* Header */}
            <div
                className="flex items-center gap-1.5 px-3 py-1.5"
                style={{ borderBottom: "1px solid rgba(255,20,147,0.1)", background: "rgba(255,20,147,0.06)" }}
            >
                <Terminal style={{ width: 9, height: 9, color: "#ff1493", flexShrink: 0 }} />
                <span
                    style={{
                        ...monoStyle,
                        fontSize: 8,
                        color: "#ffb0ca",
                        textTransform: "uppercase",
                        letterSpacing: "0.14em",
                        fontWeight: 700,
                    }}
                >
                    AR Telemetry
                </span>
            </div>

            {/* Data rows */}
            <div className="flex flex-col gap-0.5 px-3 py-2">
                {/* XYZ */}
                <div className="flex items-center gap-2">
                    <span style={{ ...monoStyle, fontSize: 8, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", width: 28 }}>
                        XYZ
                    </span>
                    <span style={{ ...monoStyle, fontSize: 10, color: "#00f0ff", fontWeight: 700, letterSpacing: "0.03em" }}>
                        {xyz}
                    </span>
                </div>

                {/* Blocks */}
                <div className="flex items-center gap-2">
                    <span style={{ ...monoStyle, fontSize: 8, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", width: 28 }}>
                        BLK
                    </span>
                    <span style={{ ...monoStyle, fontSize: 10, color: "#ff1493", fontWeight: 700 }}>
                        {blocks}
                    </span>
                </div>

                {/* Status */}
                {statusText && (
                    <div className="flex items-center gap-2 mt-0.5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 4 }}>
                        <span style={{ ...monoStyle, fontSize: 8, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", width: 28 }}>
                            SYS
                        </span>
                        <span
                            style={{ ...monoStyle, fontSize: 9, color: "#7a8a98", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                            title={statusText}
                        >
                            {statusText}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Top-right camera status pill ─────────────────────────────────────────────
export function CameraStatusPill({ isRunning }) {
    return (
        <div
            style={{
                ...glassStyle,
                border: isRunning
                    ? "1px solid rgba(52,211,153,0.3)"
                    : "1px solid rgba(239,68,68,0.3)",
            }}
        >
            <div className="flex items-center gap-2 px-3 py-2">
                {/* LED dot */}
                <span
                    className="rounded-full shrink-0"
                    style={{
                        width: 6,
                        height: 6,
                        background: isRunning ? "#34d399" : "#ef4444",
                        boxShadow: isRunning
                            ? "0 0 6px #34d399, 0 0 12px rgba(52,211,153,0.4)"
                            : "0 0 6px #ef4444",
                        animation: isRunning ? "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite" : "none",
                    }}
                />
                <Cpu
                    style={{
                        width: 9,
                        height: 9,
                        color: isRunning ? "#34d399" : "#ef4444",
                        flexShrink: 0,
                    }}
                />
                <span
                    style={{
                        ...monoStyle,
                        fontSize: 9,
                        fontWeight: 700,
                        color: isRunning ? "#86efac" : "#fca5a5",
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                    }}
                >
                    {isRunning ? "CAM ACTIVE" : "CAM OFFLINE"}
                </span>
            </div>
        </div>
    );
}

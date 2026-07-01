import React from "react";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { GESTURES } from "../lib/gestureClassifier";

const GESTURE_ICONS = {
    open_palm: "🖐",
    pinch: "🤏",
    pinch_hold: "🤏",
    fist: "✊",
    peace: "✌️",
    thumbs_up: "👍",
    thumbs_down: "👎",
};

export default function GestureHelpPanel({
    activeGesture,
    isCollapsed,
    onToggleCollapse,
}) {
    const gestureEntries = Object.entries(GESTURES).filter(([key]) => key !== "none");

    return (
        <div
            className="flex flex-col transition-all duration-300 ease-in-out"
            style={{
                width: isCollapsed ? "40px" : "196px",
                background: "rgba(0,0,0,0.48)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,20,147,0.18)",
                boxShadow:
                    "0 4px 32px rgba(0,0,0,0.5), inset 0 0 0 0.5px rgba(255,255,255,0.04)",
                borderRadius: "6px",
                overflow: "hidden",
            }}
        >
            <div
                className="flex items-center justify-between px-2 py-1.5"
                style={{ borderBottom: "1px solid rgba(255,20,147,0.12)" }}
            >
                {!isCollapsed && (
                    <div className="flex items-center gap-1.5 min-w-0">
                        <Zap
                            className="shrink-0"
                            style={{ width: 10, height: 10, color: "#ff1493" }}
                        />
                        <span
                            className="uppercase tracking-widest truncate"
                            style={{
                                fontFamily: "'Space Mono', monospace",
                                fontSize: 8,
                                color: "#ffb0ca",
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                            }}
                        >
                            Gesture Deck
                        </span>
                    </div>
                )}

                <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                    <span
                        className="rounded-full shrink-0"
                        style={{
                            width: 6,
                            height: 6,
                            background: activeGesture !== "none" ? "#ff1493" : "#333",
                            boxShadow: activeGesture !== "none" ? "0 0 6px #ff1493" : "none",
                            display: "block",
                        }}
                    />
                    <button
                        onClick={onToggleCollapse}
                        className="flex items-center justify-center rounded transition-colors duration-200"
                        style={{
                            width: 18,
                            height: 18,
                            background: "rgba(255,20,147,0.08)",
                            border: "1px solid rgba(255,20,147,0.2)",
                            color: "#ff1493",
                            cursor: "pointer",
                        }}
                        aria-label={isCollapsed ? "Expand gesture panel" : "Collapse gesture panel"}
                    >
                        {isCollapsed ? (
                            <ChevronRight style={{ width: 10, height: 10 }} />
                        ) : (
                            <ChevronLeft style={{ width: 10, height: 10 }} />
                        )}
                    </button>
                </div>
            </div>

            {!isCollapsed && (
                <div
                    className="flex items-center gap-1.5 px-2 py-1.5"
                    style={{
                        background: "rgba(255,20,147,0.06)",
                        borderBottom: "1px solid rgba(255,20,147,0.08)",
                    }}
                >
                    <span style={{ fontSize: 12, lineHeight: 1 }}>
                        {activeGesture !== "none" && GESTURE_ICONS[activeGesture]
                            ? GESTURE_ICONS[activeGesture]
                            : "-"}
                    </span>
                    <div className="flex flex-col min-w-0">
                        <span
                            style={{
                                fontFamily: "'Space Mono', monospace",
                                fontSize: 8,
                                color: "#666",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                            }}
                        >
                            Active
                        </span>
                        <span
                            style={{
                                fontFamily: "'Sora', sans-serif",
                                fontSize: 9,
                                fontWeight: 600,
                                color: activeGesture !== "none" ? "#ff1493" : "#444",
                                lineHeight: 1.2,
                            }}
                        >
                            {activeGesture !== "none" && GESTURES[activeGesture]
                                ? GESTURES[activeGesture].label
                                : "NONE"}
                        </span>
                    </div>
                </div>
            )}

            {!isCollapsed && (
                <div className="flex flex-col gap-px p-1">
                    {gestureEntries.map(([key, value]) => {
                        const isActive = activeGesture === key;
                        const isPinchHold = key === "pinch_hold";

                        return (
                            <div
                                key={key}
                                className="flex items-center justify-between gap-1.5 px-1.5 py-1.5 rounded transition-all duration-250"
                                style={{
                                    background: isActive
                                        ? "rgba(255,20,147,0.12)"
                                        : "rgba(255,255,255,0.02)",
                                    border: isActive
                                        ? "1px solid rgba(255,20,147,0.6)"
                                        : "1px solid transparent",
                                    boxShadow: isActive
                                        ? "0 0 10px rgba(255,20,147,0.25)"
                                        : "none",
                                    transform: isActive ? "translateX(2px)" : "translateX(0)",
                                    borderRadius: "4px",
                                }}
                            >
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <span
                                        className="shrink-0"
                                        style={{ fontSize: 13, lineHeight: 1 }}
                                        role="img"
                                        aria-label={value.label}
                                    >
                                        {GESTURE_ICONS[key] || "?"}
                                        {isPinchHold && (
                                            <span
                                                style={{
                                                    fontSize: 8,
                                                    verticalAlign: "middle",
                                                    marginLeft: 1,
                                                }}
                                            >
                                                ⚡
                                            </span>
                                        )}
                                    </span>
                                    <div className="flex flex-col min-w-0">
                                        <span
                                            className="truncate"
                                            style={{
                                                fontFamily: "'Sora', sans-serif",
                                                fontSize: 9,
                                                fontWeight: 600,
                                                color: isActive ? "#fff" : "#c0c0c8",
                                                lineHeight: 1.2,
                                            }}
                                        >
                                            {value.label}
                                        </span>
                                    </div>
                                </div>

                                <span
                                    className="shrink-0"
                                    style={{
                                        fontFamily: "'Space Mono', monospace",
                                        fontSize: 7,
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                        padding: "2px 4px",
                                        borderRadius: "3px",
                                        background: isActive
                                            ? "#ff1493"
                                            : "rgba(0,240,255,0.08)",
                                        color: isActive ? "#000" : "#00f0ff",
                                        border: isActive
                                            ? "none"
                                            : "1px solid rgba(0,240,255,0.2)",
                                        boxShadow: isActive
                                            ? "0 0 6px rgba(255,20,147,0.6)"
                                            : "none",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {value.action}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}

            {!isCollapsed && (
                <div
                    className="px-2 py-1.5 text-center"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                >
                    <span
                        style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: 8,
                            color: "#444",
                            fontStyle: "italic",
                            letterSpacing: "0.04em",
                        }}
                    >
                        Hold Pinch 0.7s {"->"} controlled build
                    </span>
                </div>
            )}
        </div>
    );
}

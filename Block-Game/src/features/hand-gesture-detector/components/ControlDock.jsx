import React from "react";
import { Undo2, Trash2, Save, FolderOpen, Camera, CameraOff } from "lucide-react";
import { COLOR_MAP, BRUSH_SIZES } from "./AirCanvas";

const monoStyle = { fontFamily: "'Space Mono', monospace" };

// Glass button base
const btnBase = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255,20,147,0.2)",
    background: "rgba(255,20,147,0.06)",
    color: "#ffb0ca",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none",
};

function GlassBtn({ onClick, disabled, title, children, style = {} }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            style={{
                ...btnBase,
                width: 32,
                height: 32,
                opacity: disabled ? 0.35 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
                ...style,
            }}
            onMouseEnter={(e) => {
                if (!disabled) {
                    e.currentTarget.style.background = "rgba(255,20,147,0.18)";
                    e.currentTarget.style.borderColor = "rgba(255,20,147,0.6)";
                    e.currentTarget.style.boxShadow = "0 0 8px rgba(255,20,147,0.3)";
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = style.background || "rgba(255,20,147,0.06)";
                e.currentTarget.style.borderColor = style.borderColor || "rgba(255,20,147,0.2)";
                e.currentTarget.style.boxShadow = "none";
            }}
        >
            {children}
        </button>
    );
}

export default function ControlDock({
    activeColor,
    onChangeColor,
    brushSize,
    onChangeBrushSize,
    onUndo,
    onClear,
    onSave,
    onLoad,
    strokeCount,
    isCameraRunning,
    onToggleCamera,
}) {
    return (
        <div
            style={{
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(22px)",
                WebkitBackdropFilter: "blur(22px)",
                border: "1px solid rgba(255,20,147,0.18)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.5), inset 0 0 0 0.5px rgba(255,255,255,0.04)",
                borderRadius: "6px",
                padding: "0 12px",
                height: 48,
                display: "flex",
                alignItems: "center",
                gap: 8,
            }}
        >
            {/* Color swatches */}
            <div className="flex items-center gap-1.5" title="Ink Color">
                {Object.entries(COLOR_MAP).map(([name, hex]) => {
                    const isSelected = activeColor === name;
                    return (
                        <button
                            key={name}
                            onClick={() => onChangeColor(name)}
                            title={`Color: ${name}`}
                            style={{
                                width: isSelected ? 22 : 18,
                                height: isSelected ? 22 : 18,
                                borderRadius: "50%",
                                background: hex,
                                border: isSelected ? "2px solid rgba(255,255,255,0.9)" : "2px solid transparent",
                                boxShadow: isSelected ? `0 0 10px ${hex}, 0 0 20px ${hex}60` : "none",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                outline: "none",
                                flexShrink: 0,
                            }}
                            onMouseEnter={(e) => {
                                if (!isSelected) {
                                    e.currentTarget.style.width = "20px";
                                    e.currentTarget.style.height = "20px";
                                    e.currentTarget.style.opacity = "1";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isSelected) {
                                    e.currentTarget.style.width = "18px";
                                    e.currentTarget.style.height = "18px";
                                }
                            }}
                        />
                    );
                })}
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.08)", flexShrink: 0 }} />

            {/* Brush size */}
            <div className="flex items-center gap-1" title="Brush Size">
                {Object.entries(BRUSH_SIZES).map(([key, size]) => {
                    const isSelected = brushSize === size;
                    return (
                        <button
                            key={key}
                            onClick={() => onChangeBrushSize(size)}
                            title={`Brush: ${key.toUpperCase()}`}
                            style={{
                                ...btnBase,
                                width: 24,
                                height: 24,
                                background: isSelected ? "rgba(255,20,147,0.22)" : "rgba(255,20,147,0.06)",
                                borderColor: isSelected ? "rgba(255,20,147,0.7)" : "rgba(255,20,147,0.2)",
                                boxShadow: isSelected ? "0 0 8px rgba(255,20,147,0.35)" : "none",
                            }}
                        >
                            <span
                                style={{
                                    width: Math.min(size, 12),
                                    height: Math.min(size, 12),
                                    borderRadius: "50%",
                                    background: isSelected ? "#ff1493" : "#ffb0ca",
                                }}
                            />
                        </button>
                    );
                })}
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.08)", flexShrink: 0 }} />

            {/* Undo */}
            <GlassBtn onClick={onUndo} disabled={strokeCount === 0} title="Undo Last Stroke">
                <Undo2 style={{ width: 13, height: 13 }} />
            </GlassBtn>

            {/* Clear */}
            <GlassBtn
                onClick={onClear}
                disabled={strokeCount === 0}
                title="Clear Drawing"
            >
                <Trash2 style={{ width: 13, height: 13 }} />
            </GlassBtn>

            {/* Divider */}
            <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.08)", flexShrink: 0 }} />

            {/* Save */}
            <button
                onClick={onSave}
                disabled={strokeCount === 0}
                title="Save to Storage"
                style={{
                    ...btnBase,
                    height: 32,
                    padding: "0 10px",
                    gap: 5,
                    opacity: strokeCount === 0 ? 0.35 : 1,
                    cursor: strokeCount === 0 ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                    if (strokeCount > 0) {
                        e.currentTarget.style.background = "rgba(255,20,147,0.18)";
                        e.currentTarget.style.borderColor = "rgba(255,20,147,0.6)";
                        e.currentTarget.style.boxShadow = "0 0 8px rgba(255,20,147,0.3)";
                    }
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,20,147,0.06)";
                    e.currentTarget.style.borderColor = "rgba(255,20,147,0.2)";
                    e.currentTarget.style.boxShadow = "none";
                }}
            >
                <Save style={{ width: 12, height: 12 }} />
                <span style={{ ...monoStyle, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Save
                </span>
            </button>

            {/* Load */}
            <button
                onClick={onLoad}
                title="Load from Storage"
                style={{
                    ...btnBase,
                    height: 32,
                    padding: "0 10px",
                    gap: 5,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,20,147,0.18)";
                    e.currentTarget.style.borderColor = "rgba(255,20,147,0.6)";
                    e.currentTarget.style.boxShadow = "0 0 8px rgba(255,20,147,0.3)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,20,147,0.06)";
                    e.currentTarget.style.borderColor = "rgba(255,20,147,0.2)";
                    e.currentTarget.style.boxShadow = "none";
                }}
            >
                <FolderOpen style={{ width: 12, height: 12 }} />
                <span style={{ ...monoStyle, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Load
                </span>
            </button>

            {/* Divider */}
            <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.08)", flexShrink: 0 }} />

            {/* Camera toggle */}
            <button
                onClick={onToggleCamera}
                title={isCameraRunning ? "Stop Camera" : "Start Camera"}
                style={{
                    ...btnBase,
                    height: 32,
                    padding: "0 12px",
                    gap: 6,
                    border: isCameraRunning
                        ? "1px solid rgba(239,68,68,0.35)"
                        : "1px solid rgba(52,211,153,0.35)",
                    background: isCameraRunning
                        ? "rgba(239,68,68,0.08)"
                        : "rgba(52,211,153,0.08)",
                    color: isCameraRunning ? "#fca5a5" : "#86efac",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = isCameraRunning
                        ? "rgba(239,68,68,0.18)"
                        : "rgba(52,211,153,0.18)";
                    e.currentTarget.style.boxShadow = isCameraRunning
                        ? "0 0 8px rgba(239,68,68,0.3)"
                        : "0 0 8px rgba(52,211,153,0.3)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = isCameraRunning
                        ? "rgba(239,68,68,0.08)"
                        : "rgba(52,211,153,0.08)";
                    e.currentTarget.style.boxShadow = "none";
                }}
            >
                {isCameraRunning ? (
                    <CameraOff style={{ width: 13, height: 13 }} />
                ) : (
                    <Camera style={{ width: 13, height: 13 }} />
                )}
                <span style={{ ...monoStyle, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {isCameraRunning ? "Stop" : "Start"}
                </span>
            </button>
        </div>
    );
}

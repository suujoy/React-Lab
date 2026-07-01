import React, { useEffect, useRef, useState } from "react";
import { useHandTracking } from "../hooks/UsehandTracking";
import HandCanvasOverlay from "../components/HandCanvasOverlay";
import GestureHelpPanel from "../components/GestureHelpPanel";
import ControlDock from "../components/ControlDock";
import AirCanvas, { COLOR_MAP, BRUSH_SIZES, ERASER_RADIUS } from "../components/AirCanvas";
import { TelemetryHUD, CameraStatusPill } from "../components/ARStatusBar";

const STORAGE_KEY = "air_draw_strokes";

export default function HandGestureDetector() {
    const [strokes, setStrokes] = useState([]);
    const [activeColor, setActiveColor] = useState("pink");
    const [brushSize, setBrushSize] = useState(BRUSH_SIZES.m);
    const [toast, setToast] = useState("");
    const [cursor, setCursor] = useState({ point: null, tool: "idle" });
    const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

    const toastTimeoutRef = useRef(null);
    const showToast = (message) => {
        setToast(message);
        clearTimeout(toastTimeoutRef.current);
        toastTimeoutRef.current = setTimeout(() => setToast(""), 2200);
    };

    // Load any drawing saved from a previous session.
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setStrokes(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse saved drawing", e);
            }
        }
        return () => clearTimeout(toastTimeoutRef.current);
    }, []);

    // Collapse the gesture panel on small screens by default.
    useEffect(() => {
        const mql = window.matchMedia("(max-width: 640px)");
        if (mql.matches) setIsPanelCollapsed(true);
        const handler = (e) => {
            if (e.matches) setIsPanelCollapsed(true);
        };
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);

    const {
        videoRef,
        canvasRef,
        isRunning,
        statusText,
        gestureIds,
        handPositions,
        startCamera,
        stopCamera,
    } = useHandTracking();

    const handleAddStroke = (stroke) => {
        setStrokes((current) => [...current, stroke]);
    };

    const handleUndo = () => {
        setStrokes((current) => current.slice(0, -1));
    };

    const handleClear = () => {
        setStrokes([]);
    };

    const handleSave = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(strokes));
        showToast("Drawing Saved!");
    };

    const handleLoad = () => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setStrokes(JSON.parse(saved));
                showToast("Drawing Loaded!");
            } catch (e) {
                console.error(e);
            }
        } else {
            showToast("No saved drawing found.");
        }
    };

    const handleToggleCamera = () => {
        if (isRunning) {
            stopCamera();
        } else {
            startCamera();
        }
    };

    // Designated primary hand for drawing actions (hand 0).
    const activeGesture = gestureIds[0] || "none";
    const activeHandNDC = handPositions[0] || { x: 0, y: 0 };

    // Gesture shortcuts: fire once per transition into the gesture, not
    // every frame it's held — mirrors the debouncing already done inside
    // useHandTracking for gesture stability.
    const previousGestureRef = useRef("none");
    useEffect(() => {
        const enteredGesture =
            activeGesture !== previousGestureRef.current ? activeGesture : null;
        previousGestureRef.current = activeGesture;
        if (!enteredGesture) return;

        if (enteredGesture === "peace") {
            setStrokes((current) => {
                if (current.length === 0) return current;
                showToast("Stroke Undone");
                return current.slice(0, -1);
            });
        } else if (enteredGesture === "thumbs_up") {
            showToast("Drawing Saved!");
            setStrokes((current) => {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
                return current;
            });
        } else if (enteredGesture === "thumbs_down") {
            setStrokes((current) => {
                if (current.length === 0) return current;
                showToast("Drawing Cleared");
                return [];
            });
        }
    }, [activeGesture]);

    const cursorColor =
        cursor.tool === "eraser" ? "#ff4d6d" : COLOR_MAP[activeColor] ?? COLOR_MAP.pink;

    return (
        <div
            className="fixed inset-0 overflow-hidden"
            style={{
                width: "100vw",
                height: "100dvh",
                background: "#000",
                fontFamily: "'Sora', sans-serif",
                userSelect: "none",
            }}
        >
            {/* ── Layer 0: Full-screen webcam background ────────────────────── */}
            <div className="absolute inset-0" style={{ zIndex: 0 }}>
                <video
                    ref={videoRef}
                    playsInline
                    muted
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transform: "scaleX(-1)",
                        filter: "brightness(0.68) contrast(1.08) saturate(0.9)",
                        display: "block",
                    }}
                />
                {/* Scanline overlay */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)",
                        zIndex: 1,
                    }}
                />
                {/* Vignette */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.55) 100%)",
                        zIndex: 2,
                    }}
                />
            </div>

            {/* ── Layer 10: Hand skeleton canvas ────────────────────────────── */}
            <div className="pointer-events-none absolute inset-0" style={{ zIndex: 10 }}>
                <HandCanvasOverlay ref={canvasRef} />
            </div>

            {/* ── Layer 20: Flat air-draw canvas (transparent bg) ────────────── */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
                <AirCanvas
                    strokes={strokes}
                    onAddStroke={handleAddStroke}
                    activeColor={activeColor}
                    brushSize={brushSize}
                    handNDC={activeHandNDC}
                    activeGesture={activeGesture}
                    onCursorChange={(point, tool) => setCursor({ point, tool })}
                />
            </div>

            {/* ── Layer 25: Live cursor reticle ───────────────────────────────── */}
            {cursor.point && (
                <div
                    className="pointer-events-none absolute"
                    style={{
                        zIndex: 25,
                        left: cursor.point.x,
                        top: cursor.point.y,
                        transform: "translate(-50%, -50%)",
                        width: cursor.tool === "eraser" ? ERASER_RADIUS * 2 : Math.max(16, brushSize * 2.2),
                        height: cursor.tool === "eraser" ? ERASER_RADIUS * 2 : Math.max(16, brushSize * 2.2),
                        borderRadius: "50%",
                        border: `2px solid ${cursorColor}`,
                        boxShadow: `0 0 12px ${cursorColor}, 0 0 24px ${cursorColor}80`,
                        background:
                            cursor.tool === "pen" ? `${cursorColor}33` : "transparent",
                        transition: "width 0.15s ease, height 0.15s ease",
                    }}
                />
            )}

            {/* ── Layer 30: Floating HUD panels ────────────────────────────── */}

            {/* Top-left: telemetry */}
            <div className="absolute pointer-events-none" style={{ top: 16, left: 16, zIndex: 30 }}>
                <TelemetryHUD cursor={cursor} strokeCount={strokes.length} statusText={statusText} />
            </div>

            {/* Top-right: Camera status */}
            <div className="absolute pointer-events-none" style={{ top: 16, right: 16, zIndex: 30 }}>
                <CameraStatusPill isRunning={isRunning} />
            </div>

            {/* Left-center: Gesture Command Deck (vertically centered) */}
            <div
                className="absolute pointer-events-auto"
                style={{ left: 16, top: "50%", transform: "translateY(-50%)", zIndex: 30 }}
            >
                <GestureHelpPanel
                    activeGesture={activeGesture}
                    isCollapsed={isPanelCollapsed}
                    onToggleCollapse={() => setIsPanelCollapsed(!isPanelCollapsed)}
                />
            </div>

            {/* Bottom-center: Control Dock */}
            <div
                className="absolute pointer-events-auto"
                style={{ bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 30 }}
            >
                <ControlDock
                    activeColor={activeColor}
                    onChangeColor={setActiveColor}
                    brushSize={brushSize}
                    onChangeBrushSize={setBrushSize}
                    onUndo={handleUndo}
                    onClear={handleClear}
                    onSave={handleSave}
                    onLoad={handleLoad}
                    strokeCount={strokes.length}
                    isCameraRunning={isRunning}
                    onToggleCamera={handleToggleCamera}
                />
            </div>

            {/* ── Layer 40: Toast notification ──────────────────────────────── */}
            {toast && (
                <div
                    className="absolute pointer-events-none"
                    style={{
                        top: 20,
                        left: "50%",
                        zIndex: 40,
                        background: "rgba(0,0,0,0.82)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        border: "1px solid rgba(255,20,147,0.5)",
                        borderRadius: "5px",
                        padding: "8px 20px",
                        boxShadow: "0 0 24px rgba(255,20,147,0.45), 0 4px 20px rgba(0,0,0,0.5)",
                        whiteSpace: "nowrap",
                        animation: "slide-down 0.25s ease forwards",
                        transform: "translateX(-50%)",
                    }}
                >
                    <span
                        style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#fff",
                            textTransform: "uppercase",
                            letterSpacing: "0.14em",
                        }}
                    >
                        ✦ {toast}
                    </span>
                </div>
            )}
        </div>
    );
}

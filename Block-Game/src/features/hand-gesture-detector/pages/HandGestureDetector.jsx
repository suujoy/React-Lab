import React, { useRef, useState, useEffect } from "react";
import { useHandTracking } from "../hooks/UsehandTracking";
import HandCanvasOverlay from "../components/HandCanvasOverlay";
import GestureHelpPanel from "../components/GestureHelpPanel";
import ControlDock from "../components/ControlDock";
import VoxelGridCanvas from "../components/VoxelGridCanvas";
import { TelemetryHUD, CameraStatusPill } from "../components/ARStatusBar";

export default function HandGestureDetector() {
    const [blocks, setBlocks] = useState([]);
    const [activeColor, setActiveColor] = useState("pink");
    const [saveMessage, setSaveMessage] = useState("");
    const [hoveredCell, setHoveredCell] = useState(null);
    const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

    // Load initial blocks if saved
    useEffect(() => {
        const saved = localStorage.getItem("air_blocks");
        if (saved) {
            try {
                setBlocks(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse saved blocks", e);
            }
        }
    }, []);

    // Collapse gesture panel on small screens by default
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

    // Map active color keys to colors
    const COLOR_MAP = {
        pink: "#ff1493",
        cyan: "#00f0ff",
        purple: "#bd00ff",
        orange: "#ff8c00",
    };

    const handleAddBlock = (position) => {
        setBlocks((current) => {
            const exists = current.some(
                (b) =>
                    b.position[0] === position[0] &&
                    b.position[1] === position[1] &&
                    b.position[2] === position[2]
            );
            if (exists) return current;

            return [
                ...current,
                {
                    id: `${position[0]}_${position[1]}_${position[2]}_${Date.now()}`,
                    position,
                    color: COLOR_MAP[activeColor],
                },
            ];
        });
    };

    const handleRemoveBlock = (position) => {
        setBlocks((current) =>
            current.filter(
                (b) =>
                    !(
                        b.position[0] === position[0] &&
                        b.position[1] === position[1] &&
                        b.position[2] === position[2]
                    )
            )
        );
    };

    const handleUndo = () => {
        setBlocks((current) => current.slice(0, -1));
    };

    const handleClear = () => {
        setBlocks([]);
    };

    const handleSave = () => {
        localStorage.setItem("air_blocks", JSON.stringify(blocks));
        setSaveMessage("AR Model Saved!");
        setTimeout(() => setSaveMessage(""), 2500);
    };

    const handleLoad = () => {
        const saved = localStorage.getItem("air_blocks");
        if (saved) {
            try {
                setBlocks(JSON.parse(saved));
                setSaveMessage("AR Model Loaded!");
                setTimeout(() => setSaveMessage(""), 2500);
            } catch (e) {
                console.error(e);
            }
        } else {
            setSaveMessage("No saved model found.");
            setTimeout(() => setSaveMessage(""), 2500);
        }
    };

    const handleToggleCamera = () => {
        if (isRunning) {
            stopCamera();
        } else {
            startCamera();
        }
    };

    // Designated primary hand for building actions (hand 0)
    const activeGesture = gestureIds[0] || "none";
    const activeHandNDC = handPositions[0] || { x: 0, y: 0 };

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

            {/* ── Layer 20: Three.js voxel scene (transparent bg) ───────────── */}
            <div className="absolute inset-0 pointer-events-auto" style={{ zIndex: 20 }}>
                <VoxelGridCanvas
                    blocks={blocks}
                    onAddBlock={handleAddBlock}
                    onRemoveBlock={handleRemoveBlock}
                    activeColor={activeColor}
                    handNDC={activeHandNDC}
                    activeGesture={activeGesture}
                    onTargetCellChange={setHoveredCell}
                />
            </div>

            {/* ── Layer 30: Floating HUD panels ────────────────────────────── */}

            {/* Top-left: AR Telemetry */}
            <div
                className="absolute pointer-events-none"
                style={{ top: 16, left: 16, zIndex: 30 }}
            >
                <TelemetryHUD
                    hoveredCell={hoveredCell}
                    blocks={blocks.length}
                    statusText={statusText}
                />
            </div>

            {/* Top-right: Camera status */}
            <div
                className="absolute pointer-events-none"
                style={{ top: 16, right: 16, zIndex: 30 }}
            >
                <CameraStatusPill isRunning={isRunning} />
            </div>

            {/* Left-center: Gesture Command Deck (vertically centered) */}
            <div
                className="absolute pointer-events-auto"
                style={{
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 30,
                }}
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
                style={{
                    bottom: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 30,
                }}
            >
                <ControlDock
                    activeColor={activeColor}
                    onChangeColor={setActiveColor}
                    onUndo={handleUndo}
                    onClear={handleClear}
                    onSave={handleSave}
                    onLoad={handleLoad}
                    voxelCount={blocks.length}
                    isCameraRunning={isRunning}
                    onToggleCamera={handleToggleCamera}
                    statusText={statusText}
                />
            </div>

            {/* ── Layer 40: Toast notification ──────────────────────────────── */}
            {saveMessage && (
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
                        ✦ {saveMessage}
                    </span>
                </div>
            )}
        </div>
    );
}

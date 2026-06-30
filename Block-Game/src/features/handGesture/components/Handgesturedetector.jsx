import { useEffect, useRef, useState } from "react";
import "@mediapipe/hands";
import "@mediapipe/camera_utils";

const { Hands, HAND_CONNECTIONS, Camera } = globalThis;

const GESTURES = {
    open_palm: { emoji: "Open", label: "Open Palm", action: "Idle / Nothing" },
    pinch: {
        emoji: "Pinch",
        label: "Pinch (Thumb + Index)",
        action: "Move cursor",
    },
    pinch_hold: { emoji: "Hold", label: "Pinch + Hold", action: "Place block" },
    fist: { emoji: "Fist", label: "Fist", action: "Delete block" },
    index: { emoji: "Point", label: "Index Finger", action: "Point / Aim" },
    peace: { emoji: "Peace", label: "Peace Sign", action: "Switch build mode" },
    thumbs_up: { emoji: "Up", label: "Thumbs Up", action: "Confirm / Save" },
    thumbs_down: { emoji: "Down", label: "Thumbs Down", action: "Undo" },
    spread: {
        emoji: "Spread",
        label: "Five Fingers Spread",
        action: "Reset selection",
    },
    three: { emoji: "Three", label: "Three Fingers", action: "Rotate block" },
    none: { emoji: "None", label: "No hand detected", action: "-" },
};

const PINCH_HOLD_MS = 800;

function getCoverRect(sourceWidth, sourceHeight, targetWidth, targetHeight) {
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

function mapLandmarkToCanvas(landmark, rect) {
    return {
        x: rect.x + landmark.x * rect.width,
        y: rect.y + landmark.y * rect.height,
    };
}

function drawHand(ctx, landmarks, rect, connectorColor, pointColor) {
    ctx.save();
    ctx.strokeStyle = connectorColor;
    ctx.lineWidth = 3;

    HAND_CONNECTIONS.forEach(([startIndex, endIndex]) => {
        const start = mapLandmarkToCanvas(landmarks[startIndex], rect);
        const end = mapLandmarkToCanvas(landmarks[endIndex], rect);

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    });

    ctx.fillStyle = pointColor;
    landmarks.forEach((landmark) => {
        const point = mapLandmarkToCanvas(landmark, rect);
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.restore();
}

function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0));
}

function getExtendedFingers(landmarks) {
    const wrist = landmarks[0];

    const isFingerExtended = (tipIndex, midJointIndex) => {
        const tipDistance = distance(landmarks[tipIndex], wrist);
        const midDistance = distance(landmarks[midJointIndex], wrist);
        return tipDistance > midDistance * 1.15;
    };

    const pinkyBase = landmarks[17];
    const thumbExtended =
        distance(landmarks[4], pinkyBase) >
        distance(landmarks[3], pinkyBase) * 1.05;

    return {
        thumb: thumbExtended,
        index: isFingerExtended(8, 6),
        middle: isFingerExtended(12, 10),
        ring: isFingerExtended(16, 14),
        pinky: isFingerExtended(20, 18),
    };
}

function classifyGesture(landmarks, pinchState) {
    const fingers = getExtendedFingers(landmarks);
    const handScale = distance(landmarks[0], landmarks[9]);
    const pinchDistance = distance(landmarks[4], landmarks[8]);
    const isPinching = pinchDistance < handScale * 0.45;

    if (isPinching) {
        if (pinchState.current === null) pinchState.current = Date.now();
        const heldFor = Date.now() - pinchState.current;
        return heldFor >= PINCH_HOLD_MS ? "pinch_hold" : "pinch";
    }
    pinchState.current = null;

    const { thumb, index, middle, ring, pinky } = fingers;
    const extendedCount = [thumb, index, middle, ring, pinky].filter(
        Boolean,
    ).length;

    if (extendedCount === 0) return "fist";
    if (thumb && !index && !middle && !ring && !pinky) {
        return landmarks[4].y < landmarks[0].y ? "thumbs_up" : "thumbs_down";
    }
    if (!thumb && index && !middle && !ring && !pinky) return "index";
    if (index && middle && !ring && !pinky) return "peace";
    if (index && middle && ring && !pinky) return "three";

    if (thumb && index && middle && ring && pinky) {
        const spread = distance(landmarks[8], landmarks[20]);
        return spread > handScale * 1.3 ? "spread" : "open_palm";
    }

    return "open_palm";
}

export default function HandGestureDetector() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const handsRef = useRef(null);
    const cameraRef = useRef(null);
    const pinchStartRef = useRef([null, null]);
    const runningRef = useRef(false);

    const [isRunning, setIsRunning] = useState(false);
    const [statusText, setStatusText] = useState("Camera off");
    const [gestureIds, setGestureIds] = useState(["none", "none"]);

    const handleResults = (results) => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;

        const canvasWidth = canvas.clientWidth || window.innerWidth;
        const canvasHeight = canvas.clientHeight || window.innerHeight;
        const videoWidth = video.videoWidth || 640;
        const videoHeight = video.videoHeight || 480;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const coverRect = getCoverRect(
            videoWidth,
            videoHeight,
            canvasWidth,
            canvasHeight,
        );

        const hands = results.multiHandLandmarks?.slice(0, 2) || [];

        if (!hands.length) {
            pinchStartRef.current = [null, null];
            setGestureIds(["none", "none"]);
            return;
        }

        const nextGestureIds = ["none", "none"];

        hands.forEach((hand, index) => {
            drawHand(
                ctx,
                hand,
                coverRect,
                index === 0 ? "#ffb020" : "#22c55e",
                index === 0 ? "#ffffff" : "#93c5fd",
            );

            const pinchState = { current: pinchStartRef.current[index] };
            nextGestureIds[index] = classifyGesture(hand, pinchState);
            pinchStartRef.current[index] = pinchState.current;
        });

        for (let i = hands.length; i < 2; i += 1) {
            pinchStartRef.current[i] = null;
        }

        setGestureIds(nextGestureIds);
    };

    useEffect(() => {
        const hands = new Hands({
            locateFile: (file) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
            selfieMode: true,
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.6,
            minTrackingConfidence: 0.6,
        });
        hands.onResults(handleResults);
        handsRef.current = hands;

        return () => {
            runningRef.current = false;
            cameraRef.current?.stop();
            hands.close();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startCamera = async () => {
        try {
            if (!Hands || !HAND_CONNECTIONS || !Camera) {
                throw new Error("MediaPipe runtime failed to load");
            }

            runningRef.current = true;
            const camera = new Camera(videoRef.current, {
                onFrame: async () => {
                    if (runningRef.current) {
                        await handsRef.current.send({
                            image: videoRef.current,
                        });
                    }
                },
                width: window.innerWidth,
                height: window.innerHeight,
            });

            await camera.start();
            cameraRef.current = camera;
            setIsRunning(true);
            setStatusText("Camera on - detecting up to 2 hands");
        } catch (err) {
            setStatusText(`Camera error: ${err.message}`);
        }
    };

    const stopCamera = () => {
        runningRef.current = false;
        cameraRef.current?.stop();
        cameraRef.current = null;

        const stream = videoRef.current?.srcObject;
        stream?.getTracks().forEach((track) => track.stop());
        if (videoRef.current) videoRef.current.srcObject = null;

        const ctx = canvasRef.current?.getContext("2d");
        ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        pinchStartRef.current = [null, null];
        setGestureIds(["none", "none"]);
        setIsRunning(false);
        setStatusText("Camera off");
    };

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-black text-white">
            <video
                ref={videoRef}
                playsInline
                muted
                className="absolute inset-0 h-full w-full object-cover -scale-x-100"
            />
            <canvas
                ref={canvasRef}
                className="absolute inset-0 h-full w-full"
            />

            <div className="absolute inset-x-0 top-0 z-10 flex flex-col gap-4 bg-gradient-to-b from-black/85 via-black/35 to-transparent p-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Hand Gesture Control</h1>
                    <p className="text-sm text-gray-300">
                        Full-screen video with 2-hand gesture detection
                    </p>
                    <p className="mt-2 text-xs text-gray-300">{statusText}</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={startCamera}
                        disabled={isRunning}
                        className="rounded-lg bg-green-600 px-5 py-2 font-semibold disabled:opacity-40"
                    >
                        Start Camera
                    </button>
                    <button
                        onClick={stopCamera}
                        disabled={!isRunning}
                        className="rounded-lg bg-red-600 px-5 py-2 font-semibold disabled:opacity-40"
                    >
                        Stop Camera
                    </button>
                </div>
            </div>

            <div className="absolute inset-x-4 bottom-4 z-10 grid gap-3 md:grid-cols-2">
                {[0, 1].map((index) => {
                    const current =
                        GESTURES[gestureIds[index] || "none"] || GESTURES.none;

                    return (
                        <div
                            key={index}
                            className="rounded-2xl border border-white/10 bg-black/55 p-4 backdrop-blur-md"
                        >
                            <div className="text-xs uppercase tracking-[0.2em] text-gray-400">
                                Hand {index + 1}
                            </div>
                            <div className="mt-2 text-xl font-bold text-amber-400">
                                {current.label}
                            </div>
                            <div className="mt-1 text-sm text-cyan-300">
                                {current.action}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

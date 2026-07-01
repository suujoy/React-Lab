import { useEffect, useRef, useState } from "react";

import { getCoverRect, landmarkToCanvasPoint } from "../lib/geometry";
import { drawHandSkeleton } from "../components/HandCanvasOverlay";
import {
    createHandState,
    updateHandStateWithGesture,
    updateHandStateAsMissing,
} from "../lib/handStateTracker";

// MediaPipe attaches these to the global scope once the scripts above load.
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

const PROCESS_EVERY_N_FRAMES = 2; // skip frames to save CPU (classify every 2nd frame)

// Owns every imperative/lifecycle piece: MediaPipe setup, the camera object,
// per-frame classification, and canvas drawing. Everything else in the app
// stays declarative and just consumes the returned refs + state.
//
// onPinchHold(ndcX, ndcY) and onFist() are optional callbacks, fired once
// per gesture transition (not every frame it's held) — e.g. to draw or
// erase on a canvas. ndcX/ndcY are normalized device coords in [-1, 1].
export function useHandTracking({ onPinchHold, onFist } = {}) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const handsRef = useRef(null);
    const cameraRef = useRef(null);
    const isRunningRef = useRef(false);
    const frameCountRef = useRef(0);

    // Fixed-size array: index 0 = first detected hand, index 1 = second hand.
    const handStatesRef = useRef([createHandState(), createHandState()]);
    // Previous frame's stable gesture per hand, used to fire callbacks only
    // on the transition into a gesture rather than on every frame it's held.
    const previousStableRef = useRef(["none", "none"]);
    // Latest callbacks, kept in a ref so handleResults doesn't need to be
    // recreated (and MediaPipe re-wired) whenever the caller passes new
    // inline function props.
    const callbacksRef = useRef({ onPinchHold, onFist });
    callbacksRef.current = { onPinchHold, onFist };

    const [isRunning, setIsRunning] = useState(false);
    const [statusText, setStatusText] = useState("Camera off");
    const [gestureIds, setGestureIds] = useState(["none", "none"]);
    const [handPositions, setHandPositions] = useState([
        { x: 0, y: 0 },
        { x: 0, y: 0 },
    ]);

    const smoothedPositionsRef = useRef([
        { x: 0, y: 0 },
        { x: 0, y: 0 },
    ]);

    // Called by MediaPipe on every processed video frame.
    const handleResults = (results) => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;

        frameCountRef.current += 1;
        const shouldClassify =
            frameCountRef.current % PROCESS_EVERY_N_FRAMES === 0;

        // Match canvas resolution to its displayed size, and figure out how the
        // video maps onto it (since the video is shown "cover"-style, full-bleed).
        canvas.width = canvas.clientWidth || window.innerWidth;
        canvas.height = canvas.clientHeight || window.innerHeight;
        const coverRect = getCoverRect(
            video.videoWidth || 640,
            video.videoHeight || 480,
            canvas.width,
            canvas.height,
        );

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const detectedHands = results.multiHandLandmarks?.slice(0, 2) || [];
        const nextGestureIds = ["none", "none"];
        const nextHandPositions = [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
        ];

        // Update up to 2 hand slots. Slots with no detected hand this frame
        // just tick their "missing" counter instead of drawing anything.
        for (let slot = 0; slot < 2; slot += 1) {
            const handState = handStatesRef.current[slot];
            const landmarks = detectedHands[slot];

            if (landmarks) {
                drawHandSkeleton(
                    ctx,
                    landmarks,
                    coverRect,
                    HAND_CONNECTIONS,
                    slot === 0 ? "#ff1493" : "#00f0ff", // Pink for primary hand, Cyan for secondary hand
                    slot === 0 ? "#ffffff" : "#ffffff",
                );
                updateHandStateWithGesture(
                    handState,
                    landmarks,
                    shouldClassify,
                );

                // Pinch point = midpoint between thumb tip (4) and index tip (8)
                const thumbTip = landmarks[4];
                const indexTip = landmarks[8];
                const pinchMidpoint = {
                    x: (thumbTip.x + indexTip.x) / 2,
                    y: (thumbTip.y + indexTip.y) / 2,
                };

                // Use index tip for general aiming, and pinchMidpoint when pinching/building
                const isPinching =
                    handState.stableGesture === "pinch" ||
                    handState.stableGesture === "pinch_hold";
                const activePointer = isPinching ? pinchMidpoint : indexTip;

                const canvasPoint = landmarkToCanvasPoint(
                    activePointer,
                    coverRect,
                );
                const rawNdcX = (canvasPoint.x / canvas.width) * 2 - 1;
                const rawNdcY = -((canvasPoint.y / canvas.height) * 2 - 1);

                // Exponential smoothing (alpha = 0.25 for a good balance of responsiveness and stability)
                const alpha = 0.25;
                const prevPos = smoothedPositionsRef.current[slot];
                const isFirstDetected = prevPos.x === 0 && prevPos.y === 0;

                const ndcX = isFirstDetected
                    ? rawNdcX
                    : alpha * rawNdcX + (1 - alpha) * prevPos.x;
                const ndcY = isFirstDetected
                    ? rawNdcY
                    : alpha * rawNdcY + (1 - alpha) * prevPos.y;

                smoothedPositionsRef.current[slot] = { x: ndcX, y: ndcY };
                nextHandPositions[slot] = { x: ndcX, y: ndcY };
            } else {
                updateHandStateAsMissing(handState, shouldClassify);
                smoothedPositionsRef.current[slot] = { x: 0, y: 0 };
                nextHandPositions[slot] = { x: 0, y: 0 };
            }

            nextGestureIds[slot] = handState.stableGesture;

            // Fire legacy callbacks if needed (for backwards compatibility)
            const justEntered = (gesture) =>
                nextGestureIds[slot] === gesture &&
                previousStableRef.current[slot] !== gesture;

            if (
                landmarks &&
                justEntered("pinch_hold") &&
                callbacksRef.current.onPinchHold
            ) {
                const pos = smoothedPositionsRef.current[slot];
                callbacksRef.current.onPinchHold(pos.x, pos.y);
            }

            if (justEntered("fist") && callbacksRef.current.onFist) {
                callbacksRef.current.onFist();
            }
        }

        previousStableRef.current = nextGestureIds;

        setGestureIds((current) =>
            current[0] === nextGestureIds[0] && current[1] === nextGestureIds[1]
                ? current
                : nextGestureIds,
        );

        setHandPositions((current) =>
            current[0].x === nextHandPositions[0].x &&
            current[0].y === nextHandPositions[0].y &&
            current[1].x === nextHandPositions[1].x &&
            current[1].y === nextHandPositions[1].y
                ? current
                : nextHandPositions,
        );
    };

    // Set up the MediaPipe Hands model once when the hook mounts.
    useEffect(() => {
        const hands = new Hands({
            locateFile: (file) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
            selfieMode: true,
            maxNumHands: 2,
            modelComplexity: 1, // 0 = fastest/least accurate, 1 = balanced, good default
            minDetectionConfidence: 0.75, // higher = fewer false positives, but may miss hands in bad lighting
            minTrackingConfidence: 0.75,
        });
        hands.onResults(handleResults);
        handsRef.current = hands;

        return () => {
            isRunningRef.current = false;
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

            isRunningRef.current = true;
            const camera = new Camera(videoRef.current, {
                onFrame: async () => {
                    if (isRunningRef.current) {
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
            setStatusText("Camera on — detecting up to 2 hands");
        } catch (err) {
            setStatusText(`Camera error: ${err.message}`);
        }
    };

    const stopCamera = () => {
        isRunningRef.current = false;
        cameraRef.current?.stop();
        cameraRef.current = null;

        const stream = videoRef.current?.srcObject;
        stream?.getTracks().forEach((track) => track.stop());
        if (videoRef.current) videoRef.current.srcObject = null;

        const ctx = canvasRef.current?.getContext("2d");
        ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        handStatesRef.current = [createHandState(), createHandState()];
        frameCountRef.current = 0;
        setGestureIds(["none", "none"]);
        setIsRunning(false);
        setStatusText("Camera off");
    };

    return {
        videoRef,
        canvasRef,
        isRunning,
        statusText,
        gestureIds,
        handPositions,
        startCamera,
        stopCamera,
    };
}
console.log({
    Hands,
    Camera,
    HAND_CONNECTIONS,
});

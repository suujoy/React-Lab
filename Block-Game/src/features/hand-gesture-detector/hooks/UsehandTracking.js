import { useEffect, useRef, useState } from "react";
import "@mediapipe/hands";
import "@mediapipe/camera_utils";
import { getCoverRect, landmarkToCanvasPoint } from "../lib/geometry";
import { drawHandSkeleton } from "../components/HandCanvasOverlay";
import {
    createHandState,
    updateHandStateWithGesture,
    updateHandStateAsMissing,
} from "../lib/handStateTracker";

// MediaPipe attaches these to the global scope once the scripts above load.
const { Hands, HAND_CONNECTIONS, Camera } = globalThis;

const PROCESS_EVERY_N_FRAMES = 2; // skip frames to save CPU (classify every 2nd frame)

// Owns every imperative/lifecycle piece: MediaPipe setup, the camera object,
// per-frame classification, and canvas drawing. Everything else in the app
// stays declarative and just consumes the returned refs + state.
//
// onPinchHold(ndcX, ndcY) and onFist() are optional callbacks, fired once
// per gesture transition (not every frame it's held) — e.g. to place or
// remove a block in a 3D scene. ndcX/ndcY are normalized device coords
// in [-1, 1], suitable for Three.js unprojection.
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
                    slot === 0 ? "#ffb020" : "#22c55e",
                    slot === 0 ? "#ffffff" : "#93c5fd",
                );
                updateHandStateWithGesture(
                    handState,
                    landmarks,
                    shouldClassify,
                );
            } else {
                updateHandStateAsMissing(handState, shouldClassify);
            }

            nextGestureIds[slot] = handState.stableGesture;

            // Fire callbacks only on the transition INTO a gesture, not every
            // frame it's held — otherwise pinch_hold would re-place the block
            // dozens of times per second.
            const justEntered = (gesture) =>
                nextGestureIds[slot] === gesture &&
                previousStableRef.current[slot] !== gesture;

            if (
                landmarks &&
                justEntered("pinch_hold") &&
                callbacksRef.current.onPinchHold
            ) {
                // Pinch point = midpoint between thumb tip (landmark 4) and index
                // tip (landmark 8), converted from video-normalized space to
                // canvas pixels, then to Three.js normalized device coordinates
                // (x and y each in [-1, 1], with y flipped since canvas Y grows
                // downward but NDC Y grows upward).
                const thumbTip = landmarks[4];
                const indexTip = landmarks[8];
                const pinchMidpoint = {
                    x: (thumbTip.x + indexTip.x) / 2,
                    y: (thumbTip.y + indexTip.y) / 2,
                };
                const canvasPoint = landmarkToCanvasPoint(
                    pinchMidpoint,
                    coverRect,
                );
                const ndcX = (canvasPoint.x / canvas.width) * 2 - 1;
                const ndcY = -((canvasPoint.y / canvas.height) * 2 - 1);
                callbacksRef.current.onPinchHold(ndcX, ndcY);
            }

            if (justEntered("fist") && callbacksRef.current.onFist) {
                callbacksRef.current.onFist();
            }
        }

        previousStableRef.current = nextGestureIds;

        setGestureIds((current) =>
            current[0] === nextGestureIds[0] && current[1] === nextGestureIds[1]
                ? current // avoid a pointless re-render if nothing changed
                : nextGestureIds,
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
        startCamera,
        stopCamera,
    };
}

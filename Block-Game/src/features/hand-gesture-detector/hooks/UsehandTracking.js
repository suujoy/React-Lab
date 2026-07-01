import { useEffect, useRef, useState } from "react";
import "@mediapipe/hands";
import "@mediapipe/camera_utils";
import { drawHandSkeleton } from "../components/HandCanvasOverlay";
import {
    createHandState,
    updateHandStateWithGesture,
    updateHandStateAsMissing,
} from "../lib/handStateTracker";
import { getCoverRect } from "../lib/geometry";

// MediaPipe attaches these to the global scope once the scripts above load.
const { Hands, HAND_CONNECTIONS, Camera } = globalThis;

const PROCESS_EVERY_N_FRAMES = 2; // skip frames to save CPU (classify every 2nd frame)

// Owns every imperative/lifecycle piece: MediaPipe setup, the camera object,
// per-frame classification, and canvas drawing. Everything else in the app
// stays declarative and just consumes the returned refs + state.
export function useHandTracking() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const handsRef = useRef(null);
    const cameraRef = useRef(null);
    const isRunningRef = useRef(false);
    const frameCountRef = useRef(0);

    // Fixed-size array: index 0 = first detected hand, index 1 = second hand.
    const handStatesRef = useRef([createHandState(), createHandState()]);

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
        }

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

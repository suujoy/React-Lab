import { useHandTracking } from "../hooks/Usehandtracking";
import HandCanvasOverlay from "../components/HandCanvasOverlay";
import CameraControls from "../components/CameraControls";
import GestureStatusPanel from "../components/GestureStatusPanel";

// Top-level component: just wiring. All logic lives in useHandTracking();
// all presentation lives in the child components below.
export default function HandGestureDetector() {
    const {
        videoRef,
        canvasRef,
        isRunning,
        statusText,
        gestureIds,
        startCamera,
        stopCamera,
    } = useHandTracking();

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-black text-white">
            {/* Raw camera feed, mirrored so it acts like a mirror */}
            <video
                ref={videoRef}
                playsInline
                muted
                className="absolute inset-0 h-full w-full object-cover -scale-x-100"
            />
            {/* Skeleton overlay drawn on top of the video */}
            <HandCanvasOverlay ref={canvasRef} />

            <CameraControls
                isRunning={isRunning}
                statusText={statusText}
                onStart={startCamera}
                onStop={stopCamera}
            />

            <div className="absolute inset-x-4 bottom-4 z-10 grid gap-3 md:grid-cols-2">
                <GestureStatusPanel handNumber={1} gestureId={gestureIds[0]} />
                <GestureStatusPanel handNumber={2} gestureId={gestureIds[1]} />
            </div>
        </div>
    );
}

// Purely presentational header bar: title, status text, start/stop buttons.
// All behavior is passed in as props — this component owns no state.
export default function CameraControls({
    isRunning,
    statusText,
    onStart,
    onStop,
}) {
    return (
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
                    onClick={onStart}
                    disabled={isRunning}
                    className="rounded-lg bg-green-600 px-5 py-2 font-semibold disabled:opacity-40"
                >
                    Start Camera
                </button>
                <button
                    onClick={onStop}
                    disabled={!isRunning}
                    className="rounded-lg bg-red-600 px-5 py-2 font-semibold disabled:opacity-40"
                >
                    Stop Camera
                </button>
            </div>
        </div>
    );
}

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { createBlockScene } from "../three/createBlockScene";

// Renders a transparent Three.js canvas containing exactly one block.
// Exposes placeBlockAt(ndcX, ndcY) and removeBlock() via ref so the
// gesture-tracking hook can control the block without owning any
// Three.js setup itself — this component is the only place that does.
const BlockCanvas = forwardRef(function BlockCanvas(_props, ref) {
    const canvasRef = useRef(null);
    const sceneApiRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const api = createBlockScene(canvas);
        sceneApiRef.current = api;
        api.resize(canvas.clientWidth, canvas.clientHeight);

        const handleResize = () =>
            api.resize(canvas.clientWidth, canvas.clientHeight);
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            api.destroy();
            sceneApiRef.current = null;
        };
    }, []);

    useImperativeHandle(ref, () => ({
        placeBlockAt: (ndcX, ndcY) =>
            sceneApiRef.current?.placeBlockAt(ndcX, ndcY),
        removeBlock: () => sceneApiRef.current?.removeBlock(),
    }));

    return (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    );
});

export default BlockCanvas;

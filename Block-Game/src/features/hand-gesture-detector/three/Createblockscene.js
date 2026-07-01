import * as THREE from "three";

// A minimal Three.js scene containing exactly one block (a cube).
// The block starts hidden and only appears once placeBlockAt() is called.
// Kept as a plain factory function (not a component) so it has zero
// React dependencies — easy to reason about, easy to swap out later.
export function createBlockScene(canvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio || 1);

    // Basic lighting so the cube reads as 3D instead of a flat silhouette.
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const block = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({ color: 0x22c55e }),
    );
    block.visible = false; // nothing placed until the first pinch-hold
    scene.add(block);

    let frameId = null;
    function renderLoop() {
        if (block.visible) block.rotation.y += 0.01; // slow idle spin, easier to read as 3D
        renderer.render(scene, camera);
        frameId = requestAnimationFrame(renderLoop);
    }
    renderLoop();

    function resize(width, height) {
        if (!width || !height) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
    }

    // ndcX/ndcY: normalized device coordinates, each in [-1, 1].
    // (0,0) is the center of the screen, matching standard Three.js NDC space.
    function placeBlockAt(ndcX, ndcY) {
        const pointOnNearPlane = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(
            camera,
        );
        const direction = pointOnNearPlane.sub(camera.position).normalize();
        // Project onto the z=0 plane in world space so the block always lands
        // at a consistent depth, regardless of camera position.
        const distanceToZeroPlane = -camera.position.z / direction.z;
        const worldPosition = camera.position
            .clone()
            .add(direction.multiplyScalar(distanceToZeroPlane));

        block.position.copy(worldPosition);
        block.visible = true;
    }

    function removeBlock() {
        block.visible = false;
    }

    function destroy() {
        cancelAnimationFrame(frameId);
        renderer.dispose();
        block.geometry.dispose();
        block.material.dispose();
    }

    return { resize, placeBlockAt, removeBlock, destroy };
}

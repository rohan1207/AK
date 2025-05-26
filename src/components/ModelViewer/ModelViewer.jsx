import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Html,
  Environment,
  ContactShadows,
  Stage,
} from "@react-three/drei";
import { motion } from "framer-motion";
import "./ModelViewer.scss";

function Model({ url }) {
  const { scene } = useGLTF(url);
  // Enhance material properties
  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material) {
        child.material.envMapIntensity = 1.5;
        child.material.needsUpdate = true;
      }
    }
  });
  return <primitive object={scene} scale={2} />;
}

function Loader() {
  return (
    <Html center>
      <div className="model-loader">
        <div className="loader-spinner"></div>
        <p>Loading 3D Model...</p>
      </div>
    </Html>
  );
}

// Camera keyboard navigation helper
function CameraNavigationControls() {
  const { camera } = useThree();
  const moveSpeed = 0.1;
  const keysPressed = useRef({});
  const velocity = useRef({ x: 0, y: 0, z: 0 });
  const dampingFactor = 0.92;

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default arrow key scrolling
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      keysPressed.current[e.key] = true;
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(() => {
    // Calculate target velocity based on keys pressed
    const targetVelocity = { x: 0, y: 0, z: 0 };

    if (keysPressed.current["ArrowUp"] && !keysPressed.current["Shift"])
      targetVelocity.z = -moveSpeed;
    if (keysPressed.current["ArrowDown"] && !keysPressed.current["Shift"])
      targetVelocity.z = moveSpeed;
    if (keysPressed.current["ArrowLeft"]) targetVelocity.x = -moveSpeed;
    if (keysPressed.current["ArrowRight"]) targetVelocity.x = moveSpeed;
    if (keysPressed.current["ArrowUp"] && keysPressed.current["Shift"])
      targetVelocity.y = moveSpeed;
    if (keysPressed.current["ArrowDown"] && keysPressed.current["Shift"])
      targetVelocity.y = -moveSpeed;

    // Smoothly interpolate velocity
    velocity.current.x += (targetVelocity.x - velocity.current.x) * 0.15;
    velocity.current.y += (targetVelocity.y - velocity.current.y) * 0.15;
    velocity.current.z += (targetVelocity.z - velocity.current.z) * 0.15;

    // Apply damping
    velocity.current.x *= dampingFactor;
    velocity.current.y *= dampingFactor;
    velocity.current.z *= dampingFactor;

    // Move camera
    camera.position.x += velocity.current.x;
    camera.position.y += velocity.current.y;
    camera.position.z += velocity.current.z;

    if (
      Math.abs(velocity.current.x) > 0.001 ||
      Math.abs(velocity.current.y) > 0.001 ||
      Math.abs(velocity.current.z) > 0.001
    ) {
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

const ModelViewer = ({ modelPath }) => {
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef();

  return (
    <div className="model-viewer">
      <div className="keyboard-controls-hint">
        <p>Keyboard Controls:</p>
        <ul>
          <li>↑/↓ : Move forward/backward</li>
          <li>←/→ : Move left/right</li>
          <li>Shift + ↑/↓ : Move up/down</li>
        </ul>
      </div>
      <div className="canvas-container">
        <Canvas
          ref={canvasRef}
          camera={{ position: [5, 5, 5], fov: 50 }}
          onCreated={() => setIsLoading(false)}
          style={{ width: "100%", height: "500px" }}
          shadows
          gl={{ preserveDrawingBuffer: true }}
        >
          {/* Stage provides a pre-configured environment with good defaults */}
          <Stage
            intensity={1.2}
            preset="rembrandt"
            shadows="contact"
            environment="city"
          >
            <Suspense fallback={<Loader />}>
              <Model url={modelPath} />
            </Suspense>
          </Stage>
          {/* Enhanced environment and shadows */}
          <Environment preset="city" background={false} />
          <ContactShadows
            position={[0, -0.5, 0]}
            opacity={0.75}
            scale={10}
            blur={2.5}
            far={4}
          />{" "}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={0}
            autoRotate={false}
          />
          <CameraNavigationControls />
          <CameraNavigationControls />
        </Canvas>
      </div>
    </div>
  );
};

export default ModelViewer;

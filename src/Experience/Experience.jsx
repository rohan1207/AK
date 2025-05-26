import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import Scene from "./Scene";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useToggleRoomStore } from "../stores/toggleRoomStore";
import { useResponsiveStore } from "../stores/useResponsiveStore";
import { useExperienceStore } from "../stores/experienceStore";

const Experience = () => {
  const cameraRef = useRef();
  const pointerRef = useRef({ x: 0, y: 0 });
  const { isExperienceReady } = useExperienceStore();
  const { isMobile } = useResponsiveStore();
  const [isLoading3D, setIsLoading3D] = useState(true);
  const [isModelReady, setIsModelReady] = useState(false);

  const {
    isDarkRoom,
    isTransitioning,
    setIsBeforeZooming,
    setIsTransitioning,
  } = useToggleRoomStore();

  const cameraPositions = {
    dark: {
      position: [
        -5.091815760151335 * 1.5,
        4.21834729421205 * 1.5,
        7.336889422492198 * 1.5,
      ],
    },
    light: {
     position: [-0.091815760151335, 17.21834729421205, 21.336889422492198],
    },
  };

  const zoomValues = {
    default: isMobile ? 65 : 110,
    animation: isMobile ? 65 : 110,
  };

  useEffect(() => {
    if (!cameraRef.current) return;

    cameraRef.current.zoom = zoomValues.default;
    cameraRef.current.updateProjectionMatrix();
  }, [isMobile]);

  useEffect(() => {
    if (!cameraRef.current || !isModelReady) return;

    const targetPosition = isDarkRoom
      ? cameraPositions.dark.position
      : cameraPositions.light.position;

    const t1 = gsap.timeline({
      onComplete: () => {
        setIsTransitioning(false);
      },
    });

    t1.to(cameraRef.current, {
      zoom: zoomValues.animation,
      duration: 1,
      ease: "power3.out",
      onStart: () => {
        setIsTransitioning(true);
        setIsBeforeZooming(true);
      },
      onUpdate: () => {
        cameraRef.current.updateProjectionMatrix();
      },
    }).to(cameraRef.current.position, {
      x: targetPosition[0],
      y: targetPosition[1],
      z: targetPosition[2],
      duration: 2.5,
      ease: "power3.inOut",
      onComplete: () => {
        setIsBeforeZooming(false);
      },
    });

    return () => {
      t1.kill();
    };
  }, [isDarkRoom, isModelReady]);

  useEffect(() => {
    const onPointerMove = (e) => {
      if (!isTransitioning) {
        pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointerRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      }
    };

    const onTouchMove = (e) => {
      if (!isTransitioning) {
        pointerRef.current.x =
          (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        pointerRef.current.y =
          -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("touchmove", onTouchMove);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [isTransitioning]);

  return (
    <>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {isLoading3D && (          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "rgba(0, 0, 0, 0.9)",
              zIndex: 2,
              opacity: isModelReady ? 0 : 1,
              transition: "opacity 0.8s ease",
              pointerEvents: isModelReady ? "none" : "auto",
            }}
          >
            <img
              src="/images/alt.png"
              alt="Loading placeholder"
              style={{
                width: "auto",
                height: "auto",
                maxWidth: "80%",
                maxHeight: "80vh",
                objectFit: "contain",
                filter: "brightness(1.2)",
                transform: "scale(0.95)",
                transition: "transform 0.3s ease",
                opacity: 0.9,
              }}
            />
          </div>
        )}
        <Canvas
          style={{
            position: "fixed",
            zIndex: isLoading3D ? 1 : 2,
            top: 0,
            left: 0,
          }}
          onCreated={() => {
            setTimeout(() => {
              setIsModelReady(true);
              setTimeout(() => setIsLoading3D(false), 500);
            }, 1000);
          }}
        >
          <OrthographicCamera
            ref={cameraRef}
            makeDefault
            position={cameraPositions.dark.position}
            rotation={[
              -0.6138097686916666,
              -0.6852967312960734,
              -0.41947779883392433,
            ]}
            zoom={zoomValues.default}
          />
          <Scene
            isDarkRoom={isDarkRoom}
            pointerRef={pointerRef}
            isTransitioning={isTransitioning}
            isExperienceReady={isExperienceReady}
          />
        </Canvas>
      </div>
    </>
  );
};

export default Experience;

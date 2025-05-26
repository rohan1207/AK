import React, { Suspense, useRef, useEffect } from "react";
import * as THREE from "three";

import LightRoomFirst from "./models/light/Light_First";
import LightRoomSecond from "./models/light/Light_Second";
import LightRoomThird from "./models/light/Light_Third";
import LightRoomFourth from "./models/light/Light_Fourth";
import LightTargets from "./models/light/Light_Targets";
import GridPlanes from "./components/GridPlanes";

import { useToggleRoomStore } from "../stores/toggleRoomStore";
import gsap from "gsap";
import { useFrame } from "@react-three/fiber";

const Scene = ({ pointerRef }) => {
  const lightGroupRef = useRef();
  const gridPlanesRef = useRef();
  const ambientLightRef = useRef();

  // Modified position: significantly increased x value to move room further right
  const lightRoomGroupPosition = new THREE.Vector3(25, 0, 0.173);
  const groupRotationRef = useRef(0);

  useEffect(() => {
    if (!ambientLightRef.current) return;

    gsap.to(ambientLightRef.current, {
      intensity: 1.5,
      duration: 0.3,
    });
  }, []);

  useEffect(() => {
    if (!gridPlanesRef.current) return;

    gsap.to(gridPlanesRef.current.position, {
      x: -lightRoomGroupPosition.x,
      y: -lightRoomGroupPosition.y,
      z: -lightRoomGroupPosition.z,
      duration: 1,
      ease: "power2.inOut",
    });
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <ambientLight ref={ambientLightRef} intensity={1.5} color="#ffffff" />

        <group ref={lightGroupRef} position={lightRoomGroupPosition}>
          <LightRoomFirst
            position={[
              -lightRoomGroupPosition.x,
              -lightRoomGroupPosition.y,
              -lightRoomGroupPosition.z,
            ]}
          />
          <LightRoomSecond
            position={[
              -lightRoomGroupPosition.x,
              -lightRoomGroupPosition.y,
              -lightRoomGroupPosition.z,
            ]}
          />
          <LightRoomThird
            position={[
              -lightRoomGroupPosition.x,
              -lightRoomGroupPosition.y,
              -lightRoomGroupPosition.z,
            ]}
          />
          <LightRoomFourth
            position={[
              -lightRoomGroupPosition.x,
              -lightRoomGroupPosition.y,
              -lightRoomGroupPosition.z,
            ]}
          />
          <LightTargets
            position={[
              -lightRoomGroupPosition.x,
              -lightRoomGroupPosition.y,
              -lightRoomGroupPosition.z,
            ]}
          />
        </group>
        <GridPlanes
          position={[
            lightRoomGroupPosition.x,
            lightRoomGroupPosition.y,
            lightRoomGroupPosition.z,
          ]}
          ref={gridPlanesRef}
          rows={10}
          columns={10}
          planeWidth={3}
          planeDepth={3}
          spacing={0}
        />
      </Suspense>
    </>
  );
};

export default Scene;

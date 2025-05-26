import React, { useRef, useEffect } from "react";
import "./RoomToggleButton.scss";
import { useToggleRoomStore } from "../../../stores/toggleRoomStore";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

const RoomToggleButton = () => {
  const { isDarkRoom, setDarkRoom, isTransitioning, isBeforeZooming } =
    useToggleRoomStore();

  const toggleButtonRef = useRef();
  const bulbRef = useRef();

  const handleToggle = () => {
    if (!isTransitioning) {
      setDarkRoom(!isDarkRoom);
      // Animate bulb glow
      gsap.to(bulbRef.current, {
        filter: isDarkRoom ? "brightness(1.5)" : "brightness(0.7)",
        duration: 0.3,
      });
    }
  };

  useEffect(() => {
    if (!toggleButtonRef.current) return;

    if (isBeforeZooming) {
      gsap.to(toggleButtonRef.current, {
        opacity: 0,
        duration: 1,
      });
    } else {
      gsap.to(toggleButtonRef.current, {
        opacity: 1,
        duration: 1,
      });
    }
  }, [isBeforeZooming]);

  const buttonClassNames = `toggle-button${!isDarkRoom ? " light" : ""}`;

  return (
    <>
      <button
        ref={toggleButtonRef}
        className={buttonClassNames}
        onClick={handleToggle}
        title={isDarkRoom ? "Switch to light mode" : "Switch to dark mode"}
      >
        <i
          ref={bulbRef}
          className={`ri-lightbulb-${isDarkRoom ? "line" : "fill"}`}
        ></i>
      </button>
    </>
  );
};

export default RoomToggleButton;

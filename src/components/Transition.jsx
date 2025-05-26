import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useLocation } from "react-router-dom";
import { SwitchTransition, Transition } from "react-transition-group";
import { useResponsiveStore } from "../stores/useResponsiveStore";
import { useToggleRoomStore } from "../stores/toggleRoomStore";
import { usePageTransitionStore } from "../stores/pageTransitionStore";
import "./Transition.scss";

const TRANSITION_DELAY = 2;

const TransitionComponent = ({ children }) => {
  const nodeRef = useRef(null);
  const location = useLocation();
  const { isMobile } = useResponsiveStore();
  const { isDarkRoom } = useToggleRoomStore();
  const { setIsEntering, setIsExiting, setDelay } = usePageTransitionStore();

  const [transitionTimeout, setTransitionTimeout] = useState({
    appear: 0,
    enter: 1000,
    exit: 900,
  });

  useEffect(() => {
    if (location.pathname === "/") {
      setTransitionTimeout({ appear: 0, enter: 500, exit: 400 });
      return;
    }

    let requireDarkRoom = false;
    if (location.pathname === "/about" || location.pathname === "/dev-work") {
      requireDarkRoom = true;
    }

    const needsDelay = requireDarkRoom !== isDarkRoom;

    if (needsDelay) {
      setTransitionTimeout({
        appear: 0,
        enter: 1000 + TRANSITION_DELAY * 1000,
        exit: 900,
      });
      setDelay(TRANSITION_DELAY);
    } else {
      setTransitionTimeout({ appear: 0, enter: 1000, exit: 900 });
      setDelay(0);
    }
  }, [location.pathname, isDarkRoom, setDelay]);

  return (
    <SwitchTransition mode="out-in">
      <Transition
        nodeRef={nodeRef}
        key={location.pathname}
        timeout={transitionTimeout}
        in={true}
        appear={true}
        onEnter={() => {
          // Kill any existing animations
          gsap.killTweensOf(nodeRef.current);

          // No transition for Home Page
          if (location.pathname === "/") {
            gsap.to(nodeRef.current, {
              opacity: 1,
              duration: 0.3,
              ease: "power2.out",
              onComplete: () => setIsEntering(false),
            });
            return;
          }

          let flagDelay = false;
          let requireDarkRoom = false;
          if (
            location.pathname === "/about" ||
            location.pathname === "/dev-work"
          ) {
            requireDarkRoom = true;
          }

          if (requireDarkRoom !== isDarkRoom) {
            flagDelay = true;
          }

          // Global Store Logic
          setIsEntering(true);
          setIsExiting(false);
          setDelay(flagDelay ? TRANSITION_DELAY : 0);

          // Fade transition instead of slide
          gsap.set(nodeRef.current, { opacity: 0 });
          gsap.to(nodeRef.current, {
            opacity: 1,
            duration: 0.5,
            delay: flagDelay ? TRANSITION_DELAY : 0,
            ease: "power2.out",
            onComplete: () => {
              setIsEntering(false);
            },
          });
        }}
        onExit={() => {
          // Kill any existing animations
          gsap.killTweensOf(nodeRef.current);

          // Global Store Logic
          setIsExiting(true);
          setIsEntering(false);

          // Simple fade out
          gsap.to(nodeRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
              setIsExiting(false);
            },
          });
        }}
      >
        <div ref={nodeRef} className="page-wrapper">
          {children}
        </div>
      </Transition>
    </SwitchTransition>
  );
};

export default TransitionComponent;

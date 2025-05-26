import React, { useState, useEffect, useRef } from "react";
import { useProgress } from "@react-three/drei";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import "./LoadingPage.scss";
import { useExperienceStore } from "../../stores/experienceStore";

gsap.registerPlugin(TextPlugin);

const words = [
  "Create",
  "Innovate",
  "Transform",
  "Design",
  "Build",
  "Envision",
  "Craft",
];

const LoadingScreen = () => {
  const { progress } = useProgress();
  const topHalfRef = useRef(null);
  const bottomHalfRef = useRef(null);
  const loadingScreenRef = useRef(null);
  const messageRef = useRef(null);
  const staticTextRef = useRef(null);
  const dynamicTextRef = useRef(null);
  const { setIsExperienceReady } = useExperienceStore();
  const [onlyOnce, setOnlyOnce] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [allowTransition, setAllowTransition] = useState(false);

  useEffect(() => {
    // Hide menu during loading
    document.querySelector(".menu")?.classList.add("hidden-during-loading");

    // Animation for dynamic text
    const textTimeline = gsap.timeline({ repeat: -1 });

    words.forEach((word) => {
      textTimeline
        .to(dynamicTextRef.current, {
          duration: 1,
          text: word,
          ease: "power2.inOut",
        })
        .to({}, { duration: 0.5 }); // Pause on each word
    });

    // Make sure all content is loaded
    if (progress >= 100) {
      setTimeout(() => setAllowTransition(true), 1000);
    }

    return () => {
      textTimeline.kill();
      document
        .querySelector(".menu")
        ?.classList.remove("hidden-during-loading");
    };
  }, [progress]);

  useEffect(() => {
    // Only proceed with exit animation when both loading is done and transition is allowed
    if (progress >= 99 && allowTransition && !onlyOnce) {
      setOnlyOnce(true);

      const tl = gsap.timeline({
        onComplete: () => {
          setIsExperienceReady();
        },
      });

      tl.to(messageRef.current, {
        yPercent: -50,
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
      }).to(
        [topHalfRef.current, bottomHalfRef.current],
        {
          yPercent: (i) => (i === 0 ? -100 : 100),
          duration: 1,
          ease: "power2.inOut",
          onComplete: () => setIsVisible(false),
        },
        "<"
      );
    }
  }, [progress, allowTransition, onlyOnce]);

  if (!isVisible) return null;

  return (
    <div ref={loadingScreenRef} className="loading-screen">
      <div ref={topHalfRef} className="background-top-half"></div>
      <div ref={bottomHalfRef} className="background-bottom-half"></div>
      <div className="loading-screen-content">
        <h1 ref={messageRef} className="main-title">
          Ankur Associates
        </h1>
        <div className="dynamic-text-container">
          <span ref={staticTextRef} className="static-text">
            We{" "}
          </span>
          <span ref={dynamicTextRef} className="dynamic-text">
            Create
          </span>
        </div>
        <div className="loader-container">
          <div className="loader-line">
            <div
              className="loader-progress"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="loader-text">{Math.round(progress)}%</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

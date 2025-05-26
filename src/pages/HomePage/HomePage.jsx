import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { useNavigate } from "react-router-dom";
import { useToggleRoomStore } from "../../stores/toggleRoomStore";
import { useExperienceStore } from "../../stores/experienceStore";
import "./HomePage.scss";

// Register GSAP plugins
gsap.registerPlugin(TextPlugin);

const HomePage = () => {
  const heroTitleRef = useRef(null);
  const heroContentRef = useRef(null);
  const homepageRef = useRef(null);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const { setDarkRoom, setIsBeforeZooming } = useToggleRoomStore();
  const { isExperienceReady } = useExperienceStore();

  // Set light room mode and make sure room is visible
  useEffect(() => {
    setDarkRoom(false); // Ensure light mode
    setIsBeforeZooming(false);

    if (isExperienceReady) {
      // Show hero content after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);

      // Cleanup function
      return () => {
        clearTimeout(timer);
        // Kill any ongoing GSAP animations when component unmounts
        gsap.killTweensOf(heroTitleRef.current);
        gsap.killTweensOf(heroContentRef.current);
      };
    }
  }, [isExperienceReady]);

  // Text animation effect
  useEffect(() => {
    if (!heroTitleRef.current || !isVisible) return;

    const titles = ["Architecture", "Innovation", "Design", "Excellence"];
    let currentIndex = 0;
    let interval;

    const animateText = () => {
      gsap.killTweensOf(heroTitleRef.current); // Kill any ongoing animations
      gsap.to(heroTitleRef.current, {
        duration: 0.5,
        opacity: 0,
        onComplete: () => {
          gsap.to(heroTitleRef.current, {
            duration: 0.8,
            text: titles[currentIndex],
            opacity: 1,
            ease: "power2.out",
          });
          currentIndex = (currentIndex + 1) % titles.length;
        },
      });
    };

    // Start the animation after a delay
    const startTimer = setTimeout(() => {
      animateText();
      interval = setInterval(animateText, 3000);
    }, 1000);

    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
      gsap.killTweensOf(heroTitleRef.current);
    };
  }, [isVisible]); // Handle scroll events
  useEffect(() => {
    const preventScroll = (e) => {
      // Only prevent scroll on the main homepage, not nested components
      if (
        e.target === homepageRef.current ||
        e.target.closest(".hero-section")
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Attach passive event listener for better performance
    window.addEventListener("wheel", preventScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", preventScroll);
    };
  }, []);

  // Only render content when isVisible is true
  return (
    <div className="homepage" ref={homepageRef}>
      <div className="hero-section">
        <AnimatePresence mode="wait">
          {isVisible && (
            <motion.div
              ref={heroContentRef}
              className="hero-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
            >
              <motion.h1
                className="company-name"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Ankur Associates
              </motion.h1>

              <motion.div
                className="tagline-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <span className="static-text">Crafting </span>
                <span ref={heroTitleRef} className="dynamic-text">
                  Architecture
                </span>
              </motion.div>

              <motion.p
                className="hero-description"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                We transform spaces into experiences, blending innovative design
                with functional excellence to create architecture that inspires
                and endures.
              </motion.p>

              <motion.div
                className="cta-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <motion.button
                  onClick={() => navigate("/dev-work")}
                  className="cta-button primary"
                >
                  Our Projects <span className="arrow">→</span>
                </motion.button>

                <motion.button
                  onClick={() => navigate("/about")}
                  className="cta-button secondary"
                >
                  About Us
                </motion.button>
              </motion.div>

              <motion.div
                className="stats-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <div className="stat-item">
                  <span className="stat-number">22+</span>
                  <span className="stat-label">Years Experience</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">120+</span>
                  <span className="stat-label">Projects Completed</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">40L</span>
                  <span className="stat-label">Sq.m Designed</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HomePage;

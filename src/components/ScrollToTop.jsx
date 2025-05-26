import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Ensure we reset any scrolling state
    const resetScroll = () => {
      // Reset main document scroll
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant", // Use instant to ensure immediate reset
      });

      // Reset overflow containers if they exist
      const containers = document.querySelectorAll('[class*="page"]');
      containers.forEach((container) => {
        if (container.scrollTo) {
          container.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant",
          });
        }
      });
    };

    // Execute scroll reset
    resetScroll();
  }, [pathname]);

  return null;
};

export default ScrollToTop;

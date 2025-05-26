import React, { useState, useEffect, useRef } from "react";
import "./CircularProjectGallery.scss";

const CircularProjectGallery = () => {
  const [images, setImages] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [centerImage, setCenterImage] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          "https://api.slingacademy.com/v1/sample-data/photos?offset=0&limit=200"
        );
        const data = await response.json();
        if (data.photos) {
          setImages(data.photos);
          setCenterImage(data.photos[0]);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        const fallbackImages = Array.from({ length: 140 }, (_, i) => ({
          id: i + 1,
          url: `https://picsum.photos/400/300?random=${i + 1}`,
          title: `Project ${i + 1}`,
          description: `Sample project description ${i + 1}`,
        }));
        setImages(fallbackImages);
        setCenterImage(fallbackImages[0]);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();

      const scrollDelta = e.deltaY;
      setIsScrolling(true);

      // Reduced rotation speed from 0.1 to 0.03 for smoother control
      setRotation((prev) => prev + scrollDelta * 0.03);

      if (scrollTimeout) clearTimeout(scrollTimeout);
      const newTimeout = setTimeout(() => setIsScrolling(false), 150);
      setScrollTimeout(newTimeout);
    };

    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        setRotation((prev) => prev - 3); // Reduced from 10 to 3
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        setRotation((prev) => prev + 3); // Reduced from 10 to 3
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [scrollTimeout]);

  const categories = [
    {
      name: "Shopping Mall",
      count: "⁽¹⁾",
      position: { top: "15%", left: "50%" },
    },
    {
      name: "Urban Renewal",
      count: "⁽¹²⁾",
      position: { top: "15%", right: "20%" },
    },
    {
      name: "Workplace",
      count: "⁽³⁰⁾",
      position: { top: "30%", right: "12%" },
    },
    { name: "Education", count: "⁽⁶⁾", position: { top: "45%", right: "12%" } },
    {
      name: "Mixed Use & Transport",
      count: "⁽⁰²⁾",
      position: { bottom: "30%", right: "12%" },
    },
    {
      name: "Exhibition & Showcase",
      count: "⁽⁰⁶⁾",
      position: { bottom: "45%", right: "20%" },
    },
    {
      name: "Hospitality & Residential",
      count: "⁽¹⁰⁾",
      position: { bottom: "15%", left: "50%" },
    },
    {
      name: "Retail & Leisure",
      count: "⁽⁰⁶⁾",
      position: { bottom: "45%", left: "12%" },
    },
  ];

  const handleImageHover = (image, index) => {
    setHoveredIndex(index);
    setCenterImage(image);
  };

  const handleImageLeave = () => {
    setHoveredIndex(null);
    if (images.length > 0) {
      setCenterImage(images[0]);
    }
  };

  if (images.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="circular-gallery">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <div className="logo">Ankur Associates</div>
            <nav className="nav">
              <a href="#" className="nav-link">
                Projects
              </a>
              <a href="#" className="nav-link">
                Info
              </a>
              <a href="#" className="nav-link">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content" ref={containerRef}>
        {/* Categories */}
        {categories.map((category, index) => (
          <div key={index} className="category" style={category.position}>
            <div className="category-content">
              <div className="category-name">{category.name}</div>
              <div className="category-count">{category.count}</div>
            </div>
          </div>
        ))}

        {/* Gallery Container */}
        <div className="gallery-container">
          {/* Center Content */}
          <div className="center-content">
            <h1 className="main-title">
              {hoveredIndex !== null
                ? centerImage?.title || `Project ${hoveredIndex + 1}`
                : "Xiaomeisha Transport"}
            </h1>
            <h2 className="sub-title">
              {hoveredIndex !== null ? "Gallery" : "Centre"}
            </h2>
            {hoveredIndex !== null && (
              <p className="description">
                {centerImage?.description || "Project description"}
              </p>
            )}
          </div>

          {/* Center Image */}
          {centerImage && (
            <div className="center-image">
              <img
                src={centerImage.url}
                alt={centerImage.title || "Center project"}
                className="center-img"
              />
              <div className="center-overlay">
                <div className="overlay-text">
                  {hoveredIndex !== null
                    ? "Featured Project"
                    : "Retail & Leisure"}
                </div>
              </div>
            </div>
          )}

          {/* Circular Ring */}
          <div
            className={`circular-ring ${
              isScrolling ? "scrolling" : "not-scrolling"
            }`}
            style={{
              perspective: "2000px",
              transform: isScrolling
                ? `rotateX(20deg)` // More horizontal when scrolling
                : `rotateX(20deg)`, // Slightly more horizontal when not scrolling
              transformStyle: "preserve-3d",
            }}
          >
            {images.slice(0, 140).map((image, index) => {
              const baseAngle = (index / 140) * 360;
              const currentAngle = isScrolling
                ? baseAngle + rotation
                : baseAngle;

              const radius = 450; // Base radius
              const hoverRadius = hoveredIndex === index ? 520 : radius; // Extended radius when hovered
              const x = Math.cos((currentAngle * Math.PI) / 180) * hoverRadius;
              const z = Math.sin((currentAngle * Math.PI) / 180) * hoverRadius;
              const yOffset = -10; // Adjusted Y offset for more horizontal orientation

              return (
                <div
                  key={image.id}
                  className="image-container"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) translate3d(${x}px, ${yOffset}px, ${z}px) rotateY(${
                      -currentAngle + 90
                    }deg) rotateX(-8deg)`,
                    transformStyle: "preserve-3d",
                    transition:
                      hoveredIndex === index
                        ? "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                        : "all 0.3s ease",
                  }}
                  onMouseEnter={() => handleImageHover(image, index)}
                  onMouseLeave={handleImageLeave}
                >
                  <div
                    className={`image-card ${
                      hoveredIndex === index ? "hovered" : ""
                    }`}
                    style={{
                      transform:
                        hoveredIndex === index
                          ? `translateZ(0px) rotateY(${
                              currentAngle - 90
                            }deg) scale(1.2)`
                          : `translateZ(0px) rotateY(${
                              currentAngle - 90
                            }deg) scale(1)`,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <img
                      src={image.url}
                      alt={image.title || `Project ${index + 1}`}
                      loading="lazy"
                      className="gallery-img"
                    />
                    <div
                      className={`card-overlay ${
                        hoveredIndex === index ? "hovered" : ""
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bottom-nav">
          <div className="nav-items">
            <div className="nav-item">Sector</div>
            <div className="nav-item">Status</div>
            <div className="nav-item">Scope</div>
            <div className="nav-item">Year</div>
            <div className="nav-item">Scale</div>
          </div>
        </div>

        {/* Project ID */}
        <div className="project-id">
          <div className="id-text">
            (
            {hoveredIndex !== null
              ? String(hoveredIndex + 1).padStart(2, "0")
              : "01"}
            )
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="indicator-content">
          <div className="bounce-arrow">🔄</div>
          <div className="indicator-text">Scroll to rotate</div>
        </div>
      </div>
    </div>
  );
};

export default CircularProjectGallery;

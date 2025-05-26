import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./DesignWorkPage.scss";
import BannerSection from "../../components/BannerSection/BannerSection";
import BentoGrid from "../../components/BentoGrid/BentoGrid";
import { useToggleRoomStore } from "../../stores/toggleRoomStore";
import Footer from "../../components/footer/Footer";

const DesignWorkPage = () => {
  const navigate = useNavigate();
  const { isDarkRoom, setDarkRoom } = useToggleRoomStore();

  useEffect(() => {
    setDarkRoom(true);
  }, []);

 const projects = [
    {
      id: 1,
      title: "Manjri Greenwoods",
      description: "Manjri Greenwoods",
      image: "/images/Manjri_Greenwoods.jpg",
      size: "large",
      tags: [],
      type: "portfolio",
    },
    {
      id: 2,
      title: "3D Architect Website",
      description: "Horizon Architects",
      image: "/images/residence.jpeg",
      size: "medium",
      tags: [],
      type: "Architecture",
    },
    {
      id: 3,
      title: "Full Stack Website",
      description: "Museum",
      image: "/images/museum.jpg",
      tags: [],
      type: "portfolio",
    },
    {
      id: 4,
      title: "Campus",
      description: "",
      image: "/images/campus.jpeg",
      tags: [],
      type: "Marketing",
    },
    {
      id: 5,
      title: "Three js Website",
      description: "Public Space | Interior design | 2024",
      image: "/images/pavilion.jpg",
      size: "medium",
      tags: [],
      type: "portfolio",
    },
  ];

  const handleBack = () => {
    navigate("/");
  };

  return (
    <motion.div
      className={`dev-work-page${!isDarkRoom ? " light" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        className="back-button"
        onClick={handleBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <BannerSection
          title="Our Projects"
          subtitle="Explore our Excellent work"
          backgroundImage="/images/projects.jpg"
        />
      </motion.div>

      <motion.div
        className="dev-work-page-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="content-wrapper">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            Crafting Tomorrow's Spaces
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            Every structure tells a story—of space, purpose, and imagination. At{" "}
            <span className="highlight">Ankur Associates</span>, our projects
            are born from bold concepts, shaped by functionality, and finished
            with timeless detail. Explore our curated selection of residential,
            commercial, and bespoke architectural works that speak to our
            passion for form and the future.
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <BentoGrid projects={projects} />
      </motion.div>

      <Footer />
    </motion.div>
  );
};

export default DesignWorkPage;

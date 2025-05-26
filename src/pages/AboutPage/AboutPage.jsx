import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./AboutPage.scss";
import BannerSection from "../../components/BannerSection/BannerSection";
import { useToggleRoomStore } from "../../stores/toggleRoomStore";
import Footer from "../../components/footer/Footer";

const AboutPage = () => {
  const navigate = useNavigate();
  const { isDarkRoom, setDarkRoom } = useToggleRoomStore();
  const [hoveredMember, setHoveredMember] = useState(null);
  const [activeLocation, setActiveLocation] = useState(null);  const locations = [
    {
      id: 1,
      name: "Mumbai",
      coordinates: { x: 346, y: 375 },
      path: "/mumbai",
    },
    {
      id: 2,
      name: "Pune",
      coordinates: { x: 398, y: 391 },
      path: "/pune",
    },
    {
      id: 3,
      name: "Delhi",
      coordinates: { x: 412, y: 200 },
      path: "/delhi",
    },
    
  ];

  useEffect(() => {
    setDarkRoom(true);
  }, []);

  const founderInfo = {
    name: "Mr. Prakash Kulkarni",
    role: "Our Founder & Principal Architect",
    description:
      "Mr. Prakash Kulkarni is the founder Principal of ankur associates, Commercial and Residential Architects in Pune which involved in designing and liasoining of major projects in Pune. He graduated with a Bachelor's Degree in Architecture from Hubli, Karnataka University in 1992 and before starting his own practice in 2000, he has a vast experience from working with renowned Architect Pandit Joshi. With over 22 years of experience in the field of architecture and now having a full office setup in the heart of the city. The firm has designed and executed projects that range from Master Planning to Designing of Residential, Commercial, Institutional, Health care, Hospitality and IT projects measuring upto 40 Lakh sq.m.",
    image: "/images/team1.jpg",
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <motion.div
      className={`about-page${!isDarkRoom ? " light" : ""}`}
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
          title="About Us"
          subtitle="konnect | kreate | kollaborate"
          backgroundImage="/images/about.jpg"
        />
      </motion.div>

      <motion.div
        className="about-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="content-wrapper">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            For the last 22 years, filled with sheer hard work and competence,
            we ankur associates have come a long way in the field of
            architecture. Located in the heart of the city, architecture design
            services have evolved rapidly and so have we! And this progress has
            made us one of the leading mentors in residential architectural
            services, architectural planning, and liaison services. Determined
            by the ethos of efficiency, elegance, and commitment; in our
            successful tenure, we as an architecture consulting firm mastered a
            gamut of projects. Along with our power-packed team and ace
            architectural planning services, we have led projects that range
            from Master Planning to Designing of Residential, Commercial,
            Institutional, Health care, Hospitality and IT projects measuring up
            to 40 Lakh sq.m. Time and again, we have proved our proficiency, by
            demonstrating a successful track-record complemented by excellence
            and supremacy
          </motion.p>
        </div>

        <motion.div
          className="founder-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="founder-card">
            <div className="founder-image">
              <motion.img
                src={founderInfo.image}
                alt={founderInfo.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="founder-content">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                {founderInfo.name}
              </motion.h2>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                {founderInfo.role}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                {founderInfo.description}
              </motion.p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="presence-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <h2>Our Presence</h2>
          <div className="map-container">
            <div className="map-wrapper">
              <img
                src="/images/India-locator-map-blank.svg.webp"
                alt="India Map"
                className="india-map"
              />
              {locations.map((location) => (
                <motion.div
                  key={location.id}
                  className={`map-pin ${
                    activeLocation === location.id ? "active" : ""
                  }`}
                  style={{
                    left: `${location.coordinates.x}px`,
                    top: `${location.coordinates.y}px`,
                  }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => navigate(location.path)}
                  onMouseEnter={() => setActiveLocation(location.id)}
                  onMouseLeave={() => setActiveLocation(null)}
                >
                  <div className="pin">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 0C7.58 0 4 3.58 4 8C4 13.54 12 24 12 24C12 24 20 13.54 20 8C20 3.58 16.42 0 12 0ZM12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <motion.div
                    className="tooltip"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: activeLocation === location.id ? 1 : 0,
                      y: activeLocation === location.id ? 0 : 10,
                    }}
                  >
                    {location.name}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <Footer />
      </motion.div>
    </motion.div>
  );
};

export default AboutPage;

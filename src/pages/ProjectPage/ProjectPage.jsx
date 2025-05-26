import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./ProjectPage.scss";
import BannerSection from "../../components/BannerSection/BannerSection";
import ImageSlider from "../../components/ImageSlider/ImageSlider";
import ModelViewer from "../../components/ModelViewer/ModelViewer";
import { useToggleRoomStore } from "../../stores/toggleRoomStore";
import Footer from "../../components/footer/Footer";

const ProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isDarkRoom, setDarkRoom } = useToggleRoomStore();
  useEffect(() => {
    setDarkRoom(true);
  }, []);

  // This would normally come from an API or database

  const portfolioProjects = {
    "full-stack-website": {
      type: "portfolio",
      title: "KK Associates CA Firm",
      location: "Pune",
      timeline: "1 month",
      description:
        "A full stack website designed for a chartered accountant firm named KK Associates, focusing on functionality and user experience. The blogs are dynamic and can be added from the admin panel. The website is built using the MERN stack, ensuring a seamless user experience.",
      websiteLink: "https://kkassociate.com/",
      technologies: ["React", "Node.js", "MongoDB", "Express", "SCSS"],
      clientTestimonial:
        '"Ankur Associates team transformed our vision into a stunning reality. Their attention to detail and commitment to quality is unmatched." - Alpesh Gujarathi, KK Associates',
      images: [
        "/images/portfolio/img1.png",
        "/images/portfolio/img2.png",
        "/images/portfolio/img3.png",
      ],
      mainImage: "/images/portfolio/img1.png",
    },
    "static-architect-website": {
      type: "portfolio",
      title: "Azure Heights Tower",
      location: "Pune",
      timeline: "2 months",
      description:
        "A static website designed for a luxury residential tower, showcasing the architectural design and features. The website is built using HTML, CSS, and JavaScript, ensuring a responsive and visually appealing experience.",
      websiteLink: "https://web1static.onrender.com/",
      technologies: ["HTML", "CSS", "JavaScript"],
      clientTestimonial:
        '"Ankur Associates team did an amazing job with our website. Their creativity and professionalism made the process seamless." - Rohan Patil, Azure Heights Tower',
      images: [
        "/images/portfolio/static1.png",
        "/images/portfolio/static2.png",
        "/images/portfolio/static3.png",
      ],
      mainImage: "/images/residence/interior1.webp",
    },
    "three-js-website": {
      type: "portfolio",
      title: "Three.js Website",
      location: "Mumbai",
      timeline: "2 months",
      description:
        "A visually stunning website built with Three.js, showcasing 3D models and interactive elements.",
      websiteLink: "https://web2js.onrender.com/",
      technologies: ["Three.js", "React", "WebGL"],
      clientTestimonial:
        '"Ankur Associates team brought our 3D vision to life with their expertise in Three.js. The result is nothing short of amazing!" - vikram raidu',
      images: [
        "/images/portfolio/three1.png",
        "/images/portfolio/three2.png",
        "/images/portfolio/three3.png",
      ],
      mainImage: "/images/pavilion.jpg",
    },

    // Add more portfolio projects here
  };
  const projects = {
    "3d-architect-website": {
      type: "architecture",
      title: "Horizon Architects",
      location: "Pune",
      area: "45,000 sq ft",
      timeline: "6 months",
      description:
        "A luxury residential complex featuring contemporary design and sustainable architecture.",
      clientTestimonial:
        '"The team at Ankur Associates turned our vision of modern luxury living into reality. The attention to detail and commitment to sustainability exceeded our expectations." - James Anderson, Owner, Horizon Architects',
      images: [
        "/images/residence/interior1.webp",
        "/images/residence/interior2.jpg",
        "/images/residence/interior3.jpg",
        "/images/residence/residence.jpg",
      ],
      mainImage: "/images/residence/residence.jpg",
    },
    "manjri-greenwoods":{
      type: "architecture",
      title: "Horizon Architects",
      location: "Pune",
      area: "45,000 sq ft",
      timeline: "6 months",
      description:
        "A luxury residential complex featuring contemporary design and sustainable architecture.",
      clientTestimonial:
        '"The team at Ankur Associates turned our vision of modern luxury living into reality. The attention to detail and commitment to sustainability exceeded our expectations." - James Anderson, Owner, Horizon Architects',
      images: [
        "/images/residence/interior1.webp",
        "/images/residence/interior2.jpg",
        "/images/residence/interior3.jpg",
        "/images/residence/residence.jpg",
      ],
      mainImage: "/images/residence/residence.jpg",
    },

    // Add other projects here...
  };
  // Check both project arrays
  const project = projects[projectId] || portfolioProjects[projectId];

  if (!project) {
    navigate("/dev-work");
    return null;
  }

  const handleBack = () => {
    navigate(project.type === "portfolio" ? "/dev-work" : "/design-work", {
      replace: true,
    });
  };

  const renderProjectContent = () => {
    if (project.type === "portfolio") {
      return (
        <div className="content-wrapper portfolio-content">
          <div className="project-info">
            <div className="info-grid">
              <div className="info-item">
                <h4>Location</h4>
                <p>{project.location}</p>
              </div>
              <div className="info-item">
                <h4>Timeline</h4>
                <p>{project.timeline}</p>
              </div>
              <div className="info-item">
                <h4>Website</h4>
                <a
                  href={project.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="website-link"
                >
                  Visit Website
                </a>
              </div>
            </div>

            <motion.div className="tech-stack">
              <h4>Technologies Used</h4>
              <div className="tech-tags">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.p
              className="project-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {project.description}
            </motion.p>
          </div>
          <motion.div
            className="project-gallery"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ImageSlider images={project.images} />
          </motion.div>{" "}
          <motion.div
            className="project-sections"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="testimonial-section">
              <h3>Client Testimonial</h3>
              <blockquote>{project.clientTestimonial}</blockquote>
            </div>
          </motion.div>
        </div>
      );
    }

    // Architecture project content
    return (
      <div className="content-wrapper">
        <div className="project-info">
          <div className="info-grid">
            <div className="info-item">
              <h4>Location</h4>
              <p>{project.location}</p>
            </div>
            <div className="info-item">
              <h4>Area</h4>
              <p>{project.area}</p>
            </div>
            <div className="info-item">
              <h4>Timeline</h4>
              <p>{project.timeline}</p>
            </div>
          </div>
          <motion.p
            className="project-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {project.description}
          </motion.p>
        </div>

        <motion.div
          className="project-gallery"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ImageSlider images={project.images} />
        </motion.div>

        <motion.div
          className="project-sections"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="testimonial-section">
            <h3>Client Testimonial</h3>
            <blockquote>{project.clientTestimonial}</blockquote>
          </div>

          <div className="model-section">
            <h3>3D Project Model</h3>
            <ModelViewer modelPath="/models/horizon_plan1.glb" />
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <>
      <motion.div
        className={`project-page${!isDarkRoom ? " light" : ""}`}
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
            title={project.title}
            backgroundImage={project.mainImage}
          />
        </motion.div>{" "}
        <motion.div
          className="project-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {renderProjectContent()}
        </motion.div>
        <Footer />
      </motion.div>
    </>
  );
};

export default ProjectPage;

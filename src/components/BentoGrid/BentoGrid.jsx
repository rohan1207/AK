import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./BentoGrid.scss";

const BentoGrid = ({ projects }) => {
  const navigate = useNavigate();
  const handleExplore = (project) => {
    const projectId = project.title.toLowerCase().replace(/\s+/g, "-");
    navigate(`/project/${projectId}`, { replace: false });
  };

  return (
    <div className="bento-grid">
      {projects.map((project, index) => (
        <div
          key={project.id}
          className={`bento-item ${project.size || "default"}`}
          style={{
            backgroundImage: `url(${project.image})`,
          }}
        >
          <div className="bento-overlay">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="bento-tags">
              {project.tags.map((tag, tagIndex) => (
                <span key={tagIndex} className="tag">
                  {tag}
                </span>
              ))}
            </div>
            <motion.button
              className="explore-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleExplore(project)}
            >
              Explore <i className="ri-arrow-right-line"></i>
            </motion.button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BentoGrid;

import React from "react";
import "./BannerSection.scss";

const BannerSection = ({ title, subtitle, backgroundImage }) => {
  return (
    <div className="banner">
      <div
        className="banner-image"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="banner-overlay">
          <div className="banner-content">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerSection;

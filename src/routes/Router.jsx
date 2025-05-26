import React from "react";
import HomePage from "../pages/HomePage/HomePage";
import TransitionComponent from "../components/Transition";
import AboutPage from "../pages/AboutPage/AboutPage";
import DevWorkPage from "../pages/DevWorkPage/DevWorkPage";
import DesignWorkPage from "../pages/DesignWorkPage/DesignWorkPage";
import ProjectPage from "../pages/ProjectPage/ProjectPage";
import ScrollToTop from "../components/ScrollToTop";
import { Route, Routes } from "react-router-dom";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import ContactUs from "../pages/contactus/ContactUs";
import Pune from "../pages/Pune/pune"
import CircularProjectGallery from "../pages/CircularProjectGallery/CircularProjectGallery";


const Router = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          index
          element={
            <TransitionComponent>
              <HomePage />
            </TransitionComponent>
          }
        />
        <Route
          path="about"
          element={
            <TransitionComponent>
              <AboutPage />
            </TransitionComponent>
          }
        />
        <Route
          path="dev-work"
          element={
            <TransitionComponent>
              <CircularProjectGallery />
            </TransitionComponent>
          }
        />
        <Route
          path="design-work"
          element={
            <TransitionComponent>
              <DesignWorkPage />
            </TransitionComponent>
          }
        />
          <Route
          path="pune"
          element={
            <TransitionComponent>
              <Pune />
            </TransitionComponent>
          }
        />

          <Route
          path="/contact"
          element={
            <TransitionComponent>
              <ContactUs />
            </TransitionComponent>
          }
        />

        
        
        
        <Route
          path="project/:projectId"
          element={
            
              <ProjectPage />
            
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default Router;

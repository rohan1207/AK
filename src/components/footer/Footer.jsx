import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./Footer.scss";

const Footer = () => {
  const socialLinks = [
    {
      name: "Instagram",
      icon: "ri-instagram-line",
      url: "https://www.instagram.com/Ankur Associates/",
    },
    { name: "LinkedIn", icon: "ri-linkedin-fill", url: "#" },
    { name: "Twitter", icon: "ri-twitter-x-line", url: "#" },
  ];

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/dev-work" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="footer-content">
        <p className="footer-tagline">konnect | kreate | kollaborate</p>
        <div className="footer-section links-section">
          <h4>Quick Links</h4>
          <ul>
            {quickLinks.map((link) => (
              <motion.li
                key={link.name}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Link to={link.path}>{link.name}</Link>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="footer-section contact-section">
          <h4>Contact</h4>
          <p>Katraj, Pune</p>
          <p>info@socialkollab.com</p>
          <p>+91 86000 73706</p>
        </div>

        <div className="footer-section social-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <i className={social.icon}></i>
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        className="footer-bottom"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p>
          &copy; {new Date().getFullYear()} Ankur Associates. All rights
          reserved.
        </p>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;

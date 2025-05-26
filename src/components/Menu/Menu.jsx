import "./Menu.scss";
import { NavLink } from "react-router-dom";
import { useToggleRoomStore } from "../../stores/toggleRoomStore";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";

const Menu = () => {
  const { isDarkRoom, isBeforeZooming } = useToggleRoomStore();
  const menuRef = useRef();
  const menuClassNames = `menu${!isDarkRoom ? " light" : ""}`;
  const linkClassNames = `nav-link${!isDarkRoom ? " light" : ""}`;

  useEffect(() => {
    if (!menuRef.current) return;

    if (isBeforeZooming) {
      gsap.to(menuRef.current, {
        opacity: 0,
        duration: 1,
        y: 20,
      });
    } else {
      gsap.to(menuRef.current, {
        opacity: 1,
        duration: 1,
        y: 0,
      });
    }
  }, [isBeforeZooming]);

  return (
    <nav ref={menuRef} className={menuClassNames}>
      <NavLink to="/" className={linkClassNames}>
        Home
      </NavLink>
      <NavLink to="/dev-work" className={linkClassNames}>
        Projects
      </NavLink>
      <NavLink to="/about" className={linkClassNames}>
        About Us
      </NavLink>
      <NavLink
        to="/contact"
        className={`nav-link contact${!isDarkRoom ? " light" : ""}`}
      >
        Contact <i className="ri-arrow-right-line"></i>
      </NavLink>
    </nav>
  );
};

export default Menu;

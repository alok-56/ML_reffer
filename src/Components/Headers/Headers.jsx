import React, { useState } from "react";
import "./Headers.css";
import logo from "../../Assests/avatar.png";
import { FaBell, FaSearch, FaBars } from "react-icons/fa";

const Headers = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="app-header">
      {/* Left side: Menu toggle for small screens */}
      <div className="menu-container">
        {/* Show menu only on small screens */}
        <div className="menu-icon" onClick={toggleMenu}>
          <FaBars size={24} />
        </div>
      </div>

      {/* Center: App Name */}
      <div className="app-name">The Reactors</div>

     

      {/* Right side: Profile Icon */}
      <div className="profile-container">
        <img
          className="profile-icon"
          src={logo}
          alt="Avatar"
        />
      </div>

      {/* Optional menu content */}
      <div className={`side-menu ${menuOpen ? "open" : ""}`}>
        {/* Your menu content goes here */}
      </div>
    </header>
  );
};

export default Headers;

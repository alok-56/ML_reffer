import React, { useState } from "react";
import "./Headers.css";
import logo from "../../Assests/avatar.png";
import logo1 from "../../Assests/logo.png";
import { FaBell, FaSearch, FaBars, FaSync } from "react-icons/fa";
import { Offcanvas } from "reactstrap";
import SidebarDash from "../Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";

const Headers = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const navigate = useNavigate()

  return (
    <header className="app-header">
      <div className="menu-container">
        <div className="menu-icon" onClick={toggleMenu}>
          <FaBars size={24} />
        </div>
      </div>

      <div className="app-name">
        <img style={{ height: 150, width: 150 }} src={logo1} alt="App Logo" />
      </div>
      <div className="profile-container" >

        <FaSync onClick={() => window.location.reload()} style={{ marginRight: 20 }} size={24} />

        <img
          onClick={() => navigate('/profile')}
          className="profile-icon"
          src={logo}
          alt="Avatar"
        />

      </div>


      <div>
        <Offcanvas isOpen={menuOpen} toggle={toggleMenu} className="custom-offcanvas">
          <SidebarDash />
        </Offcanvas>
      </div>
    </header>
  );
};

export default Headers;

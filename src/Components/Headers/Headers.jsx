import React from "react";
import "./Headers.css";
import logo from "../../Assests/avatar.png";
import { FaBell, FaSearch } from "react-icons/fa";

const Headers = () => {
  return (
    <header className="app-header">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          width: "80%",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            height: 40,
            width: 500,
            borderRadius: 5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 5,
            marginRight: 100,
            position: "relative",
          }}
        ></div>
        {/* Search Input Container */}

        <div
          style={{
            height: 40,
            width: 300,
            borderRadius: 5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 5,
            marginRight: 20,
            position: "relative",
          }}
        >
          <input
            className="login-input-headers"
            placeholder="Search here ..."
          />
          {/* Search Icon */}
          <FaSearch
            style={{
              position: "absolute",
              left: "15px", // Position the icon inside the input box
              fontSize: "18px", // Icon size
              color: "#888", // Icon color
            }}
          />
        </div>

        {/* Notification Bell */}
        <div
          style={{
            height: 40,
            width: 40,
            backgroundColor: "rgba(241, 239, 239, 0.82)",
            borderRadius: 5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 5,
            marginRight: 20,
          }}
        >
          <FaBell
            style={{
              fontSize: 24,
            }}
          />
        </div>

        {/* Avatar */}
        <div
          style={{
            height: 40,
            width: 40,
            backgroundColor: "rgba(241, 239, 239, 0.82)",
            borderRadius: 5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 5,
          }}
        >
          <img
            style={{
              height: 30,
              width: 30,
            }}
            src={logo}
            alt="Avatar"
          />
        </div>
      </div>
    </header>
  );
};

export default Headers;

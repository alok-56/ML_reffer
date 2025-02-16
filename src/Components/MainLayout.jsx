import React, { useState } from "react";
import SidebarDash from "./Sidebar/Sidebar";
import Headers from "./Headers/Headers";


const MainLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-container">
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <SidebarDash />
      </div>
      <div className="content-area">
        <Headers toggleSidebar={toggleSidebar} />
        {children}
      </div>
    </div>
  );
};

export default MainLayout;

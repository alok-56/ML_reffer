import React from "react";

import SidebarDash from "./Sidebar/Sidebar";
import Headers from "./Headers/Headers";

const MainLayout = ({ children }) => (
  <div className="app-container">
    <SidebarDash></SidebarDash>
    <div className="content-area">
      <Headers></Headers>
      {children}
    </div>
  </div>
);

export default MainLayout;

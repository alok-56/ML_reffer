import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  FaHome,
  FaPeopleArrows,
  FaShoppingCart,
  FaSignOutAlt,
  FaPlus,
  FaListAlt,
  FaSchool,
  FaCogs,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../../Assests/logo.png";

const SidebarDash = () => {
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState(location.pathname);

  React.useEffect(() => {
    setActiveMenuItem(location.pathname);
  }, [location.pathname]);

  // Define the common styles
  const commonStyles = {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "monospace",
    color: "#5D7285",
    marginTop: 10,
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
  };

  const activeStyles = {
    backgroundColor: "rgba(67, 24, 255, 0.1)",
    color: "#0C7FDA",
  };

  const iconStyle = {
    fontSize: 24,
  };

  const subMenuStyles = {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "monospace",
    color: "#5D7285",
    backgroundColor: "transparent",
  };

  const activeSubMenuStyles = {
    backgroundColor: "rgba(67, 24, 255, 0.1)",
  };

  return (
    <div>
      <Sidebar
        style={{
          height: "100vh",
          position: "fixed",
          backgroundColor: "#FFFFFF",
          width: 250,
          boxShadow: "4px 0px 4px rgba(81, 80, 80, 0.2)",
        }}
      >
        <Menu>
          <div
            style={{
              height: 80,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0px 1px  rgba(81, 80, 80, 0.2)",
            }}
          >
            {/* <img style={{ height: 60, width: 120 }} src={logo} alt="Logo" /> */}
            <h3>Demo</h3>
          </div>

          {/* Dashboard Menu Item */}
          <MenuItem
            component={<Link to="/" />}
            icon={
              <FaHome
                style={{
                  color: activeMenuItem === "/" ? "#0C7FDA" : "#5D7285",
                  fontSize: 24,
                }}
              />
            }
            className={activeMenuItem === "/" ? "active" : ""}
            style={{
              ...commonStyles,
              ...(activeMenuItem === "/" ? activeStyles : {}),
            }}
          >
            Dashboard
          </MenuItem>

          {/* Supplier SubMenu */}
          <SubMenu
            label="DEMO"
            icon={
              <FaPeopleArrows
                style={{
                  color:
                    activeMenuItem === "/supplier/database" ||
                    activeMenuItem === "/supplier/downline"
                      ? "#0C7FDA"
                      : "#5D7285",
                  fontSize: 24,
                }}
              />
            }
            className={
              activeMenuItem === "/supplier/database" ||
              activeMenuItem === "/supplier/downline"
                ? "active"
                : ""
            }
            style={{
              ...commonStyles,
              ...(activeMenuItem === "/supplier/database" ||
              activeMenuItem === "/supplier/downline"
                ? activeSubMenuStyles
                : {}),
            }}
          >
            {/* Supplier Database Menu Item */}
            <MenuItem
              component={<Link to="/supplier/database" />}
              icon={
                <FaListAlt
                  style={{
                    color:
                      activeMenuItem === "/supplier/database"
                        ? "#0C7FDA"
                        : "#5D7285",
                    fontSize: 24,
                  }}
                />
              }
              className={
                activeMenuItem === "/supplier/database" ? "active" : ""
              }
              style={{
                fontSize: 14,
                ...subMenuStyles,
                ...(activeMenuItem === "/supplier/database"
                  ? activeStyles
                  : {}),
              }}
            >
              Users
            </MenuItem>
            <MenuItem
              component={<Link to="/supplier/downline" />}
              icon={
                <FaListAlt
                  style={{
                    color:
                      activeMenuItem === "/supplier/downline"
                        ? "#0C7FDA"
                        : "#5D7285",
                    fontSize: 24,
                  }}
                />
              }
              className={
                activeMenuItem === "/supplier/downline" ? "active" : ""
              }
              style={{
                fontSize: 14,
                ...subMenuStyles,
                ...(activeMenuItem === "/supplier/downline"
                  ? activeStyles
                  : {}),
              }}
            >
              Downline
            </MenuItem>
          </SubMenu>

          {/* Logout Menu Item */}
          <div
            style={{
              position: "absolute",
              bottom: 80,
              left: 45,
            }}
            onClick={() => localStorage.clear()}
          >
            <MenuItem
              icon={
                <FaSignOutAlt
                  style={{
                    color: "#0C7FDA",
                    fontSize: 24,
                  }}
                />
              }
              style={{
                fontSize: 18,
                fontWeight: "400",
                fontFamily: "monospace",
                color: "#5D7285",
                marginTop: 10,
                backgroundColor: "rgba(67, 24, 255, 0.1)",
                borderRadius: 5,
              }}
            >
              Logout
            </MenuItem>
          </div>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SidebarDash;

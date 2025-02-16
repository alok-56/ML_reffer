import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  FaWallet,
  FaUsersCog,
  FaNewspaper,
  FaRegFileAlt,
  FaDollarSign,
  FaMoneyBill,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const SidebarDash = () => {
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState(location.pathname);
  const navigate = useNavigate();

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

  const handlelogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  const getIcon = (path) => {
    switch (path) {
      case "/":
        return <FaHome style={iconStyle} />;
      case "/transaction":
        return <FaDollarSign style={iconStyle} />;
      case "/setting/bank":
        return <FaWallet style={iconStyle} />;
      case "/setting/news":
        return <FaNewspaper style={iconStyle} />;
      case "/setting/ranks":
        return <FaUsersCog style={iconStyle} />;
      case "/setting/ticket":
        return <FaRegFileAlt style={iconStyle} />;
      case "/wallet/addfund":
        return <FaPlus style={iconStyle} />;
      case "/wallet/balancereport":
        return <FaListAlt style={iconStyle} />;
      case "/wallet/balance":
        return <FaDollarSign style={iconStyle} />;
      case "/wallet/transaction":
        return <FaMoneyBill style={iconStyle} />;
      case "/wallet/paid":
        return <FaWallet style={iconStyle} />;
      case "/wallet/transfer":
        return <FaRegFileAlt style={iconStyle} />;
      case "/wallet/prinicipal/wallet":
        return <FaListAlt style={iconStyle} />;
      case "/Payout/commision/details":
        return <FaListAlt style={iconStyle} />;
      case "/Payout/Excepted/monthly/income":
        return <FaPlus style={iconStyle} />;
      case "/Payout/voucher/list":
        return <FaListAlt style={iconStyle} />;
      case "/Payout/voucher/generate":
        return <FaPlus style={iconStyle} />;
      case "/member/managemember":
        return <FaPeopleArrows style={iconStyle} />;
      case "/member/SponserTeam":
        return <FaPeopleArrows style={iconStyle} />;
      case "/member/LevelWiseTeam":
        return <FaPeopleArrows style={iconStyle} />;
      default:
        return <FaHome style={iconStyle} />;
    }
  };

  const getSubMenuIcon = (path) => {
    switch (path) {
      case "/setting/bank":
        return <FaWallet style={iconStyle} />;
      case "/setting/news":
        return <FaNewspaper style={iconStyle} />;
      case "/setting/ranks":
        return <FaUsersCog style={iconStyle} />;
      case "/setting/ticket":
        return <FaRegFileAlt style={iconStyle} />;
      case "/wallet/addfund":
        return <FaPlus style={iconStyle} />;
      case "/wallet/balancereport":
        return <FaListAlt style={iconStyle} />;
      case "/wallet/transaction":
        return <FaShoppingCart style={iconStyle} />;
      case "/wallet/balance":
        return <FaShoppingCart style={iconStyle} />;
      case "/wallet/paid":
        return <FaWallet style={iconStyle} />;
      case "/wallet/transfer":
        return <FaRegFileAlt style={iconStyle} />;
      case "/wallet/prinicipal/wallet":
        return <FaListAlt style={iconStyle} />;
      case "/Payout/commision/details":
        return <FaListAlt style={iconStyle} />;
      case "/Payout/Excepted/monthly/income":
        return <FaPlus style={iconStyle} />;
      case "/Payout/voucher/list":
        return <FaListAlt style={iconStyle} />;
      case "/Payout/voucher/generate":
        return <FaPlus style={iconStyle} />;
      case "/member/managemember":
        return <FaPeopleArrows style={iconStyle} />;
      case "/member/SponserTeam":
        return <FaPeopleArrows style={iconStyle} />;
      case "/member/LevelWiseTeam":
        return <FaPeopleArrows style={iconStyle} />;
      default:
        return <FaHome style={iconStyle} />;
    }
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
            <h3>Demo</h3>
          </div>

          {/* Dashboard */}
          <MenuItem
            component={<Link to="/" />}
            icon={getIcon("/")}
            className={activeMenuItem === "/" ? "active" : ""}
            style={{
              ...commonStyles,
              ...(activeMenuItem === "/" ? activeStyles : {}),
            }}
          >
            Dashboard
          </MenuItem>

          {/* Transaction */}
          <MenuItem
            component={<Link to="/transaction" />}
            icon={getIcon("/transaction")}
            className={activeMenuItem === "/transaction" ? "active" : ""}
            style={{
              ...commonStyles,
              ...(activeMenuItem === "/transaction" ? activeStyles : {}),
            }}
          >
            Bussiness
          </MenuItem>

          {/* Settings */}
          <SubMenu
            label="Settings"
            icon={getSubMenuIcon("/setting/bank")}
            className={
              activeMenuItem === "/setting/bank" ||
              activeMenuItem === "/setting/news" ||
              activeMenuItem === "/setting/ranks" ||
              activeMenuItem === "/setting/ticket"
                ? "active"
                : ""
            }
            style={{
              ...commonStyles,
              ...(activeMenuItem === "/setting/bank" ||
              activeMenuItem === "/setting/news" ||
              activeMenuItem === "/setting/ranks" ||
              activeMenuItem === "/setting/ticket"
                ? activeSubMenuStyles
                : {}),
            }}
          >
            <MenuItem
              component={<Link to="/setting/news" />}
              icon={getIcon("/setting/news")}
              className={activeMenuItem === "/setting/news" ? "active" : ""}
              style={{
                fontSize: 14,
                ...subMenuStyles,
                ...(activeMenuItem === "/setting/news" ? activeStyles : {}),
              }}
            >
              News
            </MenuItem>
            <MenuItem
              component={<Link to="/setting/ranks" />}
              icon={getIcon("/setting/ranks")}
              className={activeMenuItem === "/setting/ranks" ? "active" : ""}
              style={{
                fontSize: 14,
                ...subMenuStyles,
                ...(activeMenuItem === "/setting/ranks" ? activeStyles : {}),
              }}
            >
              Ranks
            </MenuItem>
            <MenuItem
              component={<Link to="/setting/ticket" />}
              icon={getIcon("/setting/ticket")}
              className={activeMenuItem === "/setting/ticket" ? "active" : ""}
              style={{
                fontSize: 14,
                ...subMenuStyles,
                ...(activeMenuItem === "/setting/ticket" ? activeStyles : {}),
              }}
            >
              Manage Tickets
            </MenuItem>
          </SubMenu>
          {/* Member */}
          <SubMenu
            label="Member"
            icon={getSubMenuIcon("/member/managemember")}
            className={
              activeMenuItem === "/member/managemember" ||
              activeMenuItem === "/member/SponserTeam" ||
              activeMenuItem === "/member/LevelWiseTeam" ||
              activeMenuItem === "/member/LevelWiseTeam"
                ? "active"
                : ""
            }
            style={{
              ...commonStyles,
              ...(activeMenuItem === "/member/managemember" ||
              activeMenuItem === "/member/SponserTeam" ||
              activeMenuItem === "/member/LevelWiseTeam"
                ? activeSubMenuStyles
                : {}),
            }}
          >
            <MenuItem
              component={<Link to="/member/managemember" />}
              icon={getIcon("/member/managemember")}
              className={
                activeMenuItem === "/member/managemember" ? "active" : ""
              }
              style={{
                fontSize: 14,
                ...subMenuStyles,
                ...(activeMenuItem === "/member/managemember"
                  ? activeStyles
                  : {}),
              }}
            >
              Manage Member
            </MenuItem>
            <MenuItem
              component={<Link to="/member/SponserTeam" />}
              icon={getIcon("/member/SponserTeam")}
              className={
                activeMenuItem === "/member/SponserTeam" ? "active" : ""
              }
              style={{
                fontSize: 14,
                ...subMenuStyles,
                ...(activeMenuItem === "/member/SponserTeam"
                  ? activeStyles
                  : {}),
              }}
            >
              Sponser Team
            </MenuItem>
            <MenuItem
              component={<Link to="/member/LevelWiseTeam" />}
              icon={getIcon("/member/LevelWiseTeam")}
              className={
                activeMenuItem === "/member/LevelWiseTeam" ? "active" : ""
              }
              style={{
                fontSize: 14,
                ...subMenuStyles,
                ...(activeMenuItem === "/member/LevelWiseTeam"
                  ? activeStyles
                  : {}),
              }}
            >
              Level Wise Team
            </MenuItem>

            <MenuItem
              component={<Link to="/member/withdraw" />}
              icon={getIcon("/wallet/transaction")}
              className={activeMenuItem === "/member/withdraw" ? "active" : ""}
              style={{
                fontSize: 14,
                ...subMenuStyles,
                ...(activeMenuItem === "/member/withdraw" ? activeStyles : {}),
              }}
            >
              Withdwral request
            </MenuItem>
          </SubMenu>

          {/* Wallet */}
          <SubMenu
            label="Wallet"
            icon={getSubMenuIcon("/wallet/transaction")}
            className={
              activeMenuItem === "/wallet/transaction" ||
              activeMenuItem === "/wallet/paid" ||
              activeMenuItem === "/wallet/transfer" ||
              activeMenuItem === "/wallet/prinicipal/wallet"
                ? "active"
                : ""
            }
            style={{
              ...commonStyles,
              ...(activeMenuItem === "/wallet/transaction" ||
              activeMenuItem === "/wallet/paid" ||
              activeMenuItem === "/wallet/transfer" ||
              activeMenuItem === "/wallet/prinicipal/wallet"
                ? activeSubMenuStyles
                : {}),
            }}
          >
            <MenuItem
              component={<Link to="/wallet/addfund" />}
              icon={getIcon("/wallet/balance")}
              className={activeMenuItem === "/wallet/addfund" ? "active" : ""}
              style={{
                fontSize: 14,
                ...subMenuStyles,
                ...(activeMenuItem === "/wallet/addfund" ? activeStyles : {}),
              }}
            >
              Add/Deduct Fund
            </MenuItem>
            <MenuItem
              component={<Link to="/wallet/balance" />}
              icon={getIcon("/wallet/balance")}
              className={activeMenuItem === "/wallet/balance" ? "active" : ""}
              style={{
                fontSize: 14,
                ...subMenuStyles,
                ...(activeMenuItem === "/wallet/balance" ? activeStyles : {}),
              }}
            >
              Balance
            </MenuItem>
            <MenuItem
              component={<Link to="/wallet/transaction" />}
              icon={getIcon("/wallet/transaction")}
              className={
                activeMenuItem === "/wallet/transaction" ? "active" : ""
              }
              style={{
                fontSize: 14,
                ...subMenuStyles,
                ...(activeMenuItem === "/wallet/transaction"
                  ? activeStyles
                  : {}),
              }}
            >
              Wallet Transaction
            </MenuItem>
            <MenuItem
              component={<Link to="/wallet/paid" />}
              icon={getIcon("/wallet/paid")}
              className={activeMenuItem === "/wallet/paid" ? "active" : ""}
              style={{
                fontSize: 14,
                ...subMenuStyles,
                ...(activeMenuItem === "/wallet/paid" ? activeStyles : {}),
              }}
            >
              Due Wallet
            </MenuItem>
            <MenuItem
              component={<Link to="/wallet/transfer" />}
              icon={getIcon("/wallet/transfer")}
              className={activeMenuItem === "/wallet/transfer" ? "active" : ""}
              style={{
                fontSize: 14,
                ...subMenuStyles,
                ...(activeMenuItem === "/wallet/transfer" ? activeStyles : {}),
              }}
            >
              Transferd Wallet
            </MenuItem>
            <MenuItem
              component={<Link to="/wallet/prinicipal/wallet" />}
              icon={getIcon("/wallet/prinicipal/wallet")}
              className={
                activeMenuItem === "/wallet/prinicipal/wallet" ? "active" : ""
              }
              style={{
                fontSize: 14,
                ...subMenuStyles,
                ...(activeMenuItem === "/wallet/prinicipal/wallet"
                  ? activeStyles
                  : {}),
              }}
            >
              Principal Wallet
            </MenuItem>
          </SubMenu>

          {/* Payout */}
          <SubMenu
            label="Payout"
            icon={getSubMenuIcon("/Payout/commision/details")}
            className={
              activeMenuItem === "/Payout/commision/details" ||
              activeMenuItem === "/Payout/Excepted/monthly/income" ||
              activeMenuItem === "/Payout/voucher/list" ||
              activeMenuItem === "/Payout/voucher/generate"
                ? "active"
                : ""
            }
            style={{
              ...commonStyles,
              ...(activeMenuItem === "/Payout/commision/details" ||
              activeMenuItem === "/Payout/Excepted/monthly/income" ||
              activeMenuItem === "/Payout/voucher/list" ||
              activeMenuItem === "/Payout/voucher/generate"
                ? activeSubMenuStyles
                : {}),
            }}
          >
            <MenuItem
              component={<Link to="/Payout/commision/details" />}
              icon={getIcon("/Payout/commision/details")}
              className={
                activeMenuItem === "/Payout/commision/details" ? "active" : ""
              }
              style={{
                fontSize: 14,
                ...subMenuStyles,
                ...(activeMenuItem === "/Payout/commision/details"
                  ? activeStyles
                  : {}),
              }}
            >
              Commission Details
            </MenuItem>
            <MenuItem
              component={<Link to="/Payout/Excepted/monthly/income" />}
              icon={getIcon("/Payout/Excepted/monthly/income")}
              className={
                activeMenuItem === "/Payout/Excepted/monthly/income"
                  ? "active"
                  : ""
              }
              style={{
                fontSize: 14,
                ...subMenuStyles,
                ...(activeMenuItem === "/Payout/Excepted/monthly/income"
                  ? activeStyles
                  : {}),
              }}
            >
              Expected Monthly Income
            </MenuItem>
            <MenuItem
              component={<Link to="/Payout/voucher/list" />}
              icon={getIcon("/Payout/voucher/list")}
              className={
                activeMenuItem === "/Payout/voucher/list" ? "active" : ""
              }
              style={{
                fontSize: 14,
                ...subMenuStyles,
                ...(activeMenuItem === "/Payout/voucher/list"
                  ? activeStyles
                  : {}),
              }}
            >
              Voucher List
            </MenuItem>
            <MenuItem
              component={<Link to="/Payout/voucher/generate" />}
              icon={getIcon("/Payout/voucher/generate")}
              className={
                activeMenuItem === "/Payout/voucher/generate" ? "active" : ""
              }
              style={{
                fontSize: 14,
                ...subMenuStyles,
                ...(activeMenuItem === "/Payout/voucher/generate"
                  ? activeStyles
                  : {}),
              }}
            >
              Generate Voucher
            </MenuItem>
          </SubMenu>

          {/* Logout */}
          <div
            style={{
              position: "absolute",
              bottom: 80,
              left: 45,
            }}
            onClick={() => handlelogout()}
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

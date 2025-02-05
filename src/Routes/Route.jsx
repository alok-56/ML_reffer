
import Login from "../Pages/Auth/Login/Login";
import Home from "../Pages/Home/Home";
import Downline from "../Pages/Supplier/Downline";
import SupplierDatabase from "../Pages/Supplier/SupplierDatabase/SupplierDatabase";


const AppRoute = [
  {
    name: "Login",
    Component:Login,
    route: "/login",
    private: false,
  },
  {
    name: "Home",
    Component: Home,
    route: "/",
    private: true,
  },
  {
    name: "SupplierDatabase",
    Component: SupplierDatabase,
    route: "/supplier/database",
    private: true,
  },
  {
    name: "downline",
    Component: Downline,
    route: "/supplier/downline",
    private: true,
  }
];

export default AppRoute;

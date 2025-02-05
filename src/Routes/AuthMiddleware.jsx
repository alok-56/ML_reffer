import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthMiddleware = ({ children }) => {
  let token=localStorage.getItem('token')

  if (token) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

export default AuthMiddleware;

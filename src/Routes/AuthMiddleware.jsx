import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from 'js-cookie';

const AuthMiddleware = ({ children }) => {
  let token = Cookies.get('token');

  if (token) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

export default AuthMiddleware;

// components/Guard/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, adminOnly }) => {
  const user = JSON.parse(localStorage.getItem("user")); // ya token check kar sakte ho

  if (!user) {
    // user login nahi hai
    return <Navigate to="/Login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    // admin route hai par normal user
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;

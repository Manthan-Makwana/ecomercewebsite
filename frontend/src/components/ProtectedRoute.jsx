import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";

// Protects routes that require login.
// Shows loader while auth is being verified (cookie check on first load).
// Redirects to /login if not authenticated.

function ProtectedRoute({ children }) {
  const { isAuthenticated, authChecked } = useSelector((state) => state.user);

  if (!authChecked) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;

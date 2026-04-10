import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";

// Protects admin routes.
// Must be authenticated AND have role 'admin' or 'superadmin'.
// Redirects unauthenticated users to /login, unauthorized users to /.

function AdminRoute({ children }) {
  const { isAuthenticated, authChecked, user } = useSelector((state) => state.user);

  if (!authChecked) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;

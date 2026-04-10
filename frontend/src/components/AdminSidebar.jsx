import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./AdminSidebar.css";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

function AdminSidebar() {
  const { pathname } = useLocation();

  const links = [
    { to: "/admin/dashboard", label: "Dashboard",  Icon: DashboardOutlinedIcon },
    { to: "/admin/products",  label: "Products",   Icon: Inventory2OutlinedIcon },
    { to: "/admin/orders",    label: "Orders",     Icon: ShoppingBagOutlinedIcon },
    { to: "/admin/users",     label: "Users",      Icon: PeopleOutlinedIcon },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <h2>Admin Panel</h2>
        <p>SelectDresses</p>
      </div>

      <nav className="admin-sidebar-nav">
        <span className="admin-nav-label">Main Menu</span>

        {links.map(({ to, label, Icon }) => (
          <Link
            key={to}
            to={to}
            className={`admin-nav-link ${pathname === to ? "active" : ""}`}
          >
            <Icon className="admin-nav-icon" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <Link to="/" className="admin-nav-link">
          <HomeOutlinedIcon className="admin-nav-icon" />
          <span>Back to Store</span>
        </Link>
      </div>
    </aside>
  );
}

export default AdminSidebar;
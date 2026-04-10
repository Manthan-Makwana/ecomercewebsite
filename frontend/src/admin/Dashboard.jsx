import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../components/AdminSidebar.css";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

const BASE = "http://localhost:8000/api/v1";

function Dashboard() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res  = await fetch(`${BASE}/admin/dashboard`, { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, []);

  const cards = stats ? [
    { label: "Total Orders",   value: stats.orders,              Icon: ShoppingBagOutlinedIcon, cls: "orders"   },
    { label: "Total Products", value: stats.products,            Icon: Inventory2OutlinedIcon,  cls: "products" },
    { label: "Total Users",    value: stats.users,               Icon: PeopleOutlinedIcon,      cls: "users"    },
    { label: "Total Revenue",  value: `₹${stats.revenue || 0}`, Icon: CurrencyRupeeIcon,       cls: "revenue"  },
  ] : [];

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="admin-content">

        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Dashboard</h1>
            <p className="admin-page-subtitle">Overview of your store performance</p>
          </div>
        </div>

        {error && <div className="admin-error-bar">{error}</div>}

        {loading ? (
          <div className="admin-loading">Loading stats…</div>
        ) : (
          <div className="admin-stats-grid">
            {cards.map(({ label, value, Icon, cls }) => (
              <div className="admin-stat-card" key={label}>
                <div className={`admin-stat-icon ${cls}`}>
                  <Icon fontSize="inherit" />
                </div>
                <div className="admin-stat-info">
                  <p className="admin-stat-label">{label}</p>
                  <p className="admin-stat-value">{value ?? "—"}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}

export default Dashboard;
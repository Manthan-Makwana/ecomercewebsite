import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import Loader from "../components/Loader";
import "../pageStyles/MyOrders.css";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

const BASE = "http://localhost:8000/api/v1";

function getStatusClass(status) {
  switch ((status || "").toLowerCase()) {
    case "processing": return "status-processing";
    case "shipped":    return "status-shipped";
    case "delivered":  return "status-delivered";
    case "cancelled":  return "status-cancelled";
    default:           return "status-default";
  }
}

function MyOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${BASE}/orders/user`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
        setOrders(data.orders || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (loading) return <Loader />;

  return (
    <>
      <PageTitle title="My Orders | Select Dresses" />
      <Navbar />

      <div className="myorders-page">
        {/* Header */}
        <div className="myorders-header">
          <span className="myorders-header-label">Account</span>
          <h1>My Orders</h1>
        </div>

        <div className="myorders-content">
          {error ? (
            <div className="myorders-empty">
              <p style={{ color: "#C0392B" }}>{error}</p>
              <Link to="/products" className="myorders-shop-btn">Start Shopping</Link>
            </div>
          ) : orders.length === 0 ? (
            /* ── Empty state ── */
            <div className="myorders-empty">
              <ShoppingBagOutlinedIcon className="myorders-empty-icon" />
              <h2>No orders yet</h2>
              <p>You haven't placed any orders. Start shopping to see them here.</p>
              <Link to="/products" className="myorders-shop-btn">Browse Collection</Link>
            </div>
          ) : (
            /* ── Order list ── */
            <div className="myorders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-card">
                  {/* Card Header */}
                  <div className="order-card-header">
                    <div className="order-id-block">
                      <span className="order-id-label">Order ID</span>
                      <span className="order-id-value">{order._id}</span>
                    </div>
                    <span className={`order-status-badge ${getStatusClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="order-card-body">
                    <div className="order-meta">
                      <div className="order-meta-row">
                        <CalendarTodayOutlinedIcon className="order-meta-icon" />
                        <span>Placed: {formatDate(order.createdAt)}</span>
                      </div>
                      <div className="order-meta-row">
                        <ReceiptLongOutlinedIcon className="order-meta-icon" />
                        <span>{order.orderItems?.length || 0} item(s)</span>
                      </div>
                    </div>
                    <div className="order-total">₹{order.totalPrice}</div>
                  </div>

                  {/* Item chips */}
                  {order.orderItems?.length > 0 && (
                    <div className="order-items-preview">
                      {order.orderItems.map((item, i) => (
                        <span key={i} className="order-item-chip">
                          {item.name} × {item.quantity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default MyOrders;

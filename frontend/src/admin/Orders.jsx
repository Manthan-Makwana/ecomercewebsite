import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../components/AdminSidebar.css";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const BASE = "http://localhost:8000/api/v1";
const STATUSES = ["Processing", "Shipped", "Delivered"];

function getStatusClass(s) {
  switch ((s || "").toLowerCase()) {
    case "processing": return "badge-processing";
    case "shipped":    return "badge-shipped";
    case "delivered":  return "badge-delivered";
    case "cancelled":  return "badge-cancelled";
    default:           return "badge-user";
  }
}

function Orders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(null);

  /* Update status modal */
  const [editOrder, setEditOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [saving, setSaving]       = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/admin/orders`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrders(data.orders || []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const flash = (type, msg) => {
    if (type === "success") setSuccess(msg);
    else setError(msg);
    setTimeout(() => { setSuccess(null); setError(null); }, 4000);
  };

  const openEdit = (order) => { setEditOrder(order); setNewStatus(order.orderStatus); };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${BASE}/admin/order/${editOrder._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      flash("success", "Order status updated!");
      setEditOrder(null);
      fetchOrders();
    } catch (err) { flash("error", err.message); }
    finally { setSaving(false); }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="admin-content">

        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Orders</h1>
            <p className="admin-page-subtitle">Manage and update customer orders</p>
          </div>
        </div>

        {error   && <div className="admin-error-bar">{error}</div>}
        {success && <div className="admin-success-bar">{success}</div>}

        <div className="admin-table-card">
          <div className="admin-table-header">
            <p className="admin-table-title">All Orders ({orders.length})</p>
          </div>

          {loading ? (
            <div className="admin-loading">Loading orders…</div>
          ) : orders.length === 0 ? (
            <div className="admin-empty">No orders yet.</div>
          ) : (
            <div style={{ overflowX:"auto" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td><span className="admin-id">{order._id}</span></td>
                      <td>{order.shippingInfo?.name || "—"}</td>
                      <td>{order.orderItems?.length || 0} item(s)</td>
                      <td style={{ fontWeight:600 }}>₹{order.totalPrice}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>
                        <span className={`admin-badge ${getStatusClass(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td>
                        {order.orderStatus !== "Delivered" && (
                          <button className="admin-btn admin-btn-edit admin-btn-sm" onClick={() => openEdit(order)}>
                            <EditOutlinedIcon fontSize="small" /> Update
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Update Status Modal ── */}
        {editOrder && (
          <div className="admin-modal-overlay" onClick={() => setEditOrder(null)}>
            <div className="admin-modal" onClick={e => e.stopPropagation()}>
              <div className="admin-modal-head">
                <h3>Update Order Status</h3>
                <button className="admin-modal-close" onClick={() => setEditOrder(null)}><CloseIcon /></button>
              </div>

              <form onSubmit={handleUpdateStatus}>
                <div className="admin-modal-body">
                  <p style={{ color:"#6F6F6F", fontSize:"0.875rem" }}>
                    Order: <strong style={{ color:"#1C1C1C", fontFamily:"monospace" }}>{editOrder._id}</strong>
                  </p>
                  <p style={{ color:"#6F6F6F", fontSize:"0.875rem" }}>
                    Customer: <strong style={{ color:"#1C1C1C" }}>{editOrder.shippingInfo?.name}</strong>
                    {" — "} ₹{editOrder.totalPrice}
                  </p>

                  <div className="admin-field">
                    <label>New Status</label>
                    <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="admin-modal-footer">
                  <button type="button" className="admin-btn" style={{ background:"#F7F5F0", color:"#6F6F6F" }} onClick={() => setEditOrder(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                    {saving ? "Saving…" : "Update Status"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default Orders;
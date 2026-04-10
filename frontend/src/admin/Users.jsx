import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../components/AdminSidebar.css";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const BASE = "http://localhost:8000/api/v1";

function Users() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(null);

  /* Role update modal */
  const [editUser, setEditUser] = useState(null);
  const [newRole, setNewRole]   = useState("user");
  const [saving, setSaving]     = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/admin/users`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers(data.users || []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const flash = (type, msg) => {
    if (type === "success") setSuccess(msg);
    else setError(msg);
    setTimeout(() => { setSuccess(null); setError(null); }, 4000);
  };

  /* Update role */
  const handleUpdateRole = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${BASE}/admin/user/${editUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      flash("success", `${editUser.name}'s role updated to "${newRole}"`);
      setEditUser(null);
      fetchUsers();
    } catch (err) { flash("error", err.message); }
    finally { setSaving(false); }
  };

  /* Delete user */
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      const res  = await fetch(`${BASE}/admin/user/${id}`, { method:"DELETE", credentials:"include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      flash("success", "User deleted.");
      fetchUsers();
    } catch (err) { flash("error", err.message); }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="admin-content">

        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Users</h1>
            <p className="admin-page-subtitle">Manage registered accounts</p>
          </div>
        </div>

        {error   && <div className="admin-error-bar">{error}</div>}
        {success && <div className="admin-success-bar">{success}</div>}

        <div className="admin-table-card">
          <div className="admin-table-header">
            <p className="admin-table-title">All Users ({users.length})</p>
          </div>

          {loading ? (
            <div className="admin-loading">Loading users…</div>
          ) : users.length === 0 ? (
            <div className="admin-empty">No users found.</div>
          ) : (
            <div style={{ overflowX:"auto" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td><span className="admin-id">{u._id}</span></td>
                      <td style={{ fontWeight:500 }}>{u.name}</td>
                      <td style={{ color:"#6F6F6F" }}>{u.email}</td>
                      <td>
                        <span className={`admin-badge ${u.role === "admin" || u.role === "superadmin" ? "badge-admin" : "badge-user"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>{u.createdAt ? formatDate(u.createdAt) : "—"}</td>
                      <td>
                        <div className="admin-actions-cell">
                          <button
                            className="admin-btn admin-btn-edit admin-btn-sm"
                            onClick={() => { setEditUser(u); setNewRole(u.role); }}
                          >
                            <EditOutlinedIcon fontSize="small" /> Role
                          </button>
                          <button
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            onClick={() => handleDelete(u._id, u.name)}
                          >
                            <DeleteOutlineIcon fontSize="small" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Role Update Modal ── */}
        {editUser && (
          <div className="admin-modal-overlay" onClick={() => setEditUser(null)}>
            <div className="admin-modal" onClick={e => e.stopPropagation()}>
              <div className="admin-modal-head">
                <h3>Change User Role</h3>
                <button className="admin-modal-close" onClick={() => setEditUser(null)}><CloseIcon /></button>
              </div>

              <form onSubmit={handleUpdateRole}>
                <div className="admin-modal-body">
                  <p style={{ color:"#6F6F6F", fontSize:"0.875rem" }}>
                    User: <strong style={{ color:"#1C1C1C" }}>{editUser.name}</strong>
                    {" — "}{editUser.email}
                  </p>

                  <div className="admin-field">
                    <label>New Role</label>
                    <select value={newRole} onChange={e => setNewRole(e.target.value)}>
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </div>
                </div>

                <div className="admin-modal-footer">
                  <button type="button" className="admin-btn" style={{ background:"#F7F5F0", color:"#6F6F6F" }} onClick={() => setEditUser(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                    {saving ? "Saving…" : "Update Role"}
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

export default Users;
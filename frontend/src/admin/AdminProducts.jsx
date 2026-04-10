import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../components/AdminSidebar.css";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";

const BASE = "http://localhost:8000/api/v1";

const CATEGORIES = ["Tshirts","Dress-Material","Kurti","Baby-Shoes","Night-Dress","Gaun","Gift-Items","Customized-Gift"];

const emptyForm = { name:"", description:"", price:"", stock:"", category:"Tshirts", image:[{public_id:"n/a",url:""}] };

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [success, setSuccess]   = useState(null);

  /* modal state */
  const [modal, setModal]       = useState(null); // null | "create" | "edit"
  const [form, setForm]         = useState(emptyForm);
  const [saving, setSaving]     = useState(false);
  const [editId, setEditId]     = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/admin/products`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProducts(data.products || []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const flash = (type, msg) => {
    if (type === "success") setSuccess(msg);
    else setError(msg);
    setTimeout(() => { setSuccess(null); setError(null); }, 4000);
  };

  /* Open create */
  const openCreate = () => { setForm(emptyForm); setEditId(null); setModal("create"); };

  /* Open edit */
  const openEdit = (p) => {
    setForm({
      name: p.name, description: p.description,
      price: p.price, stock: p.stock, category: p.category,
      image: p.image?.length ? p.image : [{ public_id:"n/a", url:"" }]
    });
    setEditId(p._id);
    setModal("edit");
  };

  /* Handle form change */
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "imageUrl") {
      setForm(f => ({ ...f, image: [{ public_id:"n/a", url: value }] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  /* Submit create / edit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url    = modal === "create" ? `${BASE}/admin/product/create` : `${BASE}/product/${editId}`;
      const method = modal === "create" ? "POST" : "PUT";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type":"application/json" },
        credentials:"include",
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      flash("success", modal === "create" ? "Product created!" : "Product updated!");
      setModal(null);
      fetchProducts();
    } catch (err) { flash("error", err.message); }
    finally { setSaving(false); }
  };

  /* Delete */
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      const res  = await fetch(`${BASE}/product/${id}`, { method:"DELETE", credentials:"include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      flash("success", "Product deleted.");
      fetchProducts();
    } catch (err) { flash("error", err.message); }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="admin-content">

        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Products</h1>
            <p className="admin-page-subtitle">Manage your store catalogue</p>
          </div>
          <button className="admin-btn admin-btn-primary" onClick={openCreate}>
            <AddIcon fontSize="small" /> Add Product
          </button>
        </div>

        {error   && <div className="admin-error-bar">{error}</div>}
        {success && <div className="admin-success-bar">{success}</div>}

        <div className="admin-table-card">
          <div className="admin-table-header">
            <p className="admin-table-title">All Products ({products.length})</p>
          </div>

          {loading ? (
            <div className="admin-loading">Loading products…</div>
          ) : products.length === 0 ? (
            <div className="admin-empty">No products found. Add one!</div>
          ) : (
            <div style={{ overflowX:"auto" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id}>
                      <td><span className="admin-id">{p._id}</span></td>
                      <td style={{ fontWeight:500 }}>{p.name}</td>
                      <td>{p.category}</td>
                      <td>₹{p.price}</td>
                      <td>
                        <span className={p.stock > 0 ? "" : "admin-badge badge-cancelled"}>
                          {p.stock > 0 ? p.stock : "Out of Stock"}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions-cell">
                          <button className="admin-btn admin-btn-edit admin-btn-sm" onClick={() => openEdit(p)}>
                            <EditOutlinedIcon fontSize="small" /> Edit
                          </button>
                          <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(p._id, p.name)}>
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

        {/* ── Modal ── */}
        {modal && (
          <div className="admin-modal-overlay" onClick={() => setModal(null)}>
            <div className="admin-modal" onClick={e => e.stopPropagation()}>
              <div className="admin-modal-head">
                <h3>{modal === "create" ? "Add New Product" : "Edit Product"}</h3>
                <button className="admin-modal-close" onClick={() => setModal(null)}><CloseIcon /></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="admin-modal-body">
                  <div className="admin-field">
                    <label>Product Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Floral Kurti" />
                  </div>

                  <div className="admin-field">
                    <label>Description *</label>
                    <textarea name="description" value={form.description} onChange={handleChange} required rows={3} placeholder="Describe the product…" />
                  </div>

                  <div className="admin-field-row">
                    <div className="admin-field">
                      <label>Price (₹) *</label>
                      <input name="price" type="number" value={form.price} onChange={handleChange} required min="0" />
                    </div>
                    <div className="admin-field">
                      <label>Stock *</label>
                      <input name="stock" type="number" value={form.stock} onChange={handleChange} required min="0" />
                    </div>
                  </div>

                  <div className="admin-field">
                    <label>Category *</label>
                    <select name="category" value={form.category} onChange={handleChange}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="admin-field">
                    <label>Image URL</label>
                    <input name="imageUrl" value={form.image?.[0]?.url || ""} onChange={handleChange} placeholder="https://…  or leave blank" />
                  </div>
                </div>

                <div className="admin-modal-footer">
                  <button type="button" className="admin-btn" style={{ background:"#F7F5F0", color:"#6F6F6F" }} onClick={() => setModal(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                    {saving ? "Saving…" : modal === "create" ? "Create Product" : "Save Changes"}
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

export default AdminProducts;
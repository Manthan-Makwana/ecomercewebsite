import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Loader from "../components/Loader";
import { removeFromCart } from "../features/cart/cartSlice";
import { getImageUrl } from "../utils/getImageUrl";
import "../CartStyles/Payment.css";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";

const BASE = "http://localhost:8000/api/v1";

function Payment() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const { cartItems }  = useSelector((state) => state.cart);
  const { user }       = useSelector((state) => state.user);

  // Read shipping from localStorage (saved by Checkout page)
  const raw = JSON.parse(localStorage.getItem("shippingInfo") || "{}");
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo") || "{}");

  // ── Map checkout field names → order model field names ──────────────────
  // Checkout saves: name, phone, address, city, state, pincode, country
  // Order model needs: address, city, state, country, pinCode, phoneNo, taluka, village
  const shippingInfo = {
    address:  raw.address  || "",
    city:     raw.city     || "",
    state:    raw.state    || "",
    country:  raw.country  || "India",
    pinCode:  Number(raw.pincode || raw.pinCode || 0),
    phoneNo:  Number(raw.phone   || raw.phoneNo  || 0),
    taluka:   raw.taluka   || "",
    village:  raw.village  || "",
    name:     raw.name     || user?.name || "",
  };

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placing, setPlacing]    = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [error, setError]        = useState(null);

  const subtotal  = orderInfo.subtotal || cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping  = orderInfo.shipping ?? (subtotal >= 999 ? 0 : 100);
  const total     = orderInfo.total    || subtotal + shipping;

  // ── Place Order ──────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    setError(null);
    setPlacing(true);

    // Validate shipping info
    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.pinCode || !shippingInfo.phoneNo) {
      setError("Incomplete shipping information. Please go back and fill in all fields.");
      setPlacing(false);
      return;
    }

    const orderItems = cartItems.map((item) => ({
      name:     item.name,
      price:    item.price,
      quantity: item.quantity,
      image:    getImageUrl(item.image) || item.image?.[0]?.url || "https://via.placeholder.com/100",
      product:  item._id,
    }));

    const orderData = {
      shippingInfo,
      orderItems,
      paymentInfo: {
        id:     paymentMethod === "cod" ? "COD_" + Date.now() : "",
        status: paymentMethod === "cod" ? "Cash On Delivery" : "Pending",
      },
      itemsPrice:    subtotal,
      taxPrice:      0,
      shippingPrice: shipping,
      totalPrice:    total,
    };

    try {
      const res = await fetch(`${BASE}/new/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderData),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to place order");

      // Clear cart and local storage
      cartItems.forEach((item) => dispatch(removeFromCart(item._id)));
      localStorage.removeItem("shippingInfo");
      sessionStorage.removeItem("orderInfo");

      setPlacedOrder(data.order._id);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (placedOrder) {
    return (
      <>
        <PageTitle title="Order Placed | Select Dresses" />
        <Navbar />
        <div className="payment-page">
          <div className="payment-success">
            <div className="success-icon-circle">🎉</div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you, <strong>{user?.name?.split(" ")[0] || "there"}</strong>! Your order has been confirmed.</p>
            <p>We'll ship it to <strong>{shippingInfo.city}</strong> soon.</p>
            <div className="order-id-display">Order ID: {placedOrder}</div>
            <div className="success-actions">
              <Link to="/orders" className="success-btn-primary">Track My Orders</Link>
              <Link to="/products" className="success-btn-secondary">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (placing) return <Loader />;

  return (
    <>
      <PageTitle title="Payment | Select Dresses" />
      <Navbar />

      <div className="payment-page">
        {/* Header */}
        <div className="payment-header">
          <span className="payment-header-label">Checkout</span>
          <h1>Payment</h1>
        </div>

        {/* Step bar */}
        <div className="payment-steps">
          <div className="payment-step done">
            <span className="step-num">✓</span> Cart
          </div>
          <div className="step-connector" />
          <div className="payment-step done">
            <span className="step-num">✓</span> Shipping
          </div>
          <div className="step-connector" />
          <div className="payment-step done">
            <span className="step-num">✓</span> Confirm
          </div>
          <div className="step-connector" />
          <div className="payment-step active">
            <span className="step-num">4</span> Payment
          </div>
        </div>

        <div className="payment-layout">

          {/* ── Left: Payment Method ── */}
          <div className="payment-method-card">
            <p className="payment-method-title">Choose Payment Method</p>

            {/* COD */}
            <label className={`payment-option ${paymentMethod === "cod" ? "selected" : ""}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              <div className="payment-option-info">
                <p className="payment-option-name">
                  <LocalShippingOutlinedIcon fontSize="small" style={{ verticalAlign:"middle", marginRight:6 }} />
                  Cash on Delivery
                </p>
                <p className="payment-option-desc">Pay in cash when your order is delivered. No extra charges.</p>
              </div>
            </label>

            {/* Online (disabled) */}
            <label className="payment-option" style={{ opacity:0.5, cursor:"not-allowed" }}>
              <input type="radio" disabled />
              <div className="payment-option-info">
                <p className="payment-option-name">
                  <PaidOutlinedIcon fontSize="small" style={{ verticalAlign:"middle", marginRight:6 }} />
                  Online Payment
                </p>
                <p className="payment-option-desc">Credit / Debit card, UPI — Coming soon</p>
              </div>
            </label>

            {/* Shipping address preview */}
            {shippingInfo.address && (
              <div style={{ marginTop:"1.5rem", padding:"1rem", background:"#F7F5F0", border:"1px solid #E5E3DF", fontSize:"0.85rem" }}>
                <p style={{ fontWeight:600, marginBottom:"0.4rem", color:"#1C1C1C" }}>📦 Delivering to:</p>
                <p style={{ color:"#6F6F6F", margin:0 }}>
                  {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} — {shippingInfo.pinCode}
                </p>
              </div>
            )}

            {error && (
              <p style={{ color:"#C0392B", marginTop:"1rem", fontSize:"0.875rem", background:"#FFF5F5", padding:"0.75rem", border:"1px solid #FED7D7" }}>
                ⚠ {error}
              </p>
            )}
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="payment-summary-card">
            <p className="payment-summary-title">Order Summary</p>

            <div className="payment-summary-items">
              {cartItems.map((item) => (
                <div key={item._id} className="payment-summary-item">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="payment-divider" />

            <div className="payment-summary-item">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="payment-summary-item" style={{ marginTop:"0.4rem" }}>
              <span>Shipping</span>
              <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
            </div>

            <div className="payment-divider" />

            <div className="payment-total-row">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={placing || cartItems.length === 0}
            >
              {placing ? "Placing Order..." : `Place Order · ₹${total}`}
            </button>

            <p className="payment-secure-note">
              <LockOutlinedIcon style={{ fontSize:"0.875rem" }} />
              Secure checkout
            </p>
          </div>

        </div>
      </div>
    </>
  );
}

export default Payment;
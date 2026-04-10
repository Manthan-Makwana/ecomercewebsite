import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import "../UserStyles/Form.css";
import "../pageStyles/ForgotPassword.css";

const BASE = "http://localhost:8000/api/v1";

function ForgotPassword() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type, text }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/password/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      setMessage({
        type: "success",
        text: data.message || `Reset link sent to ${email}`,
      });
      setEmail("");
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle title="Forgot Password | Select Dresses" />
      <Navbar />

      <div className="fp-page">
        <div className="fp-card">

          {/* Brand Side */}
          <div className="fp-brand">
            <div className="brand-content">
              <span className="brand-subtitle">Account Recovery</span>
              <h1 className="brand-title">Forgot Your Password?</h1>
              <p className="brand-description">
                Enter the email address associated with your account and we'll
                send you a secure link to reset your password.
              </p>
              <div className="brand-features">
                <div className="feature-item">
                  <span className="feature-dot"></span>
                  <span className="feature-text">Link expires in 15 minutes</span>
                </div>
                <div className="feature-item">
                  <span className="feature-dot"></span>
                  <span className="feature-text">Check your spam folder if needed</span>
                </div>
                <div className="feature-item">
                  <span className="feature-dot"></span>
                  <span className="feature-text">Still need help? Contact support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="fp-form-side">
            <div className="form-header">
              <h2 className="form-title">Reset Password</h2>
              <p className="form-subtitle">We'll send a reset link to your email</p>
            </div>

            {/* Success State */}
            {message?.type === "success" ? (
              <div className="fp-success-box">
                <div className="fp-success-icon">✉️</div>
                <h3>Check your inbox</h3>
                <p>{message.text}</p>
                <Link to="/login" className="fp-back-btn">Back to Sign In</Link>
              </div>
            ) : (
              <form className="login-form" onSubmit={handleSubmit} noValidate>
                <div className="form-field">
                  <label htmlFor="fp-email" className="field-label">
                    Email Address <span className="required">*</span>
                  </label>
                  <div className="field-input-wrapper">
                    <EmailOutlinedIcon className="field-icon" />
                    <input
                      id="fp-email"
                      type="email"
                      className="field-input"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                {message?.type === "error" && (
                  <p className="field-error">{message.text}</p>
                )}

                <button
                  type="submit"
                  className="form-submit"
                  disabled={loading || !email.trim()}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>

                <div className="form-footer">
                  <span className="footer-text">Remember your password?</span>
                  <Link to="/login" className="footer-link">Sign In</Link>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export default ForgotPassword;

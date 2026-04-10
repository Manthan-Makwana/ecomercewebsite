import React, { useState } from 'react';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import '../UserStyles/Form.css';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/user/userSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
const { loading, error, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  useEffect(() => {
  if (isAuthenticated) {
    navigate("/");
  }
}, [isAuthenticated, navigate]);

  const handleBlur = (e) => {
    setTouched({
      ...touched,
      [e.target.name]: true
    });
  };
  

  const handleSubmit = (e) => {
  e.preventDefault();

  setTouched({
    email: true,
    password: true
  });

  if (!isFormValid()) return;

  const userData = {
    email: formData.email,
    password: formData.password
  };

  dispatch(login(userData));
};

  const isFormValid = () => {
    return formData.email.trim() !== '' && 
           formData.password.trim() !== '' &&
           formData.email.includes('@');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        
        {/* Left Side - Welcome Back */}
        <div className="login-brand">
          <div className="brand-content">
            <span className="brand-subtitle">WELCOME BACK</span>
            <h1 className="brand-title">SELECT DRESSES</h1>
            <p className="brand-description">
              Sign in to access your account, view your orders, and continue your shopping experience.
            </p>
            
            {/* Testimonial */}
            <div className="brand-testimonial">
              <div className="testimonial-avatars">
                <div className="avatar-group">
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Customer" />
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Customer" />
                  <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Customer" />
                </div>
                <span className="testimonial-text">Join 10,000+ professionals</span>
              </div>
            </div>

            {/* Features */}
            <div className="brand-features">
              <div className="feature-item">
                <span className="feature-dot"></span>
                <span className="feature-text">Secure checkout</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot"></span>
                <span className="feature-text">Order tracking</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot"></span>
                <span className="feature-text">Saved preferences</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-wrapper">
          <div className="form-header">
            <h2 className="form-title">Sign in</h2>
            <p className="form-subtitle">
              Please enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            
            {/* Email Field */}
            <div className={`form-field ${touched.email && !formData.email ? 'has-error' : ''}`}>
              <label htmlFor="email" className="field-label">
                Email address <span className="required">*</span>
              </label>
              <div className="field-input-wrapper">
                <EmailOutlinedIcon className="field-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. john@company.com"
                  className="field-input"
                  required
                />
              </div>
              {touched.email && !formData.email && (
                <span className="field-error">Email is required</span>
              )}
              {touched.email && formData.email && !formData.email.includes('@') && (
                <span className="field-error">Please enter a valid email</span>
              )}
            </div>

            {/* Password Field */}
            <div className={`form-field ${touched.password && !formData.password ? 'has-error' : ''}`}>
              <label htmlFor="password" className="field-label">
                Password <span className="required">*</span>
              </label>
              <div className="field-input-wrapper">
                <LockOutlinedIcon className="field-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className="field-input"
                  required
                />
                <button
                  type="button"
                  className="field-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                </button>
              </div>
              {touched.password && !formData.password && (
                <span className="field-error">Password is required</span>
              )}
            </div>

            {/* Options Row */}
            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-text">Remember me</span>
              </label>
              
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button type="submit" className="form-submit">
  {loading ? "Signing in..." : "Sign in"}
</button>
{error && <p className="field-error">{error}</p>}

            {/* Demo Credentials (for testing) */}
            <div className="demo-credentials">
              <p className="demo-title">Demo credentials</p>
              <div className="demo-items">
                <span className="demo-item">
                  <PersonOutlineIcon className="demo-icon" />
                  <span>Email: demo@select.com</span>
                </span>
                <span className="demo-item">
                  <LockOutlinedIcon className="demo-icon" />
                  <span>Password: password123</span>
                </span>
              </div>
            </div>

            {/* Register Link */}
            <div className="form-footer">
              <span className="footer-text">Don't have an account?</span>
              <Link to="/register" className="footer-link">Create account</Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
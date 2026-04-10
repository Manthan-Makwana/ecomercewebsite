import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../UserStyles/Form.css';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { register } from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
;

const Register = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarError, setAvatarError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleBlur = (e) => {
    setTouched({
      ...touched,
      [e.target.name]: true
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarError('');

    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setAvatarError('Please upload a valid image (JPEG, PNG, or GIF)');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setAvatarError('Image size should be less than 2MB');
        return;
      }

      setUser({
        ...user,
        avatar: file
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setUser({
      ...user,
      avatar: null
    });
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  if (!isFormValid()) {
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    });
    return;
  }

  if (!termsAccepted) {
    alert('Please accept the Terms of Service and Privacy Policy');
    return;
  }

  const userData = {
    name: user.name,
    email: user.email,
    password: user.password
  };

  dispatch(register(userData));
};

  const isFormValid = () => {
    const isValid = 
      user.name.trim() !== '' &&
      user.email.trim() !== '' &&
      user.password.trim() !== '' &&
      user.confirmPassword.trim() !== '' &&
      user.password === user.confirmPassword &&
      user.password.length >= 8;
    
    return isValid;
  };

  const getPasswordStrength = () => {
    if (!user.password) return null;
    if (user.password.length < 8) return 'weak';
    if (user.password.length >= 8 && /[A-Z]/.test(user.password) && /[0-9]/.test(user.password)) return 'strong';
    if (user.password.length >= 8) return 'medium';
    return 'weak';
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="register-page">
      <div className="register-container">
        
        {/* Left Side - Brand Message */}
        <div className="register-brand">
          <div className="brand-content">
            <span className="brand-subtitle">WELCOME TO</span>
            <h1 className="brand-title">SELECT DRESSES</h1>
            <p className="brand-description">
              Join our community of discerning professionals. Create an account to enjoy a tailored shopping experience.
            </p>
            <div className="brand-features">
              <div className="feature-item">
                <span className="feature-dot"></span>
                <span className="feature-text">Exclusive member offers</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot"></span>
                <span className="feature-text">Early access to collections</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot"></span>
                <span className="feature-text">Personalized style recommendations</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot"></span>
                <span className="feature-text">Create your style profile</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="register-form-wrapper">
          <div className="form-header">
            <h2 className="form-title">Create account</h2>
            <p className="form-subtitle">
              Please fill in your details to register
            </p>
          </div>

          <form onSubmit={handleSubmit} className="register-form" noValidate>
            
            {/* Avatar Upload Section */}
            <div className="avatar-section">
              <div className="avatar-label">
                <span>Profile photo</span>
                <span className="avatar-optional">(optional)</span>
              </div>
              
              <div className="avatar-upload">
                <div className="avatar-preview-wrapper">
                  {avatarPreview ? (
                    <div className="avatar-preview">
                      <img src={avatarPreview} alt="Avatar preview" />
                      <button 
                        type="button"
                        className="avatar-remove"
                        onClick={handleRemoveAvatar}
                        aria-label="Remove avatar"
                      >
                        <CloseIcon />
                      </button>
                    </div>
                  ) : (
                    <div className="avatar-placeholder">
                      <PersonOutlineIcon />
                    </div>
                  )}
                </div>

                <div className="avatar-actions">
                  <input
                    type="file"
                    ref={fileInputRef}
                    id="avatar"
                    name="avatar"
                    accept="image/jpeg,image/png,image/jpg,image/gif"
                    onChange={handleAvatarChange}
                    className="avatar-input"
                  />
                  <label htmlFor="avatar" className="avatar-button">
                    <PhotoCameraOutlinedIcon />
                    <span>Choose photo</span>
                  </label>
                  <p className="avatar-hint">
                    JPEG, PNG or GIF. Max 2MB.
                  </p>
                  {avatarError && (
                    <p className="avatar-error">{avatarError}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Name Field */}
            <div className={`form-field ${touched.name && !user.name ? 'has-error' : ''}`}>
              <label htmlFor="name" className="field-label">
                Full name <span className="required">*</span>
              </label>
              <div className="field-input-wrapper">
                <PersonOutlineIcon className="field-icon" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. John Anderson"
                  className="field-input"
                  required
                />
              </div>
              {touched.name && !user.name && (
                <span className="field-error">Name is required</span>
              )}
            </div>

            {/* Email Field */}
            <div className={`form-field ${touched.email && !user.email ? 'has-error' : ''}`}>
              <label htmlFor="email" className="field-label">
                Email address <span className="required">*</span>
              </label>
              <div className="field-input-wrapper">
                <EmailOutlinedIcon className="field-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. john@company.com"
                  className="field-input"
                  required
                />
              </div>
              {touched.email && !user.email && (
                <span className="field-error">Email is required</span>
              )}
              {touched.email && user.email && !user.email.includes('@') && (
                <span className="field-error">Please enter a valid email</span>
              )}
            </div>

            {/* Password Field */}
            <div className={`form-field ${touched.password && !user.password ? 'has-error' : ''}`}>
              <label htmlFor="password" className="field-label">
                Password <span className="required">*</span>
              </label>
              <div className="field-input-wrapper">
                <LockOutlinedIcon className="field-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className="field-input"
                  required
                  minLength="8"
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
              
              {/* Password strength indicator */}
              {user.password && (
                <div className="password-strength">
                  <div className={`strength-bar ${passwordStrength}`}></div>
                  <span className={`strength-text ${passwordStrength}`}>
                    {passwordStrength === 'weak' && 'Weak password'}
                    {passwordStrength === 'medium' && 'Medium password'}
                    {passwordStrength === 'strong' && 'Strong password'}
                  </span>
                </div>
              )}

              {touched.password && !user.password && (
                <span className="field-error">Password is required</span>
              )}
              {touched.password && user.password && user.password.length < 8 && (
                <span className="field-error">Password must be at least 8 characters</span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className={`form-field ${touched.confirmPassword && (!user.confirmPassword || user.password !== user.confirmPassword) ? 'has-error' : ''}`}>
              <label htmlFor="confirmPassword" className="field-label">
                Confirm password <span className="required">*</span>
              </label>
              <div className="field-input-wrapper">
                <LockOutlinedIcon className="field-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={user.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className="field-input"
                  required
                />
                <button
                  type="button"
                  className="field-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                </button>
              </div>
              {touched.confirmPassword && !user.confirmPassword && (
                <span className="field-error">Please confirm your password</span>
              )}
              {touched.confirmPassword && user.confirmPassword && user.password !== user.confirmPassword && (
                <span className="field-error">Passwords do not match</span>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="form-terms">
              <input 
                type="checkbox" 
                id="terms" 
                className="terms-checkbox" 
                checked={termsAccepted}
                onChange={handleTermsChange}
                required 
              />
              <label htmlFor="terms" className="terms-label">
                I agree to the <Link to="/terms" className="terms-link">Terms of Service</Link> and{' '}
                <Link to="/privacy" className="terms-link">Privacy Policy</Link> <span className="required">*</span>
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="form-submit">
  {loading ? "Creating account..." : "Create account"}
</button>

            {/* Validation Summary (optional) */}
            {touched.name && touched.email && touched.password && touched.confirmPassword && !isFormValid() && (
              <div className="validation-summary">
                <p>Please fix the following errors:</p>
                <ul>
                  {!user.name && <li>Name is required</li>}
                  {!user.email && <li>Email is required</li>}
                  {user.email && !user.email.includes('@') && <li>Valid email is required</li>}
                  {!user.password && <li>Password is required</li>}
                  {user.password && user.password.length < 8 && <li>Password must be at least 8 characters</li>}
                  {user.password && user.confirmPassword && user.password !== user.confirmPassword && <li>Passwords do not match</li>}
                  {!termsAccepted && <li>You must accept the Terms of Service</li>}
                </ul>
              </div>
            )}

            {/* Login Link */}
            <div className="form-footer">
              <span className="footer-text">Already have an account?</span>
              <Link to="/login" className="footer-link">Sign in</Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
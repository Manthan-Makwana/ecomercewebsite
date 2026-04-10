import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import "../pageStyles/Profile.css";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import { updateProfile, updatePassword, clearError } from "../features/user/userSlice";

function Profile() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);

  // ── Profile form state ──────────────────────────────────────────────────
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [profileMsg, setProfileMsg] = useState(null); // { type: "success"|"error", text }

  // ── Password form state ─────────────────────────────────────────────────
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);

  // Sync form when Redux user updates
  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name, email: user.email });
    }
  }, [user]);

  // Clear redux error on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleProfileChange = (e) =>
    setProfileData({ ...profileData, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg(null);
    const result = await dispatch(updateProfile(profileData));
    if (updateProfile.fulfilled.match(result)) {
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
    } else {
      setProfileMsg({ type: "error", text: result.payload || "Update failed." });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    const result = await dispatch(
      updatePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      })
    );
    if (updatePassword.fulfilled.match(result)) {
      setPasswordMsg({ type: "success", text: "Password changed successfully!" });
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      setPasswordMsg({ type: "error", text: result.payload || "Failed to change password." });
    }
  };

  // Generate initials avatar
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  return (
    <>
      <PageTitle title="My Profile | Select Dresses" />
      <Navbar />

      <div className="profile-page">
        {/* Page Header */}
        <div className="profile-header">
          <span className="profile-header-label">Account</span>
          <h1>My Profile</h1>
        </div>

        <div className="profile-layout">
          {/* ── Left: Info Card ── */}
          <aside className="profile-card">
            <div className="profile-avatar">{initials}</div>
            <p className="profile-card-name">{user?.name}</p>
            <p className="profile-card-email">{user?.email}</p>
            <span className={`profile-role-badge ${isAdmin ? "admin" : ""}`}>
              {user?.role || "user"}
            </span>

            <div className="profile-card-divider" />

            <div className="profile-quick-links">
              <Link to="/orders" className="profile-quick-link">
                <ShoppingBagOutlinedIcon fontSize="small" />
                My Orders
              </Link>
              {isAdmin && (
                <Link to="/admin/dashboard" className="profile-quick-link">
                  <AdminPanelSettingsIcon fontSize="small" />
                  Admin Panel
                </Link>
              )}
            </div>
          </aside>

          {/* ── Right: Forms ── */}
          <div className="profile-forms">

            {/* Update Profile Form */}
            <section className="profile-section">
              <p className="profile-section-title">Personal Information</p>
              <p className="profile-section-subtitle">
                Update your display name and email address
              </p>

              <form className="profile-form" onSubmit={handleProfileSubmit}>
                <div className="profile-form-row">
                  <div className="profile-field">
                    <label htmlFor="name">Full Name</label>
                    <div className="profile-input-wrap">
                      <PersonOutlineIcon className="profile-input-icon" />
                      <input
                        id="name"
                        type="text"
                        name="name"
                        className="profile-input"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="profile-field">
                    <label htmlFor="profile-email">Email Address</label>
                    <div className="profile-input-wrap">
                      <EmailOutlinedIcon className="profile-input-icon" />
                      <input
                        id="profile-email"
                        type="email"
                        name="email"
                        className="profile-input"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                {profileMsg && (
                  <p className={`profile-feedback ${profileMsg.type}`}>
                    {profileMsg.text}
                  </p>
                )}

                <button
                  type="submit"
                  className="profile-save-btn"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </section>

            {/* Change Password Form */}
            <section className="profile-section">
              <p className="profile-section-title">Security</p>
              <p className="profile-section-subtitle">
                Change your account password
              </p>

              <form className="profile-form" onSubmit={handlePasswordSubmit}>
                {/* Current Password */}
                <div className="profile-field">
                  <label htmlFor="oldPassword">Current Password</label>
                  <div className="profile-input-wrap">
                    <LockOutlinedIcon className="profile-input-icon" />
                    <input
                      id="oldPassword"
                      type={showOld ? "text" : "password"}
                      name="oldPassword"
                      className="profile-input"
                      value={passwordData.oldPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowOld(!showOld)}
                      tabIndex={-1}
                    >
                      {showOld ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                    </button>
                  </div>
                </div>

                <div className="profile-form-row">
                  {/* New Password */}
                  <div className="profile-field">
                    <label htmlFor="newPassword">New Password</label>
                    <div className="profile-input-wrap">
                      <LockOutlinedIcon className="profile-input-icon" />
                      <input
                        id="newPassword"
                        type={showNew ? "text" : "password"}
                        name="newPassword"
                        className="profile-input"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Min 6 characters"
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowNew(!showNew)}
                        tabIndex={-1}
                      >
                        {showNew ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="profile-field">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <div className="profile-input-wrap">
                      <LockOutlinedIcon className="profile-input-icon" />
                      <input
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        className="profile-input"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Re-enter new password"
                        required
                      />
                    </div>
                  </div>
                </div>

                {passwordMsg && (
                  <p className={`profile-feedback ${passwordMsg.type}`}>
                    {passwordMsg.text}
                  </p>
                )}

                <button
                  type="submit"
                  className="profile-save-btn"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Change Password"}
                </button>
              </form>
            </section>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Profile;

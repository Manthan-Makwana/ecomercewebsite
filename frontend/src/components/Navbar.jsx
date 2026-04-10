import React, { useState, useRef, useEffect } from "react";
import "../componentStyles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSelector, useDispatch } from "react-redux";
import { logoutAsync } from "../features/user/userSlice";
import { toast } from "react-toastify";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${searchQuery}`);
    } else {
      navigate("/products");
    }
    setSearchOpen(false);
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    setMenuOpen(false);
    await dispatch(logoutAsync());
    toast.success("Logged out successfully", {
      position: "top-center",
      autoClose: 2000,
    });
    navigate("/login");
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">

          {/* Mobile Hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>

          {/* Logo */}
          <Link to="/" className="logo">
            SELECT<span>DRESSES</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/products" className="nav-link">Collection</Link>
            <Link to="/about" className="nav-link">Story</Link>
            <Link to="/contact" className="nav-link">Visit</Link>
          </nav>

          {/* Actions */}
          <div className="nav-actions">

            {/* Search */}
            <div className="search-wrapper" ref={searchRef}>
              <button
                className={`search-trigger ${searchOpen ? "active" : ""}`}
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Toggle search"
              >
                <SearchIcon className="search-icon" />
              </button>

              <form
                className={`search-dropdown ${searchOpen ? "active" : ""}`}
                onSubmit={handleSearchSubmit}
              >
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="search-submit">
                  <SearchIcon />
                </button>
              </form>
            </div>

            {/* Profile */}
            <div className="profile-wrapper" ref={profileRef}>
              <button
                className={`profile-trigger ${profileOpen ? "active" : ""}`}
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="Profile menu"
                aria-expanded={profileOpen}
              >
                <PersonOutlineIcon className="profile-icon" />
                <KeyboardArrowDownIcon className={`profile-arrow ${profileOpen ? "open" : ""}`} />
              </button>

              <div className={`profile-dropdown ${profileOpen ? "active" : ""}`}>

                {/* Header: show name if logged in, else Guest */}
                <div className="dropdown-header">
                  <span className="dropdown-greeting">
                    {isAuthenticated ? `Hello, ${user?.name?.split(" ")[0]}` : "Welcome"}
                  </span>
                  <span className="dropdown-email">
                    {isAuthenticated ? user?.email : "Guest"}
                  </span>
                </div>

                <div className="dropdown-divider"></div>

                {isAuthenticated ? (
                  <>
                    {/* Logged-in links */}
                    <Link to="/profile" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                      My Profile
                    </Link>
                    <Link to="/orders" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                      Order History
                    </Link>
                    <Link to="/wishlist" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                      Wishlist
                    </Link>

                    {/* Admin link: only for admins */}
                    {isAdmin && (
                      <>
                        <div className="dropdown-divider"></div>
                        <Link
                          to="/admin/dashboard"
                          className="dropdown-item admin-link"
                          onClick={() => setProfileOpen(false)}
                        >
                          <AdminPanelSettingsIcon fontSize="small" />
                          Admin Panel
                        </Link>
                      </>
                    )}

                    <div className="dropdown-divider"></div>

                    {/* Logout */}
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                      <LogoutIcon fontSize="small" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    {/* Guest links */}
                    <Link to="/login" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                      Sign In
                    </Link>
                    <Link to="/register" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Cart */}
            <Link to="/cart" className="cart-link">
              <ShoppingCartIcon className="cart-icon" />
              {cartItems.length > 0 && (
                <span className="cart-count">{cartItems.length}</span>
              )}
            </Link>

          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {menuOpen && (
        <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo" onClick={() => setMenuOpen(false)}>
            SELECT<span>DRESSES</span>
          </Link>
          <button
            className="sidebar-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="sidebar-content">
          <nav className="sidebar-nav">
            <Link to="/" className="sidebar-link" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/products" className="sidebar-link" onClick={() => setMenuOpen(false)}>Collection</Link>
            <Link to="/about" className="sidebar-link" onClick={() => setMenuOpen(false)}>Our Story</Link>
            <Link to="/contact" className="sidebar-link" onClick={() => setMenuOpen(false)}>Visit Us</Link>
          </nav>

          <div className="sidebar-divider"></div>

          {isAuthenticated ? (
            <>
              {/* Logged-in mobile user info */}
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">{user?.name}</span>
                <span className="sidebar-user-email">{user?.email}</span>
              </div>

              <div className="sidebar-account">
                <h4 className="sidebar-section-title">Account</h4>
                <Link to="/profile" className="sidebar-link" onClick={() => setMenuOpen(false)}>Profile</Link>
                <Link to="/orders" className="sidebar-link" onClick={() => setMenuOpen(false)}>My Orders</Link>
                <Link to="/wishlist" className="sidebar-link" onClick={() => setMenuOpen(false)}>Wishlist</Link>
                {isAdmin && (
                  <Link to="/admin/dashboard" className="sidebar-link" onClick={() => setMenuOpen(false)}>
                    Admin Panel
                  </Link>
                )}
              </div>

              <div className="sidebar-divider"></div>

              <div className="sidebar-auth">
                <button className="sidebar-auth-link logout" onClick={handleLogout}>
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="sidebar-account">
                <h4 className="sidebar-section-title">Account</h4>
              </div>
              <div className="sidebar-divider"></div>
              <div className="sidebar-auth">
                <Link to="/login" className="sidebar-auth-link" onClick={() => setMenuOpen(false)}>Sign In</Link>
                <Link to="/register" className="sidebar-auth-link register" onClick={() => setMenuOpen(false)}>Create Account</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;

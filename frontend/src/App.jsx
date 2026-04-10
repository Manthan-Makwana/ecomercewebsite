import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "./features/user/userSlice";

// Pages
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import Register from "./User/Register";
import Login from "./User/Login";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirm from "./pages/OrderConfirm";
import Payment from "./pages/Payment";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import ForgotPassword from "./pages/ForgotPassword";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";

// Admin Pages
import Users from "./admin/Users";
import Orders from "./admin/Orders";
import Dashboard from "./admin/Dashboard";
import AdminProducts from "./admin/AdminProducts";

// Route Guards
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  const dispatch = useDispatch();

  // Restore auth session from cookie on every page load/refresh
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/products" element={<Products />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* Protected Routes (must be logged in) */}
        <Route path="/cart" element={
          <ProtectedRoute><Cart /></ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute><Checkout /></ProtectedRoute>
        } />
        <Route path="/order/confirm" element={
          <ProtectedRoute><OrderConfirm /></ProtectedRoute>
        } />
        <Route path="/payment" element={
          <ProtectedRoute><Payment /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute><MyOrders /></ProtectedRoute>
        } />

        {/* Admin Routes (must be admin or superadmin) */}
        <Route path="/admin/dashboard" element={
          <AdminRoute><Dashboard /></AdminRoute>
        } />
        <Route path="/admin/orders" element={
          <AdminRoute><Orders /></AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute><Users /></AdminRoute>
        } />
        <Route path="/admin/products" element={
          <AdminRoute><AdminProducts /></AdminRoute>
        } />

      </Routes>
    </Router>
  );
}

export default App;

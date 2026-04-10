import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import {
removeFromCart,
increaseQuantity,
decreaseQuantity
} from "../features/cart/cartSlice";

import "../CartStyles/Cart.css";

function Cart() {
const navigate = useNavigate();
const { cartItems } = useSelector((state) => state.cart);
const dispatch = useDispatch();

const totalPrice = cartItems.reduce(
(total, item) => total + item.price * item.quantity,
0
);

/* SHIPPING LOGIC */

const freeShippingLimit = 2000;

const shippingCost = totalPrice >= freeShippingLimit ? 0 : 100;

const finalTotal = totalPrice + shippingCost;

const progress = Math.min(
(totalPrice / freeShippingLimit) * 100,
100
);

return (

<>
<Navbar />

<div className="cart-wrapper">

<h1 className="cart-title">Shopping Cart</h1>

{cartItems.length === 0 ? (

<div className="empty-cart">

<h2>Your cart is empty</h2>

<Link to="/products" className="shop-btn">
Continue Shopping
</Link>

</div>

) : (

<div className="cart-layout">

{/* PRODUCT LIST */}

<div className="cart-items">

{cartItems.map((item) => (

<div key={item._id} className="cart-item">

<img
src={
item?.image?.[0]?.url
? `http://localhost:8000/${item.image[0].url.replace('./','')}`
: "/placeholder.png"
}
alt={item.name}
className="cart-img"
/>

<div className="cart-info">

<h3 className="cart-name">
{item.name}
</h3>

<p className="cart-price">
₹{item.price}
</p>

{/* QUANTITY CONTROLS */}

<div className="qty-controls">

<button
onClick={() => dispatch(decreaseQuantity(item._id))}
disabled={item.quantity <= 1}
>
−
</button>

<span>{item.quantity}</span>

<button
onClick={() => dispatch(increaseQuantity(item._id))}
disabled={item.quantity >= item.stock}
>
+
</button>

</div>

<button
className="remove-link"
onClick={() => dispatch(removeFromCart(item._id))}
>
Remove
</button>

</div>

<div className="cart-total">

₹{item.price * item.quantity}

</div>

</div>

))}

</div>
<div className="shipping-progress">

<p className="shipping-text">

{totalPrice >= freeShippingLimit
? "🎉 You unlocked FREE shipping!"
: `Add ₹${freeShippingLimit - totalPrice} more to get FREE shipping`
}

</p>

<div className="progress-bar">

<div
className="progress-fill"
style={{ width: `${progress}%` }}
></div>

</div>

</div>
{/* ORDER SUMMARY */}

<div className="cart-summary">

<h3>Order Summary</h3>

<div className="summary-line">
<span>Subtotal</span>
<span>₹{totalPrice}</span>
</div>

<div className="summary-line">
<span>Shipping</span>
<span>
{shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
</span>
</div>

<div className="summary-total">
<span>Total</span>
<span>₹{finalTotal}</span>
</div>

{/* FREE SHIPPING MESSAGE */}

{shippingCost !== 0 && (
<p className="shipping-message">
Add ₹{2000 - totalPrice} more to get FREE shipping
</p>
)}

<button
className="checkout-btn"
disabled={cartItems.length === 0}
onClick={() => navigate("/checkout")}
>
Checkout
</button>

<Link to="/products" className="continue-link">
Continue Shopping
</Link>

</div>

</div>

)}

</div>

</>

);

}

export default Cart;
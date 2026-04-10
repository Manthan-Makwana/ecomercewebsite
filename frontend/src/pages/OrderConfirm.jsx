import React from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import "../CartStyles/OrderConfirm.css";
import { useNavigate } from "react-router-dom";

function OrderConfirm(){

const navigate = useNavigate();

const { cartItems } = useSelector((state)=>state.cart);

const shippingInfo = JSON.parse(localStorage.getItem("shippingInfo"));

/* SHOW LOADER IF DATA NOT READY */

if(!shippingInfo || cartItems.length === 0){
return <Loader />
}

/* PRICE CALCULATION */

const totalPrice = cartItems.reduce(
(total,item)=> total + item.price * item.quantity,
0
);

const shippingCost = totalPrice >= 2000 ? 0 : 100;

const finalTotal = totalPrice + shippingCost;

/* PROCEED TO PAYMENT */

const proceedToPayment = () => {

const orderInfo = {
subtotal: totalPrice,
shipping: shippingCost,
total: finalTotal
};

sessionStorage.setItem("orderInfo", JSON.stringify(orderInfo));

navigate("/payment");

};

return(

<>
<Navbar/>

<div className="order-confirm">

<h2 className="order-title">Confirm Order</h2>

<div className="confirm-layout">

<div>

<div className="shipping-box">
<h3>Shipping Address</h3>

<p>{shippingInfo.name}</p>
<p>{shippingInfo.phone}</p>
<p>{shippingInfo.address}</p>
<p>{shippingInfo.city}, {shippingInfo.state}</p>
<p>{shippingInfo.pincode}</p>

</div>

<div className="order-items">

{cartItems.map(item => (

<div className="order-item" key={item._id}>

<span className="item-name">
{item.name} × {item.quantity}
</span>

<span className="item-price">
₹{item.price * item.quantity}
</span>

</div>

))}

</div>

</div>

<div className="summary-box">

<h3>Order Summary</h3>

<div className="summary-line">
<span>Subtotal</span>
<span>₹{totalPrice}</span>
</div>

<div className="summary-line">
<span>Shipping</span>
<span>{shippingCost === 0 ? "FREE" : `₹${shippingCost}`}</span>
</div>

<div className="summary-total">
<span>Total</span>
<span>₹{finalTotal}</span>
</div>

<button
className="place-order-btn"
onClick={proceedToPayment}
>
Proceed To Payment
</button>

</div>

</div>

</div>

</>

)

}

export default OrderConfirm;
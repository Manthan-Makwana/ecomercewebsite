import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../CartStyles/CheckoutPath.css";
import { useNavigate } from "react-router-dom";

function Checkout() {

const [shipping,setShipping] = useState({
name:"",
phone:"",
address:"",
city:"",
state:"",
pincode:"",
country:"India"
});


const navigate = useNavigate();
const handleChange = (e)=>{
setShipping({
...shipping,
[e.target.name]:e.target.value
});
};

const handleSubmit = (e)=>{
e.preventDefault();

localStorage.setItem("shippingInfo", JSON.stringify(shipping));

navigate("/order/confirm");
};

return (

<>
<Navbar/>

<div className="checkout-container">

<h1 className="checkout-title">Shipping Address</h1>

<form className="shipping-form" onSubmit={handleSubmit}>

<div className="form-group">

<label>Full Name</label>

<input
type="text"
name="name"
value={shipping.name}
onChange={handleChange}
placeholder="Enter your name"
required
/>

</div>

<div className="form-group">

<label>Phone Number</label>

<input
type="text"
name="phone"
value={shipping.phone}
onChange={handleChange}
placeholder="Enter phone number"
required
/>

</div>

<div className="form-group">

<label>Address</label>

<input
type="text"
name="address"
value={shipping.address}
onChange={handleChange}
placeholder="Street address"
required
/>

</div>

<div className="form-row">

<div className="form-group">

<label>City</label>

<input
type="text"
name="city"
value={shipping.city}
onChange={handleChange}
required
/>

</div>

<div className="form-group">

<label>State</label>

<input
type="text"
name="state"
value={shipping.state}
onChange={handleChange}
required
/>

</div>

</div>

<div className="form-row">

<div className="form-group">

<label>Pincode</label>

<input
type="text"
name="pincode"
value={shipping.pincode}
onChange={handleChange}
required
/>

</div>

<div className="form-group">

<label>Country</label>

<input
type="text"
name="country"
value={shipping.country}
onChange={handleChange}
/>

</div>

</div>

<button className="shipping-btn">
Continue
</button>

</form>

</div>

</>

);

}

export default Checkout;
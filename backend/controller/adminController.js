import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

export const getAdminDashboard = async (req,res)=>{

try{

const products = await Product.countDocuments();
const users = await User.countDocuments();
const orders = await Order.find();

let totalRevenue = 0;

orders.forEach(order=>{
totalRevenue += order.totalPrice;
});

res.status(200).json({
success:true,
products,
users,
orders: orders.length,
revenue: totalRevenue
});

}
catch(error){

res.status(500).json({
success:false,
message:error.message
});

}

};
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import HandleError from "../utils/handleError.js";
import handleAsyncError from "../middleware/handleAsyncError.js";

//create new order
export const createOrder = handleAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;
    const order = await orderModel.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id
  });

  res.status(201).json({
    success: true,
    order
  });
});

//get single order
export const getSingleOrder = handleAsyncError(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id).populate("user", "name email");

  if (!order) {
    return next(new HandleError("Order not found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    order
  });
});

//all my orders
export const allMyOrders = handleAsyncError(async (req, res, next) => {
  const orders = await orderModel.find({ user: req.user._id });
  if (!orders) {
    return next(new HandleError("No orders found for this user", 404));
  }
  res.status(200).json({
    success: true,
    orders
  });
});

//get all orders 
export const getAllOrders = handleAsyncError(async (req, res, next) => {
  const orders = await orderModel.find();
    if (!orders) {
    return next(new HandleError("No orders found", 404));
  } 
    let totalAmount = 0;
    orders.forEach(order => {
    totalAmount += order.totalPrice;
    });
    res.status(200).json({
    success: true,
    totalAmount,
    orders
  });
});

export const updateOrderStatus = handleAsyncError(async (req, res, next) => {

  const order = await orderModel.findById(req.params.id);

  if (!order) {
    return next(new HandleError("Order not found with this ID", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new HandleError("Order already delivered", 400));
  }

  const { status } = req.body;

  if (!status) {
    return next(new HandleError("Order status is required", 400));
  }

  const validStatuses = ["Processing", "Shipped", "Delivered"];

  if (!validStatuses.includes(status)) {
    return next(new HandleError("Invalid order status", 400));
  }

  // Update stock safely
  if (status === "Shipped") {
    for (const item of order.orderItems) {
      await updateStock(item.product, item.quantity);
    }
  }

  order.orderStatus = status;

  if (status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    order
  });

});

async function updateQuantity(productId, quantity) {
  const product = await productModel.findById(productId);
  if (!product) {
    throw new HandleError("Product not found", 404);
  }
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

async function updateStock(productId, quantity) {
  const product = await productModel.findById(productId);
  if (!product) {
    throw new HandleError("Product not found", 404);
  }
    if (product.stock < quantity) {
    throw new HandleError("Insufficient stock", 400);
  }
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}
export { updateQuantity, updateStock };

export const cancelOrder = handleAsyncError(async (req, res, next) => {

  const order = await orderModel.findById(req.params.id);

  if (!order) {
    return next(new HandleError("Order not found", 404));
  }

  // ❌ Cannot cancel delivered
  if (order.orderStatus === "Delivered") {
    return next(new HandleError("Delivered orders cannot be cancelled", 400));
  }

  // ❌ Cannot cancel shipped
  if (order.orderStatus === "Shipped") {
    return next(new HandleError("Shipped orders cannot be cancelled", 400));
  }

  // ❌ Already cancelled
  if (order.isCancelled) {
    return next(new HandleError("Order already cancelled", 400));
  }

  // ✅ Restore stock
  for (const item of order.orderItems) {
    const product = await productModel.findById(item.product);

    if (product) {
      product.stock += item.quantity;
      await product.save({ validateBeforeSave: false });
    }
  }

  // ✅ Cancel order
  order.isCancelled = true;
  order.cancelledAt = Date.now();
  order.orderStatus = "Cancelled";

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    order
  });

});
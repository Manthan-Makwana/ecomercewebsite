import express from "express";
import { roleBasedFunction, verifyUserAuth } from "../middleware/userAuth.js";
import { allMyOrders, cancelOrder, createOrder, getAllOrders, getSingleOrder, updateOrderStatus } from "../controller/orderController.js";

const router = express.Router(); 

router.route('/new/order').post(verifyUserAuth, createOrder);

router.route('/admin/order/:id')
  .get(verifyUserAuth, roleBasedFunction('admin', 'superadmin'), getSingleOrder)
  .put(verifyUserAuth, roleBasedFunction('admin', 'superadmin'), updateOrderStatus)
  .delete(verifyUserAuth, roleBasedFunction('admin', 'superadmin'), cancelOrder);

router.route('/orders/user').get(verifyUserAuth, allMyOrders);
router.route('/admin/orders').get(verifyUserAuth, roleBasedFunction('admin', 'superadmin'), getAllOrders);

export default router;
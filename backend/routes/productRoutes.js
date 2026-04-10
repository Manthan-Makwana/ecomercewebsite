import express from "express";
import { createProducts, getAllProducts, updateProduct, getSingleProduct, deleteProduct, getAdminProducts, createProductReview, getProductReviews, deleteReview } 
from "../controller/productController.js";
import { verifyUserAuth } from "../middleware/userAuth.js";
import { roleBasedFunction} from "../middleware/userAuth.js";
const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/products").get(verifyUserAuth,roleBasedFunction('admin', 'superadmin'),getAdminProducts);


      router.route("/admin/product/create").post(verifyUserAuth,
            roleBasedFunction('admin', 'superadmin'),createProducts);
      

router.route("/product/:id")
      .get(getSingleProduct)
      .put(verifyUserAuth,roleBasedFunction('admin', 'superadmin'),updateProduct)
      .delete(verifyUserAuth,roleBasedFunction('admin', 'superadmin'),deleteProduct);

router.route("/review").put(verifyUserAuth,createProductReview);
router.route("/reviews").get(verifyUserAuth,getProductReviews);
router.route("/reviews").delete(verifyUserAuth,deleteReview);
export default router;
 
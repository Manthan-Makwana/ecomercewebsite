import express from "express";
import { getAdminDashboard } from "../controller/adminController.js";
import { verifyUserAuth, roleBasedFunction } from "../middleware/userAuth.js";

const router = express.Router();

router.get(
  "/admin/dashboard",
  verifyUserAuth,
  roleBasedFunction("admin", "superadmin"),
  getAdminDashboard
);

export default router;
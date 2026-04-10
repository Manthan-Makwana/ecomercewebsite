import express from 'express';
import { 
  deleteUser,
  forgotPassword,
  getUserDetails,
  getUserDetailsByAdmin,
  getUsersData,
  loginUser, 
  logoutUser, 
  registerUser, 
  resetPassword, 
  updatePassword,
  updateProfile,
  updateUserRole
} from '../controller/userController.js';
import { roleBasedFunction, verifyUserAuth } from '../middleware/userAuth.js';

const router = express.Router();

router.route('/users').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);

// Forgot password (send reset email)
router.route('/password/forgot').post(forgotPassword);

// Reset password (verify token + update password)
router.route('/password/reset/:token').post(resetPassword);
router.route('/profile').post(verifyUserAuth, getUserDetails);
router.route('/password/update').post(verifyUserAuth, updatePassword);
router.route('/profile/update').post(verifyUserAuth, updateProfile);
router.route('/admin/users').get(verifyUserAuth,roleBasedFunction('admin', 'superadmin'),getUsersData);
router.route('/admin/user/:id')
      .get(verifyUserAuth,roleBasedFunction('admin', 'superadmin'),getUserDetailsByAdmin)
      .put(verifyUserAuth,roleBasedFunction('admin', 'superadmin'),updateUserRole)
      .delete(verifyUserAuth,roleBasedFunction('admin', 'superadmin'),deleteUser);
export default router;
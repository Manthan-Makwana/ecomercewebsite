import HandleError from "../utils/handleError.js";
import handleAsyncError from "./handleAsyncError.js";
import jwt from "jsonwebtoken"; 
import User from "../models/userModel.js";
export const verifyUserAuth = handleAsyncError(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new HandleError("Please login to access this resource", 401));
  }

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedData.id);
    
    if (!user) {
      res.clearCookie("token");
      return next(new HandleError("User session is invalid. Please login again.", 401));
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.clearCookie("token");
    return next(new HandleError("Session expired or invalid. Please login again.", 401));
  }
});

export const roleBasedFunction = (...roles) => {
return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new HandleError(`Role: ${req.user.role} is not allowed to access this resource`, 403));
    }
    next();
}       
}
 


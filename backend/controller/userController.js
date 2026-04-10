import handleAsyncError from '../middleware/handleAsyncError.js';
import HandleError from '../utils/handleError.js';
import User from '../models/userModel.js';
import { sendToken } from '../utils/jwtToken.js';
import sendEmail  from '../utils/sendEmail.js';
import crypto from 'crypto';
export const registerUser=handleAsyncError(async(req,res,next)=>{
const {name,email,password}=req.body;

const user =await  User.create({
    name,
    email,
    password,
    profile:{
        public_id:"sample id",
        url:"sample url"
    }
})
sendToken(user,201,res);
})

//login user
export const loginUser = handleAsyncError(async (req,res,next)=>{
    const { email, password } = req.body;

    if(!email || !password){
        return next(new HandleError("Please enter email and password",400));
    }

    const user = await User.findOne({ email }).select("+password");

    if(!user){
        return next(new HandleError("Invalid email or password",401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new HandleError("Invalid email or password",401));
    }

    sendToken(user,200,res);
});

// logout user
export const logoutUser=handleAsyncError(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    });
    res.status(200).json({
        success:true,
        message:"Logged out successfully"
    })
})

//forgot password
export const forgotPassword=handleAsyncError(async(req,res,next)=>{
    const {email}=req.body;
    if(!email){
        return next(new HandleError("Please enter your email",400))
    }
    const user=await User.findOne({email:req.body.email});
    if(!user){
        return next(new HandleError("User not found",404))
    }
    let resetToken;
    try {
        resetToken=user.getResetPasswordToken();
        await user.save({validateBeforeSave:false});
    
    }catch (error) {
        
        
        return next(new HandleError("Could not generate token",500));
    }
    const resetPasswordURL=`http://localhost/api/v1/reset/${resetToken}`;
    const message=`Your password reset token is as follow:\n\n${resetPasswordURL}\n\nIf you have not requested this email, then ignore it.`;
    try {
        //send email
        await sendEmail({
            email:user.email,
            subject:"Password reset token",
            message
        });
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        });
    }
        catch (error) {
            user.forgotPasswordToken=undefined;
            user.forgotPasswordExpire=undefined;
            await user.save({validateBeforeSave:false});
            return next(new HandleError("Email could not be sent,please try again later",500));
        };
})

//reset password
export const resetPassword = handleAsyncError(async (req, res, next) => {

    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetpasswordtoken: resetPasswordToken,
        resetpasswordexpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new HandleError("Invalid or expired token", 400));
    }

    user.password = req.body.password;
    user.resetpasswordtoken = undefined;
    user.resetpasswordexpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});

//get user details
export const getUserDetails = handleAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new HandleError("User not found", 404));
    }

    res.status(200).json({
        success: true,
        user
    });
});

//update user password
export const updatePassword = handleAsyncError(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password");

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return next(new HandleError("Please enter old and new password", 400));
    }

    const isPasswordMatched = await user.comparePassword(oldPassword);

    if (!isPasswordMatched) {
        return next(new HandleError("Old password is incorrect", 400));
    }

    user.password = newPassword;
    await user.save();

    sendToken(user, 200, res);
    
});
//update user profile
export const updateProfile = handleAsyncError(async (req, res, next) => {
    const updateUserDetails = {
        name: req.body.name,
        email: req.body.email
    };
    const user = await User.findByIdAndUpdate(req.user.id, updateUserDetails, {
        new: true,
        runValidators: true,
        // useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        message:"Profile updated successfully",
        user
    });
});

//admin-getting all users
export const getUsersData = handleAsyncError(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    });
});

//admin-getting single user details
export const getUserDetailsByAdmin = handleAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new HandleError("User not found", 404));
    }

    res.status(200).json({
        success: true,
        user
    });
});

//admin change user role or delete user
export const updateUserRole = handleAsyncError(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new HandleError("User not found", 404));
    }

    // 🔴 THIS LINE WAS MISSING OR WRONG
    const { role } = req.body || {};

    if (!role) {
        return next(new HandleError("Please provide role", 400));
    }

    user.role = role;
    await user.save();

    res.status(200).json({
        success: true,
        message: "User role updated successfully",
        user
    });
});

//admin delete user

export const deleteUser = handleAsyncError(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new HandleError("User not found", 404));
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
});
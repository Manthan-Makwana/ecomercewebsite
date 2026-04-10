import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const userSchema=new mongoose.Schema({
name:{
    type:String,
    required:[true,"Please enter your name"],
    maxLength:[30,"Name should not be longer than 30 characters."],
    minLength:[4,"Name should have more than 4 characters"]
},
email:{
    type:String,
    required:[true,"Please enter your email"],
    unique:true,
    validate:[validator.isEmail,"Please enter a valid email"]
},
password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [8, "Password must be at least 8 characters"],
    select: false,
    match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must contain uppercase, lowercase, number, and special character"
    ]
},
profile:{
public_id:{
    type:String,
    required:true
},
url:{
    type:String,
    required:true
}
},
role:{
    type:String,
    default:"user"
},
createdAt:{
    type:Date,
    default:Date.now
},
resetpasswordtoken:String,
resetpasswordexpire:Date
},{timestamps:true});

// password encryption
userSchema.pre("save", async function () {

    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    });
}

userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}
// Generating password reset token
userSchema.methods.getResetPasswordToken=function(){
    // Generate token
    const resetToken=crypto.randomBytes(20).toString("hex");

    // Hash and set to resetPasswordToken
    this.resetpasswordtoken=crypto.createHash("sha256").update(resetToken).digest("hex");

    // Set token expire time
    this.resetpasswordexpire=Date.now()+15*60*1000//15 minutes
    return resetToken;
}
export default mongoose.model("User",userSchema);
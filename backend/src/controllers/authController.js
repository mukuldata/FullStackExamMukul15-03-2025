import User from "../models/sql/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/helpers.js";
import { ne } from "@faker-js/faker";

const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
};

export const register = async (req, res,next) => {
  try {
    const { name, email, password } = req.body;

    if(!name || !email || !password) 
      return next(new ErrorHandler("Please fill in all fields", 400));


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) 
      return next(new ErrorHandler("Invalid email", 400));

    if (password.length < 6) 
      return next(new ErrorHandler("Password must be at least 6 characters", 400));
  
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) 
      return next(new ErrorHandler("Email already registered", 400));


    await User.create({ name, email, password });

    res.status(201).json({success: true, message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res,next) => {
  try {
    const { email, password } = req.body;

    if(!email || !password) 
      return next(new ErrorHandler("Please fill in all fields", 400));

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) 
      return next(new ErrorHandler("Invalid email", 400));

    if (password.length < 6)
       return next(new ErrorHandler("Password must be at least 6 characters", 400));

    const user = await User.findOne({ where: { email } });
    if (!user) 
      return next(new ErrorHandler("User not found", 400));

 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) 
    return next(new ErrorHandler("Invalid credentials", 400));

    const token = jwt.sign({ userId: user.id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

    res.status(200).cookie("access_token",token,cookieOptions).json({ success: true, message: "Login successful",token});
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const logout = async (req, res,next) => {
  try {
    return res
    .status(200)
    .cookie("access_token", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};



export const checkAuthentication=async(req,res,next)=>{
  const {userId}=req.user;
  try {
    const user = await User.findByPk(userId);
    if (user.role !== "admin")
    return res.status(200).json({ success: false, message: "Not an admin" ,isAuthenticated:true ,isAdmin:false});
    res.status(200).json({success: true, message: "User is an admin",isAuthenticated:true,isAdmin:true});
  } catch (error) {   
    next(error);
  }
}
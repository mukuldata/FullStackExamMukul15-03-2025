import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/sql/User.js";

dotenv.config();

export const authenticateUser = (req, res, next) => {
  try{
    const token = req.cookies.access_token;
    if (!token) 
    return res.status(401).json({success: false, message: "Unauthorized",isAuthenticated:false}); 

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(403).json({ success: false, message: "Forbidden",isAuthenticated:false });
    req.user = decoded;
    next();
  } catch (error) {
    next(error)
  }
};


export const authenticateAdmin = async(req, res, next) => {
  try{
    const {userId}=req.user;
    const user = await User.findByPk(userId);
    if (user.role !== "admin")
    return res.status(403).json({ success: false, message: "Forbidden :Only admin can access this route",isAuthenticated:true,isAdmin:false});
    next();
  } catch (error) {
    next(error)
  }
}
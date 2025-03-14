import express from "express";
import { register, login, logout,checkAuthentication  } from "../controllers/authController.js";
import {authenticateUser} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/",authenticateUser,checkAuthentication);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticateUser, logout);


export default router;

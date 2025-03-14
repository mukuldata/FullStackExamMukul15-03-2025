import express from "express";
import { addItemToCart, removeItemFromCart, viewCart } from "../controllers/cartController.js";
import {authenticateUser} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser); // Protect all routes in this file

router.get("/view", viewCart); // View cart
router.post("/add", addItemToCart); // Add item to cart
router.post("/remove", removeItemFromCart); // Remove item from cart


export default router;
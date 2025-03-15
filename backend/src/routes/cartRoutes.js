import express from "express";
import { addItemToCart, removeItemFromCart, viewCart } from "../controllers/cartController.js";
import {authenticateUser} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/view", viewCart);
router.post("/add", addItemToCart); 
router.post("/remove", removeItemFromCart); 


export default router;
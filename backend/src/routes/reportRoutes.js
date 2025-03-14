import express from "express";
import { getRevenueStats,getTopSenders,getSalesByCategory } from "../controllers/reportController.js";
import {authenticateUser,authenticateAdmin} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser);
router.use(authenticateAdmin);

router.get("/revenue-stats", getRevenueStats); 
router.get("/top-senders", getTopSenders);
router.get("/sales-by-category", getSalesByCategory);


export default router;

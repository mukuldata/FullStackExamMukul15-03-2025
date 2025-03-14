import express from "express";
import { getProducts, getProductById ,getCategories} from "../controllers/productController.js";
import {authenticateUser} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser);


router.get("/", getProducts); // List/Search Products
router.get("/categories", getCategories); // Get all categories
router.get("/:id", getProductById); // Get Product by ID


export default router;

import express from "express";
import { getProducts, getProductById ,getCategories} from "../controllers/productController.js";
import {authenticateUser} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser);


router.get("/", getProducts); 
router.get("/categories", getCategories); 
router.get("/:id", getProductById); 


export default router;

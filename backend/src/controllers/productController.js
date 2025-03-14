import Product from "../models/mongo/Product.js";
import ErrorHandler from "../utils/helpers.js";


export const getProducts = async (req, res,next) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const products = await Product.find(query).skip(skip).limit(limitNumber);

    const total = await Product.countDocuments(query);

    res.json({
      total,
      page: pageNumber,
      limit: limitNumber,
      products,
    });
  } catch (error) {
    next(error)
  }
};

// Get product by ID
export const getProductById = async (req, res,next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      
      return next(new ErrorHandler("Product not found", 404));
    }
    res.json({ success: true, message: "Product fetched successfully", product });
  } catch (error) {
    next(error);
  }
};

export const getCategories=async(req,res,next)=>{
  try {
    const categories = await Product.distinct("category");
    res.status(200).json({success: true, message: "Categories fetched successfully", categories});
  } catch (error) {
    next(error);
  }
}
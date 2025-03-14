import { ne } from "@faker-js/faker";
import Cart from "../models/mongo/Cart.js";
import Product from "../models/mongo/Product.js";
import ErrorHandler
 from "../utils/helpers.js";
export const addItemToCart = async (req, res,next) => {
  try {
    
    const { userId } = req.user; 
    const { productId, quantity } = req.body;

    console.log("quantity",quantity);

    if (!userId || !productId || quantity <= 0) {
      return next(new ErrorHandler("Invalid input data", 400));
    }

    if(Number(quantity)> 5){
      return next(new ErrorHandler("Quantity cannot be more than 5", 400));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    if(product.stock < quantity){
      return next(new ErrorHandler("Product out of stock", 400));
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.json({ success: true, message: "Item added to cart" });
  } catch (error) {
    next(error);
  }
};

// Remove item from cart
export const removeItemFromCart = async (req, res,next) => {
  try {
    const {userId}=req.user;
    const { productId } = req.body;

    if (!productId) {
      return next(new ErrorHandler("Invalid input data", 400));
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return next(new ErrorHandler("Cart not found", 404));
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);

    await cart.save();
    res.json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    next(error);
  }
};


export const viewCart = async (req, res,next) => {
  try {
    const { userId } = req.user;

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return next(new ErrorHandler("Cart is empty", 404))
    }

    const cartDetails = cart.items.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      category: item.productId.category,
      quantity: item.quantity,
      subtotal: item.productId.price * item.quantity,
    }));

    const totalPrice = cartDetails.reduce((sum, item) => sum + item.subtotal, 0);

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      cart: cartDetails,
      totalPrice,
    });
  } catch (error) {
    next(error);
  }
};
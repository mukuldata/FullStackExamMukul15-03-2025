import Order from "../models/sql/Order.js";
import OrderItem from "../models/sql/OrderItem.js";
import Cart from "../models/mongo/Cart.js";
import Product from "../models/mongo/Product.js"; 
import { sequelize } from "../config/sql.js";
import ErrorHandler from "../utils/helpers.js";

// Checkout - Create Order
export const checkout = async (req, res,next) => {
  try {
    const { userId } = req.user;
    const transaction = await sequelize.transaction();
    const cart=await Cart.findOne({userId:userId});

    if (!cart || cart.items.length === 0) {
      return next(new ErrorHandler("Cart is empty", 400));
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.productId.toString());

      if (!product) 
        return nexxt(new ErrorHandler("Product not found", 404));

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product._id.toString(),
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = await Order.create(
      { userId, totalAmount, status: "Pending" },
      { transaction }
    );

    for (const item of orderItems) {
      await OrderItem.create({ orderId: order.id, ...item }, { transaction });
    }
    const deletedCart = await Cart.deleteOne({ userId:userId });

    await transaction.commit();

    res.json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// Get Order History
export const getOrderHistory = async (req, res,next) => {
  try {
    const { userId } = req.user;

    const orders = await Order.findAll({
      where: { userId },
      include: [{ model: OrderItem , as: "OrderItems" }],
      order: [["createdAt", "DESC"]],
    });

    for (const order of orders) {
      for (const item of order.OrderItems) {
        const product = await Product.findById(item.productId).lean();
        item.dataValues.product = product || null; 
      }
    }

    res.status(200).json({
      success: true,
      message: "Order history fetched successfully",
      orders,
    });
  } catch (error) {
    next(error);
  }
   
};

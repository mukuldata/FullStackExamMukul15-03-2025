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
        return next(new ErrorHandler("Product not found", 404));

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
      include: [
        {
          model: OrderItem, as: "OrderItems",
          attributes: ["productId", "quantity", "price"],
        },
      ],
    });

    if (orders.length === 0) {
      return res.json({ success: true, message: "No orders found", orders: [] });
    }

    
    const productIds = [
      ...new Set(orders.flatMap((order) => order.OrderItems.map((item) => item.productId))),
    ];

    
    const products = await Product.find({ _id: { $in: productIds } });

   
    const productMap = {};
    products.forEach((product) => {
      productMap[product._id] = {
        name: product.name,
        category: product.category,
      };
    });


    const groupedOrders = orders.map((order) => ({
      orderId: order.id,
      createdAt: order.createdAt,
      status: order.status,
      totalPrice: order.totalAmount, 
      items: order.OrderItems.map((item) => ({
        productName: productMap[item.productId]?.name || "Unknown Product",
        category: productMap[item.productId]?.category || "Unknown Category",
        quantity: item.quantity,
        price: item.price *item.quantity, 
      })),
    }));

    res.status(200).json({
      success: true,
      message: "Order history fetched successfully",
      orders:groupedOrders,
    });
  } catch (error) {
    next(error);
  }
   
};

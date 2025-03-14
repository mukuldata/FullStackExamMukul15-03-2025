import { Op, fn, col, literal } from "sequelize";
import Order from "../models/sql/Order.js";
import User from "../models/sql/User.js";
import Product from "../models/mongo/Product.js";
import OrderItem from "../models/sql/OrderItem.js";

export const getRevenueStats= async (req, res,next) => {
    try {
        const last7DaysRevenue = await Order.findAll({
          attributes: [
            [fn("DATE", col("createdAt")), "date"],
            [fn("SUM", col("totalAmount")), "totalRevenue"],
          ],
          where: {
            createdAt: {
              [Op.gte]: literal("NOW() - INTERVAL '7 days'"),
            },
          },
          group: [fn("DATE", col("createdAt"))],
          order: [[fn("DATE", col("createdAt")), "ASC"]],
        });
    
        res.json({success: true, message: "Last 7 days revenue fetched successfully", last7DaysRevenue});
      } catch (error) {
       next(error)
      }
}

export const getTopSenders = async (req, res,next) => {
    try{
    const topSpenders = await Order.findAll({
        attributes: [
          "userId",
          [fn("SUM", col("totalAmount")), "totalSpent"],
        ],
        include: [{ model: User, attributes: ["name", "email"] }],
        group: ["userId", "User.id"],
        order: [[fn("SUM", col("totalAmount")), "DESC"]],
        limit: 5,
      });
  
      res.json({success: true, message: "Top spenders fetched successfully", topSpenders});
    } catch (error) {
      next(error);
    }
};

export const getSalesByCategory = async (req, res,next) => {
  try {
    const salesData = await OrderItem.findAll({
      attributes: [
        "productId",
        [fn("SUM", col("quantity")), "totalUnitsSold"],
        [fn("SUM", literal("quantity * price")), "totalRevenue"],
      ],
      group: ["productId"],
      raw: true, 
    });


    salesData.forEach((sale) => {
      sale.totalUnitsSold = Number(sale.totalUnitsSold) || 0;
      sale.totalRevenue = Number(sale.totalRevenue) || 0;
    });

    const productIds = salesData.map((sale) => sale.productId.toString()); 
    const products = await Product.find({ _id: { $in: productIds } });

    const salesByCategory = {};
    salesData.forEach((sale) => {
      const product = products.find((p) => p._id.toString() === sale.productId);
      if (product) {
        const category = product.category || "Unknown";
        if (!salesByCategory[category]) {
          salesByCategory[category] = { totalUnitsSold: 0, totalRevenue: 0 };
        }
        salesByCategory[category].totalUnitsSold += sale.totalUnitsSold;
        salesByCategory[category].totalRevenue += sale.totalRevenue;
      }
    });


    const response = Object.keys(salesByCategory).map((category) => ({
      category,
      totalUnitsSold: salesByCategory[category].totalUnitsSold,
      totalRevenue: salesByCategory[category].totalRevenue,
    }));

    res.json({
      success: true,
      message: "Sales by category fetched successfully",
      data: response,
    });
  } catch (error) {
     next(error)
  }
};
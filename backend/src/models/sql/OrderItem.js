import { DataTypes } from "sequelize";
import { sequelize } from "../../config/sql.js";
import Order from "./Order.js";

const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, 
    allowNull: false,
    primaryKey: true},
  orderId: { type: DataTypes.UUID, allowNull: false, references: { model: Order, key: "id" } },
  productId: { type: DataTypes.STRING, allowNull: false }, 
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
});

Order.hasMany(OrderItem, { foreignKey: "orderId", as: "OrderItems" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

export default OrderItem;

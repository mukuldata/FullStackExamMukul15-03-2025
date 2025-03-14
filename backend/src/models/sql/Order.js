import { DataTypes } from "sequelize";
import { sequelize } from "../../config/sql.js";
import User from "./User.js";

const Order = sequelize.define("Order", {
  id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, 
      allowNull: false,
      primaryKey: true},
  userId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: "id" } },
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "Pending" },
});

Order.belongsTo(User, { foreignKey: "userId" });

export default Order;

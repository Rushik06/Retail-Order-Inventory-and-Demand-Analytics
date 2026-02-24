import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequilize.js";

export class Order extends Model {}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "CREATED",
        "CONFIRMED",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED"
      ),
      defaultValue: "CREATED",
    },
    
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "orders",
  }
);
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/index.js";
import { Product } from "./product.model.js";
import { Order } from "./order.model.js";

export class OrderItem extends Model {}

OrderItem.init(
{
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "order_id",
  },

  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "product_id",
  },

  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
},
{
  sequelize,
  tableName: "order_items",
  timestamps: true,
  underscored: true,
}
);

Order.hasMany(OrderItem, { foreignKey: "orderId" });
Product.hasMany(OrderItem, { foreignKey: "productId" });

OrderItem.belongsTo(Order, { foreignKey: "orderId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });
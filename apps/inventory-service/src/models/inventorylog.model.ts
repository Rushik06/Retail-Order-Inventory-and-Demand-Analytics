import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/index.js";

export class InventoryLog extends Model {}

InventoryLog.init(
  {
    inventory_log_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    warehouse_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    action_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    previous_available_qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    new_available_qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reference_id: {
      type: DataTypes.BIGINT,
    },
    performed_by: {
      type: DataTypes.BIGINT,
    },
  },
  {
    sequelize,
    tableName: "inventory_logs",
    timestamps: false,
  }
);
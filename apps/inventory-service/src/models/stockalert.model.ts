import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/index.js";

export class StockAlert extends Model {}

StockAlert.init(
  {
    alert_id: {
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
    alert_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    threshold_qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    current_qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_resolved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "stock_alerts",
    timestamps: false,
  }
);
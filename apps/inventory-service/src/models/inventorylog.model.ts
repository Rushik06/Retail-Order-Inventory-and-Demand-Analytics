import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/index.js";
import { randomUUID } from "crypto";

export class InventoryLog extends Model {}

InventoryLog.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => randomUUID(),
    },

    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    warehouse_id: {
      type: DataTypes.UUID,
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
      type: DataTypes.UUID,
      allowNull: true,
    },

    performed_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "inventory_logs",
    timestamps: true,
  }
);
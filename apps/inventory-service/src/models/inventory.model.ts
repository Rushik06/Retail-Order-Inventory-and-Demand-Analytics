import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/index.js";
import { randomUUID } from "crypto";

export class Inventory extends Model {}

Inventory.init(
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

    available_qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    reserved_qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "inventory",
    timestamps: true,
  }
);
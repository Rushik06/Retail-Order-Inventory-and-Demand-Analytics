import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/index.js";
import { randomUUID } from "crypto";

export class Warehouse extends Model {}

Warehouse.init(
  {
    warehouse_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => randomUUID(),
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "warehouses",
    timestamps: true,
  }
);
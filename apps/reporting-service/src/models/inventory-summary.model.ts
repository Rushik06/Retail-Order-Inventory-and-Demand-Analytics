import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../config/sequilize.js";

interface InventorySummaryAttributes {
  id: string;
  product_id: string;
  warehouse_id: string;
  available_qty: number;
  reserved_qty: number;
  threshold: number;
  status: "LOW" | "NORMAL" | "HIGH";
  updated_at?: Date;
}

type InventorySummaryCreation =
  Optional<InventorySummaryAttributes, "id" | "updated_at">;

export class InventorySummary
  extends Model<InventorySummaryAttributes, InventorySummaryCreation>
  implements InventorySummaryAttributes {

  public id!: string;
  public product_id!: string;
  public warehouse_id!: string;
  public available_qty!: number;
  public reserved_qty!: number;
  public threshold!: number;
  public status!: "LOW" | "NORMAL" | "HIGH";

  public readonly updated_at!: Date;
}

InventorySummary.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },

    product_id: {
      type: DataTypes.UUID,
      allowNull: false
    },

    warehouse_id: {
      type: DataTypes.UUID,
      allowNull: false
    },

    available_qty: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    reserved_qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    threshold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10
    },

    status: {
      type: DataTypes.ENUM("LOW", "NORMAL", "HIGH"),
      allowNull: false
    },

    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }

  },
  {
    sequelize,
    tableName: "inventory_summary",
    timestamps: false
  }
);
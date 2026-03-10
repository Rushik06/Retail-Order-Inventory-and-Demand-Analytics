import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../config/sequilize.js";

interface WarehouseSummaryAttributes {
  id: string;
  warehouse_id: string;
  name: string;
  location: string;
  created_at?: Date;
}

type WarehouseSummaryCreation =
  Optional<WarehouseSummaryAttributes, "id" | "created_at">;

export class WarehouseSummary
  extends Model<WarehouseSummaryAttributes, WarehouseSummaryCreation>
  implements WarehouseSummaryAttributes {

  public id!: string;
  public warehouse_id!: string;
  public name!: string;
  public location!: string;

  public readonly created_at!: Date;
}

WarehouseSummary.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },

    warehouse_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    location: {
      type: DataTypes.STRING,
      allowNull: false
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }

  },
  {
    sequelize,
    tableName: "warehouse_summary",
    timestamps: false
  }
);
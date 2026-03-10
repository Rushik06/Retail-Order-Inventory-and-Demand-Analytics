import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../config/sequilize.js";

interface InventoryActivityAttributes {
  id: string;
  product_id: string;
  warehouse_id: string;
  action_type: "INBOUND" | "OUTBOUND";
  quantity: number;
  created_at?: Date;
}

type InventoryActivityCreation =
  Optional<InventoryActivityAttributes, "id" | "created_at">;

export class InventoryActivity
  extends Model<InventoryActivityAttributes, InventoryActivityCreation>
  implements InventoryActivityAttributes {

  public id!: string;
  public product_id!: string;
  public warehouse_id!: string;
  public action_type!: "INBOUND" | "OUTBOUND";
  public quantity!: number;

  public readonly created_at!: Date;
}

InventoryActivity.init(
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

    action_type: {
      type: DataTypes.ENUM("INBOUND", "OUTBOUND"),
      allowNull: false
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }

  },
  {
    sequelize,
    tableName: "inventory_activity",
    timestamps: false
  }
);

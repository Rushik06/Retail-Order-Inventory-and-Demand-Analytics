import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../config/sequilize.js";

interface ProductSummaryAttributes {
  id: string;
  product_id: string;
  sku: string;
  name: string;
  category: string | null;
  created_at?: Date;
}

type ProductSummaryCreation =
  Optional<ProductSummaryAttributes, "id" | "created_at">;

export class ProductSummary
  extends Model<ProductSummaryAttributes, ProductSummaryCreation>
  implements ProductSummaryAttributes {

  public id!: string;
  public product_id!: string;
  public sku!: string;
  public name!: string;
  public category!: string | null;

  public readonly created_at!: Date;
}

ProductSummary.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },

    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true
    },

    sku: {
      type: DataTypes.STRING,
      allowNull: false
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    category: {
      type: DataTypes.STRING,
      allowNull: true
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }

  },
  {
    sequelize,
    tableName: "product_summary",
    timestamps: false
  }
);
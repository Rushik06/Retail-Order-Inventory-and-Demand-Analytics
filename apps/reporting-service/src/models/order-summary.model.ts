import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../config/sequilize.js";

interface OrderSummaryAttributes {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  total_amount: number;
  order_date: Date;
}

type OrderSummaryCreation =
  Optional<OrderSummaryAttributes, "id">;

export class OrderSummary
  extends Model<OrderSummaryAttributes, OrderSummaryCreation>
  implements OrderSummaryAttributes {

  public id!: string;
  public order_id!: string;
  public product_id!: string;
  public quantity!: number;
  public price!: number;
  public total_amount!: number;
  public order_date!: Date;
}

OrderSummary.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },

    order_id: {
      type: DataTypes.UUID,
      allowNull: false
    },

    product_id: {
      type: DataTypes.UUID,
      allowNull: false
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },

    total_amount: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: false
    },

    order_date: {
      type: DataTypes.DATE,
      allowNull: false
    }

  },
  {
    sequelize,
    tableName: "order_summary",
    timestamps: false
  }
);
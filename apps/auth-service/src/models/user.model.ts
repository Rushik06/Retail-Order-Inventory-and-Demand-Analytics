import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/sequilize.js'

export class User extends Model {
  declare user_id: string;
  declare name: string;
  declare email: string;
  declare password: string;
  declare is_active: boolean;
}

User.init(
  {

    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      field: 'user_id',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'isActive',
      

    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
  }
);
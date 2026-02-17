import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/sequilize.js';

export class User extends Model {
  declare user_id: string;
  declare email: string;
  declare password_hash: string;
  declare is_active: boolean;
}

User.init(
  {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
  }
);
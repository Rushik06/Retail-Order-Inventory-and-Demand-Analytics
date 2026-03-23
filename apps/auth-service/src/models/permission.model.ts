import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/index.js';

export class PermissionModel extends Model {
  declare id: string;
  declare name: string;
}

PermissionModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'permissions',
    timestamps: true,
  }
);
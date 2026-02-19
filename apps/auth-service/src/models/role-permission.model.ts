import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/index.js';

export class RolePermissionModel extends Model {
  declare roleId: string;
  declare permissionId: string;
}

RolePermissionModel.init(
  {
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    permissionId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    tableName: 'role_permissions',
    timestamps: false,
  }
);
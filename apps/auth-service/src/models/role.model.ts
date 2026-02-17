import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/sequilize.js';

export class Role extends Model {
  declare role_id: number;
  declare role_name: string;
}

Role.init(
  {
    role_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role_name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'roles',
    timestamps: false,
  }
);
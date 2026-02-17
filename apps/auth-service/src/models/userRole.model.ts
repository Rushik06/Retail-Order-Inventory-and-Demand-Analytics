import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/sequilize.js';
import { User } from './user.model.js';
import { Role } from './role.model.js';

export class UserRole extends Model {}

UserRole.init(
  {
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: 'user_id',
      },
    },
    role_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Role,
        key: 'role_id',
      },
    },
  },
  {
    sequelize,
    tableName: 'user_roles',
    timestamps: false,
  }
);

User.belongsToMany(Role, { through: UserRole, foreignKey: 'user_id' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'role_id' });
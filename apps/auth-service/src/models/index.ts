import { User } from './user.model.js';
import { Role} from './role.model.js';
import { PermissionModel } from './permission.model.js';
import { RolePermissionModel } from './role-permission.model.js';

// Role Users
Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

// Role  Permission (Many-to-Many)
Role.belongsToMany(PermissionModel, {
  through: RolePermissionModel,
  foreignKey: 'roleId',
});

PermissionModel.belongsToMany(Role, {
  through: RolePermissionModel,
  foreignKey: 'permissionId',
});

export {
  User,
  Role,
  PermissionModel,
  RolePermissionModel,
};
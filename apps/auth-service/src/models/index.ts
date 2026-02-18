import { User } from './user.model.js';
import { Role } from './role.model.js';
import { PermissionModel } from './permission.model.js';
import { RolePermissionModel } from './role-permission.model.js';
import { PasswordOtp } from './password-otp.model.js';


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
  PasswordOtp,
};
/* eslint-disable */
import { randomUUID } from 'crypto';
import { User as UserModel, Role as RoleModel } from './models/index.js';
import type { User } from './types/auth.types.js';

export class AuthRepository {
  verifyRefreshToken(refreshToken: string) {
    throw new Error('Method not implemented.');
  }
  saveRefreshToken(refreshToken: string, id: string) {
    throw new Error('Method not implemented.');
  }

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({
      where: { email },
      include: [
        {
          model: RoleModel,
          attributes: ['name'],
        },
      ],
    });

    if (!user) {
      return null;
    }

    const role = (user as any).Role?.name ?? 'staff';

    return {
      id: user.getDataValue('id'),
      email: user.getDataValue('email'),
      password: user.getDataValue('password'),
      role,
      isActive: user.getDataValue('isActive'),
    };
  }

  //  Create user
  async create(user: User): Promise<User> {

    // find role first
    const roleRecord = await RoleModel.findOne({
      where: { name: user.role },
    });

    if (!roleRecord) {
      throw new Error('ROLE_NOT_FOUND');
    }

    const createdUser = await UserModel.create({
      id: randomUUID(),
      email: user.email,
      password: user.password,
      roleId: roleRecord.getDataValue('id'),
      isActive: user.isActive,
    });

    return {
      id: createdUser.getDataValue('id'),
      email: createdUser.getDataValue('email'),
      password: createdUser.getDataValue('password'),
      role: user.role,
      isActive: createdUser.getDataValue('isActive'),
    };
  }
}
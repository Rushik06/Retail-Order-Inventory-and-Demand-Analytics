/* eslint-disable */

import { User as UserModel } from '../models/index.js';
import { Role } from '../models/role.model.js';
import type { User } from '../types/auth.types.js';

export class AuthRepository {


  // FIND BY EMAIL
  
  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({
      where: { email },
      include: [
        {
          model: Role,
          through: { attributes: [] }, 
        },
      ],
    });

    if (!user) return null;

    const roles = user.getDataValue('Roles');
    const roleName = roles?.[0]?.role_name; 

    return {
      id: user.getDataValue('user_id'),
      name: user.getDataValue('name'),
      email: user.getDataValue('email'),
      password: user.getDataValue('password'),
      isActive: user.getDataValue('isActive'),
      role: roleName, 
    };
  }

 
  // FIND BY ID
  
  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findByPk(id, {
      include: [
        {
          model: Role,
          through: { attributes: [] },
        },
      ],
    });

    if (!user) return null;

    const roles = user.getDataValue('Roles');
    const roleName = roles?.[0]?.role_name;

    return {
      id: user.getDataValue('user_id'),
      name: user.getDataValue('name'),
      email: user.getDataValue('email'),
      password: user.getDataValue('password'),
      isActive: user.getDataValue('isActive'),
      role: roleName, 
    };
  }

  
  // CREATE USER
  
  async create(user: User): Promise<User> {
    const createdUser = await UserModel.create({
      user_id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      isActive: user.isActive,
    });

    console.log('Created user in DB:', createdUser.get());

    return {
      id: createdUser.getDataValue('user_id'),
      name: createdUser.getDataValue('name'),
      email: createdUser.getDataValue('email'),
      password: createdUser.getDataValue('password'),
      isActive: createdUser.getDataValue('isActive'),
    };
  }

  // =========================
  // REFRESH TOKEN METHODS
  // =========================
  async saveRefreshToken(
    _refreshToken: string,
    _userId: string
  ): Promise<void> {
    return;
  }

  async verifyRefreshToken(
    _refreshToken: string
  ): Promise<void> {
    return;
  }

  async deleteRefreshToken(
    _refreshToken: string
  ): Promise<void> {
    return;
  }
}
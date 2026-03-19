import { createHash, randomUUID } from 'crypto';
import { User as UserModel } from '../models/index.js';
import { Role } from '../models/role.model.js';
import { redis } from '../utils/redis.js';
import type { User } from '../types/auth.types.js';
import { AUTH } from '../constants/auth.js'
export class AuthRepository {


  // Helpers 

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private redisKey(token: string): string {
    return `refresh:${this.hashToken(token)}`;
  }

  // Find By Email 

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

  // Find By ID 

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

  // Get All Users 

  async getAllUsers(): Promise<User[]> {
    const users = await UserModel.findAll({
      include: [
        {
          model: Role,
          through: { attributes: [] },
        },
      ],
    });

    return users.map((user) => {
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
    });
  }

  // Create User 

  async create(user: User): Promise<User> {
    const createdUser = await UserModel.create({
      user_id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      isActive: user.isActive,
    });

    return {
      id: createdUser.getDataValue('user_id'),
      name: createdUser.getDataValue('name'),
      email: createdUser.getDataValue('email'),
      password: createdUser.getDataValue('password'),
      isActive: createdUser.getDataValue('isActive'),
    };
  }

  // Refresh Token Methods 


  async saveRefreshToken(refreshToken: string, userId: string): Promise<void> {
    await redis.set(
      this.redisKey(refreshToken),
      userId,
      'EX',
      AUTH.REFRESH_TOKEN_TTL_SECONDS,
    );
  }


  async verifyRefreshToken(refreshToken: string): Promise<string> {
    const userId = await redis.get(this.redisKey(refreshToken));

    if (!userId) {
      throw new Error('Invalid or expired refresh token');
    }

    return userId;
  }

 
  async deleteRefreshToken(refreshToken: string): Promise<void> {
    await redis.del(this.redisKey(refreshToken));
  }


  async rotateRefreshToken(oldToken: string, userId: string): Promise<string> {
    await this.deleteRefreshToken(oldToken);
    const newToken = randomUUID();
    await this.saveRefreshToken(newToken, userId);
    return newToken;
  }
}
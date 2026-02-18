/* eslint-disable */
import { User as UserModel } from '../models/index.js';
import type { User } from '../types/auth.types.js';

export class ProfileRepository {

  // FIND USER BY ID

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findByPk(id);

    if (!user) return null;

    return {
      id: user.getDataValue('user_id'),
      name: user.getDataValue('name'),
      email: user.getDataValue('email'),
      password: user.getDataValue('password'),
      isActive: user.getDataValue('is_active'),
    };
  }


  // UPDATE USER
  
  async update(
    id: string,
    data: { name?: string; phone?: string }
  ): Promise<User | null> {
    const user = await UserModel.findByPk(id);
    if (!user) return null;

    await user.update(data);

    return {
      id: user.getDataValue('user_id'),
      name: user.getDataValue('name'),
      email: user.getDataValue('email'),
      password: user.getDataValue('password'),
      isActive: user.getDataValue('is_active'),
    };
  }

  // DELETE USER

  async delete(id: string): Promise<void> {
    await UserModel.destroy({
      where: { user_id: id },
    });
  }
}
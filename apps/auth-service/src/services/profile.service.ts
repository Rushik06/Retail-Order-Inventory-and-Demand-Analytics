import { ERRORS } from '../constants/errors.js';
import { MESSAGES } from '../constants/messages.js';
import type { ProfileRepository } from '../repository/profile.repository.js';
import { AppError } from '../utils/app-error.js';

export class ProfileService {
  constructor(private readonly repo: ProfileRepository) {}

  /* GET PROFILE */

  async getProfile(userId: string) {

    const user = await this.repo.findById(userId);

    if (!user) {
      throw new AppError(ERRORS.USER_NOT_FOUND, 404);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  /* UPDATE PROFILE */

  async updateProfile(
    userId: string,
    data: {
      name?: string;
      phone?: string;
    }
  ) {

    const user = await this.repo.update(userId, data);

    if (!user) {
      throw new AppError(ERRORS.USER_NOT_FOUND, 404);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  /* DELETE ACCOUNT */

  async deleteProfile(userId: string) {

    await this.repo.delete(userId);

    return { message: MESSAGES.ACCOUNT_DELETED };
  }
}
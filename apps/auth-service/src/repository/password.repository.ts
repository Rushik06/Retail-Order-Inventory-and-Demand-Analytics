/* eslint-disable */
import { User } from '../models/index.js';
import { PasswordOtp } from '../models/password-otp.model.js';
import { randomUUID } from 'crypto';

export class PasswordRepository {

  async findUserByEmail(email: string) {
    return User.findOne({ where: { email } });
  }
   async findUserById(userId: string) {
   return User.findOne({
    where: { user_id: userId },
  });
  }
  async updatePassword(userId: string, hashedPassword: string) {
    await User.update(
      { password: hashedPassword },
      { where: { user_id: userId } }
    );
  }

  async createOtp(userId: string, otp: string, expiresAt: Date) {
    await PasswordOtp.create({
      id: randomUUID(),
      user_id: userId,
      otp_code: otp,
      expires_at: expiresAt,
      is_used: false,
    });
  }

  async findValidOtp(userId: string, otp: string) {
    return PasswordOtp.findOne({
      where: {
        user_id: userId,
        otp_code: otp,
        is_used: false,
      },
    });
  }

  async markOtpUsed(id: string) {
    await PasswordOtp.update(
      { is_used: true },
      { where: { id } }
    );
  }
}
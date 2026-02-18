import bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { PasswordRepository } from '../repository/password.repository.js';
import { EmailService } from './email.service.js';

export class PasswordService {
  private emailService = new EmailService();

  constructor(private readonly repo: PasswordRepository) {}

  
  // CHANGE PASSWORD 
  
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    const user = await this.repo.findUserByEmail(userId);
    if (!user) throw new Error('USER_NOT_FOUND');

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.getDataValue('password')
    );

    if (!isMatch) throw new Error('INVALID_CURRENT_PASSWORD');

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.repo.updatePassword(
      user.getDataValue('user_id'),
      hashedPassword
    );

    return { message: 'Password changed successfully' };
  }


  // FORGOT PASSWORD (Generate OTP)
 
  async forgotPassword(email: string) {
    const user = await this.repo.findUserByEmail(email);
    if (!user) throw new Error('USER_NOT_FOUND');

    const otp = randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await this.repo.createOtp(
      user.getDataValue('user_id'),
      otp,
      expiresAt
    );

    await this.emailService.sendOtpEmail(
      user.getDataValue('email'),
      otp
    );

    return { message: 'OTP sent to registered email' };
  }

  
  // RESET PASSWORD (Using OTP)

  async resetPassword(
    email: string,
    otp: string,
    newPassword: string
  ) {
    const user = await this.repo.findUserByEmail(email);
    if (!user) throw new Error('USER_NOT_FOUND');

    const validOtp = await this.repo.findValidOtp(
      user.getDataValue('user_id'),
      otp
    );

    if (!validOtp) throw new Error('INVALID_OTP');

    if (new Date() > validOtp.getDataValue('expires_at'))
      throw new Error('OTP_EXPIRED');

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.repo.updatePassword(
      user.getDataValue('user_id'),
      hashedPassword
    );

    await this.repo.markOtpUsed(validOtp.getDataValue('id'));

    return { message: 'Password reset successfully' };
  }
}
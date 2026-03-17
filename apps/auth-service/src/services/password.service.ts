import bcrypt from "bcrypt";
import { randomInt } from "crypto";
import { PasswordRepository } from "../repository/password.repository.js";
import { EmailService } from "./email.service.js";
import { AppError } from "../utils/app-error.js";
import { ERRORS } from "../constants/errors.js";
import { MESSAGES } from "../constants/messages.js";

export class PasswordService {
  private emailService = new EmailService();

  constructor(private readonly repo: PasswordRepository) {}

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.repo.findUserById(userId);

    if (!user) throw new AppError(ERRORS.USER_NOT_FOUND, 404);

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.getDataValue("password")
    );

    if (!isMatch) throw new AppError(ERRORS.INVALID_CREDENTIALS, 400);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.repo.updatePassword(user.getDataValue("user_id"), hashedPassword);

    return { message: MESSAGES.PASSWORD_CHANGED };
  }

  async forgotPassword(email: string) {
    const user = await this.repo.findUserByEmail(email);

    if (!user) throw new AppError(ERRORS.USER_NOT_FOUND, 404);

    const otp = randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.repo.createOtp(user.getDataValue("user_id"), otp, expiresAt);

    await this.emailService.sendOtpEmail(
      user.getDataValue("email"),
      otp
    );

    return { message: MESSAGES.OTP_SENT };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await this.repo.findUserByEmail(email);

    if (!user) throw new AppError(ERRORS.USER_NOT_FOUND, 404);

    const validOtp = await this.repo.findValidOtp(
      user.getDataValue("user_id"),
      otp
    );

    if (!validOtp) throw new AppError(ERRORS.INVALID_OTP, 400);

    if (new Date() > validOtp.getDataValue("expires_at")) {
      throw new AppError(ERRORS.OTP_EXPIRED, 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.repo.updatePassword(
      user.getDataValue("user_id"),
      hashedPassword
    );

    await this.repo.markOtpUsed(validOtp.getDataValue("id"));

    return { message: MESSAGES.PASSWORD_RESET };
  }
}
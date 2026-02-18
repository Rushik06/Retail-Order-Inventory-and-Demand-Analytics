import nodemailer from 'nodemailer';
import { env } from '../config/index.js';

export class EmailService {
  private transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: Number(env.EMAIL_PORT),
    secure: false,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });

  async sendOtpEmail(to: string, otp: string) {
    await this.transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject: 'Password Reset OTP',
      html: `
        <h2>Password Reset Request</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
      `,
    });
  }
}
import nodemailer from "nodemailer";
import { logger } from "@repo/shared";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

interface EmailOptions {
  to: string
  subject: string
  text?: string
  html?: string
}

export const sendEmail = async ({
  to,
  subject,
  text,
  html
}: EmailOptions) => {

  try {

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html
    });

    logger.info({ messageId: info.messageId, to, subject }, "Email sent successfully");

  } catch (error) {

    logger.error({ err: error, to, subject }, "Email send failed");
    throw error;

  }

};
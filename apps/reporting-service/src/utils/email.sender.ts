import nodemailer from "nodemailer";

export const sendReportEmail = async (
  email: string,
  file: Buffer,
  filename: string
) => {

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "Dashboard Report",
    text: "Please find attached dashboard report",
    attachments: [
      {
        filename,
        content: file
      }
    ]
  });

};
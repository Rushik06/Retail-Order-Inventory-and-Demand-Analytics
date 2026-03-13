import nodemailer from "nodemailer";

export const sendReportEmail = async (
  email: string,
  pdf: Buffer,
  excel: Buffer
) => {

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Dashboard Report",
    text: "Please find attached dashboard report",
    attachments: [
      {
        filename: "dashboard-report.pdf",
        content: pdf
      },
      {
        filename: "dashboard-report.xlsx",
        content: excel
      }
    ]
  });

};
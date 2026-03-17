import { sendEmail } from "../utils/email.js";
import { User } from "../models/user.model.js";
import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const requestRoleAccess = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {

  const { roleName } = req.body;

  if (!req.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await User.findByPk(req.user.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  await sendEmail({
    to: process.env.EMAIL_USER || "",
    subject: "Role Access Request",
    text: `
User Role Access Request

Name: ${user.name}
Email: ${user.email}

Requested Role: ${roleName}
    `,
  });

  return res.json({
    message: "Role request sent successfully",
  });
};
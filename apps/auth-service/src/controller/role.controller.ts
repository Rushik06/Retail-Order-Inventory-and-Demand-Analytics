import { UserRole } from "../models/userRole.model.js";
import { Role } from "../models/role.model.js";
import type { Request, Response } from "express";

export const assignRole = async (req: Request, res: Response) => {

  try {

    const { userId, roleName } = req.body;

    if (!userId || !roleName) {
      return res.status(400).json({
        error: "userId and roleName are required"
      });
    }

    const role = await Role.findOne({
      where: { role_name: roleName }
    });

    if (!role) {
      return res.status(404).json({
        error: "Role not found"
      });
    }

    // check if user already has role
    const existingUserRole = await UserRole.findOne({
      where: { user_id: userId }
    });

    if (existingUserRole) {

      await existingUserRole.update({
        role_id: role.role_id
      });

    } else {

      await UserRole.create({
        user_id: userId,
        role_id: role.role_id
      });

    }

    return res.json({
      message: "Role assigned successfully"
    });

  } catch {

    return res.status(500).json({
      error: "Failed to assign role"
    });

  }
};
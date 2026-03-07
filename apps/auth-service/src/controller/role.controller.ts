import { UserRole } from "../models/userRole.model.js";
import { Role } from "../models/role.model.js";
import type { Request, Response } from "express";

export const assignRole = async (req: Request, res: Response) => {

  try {

    const { userId, roleName } = req.body;

    const role = await Role.findOne({
      where: { name: roleName }
    });

    if (!role) {
      return res.status(400).json({
        error: "Role not found"
      });
    }

    await UserRole.create({
      user_id: userId,
      role_id: role.role_id
    });

    return res.json({
      message: "Role assigned successfully"
    });

  } catch  {

    return res.status(500).json({
      error: "Failed to assign role"
    });

  }
};
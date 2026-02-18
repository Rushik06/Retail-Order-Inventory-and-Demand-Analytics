/*eslint-disable*/ 
import { UserRole } from '../models/userRole.model.js';
import { Role } from '../models/role.model.js';

export class RbacService {
  private readonly roleHierarchy: Record<string, number> = {
    super_admin: 4,
    admin: 3,
    manager: 2,
    staff: 1,
  };

  // Get role name of user
  async getUserRole(userId: string): Promise<string | null> {
    const userRole = await UserRole.findOne({
      where: { user_id: userId },
      include: [
        {
          model: Role,
          attributes: ['name'],
        },
      ],
    });

    if (!userRole) return null;

    const roleName = (userRole as any).Role?.name;
    return roleName ?? null;
  }

  // Check access based on role hierarchy
  async hasAccess(
    userId: string,
    allowedRoles: string[]
  ): Promise<boolean> {
    const userRole = await this.getUserRole(userId);

    if (!userRole) return false;

    const userLevel = this.roleHierarchy[userRole];
    if (userLevel === undefined) return false;

    for (const role of allowedRoles) {
      const requiredLevel = this.roleHierarchy[role];
      if (requiredLevel !== undefined && userLevel >= requiredLevel) {
        return true;
      }
    }

    return false;
  }
}
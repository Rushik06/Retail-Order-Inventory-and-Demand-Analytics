export const ROLE_HIERARCHY = {
  super_admin: 4,
  admin: 3,
  manager: 2,
  staff: 1,
} as const;

export type RoleType = keyof typeof ROLE_HIERARCHY;
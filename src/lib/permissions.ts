// Role-based permission system

export type Role = "admin" | "editor" | "user";

export type Permission =
  | "news:create"
  | "news:edit"
  | "news:delete"
  | "news:publish"
  | "news:fetch"
  | "franchise:create"
  | "franchise:edit"
  | "franchise:delete"
  | "list:create"
  | "list:edit"
  | "list:delete"
  | "user:manage"
  | "settings:manage"
  | "comment:moderate";

// Permission mappings for each role
const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    "news:create",
    "news:edit",
    "news:delete",
    "news:publish",
    "news:fetch",
    "franchise:create",
    "franchise:edit",
    "franchise:delete",
    "list:create",
    "list:edit",
    "list:delete",
    "user:manage",
    "settings:manage",
    "comment:moderate",
  ],
  editor: [
    "news:create",
    "news:edit",
    "news:publish",
    "franchise:create",
    "franchise:edit",
    "list:create",
    "list:edit",
    "comment:moderate",
  ],
  user: [],
};

// Check if a role has a specific permission
export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

// Check if a role has any of the specified permissions
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

// Check if a role has all of the specified permissions
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

// Get all permissions for a role
export function getPermissions(role: Role): Permission[] {
  return rolePermissions[role] || [];
}

// Middleware helper to check permission from session
export function checkPermission(
  session: { role: Role } | null,
  permission: Permission
): boolean {
  if (!session) return false;
  return hasPermission(session.role, permission);
}

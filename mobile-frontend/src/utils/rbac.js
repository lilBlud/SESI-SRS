/**
 * ═══════════════════════════════════════════════════════════════
 * Role-Based Access Control (RBAC) & User Normalization Utilities
 * ═══════════════════════════════════════════════════════════════
 * Centralized business logic for role resolution, user identity matching,
 * and data normalization across Supabase and frontend presentation.
 */

export const DEFAULT_ADMIN_EMAILS = [
  'admin@test.com',
  'azibdanish66@gmail.com'
];

/**
 * Robustly determine if two user references or an identifier point to the same user.
 * Supports comparison by Id, Email, StaffId, or FullName.
 */
export function matchesUser(userA, identifierOrUserB) {
  if (!userA || !identifierOrUserB) return false;

  const getKeys = (target) => {
    if (typeof target === 'object' && target !== null) {
      return {
        id: target.Id ?? target.id ?? null,
        email: (target.Email || target.email || '').trim().toLowerCase(),
        staffId: (target.StaffId || target.staffId || '').trim().toLowerCase(),
        fullName: (target.FullName || target.fullName || '').trim().toLowerCase()
      };
    }
    const str = String(target).trim().toLowerCase();
    const num = Number(target);
    return {
      id: !isNaN(num) && num > 0 ? num : null,
      email: str.includes('@') ? str : '',
      staffId: str,
      fullName: str
    };
  };

  const a = getKeys(userA);
  const b = getKeys(identifierOrUserB);

  if (a.id && b.id && a.id === b.id) return true;
  if (a.email && b.email && a.email === b.email) return true;
  if (a.staffId && b.staffId && a.staffId === b.staffId) return true;
  if (a.fullName && b.fullName && a.fullName === b.fullName) return true;

  return false;
}

/**
 * Pure function to resolve whether a raw user record represents an 'Admin' or 'Staff'.
 * Priority: Explicit Staff Override > Explicit Admin Override / Database Role > Default Admin fallback.
 */
export function resolveUserRole(rawUser, { adminSet = new Set(), staffSet = new Set() } = {}) {
  if (!rawUser) return 'Staff';

  const email = (rawUser.Email || rawUser.email || '').trim().toLowerCase();
  const fullName = (rawUser.FullName || rawUser.fullName || '').trim().toLowerCase();
  const staffId = (rawUser.StaffId || rawUser.staffId || '').trim().toLowerCase();
  const dbRole = rawUser.Role ?? rawUser.role;

  // 1. Explicit Staff revocation override always takes precedence
  const isExplicitStaff = staffSet.has(email) || staffSet.has(fullName) || staffSet.has(staffId);
  if (isExplicitStaff) return 'Staff';

  // 2. Explicit Admin grant override or DB Admin
  const isExplicitAdmin = adminSet.has(email) || adminSet.has(fullName) || adminSet.has(staffId);
  if (dbRole === 'Admin' || isExplicitAdmin) return 'Admin';

  return 'Staff';
}

/**
 * Standardize user objects across the platform, handling PascalCase/camelCase from Supabase or APIs.
 */
export function normalizeUser(rawUser, role = null) {
  if (!rawUser) return null;

  return {
    id: rawUser.Id ?? rawUser.id ?? null,
    fullName: rawUser.FullName ?? rawUser.fullName ?? '',
    preferredName: rawUser.PreferredName ?? rawUser.preferredName ?? '',
    email: rawUser.Email ?? rawUser.email ?? '',
    division: rawUser.Division ?? rawUser.division ?? '',
    staffId: rawUser.StaffId ?? rawUser.staffId ?? '',
    profilePicture: rawUser.ProfilePicture ?? rawUser.profilePicture ?? '',
    role: role || (rawUser.Role ?? rawUser.role ?? 'Staff'),
    createdAt: rawUser.CreatedAt ?? rawUser.createdAt ?? ''
  };
}

/**
 * Format user display name: returns preferredName or first part of fullName.
 */
export function getUserDisplayName(user) {
  if (!user) return 'User';
  const preferred = (user.preferredName || user.PreferredName || '').trim();
  if (preferred) return preferred;
  const full = (user.fullName || user.FullName || user.email || 'User').trim();
  return full.split(' ')[0] || 'User';
}

/**
 * Extract 1-2 character uppercase initials from a user's full name.
 */
export function getUserInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

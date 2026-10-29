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

  const getId = (u) => {
    if (typeof u === 'object' && u !== null) {
      const val = u.Id ?? u.id;
      return val != null ? String(val).trim() : null;
    }
    const s = String(u).trim();
    return /^\d+$/.test(s) ? s : null;
  };

  const idA = getId(userA);
  const idB = getId(identifierOrUserB);

  // If both have explicit IDs (or one is a pure numeric ID), match strictly by ID
  if (idA !== null && idB !== null) {
    return idA === idB;
  }

  // If target is a pure numeric ID and idA did not match, do not false-match against text fields
  if (typeof identifierOrUserB === 'number' || (typeof identifierOrUserB === 'string' && /^\d+$/.test(identifierOrUserB.trim()))) {
    return false;
  }

  const getFields = (u) => {
    if (typeof u === 'object' && u !== null) {
      return {
        email: (u.Email || u.email || '').trim().toLowerCase(),
        staffId: (u.StaffId || u.staffId || '').trim().toLowerCase(),
        fullName: (u.FullName || u.fullName || '').trim().toLowerCase()
      };
    }
    const s = String(u).trim().toLowerCase();
    return {
      email: s.includes('@') ? s : '',
      staffId: !s.includes('@') ? s : '',
      fullName: !s.includes('@') ? s : ''
    };
  };

  const fA = getFields(userA);

  if (typeof identifierOrUserB === 'object' && identifierOrUserB !== null) {
    const fB = getFields(identifierOrUserB);
    if (fA.email && fB.email && fA.email === fB.email) return true;
    if (fA.staffId && fB.staffId && fA.staffId === fB.staffId) return true;
    if (fA.fullName && fB.fullName && fA.fullName === fB.fullName) return true;
    return false;
  }

  // Primitive string comparison
  const str = String(identifierOrUserB).trim().toLowerCase();
  if (str.includes('@')) {
    return fA.email === str;
  }
  return (fA.staffId && fA.staffId === str) || (fA.fullName && fA.fullName === str);
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
  const idStr = (rawUser.Id ?? rawUser.id) != null ? String(rawUser.Id ?? rawUser.id).trim() : '';
  const dbRole = rawUser.Role ?? rawUser.role;

  // 1. Explicit Staff revocation override always takes precedence
  const isExplicitStaff = (idStr && staffSet.has(idStr)) || staffSet.has(email) || staffSet.has(fullName) || staffSet.has(staffId);
  if (isExplicitStaff) return 'Staff';

  // 2. Explicit Admin grant override or DB Admin
  const isExplicitAdmin = (idStr && adminSet.has(idStr)) || adminSet.has(email) || adminSet.has(fullName) || adminSet.has(staffId);
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

/**
 * Fast multi-identifier lookup index for staff records.
 * Resolves by numeric Id, or case-insensitive string alias (FullName, PreferredName, Email, StaffId).
 */
export function buildStaffIndex(staffList = []) {
  const byId = {};
  const byAlias = {};
  for (const s of (staffList || [])) {
    if (!s) continue;
    if (s.Id != null) byId[s.Id] = s;
    if (s.id != null) byId[s.id] = s;
    const aliases = [s.FullName, s.fullName, s.PreferredName, s.preferredName, s.Email, s.email, s.StaffId, s.staffId].filter(Boolean);
    for (const a of aliases) {
      byAlias[String(a).trim().toLowerCase()] = s;
    }
  }

  const find = (identifier, id) => {
    if (id != null && byId[id]) return byId[id];
    if (!identifier) return null;
    return byAlias[String(identifier).trim().toLowerCase()] || null;
  };

  return { byId, byAlias, find };
}

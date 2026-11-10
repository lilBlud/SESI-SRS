import { dataProvider } from './dataProvider';
import { extractUserTargets } from '../utils/rbac';

export async function getUserStreak(userOrIdentifiers) {
  const targets = extractUserTargets(userOrIdentifiers);
  const primary = targets[0] || '';
  if (!primary) return { streak: 0, dates: [] };
  return await dataProvider.getUserStreak(primary);
}

export async function recordUserActivity(userOrUsername) {
  const targets = extractUserTargets(userOrUsername);
  const primary = targets[0] || (typeof userOrUsername === 'string' ? userOrUsername : 'User');
  return await dataProvider.recordUserActivity(primary);
}

export async function getAllUsers() {
  return await dataProvider.getAllUsers();
}

export async function getUserProfile(usernameOrEmail) {
  if (!usernameOrEmail) return null;
  return await dataProvider.getUserProfile(usernameOrEmail);
}

export async function updateProfilePicture(usernameOrEmail, profilePicture) {
  return await dataProvider.updateProfilePicture(usernameOrEmail, profilePicture);
}

export async function updatePreferredName(userOrUsernameOrEmail, preferredName) {
  const username = typeof userOrUsernameOrEmail === 'object'
    ? (userOrUsernameOrEmail?.email || userOrUsernameOrEmail?.fullName || userOrUsernameOrEmail?.username)
    : String(userOrUsernameOrEmail || '');
  return await dataProvider.updatePreferredName(username, preferredName);
}

export async function updateUserProfileInfo(userOrUsernameOrEmail, { preferredName } = {}) {
  if (preferredName !== undefined) {
    return await updatePreferredName(userOrUsernameOrEmail, preferredName);
  }
  return { success: true };
}

export async function updateUserRole(targetUserOrId, newRole) {
  const id = typeof targetUserOrId === 'object' ? (targetUserOrId.id ?? targetUserOrId.Id) : targetUserOrId;
  return await dataProvider.updateUserRole(id, newRole);
}

export async function deleteUser(targetUserOrId) {
  const id = typeof targetUserOrId === 'object' ? (targetUserOrId.id ?? targetUserOrId.Id) : targetUserOrId;
  if (dataProvider.deleteUser) {
    return await dataProvider.deleteUser(id);
  }
  return { success: true };
}


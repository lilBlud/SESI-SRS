import { dataProvider } from './dataProvider';
import { extractUserTargets } from '../utils/rbac';

export async function getUserStreak(userOrIdentifiers) {
  const targets = extractUserTargets(userOrIdentifiers);
  if (targets.length === 0) return { streak: 0, dates: [] };
  const input = typeof userOrIdentifiers === 'object' && userOrIdentifiers !== null
    ? userOrIdentifiers
    : targets[0];
  return await dataProvider.getUserStreak(input);
}

export async function recordUserActivity(userOrUsername) {
  const targets = extractUserTargets(userOrUsername);
  if (targets.length === 0 && typeof userOrUsername !== 'string') {
    return { streak: 0, recorded: false };
  }
  return await dataProvider.recordUserActivity(userOrUsername || targets[0] || 'User');
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
    ? (userOrUsernameOrEmail?.fullName || userOrUsernameOrEmail?.preferredName || userOrUsernameOrEmail?.email || userOrUsernameOrEmail?.username)
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
  return await dataProvider.deleteUser(id);
}

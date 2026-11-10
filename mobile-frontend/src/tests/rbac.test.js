import { describe, it, expect } from 'vitest';
import { 
  DEFAULT_ADMIN_EMAILS, 
  resolveUserRole, 
  normalizeUser, 
  isExcludedLeaderboardAccount 
} from '../utils/rbac';

describe('RBAC & Role Resolution Rules', () => {
  it('correctly grants Admin to system admin emails', () => {
    for (const email of DEFAULT_ADMIN_EMAILS) {
      const role = resolveUserRole({ Email: email });
      expect(role).toBe('Admin');
    }
  });

  it('defaults non-admin users to Staff role', () => {
    const role = resolveUserRole({ Email: 'regular_staff@sesb.com.my', FullName: 'Staff Member' });
    expect(role).toBe('Staff');
  });

  it('normalizes user properties consistently', () => {
    const raw = {
      Id: 10,
      FullName: 'Test User',
      PreferredName: 'Tester',
      Email: 'TEST@SESB.COM.MY',
      Division: 'IDD',
      StaffId: '90001234',
      Role: 'Staff'
    };

    const normalized = normalizeUser(raw, 'Staff');
    expect(normalized.id).toBe(10);
    expect(normalized.fullName).toBe('Test User');
    expect(normalized.preferredName).toBe('Tester');
    expect(normalized.email.toLowerCase()).toBe('test@sesb.com.my');
    expect(normalized.division).toBe('IDD');
    expect(normalized.role).toBe('Staff');
  });

  it('excludes mock and test accounts from leaderboard', () => {
    expect(isExcludedLeaderboardAccount('demo user')).toBe(true);
    expect(isExcludedLeaderboardAccount('DEMO-001')).toBe(true);
    expect(isExcludedLeaderboardAccount('cameron')).toBe(true);
    expect(isExcludedLeaderboardAccount('Normal Staff')).toBe(false);
  });
});

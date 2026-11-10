import { describe, it, expect } from 'vitest';
import { getActiveProvider, dataProvider, IS_LOCAL_SSMS } from '../services/dataProvider';
import { ssmsProvider } from '../services/providers/ssms/ssmsProvider';
import { supabaseProvider } from '../services/providers/supabase/supabaseProvider';

describe('Dual-Database Provider Architecture', () => {
  it('identifies the active provider based on environment', () => {
    const active = getActiveProvider();
    if (IS_LOCAL_SSMS) {
      expect(active.name).toBe(ssmsProvider.name);
      expect(active).toBe(ssmsProvider);
    } else {
      expect(active.name).toBe(supabaseProvider.name);
      expect(active).toBe(supabaseProvider);
    }
  });

  it('both providers implement required domain interface methods', () => {
    const requiredMethods = [
      'checkHealth',
      'getInfographics',
      'getGlossary',
      'getQuizQuestions',
      'getQuizSummary',
      'getLeaderboard',
      'submitQuizAnswer',
      'getUserRecentAnswers',
      'getUserActiveMonths',
      'getUserStreak',
      'recordUserActivity',
      'getAllUsers',
      'getUserProfile',
      'updateProfilePicture',
      'updatePreferredName',
      'updateUserRole',
      'login',
      'signup',
      'getVisitorStats',
      'recordVisitor'
    ];

    for (const method of requiredMethods) {
      expect(typeof ssmsProvider[method]).toBe('function');
      expect(typeof supabaseProvider[method]).toBe('function');
    }
  });
});


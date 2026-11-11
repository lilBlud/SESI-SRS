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

  it('supabaseProvider executes query methods without ReferenceError', async () => {
    const summary = await supabaseProvider.getQuizSummary();
    expect(Array.isArray(summary)).toBe(true);

    const streakResult = await supabaseProvider.getUserStreak('non_existent_test_user');
    expect(streakResult).toHaveProperty('streak');
    expect(streakResult).toHaveProperty('dates');
  });

  it('getUserRecentAnswers fetches answers for staff record', async () => {
    const user = {
      id: 1,
      fullName: 'Ahmad Azib Danish Ahmad Sanusi',
      preferredName: 'developer',
      email: 'azibdanish66@gmail.com'
    };
    const answers = await supabaseProvider.getUserRecentAnswers(user.fullName, '');
    expect(answers.length).toBeGreaterThan(0);
    expect(answers[0]).toHaveProperty('questionText');
  });
});


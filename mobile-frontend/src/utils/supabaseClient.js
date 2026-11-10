/**
 * Backward-Compatible Facade
 * 
 * Re-exports domain operations from modular services in `src/services/`.
 * Ensures 100% backward compatibility with existing component imports (both unprefixed and Direct).
 */

import { supabase } from '../services/apiConfig';
import { 
  calculateStreakFromDates, 
  extractUserTargets, 
  isExcludedLeaderboardAccount 
} from './rbac';

import { getInfographics, getGlossary } from '../services/glossaryService';
import {
  getQuizQuestions,
  getLeaderboard,
  recordQuizAnswer,
  getAvailableQuizzesWithStatus,
  getUserMonthlyQuizStatus,
  getUserRecentAnswers,
  getUserActiveMonths,
  getUserScoreAndRank
} from '../services/quizService';
import {
  getUserStreak,
  recordUserActivity,
  getAllUsers,
  getUserProfile,
  updateProfilePicture,
  updatePreferredName,
  updateUserProfileInfo,
  updateUserRole,
  deleteUser
} from '../services/userService';
import { login, signup } from '../services/authService';
import { getVisitorStats, recordVisitor } from '../services/visitorService';

export {
  supabase,
  calculateStreakFromDates,
  extractUserTargets,
  isExcludedLeaderboardAccount,

  // Glossary
  getInfographics,
  getInfographics as getInfographicsDirect,
  getGlossary,
  getGlossary as getGlossaryDirect,

  // Quiz & Leaderboard
  getQuizQuestions,
  getQuizQuestions as getQuizQuestionsDirect,
  getLeaderboard,
  getLeaderboard as getLeaderboardDirect,
  recordQuizAnswer,
  recordQuizAnswer as recordQuizAnswerDirect,
  getAvailableQuizzesWithStatus,
  getAvailableQuizzesWithStatus as getAvailableQuizzesWithStatusDirect,
  getUserMonthlyQuizStatus,
  getUserMonthlyQuizStatus as getUserMonthlyQuizStatusDirect,
  getUserRecentAnswers,
  getUserRecentAnswers as getUserRecentAnswersDirect,
  getUserActiveMonths,
  getUserActiveMonths as getUserActiveMonthsDirect,
  getUserScoreAndRank,
  getUserScoreAndRank as getUserScoreAndRankDirect,

  // User & Streaks
  getUserStreak,
  getUserStreak as getUserStreakDirect,
  recordUserActivity,
  recordUserActivity as recordUserActivityDirect,
  getAllUsers,
  getAllUsers as getAllUsersDirect,
  getUserProfile,
  getUserProfile as getUserProfileDirect,
  updateProfilePicture,
  updateProfilePicture as updateProfilePictureDirect,
  updatePreferredName,
  updatePreferredName as updatePreferredNameDirect,
  updateUserProfileInfo,
  updateUserProfileInfo as updateUserProfileInfoDirect,
  updateUserRole,
  updateUserRole as updateUserRoleDirect,
  deleteUser,
  deleteUser as deleteUserDirect,

  // Auth
  login,
  login as loginDirect,
  signup,
  signup as signupDirect,

  // Visitor Stats
  getVisitorStats,
  getVisitorStats as getVisitorStatsDirect,
  recordVisitor,
  recordVisitor as recordVisitorDirect
};

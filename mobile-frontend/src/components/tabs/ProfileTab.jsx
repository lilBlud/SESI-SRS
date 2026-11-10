import React, { useState, useEffect } from 'react';
import { currentMonth } from '../../utils/constants';
import { 
  updateProfilePictureDirect, 
  updatePreferredNameDirect,
  getUserRecentAnswersDirect,
  getUserActiveMonthsDirect,
  getUserScoreAndRankDirect,
  extractUserTargets
} from '../../utils/supabaseClient';
import { EditPreferredNameModal } from '../modals';
import {
  ProfileHeroCard,
  ProfileStatsBadges,
  RecentQuestionsCarousel,
  BookmarksSection,
  ProfilePhotoPickerModal
} from './profile';

export function ProfileTab({ user, bookmarkActions, onUpdateUser }) {
  const { bookmarks, toggleBookmark } = bookmarkActions || { bookmarks: [], toggleBookmark: () => { } };
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [currentRank, setCurrentRank] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [loading, setLoading] = useState(() => Boolean(user));
  const [filterMonth, setFilterMonth] = useState(''); // empty = All time
  const [activeMonths, setActiveMonths] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const USERNAME = user?.fullName || user?.preferredName || user?.username || user?.email || "User";

  const handleSavePhoto = async (croppedBase64) => {
    setUploadingPhoto(true);
    try {
      const usernameTarget = user?.email || user?.fullName || USERNAME;
      await updateProfilePictureDirect(usernameTarget, croppedBase64);
      if (onUpdateUser) onUpdateUser({ profilePicture: croppedBase64 });
      setShowPhotoModal(false);
    } catch (err) {
      console.error("Profile picture upload error:", err);
      alert("Unable to save photo: " + (err.message || "Network error. Please try again."));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    setUploadingPhoto(true);
    try {
      const usernameTarget = user?.email || user?.fullName || USERNAME;
      await updateProfilePictureDirect(usernameTarget, '');
      if (onUpdateUser) onUpdateUser({ profilePicture: '' });
      setShowPhotoModal(false);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSavePreferredName = async (newName) => {
    const usernameTarget = user || user?.email || user?.fullName || USERNAME;
    await updatePreferredNameDirect(usernameTarget, newName);
    if (onUpdateUser) onUpdateUser({ preferredName: newName });
    const userIdentifiers = extractUserTargets(user || usernameTarget);
    getUserScoreAndRankDirect(userIdentifiers, currentMonth)
      .then(stats => {
        if (stats) {
          setCurrentRank(stats.rank);
          setTotalScore(stats.score);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    // Fetch available months for this user once
    const userIdentifiers = extractUserTargets(user || USERNAME);
    if (userIdentifiers.length === 0) return;
    getUserActiveMonthsDirect(userIdentifiers)
      .then(months => {
        const list = [...(months || [])];
        if (!list.includes(currentMonth)) {
          list.unshift(currentMonth);
        }
        setActiveMonths(list);
      })
      .catch(console.error);
  }, [USERNAME, user]);

  useEffect(() => {
    const userIdentifiers = extractUserTargets(user || USERNAME);
    if (userIdentifiers.length === 0) return;

    Promise.all([
      getUserRecentAnswersDirect(userIdentifiers, filterMonth).catch(() => []),
      getUserScoreAndRankDirect(userIdentifiers, currentMonth).catch(() => ({ score: 0, rank: null }))
    ])
      .then(([directAnswers, directStats]) => {
        setRecentQuizzes(directAnswers || []);
        if (directStats) {
          setCurrentRank(directStats.rank);
          setTotalScore(directStats.score);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn("Direct profile data fetch failed:", err);
        setLoading(false);
      });
  }, [filterMonth, USERNAME, user]);

  return (
    <div className="space-y-6 animate-slideUp">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">User Profile</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5 tracking-tight">My Activity &amp; Records</h1>
        </div>
      </div>

      {/* Responsive 2-column layout on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Identity Card & Stats Badges (Sticky on desktop) */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6 space-y-6">
          <ProfileHeroCard
            user={user}
            username={USERNAME}
            uploadingPhoto={uploadingPhoto}
            onOpenPhotoModal={() => setShowPhotoModal(true)}
            onOpenEditNameModal={() => setShowEditModal(true)}
          />

          <ProfileStatsBadges
            loading={loading}
            totalScore={totalScore}
            currentRank={currentRank}
          />
        </div>

        {/* Right Column: Recent Quizzes & Bookmarks */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <RecentQuestionsCarousel
            loading={loading}
            recentQuizzes={recentQuizzes}
            filterMonth={filterMonth}
            setFilterMonth={setFilterMonth}
            activeMonths={activeMonths}
          />

          <BookmarksSection
            bookmarks={bookmarks}
            toggleBookmark={toggleBookmark}
          />
        </div>
      </div>

      {/* Edit Preferred Name Modal */}
      <EditPreferredNameModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        currentName={user?.preferredName || ''}
        fullName={user?.fullName || USERNAME}
        onSave={handleSavePreferredName}
      />

      {/* Photo Picker Action Sheet & Instagram Cropper */}
      <ProfilePhotoPickerModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        user={user}
        username={USERNAME}
        uploadingPhoto={uploadingPhoto}
        onSavePhoto={handleSavePhoto}
        onRemovePhoto={handleRemovePhoto}
      />
    </div>
  );
}

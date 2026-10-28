import React, { useState, useEffect, useCallback } from 'react';
import { PostImageSlider, saveImage } from '../ui';
import { FullLeaderboardModal, ImageViewerModal, EditPreferredNameModal } from '../modals';
import { currentMonth, CATEGORIES, getColor } from '../../utils/constants';
import { getInfographicsDirect, getLeaderboardDirect, updatePreferredNameDirect } from '../../utils/supabaseClient';
import { HomeHeroBanner, HomeAdminTrafficCard, HomeLeaderboardPodium } from './home';

export function HomeTab({
  user,
  streak,
  glossary,
  setActiveTab,
  setActiveGlossaryCat,
  isDark,
  bookmarkActions,
  onUpdateUser,
  visitorStats,
  triggerInstallPrompt
}) {
  const { isBookmarked = () => false, toggleBookmark = () => {} } = bookmarkActions || {};
  const [posts, setPosts] = useState([]);
  const [postCat, setPostCat] = useState('All');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLb, setLoadingLb] = useState(true);
  const [showFullLb, setShowFullLb] = useState(false);
  const [imgViewerPost, setImgViewerPost] = useState(null); // { images, idx }
  const [showEditNameModal, setShowEditNameModal] = useState(false);

  const preferredName = (user?.preferredName || '').trim();
  const realFullName = (user?.fullName || user?.username || user?.email || 'User').trim();
  const greetingName = preferredName || realFullName.split(' ')[0] || 'User';
  const USERNAME = preferredName || realFullName;

  const postCatCounts = posts.reduce((acc, p) => {
    const c = p.category || 'General';
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});

  const filteredPosts = postCat === 'All' ? posts : posts.filter(p => (p.category || 'General') === postCat);

  const fetchLeaderboard = useCallback(() => {
    const applyPodium = (data) => {
      if (!data || data.length < 3) {
        data = [
          { username: "Cameron", displayName: "Cameron", score: 4201, division: "Sales Division", streak: 5 },
          { username: "Ka", displayName: "Ka", score: 3912, division: "HR Division", streak: 3 },
          { username: "Evelien", displayName: "Evelien", score: 2926, division: "IT Division", streak: 4 },
          { username: "QuizWiz", displayName: "QuizWiz", score: 2800, division: "Marketing", streak: 2 },
          { username: "CoolCat", displayName: "CoolCat", score: 2500, division: "Finance", streak: 6 },
          { username: "Ahmad", displayName: "Ahmad", score: 1920, division: "Strategic Planning", streak: 7 },
          { username: "Sarah", displayName: "Sarah", score: 1850, division: "Operations", streak: 1 },
          { username: "John", displayName: "John", score: 1500, division: "HR Division", streak: 2 }
        ];
      }
      setLeaderboard(data);
      setLoadingLb(false);
    };

    getLeaderboardDirect(currentMonth)
      .then(data => {
        applyPodium(data && data.length > 0 ? data : []);
      })
      .catch(err => {
        console.warn("Direct Supabase leaderboard fetch error:", err);
        applyPodium([]);
      });
  }, []);

  useEffect(() => {
    getInfographicsDirect()
      .then(data => {
        if (data && data.length > 0) {
          setPosts(data);
        }
      })
      .catch(err => {
        console.warn("Direct Supabase infographics fetch error:", err);
      });

    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const data = await getInfographicsDirect().catch(() => null);
      if (data && data.length > 0) setPosts(data);
      fetchLeaderboard();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  }, [fetchLeaderboard]);

  const handleSavePreferredName = async (newName) => {
    const usernameTarget = user || user?.email || user?.fullName || realFullName;
    await updatePreferredNameDirect(usernameTarget, newName);
    if (onUpdateUser) onUpdateUser({ preferredName: newName });
    fetchLeaderboard();
  };

  return (
    <div className="space-y-5 animate-slideUp">
      {/* ── Hero Banner ── */}
      <HomeHeroBanner
        greetingName={greetingName}
        isDark={isDark}
        onNavigateGlossary={() => setActiveTab('glossary')}
        onNavigateQuiz={() => setActiveTab('quiz')}
      />

      {/* ── Install App Banner (When in mobile browser) ── */}
      {typeof window !== 'undefined' && !window.matchMedia('(display-mode: standalone)').matches && !window.navigator.standalone && triggerInstallPrompt && (
        <div
          onClick={triggerInstallPrompt}
          className="cursor-pointer bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-blue-500/15 dark:from-emerald-950/50 dark:via-teal-950/40 dark:to-blue-950/50 border border-emerald-500/30 dark:border-emerald-500/40 rounded-2xl p-3.5 flex items-center justify-between shadow-xs hover:bg-emerald-500/20 transition-all group active:scale-[0.99]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-slate-200 dark:border-slate-700 shrink-0 shadow-md flex items-center justify-center p-0.5">
              <img src="/assets/logo.png" alt="SESI App Logo" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-black text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                Install SESI App on Phone
                <span className="text-[9px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-md">App</span>
              </div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
                Add to your Home Screen for faster access
              </div>
            </div>
          </div>
          <button
            type="button"
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-black rounded-xl shadow-sm transition-transform active:scale-95 shrink-0 ml-2"
          >
            Install
          </button>
        </div>
      )}

      {/* ── Visitors Today & Users Counter (Admin Only) ── */}
      <HomeAdminTrafficCard
        isAdmin={user?.role === 'Admin'}
        visitorStats={visitorStats}
        onOpenAdmin={() => setActiveTab && setActiveTab('admin')}
      />

      {/* ── Leaderboard on Home (Podium + Runners-up) ── */}
      <HomeLeaderboardPodium
        leaderboard={leaderboard}
        loadingLb={loadingLb}
        user={user}
        streak={streak}
        onViewAll={() => setShowFullLb(true)}
      />

      {/* ── Category Quick Access ── */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[32px] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-black/5 dark:ring-white/10">
        <h3 className="text-[13px] font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <span className="text-base">📂</span> Browse by Category
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.slice(1).map(cat => {
            const clr = getColor(cat.key);
            return (
              <button
                key={cat.key}
                onClick={() => {
                  if (setActiveGlossaryCat) setActiveGlossaryCat(cat.key);
                  setActiveTab('glossary');
                }}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-left transition-all active:scale-95 hover:shadow-md ${clr.bg} border ${clr.border}`}
              >
                <div className="w-6 flex items-center justify-center shrink-0">
                  {cat.iconImage ? (
                    <img src={cat.iconImage} alt={cat.label} className="h-6 w-auto object-contain scale-[1.5]" />
                  ) : (
                    <span className="text-lg">{cat.emoji}</span>
                  )}
                </div>
                <span className={`text-[11px] font-bold ${clr.text} leading-tight`}>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Posts Section ── */}
      <div id="posts" className="scroll-mt-28 space-y-4">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-[13px] font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-base">📰</span> Latest Posts
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-bold flex items-center gap-1 active:scale-95 transition"
              title="Refresh feed and leaderboard"
            >
              <svg className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{isRefreshing ? 'Updating...' : 'Refresh'}</span>
            </button>
            <span className="text-xs font-semibold text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-md">
              {filteredPosts.length} posts
            </span>
          </div>
        </div>

        {/* Post Category Dropdown */}
        <div className="px-4 mb-2">
          <div className="relative">
            <select
              value={postCat}
              onChange={(e) => setPostCat(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[13px] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            >
              {CATEGORIES.map(c => {
                const count = c.key === 'All' ? posts.length : (postCatCounts[c.key] || 0);
                return (
                  <option key={c.key} value={c.key}>
                    {c.emoji} {c.label} ({count})
                  </option>
                );
              })}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        {filteredPosts.map(post => {
          const allImages = [];
          if (post.imageUrl) allImages.push(post.imageUrl);
          if (post.additionalImages) {
            try {
              const parsed = typeof post.additionalImages === 'string' ? JSON.parse(post.additionalImages) : post.additionalImages;
              if (Array.isArray(parsed)) allImages.push(...parsed);
            } catch (e) { }
          }

          const hasImages = allImages.length > 0;
          const bookmarked = isBookmarked(post, 'poster');
          const dateStr = post.postedAt ? new Date(post.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
          const clr = getColor(post.category || 'General');

          return (
            <div
              key={post.id}
              className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[32px] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-black/5 dark:ring-white/10 relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="pr-12">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${clr.text} mb-1 flex items-center gap-1.5`}>
                    <span className="text-sm">{clr.emoji}</span> {post.category || 'General'}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{post.title}</h2>
                  {dateStr && <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">{dateStr}</p>}
                </div>

                {/* Bookmark Toggle */}
                <button
                  onClick={() => toggleBookmark(post, 'poster')}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 absolute top-5 right-5 ${
                    bookmarked
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                  title={bookmarked ? "Remove bookmark" : "Bookmark this poster"}
                >
                  <svg className="w-4 h-4" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>

              {post.description && (
                <p className="mt-2 text-[13px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-4">
                  {post.description}
                </p>
              )}

              {/* Responsive Post Image Slider */}
              {hasImages && (
                <div className="space-y-2">
                  <PostImageSlider
                    images={allImages}
                    title={post.title}
                    onImageClick={(idx) => setImgViewerPost({ images: allImages, idx })}
                  />
                </div>
              )}

              {/* Action Buttons: Save Image */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {hasImages && (
                    <button
                      onClick={() => saveImage(allImages[0], `${post.title.replace(/\s+/g, '_')}.png`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-bold rounded-xl transition-all active:scale-95"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Save Image
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                  <span>💡</span>
                  <span>SESI Update</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Modal */}
      <FullLeaderboardModal
        isOpen={showFullLb}
        onClose={() => setShowFullLb(false)}
        leaderboard={leaderboard}
        user={user}
        streak={streak}
        onOpenEditName={() => setShowEditNameModal(true)}
      />

      {/* Fullscreen Image Viewer Modal */}
      <ImageViewerModal
        isOpen={Boolean(imgViewerPost)}
        onClose={() => setImgViewerPost(null)}
        images={imgViewerPost?.images || []}
        initialIndex={imgViewerPost?.idx || 0}
      />

      {/* Edit Preferred Name Modal */}
      <EditPreferredNameModal
        isOpen={showEditNameModal}
        onClose={() => setShowEditNameModal(false)}
        currentName={user?.preferredName || ''}
        fullName={user?.fullName || USERNAME}
        onSave={handleSavePreferredName}
      />
    </div>
  );
}

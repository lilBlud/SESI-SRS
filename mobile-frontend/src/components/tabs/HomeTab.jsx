import React, { useState, useEffect, useCallback } from 'react';
import { PostImageSlider, saveImage } from '../ui';
import { FullLeaderboardModal, ImageViewerModal, EditPreferredNameModal } from '../modals';
import { currentMonth, CATEGORIES, getColor } from '../../utils/constants';
import { getInfographicsDirect, getLeaderboardDirect, updatePreferredNameDirect } from '../../utils/supabaseClient';
import { HomeHeroBanner, HomeAdminTrafficCard, HomeLeaderboardPodium } from './home';

export function HomeTab({
  user,
  streak,
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
    getLeaderboardDirect(currentMonth)
      .then(data => {
        setLeaderboard(Array.isArray(data) ? data : []);
        setLoadingLb(false);
      })
      .catch(err => {
        console.warn("Direct Supabase leaderboard fetch error:", err);
        setLeaderboard([]);
        setLoadingLb(false);
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
    <div className="animate-slideUp">
      {/* ─── TOP SECTION: Welcome Banner & Admin Traffic Card (Always Level & Equal Top Alignment) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch mb-6">
        <div className={user?.role === 'Admin' ? "lg:col-span-8 2xl:col-span-7 flex flex-col" : "lg:col-span-12"}>
          <HomeHeroBanner
            greetingName={greetingName}
            isDark={isDark}
            onNavigateGlossary={() => setActiveTab('glossary')}
            onNavigateQuiz={() => setActiveTab('quiz')}
          />
        </div>
        {user?.role === 'Admin' && (
          <div className="hidden lg:flex lg:col-span-4 2xl:col-span-5 flex-col">
            <HomeAdminTrafficCard
              isAdmin={true}
              visitorStats={visitorStats}
              onOpenAdmin={() => setActiveTab && setActiveTab('admin')}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ─── LEFT COLUMN: Feed, Categories, Posts (8 cols on desktop, 7 on 2xl) ─── */}
        <div className="lg:col-span-8 2xl:col-span-7 space-y-6">
          {/* ── Install App Banner (MOBILE ONLY: hidden on desktop >= 1024px) ── */}
          {typeof window !== 'undefined' && !window.matchMedia('(display-mode: standalone)').matches && !window.navigator.standalone && triggerInstallPrompt && (
            <div
              onClick={triggerInstallPrompt}
              className="lg:hidden cursor-pointer bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-blue-500/15 dark:from-emerald-950/50 dark:via-teal-950/40 dark:to-blue-950/50 border border-emerald-500/30 dark:border-emerald-500/40 rounded-2xl p-3.5 flex items-center justify-between shadow-xs hover:bg-emerald-500/20 transition-all group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-slate-200 dark:border-slate-700 shrink-0 shadow-md flex items-center justify-center p-0.5">
                  <img src="/assets/logo.png" alt="SESI App Logo" className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-slate-900 dark:text-white leading-snug flex items-center gap-1.5">
                    Install SESI App on Phone
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded-md">App</span>
                  </div>
                  <div className="text-[11.5px] font-normal text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    Add to your Home Screen for faster access
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold tracking-tight rounded-xl shadow-sm transition-transform active:scale-95 shrink-0 ml-2"
              >
                Install
              </button>
            </div>
          )}

          {/* ── MOBILE-ONLY: Leaderboard & Admin Traffic (Retaining 100% Mobile Order) ── */}
          <div className="lg:hidden space-y-5">
            <HomeAdminTrafficCard
              isAdmin={user?.role === 'Admin'}
              visitorStats={visitorStats}
              onOpenAdmin={() => setActiveTab && setActiveTab('admin')}
            />
            <HomeLeaderboardPodium
              leaderboard={leaderboard}
              loadingLb={loadingLb}
              user={user}
              streak={streak}
              onViewAll={() => setShowFullLb(true)}
              onTakeQuiz={() => setActiveTab('quiz')}
            />
          </div>

          {/* ── Category Quick Access (Symmetrical multi-column grid) ── */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[32px] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-black/5 dark:ring-white/10">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-base sm:text-lg">📂</span> Browse by Category
              </h3>
              <span className="text-xs lg:text-[13px] font-semibold text-slate-400 dark:text-slate-500">
                {CATEGORIES.slice(1).length} Domains
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-2.5 sm:gap-3">
              {CATEGORIES.slice(1).map(cat => {
                const clr = getColor(cat.key);
                return (
                  <button
                    key={cat.key}
                    onClick={() => {
                      if (setActiveGlossaryCat) setActiveGlossaryCat(cat.key);
                      setActiveTab('glossary');
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl text-left transition-all duration-200 active:scale-95 hover:-translate-y-0.5 hover:shadow-md ${clr.bg} border ${clr.border} min-w-0 overflow-hidden`}
                  >
                    <div className="w-6 flex items-center justify-center shrink-0">
                      {cat.iconImage ? (
                        <img src={cat.iconImage} alt={cat.label} className="h-6 w-auto object-contain scale-[1.3]" />
                      ) : (
                        <span className="text-lg">{cat.emoji}</span>
                      )}
                    </div>
                    <span className={`text-xs sm:text-[12.5px] lg:text-[13px] font-bold ${clr.text} leading-snug break-words min-w-0 flex-1 hyphens-auto`}>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Posts Section (Responsive 2-Column Grid on Desktop) ── */}
          <div id="posts" className="scroll-mt-28 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-base sm:text-lg">📰</span> Latest Regulatory Updates &amp; Posts
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 active:scale-95 transition disabled:opacity-50 border border-slate-200/60 dark:border-slate-700/60"
                  title="Refresh feed and leaderboard"
                  aria-label="Refresh feed and leaderboard"
                >
                  <svg className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : 'transition-transform duration-300 hover:rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <span className="text-xs lg:text-[13px] font-bold text-slate-600 dark:text-slate-300 bg-slate-200/70 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg tabular-nums">
                  {filteredPosts.length} posts
                </span>
              </div>
            </div>

            {/* Post Category Filter */}
            <div className="relative">
              <select
                value={postCat}
                onChange={(e) => setPostCat(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 font-semibold text-sm lg:text-base rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
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

            {/* Posts Grid: 1 column on mobile, 2 columns on widescreen */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-stretch">
              {filteredPosts.map(post => {
                const allImages = [];
                if (post.imageUrl) allImages.push(post.imageUrl);
                if (post.additionalImages) {
                  try {
                    const parsed = typeof post.additionalImages === 'string' ? JSON.parse(post.additionalImages) : post.additionalImages;
                    if (Array.isArray(parsed)) allImages.push(...parsed);
                  } catch { }
                }

                const hasImages = allImages.length > 0;
                const bookmarked = isBookmarked(post, 'poster');
                const dateStr = post.postedAt ? new Date(post.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
                const clr = getColor(post.category || 'General');

                return (
                  <div
                    key={post.id}
                    className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[32px] p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-black/5 dark:ring-white/10 relative overflow-hidden transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Consistent Header Area with Standardized Height */}
                      <div className="flex justify-between items-start mb-3 min-h-[64px] sm:min-h-[72px]">
                        <div className="pr-12">
                          <span className={`text-[10.5px] font-bold uppercase tracking-wider ${clr.text} mb-1 flex items-center gap-1.5`}>
                            <span className="text-sm">{clr.emoji}</span> {post.category || 'General'}
                          </span>
                          <h2 className="text-[17px] sm:text-[18px] font-extrabold text-slate-900 dark:text-white leading-snug tracking-tight line-clamp-2">{post.title}</h2>
                          {dateStr && <p className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">{dateStr}</p>}
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

                      {/* Responsive Post Image Slider - positioned directly below the header */}
                      {hasImages && (
                        <div className="space-y-2 mb-3">
                          <PostImageSlider
                            images={allImages}
                            title={post.title}
                            onImageClick={(idx) => setImgViewerPost({ images: allImages, idx })}
                          />
                        </div>
                      )}

                      {/* Description / Caption placed cleanly below the poster image */}
                      {post.description && (
                        <p className="mt-2 text-[13px] sm:text-[13.5px] text-slate-700 dark:text-slate-300 font-normal leading-relaxed mb-3">
                          {post.description}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons: Save Image */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {hasImages && (
                          <button
                            onClick={() => saveImage(allImages[0], `${post.title.replace(/\s+/g, '_')}.png`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11.5px] font-semibold rounded-xl transition-all active:scale-95"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Save Image
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] font-semibold tracking-normal">
                        <span>💡</span>
                        <span>SESI Regulatory Insight</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN: Sticky Leaderboard & Quick Widgets (4 cols on desktop, 5 on 2xl) ─── */}
        <div className="hidden lg:block lg:col-span-4 2xl:col-span-5 lg:sticky lg:top-6 space-y-6">
          {/* Leaderboard Podium with Compact & Actionable Empty State */}
          <HomeLeaderboardPodium
            leaderboard={leaderboard}
            loadingLb={loadingLb}
            user={user}
            streak={streak}
            onViewAll={() => setShowFullLb(true)}
            onTakeQuiz={() => setActiveTab('quiz')}
          />

          {/* Daily Streak & Challenge Widget */}
          <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent dark:from-emerald-950/40 dark:via-slate-900/60 dark:to-slate-900/90 rounded-[28px] p-5 ring-1 ring-emerald-500/20 dark:ring-emerald-500/30 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🔥</span>
                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Daily Learning Goal</span>
              </div>
              <span className="text-xs lg:text-[13px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-3 py-1 rounded-full">
                {streak > 0 ? `${streak} Day Streak` : 'Start Today'}
              </span>
            </div>
            <p className="text-xs sm:text-sm lg:text-[14.5px] text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Complete today's quiz challenge or browse 3 glossary terms to maintain your daily streak!
            </p>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setActiveTab('quiz')}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm lg:text-[14px] font-bold rounded-xl shadow-sm transition-all text-center active:scale-95"
              >
                Start Daily Quiz ⚡
              </button>
              <button
                onClick={() => setActiveTab('glossary')}
                className="py-3 px-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm lg:text-[14px] font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-center active:scale-95"
              >
                📖 Terms
              </button>
            </div>
          </div>

          {/* About SESB / SESI Info Card */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[28px] p-5 ring-1 ring-black/5 dark:ring-white/10 shadow-sm text-xs space-y-3 text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-emerald-500 text-white flex items-center justify-center font-black text-xs">
                S
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-sm lg:text-base">About SESI SRS</span>
            </div>
            <p className="leading-relaxed text-xs lg:text-[13.5px]">
              Sabah Electricity Supply Industry (SESI) Standard &amp; Regulatory System provides unified standards, formula calculations, and corporate performance metrics across Sabah's power grid.
            </p>
            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs lg:text-[12.5px] text-slate-400">
              <span>Future Gen 2026</span>
              <span className="text-emerald-500 font-semibold">SESB Official</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Leaderboard Modal */}
      <FullLeaderboardModal
        isOpen={showFullLb}
        onClose={() => setShowFullLb(false)}
        leaderboard={leaderboard}
        user={user}
        streak={streak}
        isDark={isDark}
        onEditNameClick={() => setShowEditNameModal(true)}
      />

      {/* Fullscreen Image Viewer Modal */}
      <ImageViewerModal
        isOpen={Boolean(imgViewerPost)}
        onClose={() => setImgViewerPost(null)}
        images={imgViewerPost?.images || []}
        currentIndex={imgViewerPost?.idx || 0}
        onChangeIndex={(newIdx) => setImgViewerPost(prev => prev ? ({ ...prev, idx: newIdx }) : null)}
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

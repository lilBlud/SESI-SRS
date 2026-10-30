import React from 'react';
import { createPortal } from 'react-dom';
import { LeaderboardAvatar } from '../ui';
import { extractUserTargets } from '../../utils/supabaseClient';

const DEFAULT_MEDALS = ['🥇', '🥈', '🥉'];

export function FullLeaderboardModal({
  isOpen,
  onClose,
  leaderboard = [],
  user,
  streak = 0,
  isDark = false,
  onEditNameClick
}) {
  if (!isOpen) return null;

  const userTargets = extractUserTargets(user);
  const currentDisplayName = user?.preferredName || user?.fullName || user?.username || user?.email || "User";
  const realFullName = user?.fullName || user?.username || user?.email || "User";

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex justify-center bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[430px] h-[100vh] flex flex-col bg-slate-100 dark:bg-slate-900 shadow-2xl relative overflow-hidden border-x border-slate-200/50 dark:border-slate-800 animate-slideUp text-slate-900 dark:text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Background Pattern */}
        <img
          src={isDark ? '/assets/hd_dark_topo.jpg' : '/assets/hd_light_topo.jpg'}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover object-center -z-20 pointer-events-none opacity-40 dark:opacity-20"
        />
        {isDark && <div className="absolute inset-0 bg-slate-950/40 -z-10 pointer-events-none"></div>}

        {/* Mobile Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-4 pb-4 pt-[max(env(safe-area-inset-top),24px)] flex items-center shadow-md z-10 relative shrink-0">
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white active:scale-95 transition-all shrink-0" 
            aria-label="Go back"
          >
            <span className="text-xl leading-none font-bold">←</span>
          </button>
          <div className="flex-1 text-center pr-8">
            <h2 className="text-[17px] font-black text-white leading-tight">Full Leaderboard</h2>
            <p className="text-[11px] text-white/80 font-medium">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Scrollable Leaderboard List */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-[max(env(safe-area-inset-bottom),24px)] space-y-3 custom-scrollbar">
          {/* Preferred Name Banner */}
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl p-3 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <LeaderboardAvatar
                entry={{ 
                  username: realFullName, 
                  displayName: currentDisplayName, 
                  profilePicture: user?.profilePicture 
                }}
                user={user}
                currentStreak={streak}
                sizeClass="w-9 h-9"
                textClass="text-[12px] font-black text-white"
                bgClass="bg-gradient-to-br from-emerald-400 to-teal-500"
              />
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Your Leaderboard Profile</div>
                <div className="text-[13px] font-black text-slate-800 dark:text-white truncate">
                  {currentDisplayName}
                </div>
                {user?.preferredName && user?.preferredName !== realFullName && (
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                    {realFullName}
                  </div>
                )}
              </div>
            </div>
            {onEditNameClick && (
              <button
                onClick={onEditNameClick}
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-[11px] rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-1 shrink-0"
              >
                <span>✏️</span> Edit Name
              </button>
            )}
          </div>

          {leaderboard.map((entry, idx) => {
            const isMe = user && userTargets.length > 0 && (
              (entry.staffId && user?.id && String(entry.staffId) === String(user.id)) ||
              (entry.username && userTargets.includes(entry.username.trim().toLowerCase())) ||
              (entry.displayName && userTargets.includes(entry.displayName.trim().toLowerCase())) ||
              (entry.aliases && entry.aliases.some(a => userTargets.includes(a)))
            );
            const displayName = entry.displayName || entry.username;
            return (
              <div key={idx} className={`px-4 py-3 rounded-2xl flex items-center gap-3 transition-all shadow-sm ${
                idx === 0 ? 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border border-amber-200/50 dark:border-amber-800/50' :
                idx === 1 ? 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50' :
                idx === 2 ? 'bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/30' :
                isMe ? 'bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800' :
                'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700'
              }`}>
                <div className="text-2xl font-black w-8 text-center shrink-0">
                  {idx < 3 ? DEFAULT_MEDALS[idx] : <span className="text-sm font-bold text-slate-400">#{idx + 1}</span>}
                </div>
                <LeaderboardAvatar
                  entry={entry}
                  user={user}
                  currentStreak={streak}
                  sizeClass="w-9 h-9"
                  textClass="text-[11px] font-black text-slate-700 dark:text-slate-200"
                  bgClass={
                    idx === 0 ? "bg-gradient-to-br from-yellow-300 to-amber-500 text-white" :
                    idx === 1 ? "bg-gradient-to-br from-slate-200 to-slate-400 text-slate-800" :
                    idx === 2 ? "bg-gradient-to-br from-orange-300 to-orange-500 text-white" :
                    "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600"
                  }
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="font-bold text-[14px] truncate text-slate-900 dark:text-white">{displayName}</p>
                    {isMe && <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">You</span>}
                    {isMe && onEditNameClick && (
                      <button
                        onClick={onEditNameClick}
                        className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-0.5 ml-1"
                      >
                        ✏️ Edit
                      </button>
                    )}
                  </div>
                  {displayName !== entry.username && (
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                      {entry.username}
                    </div>
                  )}
                  <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1.5 truncate">
                    <span>{entry.division}</span>
                  </div>
                </div>
                <div className="font-black text-emerald-600 dark:text-emerald-400 text-[15px] whitespace-nowrap shrink-0">
                  {entry.score} <span className="text-[10px] text-slate-400 font-semibold">pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}

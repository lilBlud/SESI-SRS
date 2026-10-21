import React, { useState } from 'react';
import { extractUserTargets } from '../../utils/supabaseClient';

export function LeaderboardAvatar({
  entry,
  user,
  currentStreak = 0,
  sizeClass = "w-10 h-10",
  textClass = "text-[14px]",
  bgClass = "bg-gradient-to-br from-slate-200 to-slate-400 text-slate-800",
  shadowClass = "shadow-slate-400/40",
  delayClass = "",
  isPodium = false
}) {
  const [imgErr, setImgErr] = useState(false);

  const userTargets = extractUserTargets(user);
  const isMe = entry && userTargets.length > 0 && (
    (entry.username && userTargets.includes(entry.username.trim().toLowerCase())) ||
    (entry.displayName && userTargets.includes(entry.displayName.trim().toLowerCase()))
  );

  const pic = !imgErr && (entry?.profilePicture || (isMe ? user?.profilePicture : null));
  const initials = (entry?.displayName || entry?.username || '??').substring(0, 2).toUpperCase();

  const streakCount = typeof entry?.streak === 'number'
    ? entry.streak
    : (isMe && typeof currentStreak === 'number' ? currentStreak : 0);

  if (isPodium) {
    return (
      <div className={`relative inline-flex items-center justify-center z-10 -mb-5 shrink-0 animate-bounce-slow ${delayClass}`}>
        <div
          className={`${sizeClass} rounded-full flex items-center justify-center font-black ${textClass} shadow-lg border-2 border-white dark:border-slate-900 ${bgClass} ${shadowClass} overflow-hidden p-0.5`}
        >
          {pic ? (
            <img
              src={pic}
              alt={entry.displayName || entry.username}
              className="w-full h-full object-cover rounded-full"
              onError={() => setImgErr(true)}
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        {/* Small Streak Icon on Top-Right */}
        <div
          className={`absolute -top-0.5 -right-3 rounded-full px-1.5 h-[15px] text-[8px] font-black flex items-center justify-center gap-0.5 shadow-xs border border-white dark:border-slate-800 z-30 pointer-events-none select-none ${
            streakCount > 0
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
          }`}
          title={`${streakCount}-day streak`}
        >
          <span className="text-[7.5px] leading-none">🔥</span>
          <span className="leading-none text-[8px] font-black">{streakCount}</span>
        </div>
      </div>
    );
  }

  // Row / List item avatar
  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <div
        className={`${sizeClass} rounded-full flex items-center justify-center font-black ${textClass} shrink-0 border border-slate-200 dark:border-slate-700 overflow-hidden ${bgClass} shadow-xs p-0.5`}
      >
        {pic ? (
          <img
            src={pic}
            alt={entry?.displayName || entry?.username}
            className="w-full h-full object-cover rounded-full"
            onError={() => setImgErr(true)}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {/* Small Streak Icon on Top-Right */}
      <div
        className={`absolute -top-0.5 -right-2 rounded-full px-1 h-3 text-[7px] font-black flex items-center justify-center gap-0.5 shadow-xs border border-white dark:border-slate-800 z-20 pointer-events-none select-none ${
          streakCount > 0
            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
        }`}
        title={`${streakCount}-day streak`}
      >
        <span className="text-[6.5px] leading-none">🔥</span>
        <span className="leading-none text-[7px] font-black">{streakCount}</span>
      </div>
    </div>
  );
}

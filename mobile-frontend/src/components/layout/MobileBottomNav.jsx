import React from 'react';
import { HomeIcon, BookIcon, QuizIcon, ProfileIcon } from '../ui';

const MOBILE_TABS = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'glossary', label: 'Dictionary', Icon: BookIcon },
  { id: 'quiz', label: 'Hub', Icon: QuizIcon },
  { id: 'profile', label: 'Profile', Icon: ProfileIcon },
];

/**
 * Fixed bottom tab bar for mobile viewports (< 1024px).
 */
export default function MobileBottomNav({ activeTab, setActiveTab }) {
  return (
    <nav className="lg:hidden app-shell-fixed-bottom bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 z-50 pb-3">
      <div className="flex items-center justify-around h-[68px] px-2">
        {MOBILE_TABS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center justify-center w-[68px] h-[60px] mx-1 rounded-2xl transition-all duration-150 active:scale-95 ${
                isActive ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'opacity-65 hover:opacity-90'
              }`}
            >
              <div className={`flex flex-col items-center justify-center gap-1.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                <Icon active={isActive} />
                <span className="text-[11px] font-semibold leading-none tracking-tight">{label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

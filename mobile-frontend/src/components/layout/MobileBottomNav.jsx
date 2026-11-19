import React from 'react';
import { m } from 'motion/react';
import { HomeIcon, BookIcon, QuizIcon, ProfileIcon } from '../ui';
import { SPRING_PILL } from '../../utils/motionConfig';

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
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center w-[68px] h-[60px] mx-1 rounded-2xl transition-colors duration-150 active:scale-95 ${
                isActive ? '' : 'opacity-65 hover:opacity-90'
              }`}
            >
              {isActive && (
                <m.span
                  layoutId="mobile-nav-pill"
                  transition={SPRING_PILL}
                  className="absolute inset-0 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-500/15"
                  aria-hidden="true"
                />
              )}
              <div className={`relative z-10 flex flex-col items-center justify-center gap-1.5 transition-colors duration-150 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
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

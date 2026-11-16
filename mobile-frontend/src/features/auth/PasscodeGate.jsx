import React, { useState } from 'react';
import { TopographicBackground } from '../../components/layout';

const VALID_PASSCODES = [
  'sesb2026',
  'sesi2026',
  'sesb123',
  'sesi123',
  'pilot2026',
  'sesb',
  'idd2026'
];

export default function PasscodeGate({ onUnlock, isDark = false }) {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleUnlock = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const cleaned = passcode.trim().toLowerCase();

    if (!cleaned) {
      setError('Please enter the pilot access passcode.');
      triggerShake();
      return;
    }

    const envPass = (import.meta.env.VITE_PILOT_PASSCODE || '').trim().toLowerCase();
    const isValid = VALID_PASSCODES.includes(cleaned) || (envPass && cleaned === envPass);

    if (isValid) {
      setError('');
      if (onUnlock) onUnlock();
    } else {
      setError('Invalid passcode. Please enter the authorized pilot passcode.');
      triggerShake();
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 450);
  };

  return (
    <div
      className={`relative isolate app-shell-frame min-h-[100dvh] overflow-y-auto overflow-x-hidden flex flex-col justify-between px-5 py-8 sm:py-12 font-sans select-none transition-colors duration-200 ${
        isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Crisp Vector Topographic Background */}
      <TopographicBackground isDark={isDark} />

      {/* Top Spacer */}
      <div className="pt-1" aria-hidden="true" />

      {/* Centered Content Column */}
      <div className="relative z-10 w-full max-w-md mx-auto my-auto flex flex-col items-center">
        {/* Brand Logo Lockup (Outside Card Box) */}
        <div className="flex flex-col items-center text-center mb-7 shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white border border-slate-200/90 dark:border-slate-700 p-3 shadow-md flex items-center justify-center mb-3.5">
            <img
              src="/assets/logo.png"
              alt="SESI Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
            SESI INSIGHT
          </span>
          <span className="text-sm sm:text-base font-semibold text-emerald-600 dark:text-emerald-400 mt-1.5">
            Sabah Electricity Supply Industry
          </span>
        </div>

        {/* Security Card */}
        <div
          className={`w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl transition-transform ${
            isShaking ? 'translate-x-1' : ''
          }`}
        >
          {/* Card Heading + Environment Badge */}
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                SESI Access
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Restricted to authorized Sabah Electricity staff. Enter the pilot passcode to proceed.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/70 dark:border-emerald-800/60 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 shrink-0">
              <svg
                className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                />
              </svg>
              <span>Pilot Gate</span>
            </span>
          </div>

          {/* Passcode Form */}
          <form onSubmit={handleUnlock} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Security Passcode
              </label>
              <div className="relative">
                {/* Key Icon */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>

                <input
                  type={showPasscode ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter pilot passcode"
                  className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-[13px] transition-colors"
                  autoComplete="current-password"
                  autoFocus
                />

                {/* Eye Toggle Icon */}
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none transition-colors"
                  aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
                >
                  {showPasscode ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 dark:border-rose-800/70 bg-rose-50 dark:bg-rose-950/40 px-3.5 py-2.5 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-start gap-2"
              >
                <svg
                  className="w-4 h-4 shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 mt-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Unlock SESI</span>
              <svg className="w-4 h-4 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="relative z-10 pt-6 pb-1 text-center">
        <div className="inline-flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <svg
            className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            />
          </svg>
          <span>Sabah Electricity Sdn. Bhd. • Internal Staging</span>
        </div>
      </div>
    </div>
  );
}

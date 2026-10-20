import React, { useState } from 'react';

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

    // Check against configured valid passcodes
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
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    <div className={`relative w-full max-w-[430px] mx-auto min-h-[100dvh] overflow-hidden flex flex-col justify-between px-5 py-8 font-sans shadow-2xl select-none transition-colors duration-200 ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* ── Hardware Accelerated HD Topographic Background (SESI signature) ── */}
      <img
        src={isDark ? '/assets/hd_dark_topo.jpg' : '/assets/hd_light_topo.jpg'}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover object-center -z-20 pointer-events-none"
      />
      {/* Light/Dark Contrast Overlay */}
      <div className="absolute inset-0 bg-white/70 dark:bg-slate-950/75 -z-10 pointer-events-none"></div>

      {/* Subtle Ambient Emerald Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] h-[320px] bg-gradient-to-b from-emerald-500/15 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Spacer / Safe Area */}
      <div className="pt-2"></div>

      {/* Central Content Card */}
      <div className={`relative z-10 w-full my-auto ${isShaking ? 'animate-bounce' : ''}`}>
        <div className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-[32px] p-6 sm:p-7 shadow-[0_16px_45px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center">

          {/* Logo Card */}
          <div className="w-24 h-24 sm:w-26 sm:h-26 bg-white rounded-[24px] p-2.5 shadow-md border border-slate-200/80 flex items-center justify-center mb-5 transition-transform hover:scale-105 shrink-0">
            <img
              src="/assets/sabah_electricity_logo.png"
              alt="Sabah Electricity"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = '/assets/logo.png';
              }}
            />
          </div>

          {/* Pilot Environment Badge (Emerald brand themed) */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold mb-3.5 shadow-2xs">
            <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Confidential Pilot Environment</span>
          </div>

          {/* Title: SESI Access */}
          <div className="mb-2">
            <h1 className="text-[26px] sm:text-[28px] font-black tracking-tight leading-tight text-slate-900 dark:text-white">
              <span className="text-emerald-600 dark:text-emerald-400">SESI</span> Access
            </h1>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-tight mt-0.5">
              Sabah Electricity Supply Industry
            </p>
          </div>

          {/* Description */}
          <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-[290px] mx-auto mb-6 font-medium">
            This internal prototype is restricted to authorized Sabah Electricity staff. Please enter the pilot access passcode to proceed.
          </p>

          {/* Form Container */}
          <form onSubmit={handleUnlock} className="w-full space-y-4">
            <div className="text-left space-y-1.5">
              <label className="text-[12px] font-bold text-slate-700 dark:text-slate-200 block pl-0.5">
                Security Passcode
              </label>
              <div className="relative">
                {/* Key Icon */}
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>

                {/* Input with SESI Brand Focus & Border */}
                <input
                  type={showPasscode ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter pilot passcode"
                  className="w-full pl-10 pr-11 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl text-[14px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/80 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition-all shadow-inner"
                  autoComplete="current-password"
                  autoFocus
                />

                {/* Eye Toggle Icon */}
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  tabIndex="-1"
                  aria-label={showPasscode ? "Hide passcode" : "Show passcode"}
                >
                  {showPasscode ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {error && (
                <p className="text-[11px] text-rose-500 dark:text-rose-400 font-semibold pt-1 flex items-center gap-1">
                  <span>⚠️</span> {error}
                </p>
              )}
            </div>

            {/* Unlock SESI Button (SESI brand gradient) */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-[14px] rounded-2xl shadow-lg shadow-emerald-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Unlock SESI</span>
              <svg className="w-4 h-4 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="relative z-10 pt-4 pb-2 text-center">
        <div className="inline-flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Sabah Electricity Sdn. Bhd. • Internal Staging</span>
        </div>
      </div>
    </div>
  );
}

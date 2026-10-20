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

export default function PasscodeGate({ onUnlock }) {
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
    <div className="relative w-full max-w-[430px] mx-auto min-h-[100dvh] bg-[#0B132B] text-slate-100 flex flex-col justify-between px-6 py-8 font-sans shadow-2xl overflow-y-auto scrollbar-hide select-none">
      {/* Background Subtle Gradient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-gradient-to-b from-blue-600/15 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Spacer / Safe Area */}
      <div className="pt-4"></div>

      {/* Central Content Card */}
      <div className={`relative z-10 w-full flex flex-col items-center text-center ${isShaking ? 'animate-bounce' : ''}`}>
        {/* Logo Card */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-[28px] p-3 shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex items-center justify-center border border-white/20 mb-6 transition-transform hover:scale-105">
          <img
            src="/assets/sabah_electricity_logo.png"
            alt="Sabah Electricity"
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback to logo.png if specific logo isn't loaded
              e.currentTarget.src = '/assets/logo.png';
            }}
          />
        </div>

        {/* Pilot Environment Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-[11px] font-bold mb-4 shadow-sm backdrop-blur-xs">
          <svg className="w-3.5 h-3.5 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Confidential Pilot Environment</span>
        </div>

        {/* Title */}
        <h1 className="text-[25px] sm:text-[27px] font-black text-white tracking-tight leading-tight mb-2.5">
          SE-Bulletin Access
        </h1>

        {/* Description */}
        <p className="text-[13px] text-slate-300 leading-relaxed max-w-[290px] mx-auto mb-7 font-normal">
          This internal prototype is restricted to authorized Sabah Electricity staff. Please enter the pilot access passcode to proceed.
        </p>

        {/* Form Container */}
        <form onSubmit={handleUnlock} className="w-full space-y-4">
          <div className="text-left space-y-1.5">
            <label className="text-[12px] font-bold text-slate-200 block pl-0.5">
              Security Passcode
            </label>
            <div className="relative">
              {/* Key Icon */}
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>

              {/* Input */}
              <input
                type={showPasscode ? "text" : "password"}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError('');
                }}
                placeholder="Enter pilot passcode"
                className="w-full pl-10 pr-11 py-3.5 bg-[#142036] border border-slate-700/80 rounded-2xl text-[14px] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/80 focus:border-emerald-500 transition-all shadow-inner"
                autoComplete="current-password"
                autoFocus
              />

              {/* Eye Toggle Icon */}
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
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
              <p className="text-[11px] text-rose-400 font-semibold pt-1 flex items-center gap-1">
                <span>⚠️</span> {error}
              </p>
            )}
          </div>

          {/* Unlock Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-[14px] rounded-2xl shadow-lg shadow-emerald-950/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Unlock SE-Connect</span>
            <svg className="w-4 h-4 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </button>
        </form>
      </div>

      {/* Footer Branding */}
      <div className="relative z-10 pt-6 pb-2 text-center">
        <div className="inline-flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Sabah Electricity Sdn. Bhd. • Internal Staging</span>
        </div>
      </div>
    </div>
  );
}

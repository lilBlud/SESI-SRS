import React, { useState } from 'react';
import { loginDirect } from '../../utils/supabaseClient';
import { API_BASE, IS_LOCAL_SSMS } from '../../services/apiConfig';
import { TopographicBackground } from '../../components/layout';

export default function LoginPage({ onLogin }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleDemoLogin = () => {
    const demoUser = {
      id: 9999,
      fullName: 'Demo User',
      preferredName: 'Demo',
      email: 'demo@sesb.com.my',
      division: 'Information & Digital',
      staffId: 'DEMO-001',
      role: 'Staff'
    };
    if (onLogin) {
      onLogin(demoUser);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setErrorMsg('');

    const cleanId = identifier.trim();
    if (!cleanId || !password) {
      setErrorMsg('Please enter your Staff ID / Email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      let loggedUser = null;

      if (!IS_LOCAL_SSMS) {
        try {
          loggedUser = await loginDirect(cleanId, password);
        } catch (sbErr) {
          if (sbErr.message && sbErr.message.includes('Invalid')) {
            setErrorMsg('Invalid Staff ID/Email or password. Please try again.');
            return;
          }
          console.warn('Direct Supabase auth fallback to API:', sbErr);
        }
      }

      if (!loggedUser) {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanId, password })
        });

        if (!res.ok) {
          if (res.status === 401) {
            setErrorMsg('The Staff ID/Email or password you entered is incorrect. Please try again.');
          } else {
            const errText = await res.text();
            setErrorMsg(errText ? errText.substring(0, 120) : `Request failed (${res.status}). Please try again.`);
          }
          return;
        }

        loggedUser = JSON.parse(await res.text());
      }

      if (loggedUser && onLogin) {
        onLogin(loggedUser);
      }
    } catch (error) {
      setErrorMsg(`Connection error: ${error.message || 'Unable to reach server.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-[13px] transition-colors';

  return (
    <div className="relative app-shell-frame min-h-[100dvh] lg:h-[100dvh] overflow-hidden bg-slate-900 flex flex-col lg:grid lg:grid-cols-12 font-sans">
      {/* ─── LEFT PANEL: Brand Showcase (Desktop Split + Mobile Hero) ─── */}
      <div className="relative isolate lg:col-span-6 xl:col-span-7 flex flex-col justify-between bg-[#090d16] text-white px-6 pt-12 pb-8 lg:p-12 xl:p-16 overflow-hidden shrink-0">
        <TopographicBackground isDark={true} />

        {/* Subtle emerald ambient glow */}
        <div
          aria-hidden="true"
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"
        />

        {/* Center Narrative (Full on Desktop, Compact on Mobile) */}
        <div className="relative z-10 mt-1 lg:my-auto max-w-xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-black tracking-tight leading-[1.15] text-white">
            Regulatory intelligence &amp; performance for{' '}
            <span className="text-emerald-400">Sabah&apos;s grid.</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm lg:text-base mt-3 lg:mt-4 leading-relaxed max-w-md">
            Energising Sabah with reliability, safety, and pride. Access IBR standards, monthly knowledge challenges, and corporate KPIs in one unified portal.
          </p>

          {/* Desktop Feature Highlights */}
          <div className="hidden lg:grid grid-cols-1 sm:grid-cols-3 gap-3 mt-10">
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-2.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="text-xs font-bold text-white">IBR Dictionary</div>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">Formulas, notations &amp; regulatory terms</p>
            </div>
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-2.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="text-xs font-bold text-white">Knowledge Hub</div>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">Monthly quizzes &amp; division standings</p>
            </div>
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-2.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-xs font-bold text-white">Grid Metrics</div>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">Historical trends &amp; Future Gen 2026</p>
            </div>
          </div>
        </div>

        {/* Desktop Footer */}
        <div className="hidden lg:flex items-center justify-between text-xs text-slate-400 relative z-10 border-t border-white/10 pt-5">
          <span>Internal Staff Portal</span>
          <span className="text-emerald-400 font-semibold">SESB Official</span>
        </div>
      </div>

      {/* ─── RIGHT PANEL: Auth Form (Centered Card on Desktop, Bottom Sheet on Mobile) ─── */}
      <div className="relative z-20 flex-1 lg:col-span-6 xl:col-span-5 bg-white dark:bg-slate-900 lg:bg-slate-50 lg:dark:bg-slate-950 rounded-t-[2rem] lg:rounded-none px-6 pt-5 pb-8 lg:p-10 flex flex-col lg:items-center lg:justify-center overflow-y-auto scroll-container">
        {/* Mobile Drag Handle */}
        <div className="lg:hidden w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-5 shrink-0" />

        {/* Brand Logo Lockup (Outside Card Box) */}
        <div className="flex flex-col items-center text-center mb-7 shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white border border-slate-200/90 dark:border-slate-700 p-3 shadow-md flex items-center justify-center mb-3.5">
            <img src="/assets/logo.png" alt="SESI Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
            SESI INSIGHT
          </span>
          <span className="text-sm sm:text-base font-semibold text-emerald-600 dark:text-emerald-400 mt-1.5">
            Sabah Electricity Supply Industry
          </span>
        </div>

        <div className="w-full max-w-md mx-auto lg:bg-white lg:dark:bg-slate-900 lg:border lg:border-slate-200/90 lg:dark:border-slate-800 lg:rounded-2xl lg:p-7 lg:shadow-xl">
          {/* Card Heading */}
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Staff Sign In
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Sign in with your SESB Active Directory credentials
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/70 dark:border-emerald-800/60 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              AD Connected
            </span>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Staff ID or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
                  </svg>
                </div>
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => { setIdentifier(e.target.value); if (errorMsg) setErrorMsg(''); }}
                  className={inputClass}
                  placeholder="e.g. 90003508 or name@sesb.com.my"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errorMsg) setErrorMsg(''); }}
                  className={`${inputClass} pr-10`}
                  placeholder="Enter your Active Directory password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 dark:border-rose-800/70 bg-rose-50 dark:bg-rose-950/40 px-3.5 py-2.5 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-start gap-2"
              >
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 mt-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="my-4 flex items-center justify-center">
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
            <span className="px-3 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">or</span>
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs active:scale-[0.98] transition-all flex justify-center items-center gap-2 border border-slate-200/80 dark:border-slate-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>Quick Demo Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}

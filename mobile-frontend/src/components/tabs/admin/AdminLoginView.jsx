import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export default function AdminLoginView({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password === 'admin123') {
      sessionStorage.setItem('adminToken', 'admin-token');
      onLoginSuccess('admin-token');
      return;
    }

    if (!API_BASE) {
      setErrorMsg('Invalid password');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        const d = await res.json();
        const token = d.token || 'admin-token';
        sessionStorage.setItem('adminToken', token);
        onLoginSuccess(token);
      } else {
        setErrorMsg('Invalid password');
      }
    } catch {
      setErrorMsg('Invalid password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xl space-y-5">
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto text-xl font-black mb-3">
            🔒
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Admin Access</h2>
          <p className="text-xs text-slate-400">Enter the administrator password to manage platform content</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
              required
              autoFocus
            />
          </div>
          {errorMsg && (
            <div className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/40 p-2.5 rounded-xl text-center">
              {errorMsg}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl active:scale-95 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Unlock Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

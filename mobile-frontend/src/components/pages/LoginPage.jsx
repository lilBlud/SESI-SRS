import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function LoginPage({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [division, setDivision] = useState('');
  const [staffId, setStaffId] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleDemoLogin = () => {
    const demoUser = {
      id: 9999,
      fullName: 'Demo User',
      email: 'demo@sesb.com.my',
      division: 'Chief Executive Officer (CEO) Office',
      staffId: 'DEMO-001'
    };
    if (onLogin) {
      onLogin(demoUser);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isSignUp ? `${API_BASE}/api/auth/signup` : `${API_BASE}/api/auth/login`;
      const body = isSignUp ? { fullName, email, password, division, staffId } : { email, password };
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          alert('Invalid email or password. Please try again.');
        } else {
          const errText = await res.text();
          alert(`Server Error (${res.status}): ` + errText.substring(0, 100));
        }
        return;
      }
      
      const user = JSON.parse(await res.text());
      if (onLogin) {
        onLogin(user);
      }
    } catch (error) {
      alert(`Connection Error: ${error.message} - Make sure the backend server is running.`);
    }
  };

  return (
    <div className="relative w-full max-w-[430px] xl:max-w-none mx-auto h-[100dvh] overflow-hidden shadow-2xl bg-slate-900 flex flex-col font-sans">
      {/* Background Image Area */}
      <div className="absolute inset-0 z-0 h-[55vh]">
        <img 
          src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1000&auto=format&fit=crop" 
          alt="Transmission Towers" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900"></div>
      </div>

      {/* Header Text Overlay */}
      <div className="relative z-10 pt-20 px-6 pb-6">
        <p className="text-blue-200/80 text-[10px] font-bold tracking-widest uppercase mb-2">
          Internal Staff Portal
        </p>
        <h1 className="text-2xl font-bold text-white leading-tight">
          Welcome to Sabah Electricity Supply Industry<br/>
          <span className="text-[32px] font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 block mt-2">
            SESI
          </span>
        </h1>
        <p className="text-slate-300 text-sm mt-3 font-medium">
          Energising Sabah with reliability, safety, and pride.
        </p>
      </div>

      {/* Login Card Overlay */}
      <div className="relative z-20 flex-1 bg-white dark:bg-slate-900 rounded-t-[2.5rem] px-6 pt-6 pb-8 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.3)] mt-8 overflow-y-auto scroll-container">
        {/* Drag Handle */}
        <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6"></div>

        {/* Title */}
        <div className="flex items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {isSignUp ? 'Staff Sign Up' : 'Staff Sign In'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isSignUp ? 'Create your staff profile (zero ID requirement)' : 'Access the internal portal'}
            </p>
          </div>
        </div>

        {/* Toggle Switches */}
        <div className="flex bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl mb-6 border border-slate-100 dark:border-slate-800">
          <button 
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2 text-[13px] font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${!isSignUp ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Sign In
          </button>
          <button 
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2 text-[13px] font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${isSignUp ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-700 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            New Staff Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignUp && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-[13px] transition-shadow" 
                    placeholder="e.g. Dayang Nurul Ain" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Division</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <select 
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-[13px] transition-shadow appearance-none" 
                  >
                    <option value="" disabled>Select your division</option>
                    <option value="Chief Executive Officer (CEO) Office">Chief Executive Officer (CEO) Office</option>
                    <option value="Single Buyer">Single Buyer</option>
                    <option value="Grid System Operator">Grid System Operator</option>
                    <option value="Major Project">Major Project</option>
                    <option value="Operating">Operating</option>
                    <option value="Generation">Generation</option>
                    <option value="Transmission">Transmission</option>
                    <option value="Distribution">Distribution</option>
                    <option value="Retail">Retail</option>
                    <option value="Strategy & Sustainability">Strategy & Sustainability</option>
                    <option value="Corporate Services">Corporate Services</option>
                    <option value="Corporate Communication">Corporate Communication</option>
                    <option value="Finance">Finance</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Information & Digital">Information & Digital</option>
                    <option value="Procurement">Procurement</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Staff ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 00-4.9 0h4.9zM12 9h4M12 13h4" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-[13px] transition-shadow" 
                    placeholder="e.g. EMP-1234" 
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-[13px] transition-shadow" 
                placeholder="e.g. name@sesb.com.my" 
              />
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {isSignUp ? 'Create Password' : 'Password'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-[13px] transition-shadow" 
                placeholder={isSignUp ? "Minimum 4 characters" : "Enter your password"} 
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-3 mt-2 bg-gradient-to-r from-emerald-600 to-blue-800 hover:from-emerald-700 hover:to-blue-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
          >
            {isSignUp ? 'Create Account & Enter SESI' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-center">
          <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
          <span className="px-3 text-xs text-slate-400 font-medium uppercase tracking-wider">OR</span>
          <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
        </div>

        <button 
          type="button" 
          onClick={handleDemoLogin}
          className="w-full py-3 mt-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm active:scale-[0.98] transition-all flex justify-center items-center gap-2 border border-slate-200 dark:border-slate-700"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          Quick Demo Login
        </button>
      </div>
    </div>
  );
}

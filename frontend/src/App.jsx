import React, { useState, useEffect } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('ibr');
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Simulator State
  const [rab, setRab] = useState(45000);
  const [wacc, setWacc] = useState(7.3);
  const [opex, setOpex] = useState(6800);
  const [dep, setDep] = useState(5200);
  const tax = 1038;

  // Glossary State
  const [glossary, setGlossary] = useState([]);
  const [glossarySearch, setGlossarySearch] = useState('');
  const [glossaryCategory, setGlossaryCategory] = useState('All');

  useEffect(() => {
    // Fetch from .NET Backend
    fetch('http://localhost:5225/api/glossary')
      .then(res => res.json())
      .then(data => setGlossary(data))
      .catch(err => console.error("Error fetching glossary:", err));
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const formatMoney = (amount) => `$${amount.toLocaleString('en-US')} M`;

  const returnOnRab = rab * (wacc / 100);
  const totalRev = opex + dep + returnOnRab + tax;

  const filteredGlossary = glossary.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(glossarySearch.toLowerCase()) || 
                          item.full.toLowerCase().includes(glossarySearch.toLowerCase());
    const matchesCat = glossaryCategory === 'All' || item.cat === glossaryCategory;
    return matchesSearch && matchesCat;
  });

  const quickSearchResults = glossary.filter(item => 
    searchQuery && (item.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    item.full.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100`}>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32">
          <div className="flex items-center justify-between h-20">
            
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('ibr')}>
              <div className="h-12 w-12 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black text-2xl shadow-md">SE</div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">IBR Literacy</span>
                  <span className="bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Hub</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">Incentive-Based Regulation Portal</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <button onClick={() => setActiveTab('ibr')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center ${activeTab === 'ibr' ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                <span>IBR Masterclass</span>
                {activeTab === 'ibr' && <span className="ml-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
              </button>
              <button onClick={() => setActiveTab('glossary')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'glossary' ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                Directory & Dictionary
              </button>
              <button onClick={() => setActiveTab('quiz')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'quiz' ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                Knowledge Quiz
              </button>
              <button onClick={() => setActiveTab('cheatsheet')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'cheatsheet' ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                Cheat Sheet
              </button>
            </nav>

            <div className="flex items-center space-x-3">
              <button onClick={() => setIsSearchOpen(true)} className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <span className="hidden sm:inline">Search...</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded">Ctrl+K</kbd>
              </button>

              <button onClick={() => setIsDark(!isDark)} className="p-2.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Toggle Theme">
                {isDark ? (
                  <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"></path></svg>
                ) : (
                  <svg className="w-6 h-6 text-slate-600" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
                )}
              </button>

              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-1 bg-white dark:bg-slate-900">
            <button onClick={() => { setActiveTab('ibr'); setIsMobileMenuOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold block ${activeTab === 'ibr' ? 'text-emerald-600' : ''}`}>IBR Masterclass</button>
            <button onClick={() => { setActiveTab('glossary'); setIsMobileMenuOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold block ${activeTab === 'glossary' ? 'text-emerald-600' : ''}`}>Directory & Dictionary</button>
            <button onClick={() => { setActiveTab('quiz'); setIsMobileMenuOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold block ${activeTab === 'quiz' ? 'text-emerald-600' : ''}`}>Knowledge Quiz</button>
            <button onClick={() => { setActiveTab('cheatsheet'); setIsMobileMenuOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold block ${activeTab === 'cheatsheet' ? 'text-emerald-600' : ''}`}>Cheat Sheet</button>
          </div>
        )}
      </header>

      <main className="flex-1 w-full px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 py-8 relative">
        
        {activeTab === 'ibr' && (
          <section className="space-y-10 animate-fadeIn block">
            <div className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 max-w-3xl">
                <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/30">
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Internal Stakeholder Literacy Hub
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                  Incentive-Based Regulation (IBR) Literacy
                </h1>
                <p className="text-emerald-200/90 text-xs sm:text-sm mt-3 leading-relaxed font-light">
                  A dedicated self-learning resource for staff to understand how IBR works, why tariffs are structured via the Building Block Model, how ICPT balances fuel costs, and key energy transition concepts.
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-6">
                  <a href="#simulator" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center">
                    Building Block Simulator
                    <svg className="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </a>
                  <button onClick={() => setActiveTab('glossary')} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 backdrop-blur-sm transition-all flex items-center">
                    Browse 50+ Terms
                  </button>
                </div>
              </div>
            </div>

            <div id="simulator" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="max-w-3xl mb-6">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Interactive Simulator</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">The Building Block Model</h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                  Test how changes in approved RAB, WACC, and OPEX directly affect the regulated Revenue Requirement.
                </p>
                <div className="mt-3 inline-block font-mono text-xs bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-lg text-emerald-700 dark:text-emerald-300 font-bold border border-slate-200 dark:border-slate-700">
                  Revenue = OPEX + Depreciation + (RAB × WACC) + Taxes
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-6 space-y-5 bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      <span>Regulated Asset Base (RAB):</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{formatMoney(rab)}</span>
                    </div>
                    <input type="range" min="10000" max="80000" step="1000" value={rab} onChange={(e) => setRab(Number(e.target.value))} className="w-full" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      <span>Allowed Return (WACC %):</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{wacc.toFixed(1)}%</span>
                    </div>
                    <input type="range" min="4.0" max="10.0" step="0.1" value={wacc} onChange={(e) => setWacc(Number(e.target.value))} className="w-full" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      <span>Operating Expenditure (OPEX):</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{formatMoney(opex)}</span>
                    </div>
                    <input type="range" min="2000" max="15000" step="200" value={opex} onChange={(e) => setOpex(Number(e.target.value))} className="w-full" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      <span>Depreciation (Return OF Capital):</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{formatMoney(dep)}</span>
                    </div>
                    <input type="range" min="1000" max="10000" step="100" value={dep} onChange={(e) => setDep(Number(e.target.value))} className="w-full" />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">* Taxes are modeled at a static $1,038 M for demonstration purposes.</p>
                </div>

                <div className="lg:col-span-6 flex flex-col justify-between bg-emerald-50/50 dark:bg-emerald-950/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Calculated Allowed Annual Revenue</span>
                    <div className="text-3xl sm:text-4xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                      {formatMoney(Math.round(totalRev))}
                    </div>
                    
                    <div className="mt-6">
                      <div className="w-full h-5 rounded-lg overflow-hidden flex bg-slate-200 dark:bg-slate-700">
                        <div style={{ width: `${(returnOnRab / totalRev) * 100}%` }} className="bg-emerald-600 h-full transition-all duration-300 ease-out" title="Return on Capital"></div>
                        <div style={{ width: `${(opex / totalRev) * 100}%` }} className="bg-teal-500 h-full transition-all duration-300 ease-out" title="OPEX"></div>
                        <div style={{ width: `${(dep / totalRev) * 100}%` }} className="bg-indigo-500 h-full transition-all duration-300 ease-out" title="Depreciation"></div>
                        <div style={{ width: `${(tax / totalRev) * 100}%` }} className="bg-amber-500 h-full transition-all duration-300 ease-out" title="Taxes"></div>
                      </div>
                    </div>

                    <div className="mt-5 space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 shadow-xs border border-slate-100 dark:border-slate-700">
                        <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-emerald-600 mr-2"></span>Return on RAB (RAB × WACC):</span>
                        <span className="font-bold text-slate-900 dark:text-white font-mono">{formatMoney(Math.round(returnOnRab))}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 shadow-xs border border-slate-100 dark:border-slate-700">
                        <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-teal-500 mr-2"></span>Operating Expenditure (OPEX):</span>
                        <span className="font-bold text-slate-900 dark:text-white font-mono">{formatMoney(opex)}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 shadow-xs border border-slate-100 dark:border-slate-700">
                        <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>Depreciation:</span>
                        <span className="font-bold text-slate-900 dark:text-white font-mono">{formatMoney(dep)}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 shadow-xs border border-slate-100 dark:border-slate-700">
                        <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>Taxes:</span>
                        <span className="font-bold text-slate-900 dark:text-white font-mono">{formatMoney(tax)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'glossary' && (
          <section className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Knowledge Repository</span>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Dictionary & Directory</h1>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search dictionary terms..." 
                  className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white" 
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {['All', 'IBR', 'ESG'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setGlossaryCategory(cat)} 
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${glossaryCategory === cat ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                  >
                    {cat === 'All' ? 'All Categories' : cat === 'IBR' ? 'IBR & Regulatory' : 'Sustainability & ESG'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGlossary.length === 0 ? (
                <div className="col-span-full p-6 text-center text-slate-500 text-sm border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">No terms found.</div>
              ) : (
                filteredGlossary.map((item, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-black text-emerald-600 dark:text-emerald-400">{item.term}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded">{item.cat}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{item.full}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {activeTab === 'quiz' && (
          <section className="space-y-6 animate-fadeIn">
            <div className="text-center py-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Knowledge Quiz Arena</h2>
              <p className="text-slate-500 mb-6">Test your IBR and Sustainability Knowledge!</p>
              <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all" onClick={() => alert('Quiz Module starting in full version!')}>Start Assessment</button>
            </div>
          </section>
        )}

        {activeTab === 'cheatsheet' && (
          <section className="space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between no-print">
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Executive Cheat Sheet</h1>
              </div>
              <button onClick={() => window.print()} className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl text-xs font-bold flex items-center shadow-sm">
                Print / Save PDF
              </button>
            </div>
            
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-black mb-4">Core Acronyms</h2>
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50">
                    <th className="py-3 px-4 font-bold border-b dark:border-slate-700">Acronym</th>
                    <th className="py-3 px-4 font-bold border-b dark:border-slate-700">Full Name</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  <tr><td className="py-3 px-4 font-mono font-bold text-emerald-600">IBR</td><td className="py-3 px-4">Incentive-Based Regulation</td></tr>
                  <tr><td className="py-3 px-4 font-mono font-bold text-emerald-600">RAB</td><td className="py-3 px-4">Regulated Asset Base</td></tr>
                  <tr><td className="py-3 px-4 font-mono font-bold text-emerald-600">WACC</td><td className="py-3 px-4">Weighted Average Cost of Capital</td></tr>
                  <tr><td className="py-3 px-4 font-mono font-bold text-emerald-600">ICPT</td><td className="py-3 px-4">Imbalance Cost Pass-Through</td></tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

      </main>

      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4" onClick={() => setIsSearchOpen(false)}>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center space-x-3">
              <input 
                type="text" 
                placeholder="Search..." 
                className="flex-1 bg-transparent text-sm font-medium focus:outline-none dark:text-white" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <kbd onClick={() => setIsSearchOpen(false)} className="cursor-pointer text-[10px] font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500">ESC</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {!searchQuery ? (
                <div className="p-6 text-center text-xs text-slate-400">Type any acronym or term...</div>
              ) : quickSearchResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">No results found.</div>
              ) : (
                quickSearchResults.map((item, idx) => (
                  <div key={idx} className="p-3 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer rounded-lg transition-colors" 
                       onClick={() => { setIsSearchOpen(false); setActiveTab('glossary'); setGlossarySearch(item.term); }}>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{item.term} <span className="text-slate-500 font-normal ml-2">{item.full}</span></div>
                    <div className="text-xs text-slate-500 mt-1 line-clamp-1">{item.desc}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

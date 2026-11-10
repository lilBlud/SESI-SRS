import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('[SESI Runtime Crash]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetAndReload = () => {
    try {
      localStorage.removeItem('sesi_glossary_cache');
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isDev = Boolean(import.meta.env.DEV);
      return (
        <div className="min-h-[100dvh] flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
          <div className="w-full max-w-[430px] bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="w-14 h-14 bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
              ⚠️
            </div>
            <h2 className="text-xl font-black mb-1.5 text-slate-900 dark:text-white">Something went wrong</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              An unexpected application error occurred. You can reload or reset the local app cache.
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs active:scale-95 transition-all shadow-md shadow-emerald-600/20"
              >
                Reload Application
              </button>
              <button
                type="button"
                onClick={this.handleResetAndReload}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs active:scale-95 transition-all"
              >
                Clear Cache & Reload
              </button>
            </div>

            {isDev && this.state.error && (
              <details className="mt-4 text-left p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/60 text-[11px] text-rose-700 dark:text-rose-300 font-mono overflow-auto max-h-48">
                <summary className="cursor-pointer font-bold mb-1 text-rose-800 dark:text-rose-200">
                  Developer Error Details
                </summary>
                <div className="font-semibold break-all mb-2">{this.state.error.toString()}</div>
                <pre className="text-[10px] whitespace-pre-wrap">{this.state.error.stack}</pre>
                {this.state.errorInfo && (
                  <pre className="text-[10px] whitespace-pre-wrap mt-2 pt-2 border-t border-rose-200/60 dark:border-rose-800/60">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}


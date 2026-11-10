import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IS_LOCAL_SSMS, API_BASE } from '../services/apiConfig';
import { ssmsProvider } from '../services/providers/ssms/ssmsProvider';

const BackendContext = createContext({
  isLocalMode: false,
  isOnline: true,
  checkHealth: async () => true,
  retryConnection: () => {}
});

export function BackendProvider({ children }) {
  const [isOnline, setIsOnline] = useState(true);

  const checkHealth = useCallback(async () => {
    if (!IS_LOCAL_SSMS) {
      setIsOnline(true);
      return true;
    }
    const healthy = await ssmsProvider.checkHealth();
    setIsOnline(healthy);
    return healthy;
  }, []);

  useEffect(() => {
    checkHealth();
    if (!IS_LOCAL_SSMS) return;

    // Periodic check every 15s in local development
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  return (
    <BackendContext.Provider value={{ isLocalMode: IS_LOCAL_SSMS, isOnline, checkHealth, retryConnection: checkHealth }}>
      {IS_LOCAL_SSMS && !isOnline && (
        <div className="w-full max-w-[440px] mx-auto bg-red-600 text-white px-4 py-2 text-xs font-semibold text-center sticky top-0 z-[100] shadow-md flex items-center justify-between">
          <span>⚠️ Local SSMS Backend ({API_BASE}) is offline. Please start <code>mobile-backend</code>.</span>
          <button 
            onClick={checkHealth}
            className="ml-3 px-2 py-0.5 bg-white text-red-700 rounded text-xs font-bold hover:bg-red-50 transition shrink-0"
          >
            Retry
          </button>
        </div>
      )}
      {children}
    </BackendContext.Provider>
  );
}

export function useBackend() {
  return useContext(BackendContext);
}


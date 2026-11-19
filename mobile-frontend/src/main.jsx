import React from 'react';
import ReactDOM from 'react-dom/client';
import { LazyMotion, domMax, MotionConfig } from 'motion/react';
import App from './App.jsx';
import { ErrorBoundary } from './components/ui/ErrorBoundary.jsx';
import { ThemeProvider, BackendProvider, AuthProvider } from './context';
import './index.css';

if ('serviceWorker' in navigator) {
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });

  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const reg of registrations) {
      reg.update();
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <BackendProvider>
          <AuthProvider>
            <LazyMotion features={domMax} strict>
              <MotionConfig reducedMotion="user">
                <App />
              </MotionConfig>
            </LazyMotion>
          </AuthProvider>
        </BackendProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);

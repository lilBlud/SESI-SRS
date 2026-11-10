import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ErrorBoundary } from './components/ui/ErrorBoundary.jsx';
import { ThemeProvider, BackendProvider, AuthProvider } from './context';
import './index.css';

if ('serviceWorker' in navigator) {
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
            <App />
          </AuthProvider>
        </BackendProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);

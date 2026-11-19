import React from 'react';
import { AnimatePresence, m } from 'motion/react';
import { MODAL_BACKDROP, MODAL_DIALOG } from '../../utils/motionConfig';

/**
 * Modal prompting mobile users to install the PWA onto their home screen.
 */
export default function InstallAppModal({
  isOpen,
  deferredPrompt,
  onDismiss,
  onInstall
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          key="install-app-backdrop"
          {...MODAL_BACKDROP}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={onDismiss}
        >
          <m.div
            key="install-app-dialog"
            {...MODAL_DIALOG}
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />

            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>

            <h3 className="text-[20px] font-black text-slate-900 dark:text-white mb-2">Install SESI App</h3>

            <p className="text-[14px] text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              For the best experience, install this app on your device!
              {deferredPrompt ? (
                <>
                  <br /><br />
                  <span className="text-[12px] bg-slate-100 dark:bg-slate-800 p-2 rounded-lg block text-left">
                    <strong>Android:</strong><br />
                    Tap the <strong>Install App</strong> button below to add it directly to your home screen!
                  </span>
                </>
              ) : (
                <>
                  <br /><br />
                  <span className="text-[12px] bg-slate-100 dark:bg-slate-800 p-2 rounded-lg block text-left">
                    <strong>iOS / iPhone:</strong><br />
                    Tap <strong className="text-slate-700 dark:text-slate-200">Share</strong>{' '}
                    <svg className="inline w-4 h-4 text-slate-700 dark:text-slate-200 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>{' '}
                    then <strong className="text-slate-700 dark:text-slate-200">Add to Home Screen</strong>{' '}
                    <svg className="inline w-4 h-4 text-slate-700 dark:text-slate-200 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </>
              )}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onDismiss}
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all active:scale-95"
              >
                Not Now
              </button>
              <button
                type="button"
                onClick={onInstall}
                className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/30"
              >
                Install App
              </button>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

import React from 'react';

// ─── SVG Icons ───
export const HomeIcon = ({ active }) => (
  <svg className={`w-6 h-6 ${active ? 'text-emerald-500' : 'text-slate-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export const BookIcon = ({ active }) => (
  <svg className={`w-6 h-6 ${active ? 'text-emerald-500' : 'text-slate-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

export const QuizIcon = ({ active }) => (
  <svg className={`w-6 h-6 ${active ? 'text-emerald-500' : 'text-slate-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

export const ProfileIcon = ({ active }) => (
  <svg className={`w-6 h-6 ${active ? 'text-emerald-500' : 'text-slate-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

// ─── Animated Background Particles ───
export function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="floating-particle" style={{
          left: `${10 + i * 16}%`,
          animationDelay: `${i * 0.7}s`,
          animationDuration: `${4 + i * 0.5}s`,
        }}>
          <div className={`w-${2 + (i % 3)} h-${2 + (i % 3)} rounded-full bg-emerald-400/20`}></div>
        </div>
      ))}
    </div>
  );
}

// ─── Save post image helper ───
export async function saveImage(url, filename) {
  try {
    // Fetch the image as a blob to bypass cross-origin download restrictions
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error('Network error');
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename || 'sesi-post.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error('Failed to download image:', err);
    alert('Failed to save image automatically. You may need to right-click (or long-press) the image and save it manually.');
  }
}

// ─── Bookmarks Hook ───

import { useState } from 'react';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('sesi_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const toggleBookmark = (item, type) => {
    setBookmarks(prev => {
      const exists = prev.find(b => b.id === item.id && b.type === type);
      let updated;
      if (exists) {
        updated = prev.filter(b => !(b.id === item.id && b.type === type));
      } else {
        updated = [{ ...item, type, bookmarkedAt: Date.now() }, ...prev];
      }
      localStorage.setItem('sesi_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const isBookmarked = (id, type) => {
    return bookmarks.some(b => b.id === id && b.type === type);
  };

  return { bookmarks, toggleBookmark, isBookmarked };
}

// ─── Post Image Slider ───

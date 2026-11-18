import React, { useState, useCallback, useMemo } from 'react';
import { PostImageSlider } from '../../../components/ui';
import { ImageViewerModal } from '../../../components/modals';
import { CATEGORIES } from '../../../utils/constants';
import { compressImage, ensureCompressed } from '../../../utils/imageCompression';
import { unpackPosterImages } from '../../../domain/glossaryModel';
import { saveInfographic as saveInfographicService, deleteInfographic as deleteInfographicService } from '../../glossary/glossaryService';

/**
 * Two-column Posts Studio for composing, reordering cover/carousel slides,
 * filtering by category, and managing regulatory infographics.
 */
export default function AdminInfographicsSection({
  infographics,
  onRefreshInfographics
}) {
  const [iTitle, setITitle] = useState('');
  const [iDesc, setIDesc] = useState('');
  const [iCat, setICat] = useState('General');
  const [iImages, setIImages] = useState([]);
  const [statusFeedback, setStatusFeedback] = useState(null); // { tone: 'ok' | 'warn' | 'err', text: string }
  const [iPosting, setIPosting] = useState(false);
  const [iEditId, setIEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewerData, setViewerData] = useState(null); // { images, idx }

  const list = useMemo(
    () => (Array.isArray(infographics) ? infographics : (infographics?.value || [])),
    [infographics],
  );

  const availableCategories = useMemo(
    () => ['All', 'General', ...CATEGORIES.filter(c => c.key !== 'All').map(c => c.key)],
    [],
  );

  const categoryCounts = useMemo(() => {
    const counts = { All: list.length };
    for (const item of list) {
      const cat = item.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return counts;
  }, [list]);

  const filteredInfographics = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return list.filter(item => {
      if (selectedCategory !== 'All' && (item.category || 'General') !== selectedCategory) return false;
      if (!q) return true;
      return (
        (item.title || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q) ||
        (item.category || '').toLowerCase().includes(q)
      );
    });
  }, [list, selectedCategory, searchQuery]);

  const showStatus = (tone, text, autoClearMs = 4000) => {
    setStatusFeedback({ tone, text });
    if (autoClearMs > 0) {
      setTimeout(() => setStatusFeedback(null), autoClearMs);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (iImages.length + files.length > 10) {
      showStatus('err', `Maximum 10 images per post (already selected ${iImages.length}).`);
      return;
    }
    showStatus('warn', 'Optimizing selected images...', 0);
    const compressed = await Promise.all(files.map(compressImage));
    const valid = compressed.filter(Boolean);
    setIImages(prev => [...prev, ...valid].slice(0, 10));
    setStatusFeedback(null);
    e.target.value = '';
  };

  const removeImage = (idx) => {
    setIImages(prev => prev.filter((_, i) => i !== idx));
  };

  const moveImage = (idx, direction) => {
    const targetIdx = idx + direction;
    setIImages(prev => {
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(idx, 1);
      copy.splice(targetIdx, 0, moved);
      return copy;
    });
  };

  const setAsCover = (idx) => {
    if (idx <= 0) return;
    setIImages(prev => {
      if (idx >= prev.length) return prev;
      const copy = [...prev];
      const [picked] = copy.splice(idx, 1);
      copy.unshift(picked);
      return copy;
    });
  };

  const cancelEditInfographic = useCallback(() => {
    setIEditId(null);
    setITitle('');
    setIDesc('');
    setIImages([]);
    setICat('General');
  }, []);

  const addInfographic = useCallback(async (e) => {
    e.preventDefault();
    if (!iTitle.trim()) {
      showStatus('err', 'Title is required.');
      return;
    }
    if (iImages.length === 0) {
      showStatus('err', 'Upload at least one image or poster.');
      return;
    }

    setIPosting(true);
    showStatus('warn', 'Optimizing & uploading poster...', 0);

    try {
      const compressedImages = await Promise.all(iImages.map(ensureCompressed));
      const primaryImage = compressedImages[0] || '';
      const additional = compressedImages.length > 1 ? JSON.stringify(compressedImages.slice(1)) : '';

      await saveInfographicService(
        {
          title: iTitle.trim(),
          description: (iDesc || '').trim(),
          imageUrl: primaryImage,
          additionalImages: additional,
          category: iCat || 'General',
          postedAt: new Date().toISOString(),
        },
        iEditId,
      );

      showStatus('ok', iEditId ? 'Poster updated.' : 'Poster published.');
      if (onRefreshInfographics) await onRefreshInfographics();
      cancelEditInfographic();
    } catch (err) {
      console.error('Post error:', err);
      showStatus('err', `Network error: ${err.message || 'Could not save poster.'}`);
    } finally {
      setIPosting(false);
    }
  }, [iTitle, iImages, iDesc, iCat, iEditId, onRefreshInfographics, cancelEditInfographic]);

  const editInfographic = (item) => {
    setIEditId(item.id);
    setITitle(item.title || '');
    setIDesc(item.description || '');
    setICat(item.category || 'General');
    setIImages(unpackPosterImages(item));
    setStatusFeedback(null);
  };

  const deleteInfographic = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await deleteInfographicService(id);
      if (iEditId === id) cancelEditInfographic();
      showStatus('ok', 'Poster deleted.');
    } catch (err) {
      console.warn('Delete poster failed:', err);
      showStatus('err', 'Failed to delete poster.');
    }
    if (onRefreshInfographics) onRefreshInfographics();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start animate-fadeIn">
      {/* ─── Left: Sticky Post Composer ─── */}
      <div className="lg:col-span-5 lg:sticky lg:top-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              {iEditId ? 'Edit Poster' : 'Publish Poster'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Upload up to 10 carousel slides; slide 1 displays as the cover.
            </p>
          </div>
          {iEditId && (
            <button
              type="button"
              onClick={cancelEditInfographic}
              disabled={iPosting}
              className="min-h-[34px] px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 transition active:scale-95 shrink-0"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={addInfographic} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              Title
            </label>
            <input
              required
              placeholder="e.g. IBR Overview 2026"
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-50/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={iTitle}
              onChange={e => setITitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              Category
            </label>
            <select
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold bg-slate-50/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={iCat}
              onChange={e => setICat(e.target.value)}
            >
              <option value="General">General</option>
              {CATEGORIES.filter(c => c.key !== 'All').map(cat => (
                <option key={cat.key} value={cat.key}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              placeholder="Brief summary or key policy highlights..."
              rows={3}
              className="w-full p-3.5 rounded-xl border text-sm bg-slate-50/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              value={iDesc}
              onChange={e => setIDesc(e.target.value)}
            />
          </div>

          {/* Multi-image upload & reorder zone */}
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-800/30">
            <input
              type="file"
              id="image-upload"
              accept="image/*,video/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center justify-center gap-1.5 text-center py-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400">
                Click to upload poster images
              </span>
              <span className="text-[11px] text-slate-400 tabular-nums">
                {iImages.length}/10 slides attached
              </span>
            </label>

            {iImages.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-700/60 grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {iImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative rounded-xl overflow-hidden border bg-slate-100 dark:bg-slate-800 ${
                      idx === 0 ? 'border-emerald-500 ring-1 ring-emerald-500/30' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <img
                      src={img}
                      className="w-full h-20 object-cover"
                      alt={`Slide ${idx + 1}`}
                    />
                    {idx === 0 ? (
                      <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md">
                        Cover
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setAsCover(idx)}
                        title="Set as cover slide"
                        className="absolute top-1 left-1 bg-slate-900/75 hover:bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md transition"
                      >
                        Set Cover
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      aria-label={`Remove slide ${idx + 1}`}
                      className="absolute top-1 right-1 bg-slate-900/80 hover:bg-rose-600 text-white rounded-md w-5 h-5 flex items-center justify-center transition"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {iImages.length > 1 && (
                      <div className="flex items-center justify-between bg-slate-900/75 text-white px-1 py-0.5 text-[10px]">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveImage(idx, -1)}
                          aria-label="Move slide left"
                          className="p-0.5 hover:text-emerald-300 disabled:opacity-30"
                        >
                          ←
                        </button>
                        <span className="tabular-nums font-bold">{idx + 1}</span>
                        <button
                          type="button"
                          disabled={idx === iImages.length - 1}
                          onClick={() => moveImage(idx, 1)}
                          aria-label="Move slide right"
                          className="p-0.5 hover:text-emerald-300 disabled:opacity-30"
                        >
                          →
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {statusFeedback && (
            <div
              className={`text-xs font-semibold px-3.5 py-2.5 rounded-xl flex items-center gap-2 border ${
                statusFeedback.tone === 'ok'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                  : statusFeedback.tone === 'warn'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
                  : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
              }`}
            >
              <span>{statusFeedback.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={iPosting}
            className="w-full min-h-[44px] py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-105 text-white font-bold text-sm rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-55"
          >
            {iPosting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <span>{iEditId ? 'Save Poster Changes' : 'Publish Poster'}</span>
            )}
          </button>
        </form>
      </div>

      {/* ─── Right: Search, Category Pills & Published Posters ─── */}
      <div className="lg:col-span-7 space-y-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Published Posters
              </h3>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 tabular-nums">
                {filteredInfographics.length}
              </span>
            </div>

            <div className="relative flex-1 sm:flex-initial sm:w-64">
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search posters..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-[13px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {availableCategories.map(cat => {
              const count = categoryCounts[cat] || 0;
              if (cat !== 'All' && count === 0) return null;
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`min-h-[34px] px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 inline-flex items-center gap-1.5 shrink-0 border ${
                    active
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10.5px] px-1.5 py-0.5 rounded-md tabular-nums font-extrabold ${
                      active ? 'bg-white/20 text-white' : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Posters Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filteredInfographics.length === 0 ? (
            <div className="col-span-full text-center py-12 px-6 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
              <div className="w-11 h-11 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">No posters found</p>
              <p className="text-xs text-slate-400">
                {list.length === 0
                  ? 'Use the composer on the left to publish your first infographic.'
                  : 'Try adjusting your search keywords or category filter.'}
              </p>
            </div>
          ) : (
            filteredInfographics.map(item => {
              const allImages = unpackPosterImages(item);
              const hasImages = allImages.length > 0;
              const isEditing = iEditId === item.id;

              return (
                <div
                  key={item.id}
                  className={`group bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden transition-all flex flex-col justify-between ${
                    isEditing
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'border-slate-200/90 dark:border-slate-800'
                  }`}
                >
                  <div>
                    {hasImages ? (
                      <PostImageSlider
                        images={allImages}
                        title={item.title}
                        aspectRatio="aspect-video"
                        category={item.category}
                        onImageClick={(idx) => setViewerData({ images: allImages, idx })}
                      />
                    ) : (
                      <div className="w-full aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    <div className="p-4 space-y-1.5">
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium tabular-nums">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>
                        {new Date(item.postedAt).toLocaleDateString('en-MY', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => editInfographic(item)}
                        className="min-h-[34px] px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/40 text-slate-700 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300 text-xs font-bold rounded-xl transition flex items-center gap-1.5 active:scale-95"
                        title="Edit Poster"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteInfographic(item.id)}
                        className="min-h-[34px] px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl transition flex items-center gap-1.5 active:scale-95"
                        title="Delete Poster"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Fullscreen Image Viewer Lightbox Modal */}
      <ImageViewerModal
        isOpen={Boolean(viewerData)}
        onClose={() => setViewerData(null)}
        images={viewerData?.images || []}
        currentIndex={viewerData?.idx || 0}
        onChangeIndex={(newIdx) => setViewerData(prev => prev ? ({ ...prev, idx: newIdx }) : null)}
      />
    </div>
  );
}

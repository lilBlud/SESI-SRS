import React, { useState, useCallback } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { API_BASE } from '../../../services/apiConfig';

// ─── Module-Level Image Compression Helpers ───
function scaleImage(img, maxDim = 1600, quality = 0.85) {
  const canvas = document.createElement('canvas');
  let { width, height } = img;
  if (width > maxDim || height > maxDim) {
    if (width > height) {
      height = Math.round((height * maxDim) / width);
      width = maxDim;
    } else {
      width = Math.round((width * maxDim) / height);
      height = maxDim;
    }
  }
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', quality);
}

function compressImage(file) {
  return new Promise((resolve) => {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(scaleImage(img));
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

function ensureCompressed(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/') || dataUrl.length < 450000) {
    return Promise.resolve(dataUrl);
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(scaleImage(img));
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export default function AdminInfographicsSection({
  infographics,
  onRefreshInfographics
}) {
  const [iTitle, setITitle] = useState('');
  const [iDesc, setIDesc] = useState('');
  const [iCat, setICat] = useState('General');
  const [iImages, setIImages] = useState([]);
  const [iMsg, setIMsg] = useState('');
  const [iPosting, setIPosting] = useState(false);
  const [iEditId, setIEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const availableCategories = [
    'All',
    'General',
    'IBR Framework',
    'Strategy and Sustainability',
    'Energy Market and Industry',
    'ESG',
    'EPSB',
    'BDV',
    'Governance',
    'Corporate Performance',
    'ISO Management',
    'SE Risk',
    'ReSET2030'
  ];

  const filteredInfographics = (infographics || []).filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.title || '').toLowerCase().includes(q) ||
      (item.description || '').toLowerCase().includes(q) ||
      (item.category || '').toLowerCase().includes(q)
    );
  });



  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (iImages.length + files.length > 10) {
      alert(`You can upload a maximum of 10 images. You already have ${iImages.length}.`);
      return;
    }
    setIMsg('⏳ Processing images...');
    const compressed = await Promise.all(files.map(compressImage));
    const valid = compressed.filter(Boolean);
    setIImages(prev => [...prev, ...valid].slice(0, 10));
    setIMsg('');
    e.target.value = '';
  };

  const removeImage = (idx) => {
    setIImages(prev => prev.filter((_, i) => i !== idx));
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
      setIMsg('❌ Title is required');
      return;
    }
    if (iImages.length === 0) {
      setIMsg('❌ Please upload at least one image/poster');
      return;
    }

    setIPosting(true);
    setIMsg('⏳ Optimizing & uploading poster...');

    try {
      const nowIso = new Date().toISOString();
      const compressedImages = await Promise.all(iImages.map(ensureCompressed));
      const primaryImage = compressedImages[0] || '';
      const additional = compressedImages.length > 1 ? JSON.stringify(compressedImages.slice(1)) : '';
      
      const supabasePayload = {
        Title: iTitle.trim(),
        Description: (iDesc || '').trim(),
        ImageUrl: primaryImage,
        AdditionalImages: additional,
        Category: iCat || 'General',
        PostedAt: nowIso
      };

      let directSuccess = false;
      try {
        if (iEditId) {
          const { error } = await supabase
            .from('Infographics')
            .update(supabasePayload)
            .eq('Id', iEditId);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('Infographics')
            .insert([supabasePayload]);
          if (error) throw error;
        }
        directSuccess = true;
      } catch (sbErr) {
        console.warn("Direct Supabase post error, trying API fallback:", sbErr);
      }

      if (directSuccess) {
        setIMsg(iEditId ? '✅ Updated!' : '✅ Posted!');
        if (onRefreshInfographics) await onRefreshInfographics();
        cancelEditInfographic();
      } else {
        const payload = {
          title: iTitle.trim(),
          description: (iDesc || '').trim(),
          imageUrl: primaryImage,
          additionalImages: additional,
          category: iCat || 'General'
        };

        const url = iEditId 
          ? `${API_BASE}/api/admin/infographics/${iEditId}` 
          : `${API_BASE}/api/admin/infographics`;
        const method = iEditId ? 'PUT' : 'POST';

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) { 
          setIMsg(iEditId ? '✅ Updated!' : '✅ Posted!'); 
          if (onRefreshInfographics) await onRefreshInfographics(); 
          cancelEditInfographic();
        } else {
          const errorText = await res.text();
          console.error('Post failed:', res.status, errorText);
          setIMsg(`❌ Server error: ${errorText.slice(0, 100) || 'Failed to post'}`);
        }
      }
    } catch (err) {
      console.error('Post error:', err);
      setIMsg(`❌ Network error: ${err.message || 'Could not connect to server'}`);
    } finally {
      setIPosting(false);
      setTimeout(() => setIMsg(''), 4000);
    }
  }, [iTitle, iImages, iDesc, iCat, iEditId, onRefreshInfographics, cancelEditInfographic]);

  const editInfographic = (item) => {
    setIEditId(item.id);
    setITitle(item.title);
    setIDesc(item.description || '');
    setICat(item.category || 'General');
    
    const allImages = [];
    if (item.imageUrl) allImages.push(item.imageUrl);
    if (item.additionalImages) {
      try {
        const parsed = typeof item.additionalImages === 'string' ? JSON.parse(item.additionalImages) : item.additionalImages;
        if (Array.isArray(parsed)) allImages.push(...parsed);
      } catch (e) {
        console.warn("Failed to parse additionalImages:", e);
      }
    }
    setIImages(allImages);
  };

  const deleteInfographic = async (id) => {
    if (!confirm('Delete this post?')) return;
    try {
      const { error } = await supabase.from('Infographics').delete().eq('Id', id);
      if (error) throw error;
    } catch (err) {
      console.warn("Direct Supabase delete failed, trying API:", err);
      await fetch(`${API_BASE}/api/admin/infographics/${id}`, { method: 'DELETE', signal: AbortSignal.timeout(4000) }).catch(() => null);
    }
    if (onRefreshInfographics) onRefreshInfographics();
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
        <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-4">Post Infographic / Poster</h2>
        <form onSubmit={addInfographic} className="space-y-3">
          <input 
            required 
            placeholder="Title (e.g. IBR Overview 2026)" 
            className="w-full p-3.5 rounded-xl border text-sm lg:text-base dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            value={iTitle} 
            onChange={e => setITitle(e.target.value)} 
          />
          <div className="flex gap-3">
            <select 
              className="flex-1 p-3.5 rounded-xl border text-sm lg:text-base font-bold dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              value={iCat} 
              onChange={e => setICat(e.target.value)}
            >
              <option value="General">General</option>
              <option value="IBR Framework">IBR Framework</option>
              <option value="Strategy and Sustainability">Strategy & Sustainability</option>
              <option value="Energy Market and Industry">Energy Market & Industry</option>
              <option value="ESG">ESG</option>
              <option value="EPSB">EPSB</option>
              <option value="BDV">BDV</option>
              <option value="Governance">Governance</option>
              <option value="Corporate Performance">Corporate Performance</option>
              <option value="ISO Management">ISO Management</option>
              <option value="SE Risk">Sabah Electricity Risk</option>
              <option value="ReSET2030">ReSET2030</option>
            </select>
          </div>
          <textarea 
            placeholder="Description (optional)" 
            rows={2} 
            className="w-full p-3.5 rounded-xl border text-sm lg:text-base dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" 
            value={iDesc} 
            onChange={e => setIDesc(e.target.value)} 
          />
          
          {/* Multi-image upload zone */}
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 text-center">
            <input 
              type="file" 
              id="image-upload" 
              accept="image/*,video/*" 
              multiple 
              onChange={handleImageUpload} 
              className="hidden" 
            />
            <label htmlFor="image-upload" className="cursor-pointer text-sm lg:text-base font-bold text-emerald-600 dark:text-emerald-400">
              📸 Click to upload images (max 10)
            </label>
            <p className="text-xs lg:text-sm text-slate-400 mt-1">{iImages.length}/10 images selected</p>
            {iImages.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 justify-center">
                {iImages.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img 
                      src={img} 
                      className="h-20 w-20 object-cover rounded-lg shadow-sm bg-slate-100" 
                      alt={`Upload ${idx+1}`} 
                    />
                    <button 
                      type="button" 
                      onClick={() => removeImage(idx)} 
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-lg"
                    >
                      ✕
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-0.5 left-0.5 bg-emerald-500 text-white text-[8px] font-bold px-1 rounded">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {iMsg && (
            <div className={`text-sm font-semibold px-3 py-2 rounded-xl transition-all ${
              iMsg.startsWith('✅') 
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' 
                : iMsg.startsWith('⏳')
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
            }`}>
              {iMsg}
            </div>
          )}
          <div className="flex gap-2">
            <button 
              type="submit" 
              disabled={iPosting} 
              className={`flex-1 py-3 text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 ${
                iPosting 
                  ? 'bg-emerald-400 cursor-not-allowed opacity-75' 
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600'
              }`}
            >
              {iPosting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Posting...</span>
                </>
              ) : (
                <span>{iEditId ? 'Update Poster' : 'Post Poster'}</span>
              )}
            </button>
            {iEditId && (
              <button 
                type="button" 
                onClick={cancelEditInfographic} 
                disabled={iPosting} 
                className="px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white font-bold rounded-xl active:scale-95 transition-all shadow-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search posters by title, description, or category..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full box-border block pl-10 pr-9 py-2.5 rounded-xl border text-xs sm:text-sm lg:text-base dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold p-1"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm lg:text-base font-bold dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs shrink-0"
          >
            {availableCategories.map(c => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          <span className="text-xs lg:text-[13px] font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap pl-1">
            {filteredInfographics.length} {filteredInfographics.length === 1 ? 'poster' : 'posters'}
          </span>
        </div>
      </div>

      {/* Side-by-Side Infographics Grid (1 column on mobile, 2 columns on tablet/desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
        {filteredInfographics.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400 text-sm bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 space-y-2">
            <div className="text-3xl">🖼️</div>
            <p className="font-bold text-slate-700 dark:text-slate-300 text-sm sm:text-base">No posters found</p>
            <p className="text-xs text-slate-400">
              {infographics.length === 0
                ? 'No infographics posted yet. Use the form above to post your first poster!'
                : 'Try adjusting your search keywords or category filter.'}
            </p>
          </div>
        ) : (
          filteredInfographics.map(item => {
            let additionalCount = 0;
            if (item.additionalImages) {
              try {
                const parsed = typeof item.additionalImages === 'string' ? JSON.parse(item.additionalImages) : item.additionalImages;
                if (Array.isArray(parsed)) additionalCount = parsed.length;
              } catch {}
            }

            return (
              <div
                key={item.id}
                className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Poster Image with 16:9 Aspect Ratio and Overlays */}
                  {item.imageUrl ? (
                    <div className="relative w-full aspect-video bg-slate-950 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                      {/* Gradient overlay for text contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                      {/* Floating Category Tag */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-md border border-white/20 shadow-sm">
                          {item.category}
                        </span>
                      </div>

                      {/* Multiple Images Indicator Badge */}
                      {additionalCount > 0 && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-black/70 text-white backdrop-blur-md border border-white/20 shadow-sm flex items-center gap-1.5">
                            <span>📷</span>
                            <span>+{additionalCount} photos</span>
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full aspect-video bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center text-4xl">
                      🖼️
                    </div>
                  )}

                  {/* Card Content Body */}
                  <div className="p-4 sm:p-5 space-y-2">
                    <h3 className="font-extrabold text-base sm:text-lg lg:text-xl text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs sm:text-sm lg:text-[14px] text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer: Metadata Date & Action Controls */}
                <div className="px-4 sm:px-5 py-3 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-3 mt-auto">
                  <div className="flex items-center gap-1.5 text-xs lg:text-[13px] text-slate-400 font-medium">
                    <span>📅</span>
                    <span>
                      {new Date(item.postedAt).toLocaleDateString('en-MY', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => editInfographic(item)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs lg:text-sm font-bold rounded-xl transition flex items-center gap-1.5 active:scale-95 shadow-xs"
                      title="Edit Poster"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteInfographic(item.id)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-xs lg:text-sm font-bold rounded-xl transition flex items-center gap-1.5 active:scale-95 shadow-xs"
                      title="Delete Poster"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
  );
}
import React, { useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';

const API_BASE = import.meta.env.VITE_API_BASE || '';

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

  // ─── Image compression helpers ───
  const compressImage = (file) => {
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
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 1600;
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
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const ensureCompressed = (dataUrl) => {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
      return Promise.resolve(dataUrl);
    }
    // If it's already compact (< 450KB), skip recompression
    if (dataUrl.length < 450000) return Promise.resolve(dataUrl);

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1600;
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
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

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

  const addInfographic = async (e) => {
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
      const compressedImages = await Promise.all(iImages.map(ensureCompressed));
      const primaryImage = compressedImages[0] || '';
      const additional = compressedImages.length > 1 ? JSON.stringify(compressedImages.slice(1)) : '';
      
      const supabasePayload = {
        Title: iTitle.trim(),
        Description: (iDesc || '').trim(),
        ImageUrl: primaryImage,
        AdditionalImages: additional,
        Category: iCat || 'General',
        PostedAt: new Date().toISOString()
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
  };

  const cancelEditInfographic = () => {
    setIEditId(null);
    setITitle('');
    setIDesc('');
    setIImages([]);
    setICat('General');
  };

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
      await fetch(`${API_BASE}/api/admin/infographics/${id}`, { method: 'DELETE' }).catch(() => null);
    }
    if (onRefreshInfographics) onRefreshInfographics();
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
        <h2 className="text-[16px] font-bold mb-4">Post Infographic / Poster</h2>
        <form onSubmit={addInfographic} className="space-y-3">
          <input 
            required 
            placeholder="Title (e.g. IBR Overview 2026)" 
            className="w-full p-3 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            value={iTitle} 
            onChange={e => setITitle(e.target.value)} 
          />
          <div className="flex gap-3">
            <select 
              className="flex-1 p-3 rounded-xl border text-sm font-bold dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
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
            className="w-full p-3 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" 
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
            <label htmlFor="image-upload" className="cursor-pointer text-sm font-bold text-emerald-600 dark:text-emerald-400">
              📸 Click to upload images (max 10)
            </label>
            <p className="text-[11px] text-slate-400 mt-1">{iImages.length}/10 images selected</p>
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

      {/* Infographics list */}
      <div className="space-y-3">
        {(!infographics || infographics.length === 0) ? (
          <div className="text-center py-8 text-slate-400 text-sm bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200">
            No infographics posted yet.
          </div>
        ) : (
          infographics.map(item => (
            <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              {item.imageUrl && (
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-40 object-cover" 
                  onError={e => { e.target.style.display = 'none'; }} 
                />
              )}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[15px]">{item.title}</h3>
                    {item.description && <p className="text-[12px] text-slate-500 mt-1">{item.description}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 px-2 py-0.5 rounded font-bold uppercase">{item.category}</span>
                      <span className="text-[10px] text-slate-400">{new Date(item.postedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => editInfographic(item)} 
                      className="text-blue-500 bg-blue-50 dark:bg-blue-950/20 p-2 rounded-xl shrink-0 hover:opacity-80 transition"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button 
                      onClick={() => deleteInfographic(item.id)} 
                      className="text-red-400 bg-red-50 dark:bg-red-950/20 p-2 rounded-xl shrink-0 hover:opacity-80 transition"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

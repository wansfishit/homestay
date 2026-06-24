'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { db, Gallery } from '../../../lib/db';
import { useAuth } from '../../../context/AuthContext';
import { Plus, Trash2, Check, X as CloseIcon, Upload, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react';

export default function AdminGalleryManager() {
  const { isDemo } = useAuth();
  
  const [items, setItems] = useState<Gallery[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<Gallery> | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Field states
  const [imageUrl, setImageUrl] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleId, setTitleId] = useState('');
  const [category, setCategory] = useState('general');
  const [sortOrder, setSortOrder] = useState(0);

  // Toast
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const loadGallery = async () => {
    const list = await db.getGalleries();
    setItems(list);
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleEditClick = (g: Gallery) => {
    setEditingItem(g);
    setIsNew(false);
    setImageUrl(g.image_url);
    setTitleEn(g.title_en || '');
    setTitleId(g.title_id || '');
    setCategory(g.category);
    setSortOrder(g.sort_order);
  };

  const handleCreateClick = () => {
    setEditingItem({});
    setIsNew(true);
    setImageUrl('');
    setTitleEn('');
    setTitleId('');
    setCategory('general');
    setSortOrder(items.length + 1);
  };

  // Drag and drop file simulated uploader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDemo) {
      triggerToast('Demo Mode Active. Upload is disabled.', 'error');
      return;
    }
    const files = e.target.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setImageUrl(result);
          triggerToast('Photo successfully loaded into local storage drawer.');
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) {
      triggerToast('Demo Mode Active. Editing is disabled.', 'error');
      return;
    }

    if (!imageUrl) {
      triggerToast('Image photo URL is required.', 'error');
      return;
    }

    const payload: Gallery = {
      id: editingItem?.id || `gal-${Date.now()}`,
      image_url: imageUrl,
      title_en: titleEn || undefined,
      title_id: titleId || undefined,
      category,
      sort_order: sortOrder,
      created_at: editingItem?.created_at || new Date().toISOString()
    };

    try {
      await db.saveGallery(payload);
      triggerToast(isNew ? 'Gallery item uploaded.' : 'Gallery item updated.');
      setEditingItem(null);
      loadGallery();
    } catch {
      triggerToast('Save failed.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (isDemo) {
      triggerToast('Demo Mode Active. Editing is disabled.', 'error');
      return;
    }

    if (window.confirm('Delete this photo from gallery?')) {
      const success = await db.deleteGallery(id);
      if (success) {
        triggerToast('Photo deleted.');
        loadGallery();
      }
    }
  };

  // Reorder sort keys
  const handleSortChange = async (g: Gallery, dir: 'up' | 'down') => {
    if (isDemo) {
      triggerToast('Demo Mode Active. Reordering is disabled.', 'error');
      return;
    }
    const idx = items.findIndex(item => item.id === g.id);
    const nextIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= items.length) return;

    const reordered = [...items];
    const temp = reordered[idx].sort_order;
    reordered[idx].sort_order = reordered[nextIdx].sort_order;
    reordered[nextIdx].sort_order = temp;

    await db.saveGallery(reordered[idx]);
    await db.saveGallery(reordered[nextIdx]);
    loadGallery();
    triggerToast('Sort orders updated.');
  };

  return (
    <AdminLayout title="Photo Gallery Manager">
      
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl border text-xs font-semibold shadow-xl flex items-center gap-2.5 transition-all ${
          toast.type === 'success' ? 'bg-emerald-950 border-emerald-500/30 text-emerald-450' : 'bg-rose-955 border-rose-500/30 text-rose-455'
        }`}>
          <Check className="w-4 h-4" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header action */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleCreateClick}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-white rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          Upload New Image
        </button>
      </div>

      {/* Gallery Cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((g, idx) => (
          <div key={g.id} className="bg-neutral-900 border border-white/5 p-3 rounded-2xl flex flex-col group relative">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-neutral-950 relative">
              <img src={g.image_url} alt={g.title_en} className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-[8px] uppercase tracking-widest font-bold text-white px-2 py-0.5 rounded border border-white/10">
                {g.category}
              </span>
            </div>

            <div className="mt-3 flex flex-col justify-between flex-grow">
              <div>
                <h5 className="font-semibold text-white truncate text-[11px]">{g.title_en || 'Untitled Image'}</h5>
                <span className="block text-[8px] text-neutral-500 mt-0.5">Order: {g.sort_order}</span>
              </div>

              <div className="flex items-center gap-2 mt-4 justify-between">
                {/* Reorder Arrows */}
                <div className="flex gap-1">
                  <button 
                    disabled={idx === 0} 
                    onClick={() => handleSortChange(g, 'up')}
                    className="p-1 hover:bg-neutral-800 text-neutral-400 disabled:opacity-20 rounded cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    disabled={idx === items.length - 1} 
                    onClick={() => handleSortChange(g, 'down')}
                    className="p-1 hover:bg-neutral-800 text-neutral-400 disabled:opacity-20 rounded cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleEditClick(g)} className="p-1.5 hover:bg-neutral-800 text-neutral-300 rounded cursor-pointer">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(g.id)} className="p-1.5 hover:bg-rose-500/10 text-rose-400 rounded cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload/Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-neutral-950/20">
              <h4 className="font-serif text-sm font-bold text-white uppercase">{isNew ? 'Upload Photo' : 'Edit Photo Metadata'}</h4>
              <button onClick={() => setEditingItem(null)} className="p-1.5 hover:bg-neutral-850 rounded-full cursor-pointer text-neutral-400 hover:text-white">
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              
              {/* Drag Drop or paste */}
              <div className="space-y-2">
                <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Upload File / Paste URL</label>
                <div className="border border-dashed border-white/10 rounded-2xl p-4 text-center relative flex flex-col items-center justify-center">
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  <Upload className="w-6 h-6 text-neutral-400 mb-1.5" />
                  <span className="block text-[10px] text-neutral-300">Drag & Drop Image here</span>
                </div>
                <input 
                  type="text" 
                  placeholder="Or paste URL: https://..." 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-gold-450 mt-2"
                />
              </div>

              {/* Title EN / ID */}
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Photo Title (English)</label>
                <input type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder="Main Pool Sunset" className="w-full px-3 py-2 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Judul Foto (Bahasa Indonesia)</label>
                <input type="text" value={titleId} onChange={(e) => setTitleId(e.target.value)} placeholder="Sunset Kolam Utama" className="w-full px-3 py-2 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" />
              </div>

              {/* Category */}
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-neutral-300">
                  <option value="villas">Villas</option>
                  <option value="suites">Suites</option>
                  <option value="facilities">Facilities</option>
                  <option value="interior">Interior</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Sort Order key</label>
                <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className="w-full px-3 py-2 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-full font-bold uppercase tracking-wider text-[9px] cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-full font-bold uppercase tracking-wider text-[9px] cursor-pointer shadow-md">
                  Upload & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}

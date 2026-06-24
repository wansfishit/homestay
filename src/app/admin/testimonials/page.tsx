'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { db, Testimonial } from '../../../lib/db';
import { useAuth } from '../../../context/AuthContext';
import { Plus, Edit, Trash2, Check, X as CloseIcon, Star } from 'lucide-react';

export default function AdminTestimonialManager() {
  const { isDemo } = useAuth();
  
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<Testimonial> | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Field states
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [rating, setRating] = useState(5);
  const [commentEn, setCommentEn] = useState('');
  const [commentId, setCommentId] = useState('');

  // Toast
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const loadTestimonials = async () => {
    const list = await db.getTestimonials();
    setItems(list);
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleEditClick = (t: Testimonial) => {
    setEditingItem(t);
    setIsNew(false);
    setName(t.name);
    setAvatar(t.avatar || '');
    setRating(t.rating);
    setCommentEn(t.comment_en);
    setCommentId(t.comment_id);
  };

  const handleCreateClick = () => {
    setEditingItem({});
    setIsNew(true);
    setName('');
    setAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200');
    setRating(5);
    setCommentEn('');
    setCommentId('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) {
      triggerToast('Demo Mode Active. Editing is disabled.', 'error');
      return;
    }

    if (!name || !commentEn || !commentId) {
      triggerToast('Name and comment inputs are required.', 'error');
      return;
    }

    const payload: Testimonial = {
      id: editingItem?.id || `test-${Date.now()}`,
      name,
      avatar: avatar || undefined,
      rating,
      comment_en: commentEn,
      comment_id: commentId,
      created_at: editingItem?.created_at || new Date().toISOString()
    };

    try {
      await db.saveTestimonial(payload);
      triggerToast(isNew ? 'Testimonial created.' : 'Testimonial updated.');
      setEditingItem(null);
      loadTestimonials();
    } catch {
      triggerToast('Save failed.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (isDemo) {
      triggerToast('Demo Mode Active. Editing is disabled.', 'error');
      return;
    }

    if (window.confirm('Delete this testimonial record?')) {
      const success = await db.deleteTestimonial(id);
      if (success) {
        triggerToast('Testimonial deleted.');
        loadTestimonials();
      }
    }
  };

  return (
    <AdminLayout title="Reviews Manager">
      
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl border text-xs font-semibold shadow-xl flex items-center gap-2.5 transition-all ${
          toast.type === 'success' ? 'bg-emerald-950 border-emerald-500/30 text-emerald-450' : 'bg-rose-955 border-rose-500/30 text-rose-455'
        }`}>
          <Check className="w-4 h-4" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Action */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleCreateClick}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-white rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          Create Review Item
        </button>
      </div>

      {/* List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((t) => (
          <div key={t.id} className="bg-neutral-900 border border-white/5 p-6 rounded-3xl flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex text-gold-400">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <p className="text-xs text-neutral-350 leading-relaxed italic">&ldquo;{t.comment_en}&rdquo;</p>
              <p className="text-[11px] text-neutral-500 leading-relaxed italic border-t border-white/5 pt-3">&ldquo;{t.comment_id}&rdquo;</p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
              <div className="flex items-center gap-3">
                {t.avatar && <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover" />}
                <span className="font-bold text-white text-xs">{t.name}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEditClick(t)} className="px-3 py-1.5 border border-white/5 hover:border-gold-500 bg-neutral-950/20 text-neutral-350 hover:text-white rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer">
                  Edit
                </button>
                <button onClick={() => handleDelete(t.id)} className="p-1.5 hover:bg-rose-500/10 text-rose-455 rounded-xl cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-neutral-950/20">
              <h4 className="font-serif text-sm font-bold text-white uppercase">{isNew ? 'Create Review' : 'Edit Review Details'}</h4>
              <button onClick={() => setEditingItem(null)} className="p-1.5 hover:bg-neutral-850 rounded-full cursor-pointer text-neutral-400 hover:text-white">
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Author Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Charlotte Dubois" className="w-full px-3 py-2 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" required />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Avatar Photo URL</label>
                  <input type="text" value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://images.unsplash.com/..." className="w-full px-3 py-2 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" />
                </div>
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Rating Rating (1-5)</label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full px-3 py-2 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-neutral-300">
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Commentary (English)</label>
                <textarea value={commentEn} onChange={(e) => setCommentEn(e.target.value)} rows={3} className="w-full px-3 py-2 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white resize-none" required />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Ulasan (Bahasa Indonesia)</label>
                <textarea value={commentId} onChange={(e) => setCommentId(e.target.value)} rows={3} className="w-full px-3 py-2 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white resize-none" required />
              </div>

              <div className="flex gap-2 justify-end pt-4 bg-neutral-950/20 p-6 -mx-6 -mb-6 rounded-b-3xl">
                <button type="button" onClick={() => setEditingItem(null)} className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-full font-bold uppercase tracking-wider text-[9px] cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-full font-bold uppercase tracking-wider text-[9px] cursor-pointer shadow-md">Save Review</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { db, Blog, BlogCategory } from '../../../lib/db';
import { useAuth } from '../../../context/AuthContext';
import { Plus, Edit, Trash2, Check, X as CloseIcon, FileText } from 'lucide-react';

export default function AdminBlogManager() {
  const { isDemo } = useAuth();
  
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [editingPost, setEditingPost] = useState<Partial<Blog> | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Field states
  const [titleEn, setTitleEn] = useState('');
  const [titleId, setTitleId] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [summaryEn, setSummaryEn] = useState('');
  const [summaryId, setSummaryId] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [contentId, setContentId] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  // Toast
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const loadBlogs = async () => {
    const list = await db.getBlogs();
    setBlogs(list);
    const cats = await db.getBlogCategories();
    setCategories(cats);
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleEditClick = (b: Blog) => {
    setEditingPost(b);
    setIsNew(false);
    
    setTitleEn(b.title_en);
    setTitleId(b.title_id);
    setSlug(b.slug);
    setCategoryId(b.category_id || '');
    setSummaryEn(b.summary_en);
    setSummaryId(b.summary_id);
    setContentEn(b.content_en);
    setContentId(b.content_id);
    setThumbnailUrl(b.thumbnail_url);
    setTagsInput(b.tags.join(', '));
    setIsPublished(b.is_published);
  };

  const handleCreateClick = () => {
    setEditingPost({});
    setIsNew(true);
    
    setTitleEn('');
    setTitleId('');
    setSlug('');
    setCategoryId(categories[0]?.id || '');
    setSummaryEn('');
    setSummaryId('');
    setContentEn('');
    setContentId('');
    setThumbnailUrl('https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800');
    setTagsInput('Travel, Guide');
    setIsPublished(true);
  };

  const handleTitleChange = (val: string) => {
    setTitleEn(val);
    if (isNew) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) {
      triggerToast('Demo Mode Active. Editing is disabled.', 'error');
      return;
    }

    if (!titleEn || !titleId || !slug || !contentEn || !contentId) {
      triggerToast('Mandatory fields missing.', 'error');
      return;
    }

    const payload: Blog = {
      id: editingPost?.id || `blog-${Date.now()}`,
      category_id: categoryId,
      title_en: titleEn,
      title_id: titleId,
      slug,
      summary_en: summaryEn,
      summary_id: summaryId,
      content_en: contentEn,
      content_id: contentId,
      thumbnail_url: thumbnailUrl,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      is_published: isPublished,
      created_at: editingPost?.created_at || new Date().toISOString()
    };

    try {
      await db.saveBlog(payload);
      triggerToast(isNew ? 'New blog article created.' : 'Blog article updated.');
      setEditingPost(null);
      loadBlogs();
    } catch {
      triggerToast('Save failed.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (isDemo) {
      triggerToast('Demo Mode Active. Editing is disabled.', 'error');
      return;
    }

    if (window.confirm('Delete this blog post?')) {
      const success = await db.deleteBlog(id);
      if (success) {
        triggerToast('Post deleted.');
        loadBlogs();
      }
    }
  };

  return (
    <AdminLayout title="Journal Editor">
      
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
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-md cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Blog Post
        </button>
      </div>

      {/* Blogs catalog list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((b) => (
          <div key={b.id} className="bg-neutral-900 border border-white/5 p-4 rounded-3xl flex gap-4 items-center group">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-neutral-950 shrink-0">
              <img src={b.thumbnail_url} alt={b.title_en} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between h-24">
              <div>
                <h4 className="font-serif text-sm font-bold text-white truncate leading-snug">{b.title_en}</h4>
                <span className="text-[9px] uppercase tracking-wider text-neutral-450 font-bold block mt-1">{b.category_name}</span>
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-wider rounded ${
                  b.is_published 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-neutral-800 text-neutral-500 border-white/10'
                }`}>
                  {b.is_published ? 'Published' : 'Draft'}
                </span>

                <div className="flex gap-2">
                  <button onClick={() => handleEditClick(b)} className="px-3 py-1.5 border border-white/5 hover:border-gold-500 bg-neutral-950/20 text-neutral-350 hover:text-white rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(b.id)} className="p-1.5 hover:bg-rose-500/10 text-rose-400 rounded-xl cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-neutral-950/20 sticky top-0 z-10">
              <h4 className="font-serif text-sm font-bold text-white uppercase">{isNew ? 'Create Post' : 'Edit Post Details'}</h4>
              <button onClick={() => setEditingPost(null)} className="p-1.5 hover:bg-neutral-850 rounded-full cursor-pointer text-neutral-400 hover:text-white">
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6 text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Post Title (English)</label>
                  <input type="text" value={titleEn} onChange={(e) => handleTitleChange(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" required />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Slug URL</label>
                  <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Judul Artikel (Bahasa Indonesia)</label>
                  <input type="text" value={titleId} onChange={(e) => setTitleId(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" required />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Category</label>
                  <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-neutral-300">
                    {categories.map(c => (
                      <option key={c.id} value={c.id} className="bg-neutral-900">{c.name_en}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Thumbnail URL</label>
                  <input type="text" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Summary (English)</label>
                  <input type="text" value={summaryEn} onChange={(e) => setSummaryEn(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Ringkasan (Bahasa Indonesia)</label>
                  <input type="text" value={summaryId} onChange={(e) => setSummaryId(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Content body (English, HTML tags supported)</label>
                  <textarea value={contentEn} onChange={(e) => setContentEn(e.target.value)} rows={6} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white resize-none" required />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Konten Utama (Bahasa Indonesia, mendukung tag HTML)</label>
                  <textarea value={contentId} onChange={(e) => setContentId(e.target.value)} rows={6} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white resize-none" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Tags (Comma-separated)</label>
                  <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="Ubud, Nature, Hotel" className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <input type="checkbox" id="pub" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="w-4 h-4 rounded text-gold-600 focus:ring-gold-550 bg-neutral-955 border-white/10" />
                  <label htmlFor="pub" className="text-neutral-400 font-semibold cursor-pointer">Publish Article (Show in live blog listings immediately)</label>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 bg-neutral-950/20 p-6 -mx-6 -mb-6 rounded-b-3xl">
                <button type="button" onClick={() => setEditingPost(null)} className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-full font-bold uppercase tracking-wider text-[9px] cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-full font-bold uppercase tracking-wider text-[9px] cursor-pointer shadow-md">Save Changes</button>
              </div>

            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}

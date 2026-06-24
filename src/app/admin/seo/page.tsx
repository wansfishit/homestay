'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { db, SeoSettings } from '../../../lib/db';
import { useAuth } from '../../../context/AuthContext';
import { Globe, Save, Check, Shield } from 'lucide-react';

export default function AdminSEOManager() {
  const { isDemo } = useAuth();
  
  // Data States
  const [seoList, setSeoList] = useState<SeoSettings[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [metaTitleEn, setMetaTitleEn] = useState('');
  const [metaTitleId, setMetaTitleId] = useState('');
  const [metaDescEn, setMetaDescEn] = useState('');
  const [metaDescId, setMetaDescId] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [twitterCard, setTwitterCard] = useState('summary_large_image');
  const [robots, setRobots] = useState('index, follow');

  // Toast
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const loadSEO = async () => {
    const list = await db.getSeoSettings();
    setSeoList(list);
    
    // Set active form fields for selectedPage
    const matched = list.find(s => s.id === selectedPage);
    if (matched) {
      setMetaTitleEn(matched.meta_title_en);
      setMetaTitleId(matched.meta_title_id);
      setMetaDescEn(matched.meta_desc_en);
      setMetaDescId(matched.meta_desc_id);
      setOgImage(matched.og_image || '');
      setTwitterCard(matched.twitter_card);
      setRobots(matched.robots);
    }
  };

  useEffect(() => {
    loadSEO();
  }, [selectedPage]);

  const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) {
      triggerToast('Demo Mode Active. SEO overrides are disabled.', 'error');
      return;
    }

    const payload: SeoSettings = {
      id: selectedPage,
      meta_title_en: metaTitleEn,
      meta_title_id: metaTitleId,
      meta_desc_en: metaDescEn,
      meta_desc_id: metaDescId,
      og_image: ogImage || undefined,
      twitter_card: twitterCard,
      robots
    };

    try {
      await db.saveSeoSettings(payload);
      triggerToast(`SEO metadata updated for page: ${selectedPage.toUpperCase()}`);
      loadSEO();
    } catch {
      triggerToast('Failed to save SEO.', 'error');
    }
  };

  const pageOptions = [
    { id: 'home', label: 'Homepage / Beranda' },
    { id: 'about', label: 'About Us / Tentang Kami' },
    { id: 'rooms', label: 'Rooms Listing / Daftar Kamar' },
    { id: 'gallery', label: 'Visual Gallery / Galeri' },
    { id: 'blog', label: 'Journal Blog / Jurnal' },
    { id: 'faq', label: 'Help FAQ / Tanya Jawab' },
    { id: 'testimonials', label: 'Reviews / Ulasan Tamu' },
    { id: 'contact', label: 'Concierge Contact / Kontak' }
  ];

  return (
    <AdminLayout title="SEO Configurator">
      
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl border text-xs font-semibold shadow-xl flex items-center gap-2.5 transition-all ${
          toast.type === 'success' ? 'bg-emerald-950 border-emerald-500/30 text-emerald-450' : 'bg-rose-955 border-rose-500/30 text-rose-455'
        }`}>
          <Check className="w-4 h-4" />
          <span>{toast.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start max-w-5xl">
        
        {/* Pages Selector menu */}
        <div className="bg-neutral-900 border border-white/5 p-4 rounded-3xl space-y-2 shadow-sm">
          <span className="block text-[9px] uppercase tracking-widest text-neutral-500 font-bold px-3 mb-2.5">Target Web Page</span>
          {pageOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedPage(opt.id)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-colors uppercase cursor-pointer ${
                selectedPage === opt.id 
                  ? 'bg-gold-500 text-white' 
                  : 'text-neutral-450 hover:text-white hover:bg-neutral-850'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* SEO Editing fields */}
        <div className="lg:col-span-3 bg-neutral-900 border border-white/5 p-6 rounded-3xl space-y-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="font-serif text-sm font-bold text-white uppercase flex items-center gap-2">
              <Globe className="w-4 h-4 text-gold-550" />
              Metadata for {selectedPage.toUpperCase()}
            </h3>
            <span className="text-[9px] bg-gold-500/10 text-gold-400 border border-gold-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">SEO Ready</span>
          </div>

          <form onSubmit={handleSave} className="space-y-6 text-xs">
            
            {/* Meta Title EN/ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Meta Title (English)</label>
                <input type="text" value={metaTitleEn} onChange={(e) => setMetaTitleEn(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" required />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Meta Title (Bahasa Indonesia)</label>
                <input type="text" value={metaTitleId} onChange={(e) => setMetaTitleId(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" required />
              </div>
            </div>

            {/* Meta Description EN/ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Meta Description (English)</label>
                <textarea value={metaDescEn} onChange={(e) => setMetaDescEn(e.target.value)} rows={3} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white resize-none" required />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Meta Description (Bahasa Indonesia)</label>
                <textarea value={metaDescId} onChange={(e) => setMetaDescId(e.target.value)} rows={3} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white resize-none" required />
              </div>
            </div>

            {/* Social Sharing Share */}
            <div className="border-t border-white/5 pt-6 space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Social Sharing Cards (Open Graph / Twitter)</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Open Graph Share Image URL</label>
                  <input type="text" value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="https://..." className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Twitter Card Layout type</label>
                  <select value={twitterCard} onChange={(e) => setTwitterCard(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-neutral-300">
                    <option value="summary_large_image">Summary with Large Image (Recommended)</option>
                    <option value="summary">Summary Text Card</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Crawlers / Robots index */}
            <div className="border-t border-white/5 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Robots Crawling Instructions</label>
                <select value={robots} onChange={(e) => setRobots(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-neutral-350">
                  <option value="index, follow">index, follow (Allow Search Engines to list page)</option>
                  <option value="noindex, nofollow">noindex, nofollow (Restrict listing, e.g. for Admin pages)</option>
                </select>
              </div>

              <div className="flex gap-2.5 bg-neutral-950/40 p-4 rounded-xl border border-white/5 mt-4 text-[10px] text-neutral-500 items-start">
                <Shield className="w-4 h-4 text-gold-550 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Canonical URL tag calculations are handled dynamically at the layout level relative to client rendering endpoints.
                </p>
              </div>
            </div>

            {/* Save trigger */}
            <div className="flex justify-end pt-4 border-t border-white/5 bg-neutral-950/20 p-6 -mx-6 -mb-6 rounded-b-3xl">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-md transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                Update Page SEO
              </button>
            </div>

          </form>
        </div>

      </div>

    </AdminLayout>
  );
}

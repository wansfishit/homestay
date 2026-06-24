'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { db, SiteSettings } from '../../../lib/db';
import { useAuth } from '../../../context/AuthContext';
import { Sliders, Save, Check, RefreshCw, AlertTriangle } from 'lucide-react';

export default function AdminCMSManager() {
  const { user, isDemo, updateAdminCredentials } = useAuth();
  
  // Settings State
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Field states
  const [siteName, setSiteName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  
  const [heroTitleEn, setHeroTitleEn] = useState('');
  const [heroTitleId, setHeroTitleId] = useState('');
  const [heroSubtitleEn, setHeroSubtitleEn] = useState('');
  const [heroSubtitleId, setHeroSubtitleId] = useState('');
  const [heroImage, setHeroImage] = useState('');

  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [whatsappTemplate, setWhatsappTemplate] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const [socialFacebook, setSocialFacebook] = useState('');
  const [socialInstagram, setSocialInstagram] = useState('');
  const [socialYoutube, setSocialYoutube] = useState('');

  const [footerTextEn, setFooterTextEn] = useState('');
  const [footerTextId, setFooterTextId] = useState('');
  const [copyrightText, setCopyrightText] = useState('');

  // Toast
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [resetLoading, setResetLoading] = useState(false);

  // Security State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState('');
  const [securityError, setSecurityError] = useState('');

  const loadSettings = async () => {
    const data = await db.getSiteSettings();
    setSettings(data);

    setSiteName(data.site_name);
    setLogoUrl(data.logo_url || '');
    setFaviconUrl(data.favicon_url || '');
    
    setHeroTitleEn(data.hero_title_en);
    setHeroTitleId(data.hero_title_id);
    setHeroSubtitleEn(data.hero_subtitle_en);
    setHeroSubtitleId(data.hero_subtitle_id);
    setHeroImage(data.hero_image || '');

    setWhatsappNumber(data.whatsapp_number);
    setWhatsappTemplate(data.whatsapp_template);
    setEmail(data.email);
    setAddress(data.address);

    setSocialFacebook(data.social_facebook || '');
    setSocialInstagram(data.social_instagram || '');
    setSocialYoutube(data.social_youtube || '');

    setFooterTextEn(data.footer_text_en);
    setFooterTextId(data.footer_text_id);
    setCopyrightText(data.copyright_text || '© 2026 Aurelia Luxury Retreats. All rights reserved.');
  };

  useEffect(() => {
    loadSettings();
    if (user) {
      setAdminEmail(user.email);
    }
  }, [user]);

  const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) {
      triggerToast('Demo Mode Active. Settings modifications are disabled.', 'error');
      return;
    }

    const payload: SiteSettings = {
      id: 'general',
      site_name: siteName,
      logo_url: logoUrl || undefined,
      favicon_url: faviconUrl || undefined,
      hero_title_en: heroTitleEn,
      hero_title_id: heroTitleId,
      hero_subtitle_en: heroSubtitleEn,
      hero_subtitle_id: heroSubtitleId,
      hero_image: heroImage || undefined,
      whatsapp_number: whatsappNumber,
      whatsapp_template: whatsappTemplate,
      email,
      address,
      social_facebook: socialFacebook || undefined,
      social_instagram: socialInstagram || undefined,
      social_youtube: socialYoutube || undefined,
      footer_text_en: footerTextEn,
      footer_text_id: footerTextId,
      copyright_text: copyrightText
    };

    try {
      await db.saveSiteSettings(payload);
      triggerToast('CMS Website settings updated successfully.');
      loadSettings();
    } catch {
      triggerToast('Failed to save settings.', 'error');
    }
  };

  const handleResetDatabase = async () => {
    if (isDemo) {
      triggerToast('Demo Mode Active. Database restore is disabled.', 'error');
      return;
    }

    if (window.confirm('WARNING: This will clear local overrides and restore pre-seeded factory demo datasets. Proceed?')) {
      setResetLoading(true);
      const success = await db.resetDatabase();
      if (success) {
        triggerToast('Database restored to factory seeded defaults successfully.');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        triggerToast('Failed to reset db.', 'error');
      }
      setResetLoading(false);
    }
  };

  const handleUpdateSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) {
      setSecurityError('Demo Mode Active. Credentials modification is disabled.');
      return;
    }
    
    if (adminPassword && adminPassword !== confirmPassword) {
      setSecurityError('Passwords do not match.');
      setSecuritySuccess('');
      return;
    }

    setSecuritySuccess('');
    setSecurityError('');

    try {
      const res = await updateAdminCredentials(adminEmail, adminPassword || undefined);
      if (res.success) {
        setSecuritySuccess(res.message);
        setAdminPassword('');
        setConfirmPassword('');
      } else {
        setSecurityError(res.message);
      }
    } catch (err: any) {
      setSecurityError(err?.message || 'Failed to update credentials.');
    }
  };

  return (
    <AdminLayout title="CMS Configuration">
      
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl border text-xs font-semibold shadow-xl flex items-center gap-2.5 transition-all ${
          toast.type === 'success' ? 'bg-emerald-950 border-emerald-500/30 text-emerald-450' : 'bg-rose-955 border-rose-500/30 text-rose-455'
        }`}>
          <Check className="w-4 h-4" />
          <span>{toast.message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 text-xs max-w-4xl pb-16">
        
        {/* 1. GENERAL IDENTITY */}
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-3xl space-y-6 shadow-sm">
          <h3 className="font-serif text-base font-bold text-white uppercase border-b border-white/5 pb-3">Identity & Assets</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Homestay Brand Name</label>
              <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" required />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Custom Logo Image URL</label>
              <input type="text" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Custom Favicon URL</label>
              <input type="text" value={faviconUrl} onChange={(e) => setFaviconUrl(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" />
            </div>
          </div>
        </div>

        {/* 2. HERO DISPLAY SECTION */}
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-3xl space-y-6 shadow-sm">
          <h3 className="font-serif text-base font-bold text-white uppercase border-b border-white/5 pb-3">Hero Presentation (Homepage)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Hero Title (English)</label>
              <input type="text" value={heroTitleEn} onChange={(e) => setHeroTitleEn(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" required />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Judul Hero (Bahasa Indonesia)</label>
              <input type="text" value={heroTitleId} onChange={(e) => setHeroTitleId(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" required />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Hero Subtitle (English)</label>
              <textarea value={heroSubtitleEn} onChange={(e) => setHeroSubtitleEn(e.target.value)} rows={3} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white resize-none" required />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Sub-judul Hero (Bahasa Indonesia)</label>
              <textarea value={heroSubtitleId} onChange={(e) => setHeroSubtitleId(e.target.value)} rows={3} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white resize-none" required />
            </div>
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Hero Widescreen Backdrop Image URL</label>
            <input type="text" value={heroImage} onChange={(e) => setHeroImage(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" />
          </div>
        </div>

        {/* 3. CONTACT COORDINATES */}
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-3xl space-y-6 shadow-sm">
          <h3 className="font-serif text-base font-bold text-white uppercase border-b border-white/5 pb-3">Contact & Checkout Protocols</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">WhatsApp Mobile Number</label>
              <input type="text" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="62812..." className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" required />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Contact Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" required />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Resort Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" required />
            </div>
          </div>

          {/* WHATSAPP pre-filled text builder */}
          <div>
            <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">WhatsApp Booking Pre-Filled Message Template</label>
            <textarea 
              value={whatsappTemplate} 
              onChange={(e) => setWhatsappTemplate(e.target.value)} 
              rows={6} 
              className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white font-mono resize-none leading-relaxed" 
              required 
            />
            <p className="text-[10px] text-neutral-500 mt-2">
              Valid injection placeholders: <code>{`{name}`}</code>, <code>{`{country}`}</code>, <code>{`{check_in}`}</code>, <code>{`{check_out}`}</code>, <code>{`{nights}`}</code>, <code>{`{guests}`}</code>, <code>{`{room}`}</code>, <code>{`{total}`}</code>, <code>{`{notes}`}</code>
            </p>
          </div>
        </div>

        {/* 4. SOCIAL MEDIA LINKS */}
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-3xl space-y-6 shadow-sm">
          <h3 className="font-serif text-base font-bold text-white uppercase border-b border-white/5 pb-3">Social Media URLs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Facebook Page</label>
              <input type="text" value={socialFacebook} onChange={(e) => setSocialFacebook(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Instagram Profile</label>
              <input type="text" value={socialInstagram} onChange={(e) => setSocialInstagram(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">YouTube Channel</label>
              <input type="text" value={socialYoutube} onChange={(e) => setSocialYoutube(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" />
            </div>
          </div>
        </div>

        {/* 5. FOOTER CMS */}
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-3xl space-y-6 shadow-sm">
          <h3 className="font-serif text-base font-bold text-white uppercase border-b border-white/5 pb-3">Footer configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Footer summary (English)</label>
              <input type="text" value={footerTextEn} onChange={(e) => setFooterTextEn(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" required />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Teks Kaki (Bahasa Indonesia)</label>
              <input type="text" value={footerTextId} onChange={(e) => setFooterTextId(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" required />
            </div>
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Copyright Statement</label>
            <input type="text" value={copyrightText} onChange={(e) => setCopyrightText(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" required />
          </div>
        </div>

        {/* CMS SAVE TRIGGER */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Configurations
          </button>
        </div>

      </form>

      {/* ADMIN SECURITY SETTINGS */}
      <div className="border-t border-white/5 pt-10 mt-10 max-w-4xl">
        <form onSubmit={handleUpdateSecurity} className="bg-neutral-900 border border-white/5 p-6 rounded-3xl space-y-6 shadow-sm">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-base font-serif font-bold text-white uppercase tracking-wider">Admin Security Settings</h3>
            <p className="text-[10px] text-neutral-455 mt-1">Update your login email and password details</p>
          </div>

          {securitySuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs">
              {securitySuccess}
            </div>
          )}

          {securityError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-xs">
              {securityError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-2">Admin Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                disabled={isDemo}
                className="w-full px-3.5 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-gold-400 disabled:opacity-50"
                placeholder="admin@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-2">New Password (Optional)</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                disabled={isDemo}
                className="w-full px-3.5 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-gold-400 disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isDemo}
                className="w-full px-3.5 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-gold-400 disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isDemo}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Update Credentials
            </button>
          </div>
        </form>
      </div>

      {/* DATABASE RESTORE SYSTEM */}
      <div className="border-t border-white/5 pt-10 mt-10 max-w-4xl">
        <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-3 text-rose-455 font-bold uppercase tracking-wider text-sm">
            <AlertTriangle className="w-6 h-6 animate-bounce" />
            <span>Database Backup and Factory Restore Control</span>
          </div>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            Restoring database defaults clears local storage adjustments (custom rooms, prices, metadata logs) and seeds clean demo records. Recommended for clean initial deployment checks.
          </p>

          <button
            type="button"
            disabled={resetLoading}
            onClick={handleResetDatabase}
            className="flex items-center gap-2 px-6 py-3 border border-rose-500 hover:bg-rose-500 text-rose-400 hover:text-white rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${resetLoading ? 'animate-spin' : ''}`} />
            Restore Factory Seed Schema
          </button>
        </div>
      </div>

    </AdminLayout>
  );
}

'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation, Language } from '../../../context/LanguageContext';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Youtube, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const params = useParams();
  const rawLang = params.lang as string;
  const lang: Language = (rawLang === 'id' || rawLang === 'en') ? rawLang : 'id';
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    // Simulate API call
    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] tracking-[0.2em] font-sans uppercase font-bold text-gold-500 block mb-2">Get In Touch</span>
          <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-neutral-900 dark:text-neutral-100">
            {t('contact.title')}
          </h1>
          <div className="w-12 h-px bg-gold-400 mx-auto mt-4 mb-6" />
          <p className="font-sans text-xs md:text-sm text-neutral-500 dark:text-neutral-455 font-light leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT: Contact Card info */}
          <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-100 dark:border-neutral-850 shadow-sm space-y-10">
            <h2 className="font-serif text-2xl font-medium text-neutral-900 dark:text-neutral-100 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              Concierge Desk coordinates
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gold-50 dark:bg-gold-950/20 text-gold-600 dark:text-gold-400 rounded-2xl shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Retreat Address</h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-350 font-light leading-relaxed">
                    Jl. Raya Tirta Tawar No. 88, Ubud, Bali, Indonesia
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-gold-50 dark:bg-gold-950/20 text-gold-600 dark:text-gold-400 rounded-2xl shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Direct Call</h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-350 font-light leading-relaxed">
                    +62 812 3456 7890
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-gold-50 dark:bg-gold-950/20 text-gold-600 dark:text-gold-400 rounded-2xl shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Electronic Mail</h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-350 font-light leading-relaxed">
                    concierge@aureliaretreats.com
                  </p>
                </div>
              </div>
            </div>

            {/* Social details */}
            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-8">
              <h4 className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-4">Connect on Social Platforms</h4>
              <div className="flex items-center space-x-3">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-3 border border-neutral-200 dark:border-neutral-800 hover:border-gold-400 hover:text-gold-500 rounded-full transition-colors text-neutral-500">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-3 border border-neutral-200 dark:border-neutral-800 hover:border-gold-400 hover:text-gold-500 rounded-full transition-colors text-neutral-500">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-3 border border-neutral-200 dark:border-neutral-800 hover:border-gold-400 hover:text-gold-500 rounded-full transition-colors text-neutral-500">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: Direct Message Form */}
          <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-100 dark:border-neutral-850 shadow-lg space-y-6">
            <h3 className="font-serif text-2xl font-medium text-neutral-900 dark:text-neutral-100 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              {t('contact.formTitle')}
            </h3>

            {submitted ? (
              <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-2xl p-6 flex flex-col items-center text-center space-y-3">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
                <h4 className="font-serif text-lg font-bold">{lang === 'id' ? 'Terkirim!' : 'Message Received!'}</h4>
                <p className="text-xs text-neutral-500 font-light leading-relaxed">
                  {t('contact.success')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 dark:text-neutral-550 font-bold mb-1.5">
                    {t('book.name')}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs bg-transparent text-neutral-700 dark:text-neutral-200 outline-none focus:border-gold-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 dark:text-neutral-550 font-bold mb-1.5">
                    {t('book.email')}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@domain.com"
                    className="w-full px-3 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs bg-transparent text-neutral-700 dark:text-neutral-200 outline-none focus:border-gold-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 dark:text-neutral-550 font-bold mb-1.5">
                    Message
                  </label>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe how we can customize your luxury retreat stay..."
                    rows={5}
                    className="w-full px-3 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs bg-transparent text-neutral-700 dark:text-neutral-200 outline-none focus:border-gold-400 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-white font-sans text-xs uppercase tracking-widest rounded-full font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {t('contact.send')}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

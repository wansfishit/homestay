'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation, Language } from '../../../context/LanguageContext';
import { db, FAQ } from '../../../lib/db';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const params = useParams();
  const rawLang = params.lang as string;
  const lang: Language = (rawLang === 'id' || rawLang === 'en') ? rawLang : 'id';
  const { t, translateField } = useTranslation();

  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      const list = await db.getFAQs();
      setFaqs(list);
    };
    fetchFaqs();
  }, []);

  const filteredFaqs = faqs.filter(faq => {
    const question = translateField(faq, 'question').toLowerCase();
    const answer = translateField(faq, 'answer').toLowerCase();
    const query = searchQuery.toLowerCase();
    return question.includes(query) || answer.includes(query);
  });

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.2em] font-sans uppercase font-bold text-gold-500 block mb-2">Help Center</span>
          <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-neutral-900 dark:text-neutral-100">
            {t('faq.title')}
          </h1>
          <div className="w-12 h-px bg-gold-400 mx-auto mt-4 mb-6" />
          <p className="font-sans text-xs md:text-sm text-neutral-500 dark:text-neutral-450 font-light leading-relaxed">
            {t('faq.subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-10 w-full max-w-lg mx-auto">
          <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={lang === 'id' ? 'Cari pertanyaan...' : 'Search questions...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-xs outline-none focus:border-gold-400 transition-colors text-neutral-800 dark:text-neutral-200 shadow-sm"
          />
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div 
                  key={faq.id}
                  className="bg-white dark:bg-neutral-905 rounded-2xl border border-neutral-100 dark:border-neutral-900 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full text-left p-5 flex justify-between items-center text-neutral-800 dark:text-neutral-200 font-serif font-medium text-sm md:text-base focus:outline-none cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-gold-500 shrink-0" />
                      {translateField(faq, 'question')}
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gold-600" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-neutral-50 dark:border-neutral-900/50 font-sans text-xs text-neutral-550 dark:text-neutral-400 leading-relaxed font-light">
                      {translateField(faq, 'answer')}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-850">
              <p className="text-xs text-neutral-450">
                {lang === 'id' ? 'Tidak ada kecocokan hasil untuk pencarian Anda.' : 'No matching results found for your search query.'}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

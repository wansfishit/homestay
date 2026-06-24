'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation, Language } from '../../../context/LanguageContext';
import { db, Testimonial } from '../../../lib/db';
import { Star, ShieldCheck, Quote } from 'lucide-react';

export default function TestimonialsPage() {
  const params = useParams();
  const rawLang = params.lang as string;
  const lang: Language = (rawLang === 'id' || rawLang === 'en') ? rawLang : 'id';
  const { t, translateField } = useTranslation();

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const list = await db.getTestimonials();
      setTestimonials(list);
    };
    fetchTestimonials();
  }, []);

  const averageRating = testimonials.length > 0 
    ? (testimonials.reduce((sum, item) => sum + item.rating, 0) / testimonials.length).toFixed(1)
    : '5.0';

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] tracking-[0.2em] font-sans uppercase font-bold text-gold-500 block mb-2">Guest Ledger</span>
          <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-neutral-900 dark:text-neutral-100">
            {t('testi.title')}
          </h1>
          <div className="w-12 h-px bg-gold-400 mx-auto mt-4 mb-6" />
          <p className="font-sans text-xs md:text-sm text-neutral-500 dark:text-neutral-450 font-light leading-relaxed">
            {t('testi.subtitle')}
          </p>
        </div>

        {/* Rating Overview Badge */}
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-100 dark:border-neutral-850 shadow-sm max-w-md mx-auto text-center space-y-3 mb-16">
          <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">Average Guest Score</span>
          <h2 className="font-serif text-5xl font-bold text-neutral-800 dark:text-white">{averageRating}</h2>
          <div className="flex justify-center">
            {[...Array(5)].map((_, idx) => (
              <Star key={idx} className="w-5 h-5 fill-gold-400 text-gold-400 mx-0.5" />
            ))}
          </div>
          <p className="text-[10px] text-neutral-450 font-light">
            {lang === 'id' 
              ? `Berdasarkan ulasan tamu terverifikasi dari ${testimonials.length} kunjungan.` 
              : `Based on verified reviews from ${testimonials.length} private stays.`}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testi) => (
            <div 
              key={testi.id}
              className="bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-150/80 dark:border-neutral-850 shadow-sm flex flex-col justify-between group hover:border-gold-300 dark:hover:border-gold-900 transition-colors duration-300 relative"
            >
              <Quote className="w-8 h-8 text-gold-100 dark:text-neutral-800 absolute top-6 right-6 pointer-events-none" />
              
              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex">
                  {[...Array(testi.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold-400 text-gold-400 mx-0.5" />
                  ))}
                </div>
                
                {/* Comment */}
                <p className="font-sans text-xs text-neutral-600 dark:text-neutral-350 leading-relaxed font-light italic">
                  &ldquo;{translateField(testi, 'comment')}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-8 border-t border-neutral-100 dark:border-neutral-800 pt-5 flex items-center gap-3">
                {testi.avatar && (
                  <img 
                    src={testi.avatar} 
                    alt={testi.name}
                    className="w-9 h-9 rounded-full object-cover border border-neutral-100 dark:border-neutral-800"
                  />
                )}
                <div>
                  <span className="block font-sans text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    {testi.name}
                  </span>
                  <span className="flex items-center gap-1 text-[8px] uppercase tracking-widest text-emerald-500 font-bold mt-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    {t('testi.verified')}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

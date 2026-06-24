'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation, Language } from '../../../context/LanguageContext';
import { db, Gallery } from '../../../lib/db';
import { ZoomIn, X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

export default function GalleryPage() {
  const params = useParams();
  const rawLang = params.lang as string;
  const lang: Language = (rawLang === 'id' || rawLang === 'en') ? rawLang : 'id';
  const { t, translateField } = useTranslation();

  const [items, setItems] = useState<Gallery[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchGallery = async () => {
      const list = await db.getGalleries();
      setItems(list);
    };
    fetchGallery();
  }, []);

  const categories = [
    { id: 'all', name_en: 'All Photos', name_id: 'Semua Foto' },
    { id: 'villas', name_en: 'Villas', name_id: 'Vila' },
    { id: 'suites', name_en: 'Suites', name_id: 'Suite' },
    { id: 'facilities', name_en: 'Facilities', name_id: 'Fasilitas' },
    { id: 'interior', name_en: 'Interior', name_id: 'Interior' }
  ];

  const filteredItems = items.filter(item => selectedCategory === 'all' || item.category === selectedCategory);

  const openLightbox = (url: string) => {
    const idx = filteredItems.findIndex(item => item.image_url === url);
    if (idx >= 0) {
      setActiveIndex(idx);
      setLightboxOpen(true);
    }
  };

  const nextPhoto = () => {
    setActiveIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const prevPhoto = () => {
    setActiveIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[10px] tracking-[0.2em] font-sans uppercase font-bold text-gold-500 block mb-2">Visual Tour</span>
          <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-neutral-900 dark:text-neutral-100">
            {t('nav.gallery')}
          </h1>
          <div className="w-12 h-px bg-gold-400 mx-auto mt-4 mb-6" />
          <p className="font-sans text-xs md:text-sm text-neutral-500 dark:text-neutral-450 font-light max-w-lg mx-auto">
            {lang === 'id' 
              ? 'Telusuri keindahan visual dari homestay mewah kami, fasilitas premium, dan panorama alam Ubud.'
              : 'Immerse yourself in the visual splendor of our bespoke suites, natural infinity pool, and pristine Ubud scenery.'}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2 rounded-full font-sans text-[10px] uppercase tracking-widest font-bold transition-all border cursor-pointer ${
                  isSelected 
                    ? 'bg-gold-500 border-gold-500 text-white shadow-sm' 
                    : 'bg-white border-neutral-200 text-neutral-700 hover:border-gold-300 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-gold-900'
                }`}
              >
                {lang === 'id' ? cat.name_id : cat.name_en}
              </button>
            );
          })}
        </div>

        {/* Masonry Layout */}
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => openLightbox(item.image_url)}
              className="break-inside-avoid relative overflow-hidden rounded-3xl bg-neutral-100 border border-neutral-200/40 dark:bg-neutral-900 dark:border-neutral-850 group cursor-zoom-in aspect-[3/4]"
            >
              <img 
                src={item.image_url} 
                alt={translateField(item, 'title')} 
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                <div className="self-end p-2 bg-white/10 rounded-full border border-white/20 text-white">
                  <ZoomIn className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-gold-300 font-semibold mb-1">
                    {item.category}
                  </span>
                  <span className="font-serif text-sm text-white uppercase tracking-wider">
                    {translateField(item, 'title')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* LIGHTBOX OVERLAY */}
      {lightboxOpen && filteredItems.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button 
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button 
            onClick={prevPhoto}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white rounded-full hover:bg-white/25 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="max-w-[90vw] max-h-[85vh] flex flex-col items-center select-none">
            <img 
              src={filteredItems[activeIndex].image_url} 
              alt="zoom" 
              className="max-h-[75vh] object-contain rounded-xl"
            />
            {filteredItems[activeIndex].title_en && (
              <span className="text-white font-serif text-sm tracking-wider uppercase mt-4">
                {translateField(filteredItems[activeIndex], 'title')}
              </span>
            )}
          </div>
          
          <button 
            onClick={nextPhoto}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white rounded-full hover:bg-white/25 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          {/* Index Counter */}
          <div className="absolute bottom-6 text-white font-sans text-xs tracking-widest">
            {activeIndex + 1} / {filteredItems.length}
          </div>
        </div>
      )}

    </div>
  );
}

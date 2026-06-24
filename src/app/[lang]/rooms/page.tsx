'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation, Language } from '../../../context/LanguageContext';
import { db, Room, RoomCategory } from '../../../lib/db';
import { Users, LayoutGrid, Check, SlidersHorizontal, Eye } from 'lucide-react';

export default function RoomsPage() {
  const params = useParams();
  const rawLang = params.lang as string;
  const lang: Language = (rawLang === 'id' || rawLang === 'en') ? rawLang : 'id';
  
  const { t, translateField } = useTranslation();
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [categories, setCategories] = useState<RoomCategory[]>([]);
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(6000000);
  const [guestCount, setGuestCount] = useState<number>(0);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const allRooms = await db.getRooms();
      setRooms(allRooms);
      
      const allCats = await db.getCategories();
      setCategories(allCats);
    };
    fetchData();
  }, []);

  // Filter Logic
  const filteredRooms = rooms.filter((room) => {
    const matchesCategory = selectedCategory === 'all' || room.category_id === selectedCategory;
    const matchesPrice = room.price_per_night <= maxPrice;
    const matchesGuests = guestCount === 0 || room.capacity >= guestCount;
    return matchesCategory && matchesPrice && matchesGuests;
  });

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[10px] tracking-[0.2em] font-sans uppercase font-bold text-gold-500 block mb-2">
            Sanctuaries
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-neutral-900 dark:text-neutral-100">
            {t('rooms.title')}
          </h1>
          <div className="w-12 h-px bg-gold-400 mx-auto mt-4 mb-6" />
          <p className="font-sans text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
            {t('rooms.subtitle')}
          </p>
        </div>

        {/* Filter Toggle for Mobile */}
        <div className="flex justify-between items-center mb-8 lg:hidden bg-white dark:bg-neutral-900 p-4 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-850">
          <span className="text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
            {lang === 'id' ? 'Saring Kamar' : 'Filters'} ({filteredRooms.length})
          </span>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gold-50 dark:bg-gold-950/20 text-gold-600 dark:text-gold-400 rounded-xl text-xs font-bold"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{lang === 'id' ? 'Saring' : 'Filter'}</span>
          </button>
        </div>

        {/* Desktop & Mobile Filters layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Sidebar Filters */}
          <div className={`bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-850 shadow-sm space-y-8 lg:block ${
            showFilters ? 'block' : 'hidden'
          }`}>
            <div className="flex justify-between items-center border-b border-neutral-150 dark:border-neutral-800 pb-4">
              <h3 className="font-serif text-lg font-medium text-neutral-800 dark:text-neutral-250">
                {lang === 'id' ? 'Pencarian Saringan' : 'Refine Search'}
              </h3>
              <button 
                onClick={() => {
                  setSelectedCategory('all');
                  setMaxPrice(6000000);
                  setGuestCount(0);
                }}
                className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 hover:text-gold-500"
              >
                Reset
              </button>
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold mb-3.5">
                {lang === 'id' ? 'Tipe Akomodasi' : 'Accommodation Type'}
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                    selectedCategory === 'all' 
                      ? 'bg-gold-500 text-white' 
                      : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:text-neutral-350'
                  }`}
                >
                  <span>{lang === 'id' ? 'Semua Tipe' : 'All Types'}</span>
                  {selectedCategory === 'all' && <Check className="w-3.5 h-3.5" />}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                      selectedCategory === cat.id 
                        ? 'bg-gold-500 text-white' 
                        : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:text-neutral-350'
                    }`}
                  >
                    <span>{translateField(cat, 'name')}</span>
                    {selectedCategory === cat.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold">
                  {lang === 'id' ? 'Harga Maksimal / Malam' : 'Max Price / Night'}
                </label>
                <span className="text-xs font-semibold text-gold-600 dark:text-gold-400">
                  Rp {maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="1000000"
                max="7000000"
                step="100000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-gold-500"
              />
              <div className="flex justify-between text-[9px] text-neutral-400 mt-2 font-medium">
                <span>Rp 1.000.000</span>
                <span>Rp 7.000.000</span>
              </div>
            </div>

            {/* Guests Capacity */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold mb-3.5">
                {lang === 'id' ? 'Kapasitas Tamu' : 'Guest Capacity'}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 2, 4, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => setGuestCount(num)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      guestCount === num
                        ? 'bg-gold-500 border-gold-500 text-white shadow-sm'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 hover:border-gold-300 dark:text-neutral-300 hover:bg-neutral-55 dark:hover:bg-neutral-900/50'
                    }`}
                  >
                    {num === 0 ? 'Any' : `${num}+`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <div 
                  key={room.id}
                  className="group bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-sm border border-neutral-100 dark:border-neutral-850 flex flex-col h-full hover:shadow-xl transition-all"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={room.main_thumbnail} 
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                    
                    {/* Floating Info */}
                    <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-[9px] uppercase tracking-widest font-bold text-white px-3.5 py-1 rounded-full border border-white/10">
                      {room.category_name}
                    </span>
                    
                    <span className={`absolute top-4 right-4 text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border ${
                      room.is_available 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {room.is_available ? t('rooms.available') : t('rooms.unavailable')}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-serif text-xl font-medium text-neutral-800 dark:text-neutral-200 mb-2.5 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                      {room.name}
                    </h3>
                    <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed line-clamp-3 mb-6">
                      {translateField(room, 'description')}
                    </p>

                    {/* Room Attributes */}
                    <div className="flex gap-4 mb-6 text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-850 pt-5">
                      <div className="flex items-center gap-1.5 text-xs font-light">
                        <Users className="w-3.5 h-3.5 text-gold-500" />
                        <span>{room.capacity} {t('rooms.capacity')}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-light">
                        <LayoutGrid className="w-3.5 h-3.5 text-gold-500" />
                        <span>{room.room_size} {t('rooms.size')}</span>
                      </div>
                    </div>

                    <div className="mt-auto border-t border-neutral-100 dark:border-neutral-850 pt-5 flex items-center justify-between">
                      <div>
                        <span className="block text-[8px] uppercase tracking-widest text-neutral-400 dark:text-neutral-550">
                          {t('rooms.from')}
                        </span>
                        <span className="font-serif text-lg font-semibold text-gold-600 dark:text-gold-400">
                          Rp {room.price_per_night.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-neutral-400 ml-1">
                          / {t('rooms.perNight')}
                        </span>
                      </div>

                      <Link 
                        href={`/${lang}/rooms/${room.slug}`}
                        className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-white rounded-full font-sans text-[10px] uppercase tracking-widest font-bold transition-all shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {lang === 'id' ? 'Detail' : 'View'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white dark:bg-neutral-900 rounded-3xl p-16 border border-neutral-100 dark:border-neutral-850 text-center flex flex-col items-center">
                <SlidersHorizontal className="w-8 h-8 text-neutral-300 dark:text-neutral-700 mb-4" />
                <h3 className="font-serif text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-2">
                  {lang === 'id' ? 'Kamar Tidak Ditemukan' : 'No Rooms Found'}
                </h3>
                <p className="font-sans text-xs text-neutral-500 dark:text-neutral-450 font-light max-w-sm mb-6">
                  {lang === 'id' 
                    ? 'Cobalah menyetel ulang saringan pencarian Anda untuk menemukan akomodasi lain.' 
                    : 'Try resetting your search filters or adjusting price bounds to see other luxury stays.'}
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setMaxPrice(6000000);
                    setGuestCount(0);
                  }}
                  className="px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-full font-sans text-[10px] uppercase tracking-widest font-bold transition-colors shadow-md"
                >
                  {lang === 'id' ? 'Reset Saringan' : 'Reset All Filters'}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

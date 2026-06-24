'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation, Language } from '../../context/LanguageContext';
import { db, Room, Testimonial, Gallery, Blog, FAQ, Promotion } from '../../lib/db';
import { 
  Calendar, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Coffee, 
  Compass, 
  Volume2, 
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MessageCircle
} from 'lucide-react';


export default function HomePage() {
  const params = useParams();
  const rawLang = params.lang as string;
  const lang: Language = (rawLang === 'id' || rawLang === 'en') ? rawLang : 'id';
  
  const { t, translateField } = useTranslation();
  
  // Data States
  const [rooms, setRooms] = useState<Room[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [promos, setPromos] = useState<Promotion[]>([]);
  
  // Interactive UI States
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [activeTestiIndex, setActiveTestiIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const allRooms = await db.getRooms();
      setRooms(allRooms.filter(r => r.is_available).slice(0, 3));
      
      const allTestis = await db.getTestimonials();
      setTestimonials(allTestis.slice(0, 3));
      
      const allGals = await db.getGalleries();
      setGalleries(allGals.slice(0, 4));
      
      const allBlogs = await db.getBlogs();
      setBlogs(allBlogs.filter(b => b.is_published).slice(0, 2));
      
      const allFaqs = await db.getFAQs();
      setFaqs(allFaqs.slice(0, 3));

      const allPromos = await db.getPromotions();
      setPromos(allPromos.filter(p => p.is_active));
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const roomsSection = document.getElementById('featured-rooms');
    if (roomsSection) {
      roomsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nextTesti = () => {
    if (testimonials.length === 0) return;
    setActiveTestiIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTesti = () => {
    if (testimonials.length === 0) return;
    setActiveTestiIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative w-full">
      {/* 1. HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1600')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/45 dark:bg-black/60" />
          <div className="watermark-overlay" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 text-center text-white z-10 flex flex-col items-center">
          {/* Badge */}
          <div className="animate-fade-in inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-gold-400/40 rounded-full bg-black/30 backdrop-blur-md mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] font-semibold text-gold-300">
              {lang === 'id' ? 'Retreat Mewah Ubud' : 'Luxury Ubud Sanctuary'}
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light tracking-wide leading-tight mb-6 max-w-4xl text-neutral-100">
            {t('hero.title')}
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-sm md:text-base font-light text-neutral-200/90 max-w-2xl mb-10 leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* Booking Bar */}
          <form 
            onSubmit={handleSearch}
            className="w-full max-w-4xl bg-white/95 dark:bg-neutral-900/95 p-4 rounded-3xl md:rounded-full shadow-2xl flex flex-col md:flex-row gap-4 justify-between items-center text-neutral-800 dark:text-neutral-100 border border-gold-500/10"
          >
            {/* Check In */}
            <div className="w-full md:w-auto flex-1 flex items-center gap-3 px-4 border-b md:border-b-0 md:border-r border-neutral-100 dark:border-neutral-800 pb-3 md:pb-0">
              <Calendar className="w-4 h-4 text-gold-600 shrink-0" />
              <div className="text-left w-full">
                <label className="block text-[9px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold mb-1">
                  {t('hero.checkIn')}
                </label>
                <input 
                  type="date" 
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="block w-full bg-transparent text-xs outline-none border-none p-0 text-neutral-800 dark:text-neutral-200 font-medium cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* Check Out */}
            <div className="w-full md:w-auto flex-1 flex items-center gap-3 px-4 border-b md:border-b-0 md:border-r border-neutral-100 dark:border-neutral-800 pb-3 md:pb-0">
              <Calendar className="w-4 h-4 text-gold-600 shrink-0" />
              <div className="text-left w-full">
                <label className="block text-[9px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold mb-1">
                  {t('hero.checkOut')}
                </label>
                <input 
                  type="date" 
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="block w-full bg-transparent text-xs outline-none border-none p-0 text-neutral-800 dark:text-neutral-200 font-medium cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* Guests */}
            <div className="w-full md:w-auto flex-1 flex items-center gap-3 px-4 pb-3 md:pb-0">
              <Users className="w-4 h-4 text-gold-600 shrink-0" />
              <div className="text-left w-full">
                <label className="block text-[9px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold mb-1">
                  {t('hero.guests')}
                </label>
                <select 
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="block w-full bg-transparent text-xs outline-none border-none p-0 text-neutral-800 dark:text-neutral-200 font-medium cursor-pointer"
                >
                  <option value="1" className="dark:bg-neutral-900">1 {lang === 'id' ? 'Tamu' : 'Guest'}</option>
                  <option value="2" className="dark:bg-neutral-900">2 {lang === 'id' ? 'Tamu' : 'Guests'}</option>
                  <option value="4" className="dark:bg-neutral-900">4 {lang === 'id' ? 'Tamu' : 'Guests'}</option>
                  <option value="6" className="dark:bg-neutral-900">6+ {lang === 'id' ? 'Tamu' : 'Guests'}</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-white font-sans text-xs uppercase tracking-widest rounded-full shadow-lg transition-all font-semibold cursor-pointer shrink-0"
            >
              {t('hero.searchButton')}
            </button>
          </form>
        </div>

        {/* Bottom indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 flex flex-col items-center gap-2 animate-bounce cursor-pointer" onClick={() => document.getElementById('why-choose-us')?.scrollIntoView({ behavior: 'smooth' })}>
          <span className="text-[9px] uppercase tracking-[0.3em] font-medium text-neutral-300">Scroll Down</span>
          <ChevronDown className="w-4 h-4 text-gold-400" />
        </div>
      </section>

      {/* 2. PROMO BANNER (IF ACTIVE) */}
      {promos.length > 0 && (
        <div className="bg-gradient-to-r from-gold-800 to-gold-600 text-white text-center py-3.5 px-6 font-sans text-xs tracking-wider font-medium flex items-center justify-center gap-2 relative z-20">
          <span className="bg-white/10 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest border border-white/20">Promo</span>
          <span>{translateField(promos[0], 'title')}</span>
          <Link href={`/${lang}/rooms`} className="underline font-semibold ml-2 hover:opacity-85 transition-opacity">
            {lang === 'id' ? 'Pesan Sekarang' : 'Book Now'} &rarr;
          </Link>
        </div>
      )}

      {/* 3. WHY CHOOSE US SECTION */}
      <section id="why-choose-us" className="py-24 bg-neutral-50 dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-neutral-900 dark:text-neutral-100 mb-4">
              {t('features.title')}
            </h2>
            <div className="w-16 h-px bg-gold-400 mx-auto mb-6" />
            <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-sm border border-neutral-100 dark:border-neutral-850 hover:border-gold-300 dark:hover:border-gold-800 transition-all hover:-translate-y-1">
              <div className="w-10 h-10 bg-gold-50 dark:bg-gold-950/30 rounded-2xl flex items-center justify-center text-gold-600 dark:text-gold-400 mb-6">
                <Coffee className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-3">
                {t('feat.butler.title')}
              </h3>
              <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                {t('feat.butler.desc')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-sm border border-neutral-100 dark:border-neutral-850 hover:border-gold-300 dark:hover:border-gold-800 transition-all hover:-translate-y-1">
              <div className="w-10 h-10 bg-gold-50 dark:bg-gold-950/30 rounded-2xl flex items-center justify-center text-gold-600 dark:text-gold-400 mb-6">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-3">
                {t('feat.pool.title')}
              </h3>
              <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                {t('feat.pool.desc')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-sm border border-neutral-100 dark:border-neutral-850 hover:border-gold-300 dark:hover:border-gold-800 transition-all hover:-translate-y-1">
              <div className="w-10 h-10 bg-gold-50 dark:bg-gold-950/30 rounded-2xl flex items-center justify-center text-gold-600 dark:text-gold-400 mb-6">
                <Star className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-3">
                {t('feat.chef.title')}
              </h3>
              <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                {t('feat.chef.desc')}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-sm border border-neutral-100 dark:border-neutral-850 hover:border-gold-300 dark:hover:border-gold-800 transition-all hover:-translate-y-1">
              <div className="w-10 h-10 bg-gold-50 dark:bg-gold-950/30 rounded-2xl flex items-center justify-center text-gold-600 dark:text-gold-400 mb-6">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-3">
                {t('feat.privacy.title')}
              </h3>
              <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                {t('feat.privacy.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED ROOMS SECTION */}
      <section id="featured-rooms" className="py-24 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <span className="text-[10px] tracking-[0.2em] font-sans uppercase font-bold text-gold-500 block mb-2">
                Luxury Stays
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-neutral-900 dark:text-neutral-100">
                {t('rooms.title')}
              </h2>
            </div>
            <Link 
              href={`/${lang}/rooms`} 
              className="mt-4 md:mt-0 inline-flex items-center gap-2 group font-sans text-xs uppercase tracking-widest text-gold-600 dark:text-gold-400 font-bold hover:text-gold-700 transition-colors"
            >
              {lang === 'id' ? 'Lihat Semua Kamar' : 'View All Rooms'}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div 
                key={room.id}
                className="group relative bg-neutral-50 dark:bg-neutral-950 rounded-3xl overflow-hidden shadow-sm border border-neutral-100 dark:border-neutral-900 flex flex-col h-full hover:shadow-xl transition-all"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={room.main_thumbnail} 
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Category badge */}
                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-[9px] uppercase tracking-widest font-bold text-white px-3 py-1 rounded-full border border-white/10">
                    {room.category_name}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-serif text-xl font-medium text-neutral-800 dark:text-neutral-200 mb-2 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                    {room.name}
                  </h3>
                  <p className="font-sans text-xs text-neutral-500 dark:text-neutral-450 line-clamp-2 font-light leading-relaxed mb-6">
                    {translateField(room, 'short_description')}
                  </p>

                  <div className="mt-auto border-t border-neutral-100 dark:border-neutral-900 pt-5 flex items-center justify-between">
                    <div>
                      <span className="block text-[8px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                        {t('rooms.from')}
                      </span>
                      <span className="font-serif text-base font-semibold text-gold-600 dark:text-gold-400">
                        Rp {room.price_per_night.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-neutral-400 ml-1">
                        / {t('rooms.perNight')}
                      </span>
                    </div>

                    <Link 
                      href={`/${lang}/rooms/${room.slug}`}
                      className="px-4 py-2 border border-gold-300 dark:border-gold-900 hover:bg-gold-500 hover:text-white rounded-full font-sans text-[10px] uppercase tracking-widest font-bold transition-all text-gold-600 dark:text-gold-400 hover:border-transparent"
                    >
                      {t('rooms.viewDetail')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PHOTO GALLERY PREVIEW */}
      <section className="py-24 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] tracking-[0.2em] font-sans uppercase font-bold text-gold-500 block mb-2">Visual Tour</span>
            <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-neutral-900 dark:text-neutral-100">
              {lang === 'id' ? 'Ketenangan Terpancar' : 'Prinstine Sanctuary'}
            </h2>
            <div className="w-12 h-px bg-gold-400 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleries.map((img, i) => (
              <div 
                key={img.id}
                className={`relative overflow-hidden rounded-3xl aspect-[3/4] group ${
                  i % 2 === 1 ? 'md:translate-y-4' : ''
                }`}
              >
                <img 
                  src={img.image_url} 
                  alt="Gallery" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <span className="font-serif text-xs text-white uppercase tracking-wider">
                    {translateField(img, 'title')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 md:mt-16">
            <Link 
              href={`/${lang}/gallery`} 
              className="inline-flex items-center gap-2 bg-white dark:bg-neutral-900 border border-gold-200 dark:border-neutral-800 hover:border-gold-400 hover:bg-gold-50 dark:hover:bg-neutral-900/50 rounded-full px-6 py-3 font-sans text-xs uppercase tracking-widest text-neutral-700 dark:text-neutral-300 font-bold transition-all"
            >
              {lang === 'id' ? 'Jelajahi Galeri Penuh' : 'Explore Full Gallery'}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-neutral-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200')] bg-cover opacity-5 mix-blend-overlay" />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <span className="text-[10px] tracking-[0.2em] font-sans uppercase font-bold text-gold-400 block mb-4">
              Guest Stories
            </span>
            <div className="flex justify-center mb-6">
              {[...Array(testimonials[activeTestiIndex].rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400 mx-0.5" />
              ))}
            </div>
            
            <p className="font-serif text-xl md:text-2xl font-light italic leading-relaxed text-neutral-100 mb-8 px-4">
              &ldquo;{translateField(testimonials[activeTestiIndex], 'comment')}&rdquo;
            </p>

            <div className="flex items-center justify-center gap-3">
              {testimonials[activeTestiIndex].avatar && (
                <img 
                  src={testimonials[activeTestiIndex].avatar} 
                  alt={testimonials[activeTestiIndex].name}
                  className="w-10 h-10 rounded-full object-cover border border-white/20"
                />
              )}
              <div className="text-left">
                <span className="block font-sans text-xs font-bold tracking-wider text-white">
                  {testimonials[activeTestiIndex].name}
                </span>
                <span className="block font-sans text-[9px] uppercase tracking-widest text-gold-400 font-medium mt-0.5">
                  {t('testi.verified')}
                </span>
              </div>
            </div>

            {/* Testimonial Selectors */}
            <div className="flex justify-center space-x-2.5 mt-10">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestiIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    i === activeTestiIndex ? 'bg-gold-400 w-6' : 'bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. JOURNAL/BLOG SECTION */}
      <section className="py-24 bg-white dark:bg-neutral-950 border-t border-neutral-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] tracking-[0.2em] font-sans uppercase font-bold text-gold-500 block mb-2">Our Journal</span>
            <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-neutral-900 dark:text-neutral-100">
              {t('blog.title')}
            </h2>
            <div className="w-12 h-px bg-gold-400 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {blogs.map((post) => (
              <div key={post.id} className="group relative grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="overflow-hidden rounded-3xl aspect-[4/3] relative">
                  <img 
                    src={post.thumbnail_url} 
                    alt={post.title_en} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-gold-600 dark:text-gold-400 block mb-2">
                    {post.category_name}
                  </span>
                  <h3 className="font-serif text-lg font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors leading-snug mb-3">
                    <Link href={`/${lang}/blog/${post.slug}`}>
                      {translateField(post, 'title')}
                    </Link>
                  </h3>
                  <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-4 line-clamp-2">
                    {translateField(post, 'summary')}
                  </p>
                  <Link 
                    href={`/${lang}/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 font-sans text-[10px] uppercase tracking-widest text-neutral-800 dark:text-neutral-200 font-bold hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
                  >
                    {t('blog.readMore')}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section className="py-24 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-100 dark:border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] tracking-[0.2em] font-sans uppercase font-bold text-gold-500 block mb-2">Questions</span>
            <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-neutral-900 dark:text-neutral-100">
              {t('faq.title')}
            </h2>
            <div className="w-12 h-px bg-gold-400 mx-auto mt-4" />
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div 
                  key={faq.id}
                  className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-100 dark:border-neutral-900 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full text-left p-5 flex justify-between items-center text-neutral-800 dark:text-neutral-200 font-serif font-medium text-sm md:text-base focus:outline-none cursor-pointer"
                  >
                    <span>{translateField(faq, 'question')}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gold-600" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-neutral-50 dark:border-neutral-900/50 font-sans text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                      {translateField(faq, 'answer')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. CONTACT PREVIEW / CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-br from-gold-900 to-neutral-950 text-white text-center relative overflow-hidden border-t border-gold-800/10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1200')] bg-cover bg-center opacity-10 mix-blend-luminosity" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center">
          <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-neutral-100 mb-6">
            {lang === 'id' ? 'Siap Merasakan Kemewahan Sejati?' : 'Ready to Experience High-End Serenity?'}
          </h2>
          <p className="font-sans text-xs md:text-sm font-light text-neutral-300 max-w-xl mb-10 leading-relaxed">
            {lang === 'id' 
              ? 'Hubungi konserge kami hari ini untuk mengatur kamar,Floating breakfast khusus, and penjemputan helikopter pribadi.'
              : 'Get in touch with our concierge desk today to secure your custom private villa, organic floating breakfast, and bespoke tour plans.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
            <Link 
              href={`/${lang}/rooms`}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-white font-sans text-xs uppercase tracking-widest rounded-full font-bold shadow-lg transition-all"
            >
              {lang === 'id' ? 'Mulai Pemesanan Kamar' : 'Start My Booking'}
            </Link>
            <a 
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 border border-white/20 hover:border-gold-400 rounded-full font-sans text-xs uppercase tracking-widest text-white font-bold transition-all hover:bg-white/5"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              {t('hero.ctaWhatsApp')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

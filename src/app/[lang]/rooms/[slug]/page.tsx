'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation, Language } from '../../../../context/LanguageContext';
import { db, Room, Coupon, Booking } from '../../../../lib/db';
import { 
  Users, 
  Bed, 
  Maximize, 
  Calendar, 
  MapPin,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  CreditCard,
  MessageCircle,
  HelpCircle
} from 'lucide-react';


export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const rawLang = params.lang as string;
  const lang: Language = (rawLang === 'id' || rawLang === 'en') ? rawLang : 'id';
  
  const { t, translateField } = useTranslation();
  
  // Data States
  const [room, setRoom] = useState<Room | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestsCount, setGuestsCount] = useState(2);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientWhatsapp, setClientWhatsapp] = useState('');
  const [clientCountry, setClientCountry] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // UI Interactive States
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await db.getRoomBySlug(slug);
      setRoom(data);
      
      const allCoupons = await db.getCoupons();
      setCoupons(allCoupons.filter(c => c.is_active));
      setLoading(false);
    };
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-6">
        <h2 className="font-serif text-2xl text-neutral-800 dark:text-neutral-200 mb-2">
          {lang === 'id' ? 'Kamar Tidak Ditemukan' : 'Room Not Found'}
        </h2>
        <button onClick={() => router.push(`/${lang}/rooms`)} className="px-6 py-2.5 bg-gold-500 text-white rounded-full font-sans text-xs uppercase tracking-widest font-bold">
          {lang === 'id' ? 'Kembali ke Kamar' : 'Back to Rooms'}
        </button>
      </div>
    );
  }

  // ==========================================
  // PRICING CALCULATOR LOGIC
  // ==========================================
  
  const calculateTotal = () => {
    if (!checkIn || !checkOut) return { nights: 0, roomCharges: 0, discount: 0, total: 0 };
    
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (end <= start) return { nights: 0, roomCharges: 0, discount: 0, total: 0 };

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let roomCharges = 0;
    
    // Day-by-day calculation to adjust for weekend & seasonal rules
    const cursor = new Date(start);
    for (let i = 0; i < nights; i++) {
      const dateStr = cursor.toISOString().split('T')[0];
      const dayOfWeek = cursor.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
      
      // 1. Check seasonal pricing
      let dailyPrice = room.price_per_night;
      let matchedSeasonal = false;
      
      if (room.seasonal_price) {
        for (const rule of room.seasonal_price) {
          if (dateStr >= rule.start_date && dateStr <= rule.end_date) {
            dailyPrice = rule.price;
            matchedSeasonal = true;
            break;
          }
        }
      }
      
      // 2. Check weekend pricing (if not already matching a seasonal price override)
      if (!matchedSeasonal && room.weekend_price && (dayOfWeek === 5 || dayOfWeek === 6)) {
        dailyPrice = room.weekend_price;
      }
      
      roomCharges += dailyPrice;
      cursor.setDate(cursor.getDate() + 1); // Move to next day
    }

    // Discount calculations
    let discount = 0;
    if (activeCoupon) {
      discount = roomCharges * (activeCoupon.discount_percentage / 100);
    }

    const total = roomCharges - discount;

    return {
      nights,
      roomCharges,
      discount,
      total
    };
  };

  const invoice = calculateTotal();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    const matched = coupons.find(c => c.code.toUpperCase() === couponInput.trim().toUpperCase());
    if (matched) {
      // Check expiry date
      const today = new Date().toISOString().split('T')[0];
      if (matched.expiry_date < today) {
        setCouponError(lang === 'id' ? 'Kupon sudah kedaluwarsa.' : 'Coupon has expired.');
        setActiveCoupon(null);
      } else {
        setActiveCoupon(matched);
        setCouponSuccess(t('book.couponSuccess').replace('{percent}', String(matched.discount_percentage)));
      }
    } else {
      setCouponError(t('book.couponInvalid'));
      setActiveCoupon(null);
    }
  };

  // ==========================================
  // RESERVATION AND WHATSAPP SUBMIT
  // ==========================================
  
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut || !clientName || !clientEmail || !clientWhatsapp || !clientCountry) return;
    
    setIsSubmitting(true);

    try {
      // 1. Setup Customer data first
      // In full-stack Supabase logic, inserting booking inserts to table
      const bookingData = {
        room_id: room.id,
        room_name: room.name,
        check_in: checkIn,
        check_out: checkOut,
        guest_count: guestsCount,
        notes: clientNotes,
        status_code: 'pending' as const,
        total_nights: invoice.nights,
        total_amount: invoice.total,
        discount_amount: invoice.discount,
        promo_code: activeCoupon?.code || undefined,
        customer_name: clientName,
        customer_email: clientEmail,
        customer_whatsapp: clientWhatsapp,
        customer_country: clientCountry
      };

      // Save to database
      await db.createBooking(bookingData);

      // 2. Read Site settings to construct WhatsApp redirect
      const settings = await db.getSiteSettings();
      const whatsappNum = settings.whatsapp_number || '6281234567890';
      
      // format variables
      const template = settings.whatsapp_template || 
`Halo Aurelia Retreats, saya ingin memesan kamar.
Nama: {name}
Negara: {country}
Check In: {check_in}
Check Out: {check_out}
Jumlah Malam: {nights}
Jumlah Tamu: {guests}
Kamar: {room}
Total Harga: Rp {total}
Catatan: {notes}`;

      const whatsappText = template
        .replace('{name}', clientName)
        .replace('{country}', clientCountry)
        .replace('{check_in}', checkIn)
        .replace('{check_out}', checkOut)
        .replace('{nights}', String(invoice.nights))
        .replace('{guests}', String(guestsCount))
        .replace('{room}', room.name)
        .replace('{total}', invoice.total.toLocaleString())
        .replace('{notes}', clientNotes || '-');

      const encodedText = encodeURIComponent(whatsappText);
      const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodedText}`;

      // Open in new window/tab
      window.open(whatsappUrl, '_blank');

      // Success Redirect back to Rooms or show Success state
      router.push(`/${lang}/rooms?booked=success`);
    } catch (err) {
      console.error(err);
      alert('Checkout Failed. Check parameters and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % room.gallery_images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + room.gallery_images.length) % room.gallery_images.length);
  };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-neutral-400 mb-8 font-semibold">
          <Link href={`/${lang}`} className="hover:text-gold-500 transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/${lang}/rooms`} className="hover:text-gold-500 transition-colors">Rooms</Link>
          <span>/</span>
          <span className="text-neutral-500 dark:text-neutral-300 font-bold">{room.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* LEFT: Gallery, Description, Features */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Gallery Slider */}
            <div className="relative aspect-[16/10] bg-neutral-900 rounded-3xl overflow-hidden shadow-sm group">
              <img 
                src={room.gallery_images[activeImageIndex]} 
                alt={`${room.name} ${activeImageIndex}`}
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={() => setLightboxOpen(true)}
              />
              
              {/* Overlay shadow */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent pointer-events-none" />

              {/* Slider Arrows */}
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors cursor-pointer border border-white/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors cursor-pointer border border-white/10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Thumbnails Row inside slider */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {room.gallery_images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === activeImageIndex ? 'border-gold-400 scale-105' : 'border-white/20 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Description Tab */}
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-100 dark:border-neutral-850 shadow-sm space-y-6">
              <h2 className="font-serif text-2xl font-medium text-neutral-900 dark:text-neutral-100 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                {t('room.description')}
              </h2>
              <p className="font-sans text-sm text-neutral-600 dark:text-neutral-350 leading-relaxed font-light">
                {translateField(room, 'description')}
              </p>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-3 gap-6 bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-850 shadow-sm text-center">
              <div className="flex flex-col items-center p-4 border-r border-neutral-100 dark:border-neutral-800">
                <Users className="w-5 h-5 text-gold-500 mb-2" />
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">Capacity</span>
                <span className="font-serif text-sm font-semibold text-neutral-800 dark:text-neutral-250 mt-1">
                  {room.capacity} {t('rooms.capacity')}
                </span>
              </div>
              <div className="flex flex-col items-center p-4 border-r border-neutral-100 dark:border-neutral-800">
                <Bed className="w-5 h-5 text-gold-500 mb-2" />
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">Beds</span>
                <span className="font-serif text-sm font-semibold text-neutral-800 dark:text-neutral-250 mt-1">
                  {room.bed_type}
                </span>
              </div>
              <div className="flex flex-col items-center p-4">
                <Maximize className="w-5 h-5 text-gold-500 mb-2" />
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">Size</span>
                <span className="font-serif text-sm font-semibold text-neutral-800 dark:text-neutral-250 mt-1">
                  {room.room_size} {t('rooms.size')}
                </span>
              </div>
            </div>

            {/* Facilities Checklist */}
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-100 dark:border-neutral-850 shadow-sm">
              <h3 className="font-serif text-xl font-medium text-neutral-900 dark:text-neutral-100 mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                {t('room.facilities')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {room.facilities.map((fac, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-350">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span className="font-light">{fac}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: Booking Form & Checkout Summary */}
          <div className="space-y-6 lg:sticky lg:top-28">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-850 shadow-lg space-y-6">
              
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold">Rates</span>
                <div>
                  <span className="font-serif text-xl font-bold text-gold-600 dark:text-gold-400">
                    Rp {room.price_per_night.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-neutral-400 ml-1">/ night</span>
                </div>
              </div>

              {/* Form Input fields */}
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                
                {/* Date Fields */}
                <div className="grid grid-cols-2 gap-3 booking-calendar">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold mb-1.5">
                      Check In
                    </label>
                    <input 
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs bg-transparent text-neutral-700 dark:text-neutral-200 outline-none focus:border-gold-400 transition-colors cursor-pointer"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold mb-1.5">
                      Check Out
                    </label>
                    <input 
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs bg-transparent text-neutral-700 dark:text-neutral-200 outline-none focus:border-gold-400 transition-colors cursor-pointer"
                      required
                    />
                  </div>
                </div>

                {/* Guest select */}
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold mb-1.5">
                    {t('hero.guests')}
                  </label>
                  <select 
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs bg-transparent text-neutral-700 dark:text-neutral-200 outline-none focus:border-gold-400 cursor-pointer"
                  >
                    {[...Array(room.capacity)].map((_, i) => (
                      <option key={i} value={i + 1} className="dark:bg-neutral-900">
                        {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold mb-1.5">
                    {t('book.name')}
                  </label>
                  <input 
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs bg-transparent text-neutral-700 dark:text-neutral-200 outline-none focus:border-gold-400 transition-colors"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold mb-1.5">
                    {t('book.email')}
                  </label>
                  <input 
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="example@domain.com"
                    className="w-full px-3 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs bg-transparent text-neutral-700 dark:text-neutral-200 outline-none focus:border-gold-400 transition-colors"
                    required
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold mb-1.5">
                    {t('book.whatsapp')}
                  </label>
                  <input 
                    type="tel"
                    value={clientWhatsapp}
                    onChange={(e) => setClientWhatsapp(e.target.value)}
                    placeholder="e.g. 62812..."
                    className="w-full px-3 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs bg-transparent text-neutral-700 dark:text-neutral-200 outline-none focus:border-gold-400 transition-colors"
                    required
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold mb-1.5">
                    {t('book.country')}
                  </label>
                  <input 
                    type="text"
                    value={clientCountry}
                    onChange={(e) => setClientCountry(e.target.value)}
                    placeholder="e.g. United Kingdom"
                    className="w-full px-3 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs bg-transparent text-neutral-700 dark:text-neutral-200 outline-none focus:border-gold-400 transition-colors"
                    required
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold mb-1.5">
                    {t('book.notes')}
                  </label>
                  <textarea 
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    placeholder={t('book.notesPlaceholder')}
                    rows={3}
                    className="w-full px-3 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs bg-transparent text-neutral-700 dark:text-neutral-200 outline-none focus:border-gold-400 transition-colors resize-none"
                  />
                </div>

                {/* PROMO CODE INLINE APPLIER */}
                <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4">
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold mb-1.5">
                    {t('book.coupon')}
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="e.g. AURELIA10"
                      className="flex-1 px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs bg-transparent text-neutral-700 dark:text-neutral-200 uppercase outline-none focus:border-gold-400 transition-colors"
                    />
                    <button 
                      type="button" 
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-205 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      {t('book.applyCoupon')}
                    </button>
                  </div>
                  {couponError && <span className="text-[10px] text-rose-500 mt-1 block">{couponError}</span>}
                  {couponSuccess && <span className="text-[10px] text-emerald-500 mt-1 block">{couponSuccess}</span>}
                </div>

                {/* INVOICE SUMMARY */}
                {invoice.nights > 0 && (
                  <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-850 space-y-3.5 mt-4">
                    <span className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold border-b border-neutral-100 dark:border-neutral-850 pb-2">
                      {t('book.summary')}
                    </span>
                    
                    <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
                      <span>{t('book.roomCharge')} ({t('book.nightsCount').replace('{count}', String(invoice.nights))})</span>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        Rp {invoice.roomCharges.toLocaleString()}
                      </span>
                    </div>

                    {invoice.discount > 0 && (
                      <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400">
                        <span>{t('book.discount')} ({activeCoupon?.code})</span>
                        <span className="font-semibold">
                          - Rp {invoice.discount.toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm text-neutral-850 dark:text-white border-t border-dashed border-neutral-200 dark:border-neutral-800 pt-3">
                      <span className="font-medium">{t('book.totalAmount')}</span>
                      <span className="font-bold text-gold-600 dark:text-gold-400 text-base">
                        Rp {invoice.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmitting || invoice.nights === 0}
                  className={`w-full py-3.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-white font-sans text-xs uppercase tracking-widest rounded-full font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    (isSubmitting || invoice.nights === 0) ? 'opacity-55 cursor-not-allowed' : ''
                  }`}
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  {isSubmitting 
                    ? (lang === 'id' ? 'Memproses...' : 'Processing...') 
                    : t('book.submit')}
                </button>
              </form>
            </div>
            
            {/* Guarantee info */}
            <div className="flex items-center gap-2 px-4 py-3 bg-neutral-100/50 dark:bg-neutral-900/30 rounded-2xl border border-neutral-100 dark:border-neutral-900 text-center justify-center">
              <CreditCard className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-[10px] text-neutral-500 font-light">
                {lang === 'id' ? 'Tidak ada kartu kredit. Bayar via WhatsApp.' : 'No credit card needed. Pay via WhatsApp directly.'}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* LIGHTBOX OVERLAY */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button 
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button 
            onClick={prevImage}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white rounded-full hover:bg-white/25 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <img 
            src={room.gallery_images[activeImageIndex]} 
            alt="zoom" 
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl select-none"
          />
          
          <button 
            onClick={nextImage}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white rounded-full hover:bg-white/25 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          {/* Index Counter */}
          <div className="absolute bottom-6 text-white font-sans text-xs tracking-widest">
            {activeImageIndex + 1} / {room.gallery_images.length}
          </div>
        </div>
      )}

    </div>
  );
}

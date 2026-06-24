'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type Language = 'id' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  translateField: <T>(obj: T, fieldBaseName: string) => string;
}

const DICTIONARY: Record<Language, Record<string, string>> = {
  id: {
    // Navigation
    'nav.home': 'Beranda',
    'nav.about': 'Tentang Kami',
    'nav.rooms': 'Kamar & Vila',
    'nav.gallery': 'Galeri',
    'nav.blog': 'Jurnal',
    'nav.faq': 'Tanya Jawab',
    'nav.testimonials': 'Testimoni',
    'nav.contact': 'Kontak',
    'nav.admin': 'Admin',
    'nav.bookNow': 'Pesan Sekarang',

    // Hero Section
    'hero.title': 'Temukan Arti Sebenarnya dari Hunian Mewah',
    'hero.subtitle': 'Tempat peristirahatan premium yang tersembunyi di alam murni, dirancang untuk ketenangan mutlak.',
    'hero.ctaBooking': 'Mulai Pesan Kamar',
    'hero.ctaWhatsApp': 'Hubungi Pramutamu',
    'hero.checkIn': 'Tanggal Masuk',
    'hero.checkOut': 'Tanggal Keluar',
    'hero.guests': 'Jumlah Tamu',
    'hero.searchButton': 'Cari Kamar',

    // Features Section
    'features.title': 'Mengapa Memilih Kami',
    'features.subtitle': 'Menyajikan kenyamanan berkelas bintang lima dengan ketenangan alam Ubud yang tak tertandingi.',
    'feat.butler.title': 'Layanan Pelayan 24 Jam',
    'feat.butler.desc': 'Pramutamu pribadi kami siap mengurus semua kebutuhan perjalanan Anda kapan pun.',
    'feat.pool.title': 'Infinity Pool Pribadi',
    'feat.pool.desc': 'Berenanglah di atas kanopi hutan hujan dengan pemandangan lembah langsung.',
    'feat.chef.title': 'Koki Privat Pribadi',
    'feat.chef.desc': 'Nikmati hidangan organik segar yang disiapkan khusus oleh koki lokal ternama kami.',
    'feat.privacy.title': 'Privasi & Eksklusivitas',
    'feat.privacy.desc': 'Setiap vila terisolasi sepenuhnya untuk menjamin kedamaian total Anda.',

    // Rooms List
    'rooms.title': 'Vila & Suite Pilihan',
    'rooms.subtitle': 'Setiap akomodasi dirancang dengan arsitektur premium, pemandangan luar biasa, dan kenyamanan terbaik.',
    'rooms.from': 'Mulai dari',
    'rooms.perNight': 'malam',
    'rooms.viewDetail': 'Lihat Detail',
    'rooms.capacity': 'Tamu',
    'rooms.size': 'm²',
    'rooms.available': 'Tersedia',
    'rooms.unavailable': 'Penuh',

    // Room Detail
    'room.description': 'Deskripsi Kamar',
    'room.facilities': 'Fasilitas Kamar',
    'room.detailsTitle': 'Spesifikasi Kamar',
    'room.bedType': 'Tipe Ranjang',
    'room.capacityValue': '{count} Tamu Maksimal',
    'room.sizeValue': '{size} Meter Persegi',
    'room.checkAvailability': 'Ketersediaan Kamar',
    'room.priceWeekend': 'Harga Akhir Pekan',
    'room.priceWeekday': 'Harga Hari Kerja',

    // Booking Checkout Form
    'book.formTitle': 'Formulir Pemesanan',
    'book.name': 'Nama Lengkap',
    'book.email': 'Alamat Email',
    'book.whatsapp': 'Nomor WhatsApp (dengan kode negara, misal: 62812...)',
    'book.country': 'Asal Negara',
    'book.notes': 'Catatan Khusus / Permintaan Tambahan',
    'book.coupon': 'Kode Promo / Kupon',
    'book.applyCoupon': 'Gunakan',
    'book.couponSuccess': 'Kupon berhasil diterapkan! Diskon {percent}%',
    'book.couponInvalid': 'Kode kupon tidak valid atau kedaluwarsa.',
    'book.summary': 'Ringkasan Pemesanan',
    'book.nightsCount': '{count} Malam',
    'book.roomCharge': 'Biaya Kamar',
    'book.discount': 'Diskon Promo',
    'book.totalAmount': 'Total Pembayaran',
    'book.submit': 'Kirim & Lanjutkan ke WhatsApp',
    'book.notesPlaceholder': 'Beri tahu kami jika Anda memerlukan floating breakfast, antar-jemput bandara, atau setup bulan madu...',

    // Blog
    'blog.title': 'Jurnal & Inspirasi Perjalanan',
    'blog.subtitle': 'Ikuti catatan perjalanan, budaya lokal, dan cerita dari balik layar Aurelia Retreats.',
    'blog.readMore': 'Baca Selengkapnya',
    'blog.related': 'Artikel Terkait',
    'blog.search': 'Cari artikel...',
    'blog.categories': 'Kategori Jurnal',

    // Testimonials
    'testi.title': 'Cerita Dari Tamu Kami',
    'testi.subtitle': 'Ulasan jujur dari pelancong dunia tentang pengalaman menginap mewah mereka di Ubud.',
    'testi.verified': 'Tamu Terverifikasi',

    // FAQ
    'faq.title': 'Pertanyaan yang Sering Diajukan',
    'faq.subtitle': 'Semua hal yang perlu Anda ketahui tentang pemesanan, kebijakan, dan fasilitas homestay kami.',

    // Contact
    'contact.title': 'Hubungi Tim Konserge Kami',
    'contact.subtitle': 'Kami siap melayani kebutuhan liburan premium Anda. Hubungi kami lewat saluran berikut.',
    'contact.formTitle': 'Kirim Pesan Langsung',
    'contact.send': 'Kirim Pesan',
    'contact.success': 'Terima kasih, pesan Anda berhasil dikirim!',

    // Footer & Misc
    'footer.description': 'Rasakan kemewahan hunian kelas dunia dan keindahan alam murni di homestay pilihan kami.',
    'footer.links': 'Tautan Navigasi',
    'footer.legal': 'Hukum & Legalitas',
    'footer.privacy': 'Kebijakan Privasi',
    'footer.terms': 'Syarat & Ketentuan',
    'footer.rights': 'Hak cipta dilindungi undang-undang.',
    'site.sitemap': 'Peta Situs',
    'demo.mode.badge': 'Mode Demo Aktif',
    'demo.mode.warning': 'Mode Demo Aktif. Perubahan data dinonaktifkan.'
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.rooms': 'Rooms & Villas',
    'nav.gallery': 'Gallery',
    'nav.blog': 'Journal',
    'nav.faq': 'FAQ',
    'nav.testimonials': 'Testimonials',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    'nav.bookNow': 'Book Now',

    // Hero Section
    'hero.title': 'Uncover the True Meaning of Luxury Living',
    'hero.subtitle': 'A premium retreat tucked away in pure nature, designed for absolute serenity.',
    'hero.ctaBooking': 'Start Booking',
    'hero.ctaWhatsApp': 'Contact Concierge',
    'hero.checkIn': 'Check In',
    'hero.checkOut': 'Check Out',
    'hero.guests': 'Guests Count',
    'hero.searchButton': 'Search Rooms',

    // Features Section
    'features.title': 'Why Choose Us',
    'features.subtitle': 'Providing premium five-star comfort combined with the pristine serenity of Ubud.',
    'feat.butler.title': '24/7 Butler Service',
    'feat.butler.desc': 'Our dedicated private concierge is ready to handle all your requests at any hour.',
    'feat.pool.title': 'Private Infinity Pool',
    'feat.pool.desc': 'Swim above the tropical rainforest canopy looking directly into the deep green canyon.',
    'feat.chef.title': 'Private Gourmet Chef',
    'feat.chef.desc': 'Savor fresh organic dishes prepared exclusively by our renowned private chef.',
    'feat.privacy.title': 'Absolute Privacy',
    'feat.privacy.desc': 'Each villa is completely secluded to guarantee absolute peace and silence.',

    // Rooms List
    'rooms.title': 'Selected Villas & Suites',
    'rooms.subtitle': 'Each accommodation is designed with fine architecture, stunning views, and absolute luxury.',
    'rooms.from': 'From',
    'rooms.perNight': 'night',
    'rooms.viewDetail': 'View Details',
    'rooms.capacity': 'Guests',
    'rooms.size': 'sqm',
    'rooms.available': 'Available',
    'rooms.unavailable': 'Fully Booked',

    // Room Detail
    'room.description': 'Room Description',
    'room.facilities': 'Room Facilities',
    'room.detailsTitle': 'Specifications',
    'room.bedType': 'Bed Configuration',
    'room.capacityValue': '{count} Max Guests',
    'room.sizeValue': '{size} Sqm Area',
    'room.checkAvailability': 'Availability',
    'room.priceWeekend': 'Weekend Rate',
    'room.priceWeekday': 'Weekday Rate',

    // Booking Checkout Form
    'book.formTitle': 'Booking Details',
    'book.name': 'Full Name',
    'book.email': 'Email Address',
    'book.whatsapp': 'WhatsApp Number (with country code, e.g. 1415...)',
    'book.country': 'Country of Origin',
    'book.notes': 'Special Requests / Additional Details',
    'book.coupon': 'Coupon / Promo Code',
    'book.applyCoupon': 'Apply',
    'book.couponSuccess': 'Coupon applied! Discount {percent}% off',
    'book.couponInvalid': 'Invalid or expired promo code.',
    'book.summary': 'Booking Summary',
    'book.nightsCount': '{count} Nights',
    'book.roomCharge': 'Room Charges',
    'book.discount': 'Promo Discount',
    'book.totalAmount': 'Total Amount',
    'book.submit': 'Confirm & Book via WhatsApp',
    'book.notesPlaceholder': 'Let us know if you need airport pickup, floating breakfast, or romantic setup...',

    // Blog
    'blog.title': 'Travel Journal & Stories',
    'blog.subtitle': 'Read our local Ubud travel guides, cultural deep-dives, and villa stories.',
    'blog.readMore': 'Read Full Article',
    'blog.related': 'Related Articles',
    'blog.search': 'Search journal...',
    'blog.categories': 'Categories',

    // Testimonials
    'testi.title': 'Guest Testimonials',
    'testi.subtitle': 'Honest words from world travelers about their luxury stay in Ubud.',
    'testi.verified': 'Verified Guest',

    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Everything you need to know about our luxury bookings, policies, and facilities.',

    // Contact
    'contact.title': 'Contact Our Concierge',
    'contact.subtitle': 'We are ready to arrange your luxury retreat. Reach out to us via these direct channels.',
    'contact.formTitle': 'Send Us a Message',
    'contact.send': 'Send Message',
    'contact.success': 'Thank you, your message has been sent successfully!',

    // Footer & Misc
    'footer.description': 'Experience premium living and high-end serenity at our selected luxury homestays.',
    'footer.links': 'Navigation Links',
    'footer.legal': 'Legal & Compliance',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.rights': 'All rights reserved.',
    'site.sitemap': 'Sitemap',
    'demo.mode.badge': 'Demo Mode Active',
    'demo.mode.warning': 'Demo Mode Active. Changes are disabled.'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode; currentLang: Language }> = ({ children, currentLang }) => {
  const [lang, setLangState] = useState<Language>(currentLang);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (currentLang !== lang) {
      setLangState(currentLang);
    }
  }, [currentLang]);

  const setLang = (newLang: Language) => {
    if (newLang === lang) return;
    setLangState(newLang);
    
    // Replace URL lang segment
    // Pathname starts with /[lang] -> e.g. /id/rooms -> /en/rooms
    const segments = pathname.split('/');
    if (segments[1] === 'id' || segments[1] === 'en') {
      segments[1] = newLang;
    } else {
      segments.splice(1, 0, newLang);
    }
    router.push(segments.join('/'));
  };

  const t = (key: string): string => {
    return DICTIONARY[lang][key] || key;
  };

  const translateField = <T,>(obj: T, fieldBaseName: string): string => {
    if (!obj) return '';
    const localizedKey = `${fieldBaseName}_${lang}` as keyof T;
    const fallbackKey = `${fieldBaseName}_en` as keyof T;
    
    if (obj[localizedKey]) {
      return String(obj[localizedKey]);
    }
    if (obj[fallbackKey]) {
      return String(obj[fallbackKey]);
    }
    
    // Check direct field mapping if no lang suffix exists
    const directKey = fieldBaseName as keyof T;
    if (obj[directKey]) {
      return String(obj[directKey]);
    }
    return '';
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, translateField }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

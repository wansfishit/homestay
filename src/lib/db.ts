import { supabase } from './supabase';

// ==========================================
// 1. DATA INTERFACES
// ==========================================

export interface Role {
  id: string;
  name: string;
}

export interface Profile {
  id: string;
  email: string;
  role_id?: string;
  role_name?: string;
}

export interface RoomCategory {
  id: string;
  name_en: string;
  name_id: string;
  slug: string;
}

export interface Room {
  id: string;
  category_id?: string;
  category_name?: string;
  name: string;
  slug: string;
  description_en: string;
  description_id: string;
  short_description_en: string;
  short_description_id: string;
  price_per_night: number;
  weekend_price?: number;
  seasonal_price?: { start_date: string; end_date: string; price: number }[];
  capacity: number;
  bed_type: string;
  room_size: number;
  is_available: boolean;
  main_thumbnail: string;
  gallery_images: string[];
  facilities: string[];
}

export interface Booking {
  id: string;
  room_id: string;
  room_name?: string;
  customer_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_whatsapp?: string;
  customer_country?: string;
  check_in: string;
  check_out: string;
  guest_count: number;
  notes?: string;
  status_code: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_nights: number;
  total_amount: number;
  discount_amount: number;
  promo_code?: string;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  country: string;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  comment_en: string;
  comment_id: string;
  created_at: string;
}

export interface Gallery {
  id: string;
  image_url: string;
  title_en?: string;
  title_id?: string;
  category: string;
  sort_order: number;
  created_at: string;
}

export interface BlogCategory {
  id: string;
  name_en: string;
  name_id: string;
  slug: string;
}

export interface Blog {
  id: string;
  category_id?: string;
  category_name?: string;
  title_en: string;
  title_id: string;
  slug: string;
  content_en: string;
  content_id: string;
  summary_en: string;
  summary_id: string;
  thumbnail_url: string;
  tags: string[];
  is_published: boolean;
  created_at: string;
}

export interface FAQ {
  id: string;
  question_en: string;
  question_id: string;
  answer_en: string;
  answer_id: string;
  sort_order: number;
}

export interface Coupon {
  id: string;
  code: string;
  discount_percentage: number;
  expiry_date: string;
  is_active: boolean;
}

export interface Promotion {
  id: string;
  banner_url: string;
  title_en: string;
  title_id: string;
  description_en?: string;
  description_id?: string;
  is_active: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'booking' | 'alert';
  is_read: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_email?: string;
  action: string;
  details: string;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  logo_url?: string;
  favicon_url?: string;
  hero_title_en: string;
  hero_title_id: string;
  hero_subtitle_en: string;
  hero_subtitle_id: string;
  hero_image?: string;
  whatsapp_number: string;
  whatsapp_template: string;
  email: string;
  address: string;
  social_facebook?: string;
  social_instagram?: string;
  social_youtube?: string;
  footer_text_en: string;
  footer_text_id: string;
  copyright_text: string;
}

export interface SeoSettings {
  id: string; // home, about, rooms, gallery, blog, faq, testimonials, contact
  meta_title_en: string;
  meta_title_id: string;
  meta_desc_en: string;
  meta_desc_id: string;
  og_image?: string;
  twitter_card: string;
  canonical_url?: string;
  robots: string;
}

// ==========================================
// 2. PRE-SEEDED MOCK DATA (FALLBACK STORE)
// ==========================================

const INITIAL_CATEGORIES: RoomCategory[] = [
  { id: 'cat-1', name_en: 'Luxury Villa', name_id: 'Villa Mewah', slug: 'luxury-villa' },
  { id: 'cat-2', name_en: 'Ocean Suite', name_id: 'Suite Samudra', slug: 'ocean-suite' },
  { id: 'cat-3', name_en: 'Private Retreat', name_id: 'Peristirahatan Pribadi', slug: 'private-retreat' }
];

const INITIAL_ROOMS: Room[] = [
  {
    id: 'room-1',
    category_id: 'cat-1',
    name: 'The Grand Aurelia Villa',
    slug: 'grand-aurelia-villa',
    description_en: 'Spanning across beautiful tropical gardens, the Grand Aurelia Villa offers absolute seclusion with a 15-meter private infinity pool, a state-of-the-art designer kitchen, and panoramic valley views. Perfect for families or travelers looking for private resort luxury.',
    description_id: 'Terbentang di tengah taman tropis yang indah, Grand Aurelia Villa menawarkan privasi mutlak dengan kolam renang infinity pribadi sepanjang 15 meter, dapur desainer modern, dan pemandangan lembah yang luas. Sangat cocok untuk keluarga atau wisatawan yang menginginkan kemewahan resort pribadi.',
    short_description_en: 'A spectacular 3-bedroom sanctuary with infinity pool and butler service.',
    short_description_id: 'Tempat perlindungan 3 kamar tidur yang spektakuler dengan kolam renang infinity dan layanan pelayan.',
    price_per_night: 4500000,
    weekend_price: 5200000,
    seasonal_price: [
      { start_date: '2026-12-20', end_date: '2026-01-05', price: 6500000 }
    ],
    capacity: 6,
    bed_type: '3 King Beds',
    room_size: 320,
    is_available: true,
    main_thumbnail: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200',
    gallery_images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200'
    ],
    facilities: ['Private Infinity Pool', '24/7 Butler Service', 'Designer Kitchen', 'High-Speed Wi-Fi', 'Smart TV', 'Outdoor Rainfall Shower', 'Complimentary Floating Breakfast']
  },
  {
    id: 'room-2',
    category_id: 'cat-2',
    name: 'Presidential Ocean Suite',
    slug: 'presidential-ocean-suite',
    description_en: 'Wake up to the gentle whispers of the sea. Located right on the oceanfront reef, this suite combines luxury glass architecture with natural stone elements. Complete with an open-air jacuzzi, custom teak furniture, and private sunset lounge deck.',
    description_id: 'Bangun dengan bisikan laut yang lembut. Terletak tepat di depan terumbu karang tepi laut, suite ini memadukan arsitektur kaca mewah dengan elemen batu alam. Lengkap dengan jacuzzi terbuka, furnitur jati kustom, dan dek bersantai sunset pribadi.',
    short_description_en: 'An elegant oceanfront haven featuring a private jacuzzi and sunset balcony.',
    short_description_id: 'Surga tepi pantai yang elegan dengan jacuzzi pribadi dan balkon matahari terbenam.',
    price_per_night: 2800000,
    weekend_price: 3100000,
    capacity: 2,
    bed_type: '1 Super King Bed',
    room_size: 140,
    is_available: true,
    main_thumbnail: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200',
    gallery_images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200'
    ],
    facilities: ['Private Jacuzzi', 'Oceanfront Balcony', 'Mini Bar Premium', 'Sound System Marshall', 'High-Speed Wi-Fi', 'Nespresso Coffee Machine']
  },
  {
    id: 'room-3',
    category_id: 'cat-3',
    name: 'Jungle Sanctuary Canopy',
    slug: 'jungle-sanctuary-canopy',
    description_en: 'Suspended elegantly above the jungle canopy, this luxury retreat blends glass walls with organic bamboo architecture. Unwind in the copper bathtub under the stars, or step out onto the net lounge suspended over the green rainforest canyon.',
    description_id: 'Tergantung elegan di atas kanopi hutan, peristirahatan mewah ini memadukan dinding kaca dengan arsitektur bambu organik. Bersantailah di bak mandi tembaga di bawah bintang-bintang, atau melangkah keluar ke jaring gantung di atas ngarai hutan hujan hijau.',
    short_description_en: 'A high-end bamboo retreat with copper bathtub and canyon hammock nets.',
    short_description_id: 'Peristirahatan bambu kelas atas dengan bak mandi tembaga dan jaring tempat tidur gantung ngarai.',
    price_per_night: 3200000,
    weekend_price: 3600000,
    capacity: 2,
    bed_type: '1 King Bed',
    room_size: 110,
    is_available: true,
    main_thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200',
    gallery_images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200'
    ],
    facilities: ['Copper Soaking Tub', 'Suspended Net Lounge', 'Jungle Canyon View', 'Organic Bathroom Amenities', 'High-Speed Wi-Fi', 'Complimentary Mini Bar']
  }
];

const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Charlotte Dubois',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
    rating: 5,
    comment_en: 'An absolute masterpiece of luxury and relaxation. The Grand Aurelia Villa was breathtaking, the staff anticipated our every need, and the views were unmatched. We will certainly return.',
    comment_id: 'Mahakarya kemewahan dan relaksasi yang mutlak. Grand Aurelia Villa sangat menakjubkan, para staf mengantisipasi setiap kebutuhan kami, dan pemandangannya tiada tanding. Kami pasti akan kembali.',
    created_at: '2026-05-15T08:00:00Z'
  },
  {
    id: 'test-2',
    name: 'Raymond Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    rating: 5,
    comment_en: 'The level of service here beats five-star hotels. Waking up in the Ocean Suite with panoramic views of the turquoise sea was a dream. The WhatsApp response for bookings was incredibly fast!',
    comment_id: 'Tingkat layanan di sini mengalahkan hotel bintang lima. Bangun di Ocean Suite dengan pemandangan panorama laut pirus adalah mimpi. Respon WhatsApp untuk pemesanan sangat cepat!',
    created_at: '2026-06-02T14:30:00Z'
  }
];

const INITIAL_GALLERY: Gallery[] = [
  { id: 'gal-1', image_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800', title_en: 'Grand Villa Pool', title_id: 'Kolam renang Grand Villa', category: 'villas', sort_order: 1, created_at: '2026-01-01T00:00:00Z' },
  { id: 'gal-2', image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800', title_en: 'Presidential Ocean Suite View', title_id: 'Pemandangan Suite Samudra', category: 'suites', sort_order: 2, created_at: '2026-01-02T00:00:00Z' },
  { id: 'gal-3', image_url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800', title_en: 'Infinity Main Pool', title_id: 'Kolam Utama Infinity', category: 'facilities', sort_order: 3, created_at: '2026-01-03T00:00:00Z' },
  { id: 'gal-4', image_url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800', title_en: 'Villa Bed details', title_id: 'Detail Ranjang Villa', category: 'interior', sort_order: 4, created_at: '2026-01-04T00:00:00Z' },
  { id: 'gal-5', image_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800', title_en: 'Luxury Spa Room', title_id: 'Ruang Spa Mewah', category: 'facilities', sort_order: 5, created_at: '2026-01-05T00:00:00Z' },
  { id: 'gal-6', image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800', title_en: 'Organic Dining Setup', title_id: 'Desain Makan Organik', category: 'interior', sort_order: 6, created_at: '2026-01-06T00:00:00Z' }
];

const INITIAL_BLOG_CATEGORIES: BlogCategory[] = [
  { id: 'bcat-1', name_en: 'Local Guides', name_id: 'Panduan Lokal', slug: 'local-guides' },
  { id: 'bcat-2', name_en: 'Resort Living', name_id: 'Gaya Hidup Resort', slug: 'resort-living' }
];

const INITIAL_BLOGS: Blog[] = [
  {
    id: 'blog-1',
    category_id: 'bcat-2',
    title_en: 'Designing Luxury: The Architecture Behind Aurelia Retreats',
    title_id: 'Mendesain Kemewahan: Arsitektur di Balik Aurelia Retreats',
    slug: 'designing-luxury-architecture',
    summary_en: 'An exclusive look at how we blended state-of-the-art glass panels with natural teakwood structures.',
    summary_id: 'Tampilan eksklusif bagaimana kami memadukan panel kaca modern dengan struktur kayu jati alami.',
    content_en: '<p>Luxury is not just about expensive items; it is about harmony, space, and nature. At Aurelia, our design principles revolve around creating a seamless connection between the indoor spaces and the wild landscape outside.</p><p>We chose local sustainable materials such as Ulin ironwood and hand-cut limestone blocks. Every room features wall-to-ceiling glass doors that slide open completely, converting your bedroom into an open-air balcony hovering over the lush Balinese gorges.</p>',
    content_id: '<p>Kemewahan bukan hanya tentang barang-barang mahal; ini tentang harmoni, ruang, dan alam. Di Aurelia, prinsip desain kami berpusat pada penciptaan hubungan yang mulus antara ruang dalam ruangan dan lanskap liar di luar.</p><p>Kami memilih bahan lokal berkelanjutan seperti kayu besi Ulin dan blok batu kapur yang dipotong dengan tangan. Setiap kamar memiliki pintu kaca setinggi langit-langit yang dapat digeser terbuka sepenuhnya, mengubah kamar tidur Anda menjadi balkon terbuka di atas jurang Bali yang rimbun.</p>',
    thumbnail_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800',
    tags: ['Architecture', 'Luxury', 'Design'],
    is_published: true,
    created_at: '2026-06-10T10:00:00Z'
  },
  {
    id: 'blog-2',
    category_id: 'bcat-1',
    title_en: 'Curated Itinerary: 3 Days of Ultimate Serenity in Ubud',
    title_id: 'Rencana Perjalanan Pilihan: 3 Hari Ketenangan Mutlak di Ubud',
    slug: 'curated-itinerary-3-days-ubud',
    summary_en: 'From hidden temple springs to sunrise volcano flights, experience the luxury side of Bali.',
    summary_id: 'Dari mata air candi tersembunyi hingga penerbangan gunung berapi matahari terbit, rasakan sisi mewah Bali.',
    content_en: '<p>Ubud has long been the cultural beating heart of Bali. However, navigating it can sometimes feel rushed. We have designed an exclusive three-day itinerary for our guests that emphasizes slow living, high-end wellness, and private exploration.</p><p>Day 1: Private water purification ceremony at a hidden temple, followed by a personalized 3-hour sound healing session. Day 2: Private luxury helicopter flight around Mt. Batur, followed by a floating garden lunch. Day 3: Private villa spa day with curated organic dishes.</p>',
    content_id: '<p>Ubud telah lama menjadi pusat kebudayaan Bali. Namun, menjelajahinya terkadang terasa terburu-buru. Kami telah merancang rencana perjalanan tiga hari eksklusif untuk para tamu kami yang menekankan gaya hidup lambat, kesehatan kelas atas, dan eksplorasi pribadi.</p><p>Hari 1: Upacara pemurnian air pribadi di pura tersembunyi, dilanjutkan dengan sesi penyembuhan suara pribadi selama 3 jam. Hari 2: Penerbangan helikopter mewah pribadi di sekitar Gunung Batur, dilanjutkan dengan makan siang taman terapung. Hari 3: Hari spa villa pribadi dengan hidangan organik pilihan.</p>',
    thumbnail_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800',
    tags: ['Travel Guide', 'Ubud', 'Premium Experience'],
    is_published: true,
    created_at: '2026-06-12T12:00:00Z'
  }
];

const INITIAL_FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question_en: 'What are the check-in and check-out times?',
    question_id: 'Kapan waktu check-in dan check-out?',
    answer_en: 'Standard check-in is at 2:00 PM and check-out is at 12:00 PM. Early check-in or late check-out is subject to room availability and may incur nominal charges.',
    answer_id: 'Check-in standar pukul 14:00 dan check-out pukul 12:00. Check-in lebih awal atau check-out lebih lambat tergantung pada ketersediaan kamar dan dapat dikenakan biaya tambahan.',
    sort_order: 1
  },
  {
    id: 'faq-2',
    question_en: 'How does the booking and payment system work?',
    question_id: 'Bagaimana cara kerja sistem pemesanan dan pembayaran?',
    answer_en: 'Once you fill out the booking form, your request is saved in our database. You will then be redirected to WhatsApp to communicate directly with our hosting concierge to finalize payment and answer questions.',
    answer_id: 'Setelah Anda mengisi formulir pemesanan, permintaan Anda disimpan di database kami. Anda kemudian akan dialihkan ke WhatsApp untuk berkomunikasi langsung dengan pramutamu host kami untuk menyelesaikan pembayaran dan menjawab pertanyaan.',
    sort_order: 2
  },
  {
    id: 'faq-3',
    question_en: 'Is breakfast included in the booking rate?',
    question_id: 'Apakah sarapan sudah termasuk dalam harga pemesanan?',
    answer_en: 'Yes! All luxury villa bookings include daily gourmet floating breakfast prepared by our in-house private chef.',
    answer_id: 'Ya! Semua pemesanan villa mewah mencakup sarapan terapung gourmet harian yang disiapkan oleh koki pribadi kami.',
    sort_order: 3
  }
];

const INITIAL_COUPONS: Coupon[] = [
  { id: 'cp-1', code: 'AURELIA10', discount_percentage: 10, expiry_date: '2026-12-31', is_active: true },
  { id: 'cp-2', code: 'WINTER15', discount_percentage: 15, expiry_date: '2026-08-31', is_active: true }
];

const INITIAL_PROMOTIONS: Promotion[] = [
  { id: 'p-1', banner_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1600', title_en: 'Grand Opening - 15% Off Your Stay', title_id: 'Grand Opening - Diskon 15% Menginap', description_en: 'Use code WINTER15 at checkout to claim your discount.', description_id: 'Gunakan kode WINTER15 saat checkout untuk mengklaim diskon Anda.', is_active: true }
];

const INITIAL_SETTINGS: SiteSettings = {
  id: 'general',
  site_name: 'Aurelia Luxury Retreats',
  logo_url: '/logo.png',
  favicon_url: '/favicon.ico',
  hero_title_en: 'Uncover the True Meaning of Luxury Living',
  hero_title_id: 'Temukan Arti Sebenarnya dari Hunian Mewah',
  hero_subtitle_en: 'A premium retreat tucked away in pure nature, designed for absolute serenity.',
  hero_subtitle_id: 'Tempat peristirahatan premium yang tersembunyi di alam murni, dirancang untuk ketenangan mutlak.',
  hero_image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1600',
  whatsapp_number: '6281234567890',
  whatsapp_template: `Halo Aurelia Retreats, saya ingin memesan kamar.
Nama: {name}
Negara: {country}
Check In: {check_in}
Check Out: {check_out}
Jumlah Malam: {nights}
Jumlah Tamu: {guests}
Kamar: {room}
Total Harga: Rp {total}
Catatan: {notes}`,
  email: 'concierge@aureliaretreats.com',
  address: 'Jl. Raya Tirta Tawar No. 88, Ubud, Bali, Indonesia',
  social_facebook: 'https://facebook.com',
  social_instagram: 'https://instagram.com/aurelia.retreats',
  social_youtube: 'https://youtube.com',
  footer_text_en: 'Experience premium living and high-end serenity at our selected luxury homestays.',
  footer_text_id: 'Rasakan hunian premium dan ketenangan kelas atas di homestay mewah pilihan kami.',
  copyright_text: '© 2026 Aurelia Luxury Retreats. All rights reserved.'
};

const INITIAL_SEO: SeoSettings[] = [
  { id: 'home', meta_title_en: 'Aurelia Luxury Retreats | Ubud Bali', meta_title_id: 'Aurelia Luxury Retreats | Ubud Bali', meta_desc_en: 'Premium luxury homestay and private villas in Ubud, Bali. Discover serene, architecturally stunning sanctuaries.', meta_desc_id: 'Homestay mewah premium dan vila pribadi di Ubud, Bali. Temukan tempat perlindungan yang tenang dengan arsitektur menakjubkan.', og_image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200', twitter_card: 'summary_large_image', robots: 'index, follow' },
  { id: 'about', meta_title_en: 'About Us | Aurelia Luxury Retreats', meta_title_id: 'Tentang Kami | Aurelia Luxury Retreats', meta_desc_en: 'The story behind Bali’s most exclusive private sanctuary.', meta_desc_id: 'Kisah di balik peristirahatan pribadi paling eksklusif di Bali.', twitter_card: 'summary_large_image', robots: 'index, follow' },
  { id: 'rooms', meta_title_en: 'Our Rooms & Villas | Aurelia Luxury Retreats', meta_title_id: 'Kamar & Vila Kami | Aurelia Luxury Retreats', meta_desc_en: 'Browse our selection of premium suites, luxury villas, and bamboo forest hideaways.', meta_desc_id: 'Jelajahi pilihan suite premium, vila mewah, dan tempat persembunyian hutan bambu kami.', twitter_card: 'summary_large_image', robots: 'index, follow' },
  { id: 'gallery', meta_title_en: 'Luxury Gallery | Aurelia Luxury Retreats', meta_title_id: 'Galeri Mewah | Aurelia Luxury Retreats', meta_desc_en: 'A visual journey through our private villas, natural infinity pools, and pristine Ubud grounds.', meta_desc_id: 'Perjalanan visual melalui vila pribadi kami, kolam renang infinity alami, dan halaman Ubud yang alami.', twitter_card: 'summary_large_image', robots: 'index, follow' },
  { id: 'blog', meta_title_en: 'Journal & Stories | Aurelia Luxury Retreats', meta_title_id: 'Jurnal & Cerita | Aurelia Luxury Retreats', meta_desc_en: 'Local Ubud travel tips, private guides, and luxury lifestyle journals.', meta_desc_id: 'Tips perjalanan Ubud lokal, panduan pribadi, dan jurnal gaya hidup mewah.', twitter_card: 'summary_large_image', robots: 'index, follow' },
  { id: 'faq', meta_title_en: 'Frequently Asked Questions | Aurelia Luxury Retreats', meta_title_id: 'Tanya Jawab | Aurelia Luxury Retreats', meta_desc_en: 'Got questions about booking, catering, or local tours? Find your answers here.', meta_desc_id: 'Punya pertanyaan tentang pemesanan, katering, atau tur lokal? Temukan jawabannya di sini.', twitter_card: 'summary_large_image', robots: 'index, follow' },
  { id: 'testimonials', meta_title_en: 'Guest Reviews | Aurelia Luxury Retreats', meta_title_id: 'Ulasan Tamu | Aurelia Luxury Retreats', meta_desc_en: 'Read what travelers from around the world say about their luxury stay in Ubud.', meta_desc_id: 'Baca apa yang dikatakan pelancong dari seluruh dunia tentang masa menginap mewah mereka di Ubud.', twitter_card: 'summary_large_image', robots: 'index, follow' },
  { id: 'contact', meta_title_en: 'Contact Concierge | Aurelia Luxury Retreats', meta_title_id: 'Hubungi Pramutamu | Aurelia Luxury Retreats', meta_desc_en: 'Get in touch with our team to arrange your personalized vacation.', meta_desc_id: 'Hubungi tim kami untuk mengatur liburan pribadi Anda.', twitter_card: 'summary_large_image', robots: 'index, follow' }
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b-1',
    room_id: 'room-1',
    room_name: 'The Grand Aurelia Villa',
    check_in: '2026-07-10',
    check_out: '2026-07-15',
    guest_count: 4,
    notes: 'Please arrange a floating breakfast for the morning of July 11th.',
    status_code: 'confirmed',
    customer_name: 'Marcus Aurelius',
    customer_email: 'marcus@rome.org',
    customer_whatsapp: '39061234567',
    customer_country: 'Italy',
    total_nights: 5,
    total_amount: 22500000,
    discount_amount: 0,
    created_at: '2026-06-20T08:30:00Z'
  },
  {
    id: 'b-2',
    room_id: 'room-2',
    room_name: 'Presidential Ocean Suite',
    check_in: '2026-07-01',
    check_out: '2026-07-04',
    guest_count: 2,
    notes: 'Anniversary trip, requesting double pillows.',
    status_code: 'pending',
    customer_name: 'Jane Doe',
    customer_email: 'jane@example.com',
    customer_whatsapp: '14159876543',
    customer_country: 'United States',
    total_nights: 3,
    total_amount: 8400000,
    discount_amount: 0,
    created_at: '2026-06-23T11:15:00Z'
  }
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'notif-1', title: 'New Booking Request', message: 'Jane Doe requested a stay in Presidential Ocean Suite.', type: 'booking', is_read: false, created_at: '2026-06-23T11:15:00Z' },
  { id: 'notif-2', title: 'Payment Confirmed', message: 'Booking for Marcus Aurelius was marked as confirmed.', type: 'info', is_read: true, created_at: '2026-06-20T09:00:00Z' }
];

const INITIAL_LOGS: ActivityLog[] = [
  { id: 'log-1', user_email: 'admin@aurelia.com', action: 'LOGIN', details: 'Admin logged in from IP 192.168.1.5', created_at: '2026-06-24T05:00:00Z' },
  { id: 'log-2', user_email: 'admin@aurelia.com', action: 'EDIT', details: 'Updated general settings title.', created_at: '2026-06-24T05:10:00Z' }
];

// ==========================================
// 3. STORAGE LAYER (ISOMORPHIC LOCALSTORAGE)
// ==========================================

const getStored = <T>(key: string, initial: T): T => {
  if (typeof window === 'undefined') return initial;
  try {
    const item = localStorage.getItem(`aurelia_db_${key}`);
    return item ? JSON.parse(item) : initial;
  } catch (e) {
    return initial;
  }
};

const setStored = <T>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`aurelia_db_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
};

// ==========================================
// 4. MAIN API HANDLER
// ==========================================

export const db = {
  // Check if using Supabase or Fallback
  isSupabaseEnabled: async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.from('site_settings').select('id').limit(1);
      if (error) return false;
      return true;
    } catch {
      return false;
    }
  },

  // Categories
  getCategories: async (): Promise<RoomCategory[]> => {
    try {
      const { data, error } = await supabase.from('room_categories').select('*');
      if (!error && data && data.length > 0) return data;
    } catch {}
    return getStored('categories', INITIAL_CATEGORIES);
  },

  // Rooms
  getRooms: async (): Promise<Room[]> => {
    try {
      const { data, error } = await supabase.from('rooms').select('*');
      if (!error && data && data.length > 0) {
        // Map category names
        const cats = await db.getCategories();
        return data.map((r: Room) => ({
          ...r,
          category_name: cats.find(c => c.id === r.category_id)?.name_en || ''
        }));
      }
    } catch {}
    const localRooms = getStored('rooms', INITIAL_ROOMS);
    const cats = getStored('categories', INITIAL_CATEGORIES);
    return localRooms.map(r => ({
      ...r,
      category_name: cats.find(c => c.id === r.category_id)?.name_en || ''
    }));
  },

  getRoomBySlug: async (slug: string): Promise<Room | null> => {
    try {
      const { data, error } = await supabase.from('rooms').select('*').eq('slug', slug).single();
      if (!error && data) return data;
    } catch {}
    const rooms = await db.getRooms();
    return rooms.find(r => r.slug === slug) || null;
  },

  saveRoom: async (room: Partial<Room> & { id: string }): Promise<Room> => {
    // Audit Log
    db.addActivityLog('EDIT', `Saved room details for room ID: ${room.id} (${room.name})`);

    try {
      const { data, error } = await supabase.from('rooms').upsert(room).select().single();
      if (!error && data) return data;
    } catch {}

    const rooms = getStored('rooms', INITIAL_ROOMS);
    const idx = rooms.findIndex(r => r.id === room.id);
    const updated = { ...(rooms[idx] || {}), ...room } as Room;
    if (idx >= 0) {
      rooms[idx] = updated;
    } else {
      rooms.push(updated);
    }
    setStored('rooms', rooms);
    return updated;
  },

  createRoom: async (room: Omit<Room, 'id'>): Promise<Room> => {
    const id = `room-${Date.now()}`;
    const newRoom = { ...room, id };
    db.addActivityLog('CREATE', `Created a new room: ${room.name}`);

    try {
      const { data, error } = await supabase.from('rooms').insert(newRoom).select().single();
      if (!error && data) return data;
    } catch {}

    const rooms = getStored('rooms', INITIAL_ROOMS);
    rooms.push(newRoom);
    setStored('rooms', rooms);
    return newRoom;
  },

  deleteRoom: async (id: string): Promise<boolean> => {
    db.addActivityLog('DELETE', `Deleted room ID: ${id}`);
    try {
      const { error } = await supabase.from('rooms').delete().eq('id', id);
      if (!error) return true;
    } catch {}

    const rooms = getStored('rooms', INITIAL_ROOMS);
    const filtered = rooms.filter(r => r.id !== id);
    setStored('rooms', filtered);
    return true;
  },

  // Testimonials
  getTestimonials: async (): Promise<Testimonial[]> => {
    try {
      const { data, error } = await supabase.from('testimonials').select('*');
      if (!error && data && data.length > 0) return data;
    } catch {}
    return getStored('testimonials', INITIAL_TESTIMONIALS);
  },

  saveTestimonial: async (t: Testimonial): Promise<Testimonial> => {
    db.addActivityLog('EDIT', `Saved testimonial from: ${t.name}`);
    try {
      const { data, error } = await supabase.from('testimonials').upsert(t).select().single();
      if (!error && data) return data;
    } catch {}

    const list = getStored('testimonials', INITIAL_TESTIMONIALS);
    const idx = list.findIndex(item => item.id === t.id);
    if (idx >= 0) list[idx] = t;
    else list.push(t);
    setStored('testimonials', list);
    return t;
  },

  deleteTestimonial: async (id: string): Promise<boolean> => {
    db.addActivityLog('DELETE', `Deleted testimonial ID: ${id}`);
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (!error) return true;
    } catch {}

    const list = getStored('testimonials', INITIAL_TESTIMONIALS);
    setStored('testimonials', list.filter(t => t.id !== id));
    return true;
  },

  // Gallery
  getGalleries: async (): Promise<Gallery[]> => {
    try {
      const { data, error } = await supabase.from('galleries').select('*').order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) return data;
    } catch {}
    return getStored('galleries', INITIAL_GALLERY).sort((a,b) => a.sort_order - b.sort_order);
  },

  saveGallery: async (g: Gallery): Promise<Gallery> => {
    db.addActivityLog('EDIT', `Updated gallery item.`);
    try {
      const { data, error } = await supabase.from('galleries').upsert(g).select().single();
      if (!error && data) return data;
    } catch {}

    const list = getStored('galleries', INITIAL_GALLERY);
    const idx = list.findIndex(item => item.id === g.id);
    if (idx >= 0) list[idx] = g;
    else list.push(g);
    setStored('galleries', list);
    return g;
  },

  deleteGallery: async (id: string): Promise<boolean> => {
    db.addActivityLog('DELETE', `Deleted gallery item ID: ${id}`);
    try {
      const { error } = await supabase.from('galleries').delete().eq('id', id);
      if (!error) return true;
    } catch {}

    const list = getStored('galleries', INITIAL_GALLERY);
    setStored('galleries', list.filter(g => g.id !== id));
    return true;
  },

  // Blog
  getBlogCategories: async (): Promise<BlogCategory[]> => {
    try {
      const { data, error } = await supabase.from('blog_categories').select('*');
      if (!error && data && data.length > 0) return data;
    } catch {}
    return getStored('blog_categories', INITIAL_BLOG_CATEGORIES);
  },

  getBlogs: async (): Promise<Blog[]> => {
    try {
      const { data, error } = await supabase.from('blogs').select('*');
      if (!error && data && data.length > 0) {
        const cats = await db.getBlogCategories();
        return data.map((b: Blog) => ({
          ...b,
          category_name: cats.find(c => c.id === b.category_id)?.name_en || ''
        }));
      }
    } catch {}
    const blogs = getStored('blogs', INITIAL_BLOGS);
    const cats = getStored('blog_categories', INITIAL_BLOG_CATEGORIES);
    return blogs.map(b => ({
      ...b,
      category_name: cats.find(c => c.id === b.category_id)?.name_en || ''
    }));
  },

  getBlogBySlug: async (slug: string): Promise<Blog | null> => {
    try {
      const { data, error } = await supabase.from('blogs').select('*').eq('slug', slug).single();
      if (!error && data) return data;
    } catch {}
    const blogs = await db.getBlogs();
    return blogs.find(b => b.slug === slug) || null;
  },

  saveBlog: async (b: Blog): Promise<Blog> => {
    db.addActivityLog('EDIT', `Saved blog post: ${b.title_en}`);
    try {
      const { data, error } = await supabase.from('blogs').upsert(b).select().single();
      if (!error && data) return data;
    } catch {}

    const list = getStored('blogs', INITIAL_BLOGS);
    const idx = list.findIndex(item => item.id === b.id);
    if (idx >= 0) list[idx] = b;
    else list.push(b);
    setStored('blogs', list);
    return b;
  },

  deleteBlog: async (id: string): Promise<boolean> => {
    db.addActivityLog('DELETE', `Deleted blog post ID: ${id}`);
    try {
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (!error) return true;
    } catch {}

    const list = getStored('blogs', INITIAL_BLOGS);
    setStored('blogs', list.filter(b => b.id !== id));
    return true;
  },

  // FAQ
  getFAQs: async (): Promise<FAQ[]> => {
    try {
      const { data, error } = await supabase.from('faq').select('*').order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) return data;
    } catch {}
    return getStored('faqs', INITIAL_FAQS).sort((a,b) => a.sort_order - b.sort_order);
  },

  saveFAQ: async (faq: FAQ): Promise<FAQ> => {
    db.addActivityLog('EDIT', `Saved FAQ item.`);
    try {
      const { data, error } = await supabase.from('faq').upsert(faq).select().single();
      if (!error && data) return data;
    } catch {}

    const list = getStored('faqs', INITIAL_FAQS);
    const idx = list.findIndex(item => item.id === faq.id);
    if (idx >= 0) list[idx] = faq;
    else list.push(faq);
    setStored('faqs', list);
    return faq;
  },

  deleteFAQ: async (id: string): Promise<boolean> => {
    db.addActivityLog('DELETE', `Deleted FAQ ID: ${id}`);
    try {
      const { error } = await supabase.from('faq').delete().eq('id', id);
      if (!error) return true;
    } catch {}

    const list = getStored('faqs', INITIAL_FAQS);
    setStored('faqs', list.filter(f => f.id !== id));
    return true;
  },

  // Coupons
  getCoupons: async (): Promise<Coupon[]> => {
    try {
      const { data, error } = await supabase.from('coupons').select('*');
      if (!error && data && data.length > 0) return data;
    } catch {}
    return getStored('coupons', INITIAL_COUPONS);
  },

  saveCoupon: async (c: Coupon): Promise<Coupon> => {
    db.addActivityLog('EDIT', `Saved coupon: ${c.code}`);
    try {
      const { data, error } = await supabase.from('coupons').upsert(c).select().single();
      if (!error && data) return data;
    } catch {}

    const list = getStored('coupons', INITIAL_COUPONS);
    const idx = list.findIndex(item => item.id === c.id);
    if (idx >= 0) list[idx] = c;
    else list.push(c);
    setStored('coupons', list);
    return c;
  },

  deleteCoupon: async (id: string): Promise<boolean> => {
    db.addActivityLog('DELETE', `Deleted coupon ID: ${id}`);
    try {
      const { error } = await supabase.from('coupons').delete().eq('id', id);
      if (!error) return true;
    } catch {}

    const list = getStored('coupons', INITIAL_COUPONS);
    setStored('coupons', list.filter(c => c.id !== id));
    return true;
  },

  // Promotions
  getPromotions: async (): Promise<Promotion[]> => {
    try {
      const { data, error } = await supabase.from('promotions').select('*');
      if (!error && data && data.length > 0) return data;
    } catch {}
    return getStored('promotions', INITIAL_PROMOTIONS);
  },

  savePromotion: async (p: Promotion): Promise<Promotion> => {
    db.addActivityLog('EDIT', `Saved promotion banner: ${p.title_en}`);
    try {
      const { data, error } = await supabase.from('promotions').upsert(p).select().single();
      if (!error && data) return data;
    } catch {}

    const list = getStored('promotions', INITIAL_PROMOTIONS);
    const idx = list.findIndex(item => item.id === p.id);
    if (idx >= 0) list[idx] = p;
    else list.push(p);
    setStored('promotions', list);
    return p;
  },

  deletePromotion: async (id: string): Promise<boolean> => {
    db.addActivityLog('DELETE', `Deleted promotion ID: ${id}`);
    try {
      const { error } = await supabase.from('promotions').delete().eq('id', id);
      if (!error) return true;
    } catch {}

    const list = getStored('promotions', INITIAL_PROMOTIONS);
    setStored('promotions', list.filter(p => p.id !== id));
    return true;
  },

  // Bookings
  getBookings: async (): Promise<Booking[]> => {
    try {
      const { data, error } = await supabase.from('bookings').select('*');
      if (!error && data && data.length > 0) return data;
    } catch {}
    return getStored('bookings', INITIAL_BOOKINGS);
  },

  createBooking: async (bookingData: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> => {
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    // Add activity log
    db.addActivityLog('CREATE', `New booking registered for Room ID ${bookingData.room_id} (Total: Rp ${bookingData.total_amount.toLocaleString()})`);

    // Add alert notification
    db.addNotification('New Booking Request', `${newBooking.customer_name || 'A customer'} requested a stay check-in on ${newBooking.check_in}.`, 'booking');

    try {
      const { data, error } = await supabase.from('bookings').insert(newBooking).select().single();
      if (!error && data) return data;
    } catch {}

    const list = getStored('bookings', INITIAL_BOOKINGS);
    list.unshift(newBooking);
    setStored('bookings', list);
    return newBooking;
  },

  updateBookingStatus: async (id: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed'): Promise<boolean> => {
    db.addActivityLog('EDIT', `Updated booking status for ${id} to ${status}`);
    try {
      const { error } = await supabase.from('bookings').update({ status_code: status }).eq('id', id);
      if (!error) return true;
    } catch {}

    const list = getStored('bookings', INITIAL_BOOKINGS);
    const idx = list.findIndex(b => b.id === id);
    if (idx >= 0) {
      list[idx].status_code = status;
      setStored('bookings', list);
      return true;
    }
    return false;
  },

  deleteBooking: async (id: string): Promise<boolean> => {
    db.addActivityLog('DELETE', `Deleted booking record ID: ${id}`);
    try {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (!error) return true;
    } catch {}

    const list = getStored('bookings', INITIAL_BOOKINGS);
    setStored('bookings', list.filter(b => b.id !== id));
    return true;
  },

  // Customers
  getCustomers: async (): Promise<Customer[]> => {
    const bookings = await db.getBookings();
    const map = new Map<string, Customer>();
    bookings.forEach(b => {
      if (b.customer_name && b.customer_email) {
        const key = b.customer_email.toLowerCase();
        if (!map.has(key)) {
          map.set(key, {
            id: b.customer_id || `cust-${b.id}`,
            name: b.customer_name,
            email: b.customer_email,
            whatsapp: b.customer_whatsapp || '',
            country: b.customer_country || 'Indonesia',
            created_at: b.created_at
          });
        }
      }
    });
    return Array.from(map.values());
  },

  // Site Settings
  getSiteSettings: async (): Promise<SiteSettings> => {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').single();
      if (!error && data) return data;
    } catch {}
    return getStored('settings', INITIAL_SETTINGS);
  },

  saveSiteSettings: async (settings: SiteSettings): Promise<SiteSettings> => {
    db.addActivityLog('EDIT', `Updated general website settings.`);
    try {
      const { data, error } = await supabase.from('site_settings').upsert(settings).select().single();
      if (!error && data) return data;
    } catch {}
    setStored('settings', settings);
    return settings;
  },

  // SEO Settings
  getSeoSettings: async (): Promise<SeoSettings[]> => {
    try {
      const { data, error } = await supabase.from('seo_settings').select('*');
      if (!error && data && data.length > 0) return data;
    } catch {}
    return getStored('seo', INITIAL_SEO);
  },

  getSeoByPage: async (pageId: string): Promise<SeoSettings | null> => {
    const list = await db.getSeoSettings();
    return list.find(s => s.id === pageId) || null;
  },

  saveSeoSettings: async (seo: SeoSettings): Promise<SeoSettings> => {
    db.addActivityLog('EDIT', `Updated SEO configurations for page: ${seo.id}`);
    try {
      const { data, error } = await supabase.from('seo_settings').upsert(seo).select().single();
      if (!error && data) return data;
    } catch {}

    const list = getStored('seo', INITIAL_SEO);
    const idx = list.findIndex(item => item.id === seo.id);
    if (idx >= 0) list[idx] = seo;
    else list.push(seo);
    setStored('seo', list);
    return seo;
  },

  // Notifications
  getNotifications: async (): Promise<Notification[]> => {
    try {
      const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch {}
    return getStored('notifications', INITIAL_NOTIFICATIONS);
  },

  addNotification: async (title: string, message: string, type: 'info' | 'booking' | 'alert' = 'info'): Promise<Notification> => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      is_read: false,
      created_at: new Date().toISOString()
    };
    try {
      await supabase.from('notifications').insert(newNotif);
    } catch {}

    const list = getStored('notifications', INITIAL_NOTIFICATIONS);
    list.unshift(newNotif);
    setStored('notifications', list);
    return newNotif;
  },

  markNotificationRead: async (id: string): Promise<boolean> => {
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    } catch {}

    const list = getStored('notifications', INITIAL_NOTIFICATIONS);
    const idx = list.findIndex(n => n.id === id);
    if (idx >= 0) {
      list[idx].is_read = true;
      setStored('notifications', list);
      return true;
    }
    return false;
  },

  // Activity Logs
  getActivityLogs: async (): Promise<ActivityLog[]> => {
    try {
      const { data, error } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch {}
    return getStored('logs', INITIAL_LOGS);
  },

  addActivityLog: async (action: string, details: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      user_email: 'admin@aurelia.com',
      action,
      details,
      created_at: new Date().toISOString()
    };
    try {
      await supabase.from('activity_logs').insert(newLog);
    } catch {}

    const list = getStored('logs', INITIAL_LOGS);
    list.unshift(newLog);
    setStored('logs', list.slice(0, 100)); // Cap logs size
    setStored('logs', list);
  },

  // Reset or seed schema back to initial state (Database restore simulated)
  resetDatabase: async (): Promise<boolean> => {
    db.addActivityLog('DELETE', 'Reset the entire database to factory defaults.');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aurelia_db_categories');
      localStorage.removeItem('aurelia_db_rooms');
      localStorage.removeItem('aurelia_db_testimonials');
      localStorage.removeItem('aurelia_db_galleries');
      localStorage.removeItem('aurelia_db_blogs');
      localStorage.removeItem('aurelia_db_faqs');
      localStorage.removeItem('aurelia_db_coupons');
      localStorage.removeItem('aurelia_db_promotions');
      localStorage.removeItem('aurelia_db_bookings');
      localStorage.removeItem('aurelia_db_settings');
      localStorage.removeItem('aurelia_db_seo');
      localStorage.removeItem('aurelia_db_notifications');
      localStorage.removeItem('aurelia_db_logs');
      return true;
    }
    return false;
  }
};

'use client';

import React from 'react';
import { useParams } from 'next/navigation';

export default function PrivacyPolicyPage() {
  const params = useParams();
  const lang = params.lang as string;

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen pt-28 pb-20 font-sans">
      <div className="max-w-3xl mx-auto px-6 bg-white dark:bg-neutral-900 p-10 rounded-3xl border border-neutral-100 dark:border-neutral-850 shadow-sm leading-relaxed">
        <h1 className="font-serif text-3xl font-bold mb-6 text-neutral-850 dark:text-white">
          {lang === 'id' ? 'Kebijakan Privasi' : 'Privacy Policy'}
        </h1>
        <p className="text-[10px] text-neutral-400 font-bold mb-8 uppercase tracking-widest">
          Last Updated: June 2026
        </p>

        <div className="space-y-6 text-xs text-neutral-600 dark:text-neutral-350 font-light">
          <p>
            {lang === 'id' 
              ? 'Di Aurelia Luxury Retreats, kami menghormati privasi Anda. Kebijakan ini menjelaskan bagaimana data pribadi Anda dikumpulkan, digunakan, dan dilindungi saat Anda melakukan pemesanan akomodasi melalui sistem kami.'
              : 'At Aurelia Luxury Retreats, we respect your privacy. This policy details how your personal information is gathered, managed, and safeguarded when making reservations through our digital concierge service.'}
          </p>

          <h3 className="font-serif text-sm font-semibold text-neutral-800 dark:text-white pt-4">
            1. {lang === 'id' ? 'Informasi yang Kami Kumpulkan' : 'Information We Collect'}
          </h3>
          <p>
            {lang === 'id'
              ? 'Kami mengumpulkan data nama, alamat email, nomor telepon WhatsApp, negara asal, dan catatan khusus saat Anda memesan kamar. Ini diperlukan untuk keperluan verifikasi identitas dan penyusunan detail WhatsApp.'
              : 'We collect your full name, email address, WhatsApp telephone number, country of origin, and custom room details when lodging checkouts. These are required to verify details and pre-populate your chat invoices.'}
          </p>

          <h3 className="font-serif text-sm font-semibold text-neutral-800 dark:text-white pt-4">
            2. {lang === 'id' ? 'Bagaimana Kami Menggunakan Data Anda' : 'How We Use Your Data'}
          </h3>
          <p>
            {lang === 'id'
              ? 'Data digunakan untuk mengelola pesanan Anda, memvalidasi kupon diskon, memfasilitasi chat transaksi di WhatsApp, mengirim notifikasi, dan menyempurnakan kualitas layanan wisata Anda.'
              : 'Data is leveraged to record and process checkout reservations, validate code coupons, launch WhatsApp redirect endpoints, deliver alerts, and customize concierge travel activities.'}
          </p>

          <h3 className="font-serif text-sm font-semibold text-neutral-800 dark:text-white pt-4">
            3. {lang === 'id' ? 'Keamanan Data' : 'Data Protection'}
          </h3>
          <p>
            {lang === 'id'
              ? 'Kami tidak menjual atau membagikan data pribadi Anda ke pihak ketiga. Semua data disimpan secara aman menggunakan enkripsi JWT dan protokol keamanan dari Supabase.'
              : 'We do not sell, rent, or distribute client contact records to external marketing third-parties. All details are kept secure via JWT authentication and secure database layers provided by Supabase.'}
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { useParams } from 'next/navigation';

export default function TermsOfServicePage() {
  const params = useParams();
  const lang = params.lang as string;

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen pt-28 pb-20 font-sans">
      <div className="max-w-3xl mx-auto px-6 bg-white dark:bg-neutral-900 p-10 rounded-3xl border border-neutral-100 dark:border-neutral-850 shadow-sm leading-relaxed">
        <h1 className="font-serif text-3xl font-bold mb-6 text-neutral-850 dark:text-white">
          {lang === 'id' ? 'Syarat & Ketentuan' : 'Terms of Service'}
        </h1>
        <p className="text-[10px] text-neutral-400 font-bold mb-8 uppercase tracking-widest">
          Last Updated: June 2026
        </p>

        <div className="space-y-6 text-xs text-neutral-600 dark:text-neutral-350 font-light">
          <p>
            {lang === 'id' 
              ? 'Selamat datang di Aurelia Luxury Retreats. Dengan mengakses dan melakukan pemesanan di situs kami, Anda menyetujui syarat dan ketentuan berikut.'
              : 'Welcome to Aurelia Luxury Retreats. By accessing our services and lodging a booking reservation, you agree to comply with the following terms.'}
          </p>

          <h3 className="font-serif text-sm font-semibold text-neutral-800 dark:text-white pt-4">
            1. {lang === 'id' ? 'Kebijakan Pemesanan' : 'Booking Terms'}
          </h3>
          <p>
            {lang === 'id'
              ? 'Semua pemesanan bergantung pada ketersediaan kamar. Pengajuan checkout akan merekam informasi di database dan mengarahkan Anda ke WhatsApp untuk transaksi pembayaran. Pemesanan belum bersifat final sebelum dikonfirmasi oleh pramutamu kami.'
              : 'All checkouts are subject to room availability. Submitting checkout stores record datasets and opens a chat session via WhatsApp. The reservation is not finalized until confirmed by our concierge staff.'}
          </p>

          <h3 className="font-serif text-sm font-semibold text-neutral-800 dark:text-white pt-4">
            2. {lang === 'id' ? 'Pembayaran & Komunikasi' : 'Payments & Communication'}
          </h3>
          <p>
            {lang === 'id'
              ? 'Kami tidak menerima pembayaran langsung via gateway kartu kredit di situs. Semua rincian transfer bank, kartu, atau deposit diselesaikan melalui obrolan WhatsApp terverifikasi dengan tim kami.'
              : 'We do not charge credit card fees directly on the site. All bank wire details, deposit protocols, and payment receipts are processed exclusively through WhatsApp concierge chat.'}
          </p>

          <h3 className="font-serif text-sm font-semibold text-neutral-800 dark:text-white pt-4">
            3. {lang === 'id' ? 'Kebijakan Pembatalan' : 'Cancellation Rules'}
          </h3>
          <p>
            {lang === 'id'
              ? 'Pembatalan gratis diizinkan hingga 7 hari sebelum kedatangan. Pembatalan terlambat dapat dikenakan biaya malam pertama sesuai ketentuan pengelola.'
              : 'Free cancellation is allowed up to 7 days before check-in. Late cancellations may incur a fee of the first night stay charge.'}
          </p>
        </div>
      </div>
    </div>
  );
}

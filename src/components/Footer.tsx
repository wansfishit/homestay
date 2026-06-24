'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation, Language } from '../context/LanguageContext';
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const { t } = useTranslation();

  return (
    <footer className="bg-neutral-900 text-neutral-400 font-sans border-t border-white/5 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Brand */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-widest text-white">
              AURELIA
            </span>
            <span className="text-[10px] tracking-[0.2em] text-gold-400 font-medium uppercase">
              Luxury Retreats
            </span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed font-light">
            {t('footer.description')}
          </p>
          {/* Socials */}
          <div className="flex items-center space-x-4 pt-2">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 border border-white/10 hover:border-gold-400 hover:text-white rounded-full transition-colors text-neutral-500">
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 border border-white/10 hover:border-gold-400 hover:text-white rounded-full transition-colors text-neutral-500">
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 border border-white/10 hover:border-gold-400 hover:text-white rounded-full transition-colors text-neutral-500">
              <Youtube className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-xs uppercase font-bold tracking-widest text-white mb-5 border-b border-white/5 pb-2">
            {t('footer.links')}
          </h4>
          <ul className="space-y-2 text-xs font-light">
            <li>
              <Link href={`/${lang}`} className="hover:text-gold-400 transition-colors">
                {t('nav.home')}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/rooms`} className="hover:text-gold-400 transition-colors">
                {t('nav.rooms')}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/gallery`} className="hover:text-gold-400 transition-colors">
                {t('nav.gallery')}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/blog`} className="hover:text-gold-400 transition-colors">
                {t('nav.blog')}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/faq`} className="hover:text-gold-400 transition-colors">
                {t('nav.faq')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-xs uppercase font-bold tracking-widest text-white mb-5 border-b border-white/5 pb-2">
            {t('footer.legal')}
          </h4>
          <ul className="space-y-2 text-xs font-light">
            <li>
              <Link href={`/${lang}/privacy`} className="hover:text-gold-400 transition-colors">
                {t('footer.privacy')}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/terms`} className="hover:text-gold-400 transition-colors">
                {t('footer.terms')}
              </Link>
            </li>
            <li>
              <Link href="/sitemap.xml" className="hover:text-gold-400 transition-colors">
                {t('site.sitemap')}
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-gold-400 font-bold transition-colors">
                Admin Panel Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-xs uppercase font-bold tracking-widest text-white mb-1 border-b border-white/5 pb-2">
            Concierge Desk
          </h4>
          <ul className="space-y-3 text-xs font-light text-neutral-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
              <span>Jl. Raya Tirta Tawar No. 88, Ubud, Bali, Indonesia</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-gold-500 shrink-0" />
              <span>+62 812 3456 7890</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-gold-500 shrink-0" />
              <span>concierge@aureliaretreats.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-neutral-500">
        <p>© 2026 Aurelia Luxury Retreats. {t('footer.rights')}</p>
        <p className="mt-2 md:mt-0 font-light tracking-wide">
          Designed with luxury, privacy & serenity.
        </p>
      </div>
    </footer>
  );
};
export default Footer;

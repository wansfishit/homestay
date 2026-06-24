'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation, Language } from '../context/LanguageContext';
import { Menu, X, Sun, Moon, Globe, ArrowRight } from 'lucide-react';

interface NavbarProps {
  lang: Language;
}

export const Navbar: React.FC<NavbarProps> = ({ lang }) => {
  const { t, setLang } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Check if we are on the homepage and if the navbar should overlay the dark hero transparently
  const isHomepage = pathname === '/' || pathname === `/${lang}` || pathname === `/${lang}/`;
  const isTransparentHero = !isScrolled && isHomepage;

  // Track page scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync / Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('aurelia_theme') as 'light' | 'dark';
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const activeTheme = savedTheme || systemTheme;
    setTheme(activeTheme);
    if (activeTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('aurelia_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navLinks = [
    { name: t('nav.home'), href: `/${lang}` },
    { name: t('nav.rooms'), href: `/${lang}/rooms` },
    { name: t('nav.gallery'), href: `/${lang}/gallery` },
    { name: t('nav.blog'), href: `/${lang}/blog` },
    { name: t('nav.faq'), href: `/${lang}/faq` },
    { name: t('nav.testimonials'), href: `/${lang}/testimonials` },
    { name: t('nav.contact'), href: `/${lang}/contact` },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'glass-nav py-3 shadow-sm' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2 group">
          <span className={`font-serif text-2xl font-semibold tracking-wider transition-colors group-hover:opacity-80 ${
            isTransparentHero ? 'text-gold-400' : 'text-gold-600 dark:text-gold-400'
          }`}>
            AURELIA
          </span>
          <span className={`hidden sm:inline-block font-sans text-[10px] tracking-[0.2em] font-medium transition-colors ${
            isTransparentHero ? 'text-white/70' : 'text-neutral-400 dark:text-neutral-500'
          }`}>
            LUXURY RETREATS
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const linkColor = isTransparentHero
              ? (isActive ? 'text-gold-400 font-semibold' : 'text-white/90 hover:text-gold-300')
              : (isActive 
                  ? 'text-gold-600 dark:text-gold-400 font-semibold' 
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-gold-500');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-sans text-xs uppercase tracking-widest transition-colors font-medium ${linkColor}`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Actions (Lang, Theme, CTA) */}
        <div className="hidden lg:flex items-center space-x-5">
          {/* Language Switcher */}
          <div className={`flex items-center space-x-2 border rounded-full px-3 py-1 transition-colors ${
            isTransparentHero 
              ? 'border-white/20 bg-white/10 text-white' 
              : 'border-gold-200/50 dark:border-white/10 bg-white/40 dark:bg-black/20'
          }`}>
            <Globe className={`w-3.5 h-3.5 transition-colors ${
              isTransparentHero ? 'text-white/80' : 'text-neutral-500'
            }`} />
            <button
              onClick={() => setLang('id')}
              className={`text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer ${
                lang === 'id' 
                  ? (isTransparentHero ? 'text-gold-400' : 'text-gold-600 dark:text-gold-400') 
                  : (isTransparentHero ? 'text-white/70 hover:text-white' : 'text-neutral-400 hover:text-neutral-600')
              }`}
            >
              ID
            </button>
            <span className={`text-[10px] transition-colors ${
              isTransparentHero ? 'text-white/30' : 'text-neutral-300'
            }`}>|</span>
            <button
              onClick={() => setLang('en')}
              className={`text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer ${
                lang === 'en' 
                  ? (isTransparentHero ? 'text-gold-400' : 'text-gold-600 dark:text-gold-400') 
                  : (isTransparentHero ? 'text-white/70 hover:text-white' : 'text-neutral-400 hover:text-neutral-600')
              }`}
            >
              EN
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 border rounded-full transition-colors cursor-pointer ${
              isTransparentHero 
                ? 'border-white/20 hover:bg-white/10 text-white' 
                : 'border-gold-200/50 dark:border-white/10 hover:bg-gold-50 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-300'
            }`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Book Now Button */}
          <Link
            href={`/${lang}/rooms`}
            className="flex items-center gap-2 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-white font-sans text-xs uppercase tracking-widest px-5 py-2.5 rounded-full shadow-md transition-all font-semibold"
          >
            {t('nav.bookNow')}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center space-x-3 lg:hidden">
          {/* Lang switcher icon for mobile */}
          <button 
            onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
            className={`p-2 border rounded-full transition-colors cursor-pointer ${
              isTransparentHero 
                ? 'border-white/20 text-white hover:bg-white/10' 
                : 'border-gold-100 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-gold-50 dark:hover:bg-neutral-900'
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider">{lang === 'id' ? 'EN' : 'ID'}</span>
          </button>

          {/* Theme Toggle mobile */}
          <button
            onClick={toggleTheme}
            className={`p-2 border rounded-full transition-colors cursor-pointer ${
              isTransparentHero 
                ? 'border-white/20 text-white hover:bg-white/10' 
                : 'border-gold-100 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-gold-50 dark:hover:bg-neutral-900'
            }`}
          >
            {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 border rounded-full transition-colors cursor-pointer ${
              isTransparentHero 
                ? 'border-white/20 text-white hover:bg-white/10' 
                : 'border-gold-100 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-gold-50 dark:hover:bg-neutral-900'
            }`}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-[280px] z-50 glass shadow-2xl p-6 transform transition-transform duration-300 lg:hidden flex flex-col justify-between ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div>
          <div className="flex justify-between items-center mb-8">
            <span className="font-serif text-xl font-semibold tracking-wider text-gold-600">
              AURELIA
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-sans text-xs uppercase tracking-widest py-2 transition-colors font-medium border-b border-neutral-100 dark:border-neutral-900 ${
                    isActive 
                      ? 'text-gold-600 dark:text-gold-400' 
                      : 'text-neutral-600 dark:text-neutral-300 hover:text-gold-500'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          <Link
            href={`/${lang}/rooms`}
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-white font-sans text-xs uppercase tracking-widest py-3 rounded-full shadow-md transition-all font-semibold"
          >
            {t('nav.bookNow')}
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/admin"
            onClick={() => setIsOpen(false)}
            className="block text-center mt-4 font-sans text-[10px] uppercase tracking-widest text-neutral-400 hover:text-gold-500 transition-colors"
          >
            {t('nav.admin')} Login
          </Link>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;

import React from 'react';
import { LanguageProvider, Language } from '../../context/LanguageContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const resolvedParams = await params;
  const rawLang = resolvedParams.lang;
  const currentLang: Language = (rawLang === 'id' || rawLang === 'en') ? rawLang : 'id';

  return (
    <LanguageProvider currentLang={currentLang}>
      <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
        <Navbar lang={currentLang} />
        <main className="flex-grow">
          {children}
        </main>
        <Footer lang={currentLang} />
      </div>
    </LanguageProvider>
  );
}
export async function generateStaticParams() {
  return [{ lang: 'id' }, { lang: 'en' }];
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation, Language } from '../../../context/LanguageContext';
import { db, Blog, BlogCategory } from '../../../lib/db';
import { Calendar, Search, ArrowRight, BookOpen } from 'lucide-react';

export default function BlogPage() {
  const params = useParams();
  const rawLang = params.lang as string;
  const lang: Language = (rawLang === 'id' || rawLang === 'en') ? rawLang : 'id';
  const { t, translateField } = useTranslation();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const allBlogs = await db.getBlogs();
      setBlogs(allBlogs.filter(b => b.is_published));
      
      const allCats = await db.getBlogCategories();
      setCategories(allCats);
    };
    fetchData();
  }, []);

  const filteredBlogs = blogs.filter(post => {
    const matchesCat = selectedCat === 'all' || post.category_id === selectedCat;
    const title = translateField(post, 'title').toLowerCase();
    const summary = translateField(post, 'summary').toLowerCase();
    const query = searchQuery.toLowerCase();
    return matchesCat && (title.includes(query) || summary.includes(query));
  });

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[10px] tracking-[0.2em] font-sans uppercase font-bold text-gold-500 block mb-2">Resort Stories</span>
          <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-neutral-900 dark:text-neutral-100">
            {t('blog.title')}
          </h1>
          <div className="w-12 h-px bg-gold-400 mx-auto mt-4 mb-6" />
          <p className="font-sans text-xs md:text-sm text-neutral-500 dark:text-neutral-450 font-light leading-relaxed">
            {t('blog.subtitle')}
          </p>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-neutral-150 dark:border-neutral-850 pb-8">
          {/* Categories Tab */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCat('all')}
              className={`px-4.5 py-2 rounded-full font-sans text-[10px] uppercase tracking-widest font-bold border transition-all cursor-pointer ${
                selectedCat === 'all'
                  ? 'bg-gold-500 border-gold-500 text-white'
                  : 'bg-white border-neutral-200 text-neutral-600 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-300'
              }`}
            >
              {lang === 'id' ? 'Semua Artikel' : 'All Articles'}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-4.5 py-2 rounded-full font-sans text-[10px] uppercase tracking-widest font-bold border transition-all cursor-pointer ${
                  selectedCat === cat.id
                    ? 'bg-gold-500 border-gold-500 text-white'
                    : 'bg-white border-neutral-200 text-neutral-600 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-300'
                }`}
              >
                {translateField(cat, 'name')}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('blog.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-xl text-xs outline-none focus:border-gold-400 text-neutral-850 dark:text-neutral-200"
            />
          </div>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((post) => (
              <div 
                key={post.id}
                className="group bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-sm border border-neutral-100 dark:border-neutral-850 flex flex-col h-full hover:shadow-lg transition-shadow"
              >
                {/* Thumbnail */}
                <div className="aspect-[16/10] relative overflow-hidden bg-neutral-100 dark:bg-neutral-950">
                  <img 
                    src={post.thumbnail_url} 
                    alt={post.title_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-[9px] uppercase tracking-widest font-bold text-white px-3 py-1 rounded-full border border-white/10">
                    {post.category_name}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-semibold text-neutral-400 mb-3.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>

                  <h3 className="font-serif text-xl font-medium text-neutral-800 dark:text-neutral-200 mb-3 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                    <Link href={`/${lang}/blog/${post.slug}`}>
                      {translateField(post, 'title')}
                    </Link>
                  </h3>

                  <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6 line-clamp-2">
                    {translateField(post, 'summary')}
                  </p>

                  <div className="mt-auto border-t border-neutral-100 dark:border-neutral-800 pt-5 flex justify-between items-center">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-[9px] px-2 py-0.5 bg-neutral-50 border border-neutral-150/60 dark:bg-neutral-950 dark:border-neutral-850 text-neutral-500 rounded font-light">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <Link 
                      href={`/${lang}/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 font-sans text-[10px] uppercase tracking-widest text-neutral-800 dark:text-neutral-200 font-bold hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
                    >
                      {t('blog.readMore')}
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-850 text-center flex flex-col items-center">
              <BookOpen className="w-8 h-8 text-neutral-350 dark:text-neutral-700 mb-4" />
              <p className="text-xs text-neutral-450 font-light">
                {lang === 'id' ? 'Tidak ada artikel yang cocok.' : 'No articles match your query.'}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

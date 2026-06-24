'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation, Language } from '../../../../context/LanguageContext';
import { db, Blog } from '../../../../lib/db';
import { Calendar, ArrowLeft, ChevronRight, Tag } from 'lucide-react';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const rawLang = params.lang as string;
  const lang: Language = (rawLang === 'id' || rawLang === 'en') ? rawLang : 'id';
  const { t, translateField } = useTranslation();

  const [post, setPost] = useState<Blog | null>(null);
  const [related, setRelated] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      const matched = await db.getBlogBySlug(slug);
      setPost(matched);
      
      const allBlogs = await db.getBlogs();
      const filtered = allBlogs.filter(b => b.is_published && b.slug !== slug).slice(0, 2);
      setRelated(filtered);
      setLoading(false);
    };
    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-6">
        <h2 className="font-serif text-2xl text-neutral-800 dark:text-neutral-200 mb-2">
          {lang === 'id' ? 'Artikel Tidak Ditemukan' : 'Article Not Found'}
        </h2>
        <button onClick={() => router.push(`/${lang}/blog`)} className="px-6 py-2.5 bg-gold-500 text-white rounded-full font-sans text-xs uppercase tracking-widest font-bold">
          {lang === 'id' ? 'Kembali ke Jurnal' : 'Back to Journal'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Breadcrumb / Back button */}
        <Link 
          href={`/${lang}/blog`}
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-550 font-bold hover:text-gold-500 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === 'id' ? 'Kembali ke Jurnal' : 'Back to Journal'}
        </Link>

        {/* Thumbnail Hero */}
        <div className="aspect-[21/9] rounded-3xl overflow-hidden bg-neutral-900 shadow-sm mb-10">
          <img 
            src={post.thumbnail_url} 
            alt={post.title_en} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Categories & Date */}
        <div className="flex items-center space-x-4 mb-4">
          <span className="bg-gold-500/10 text-gold-600 dark:bg-gold-950/20 dark:text-gold-450 text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border border-gold-300/10">
            {post.category_name}
          </span>
          <div className="flex items-center gap-1 text-[10px] tracking-wide text-neutral-450 font-light">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-neutral-900 dark:text-neutral-100 leading-tight mb-8">
          {translateField(post, 'title')}
        </h1>

        {/* Content body */}
        <div 
          className="prose dark:prose-invert max-w-none font-sans text-sm md:text-base text-neutral-600 dark:text-neutral-350 leading-relaxed font-light space-y-6 border-b border-neutral-200 dark:border-neutral-850 pb-12"
          dangerouslySetInnerHTML={{ __html: translateField(post, 'content') }}
        />

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-3.5 pt-8 pb-16">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-neutral-400 font-bold shrink-0">
            <Tag className="w-3.5 h-3.5 text-gold-500" />
            <span>Tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, i) => (
              <span key={i} className="text-xs px-3 py-1 bg-white border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-850 text-neutral-600 dark:text-neutral-300 rounded-full font-light">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="border-t border-neutral-150 dark:border-neutral-850 pt-12">
            <h3 className="font-serif text-2xl font-medium text-neutral-800 dark:text-neutral-200 mb-8 text-center">
              {t('blog.related')}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {related.map((rel) => (
                <div key={rel.id} className="group bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-850 p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4">
                    <img src={rel.thumbnail_url} alt={rel.title_en} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" />
                  </div>
                  <h4 className="font-serif text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-2 line-clamp-2 hover:text-gold-500 transition-colors">
                    <Link href={`/${lang}/blog/${rel.slug}`}>
                      {translateField(rel, 'title')}
                    </Link>
                  </h4>
                  <p className="text-[11px] text-neutral-400 line-clamp-2 font-light leading-relaxed">
                    {translateField(rel, 'summary')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

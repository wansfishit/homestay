import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aureliaretreats.com'; // Replace with real production domain
  const locales = ['id', 'en'];
  const pages = ['', '/rooms', '/gallery', '/blog', '/faq', '/testimonials', '/contact', '/privacy', '/terms'];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    pages.forEach((page) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 1.0 : 0.8,
      });
    });
  });

  return sitemapEntries;
}

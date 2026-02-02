import { MetadataRoute } from 'next';

const BUILD_DATE = '2025-12-28';
const BASE_URL = 'https://jigsolitaire.online';

export default function sitemap(): MetadataRoute.Sitemap {
  // Core pages - high priority
  const corePages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: BUILD_DATE,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/levels`,
      lastModified: BUILD_DATE,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/game`,
      lastModified: BUILD_DATE,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/settings`,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Content/Legal pages - important for AdSense
  const contentPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/about`,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/cookies`,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/parents`,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Level pages - proper URLs without query strings
  const totalLevels = 77;
  const levelPages: MetadataRoute.Sitemap = [];

  for (let level = 1; level <= totalLevels; level++) {
    const isHardLevel = level % 5 === 0;
    
    levelPages.push({
      url: `${BASE_URL}/level/${level}`,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly',
      priority: isHardLevel ? 0.8 : 0.6,
    });
  }

  // Combine all pages
  // Total pages: 4 (core) + 6 (content) + 77 (levels) = 87 pages
  return [...corePages, ...contentPages, ...levelPages];
}

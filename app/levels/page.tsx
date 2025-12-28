import { Metadata } from 'next';
import LevelsPageClient from './LevelsPageClient';

const BASE_URL = 'https://jigsolitaire.online';

export const metadata: Metadata = {
  title: 'All JigSolitaire Puzzle Levels — 77+ Free Jigsaw Solitaire Puzzles',
  description: 'Browse all JigSolitaire puzzle levels! 77+ free jigsaw solitaire puzzles organized by collection. Play JigSolitaire online — no download, instant play on any device.',
  keywords: [
    'jigsolitaire levels',
    'jigsolitaire puzzles',
    'jigsaw solitaire levels',
    'free puzzle levels',
    'online puzzle collection',
    'jigsolitaire',
    'puzzle game levels',
    'jigsaw puzzle levels',
  ],
  openGraph: {
    title: 'All JigSolitaire Puzzle Levels — 77+ Free Jigsaw Solitaire Puzzles',
    description: 'Browse all JigSolitaire puzzle levels! 77+ free jigsaw solitaire puzzles. Play JigSolitaire online free!',
    url: `${BASE_URL}/levels`,
    siteName: 'JigSolitaire',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/Jigsolitaire.online_Thmbnail.png`,
        width: 1024,
        height: 1024,
        alt: 'JigSolitaire - All Puzzle Levels',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All JigSolitaire Puzzle Levels — 77+ Free Puzzles',
    description: 'Browse all JigSolitaire puzzle levels! 77+ free jigsaw solitaire puzzles.',
    images: [`${BASE_URL}/Jigsolitaire.online_Thmbnail.png`],
  },
  alternates: {
    canonical: `${BASE_URL}/levels`,
  },
};

// Structured data for the levels page
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'JigSolitaire Puzzle Levels',
  description: 'Complete collection of 77+ JigSolitaire jigsaw solitaire puzzle levels.',
  url: `${BASE_URL}/levels`,
  mainEntity: {
    '@type': 'ItemList',
    name: 'JigSolitaire Puzzle Levels',
    numberOfItems: 77,
    itemListElement: Array.from({ length: 10 }, (_, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `JigSolitaire Level ${i + 1}`,
      url: `${BASE_URL}/level/${i + 1}`,
    })),
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'All Levels',
        item: `${BASE_URL}/levels`,
      },
    ],
  },
};

export default function LevelsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LevelsPageClient />
    </>
  );
}

import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getLevelSEOData, generateLevelStructuredData } from '../../utils/levelSEO';
import LevelGameClient from './LevelGameClient';

const TOTAL_LEVELS = 77;
const BASE_URL = 'https://jigsolitaire.online';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return Array.from({ length: TOTAL_LEVELS }, (_, i) => ({
    id: String(i + 1),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const level = parseInt(id, 10);
  
  if (isNaN(level) || level < 1 || level > TOTAL_LEVELS) {
    return {
      title: 'Level Not Found | JigSolitaire',
      description: 'This puzzle level does not exist.',
    };
  }

  const seo = getLevelSEOData(level);

  return {
    title: seo.title,
    description: seo.description,
    keywords: [
      'jigsaw puzzle',
      'online puzzle game',
      'free puzzle',
      'jigsolitaire',
      `level ${level}`,
      seo.collection,
      seo.difficulty.toLowerCase(),
      'brain training',
      'puzzle game',
    ],
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${BASE_URL}/level/${level}`,
      siteName: 'JigSolitaire',
      type: 'website',
      images: [
        {
          url: `${BASE_URL}/Jigsolitaire.online_Thmbnail.png`,
          width: 1024,
          height: 1024,
          alt: `JigSolitaire Level ${level}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [`${BASE_URL}/Jigsolitaire.online_Thmbnail.png`],
    },
    alternates: {
      canonical: `${BASE_URL}/level/${level}`,
    },
  };
}

export default async function LevelPage({ params }: PageProps) {
  const { id } = await params;
  const level = parseInt(id, 10);

  if (isNaN(level) || level < 1 || level > TOTAL_LEVELS) {
    notFound();
  }

  const seo = getLevelSEOData(level);
  const structuredData = generateLevelStructuredData(level, BASE_URL);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LevelGameClient level={level} seoData={seo} />
    </>
  );
}


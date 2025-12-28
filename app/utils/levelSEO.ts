// Level-specific SEO content generator
// This creates unique content for each level to maximize SEO and AdSense compatibility

export interface LevelSEOData {
  title: string;
  description: string;
  h1: string;
  intro: string;
  features: string[];
  tips: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  estimatedTime: string;
  puzzleType: string;
  collection: string;
}

const collections = [
  { name: 'Discovery', range: [1, 10], theme: 'beginner-friendly puzzles' },
  { name: 'Nature', range: [11, 20], theme: 'beautiful nature scenes' },
  { name: 'Adventure', range: [21, 30], theme: 'exciting adventure imagery' },
  { name: 'Serenity', range: [31, 40], theme: 'peaceful and calming visuals' },
  { name: 'Heritage', range: [41, 50], theme: 'cultural and historical art' },
  { name: 'Horizons', range: [51, 60], theme: 'stunning landscape vistas' },
  { name: 'Cosmos', range: [61, 70], theme: 'space and celestial wonders' },
  { name: 'Treasures', range: [71, 77], theme: 'rare and special puzzles' },
];

function getCollection(level: number): { name: string; theme: string } {
  for (const col of collections) {
    if (level >= col.range[0] && level <= col.range[1]) {
      return { name: col.name, theme: col.theme };
    }
  }
  return { name: 'Discovery', theme: 'beginner-friendly puzzles' };
}

function getDifficulty(level: number): LevelSEOData['difficulty'] {
  if (level % 5 === 0) return 'Expert'; // Hard levels
  if (level <= 20) return 'Easy';
  if (level <= 45) return 'Medium';
  return 'Hard';
}

function getEstimatedTime(level: number): string {
  const isHard = level % 5 === 0;
  if (isHard) return '5-10 minutes';
  if (level <= 20) return '1-2 minutes';
  if (level <= 45) return '2-3 minutes';
  return '3-5 minutes';
}

function getPuzzleType(level: number): string {
  const isHard = level % 5 === 0;
  if (isHard) return '4x4 Multi-Puzzle Challenge';
  return '3x3 Classic Grid';
}

const levelThemes: Record<number, { adjective: string; noun: string }> = {
  1: { adjective: 'welcoming', noun: 'introduction' },
  2: { adjective: 'simple', noun: 'practice' },
  3: { adjective: 'colorful', noun: 'exploration' },
  4: { adjective: 'engaging', noun: 'challenge' },
  5: { adjective: 'exciting', noun: 'milestone' },
  6: { adjective: 'peaceful', noun: 'journey' },
  7: { adjective: 'vibrant', noun: 'adventure' },
  8: { adjective: 'refreshing', noun: 'experience' },
  9: { adjective: 'delightful', noun: 'puzzle' },
  10: { adjective: 'rewarding', noun: 'achievement' },
};

function getTheme(level: number): { adjective: string; noun: string } {
  if (levelThemes[level]) return levelThemes[level];
  
  const adjectives = ['stunning', 'beautiful', 'captivating', 'mesmerizing', 'enchanting', 'brilliant', 'gorgeous', 'amazing', 'wonderful', 'fantastic'];
  const nouns = ['challenge', 'puzzle', 'adventure', 'journey', 'experience', 'quest', 'discovery', 'exploration'];
  
  return {
    adjective: adjectives[level % adjectives.length],
    noun: nouns[level % nouns.length],
  };
}

export function getLevelSEOData(level: number): LevelSEOData {
  const collection = getCollection(level);
  const difficulty = getDifficulty(level);
  const estimatedTime = getEstimatedTime(level);
  const puzzleType = getPuzzleType(level);
  const theme = getTheme(level);
  const isHard = level % 5 === 0;

  const title = `Play JigSolitaire Level ${level} Online Free — ${collection.name} Jigsaw Solitaire Puzzle`;
  const description = `Play JigSolitaire Level ${level} free online! A ${theme.adjective} ${puzzleType.toLowerCase()} jigsaw solitaire puzzle from the ${collection.name} collection. ${difficulty} difficulty, ${estimatedTime}. No download, instant play on any device.`;
  
  const h1 = `Play JigSolitaire Level ${level} — ${collection.name} Collection`;
  
  const intro = isHard
    ? `Welcome to JigSolitaire Level ${level}, an expert-level jigsaw solitaire challenge from our ${collection.name} collection featuring ${collection.theme}. This special milestone JigSolitaire level presents you with three connected 4x4 puzzles that must be solved in sequence. Test your JigSolitaire puzzle-solving mastery with this ${theme.adjective} multi-puzzle experience.`
    : `Welcome to JigSolitaire Level ${level}, a ${theme.adjective} jigsaw solitaire puzzle experience from our ${collection.name} collection featuring ${collection.theme}. This ${difficulty.toLowerCase()}-difficulty JigSolitaire ${puzzleType.toLowerCase()} puzzle offers the perfect blend of challenge and relaxation. Drag and drop pieces to complete the image and earn up to 3 stars!`;

  const features = isHard
    ? [
        `Expert JigSolitaire ${puzzleType} with three sequential puzzles`,
        `Part of the exclusive JigSolitaire ${collection.name} collection`,
        `Estimated completion time: ${estimatedTime}`,
        `Unlock by completing previous JigSolitaire levels`,
        `Earn triple star rewards for fast completion`,
        `Beautiful HD imagery from ${collection.theme}`,
      ]
    : [
        `${difficulty} difficulty JigSolitaire ${puzzleType} format`,
        `Curated image from the JigSolitaire ${collection.name} collection`,
        `Estimated completion time: ${estimatedTime}`,
        `Auto-save your JigSolitaire progress as you play`,
        `Earn up to 3 stars based on completion time`,
        `Perfect for quick JigSolitaire puzzle breaks`,
      ];

  const tips = isHard
    ? [
        'Start by identifying corner pieces in each JigSolitaire puzzle',
        'Complete one JigSolitaire puzzle fully before moving to the next',
        'Look for edge pieces with distinctive colors',
        'Take breaks between JigSolitaire puzzles if needed',
        'Use the JigSolitaire hint button strategically',
      ]
    : [
        'Begin with corner pieces for easier JigSolitaire placement',
        'Match colors and patterns along edges',
        'Complete JigSolitaire under 10 seconds for 3 stars',
        'Tap two pieces to swap their positions',
        'Use the JigSolitaire shuffle feature if you get stuck',
      ];

  return {
    title,
    description,
    h1,
    intro,
    features,
    tips,
    difficulty,
    estimatedTime,
    puzzleType,
    collection: collection.name,
  };
}

export function generateLevelStructuredData(level: number, baseUrl: string): object[] {
  const seo = getLevelSEOData(level);
  
  // Main WebPage schema
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: seo.title,
    description: seo.description,
    url: `${baseUrl}/level/${level}`,
    mainEntity: {
      '@type': 'VideoGame',
      name: `JigSolitaire Level ${level}`,
      description: seo.intro,
      genre: ['Puzzle', 'Jigsaw', 'Solitaire', 'Casual'],
      gamePlatform: ['Web Browser', 'Mobile Browser'],
      applicationCategory: 'Game',
      operatingSystem: 'Any',
      playMode: 'SinglePlayer',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'JigSolitaire Home',
          item: baseUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'JigSolitaire Levels',
          item: `${baseUrl}/levels`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: `JigSolitaire Level ${level}`,
          item: `${baseUrl}/level/${level}`,
        },
      ],
    },
  };

  // FAQ schema for level-specific questions
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How do I play JigSolitaire Level ${level}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `To play JigSolitaire Level ${level}, tap on a puzzle piece to select it, then tap another piece to swap their positions. Continue swapping until all pieces are in their correct positions to complete the puzzle.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is JigSolitaire Level ${level} free to play?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes! JigSolitaire Level ${level} is completely free to play. No downloads, no sign-ups, and no hidden costs. Just open your browser and start playing instantly.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the difficulty of JigSolitaire Level ${level}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `JigSolitaire Level ${level} is rated as ${seo.difficulty} difficulty. It uses a ${seo.puzzleType.toLowerCase()} format and is estimated to take ${seo.estimatedTime} to complete.`,
        },
      },
    ],
  };

  return [webPageSchema, faqSchema];
}


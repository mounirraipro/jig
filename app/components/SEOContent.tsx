'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

// Icon components for features
const IconInstant = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const IconBrain = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const IconArt = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconMobile = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </svg>
);

const IconProgress = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const IconFree = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// FAQ data for schema markup
const faqData = [
  {
    question: 'Is JigSolitaire completely free to play?',
    answer: 'Yes! JigSolitaire is 100% free to play. There are no hidden costs, no pay-to-win mechanics, and no forced advertisements. Just pure jigsaw solitaire puzzle enjoyment for everyone.'
  },
  {
    question: 'Does JigSolitaire save my progress automatically?',
    answer: 'Absolutely! Your completed puzzles, earned stars, and unlocked collections are saved automatically in your browser. You can pick up right where you left off anytime you return to JigSolitaire.'
  },
  {
    question: 'Can I play JigSolitaire on my phone or tablet?',
    answer: 'Yes! JigSolitaire is fully responsive and optimized for mobile devices. It works beautifully on iPhone, iPad, Android phones and tablets, desktop computers, and Chromebooks. Just open your browser and start playing!'
  },
  {
    question: 'Is JigSolitaire unblocked at school or work?',
    answer: 'Yes! Since JigSolitaire runs entirely in your web browser without requiring any downloads or installations, it is accessible on most networks where browser-based games are allowed. Perfect for quick puzzle breaks!'
  },
  {
    question: 'How often are new JigSolitaire puzzles added?',
    answer: 'We add new themed puzzle packs regularly. Our growing collection includes over 77 unique levels across multiple themed collections. Follow JigSolitaire to get notified when fresh puzzles drop!'
  },
  {
    question: 'How do I play JigSolitaire?',
    answer: 'Playing JigSolitaire is simple: tap or click on a puzzle piece to select it, then tap another piece to swap their positions. Continue swapping pieces until the image is complete. You can also drag and drop pieces directly!'
  },
  {
    question: 'What makes JigSolitaire different from other puzzle games?',
    answer: 'JigSolitaire combines the best of jigsaw puzzles with solitaire-style gameplay mechanics. Our unique swap-based system, combined with beautiful HD images, progress tracking, and achievement stars makes for a fresh, engaging puzzle experience.'
  },
  {
    question: 'Do I need to download or install anything to play JigSolitaire?',
    answer: 'No installation required! JigSolitaire is a browser-based game. Simply visit jigsolitaire.online and start playing instantly. Works on Chrome, Safari, Firefox, Edge, and all modern browsers.'
  }
];

// How to play steps for schema
const howToSteps = [
  {
    step: 1,
    title: 'Choose Your JigSolitaire Puzzle',
    description: 'Browse through 77+ unique puzzle levels organized in themed collections. Select any unlocked puzzle to begin your JigSolitaire experience.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  },
  {
    step: 2,
    title: 'Swap Puzzle Pieces',
    description: 'Tap or click on any puzzle piece to select it, then tap another piece to swap their positions. You can also drag and drop pieces directly on the board.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
      </svg>
    )
  },
  {
    step: 3,
    title: 'Complete the Image',
    description: 'Continue swapping pieces until every tile is in its correct position. Correctly placed pieces will lock in place, helping you track your progress.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    )
  },
  {
    step: 4,
    title: 'Earn Stars & Progress',
    description: 'Complete puzzles quickly to earn up to 3 stars! Unlock new levels, track your achievements, and progress through the JigSolitaire collection.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    )
  }
];

// Generate structured data
function generateStructuredData() {
  const BASE_URL = 'https://jigsolitaire.online';

  // VideoGame Schema
  const videoGameSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'JigSolitaire',
    description: 'JigSolitaire: The ultimate free online jigsaw solitaire puzzle game! 77+ levels, no download, mobile friendly, instant fun. Play now!',
    url: BASE_URL,
    image: `${BASE_URL}/Jigsolitaire.online_Thmbnail.png`,
    genre: ['Puzzle', 'Jigsaw', 'Solitaire', 'Casual'],
    gamePlatform: ['Web Browser', 'Mobile Browser'],
    applicationCategory: 'Game',
    operatingSystem: 'Any',
    playMode: 'SinglePlayer',
    numberOfPlayers: {
      '@type': 'QuantitativeValue',
      minValue: 1,
      maxValue: 1
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '5000',
      bestRating: '5',
      worstRating: '1'
    },
    author: {
      '@type': 'Organization',
      name: 'JigSolitaire'
    }
  };

  // FAQPage Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  // HowTo Schema
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Play JigSolitaire',
    description: 'Learn how to play JigSolitaire, the free online jigsaw solitaire puzzle game. Complete puzzles by swapping pieces to recreate beautiful images.',
    image: `${BASE_URL}/Jigsolitaire.online_Thmbnail.png`,
    totalTime: 'PT5M',
    step: howToSteps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.description,
      url: `${BASE_URL}/#how-to-play`
    }))
  };

  // WebSite Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'JigSolitaire',
    alternateName: 'Jig Solitaire',
    url: BASE_URL,
    description: 'JigSolitaire: The ultimate free online jigsaw solitaire puzzle game! 77+ levels, no download, mobile friendly, instant fun. Play now!',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/?search={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'JigSolitaire',
    url: BASE_URL,
    logo: `${BASE_URL}/Jigsolitaire.online_Thmbnail.png`,
    sameAs: []
  };

  return [videoGameSchema, faqSchema, howToSchema, websiteSchema, organizationSchema];
}

export default function SEOContent() {
  // Inject structured data
  useEffect(() => {
    const schemas = generateStructuredData();
    schemas.forEach((schema, index) => {
      const existingScript = document.getElementById(`seo-schema-${index}`);
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = `seo-schema-${index}`;
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      }
    });
  }, []);

  return (
    <section className="relative overflow-hidden bg-white" id="about-jigsolitaire">

      {/* Hero Section with Main H1 */}
      <div className="relative py-20 lg:py-28 bg-gradient-to-b from-slate-50 to-white">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(#000 1px, transparent 1px),
                             linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Free Online Jigsaw Solitaire Game</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">
            JigSolitaire
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
              Play Free Online Jigsaw Solitaire
            </span>
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Welcome to <strong>JigSolitaire</strong> — the ultimate free online jigsaw solitaire puzzle game!
            Combine classic jigsaw puzzle mechanics with solitaire-style gameplay. No downloads, instant play,
            mobile-friendly, and perfect for brain training and relaxation.
          </p>

          <p className="text-base text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            Whether you&apos;re looking for a quick puzzle break at work, a relaxing game during your commute,
            or an engaging brain exercise, JigSolitaire offers 77+ beautifully curated puzzle levels that
            work seamlessly on any device.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { value: '77+', label: 'Puzzle Levels' },
              { value: '100%', label: 'Free to Play' },
              { value: '4.9★', label: 'User Rating' },
              { value: '0', label: 'Downloads Needed' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What is JigSolitaire Section */}
      <div className="py-16 lg:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What is JigSolitaire?
            </h2>
            <p className="text-slate-600 max-w-3xl mx-auto leading-relaxed">
              <strong>JigSolitaire</strong> is a unique online puzzle game that blends the satisfaction of completing
              jigsaw puzzles with the strategic simplicity of solitaire. Unlike traditional jigsaw games where you
              freely place pieces, JigSolitaire challenges you to swap adjacent tiles until the image is complete —
              creating a fresh, engaging puzzle experience that&apos;s easy to learn but endlessly enjoyable.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">JigSolitaire: Jigsaw Meets Solitaire</h3>
              <p className="text-slate-600">Unique swap-based mechanics combine the best of both puzzle genres into one addictive game.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">JigSolitaire Brain Training</h3>
              <p className="text-slate-600">Sharpen your spatial reasoning, memory, and problem-solving skills with every puzzle.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">JigSolitaire Relaxing Gameplay</h3>
              <p className="text-slate-600">Calming visuals, soothing sounds, and stress-free gameplay for ultimate relaxation.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Play JigSolitaire - Benefits Section */}
      <div className="py-20 lg:py-28 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-amber-600 uppercase tracking-wider bg-amber-50 rounded-full border border-amber-200 mb-4">
              Benefits
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Play JigSolitaire?
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Discover why thousands of players choose JigSolitaire for their daily puzzle fix
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Large Feature Card */}
            <div className="md:col-span-2 lg:col-span-1 lg:row-span-2 group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-8 hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-6 text-white shadow-lg shadow-amber-200">
                  <IconInstant />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">JigSolitaire Instant Play</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Start playing JigSolitaire instantly in your web browser. No app downloads, no sign-ups, no waiting.
                  Works perfectly on desktop, tablet, and mobile devices across all major browsers.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Chrome', 'Safari', 'Firefox', 'Edge'].map(b => (
                    <span key={b} className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-white rounded-md border border-slate-200">{b}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Regular Feature Cards */}
            {[
              {
                icon: <IconBrain />,
                title: 'JigSolitaire Brain Training',
                desc: 'Playing JigSolitaire regularly helps improve memory, concentration, and spatial reasoning. Perfect cognitive exercise for all ages.',
                gradient: 'from-emerald-50 to-teal-50',
                border: 'border-emerald-100',
                iconBg: 'from-emerald-500 to-teal-500',
                shadow: 'shadow-emerald-200'
              },
              {
                icon: <IconMobile />,
                title: 'JigSolitaire Mobile Experience',
                desc: 'JigSolitaire is fully optimized for touch screens. Play on your iPhone, iPad, Android phone, or tablet with smooth, responsive controls.',
                gradient: 'from-pink-50 to-rose-50',
                border: 'border-pink-100',
                iconBg: 'from-pink-500 to-rose-500',
                shadow: 'shadow-pink-200'
              },
              {
                icon: <IconFree />,
                title: 'JigSolitaire is Free Forever',
                desc: 'JigSolitaire is completely free to play. No hidden fees, no premium tiers, no pay-to-win. Just pure puzzle enjoyment.',
                gradient: 'from-blue-50 to-indigo-50',
                border: 'border-blue-100',
                iconBg: 'from-blue-500 to-indigo-500',
                shadow: 'shadow-blue-200'
              },
              {
                icon: <IconProgress />,
                title: 'JigSolitaire Saves Progress',
                desc: 'Your JigSolitaire progress saves automatically. Earn stars, complete levels, and pick up exactly where you left off anytime.',
                gradient: 'from-violet-50 to-purple-50',
                border: 'border-violet-100',
                iconBg: 'from-violet-500 to-purple-500',
                shadow: 'shadow-violet-200'
              },
            ].map((feature, i) => (
              <div key={i} className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${feature.gradient} border ${feature.border} p-6 hover:shadow-lg transition-shadow`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.iconBg} flex items-center justify-center mb-4 text-white shadow-lg ${feature.shadow}`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How to Play JigSolitaire */}
      <div id="how-to-play" className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white rounded-full border border-slate-200 mb-4">
              Getting Started
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How to Play JigSolitaire
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Master JigSolitaire in 4 simple steps — it&apos;s easy to learn and endlessly fun!
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howToSteps.map((item) => (
              <div key={item.step} className="relative bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step {item.step.toString().padStart(2, '0')}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Additional Tips */}
          <div className="mt-12 bg-white rounded-2xl p-8 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">JigSolitaire Tips & Tricks</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Start with corners</h4>
                  <p className="text-sm text-slate-600">Corner pieces are easiest to identify. Place them first to build a framework.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Use the hint button</h4>
                  <p className="text-sm text-slate-600">Stuck? The hint button highlights a misplaced piece and its correct position.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Complete quickly for stars</h4>
                  <p className="text-sm text-slate-600">Finish under 10 seconds for 3 stars, under 20 for 2 stars. Challenge yourself!</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-600 font-bold text-sm">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Look for color patterns</h4>
                  <p className="text-sm text-slate-600">Match colors and patterns along edges to find where pieces belong.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* JigSolitaire Puzzle Collections */}
      <div className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 text-xs font-semibold text-emerald-600 uppercase tracking-wider bg-emerald-50 rounded-full border border-emerald-200 mb-4">
                Puzzle Library
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                JigSolitaire Puzzle Collections
              </h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                Explore 77+ handcrafted JigSolitaire puzzles organized into themed collections.
                From peaceful nature scenes to vibrant cityscapes, our curated library offers something for every puzzle lover.
                New themed packs are added regularly to keep your JigSolitaire experience fresh and exciting.
              </p>

              <div className="space-y-4">
                {[
                  { name: 'Discovery Collection', count: 'Levels 1-10', color: 'bg-amber-500', desc: 'Perfect for beginners' },
                  { name: 'Nature Collection', count: 'Levels 11-20', color: 'bg-emerald-500', desc: 'Peaceful landscapes' },
                  { name: 'Adventure Collection', count: 'Levels 21-30', color: 'bg-blue-500', desc: 'Exciting imagery' },
                  { name: 'Serenity Collection', count: 'Levels 31-40', color: 'bg-purple-500', desc: 'Calming visuals' },
                ].map((cat, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                    <div className="flex-1">
                      <span className="font-medium text-slate-900">{cat.name}</span>
                      <span className="text-sm text-slate-500 ml-2">— {cat.desc}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-600">{cat.count}</span>
                  </div>
                ))}
              </div>

              <Link href="/levels" className="inline-flex items-center gap-2 mt-8 text-amber-600 hover:text-amber-700 font-semibold transition-colors">
                View All JigSolitaire Levels
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Visual Grid */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-100/50 to-orange-100/50 rounded-3xl blur-2xl" />
              <div className="relative grid grid-cols-3 gap-3 p-5 bg-white rounded-2xl border border-slate-200 shadow-lg">
                {[
                  'bg-gradient-to-br from-amber-400 to-orange-500',
                  'bg-gradient-to-br from-emerald-400 to-teal-500',
                  'bg-gradient-to-br from-sky-400 to-blue-500',
                  'bg-gradient-to-br from-rose-400 to-pink-500',
                  'bg-gradient-to-br from-violet-400 to-purple-500',
                  'bg-gradient-to-br from-slate-400 to-zinc-500',
                ].map((gradient, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-xl ${gradient} hover:scale-105 transition-transform cursor-pointer shadow-sm`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* JigSolitaire FAQ Section */}
      <div id="faq" className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white rounded-full border border-slate-200 mb-4">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              JigSolitaire Frequently Asked Questions
            </h2>
            <p className="text-slate-600">Everything you need to know about playing JigSolitaire online</p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <h3 className="text-base font-bold text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* JigSolitaire Game Features */}
      <div className="py-20 lg:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              JigSolitaire Game Features
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Built with modern technology for the best online puzzle experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'HD Images', desc: 'Crystal clear high-definition puzzle artwork', icon: <IconArt /> },
              { title: 'Auto-Save', desc: 'Progress saves automatically in your browser', icon: <IconProgress /> },
              { title: 'Touch Controls', desc: 'Optimized drag-and-drop for touchscreens', icon: <IconMobile /> },
              {
                title: 'Star Ratings', desc: 'Earn up to 3 stars based on completion time', icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                )
              },
              { title: 'Hint System', desc: 'Get helpful hints when you\'re stuck', icon: <IconBrain /> },
              {
                title: 'Level Progress', desc: '77+ levels with increasing difficulty', icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                )
              },
              {
                title: 'No Ads Interruption', desc: 'Clean, distraction-free gameplay', icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                )
              },
              {
                title: 'Background Music', desc: 'Relaxing ambient soundscapes', icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                )
              },
            ].map((feature, i) => (
              <div key={i} className="text-center p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Play JigSolitaire CTA Section */}
      <div className="relative py-16 lg:py-20 bg-gradient-to-r from-amber-500 to-orange-500">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
        </div>

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Play JigSolitaire?
          </h2>
          <p className="text-lg text-amber-100 mb-8 max-w-xl mx-auto">
            Join thousands of players enjoying JigSolitaire — the most relaxing jigsaw solitaire puzzle game online.
            Start playing instantly, no download required!
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.5 5.5v9l7-4.5-7-4.5z" />
            </svg>
            Play JigSolitaire Now — It&apos;s Free
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} JigSolitaire. Free Online Jigsaw Solitaire Puzzle Game. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link href="/about" className="hover:text-slate-700 transition-colors">About JigSolitaire</Link>
              <Link href="/privacy-policy" className="hover:text-slate-700 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-slate-700 transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-slate-700 transition-colors">Cookies Policy</Link>
              <Link href="/parents" className="hover:text-slate-700 transition-colors">Parents Guide</Link>
              <Link href="/contact" className="hover:text-slate-700 transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

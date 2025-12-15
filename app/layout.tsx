import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Play JigSolitaire Online — A Fresh Take on Puzzle & Solitaire Fun",
  description: "Dive into JigSolitaire, the modern online puzzle game that blends jigsaw mechanics with the strategic satisfaction of solitaire. With a responsive, touch-friendly board and crisp high-resolution artwork, every session feels smooth, relaxing, and perfectly centered—whether you're playing on mobile, tablet, or desktop.",
  keywords: [
    "jigsaw puzzle",
    "solitaire",
    "online puzzle game",
    "unblocked games",
    "puzzle game",
    "jigsaw solitaire",
    "free puzzle game",
    "browser game",
    "mobile puzzle",
    "relaxing puzzle",
    "brain training",
    "puzzle collection",
    "jigsaw game online",
    "solitaire puzzle",
    "puzzle themes",
    "nature puzzles",
    "travel puzzles",
    "wildlife puzzles"
  ],
  authors: [{ name: "JigSolitaire" }],
  creator: "JigSolitaire",
  publisher: "JigSolitaire",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://jigsolitaire.online"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Play JigSolitaire Online — A Fresh Take on Puzzle & Solitaire Fun",
    description: "Dive into JigSolitaire, the modern online puzzle game that blends jigsaw mechanics with the strategic satisfaction of solitaire. With a responsive, touch-friendly board and crisp high-resolution artwork, every session feels smooth, relaxing, and perfectly centered.",
    url: "https://jigsolitaire.online",
    siteName: "JigSolitaire",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "JigSolitaire - Online Puzzle Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Play JigSolitaire Online — A Fresh Take on Puzzle & Solitaire Fun",
    description: "Dive into JigSolitaire, the modern online puzzle game that blends jigsaw mechanics with the strategic satisfaction of solitaire.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  category: "games",
  classification: "Puzzle Game",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": "JigSolitaire",
    "description": "A modern online puzzle game that blends jigsaw mechanics with the strategic satisfaction of solitaire. With a responsive, touch-friendly board and crisp high-resolution artwork, every session feels smooth, relaxing, and perfectly centered.",
    "url": "https://jigsolitaire.online",
    "applicationCategory": "Game",
    "gamePlatform": ["Web Browser", "Mobile", "Tablet", "Desktop"],
    "operatingSystem": ["iOS", "Android", "Windows", "macOS", "Linux"],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1000"
    },
    "gameFeature": [
      "250+ vivid puzzle themes",
      "Automatic cloud-like saving",
      "Touch & keyboard controls",
      "Mobile, tablet, and desktop support",
      "Unlockable puzzle collections",
      "Interactive tutorial",
      "Daily brain training routine"
    ],
    "genre": ["Puzzle", "Solitaire", "Jigsaw", "Brain Training"],
    "inLanguage": "en",
    "isAccessibleForFree": true,
    "playMode": "SinglePlayer"
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Does JigSolitaire save my progress?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Your puzzle states and unlocked themes are saved automatically in your browser profile."
        }
      },
      {
        "@type": "Question",
        "name": "Is the game free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. JigSolitaire is a free-to-play online puzzle game, with optional premium theme packs arriving soon."
        }
      },
      {
        "@type": "Question",
        "name": "Is it unblocked at school/work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. JigSolitaire runs directly in your browser and is commonly accessible as an unblocked puzzle game on most networks."
        }
      },
      {
        "@type": "Question",
        "name": "Which devices are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All modern devices: Chrome, Edge, Firefox, Safari, iOS, Android, tablets, PCs, and Chromebooks."
        }
      },
      {
        "@type": "Question",
        "name": "Are new puzzles added regularly?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "New puzzle drops arrive monthly, including community-voted themes and seasonal artwork."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need to install anything?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No installation required. Just open your browser, visit jigsolitaire.online, and start playing instantly."
        }
      }
    ]
  };

  return (
    <html lang="en">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
        {children}
      </body>
    </html>
  );
}

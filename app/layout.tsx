import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = 'https://jigsolitaire.online';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "JigSolitaire — Play Online Free Jigsaw Solitaire Puzzle Game",
    template: "%s | JigSolitaire",
  },
  description: "Play JigSolitaire online free — the ultimate jigsaw solitaire puzzle game! No download, mobile friendly, instant puzzle fun. 77+ levels, brain training, relaxing gameplay. Works on all devices.",
  keywords: [
    'jigsolitaire',
    'jigsaw solitaire',
    'jigsaw puzzle online',
    'free puzzle game',
    'online puzzle',
    'jigsolitaire online',
    'play jigsolitaire',
    'jigsaw puzzle game',
    'solitaire puzzle',
    'brain training game',
    'relaxing puzzle game',
    'puzzle game free',
    'mobile puzzle game',
    'unblocked puzzle game',
    'casual puzzle',
  ],
  authors: [{ name: 'JigSolitaire' }],
  creator: 'JigSolitaire',
  publisher: 'JigSolitaire',
  applicationName: 'JigSolitaire',
  category: 'Games',
  openGraph: {
    title: "Play JigSolitaire Online – Free Jigsaw Solitaire Puzzle Game",
    description: "Play JigSolitaire online free! The ultimate jigsaw solitaire puzzle game with 77+ levels. No download, mobile friendly, instant puzzle fun!",
    url: BASE_URL,
    siteName: 'JigSolitaire',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/Jigsolitaire.online_Thmbnail.png',
        width: 1024,
        height: 1024,
        alt: 'JigSolitaire - Free Online Jigsaw Solitaire Puzzle Game',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Play JigSolitaire Online – Free Jigsaw Solitaire Puzzle Game",
    description: "Play JigSolitaire online free! The ultimate jigsaw solitaire puzzle game. No download, mobile friendly, instant puzzle fun!",
    images: ['/Jigsolitaire.online_Thmbnail.png'],
    creator: '@jigsolitaire',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
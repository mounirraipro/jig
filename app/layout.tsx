import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import CookieConsent from "./components/CookieConsent";

const BASE_URL = 'https://jigsolitaire.online';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "JigSolitaire | Play Online Free Jigsaw Solitaire Puzzle Game",
    template: "JigSolitaire | %s",
  },
  description: "JigSolitaire: The ultimate free online jigsaw solitaire puzzle game! 77+ levels, no download, mobile friendly, instant fun. Play now!",
  keywords: [
    'jigsolitaire',
    'jig solitaire',
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
  authors: [{ name: 'HikariTech' }],
  creator: 'HikariTech',
  publisher: 'HikariTech',
  applicationName: 'JigSolitaire',
  category: 'Games',
  openGraph: {
    title: "JigSolitaire | Play Free Online Jigsaw Solitaire Puzzle Game",
    description: "JigSolitaire: The ultimate free online jigsaw solitaire puzzle game! 77+ levels, no download, mobile friendly, instant fun. Play now!",
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
    title: "JigSolitaire | Play Free Online Jigsaw Solitaire Puzzle Game",
    description: "JigSolitaire: The ultimate free online jigsaw solitaire puzzle game! 77+ levels, no download, mobile friendly, instant fun. Play now!",
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
      <head>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1032974487169355"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="antialiased">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
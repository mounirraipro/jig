import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = 'https://jigsolitaire.online';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "JigSolitaire - Free Online Jigsaw Puzzle Game",
    template: "%s | JigSolitaire",
  },
  description: "Play JigSolitaire free online! A relaxing jigsaw puzzle game with 77+ levels. No downloads, no sign-ups. Works on all devices. Perfect for all ages.",
  keywords: ['jigsaw puzzle', 'online puzzle game', 'free puzzle', 'jigsolitaire', 'brain training', 'puzzle game', 'casual game'],
  authors: [{ name: 'JigSolitaire' }],
  openGraph: {
    title: "JigSolitaire - Free Online Jigsaw Puzzle Game",
    description: "Play JigSolitaire free online! A relaxing jigsaw puzzle game with 77+ levels. No downloads, no sign-ups.",
    url: BASE_URL,
    siteName: 'JigSolitaire',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/Jigsolitaire.online_Thmbnail.png',
        width: 1024,
        height: 1024,
        alt: 'JigSolitaire - Free Online Puzzle Game',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "JigSolitaire - Free Online Jigsaw Puzzle Game",
    description: "Play JigSolitaire free online! A relaxing jigsaw puzzle game with 77+ levels.",
    images: ['/Jigsolitaire.online_Thmbnail.png'],
  },
  robots: {
    index: true,
    follow: true,
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
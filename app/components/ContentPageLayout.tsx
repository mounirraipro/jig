'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from './Footer';

interface ContentPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function ContentPageLayout({ title, children }: ContentPageLayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-surface)' }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full glass-panel px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="h-8 w-8 rounded-lg bg-linear-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>JigSolitaire</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => router.push('/')}
            className="btn-primary px-4 py-2 text-sm font-semibold"
          >
            Play Now
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero */}
        <div className="relative py-12 lg:py-16 bg-gradient-to-b from-slate-50 to-white">
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(#000 1px, transparent 1px),
                               linear-gradient(90deg, #000 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="relative max-w-4xl mx-auto px-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
              <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-slate-900 font-medium">{title}</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
              {title}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="py-12 lg:py-16">
          <div className="max-w-4xl mx-auto px-6">
            <div
              className="prose prose-slate prose-lg max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-p:text-slate-600 prose-p:leading-relaxed
                prose-strong:text-slate-900
                prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline"
            >
              {children}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative py-12 lg:py-16 bg-gradient-to-r from-amber-500 to-orange-500">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }} />
          </div>

          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Play JigSolitaire?
            </h2>
            <p className="text-lg text-amber-100 mb-6 max-w-xl mx-auto">
              Enjoy free online jigsaw puzzles with no downloads and no sign-ups required.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.5 5.5v9l7-4.5-7-4.5z" />
              </svg>
              Play Now — It&apos;s Free
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      {/* Footer */}
      <Footer />
    </div>
  );
}


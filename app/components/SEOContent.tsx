'use client';

import React from 'react';
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

const IconControls = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
  </svg>
);

const IconProgress = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export default function SEOContent() {
  return (
    <section className="relative overflow-hidden bg-white">
      
      {/* Hero Section */}
      <div className="relative py-20 lg:py-28 bg-gradient-to-b from-slate-50 to-white">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(#000 1px, transparent 1px),
                             linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}/>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Free Online Game</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">
            The Ultimate
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
              Jigsaw Puzzle Game
            </span>
          </h1>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            Dive into JigSolitaire — where classic jigsaw puzzles meet modern solitaire mechanics. 
            Free, browser-based, and designed for pure relaxation.
          </p>
          
          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { value: '500K+', label: 'Players' },
              { value: '1000+', label: 'Puzzles' },
              { value: '4.9', label: 'Rating' },
              { value: '0', label: 'Downloads' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Players Love JigSolitaire
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Crafted with attention to every detail for the ultimate puzzle experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Large Feature Card */}
            <div className="md:col-span-2 lg:col-span-1 lg:row-span-2 group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-8 hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-6 text-white shadow-lg shadow-amber-200">
                  <IconInstant />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Play</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  No downloads. No sign-ups. Just click and play instantly in your browser. 
                  Works perfectly on desktop, tablet, and mobile devices.
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
                title: 'Brain Training',
                desc: 'Boost memory, focus, and spatial reasoning. Perfect mental exercise for all ages.',
                gradient: 'from-emerald-50 to-teal-50',
                border: 'border-emerald-100',
                iconBg: 'from-emerald-500 to-teal-500',
                shadow: 'shadow-emerald-200'
              },
              {
                icon: <IconArt />,
                title: 'Stunning Artwork',
                desc: 'Curated HD images from nature, cities, art, and more. New puzzles added weekly.',
                gradient: 'from-pink-50 to-rose-50',
                border: 'border-pink-100',
                iconBg: 'from-pink-500 to-rose-500',
                shadow: 'shadow-pink-200'
              },
              {
                icon: <IconControls />,
                title: 'Smart Controls',
                desc: 'Intuitive drag & drop with auto-snap. Keyboard shortcuts for speed and comfort.',
                gradient: 'from-blue-50 to-indigo-50',
                border: 'border-blue-100',
                iconBg: 'from-blue-500 to-indigo-500',
                shadow: 'shadow-blue-200'
              },
              {
                icon: <IconProgress />,
                title: 'Track Progress',
                desc: 'Earn stars, beat your time, and complete collections. Progress syncs automatically.',
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

      {/* How to Play */}
      <div className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white rounded-full border border-slate-200 mb-4">
              Getting Started
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Master JigSolitaire in 4 Steps
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Choose a Pack', desc: 'Browse themed collections and select your puzzle', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              )},
              { step: '02', title: 'Drag & Drop', desc: 'Move pieces to their correct positions on the board', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
              )},
              { step: '03', title: 'Snap & Connect', desc: 'Pieces auto-snap when correctly positioned together', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              )},
              { step: '04', title: 'Complete & Earn', desc: 'Finish puzzles to earn stars and unlock new packs', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              )},
            ].map((item, i) => (
              <div key={i} className="relative bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step {item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Collections Showcase */}
      <div className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 text-xs font-semibold text-emerald-600 uppercase tracking-wider bg-emerald-50 rounded-full border border-emerald-200 mb-4">
                Puzzle Library
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Hundreds of Beautiful Puzzle Collections
              </h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                From peaceful nature scenes to vibrant cityscapes, our curated library offers something for everyone. 
                New themed packs are added regularly to keep your experience fresh and exciting.
              </p>
              
              <div className="space-y-4">
                {[
                  { name: 'Nature & Wildlife', count: '120+', color: 'bg-emerald-500' },
                  { name: 'Travel & Landmarks', count: '95+', color: 'bg-blue-500' },
                  { name: 'Art & Abstract', count: '80+', color: 'bg-purple-500' },
                  { name: 'Seasonal Events', count: '60+', color: 'bg-rose-500' },
                ].map((cat, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                    <span className="flex-1 text-slate-700">{cat.name}</span>
                    <span className="text-sm font-semibold text-slate-900">{cat.count}</span>
                  </div>
                ))}
              </div>
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

      {/* FAQ Section */}
      <div className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600">Everything you need to know about JigSolitaire</p>
          </div>
          
          <div className="space-y-4">
            {[
              { 
                q: 'Is JigSolitaire completely free?', 
                a: 'Yes! JigSolitaire is 100% free to play. No hidden costs, no forced ads, no pay-to-win mechanics. Just pure puzzle enjoyment.' 
              },
              { 
                q: 'Does my progress save automatically?', 
                a: 'Absolutely. Your completed puzzles, earned stars, and unlocked collections are saved automatically in your browser. Pick up right where you left off anytime.' 
              },
              { 
                q: 'Can I play on my phone or tablet?', 
                a: 'JigSolitaire is fully responsive and works beautifully on all devices — iPhone, iPad, Android phones and tablets, desktop computers, and even Chromebooks.' 
              },
              { 
                q: 'Is this game unblocked at school or work?', 
                a: 'Yes! Since JigSolitaire runs entirely in your browser without downloads, it\'s accessible on most networks where browser games are allowed.' 
              },
              { 
                q: 'How often are new puzzles added?', 
                a: 'We add new themed puzzle packs every week. Follow us to get notified when fresh collections drop — from seasonal events to trending topics.' 
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <h3 className="text-base font-bold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-16 lg:py-20 bg-gradient-to-r from-amber-500 to-orange-500">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}/>
        </div>
        
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Puzzling?
          </h2>
          <p className="text-lg text-amber-100 mb-8 max-w-xl mx-auto">
            Join thousands of players enjoying the most relaxing jigsaw puzzle experience online.
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.5 5.5v9l7-4.5-7-4.5z"/>
            </svg>
            Play Now — It&apos;s Free
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} JigSolitaire. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link href="/about" className="hover:text-slate-700 transition-colors">About</Link>
              <Link href="/privacy" className="hover:text-slate-700 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-slate-700 transition-colors">Terms</Link>
              <Link href="/cookies" className="hover:text-slate-700 transition-colors">Cookies</Link>
              <Link href="/parents" className="hover:text-slate-700 transition-colors">Parents</Link>
              <Link href="/contact" className="hover:text-slate-700 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

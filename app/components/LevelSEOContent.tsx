'use client';

import React from 'react';
import Link from 'next/link';
import { LevelSEOData } from '../utils/levelSEO';

interface LevelSEOContentProps {
  level: number;
  seoData: LevelSEOData;
}

export default function LevelSEOContent({ level, seoData }: LevelSEOContentProps) {
  const isHardLevel = level % 5 === 0;

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Level Hero Section */}
      <div className="relative py-16 lg:py-20 bg-gradient-to-b from-slate-50 to-white">
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
            <Link href="/levels" className="hover:text-slate-700 transition-colors">Levels</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Level {level}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">{seoData.collection}</span>
            </span>
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${isHardLevel
                ? 'bg-red-50 text-red-700 border border-red-200'
                : seoData.difficulty === 'Easy'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : seoData.difficulty === 'Medium'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-orange-50 text-orange-700 border border-orange-200'
              }`}>
              {seoData.difficulty}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
            {seoData.h1}
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed mb-4">
            {seoData.intro}
          </p>

          <p className="text-base text-slate-500 leading-relaxed mb-8">
            Play this <strong>JigSolitaire</strong> jigsaw solitaire puzzle for free — no download required.
            Works perfectly on desktop, mobile, and tablet browsers. Start solving now!
          </p>

          {/* Level Stats */}
          <div className="flex flex-wrap gap-6 md:gap-10">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-slate-900">Level {level}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Puzzle</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-slate-900">{seoData.puzzleType.split(' ')[0]}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Grid Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-slate-900">{seoData.estimatedTime}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Est. Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-amber-500">★★★</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Max Stars</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features & Tips Section */}
      <div className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Features */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">JigSolitaire Level {level} Features</h2>
              <ul className="space-y-4">
                {seoData.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Pro Tips for JigSolitaire Level {level}</h2>
              <ul className="space-y-4">
                {seoData.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <span className="text-slate-600">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* How to Play This Level */}
      <div className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            How to Play JigSolitaire Level {level}
          </h2>

          <div className="prose prose-slate max-w-none">
            <p>
              <strong>JigSolitaire Level {level}</strong> is part of our {seoData.collection} collection, featuring {seoData.difficulty.toLowerCase()} difficulty jigsaw solitaire gameplay.
              This JigSolitaire {seoData.puzzleType.toLowerCase()} puzzle challenges you to arrange all pieces in their correct positions by swapping tiles.
            </p>

            {isHardLevel ? (
              <>
                <h3>JigSolitaire Expert Level Challenge</h3>
                <p>
                  As an expert-level JigSolitaire challenge (Level {level}), this puzzle presents three connected 4x4 grids that must be solved sequentially.
                  Complete each JigSolitaire puzzle before moving to the next. This requires greater concentration and spatial awareness than standard levels.
                </p>
                <p>
                  The estimated JigSolitaire completion time of {seoData.estimatedTime} reflects the increased complexity.
                  Expert JigSolitaire players often aim to complete all three puzzles in under 5 minutes for maximum star rewards.
                </p>
              </>
            ) : (
              <>
                <h3>JigSolitaire Standard Level Gameplay</h3>
                <p>
                  This standard JigSolitaire {seoData.puzzleType.toLowerCase()} level uses a single image divided into 9 pieces.
                  Tap or drag pieces to swap their positions. The JigSolitaire puzzle is complete when all pieces are in their correct spots.
                </p>
                <p>
                  For JigSolitaire Level {level}, aim to complete the puzzle within {seoData.estimatedTime} to earn stars.
                  Complete in under 10 seconds for 3 stars, under 20 seconds for 2 stars, or simply finish to earn 1 star.
                </p>
              </>
            )}

            <h3>{seoData.spotlightHeading}</h3>
            <p>{seoData.spotlightCopy}</p>

            <h3>About the JigSolitaire {seoData.collection} Collection</h3>
            <p>
              The {seoData.collection} collection in JigSolitaire features carefully curated jigsaw solitaire images designed for {
                seoData.collection === 'Discovery' ? 'players who are just starting their JigSolitaire puzzle journey' :
                  seoData.collection === 'Nature' ? 'nature lovers and those seeking peaceful JigSolitaire imagery' :
                    seoData.collection === 'Adventure' ? 'players who enjoy exciting and dynamic JigSolitaire visuals' :
                      seoData.collection === 'Serenity' ? 'players looking for calming and meditative JigSolitaire experiences' :
                        seoData.collection === 'Heritage' ? 'history enthusiasts and art appreciators enjoying JigSolitaire' :
                          seoData.collection === 'Horizons' ? 'landscape lovers and travel enthusiasts playing JigSolitaire' :
                            seoData.collection === 'Cosmos' ? 'space enthusiasts and astronomy lovers solving JigSolitaire puzzles' :
                              'collectors seeking rare and special JigSolitaire puzzles'
              }. Each JigSolitaire level in this collection offers a unique visual experience while maintaining consistent quality and challenge.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation to Other Levels */}
      <div className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Explore More JigSolitaire Levels
          </h2>

          <div className="flex flex-wrap justify-center gap-3">
            {/* Previous levels */}
            {level > 3 && (
              <Link href={`/level/${level - 3}`} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                Level {level - 3}
              </Link>
            )}
            {level > 2 && (
              <Link href={`/level/${level - 2}`} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                Level {level - 2}
              </Link>
            )}
            {level > 1 && (
              <Link href={`/level/${level - 1}`} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                Level {level - 1}
              </Link>
            )}

            {/* Current level */}
            <span className="px-4 py-2 rounded-lg bg-amber-500 text-white font-semibold">
              Level {level}
            </span>

            {/* Next levels */}
            {level < 77 && (
              <Link href={`/level/${level + 1}`} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                Level {level + 1}
              </Link>
            )}
            {level < 76 && (
              <Link href={`/level/${level + 2}`} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                Level {level + 2}
              </Link>
            )}
            {level < 75 && (
              <Link href={`/level/${level + 3}`} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                Level {level + 3}
              </Link>
            )}
          </div>

          <div className="text-center mt-8">
            <Link href="/levels" className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold transition-colors">
              View All 77 JigSolitaire Levels
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ for this level */}
      <div className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            JigSolitaire Level {level} FAQ
          </h2>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-base font-bold text-slate-900 mb-2">How do I play JigSolitaire Level {level}?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                To play Level {level}, tap on a puzzle piece to select it, then tap another piece to swap their positions.
                Continue swapping until all pieces are in their correct positions. {isHardLevel ? 'Complete all three puzzles to finish this expert level.' : 'The puzzle is complete when the image is restored.'}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-base font-bold text-slate-900 mb-2">What is the difficulty of Level {level}?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Level {level} is rated as {seoData.difficulty} difficulty. {
                  isHardLevel
                    ? 'This is a milestone level featuring three 4x4 puzzles that must be completed in sequence, making it one of our most challenging levels.'
                    : `It uses a ${seoData.puzzleType.toLowerCase()} format and is estimated to take ${seoData.estimatedTime} to complete.`
                }
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-base font-bold text-slate-900 mb-2">How do I earn 3 stars on Level {level}?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {isHardLevel
                  ? `To earn 3 stars on this expert level, complete all three puzzles in under 3 minutes. Focus on corner pieces first and work systematically through each puzzle.`
                  : `Complete Level ${level} in under 10 seconds to earn 3 stars. Under 20 seconds earns 2 stars, and any completion earns 1 star. Practice makes perfect!`
                }
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-base font-bold text-slate-900 mb-2">Is Level {level} free to play?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Yes! JigSolitaire Level {level} is completely free to play. No downloads, no sign-ups, and no hidden costs.
                Just open this page and start playing instantly in your web browser.
              </p>
            </div>
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
            Ready to Play JigSolitaire Level {level}?
          </h2>
          <p className="text-lg text-amber-100 mb-6 max-w-xl mx-auto">
            Scroll up to start playing this {seoData.difficulty.toLowerCase()} JigSolitaire puzzle from the {seoData.collection} collection — it&apos;s free!
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.5 5.5v9l7-4.5-7-4.5z" />
            </svg>
            Play JigSolitaire Level {level} Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} JigSolitaire. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="hover:text-slate-700 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-slate-700 transition-colors">Terms of Service</Link>
              <Link href="/contact" className="hover:text-slate-700 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

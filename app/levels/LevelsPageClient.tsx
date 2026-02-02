'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAllProgress, getLevelProgress, type LevelProgress } from '../utils/storage';

function formatImageName(filename: string): string {
  const withoutExtension = filename.replace(/\.[^/.]+$/, '');
  const spaced = withoutExtension.replace(/[_\-]+/g, ' ').trim();

  if (!spaced) {
    return 'Puzzle Image';
  }

  return spaced
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const collections = [
  { name: 'Discovery', range: [1, 10], color: 'amber', desc: 'Perfect for beginners' },
  { name: 'Nature', range: [11, 20], color: 'emerald', desc: 'Beautiful nature scenes' },
  { name: 'Adventure', range: [21, 30], color: 'blue', desc: 'Exciting imagery' },
  { name: 'Serenity', range: [31, 40], color: 'purple', desc: 'Calming visuals' },
  { name: 'Heritage', range: [41, 50], color: 'rose', desc: 'Cultural and historical' },
  { name: 'Horizons', range: [51, 60], color: 'sky', desc: 'Stunning landscapes' },
  { name: 'Cosmos', range: [61, 70], color: 'indigo', desc: 'Space wonders' },
  { name: 'Treasures', range: [71, 77], color: 'orange', desc: 'Rare puzzles' },
];

function getCollectionForLevel(level: number) {
  for (const col of collections) {
    if (level >= col.range[0] && level <= col.range[1]) {
      return col;
    }
  }
  return collections[0];
}

export default function LevelsPageClient() {
  const router = useRouter();
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [levelProgress, setLevelProgress] = useState<Map<number, LevelProgress>>(new Map());

  const loadManifest = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/jig-images/manifest.json');

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data: unknown = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Manifest is empty or invalid');
      }

      const sortedImages = (data as string[]).sort();
      setAvailableImages(sortedImages);
    } catch (error) {
      console.error('Failed to load image manifest:', error);
      setAvailableImages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadManifest();
  }, [loadManifest]);

  useEffect(() => {
    const progress = getAllProgress();
    const progressMap = new Map<number, LevelProgress>();
    progress.forEach(p => {
      progressMap.set(p.level, p);
    });
    setLevelProgress(progressMap);
  }, []);

  const isLevelUnlocked = (level: number): boolean => {
    if (level === 1) return true;
    const previousLevel = levelProgress.get(level - 1);
    return previousLevel?.completed === true;
  };

  const handleLevelSelect = (level: number) => {
    if (!isLevelUnlocked(level)) return;
    router.push(`/level/${level}`);
  };

  const renderStars = (stars: number) => {
    return (
      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-0.5">
        {[1, 2, 3].map((starNum) => (
          <svg
            key={starNum}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            style={{
              fill: starNum <= stars ? 'var(--color-primary)' : 'var(--color-light-gray)',
            }}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    );
  };

  const completedLevels = Array.from(levelProgress.values()).filter(p => p.completed).length;
  const totalStars = Array.from(levelProgress.values()).reduce((sum, p) => sum + (p.stars || 0), 0);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--color-surface)' }}>
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full border-2"
          style={{ borderColor: 'var(--color-light-gray)' }}
        >
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
            style={{ borderColor: 'var(--color-primary)' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--color-surface)' }}
    >
      {/* Header Section */}
      <div className="bg-gradient-to-b from-slate-50 to-white py-8 sm:py-12 border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Navigation */}
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="btn-ghost"
              style={{ minWidth: '44px', padding: 'var(--spacing-sm)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <nav className="text-sm text-slate-500">
              <Link href="/" className="hover:text-slate-700">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-slate-900 font-medium">All Levels</span>
            </nav>
          </div>

          {/* Main Header */}
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            JigSolitaire Puzzle Levels
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mb-6">
            Browse all 77+ JigSolitaire jigsaw solitaire puzzles. Choose a level to start playing —
            from beginner-friendly Discovery puzzles to expert Treasures challenges.
          </p>

          {/* Progress Stats */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <div className="text-xl font-bold text-slate-900">{completedLevels}/{availableImages.length}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Completed</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
              <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <div>
                <div className="text-xl font-bold text-slate-900">{totalStars}/{availableImages.length * 3}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Stars Earned</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collections & Levels */}
      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Collections Overview */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">JigSolitaire Puzzle Collections</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {collections.map((col) => {
                const levelsInCollection = availableImages.slice(col.range[0] - 1, col.range[1]);
                const completedInCollection = levelsInCollection.filter((_, i) =>
                  levelProgress.get(col.range[0] + i)?.completed
                ).length;

                return (
                  <div key={col.name} className="p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-3 h-3 rounded-full bg-${col.color}-500`} style={{ backgroundColor: `var(--tw-${col.color}-500, #f59e0b)` }} />
                      <h3 className="font-bold text-slate-900">{col.name}</h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{col.desc}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Levels {col.range[0]}-{col.range[1]}</span>
                      <span className="font-medium text-emerald-600">{completedInCollection}/{col.range[1] - col.range[0] + 1}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Level Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">All JigSolitaire Levels</h2>
          </div>

          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            }}
          >
            {availableImages.map((_, index) => {
              const level = index + 1;
              const progress = levelProgress.get(level);
              const stars = progress?.stars || 0;
              const isUnlocked = isLevelUnlocked(level);
              const isCompleted = progress?.completed === true;
              const isHard = level % 5 === 0;
              const collection = getCollectionForLevel(level);

              return (
                <button
                  key={level}
                  onClick={() => handleLevelSelect(level)}
                  disabled={!isUnlocked}
                  className="group relative aspect-square w-full overflow-hidden rounded-xl transition-all"
                  style={{
                    borderRadius: 'var(--radius-round-medium)',
                    boxShadow: isUnlocked ? 'var(--shadow-soft)' : 'none',
                    background: isUnlocked ? 'var(--color-card-background)' : 'var(--color-light-gray)',
                    opacity: isUnlocked ? 1 : 0.5,
                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                    border: isHard && isUnlocked ? '2px solid #f59e0b' : isUnlocked ? 'none' : '2px solid var(--color-muted)',
                  }}
                  onMouseEnter={(e) => {
                    if (isUnlocked) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-elevated)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isUnlocked) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-soft)';
                    }
                  }}
                  title={`JigSolitaire Level ${level} - ${collection.name} Collection${isHard ? ' (Expert)' : ''}`}
                >
                  {/* Hard level indicator */}
                  {isHard && isUnlocked && (
                    <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded">
                      HARD
                    </div>
                  )}

                  {/* Stars on top */}
                  {isCompleted && stars > 0 && renderStars(stars)}

                  {/* Level Number */}
                  <div className="flex h-full w-full items-center justify-center">
                    {!isUnlocked ? (
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    ) : (
                      <span
                        className="text-2xl sm:text-3xl font-bold"
                        style={{
                          color: 'var(--color-text-primary)',
                          fontWeight: 700,
                        }}
                      >
                        {level}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            About JigSolitaire Puzzle Levels
          </h2>
          <div className="prose prose-slate max-w-none text-center">
            <p>
              JigSolitaire features 77+ unique jigsaw solitaire puzzle levels organized into themed collections.
              Each level offers a carefully curated image that&apos;s been optimized for our unique swap-based puzzle mechanics.
              Start with the Discovery collection if you&apos;re new to JigSolitaire, or jump into harder collections if you&apos;re
              looking for a challenge.
            </p>
            <p>
              Every 5th level (5, 10, 15, etc.) is an Expert-level challenge featuring three connected 4x4 puzzles
              that must be solved in sequence. These milestone levels are perfect for testing your JigSolitaire mastery
              and earning bonus stars.
            </p>
            <p>
              Your progress is saved automatically, so you can pick up right where you left off.
              Earn up to 3 stars on each level by completing puzzles quickly — under 10 seconds for 3 stars!
            </p>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-bold rounded-full hover:bg-amber-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.5 5.5v9l7-4.5-7-4.5z" />
              </svg>
              Play JigSolitaire Now
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} JigSolitaire. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link href="/" className="hover:text-slate-700 transition-colors">Play JigSolitaire</Link>
              <Link href="/about" className="hover:text-slate-700 transition-colors">About</Link>
              <Link href="/privacy-policy" className="hover:text-slate-700 transition-colors">Privacy</Link>
              <Link href="/contact" className="hover:text-slate-700 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

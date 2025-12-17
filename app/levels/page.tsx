'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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

export default function LevelsPage() {
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
    if (level === 1) return true; // First level is always unlocked
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
      className="min-h-screen px-4 py-6 sm:px-6 sm:py-8"
      style={{ background: 'var(--color-surface)' }}
    >
      <div className="mx-auto max-w-4xl">
        {/* Header */}
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
          <h1 
            className="text-2xl font-bold uppercase tracking-tight"
            style={{ 
              color: 'var(--color-text-primary)',
              fontSize: '28px',
              lineHeight: '34px',
              letterSpacing: '0.01em'
            }}
          >
            Select a Level
          </h1>
        </div>

        {/* Level Grid */}
        <div 
          className="grid gap-4"
          style={{ 
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          }}
        >
          {availableImages.map((_, index) => {
            const level = index + 1;
            const progress = levelProgress.get(level);
            const stars = progress?.stars || 0;
            const isUnlocked = isLevelUnlocked(level);
            const isCompleted = progress?.completed === true;

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
                  border: isUnlocked ? 'none' : '2px solid var(--color-muted)',
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
              >
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
                      className="text-3xl font-bold"
                      style={{
                        color: 'var(--color-text-primary)',
                        fontSize: '32px',
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
  );
}

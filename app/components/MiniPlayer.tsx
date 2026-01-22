'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getBackgroundMusicManager } from '../utils/backgroundMusic';

// Dynamic import for GSAP to prevent SSR errors
let gsap: any = null;
if (typeof window !== 'undefined') {
  import('gsap').then(module => {
    gsap = module.default;
  });
}

export default function MiniPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'prev' | null>(null);

  // Refs for GSAP animations
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const waveRippleRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);

  const updateState = useCallback(() => {
    const manager = getBackgroundMusicManager();
    setIsPlaying(manager.getIsPlaying());
    setProgress(manager.getProgress());
  }, []);

  useEffect(() => {
    const manager = getBackgroundMusicManager();
    updateState();

    const unsubscribe = manager.subscribe(updateState);

    const progressInterval = setInterval(() => {
      if (manager.getIsPlaying()) {
        setProgress(manager.getProgress());
      }
    }, 100);

    // Auto-play on first user interaction (browsers require user gesture for audio)
    const attemptAutoPlay = () => {
      if (!manager.getIsPlaying()) {
        manager.play().catch(() => {
          // If autoplay fails, we'll wait for user interaction
        });
      }
      // Remove listeners after first attempt
      document.removeEventListener('click', attemptAutoPlay);
      document.removeEventListener('touchstart', attemptAutoPlay);
      document.removeEventListener('keydown', attemptAutoPlay);
    };

    // Try autoplay immediately (works if returning user or allowed by browser)
    setTimeout(() => {
      manager.play().catch(() => {
        // Autoplay blocked - add listeners for first interaction
        document.addEventListener('click', attemptAutoPlay, { once: true });
        document.addEventListener('touchstart', attemptAutoPlay, { once: true });
        document.addEventListener('keydown', attemptAutoPlay, { once: true });
      });
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(progressInterval);
      document.removeEventListener('click', attemptAutoPlay);
      document.removeEventListener('touchstart', attemptAutoPlay);
      document.removeEventListener('keydown', attemptAutoPlay);
    };
  }, [updateState]);

  // GSAP expand/collapse animation
  useEffect(() => {
    if (!controlsRef.current || !gsap) return;

    if (isExpanded) {
      gsap.to(controlsRef.current, {
        width: 'auto',
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out',
      });
    } else {
      gsap.to(controlsRef.current, {
        width: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power3.inOut',
      });
    }
  }, [isExpanded]);

  // Visualizer pulse animation on play/pause
  useEffect(() => {
    if (!visualizerRef.current || !gsap) return;

    if (isPlaying) {
      gsap.to(visualizerRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'elastic.out(1, 0.5)',
      });
    } else {
      gsap.to(visualizerRef.current, {
        scale: 0.95,
        opacity: 0.7,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [isPlaying]);

  const handlePlayPause = async () => {
    const manager = getBackgroundMusicManager();

    // Animate visualizer
    if (visualizerRef.current && gsap) {
      gsap.to(visualizerRef.current, {
        scale: 0.9,
        duration: 0.1,
        ease: 'power2.in',
        onComplete: () => {
          gsap.to(visualizerRef.current, {
            scale: 1,
            duration: 0.3,
            ease: 'elastic.out(1, 0.5)',
          });
        },
      });
    }

    await manager.toggle();
    updateState();
  };

  const animateTrackChange = async (direction: 'next' | 'prev') => {
    if (!gsap) return { xIn: 0, rotateIn: 0, direction }; // Safety check

    const xOut = direction === 'next' ? -20 : 20;
    const xIn = direction === 'next' ? 20 : -20;
    const rotateOut = direction === 'next' ? -180 : 180;
    const rotateIn = direction === 'next' ? 180 : -180;

    // Create timeline for smooth orchestration
    const tl = gsap.timeline();

    // Step 1: Trigger wave ripple effect
    if (waveRippleRef.current && gsap) {
      gsap.fromTo(waveRippleRef.current,
        { scale: 0.5, opacity: 1 },
        {
          scale: 2.5,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
        }
      );
    }

    // Step 2: Animate disc spinning out
    if (discRef.current && gsap) {
      tl.to(discRef.current, {
        rotateY: rotateOut,
        scale: 0.7,
        opacity: 0,
        duration: 0.25,
        ease: 'power3.in',
      }, 0);
    }

    // Step 3: Fade out visualizer and bars with slide
    if (visualizerRef.current && barsRef.current && gsap) {
      tl.to([visualizerRef.current, barsRef.current], {
        x: xOut,
        opacity: 0,
        scale: 0.8,
        duration: 0.25,
        ease: 'power3.in',
      }, 0);
    }

    // Wait for exit animations
    await tl;

    return { xIn, rotateIn, direction };
  };

  const animateTrackEnter = async (xIn: number, rotateIn: number, direction: 'next' | 'prev') => {
    if (!gsap) return; // Safety check

    const tl = gsap.timeline();

    // Step 1: Animate disc spinning in
    if (discRef.current && gsap) {
      tl.fromTo(discRef.current,
        { rotateY: rotateIn, scale: 0.7, opacity: 0 },
        {
          rotateY: 0,
          scale: 1,
          opacity: 1,
          duration: 0.35,
          ease: 'back.out(1.7)',
        },
        0
      );
    }

    // Step 2: Animate visualizer and bars sliding in
    if (visualizerRef.current && barsRef.current && gsap) {
      tl.fromTo([visualizerRef.current, barsRef.current],
        { x: xIn, opacity: 0, scale: 0.8 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.35,
          ease: 'back.out(1.4)',
        },
        0.05
      );
    }

    // Step 3: Bounce effect on container
    if (containerRef.current && gsap) {
      tl.fromTo(containerRef.current,
        { scale: 1.05 },
        {
          scale: 1,
          duration: 0.3,
          ease: 'elastic.out(1, 0.4)',
        },
        0.15
      );
    }

    await tl;
  };

  const handleNext = async () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTransitionDirection('next');

    const manager = getBackgroundMusicManager();

    // Animate out
    const animData = await animateTrackChange('next');

    // Change track
    await manager.nextTrack();
    updateState();

    // Animate in
    await animateTrackEnter(animData.xIn, animData.rotateIn, animData.direction);

    setTransitionDirection(null);
    setIsTransitioning(false);
  };

  const handlePrevious = async () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTransitionDirection('prev');

    const manager = getBackgroundMusicManager();

    // Animate out
    const animData = await animateTrackChange('prev');

    // Change track
    await manager.previousTrack();
    updateState();

    // Animate in
    await animateTrackEnter(animData.xIn, animData.rotateIn, animData.direction);

    setTransitionDirection(null);
    setIsTransitioning(false);
  };

  const handleMouseEnter = () => {
    setIsExpanded(true);

    // Subtle lift animation on container
    if (containerRef.current && gsap) {
      gsap.to(containerRef.current, {
        scale: 1.02,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);

    if (containerRef.current && gsap) {
      gsap.to(containerRef.current, {
        scale: 1,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Player Pill - Light Mode */}
      <div
        ref={containerRef}
        className="flex items-center gap-1.5 px-1.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm"
        style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}
      >
        {/* Visualizer Circle with enhanced animations */}
        <div className="relative" style={{ perspective: '200px' }}>
          {/* Wave ripple effect - expands outward on track change */}
          <div
            ref={waveRippleRef}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)',
              opacity: 0,
              transform: 'scale(0.5)',
            }}
          />

          {/* Main disc container with 3D flip */}
          <div
            ref={discRef}
            className="relative"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div
              ref={visualizerRef}
              className="relative w-8 h-8 rounded-full overflow-hidden bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center cursor-pointer shadow-md"
              onClick={handlePlayPause}
              style={{
                boxShadow: isTransitioning
                  ? '0 0 20px rgba(251, 191, 36, 0.6), 0 4px 12px rgba(0,0,0,0.15)'
                  : '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              {/* Animated bars when playing */}
              <div ref={barsRef} className="flex items-end gap-[2px] h-3.5">
                {isPlaying ? (
                  <>
                    <div className="w-[3px] bg-white/90 rounded-full animate-bar-1" />
                    <div className="w-[3px] bg-white/90 rounded-full animate-bar-2" />
                    <div className="w-[3px] bg-white/90 rounded-full animate-bar-3" />
                  </>
                ) : (
                  <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>

              {/* Progress ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeDasharray={`${progress * 100} 100`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 0.1s ease' }}
                />
              </svg>

              {/* Spinning highlight during transition */}
              {isTransitioning && (
                <div
                  className="absolute inset-0 rounded-full pointer-events-none animate-spin-slow"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.3) 25%, transparent 50%)',
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Controls - shown on hover */}
        <div
          ref={controlsRef}
          className="flex items-center gap-0.5 overflow-hidden"
          style={{ width: 0, opacity: 0 }}
        >
          {/* Previous */}
          <button
            onClick={handlePrevious}
            disabled={isTransitioning}
            className="track-btn w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all disabled:opacity-50 active:scale-90"
            aria-label="Previous track"
            style={{
              transform: transitionDirection === 'prev' ? 'scale(0.85)' : undefined,
              transition: 'transform 0.15s ease',
            }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            onClick={handlePlayPause}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-md hover:shadow-lg transition-all active:scale-90"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Next */}
          <button
            onClick={handleNext}
            disabled={isTransitioning}
            className="track-btn w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all disabled:opacity-50 active:scale-90"
            aria-label="Next track"
            style={{
              transform: transitionDirection === 'next' ? 'scale(0.85)' : undefined,
              transition: 'transform 0.15s ease',
            }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>

      </div>

      <style jsx>{`
        @keyframes bar1 {
          0%, 100% { height: 30%; }
          50% { height: 100%; }
        }
        @keyframes bar2 {
          0%, 100% { height: 100%; }
          50% { height: 30%; }
        }
        @keyframes bar3 {
          0%, 100% { height: 50%; }
          25% { height: 100%; }
          75% { height: 30%; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-bar-1 {
          height: 40%;
          animation: bar1 0.8s ease-in-out infinite;
        }
        .animate-bar-2 {
          height: 70%;
          animation: bar2 0.6s ease-in-out infinite;
        }
        .animate-bar-3 {
          height: 55%;
          animation: bar3 0.7s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 0.5s linear infinite;
        }
      `}</style>
    </div>
  );
}

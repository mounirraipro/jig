'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { getBackgroundMusicManager } from '../utils/backgroundMusic';

export default function MiniPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(1);
  const [totalTracks, setTotalTracks] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Refs for GSAP animations
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const trackIndicatorRef = useRef<HTMLDivElement>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);

  const updateState = useCallback(() => {
    const manager = getBackgroundMusicManager();
    setIsPlaying(manager.getIsPlaying());
    setCurrentTrack(manager.getCurrentTrackIndex() + 1);
    setTotalTracks(manager.getTotalTracks());
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

    return () => {
      unsubscribe();
      clearInterval(progressInterval);
    };
  }, [updateState]);

  // GSAP expand/collapse animation
  useEffect(() => {
    if (!controlsRef.current || !trackIndicatorRef.current) return;

    const tl = gsap.timeline();

    if (isExpanded) {
      // Expand animation
      tl.to(controlsRef.current, {
        width: 'auto',
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out',
      })
      .to(trackIndicatorRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: 'power2.in',
      }, 0);
    } else {
      // Collapse animation
      tl.to(controlsRef.current, {
        width: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power3.inOut',
      })
      .to(trackIndicatorRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      }, 0.1);
    }
  }, [isExpanded]);

  // Visualizer pulse animation on play/pause
  useEffect(() => {
    if (!visualizerRef.current) return;

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
    if (visualizerRef.current) {
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

  const handleNext = async () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    const manager = getBackgroundMusicManager();
    
    // Fade out animation
    if (visualizerRef.current && barsRef.current) {
      await gsap.to([visualizerRef.current, barsRef.current], {
        opacity: 0.3,
        x: -10,
        duration: 0.2,
        ease: 'power2.in',
      });
    }

    await manager.nextTrack();
    updateState();

    // Fade in animation
    if (visualizerRef.current && barsRef.current) {
      gsap.fromTo([visualizerRef.current, barsRef.current], 
        { opacity: 0.3, x: 10 },
        { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
      );
    }

    setIsTransitioning(false);
  };

  const handlePrevious = async () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    const manager = getBackgroundMusicManager();
    
    // Fade out animation
    if (visualizerRef.current && barsRef.current) {
      await gsap.to([visualizerRef.current, barsRef.current], {
        opacity: 0.3,
        x: 10,
        duration: 0.2,
        ease: 'power2.in',
      });
    }

    await manager.previousTrack();
    updateState();

    // Fade in animation
    if (visualizerRef.current && barsRef.current) {
      gsap.fromTo([visualizerRef.current, barsRef.current], 
        { opacity: 0.3, x: -10 },
        { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
      );
    }

    setIsTransitioning(false);
  };

  const handleMouseEnter = () => {
    setIsExpanded(true);
    
    // Subtle lift animation on container
    if (containerRef.current) {
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
    
    if (containerRef.current) {
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
        {/* Visualizer Circle */}
        <div 
          ref={visualizerRef}
          className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center cursor-pointer shadow-md"
          onClick={handlePlayPause}
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
                <path d="M8 5v14l11-7z"/>
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
            className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
            aria-label="Previous track"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            onClick={handlePlayPause}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md hover:shadow-lg transition-shadow"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          {/* Next */}
          <button
            onClick={handleNext}
            disabled={isTransitioning}
            className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
            aria-label="Next track"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>
        </div>

        {/* Track indicator - visible when collapsed */}
        <div 
          ref={trackIndicatorRef}
          className="text-[11px] font-semibold text-slate-500 tabular-nums pr-1"
        >
          {totalTracks > 0 && `${currentTrack}/${totalTracks}`}
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
      `}</style>
    </div>
  );
}

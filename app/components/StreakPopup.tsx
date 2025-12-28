'use client';

import { useState, useEffect, useRef } from 'react';
import { StreakInfo } from '../utils/storage';

interface StreakPopupProps {
  streakInfo: StreakInfo;
  onClose: () => void;
}

export default function StreakPopup({ streakInfo, onClose }: StreakPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showFlame, setShowFlame] = useState(false);
  const [showNumber, setShowNumber] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [displayNumber, setDisplayNumber] = useState(0);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Staggered animation sequence
    const timers = [
      setTimeout(() => setIsVisible(true), 50),
      setTimeout(() => setShowFlame(true), 200),
      setTimeout(() => setShowNumber(true), 500),
      setTimeout(() => setShowMessage(true), 900),
      setTimeout(() => setShowButton(true), 1200),
    ];

    // Animate number counting up
    if (streakInfo.currentStreak > 1) {
      const startNum = Math.max(0, streakInfo.currentStreak - 5);
      let current = startNum;
      const countTimer = setInterval(() => {
        current++;
        setDisplayNumber(current);
        if (current >= streakInfo.currentStreak) {
          clearInterval(countTimer);
        }
      }, 80);
      timers.push(countTimer as unknown as ReturnType<typeof setTimeout>);
    } else {
      setDisplayNumber(1);
    }

    return () => timers.forEach(t => clearTimeout(t));
  }, [streakInfo.currentStreak]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const getMessage = () => {
    if (streakInfo.isFirstVisitEver) {
      return "Welcome to JigSolitaire! 🎉";
    }
    if (streakInfo.isNewRecord) {
      return "🎉 New streak record!";
    }
    if (streakInfo.streakContinued) {
      if (streakInfo.currentStreak >= 7) {
        return "You're on fire! 🔥";
      }
      if (streakInfo.currentStreak >= 3) {
        return "Great job! Keep it up!";
      }
      return "Welcome back!";
    }
    return "Let's start a new streak!";
  };

  const getSubMessage = () => {
    if (streakInfo.isFirstVisitEver) {
      return "Play daily to build your streak";
    }
    if (streakInfo.streakContinued) {
      return `You've played ${streakInfo.currentStreak} day${streakInfo.currentStreak !== 1 ? 's' : ''} in a row!`;
    }
    return "Play again tomorrow to continue";
  };

  // Use createPortal pattern - render as overlay that doesn't affect document flow
  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="streak-popup-title"
      className={`fixed inset-0 z-100 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent pointer-events-none'
      }`}
      onClick={handleClose}
      // Prevent CLS by not affecting layout
      style={{ contain: 'layout' }}
    >
      <div 
        ref={popupRef}
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all duration-500 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
        style={{
          background: 'linear-gradient(180deg, #FFF9E6 0%, #FFFFFF 50%)',
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-amber-200/30 rounded-full blur-2xl" />
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-orange-200/30 rounded-full blur-2xl" />
        
        {/* Flame icon */}
        <div 
          className={`relative mx-auto w-28 h-28 mb-4 transition-all duration-700 ${
            showFlame ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
        >
          {/* Animated glow ring */}
          <div 
            className={`absolute inset-0 rounded-full transition-all duration-1000 ${
              showFlame ? 'animate-pulse' : ''
            }`}
            style={{
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)',
              transform: 'scale(1.5)',
            }}
          />
          
          {/* Main flame container */}
          <div 
            className="relative w-full h-full rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #FFBF00 0%, #FF8C00 100%)',
              boxShadow: '0 8px 32px rgba(255, 140, 0, 0.4)',
            }}
          >
            {/* Flame SVG */}
            <svg 
              width="56" 
              height="56" 
              viewBox="0 0 24 24" 
              fill="white"
              className={`transition-transform duration-500 ${showFlame ? 'animate-bounce-slow' : ''}`}
            >
              <path d="M12 23c-3.866 0-7-3.134-7-7 0-2.577 1.409-4.827 3.5-6.03-.214 1.155.227 2.383 1.174 3.168.347.288.79.452 1.247.452.166 0 .333-.02.495-.06.66-.16 1.19-.66 1.39-1.31.2-.65.09-1.37-.31-1.92-.29-.41-.42-.91-.36-1.41.06-.51.3-.97.68-1.31 1.53-1.38 2.38-3.32 2.38-5.38 0-.34-.03-.67-.08-1 2.97 1.54 5 4.64 5 8.24C19 19.866 15.866 23 12 23z"/>
            </svg>
          </div>
          
          {/* Sparkles */}
          {showFlame && (
            <>
              <div className="absolute -top-2 left-4 w-3 h-3 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
              <div className="absolute top-4 -right-2 w-2 h-2 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }} />
              <div className="absolute -bottom-1 right-6 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" style={{ animationDelay: '0.6s' }} />
            </>
          )}
        </div>

        {/* Streak number */}
        <div 
          className={`text-center mb-2 transition-all duration-500 ${
            showNumber ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div 
            className="text-6xl font-extrabold bg-gradient-to-b from-amber-500 to-orange-600 bg-clip-text text-transparent"
            style={{ fontFamily: 'system-ui' }}
          >
            {displayNumber}
          </div>
          <div className="text-lg font-semibold text-amber-700 uppercase tracking-wide">
            Day Streak
          </div>
        </div>

        {/* Message */}
        <div 
          className={`text-center mb-6 transition-all duration-500 ${
            showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p id="streak-popup-title" className="text-xl font-bold text-gray-800 mb-1">
            {getMessage()}
          </p>
          <p className="text-sm text-gray-500">
            {getSubMessage()}
          </p>
        </div>

        {/* Streak calendar preview */}
        {streakInfo.currentStreak >= 2 && (
          <div 
            className={`flex justify-center gap-1.5 mb-6 transition-all duration-500 ${
              showMessage ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {Array.from({ length: Math.min(7, streakInfo.currentStreak) }, (_, i) => (
              <div 
                key={i}
                className="w-8 h-8 rounded-lg bg-gradient-to-b from-amber-400 to-orange-500 flex items-center justify-center"
                style={{ 
                  animationDelay: `${i * 100}ms`,
                  opacity: showMessage ? 1 : 0,
                  transform: showMessage ? 'scale(1)' : 'scale(0)',
                  transition: `all 0.3s ease ${i * 100}ms`,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M12 23c-3.866 0-7-3.134-7-7 0-2.577 1.409-4.827 3.5-6.03-.214 1.155.227 2.383 1.174 3.168.347.288.79.452 1.247.452.166 0 .333-.02.495-.06.66-.16 1.19-.66 1.39-1.31.2-.65.09-1.37-.31-1.92-.29-.41-.42-.91-.36-1.41.06-.51.3-.97.68-1.31 1.53-1.38 2.38-3.32 2.38-5.38 0-.34-.03-.67-.08-1 2.97 1.54 5 4.64 5 8.24C19 19.866 15.866 23 12 23z"/>
                </svg>
              </div>
            ))}
            {streakInfo.currentStreak > 7 && (
              <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                +{streakInfo.currentStreak - 7}
              </div>
            )}
          </div>
        )}

        {/* Best streak badge */}
        {streakInfo.isNewRecord && streakInfo.currentStreak > 1 && (
          <div 
            className={`mx-auto mb-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full inline-flex items-center gap-2 text-white font-semibold text-sm transition-all duration-500 ${
              showMessage ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Personal Best!
          </div>
        )}

        {/* Continue button */}
        <button
          onClick={handleClose}
          className={`w-full py-4 rounded-2xl font-bold text-lg text-white transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] ${
            showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{
            background: 'linear-gradient(135deg, #FFBF00 0%, #FF8C00 100%)',
            boxShadow: '0 4px 20px rgba(255, 140, 0, 0.4)',
          }}
        >
          Let&apos;s Play!
        </button>

        {/* Longest streak info */}
        {streakInfo.longestStreak > 1 && !streakInfo.isNewRecord && (
          <p 
            className={`text-center mt-4 text-sm text-gray-400 transition-all duration-500 ${
              showButton ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Your best: {streakInfo.longestStreak} days
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

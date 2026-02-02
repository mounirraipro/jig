'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSettings, updateSetting, type GameSettings } from '../utils/settings';
import { getPlayerStats, getAllProgress, clearProgress } from '../utils/storage';
import { getBackgroundMusicManager } from '../utils/backgroundMusic';

// Icons
const IconBack = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const IconTimer = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconHint = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
  </svg>
);

const IconVolume = ({ muted }: { muted: boolean }) => (
  muted ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="22" y1="9" x2="16" y2="15" />
      <line x1="16" y1="9" x2="22" y2="15" />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  )
);

const IconMusic = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const IconStats = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 20V10" />
    <path d="M12 20V4" />
    <path d="M6 20v-6" />
  </svg>
);

const IconTrash = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const IconStar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconPuzzle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.315 8.685a.98.98 0 0 1 .837-.276c.47.07.802.48.968.925a2.501 2.501 0 1 0 3.214-3.214c-.446-.166-.855-.497-.925-.968a.979.979 0 0 1 .276-.837l1.61-1.61a2.404 2.404 0 0 1 1.705-.707c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z" />
  </svg>
);

const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconFlame = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 23c-3.866 0-7-3.134-7-7 0-2.209.895-4.209 2.342-5.657l4.243-4.243a1 1 0 0 1 1.414 0l1.414 1.414-2.828 2.828a3 3 0 1 0 4.243 4.243l2.828-2.828 1.414 1.414a1 1 0 0 1 0 1.414l-4.243 4.243C14.209 22.105 13.209 23 12 23Z" />
  </svg>
);

const IconChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<GameSettings>(getSettings());
  const [volume, setVolume] = useState(0.3);
  const [stats, setStats] = useState({
    puzzlesSolved: 0,
    starsEarned: 0,
    timePlayed: 0,
    currentStreak: 0,
    longestStreak: 0,
  });
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    const playerStats = getPlayerStats();
    const progress = getAllProgress();
    const musicManager = getBackgroundMusicManager();

    setStats({
      puzzlesSolved: playerStats.totalPuzzlesSolved,
      starsEarned: playerStats.totalStarsEarned,
      timePlayed: playerStats.totalTimePlayed,
      currentStreak: playerStats.currentStreak,
      longestStreak: playerStats.longestStreak,
    });

    setVolume(musicManager.getVolume());
  }, []);

  const handleToggle = (key: keyof GameSettings) => {
    const newValue = !settings[key] as boolean;
    const newSettings = { ...settings, [key]: newValue };
    setSettings(newSettings);
    updateSetting(key, newValue);

    // Sync mute with music manager
    if (key === 'muted') {
      const musicManager = getBackgroundMusicManager();
      musicManager.setEnabled(!newValue);
    }
  };

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    const musicManager = getBackgroundMusicManager();
    musicManager.setVolume(newVolume);
  }, []);

  const handleClearProgress = async () => {
    setIsClearing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    clearProgress();
    setStats({
      puzzlesSolved: 0,
      starsEarned: 0,
      timePlayed: 0,
      currentStreak: 0,
      longestStreak: 0,
    });
    setShowClearConfirm(false);
    setIsClearing(false);
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-surface)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-[#FFFDF6]/90 border-b border-black/5">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="p-2 -ml-2 rounded-xl hover:bg-black/5 transition-colors"
            aria-label="Go back"
          >
            <IconBack />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E1E]">
            Settings
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-24 space-y-8">
        {/* Game Settings Section */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6A6A6A] mb-4 px-1">
            Gameplay
          </h2>
          <div className="space-y-3">
            <SettingToggle
              icon={<IconTimer active={settings.playWithTime} />}
              title="Play with Timer"
              description="Show elapsed time during gameplay"
              value={settings.playWithTime}
              onToggle={() => handleToggle('playWithTime')}
            />
            <SettingToggle
              icon={<IconHint active={settings.showHints} />}
              title="Show Hints"
              description="Enable hint button to highlight correct positions"
              value={settings.showHints}
              onToggle={() => handleToggle('showHints')}
            />
          </div>
        </section>

        {/* Sound Settings Section */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6A6A6A] mb-4 px-1">
            Sound & Music
          </h2>
          <div className="space-y-3">
            <SettingToggle
              icon={<IconVolume muted={settings.muted} />}
              title="Sound Effects"
              description="Play sounds for clicks and puzzle completion"
              value={!settings.muted}
              onToggle={() => handleToggle('muted')}
            />

            {/* Volume Slider */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white">
                  <IconMusic />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#1E1E1E]">Music Volume</p>
                  <p className="text-sm text-[#6A6A6A]">
                    {settings.muted ? 'Sound is muted' : `${Math.round(volume * 100)}%`}
                  </p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={(e) => handleVolumeChange(Number(e.target.value) / 100)}
                  disabled={settings.muted}
                  className="volume-slider w-full h-2 rounded-full appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: settings.muted
                      ? '#E5E5E5'
                      : `linear-gradient(to right, #FFBF00 0%, #FFBF00 ${volume * 100}%, #E5E5E5 ${volume * 100}%, #E5E5E5 100%)`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6A6A6A] mb-4 px-1 flex items-center gap-2">
            <IconStats />
            Your Statistics
          </h2>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <StatCard
                icon={<IconPuzzle />}
                label="Puzzles Solved"
                value={stats.puzzlesSolved}
                color="amber"
              />
              <StatCard
                icon={<IconStar />}
                label="Stars Earned"
                value={stats.starsEarned}
                color="yellow"
              />
              <StatCard
                icon={<IconClock />}
                label="Time Played"
                value={formatTime(stats.timePlayed)}
                color="orange"
              />
              <StatCard
                icon={<IconFlame />}
                label="Current Streak"
                value={`${stats.currentStreak} day${stats.currentStreak !== 1 ? 's' : ''}`}
                color="red"
              />
              <StatCard
                icon={<IconFlame />}
                label="Best Streak"
                value={`${stats.longestStreak} day${stats.longestStreak !== 1 ? 's' : ''}`}
                color="orange"
              />
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6A6A6A] mb-4 px-1">
            Data
          </h2>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5">
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full p-4 flex items-center gap-4 hover:bg-red-50 transition-colors text-left group"
            >
              <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center text-red-500 group-hover:bg-red-200 transition-colors">
                <IconTrash />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-red-600">Clear All Progress</p>
                <p className="text-sm text-[#6A6A6A]">Reset statistics and level progress</p>
              </div>
              <IconChevronRight />
            </button>
          </div>
        </section>

        {/* Links Section */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6A6A6A] mb-4 px-1">
            About
          </h2>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5 divide-y divide-black/5">
            <LinkItem href="/about" label="About JigSolitaire" />
            <LinkItem href="/parents" label="Parents & Guardians" />
            <LinkItem href="/privacy-policy" label="Privacy Policy" />
            <LinkItem href="/terms" label="Terms of Service" />
            <LinkItem href="/cookies" label="Cookie Policy" />
            <LinkItem href="/contact" label="Contact Us" />
          </div>
        </section>

        {/* Version */}
        <div className="text-center py-4">
          <p className="text-sm text-[#9A9A9A]">JigSolitaire v1.0.0</p>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center text-[#1E1E1E] mb-2">
              Clear All Progress?
            </h3>
            <p className="text-center text-[#6A6A6A] mb-6">
              This will permanently delete all your puzzle progress, statistics, and achievements. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl font-semibold bg-[#F3F3F2] text-[#1E1E1E] hover:bg-[#E5E5E5] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearProgress}
                disabled={isClearing}
                className="flex-1 py-3 px-4 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isClearing ? 'Clearing...' : 'Clear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom styles for range slider */}
      <style jsx>{`
        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          cursor: pointer;
          border: 2px solid #FFBF00;
          transition: transform 0.15s ease;
        }
        .volume-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        .volume-slider:disabled::-webkit-slider-thumb {
          border-color: #CFCFCF;
        }
        .volume-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          cursor: pointer;
          border: 2px solid #FFBF00;
        }
      `}</style>
    </div>
  );
}

// Setting Toggle Component
function SettingToggle({
  icon,
  title,
  description,
  value,
  onToggle,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-black/5">
      <div className="flex items-center gap-4">
        <div
          className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center transition-all ${value
              ? 'bg-linear-to-br from-amber-400 to-orange-500 text-white'
              : 'bg-[#F3F3F2] text-[#6A6A6A]'
            }`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0 mr-2">
          <p className="font-semibold text-[#1E1E1E]">{title}</p>
          <p className="text-sm text-[#6A6A6A]">{description}</p>
        </div>
        <button
          onClick={onToggle}
          role="switch"
          aria-checked={value}
          className={`relative w-14 h-8 shrink-0 rounded-full transition-all ${value ? 'bg-linear-to-r from-amber-400 to-orange-500' : 'bg-[#E5E5E5]'
            }`}
        >
          <span
            className="absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200"
            style={{
              transform: value ? 'translateX(24px)' : 'translateX(0)',
            }}
          />
        </button>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: 'amber' | 'yellow' | 'orange' | 'red';
}) {
  const colorClasses = {
    amber: 'text-amber-500',
    yellow: 'text-yellow-500',
    orange: 'text-orange-500',
    red: 'text-red-500',
  };

  return (
    <div className="text-center p-3 rounded-xl bg-[#FAFAF8]">
      <div className={`inline-flex mb-1 ${colorClasses[color]}`}>{icon}</div>
      <p className="text-lg sm:text-xl font-bold text-[#1E1E1E]">{value}</p>
      <p className="text-xs text-[#6A6A6A] truncate">{label}</p>
    </div>
  );
}

// Link Item Component
function LinkItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-4 hover:bg-[#FAFAF8] transition-colors"
    >
      <span className="font-medium text-[#1E1E1E]">{label}</span>
      <IconChevronRight />
    </Link>
  );
}

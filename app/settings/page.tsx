'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSettings, updateSetting, type GameSettings } from '../utils/settings';

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<GameSettings>(getSettings());



  const handleToggle = (key: keyof GameSettings) => {
    const newValue = !settings[key] as boolean;
    const newSettings = { ...settings, [key]: newValue };
    setSettings(newSettings);
    updateSetting(key, newValue);
  };

  return (
    <div
      className="min-h-screen px-4 py-6 sm:px-6 sm:py-8"
      style={{ background: 'var(--color-surface)' }}
    >
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
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
            Settings
          </h1>
        </div>

        {/* Settings Options */}
        <div className="space-y-4">
          <SettingItem
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke={settings.playWithTime ? 'var(--color-black)' : 'var(--color-text-secondary)'}
                strokeWidth="2"
                style={{ color: settings.playWithTime ? 'var(--color-black)' : 'var(--color-text-secondary)' }}
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            }
            title="Play with Time"
            description="Enable timer during gameplay"
            value={settings.playWithTime}
            onToggle={() => handleToggle('playWithTime')}
          />

          <SettingItem
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke={settings.showHints ? 'var(--color-black)' : 'var(--color-text-secondary)'}
                strokeWidth="2"
                style={{ color: settings.showHints ? 'var(--color-black)' : 'var(--color-text-secondary)' }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            }
            title="Show Hints"
            description="Allow hint button during gameplay"
            value={settings.showHints}
            onToggle={() => handleToggle('showHints')}
          />

          <SettingItem
            icon={
              settings.muted ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-black)"
                  strokeWidth="2"
                  style={{ color: 'var(--color-black)' }}
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-text-secondary)"
                  strokeWidth="2"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )
            }
            title="Mute"
            description="Disable all game sounds"
            value={settings.muted}
            onToggle={() => handleToggle('muted')}
          />
        </div>
      </div>
    </div>
  );
}

function SettingItem({
  icon,
  title,
  description,
  value,
  onToggle
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="card flex items-center justify-between p-6 transition-all"
      style={{
        padding: 'var(--spacing-lg)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-elevated)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-soft)';
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{
            background: value ? 'var(--color-primary)' : 'var(--color-light-gray)',
            borderRadius: 'var(--radius-round-medium)',
          }}
        >
          {icon}
        </div>
        <div>
          <label
            className="block font-bold"
            style={{
              color: 'var(--color-text-primary)',
              fontSize: '18px',
              lineHeight: '24px',
              fontWeight: 700,
            }}
          >
            {title}
          </label>
          <p
            className="mt-1"
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: '13px',
              lineHeight: '18px',
            }}
          >
            {description}
          </p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className="relative h-10 w-16 rounded-full transition-all"
        style={{
          background: value ? 'var(--color-primary)' : 'var(--color-light-gray)',
          borderRadius: 'var(--radius-pill)',
        }}
      >
        <span
          className="absolute top-1 h-8 w-8 rounded-full bg-white transition-transform"
          style={{
            transform: value ? 'translateX(26px)' : 'translateX(2px)',
            boxShadow: 'var(--shadow-soft)',
          }}
        />
      </button>
    </div>
  );
}

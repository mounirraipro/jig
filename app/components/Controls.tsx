'use client';

import { RotateCcw, Shuffle, Lightbulb } from 'lucide-react';

interface ControlsProps {
  onNewGame: () => void;
  onShuffle: () => void;
  onHint: () => void;
  showHints?: boolean;
  compact?: boolean;
}

export default function Controls({ onNewGame, onShuffle, onHint, showHints = true, compact = false }: ControlsProps) {
  const iconSize = compact ? 16 : 20;
  const buttonSize = compact ? 32 : 40;
  const borderRadius = compact ? 'var(--radius-round-medium)' : 'var(--radius-round-large)';

  return (
    <div 
      className="flex flex-row items-center justify-center"
      style={{ gap: compact ? 'var(--spacing-xxs)' : 'var(--spacing-xs)' }}
    >
      <button
        onClick={onNewGame}
        className="btn-secondary"
        style={{ 
          width: `${buttonSize}px`,
          height: `${buttonSize}px`,
          minWidth: `${buttonSize}px`,
          minHeight: `${buttonSize}px`,
          padding: 0,
          borderRadius: borderRadius,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label="New Puzzle"
      >
        <RotateCcw size={iconSize} />
      </button>
      <button
        onClick={onShuffle}
        className="btn-ghost"
        style={{ 
          width: `${buttonSize}px`,
          height: `${buttonSize}px`,
          minWidth: `${buttonSize}px`,
          minHeight: `${buttonSize}px`,
          padding: 0,
          borderRadius: borderRadius,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label="Shuffle"
      >
        <Shuffle size={iconSize} />
      </button>
      {showHints && (
        <button
          onClick={onHint}
          className="btn-ghost"
          style={{ 
            width: `${buttonSize}px`,
            height: `${buttonSize}px`,
            minWidth: `${buttonSize}px`,
            minHeight: `${buttonSize}px`,
            padding: 0,
            borderRadius: borderRadius,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Hint"
        >
          <Lightbulb size={iconSize} />
        </button>
      )}
    </div>
  );
}

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
  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={onNewGame}
          className="btn-ghost rounded-full p-2 h-10 w-10 flex items-center justify-center hover:bg-white/50"
          title="New Game"
        >
          <RotateCcw size={20} />
        </button>
        <button
          onClick={onShuffle}
          className="btn-ghost rounded-full p-2 h-10 w-10 flex items-center justify-center hover:bg-white/50"
          title="Shuffle Tiles"
        >
          <Shuffle size={20} />
        </button>
        {showHints && (
          <button
            onClick={onHint}
            className="btn-ghost rounded-full p-2 h-10 w-10 flex items-center justify-center hover:bg-white/50"
            title="Show Hint"
          >
            <Lightbulb size={20} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 w-full">
      <button
        onClick={onNewGame}
        className="btn-secondary flex flex-col gap-2 items-center justify-center py-4 h-auto transition-all hover:-translate-y-1"
        style={{
          borderRadius: 'var(--radius-round-medium)',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}
      >
        <RotateCcw size={22} />
        <span>Restart</span>
      </button>
      <button
        onClick={onShuffle}
        className="btn-ghost flex flex-col gap-2 items-center justify-center py-4 h-auto transition-all hover:-translate-y-1"
        style={{
          borderRadius: 'var(--radius-round-medium)',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          background: 'var(--color-light-gray)',
          border: 'none',
        }}
      >
        <Shuffle size={22} />
        <span>Shuffle</span>
      </button>
      {showHints && (
        <button
          onClick={onHint}
          className="btn-ghost flex flex-col gap-2 items-center justify-center py-4 h-auto transition-all hover:-translate-y-1"
          style={{
            borderRadius: 'var(--radius-round-medium)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            background: 'var(--color-light-gray)',
            border: 'none',
          }}
        >
          <Lightbulb size={22} />
          <span>Hint</span>
        </button>
      )}
    </div>
  );
}

'use client';

interface ControlsProps {
  onNewGame: () => void;
  onShuffle: () => void;
  onHint: () => void;
  showHints?: boolean;
  compact?: boolean;
}

export default function Controls({ onNewGame, onShuffle, onHint, showHints = true, compact = false }: ControlsProps) {
  const buttonStyle = compact 
    ? { fontSize: '10px', letterSpacing: '0.1em', padding: 'var(--spacing-xxs) var(--spacing-xs)' }
    : { fontSize: '12px', letterSpacing: '0.15em', padding: 'var(--spacing-xs) var(--spacing-sm)' };

  return (
    <div 
      className="flex flex-col items-center justify-center sm:flex-row"
      style={{ gap: compact ? 'var(--spacing-xxs)' : 'var(--spacing-xs)' }}
    >
      <button
        onClick={onNewGame}
        className="btn-secondary"
        style={compact ? { minHeight: '32px', fontSize: '10px', padding: 'var(--spacing-xxs) var(--spacing-xs)' } : {}}
      >
        <span style={buttonStyle}>New Puzzle</span>
      </button>
      <button
        onClick={onShuffle}
        className="btn-ghost"
        style={compact ? { minHeight: '32px', fontSize: '10px', padding: 'var(--spacing-xxs) var(--spacing-xs)' } : {}}
      >
        <span style={buttonStyle}>Shuffle</span>
      </button>
      {showHints && (
        <button
          onClick={onHint}
          className="btn-ghost"
          style={compact ? { minHeight: '32px', fontSize: '10px', padding: 'var(--spacing-xxs) var(--spacing-xs)' } : {}}
        >
          <span style={buttonStyle}>Hint</span>
        </button>
      )}
    </div>
  );
}

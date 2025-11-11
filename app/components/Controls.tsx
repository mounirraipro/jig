'use client';

interface ControlsProps {
  onNewGame: () => void;
  onShuffle: () => void;
  onHint: () => void;
}

export default function Controls({ onNewGame, onShuffle, onHint }: ControlsProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap gap-2">
        <button
          onClick={onNewGame}
          className="control-button bg-slate-900 text-white hover:bg-slate-700"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">New Puzzle</span>
        </button>
        <button
          onClick={onShuffle}
          className="control-button border-slate-300 bg-white text-slate-800 hover:bg-slate-100"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">Shuffle</span>
        </button>
      </div>
      <button
        onClick={onHint}
        className="control-button w-full border-slate-300 bg-white text-slate-800 hover:bg-slate-100 sm:w-auto"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">Hint</span>
      </button>
    </div>
  );
}


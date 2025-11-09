'use client';

interface ControlsProps {
  onNewGame: () => void;
  onShuffle: () => void;
  onHint: () => void;
}

export default function Controls({ onNewGame, onShuffle, onHint }: ControlsProps) {
  return (
    <div className="flex gap-3 justify-center flex-wrap">
      <button
        onClick={onNewGame}
        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl 
                   transition-all duration-200 hover:shadow-lg active:scale-95 uppercase tracking-wide"
      >
        New Game
      </button>
      <button
        onClick={onShuffle}
        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl 
                   transition-all duration-200 hover:shadow-lg active:scale-95 uppercase tracking-wide"
      >
        Shuffle
      </button>
      <button
        onClick={onHint}
        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl 
                   transition-all duration-200 hover:shadow-lg active:scale-95 uppercase tracking-wide"
      >
        Hint
      </button>
    </div>
  );
}


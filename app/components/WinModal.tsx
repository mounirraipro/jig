'use client';

interface WinModalProps {
  isOpen: boolean;
  moves: number;
  time: string;
  completedImage: string;
  onPlayAgain: () => void;
}

export default function WinModal({ isOpen, moves, time, completedImage, onPlayAgain }: WinModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 p-8 rounded-2xl text-center text-white max-w-md w-full shadow-2xl">
        <h2 className="text-5xl font-bold mb-6">🎉 Completed!</h2>
        <img
          src={completedImage}
          alt="Completed puzzle"
          className="w-full rounded-xl mb-6 ring-4 ring-slate-700"
        />
        <div className="space-y-2 mb-6 text-xl">
          <p>
            Moves: <span className="font-bold text-yellow-400">{moves}</span>
          </p>
          <p>
            Time: <span className="font-bold text-yellow-400">{time}</span>
          </p>
        </div>
        <button
          onClick={onPlayAgain}
          className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl 
                     transition-all duration-200 hover:shadow-lg active:scale-95 uppercase tracking-wide"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}


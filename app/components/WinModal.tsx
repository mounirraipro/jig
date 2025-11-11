'use client';

import Image from 'next/image';

interface WinModalProps {
  isOpen: boolean;
  moves: number;
  time: string;
  completedImage: string;
  completedImageName: string;
  onPlayAgain: () => void;
}

export default function WinModal({
  isOpen,
  moves,
  time,
  completedImage,
  completedImageName,
  onPlayAgain,
}: WinModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-3 backdrop-blur-sm">
      <div className="w-full max-w-[300px] rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-xl sm:max-w-[320px]">
        <h2 className="text-lg font-semibold text-slate-900">Nice Work!</h2>

        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
          <Image
            src={completedImage || ''}
            alt={completedImageName || 'Completed puzzle'}
            width={360}
            height={360}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <div className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-500">
          Moves {moves} · Time {time}
        </div>

        <button
          onClick={onPlayAgain}
          className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-slate-700"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}


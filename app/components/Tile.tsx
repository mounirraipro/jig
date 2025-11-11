'use client';

import { useEffect, useMemo, useState } from 'react';

interface TileProps {
  imageData: string;
  isSelected: boolean;
  isCorrect: boolean;
  isHinted: boolean;
  onClick: () => void;
}

export default function Tile({ imageData, isSelected, isCorrect, isHinted, onClick }: TileProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [justMatched, setJustMatched] = useState(false);

  useEffect(() => {
    if (isCorrect) {
      setJustMatched(true);
      const timeout = setTimeout(() => setJustMatched(false), 700);
      return () => clearTimeout(timeout);
    }

    setJustMatched(false);
    return undefined;
  }, [isCorrect]);

  const ringClass = useMemo(() => {
    if (isSelected) return 'border-indigo-500 shadow-[0_6px_16px_rgba(79,70,229,0.18)]';
    if (isHinted) return 'border-sky-400 shadow-[0_6px_16px_rgba(56,189,248,0.18)]';
    if (isCorrect) return 'border-emerald-400 shadow-[0_6px_16px_rgba(34,197,94,0.18)]';
    return 'border-slate-200 hover:border-slate-300 shadow-sm';
  }, [isSelected, isHinted, isCorrect]);

  return (
    <div
      className={`
        group relative aspect-square w-full cursor-pointer overflow-hidden rounded-xl border bg-white
        transition-transform duration-200 ease-out ${ringClass}
        ${isHovered || isSelected ? 'scale-[1.02]' : ''}
        ${justMatched ? 'tile-just-matched' : ''}
        active:scale-95
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={imageData}
        alt="Puzzle piece"
        className="h-full w-full select-none object-cover"
        draggable={false}
      />

      {isCorrect && (
        <div className="pointer-events-none absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-medium text-white shadow">
          ✓
        </div>
      )}

      {isHinted && !isCorrect && (
        <div className="pointer-events-none absolute inset-0 animate-[pulse_1.6s_ease-in-out_infinite] rounded-2xl border-2 border-sky-400/60" />
      )}
    </div>
  );
}


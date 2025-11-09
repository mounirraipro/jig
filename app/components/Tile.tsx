'use client';

import { useState } from 'react';

interface TileProps {
  imageData: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function Tile({ imageData, isSelected, onClick }: TileProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        relative aspect-[0.7] rounded-xl overflow-hidden cursor-pointer
        transition-all duration-200 
        ${isSelected 
          ? 'ring-4 ring-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.6)] scale-[1.02]' 
          : 'ring-2 ring-slate-800 hover:ring-slate-600'
        }
        ${isHovered && !isSelected ? 'scale-[1.02]' : ''}
        active:scale-95
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={imageData}
        alt="Puzzle piece"
        className="w-full h-full object-cover select-none pointer-events-none"
        draggable={false}
      />
    </div>
  );
}


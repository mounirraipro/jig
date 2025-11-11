'use client';

import { Tile as TileType } from '../types/game';
import Tile from './Tile';

interface PuzzleGridProps {
  tiles: TileType[];
  selectedTile: number | null;
  hintedTileId: number | null;
  onTileClick: (index: number) => void;
}

export default function PuzzleGrid({ tiles, selectedTile, hintedTileId, onTileClick }: PuzzleGridProps) {
  return (
    <div className="grid aspect-square w-full max-w-full grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:gap-3 sm:p-4">
      {tiles.map((tile, index) => (
        <Tile
          key={tile.id}
          imageData={tile.imageData}
          isSelected={selectedTile === index}
          isCorrect={tile.currentPos === tile.correctPos}
          isHinted={hintedTileId === tile.id}
          onClick={() => onTileClick(index)}
        />
      ))}
    </div>
  );
}


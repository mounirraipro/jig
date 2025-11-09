'use client';

import { Tile as TileType } from '../types/game';
import Tile from './Tile';

interface PuzzleGridProps {
  tiles: TileType[];
  selectedTile: number | null;
  onTileClick: (index: number) => void;
}

export default function PuzzleGrid({ tiles, selectedTile, onTileClick }: PuzzleGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2 bg-slate-800 p-4 rounded-2xl shadow-lg">
      {tiles.map((tile, index) => (
        <Tile
          key={tile.id}
          imageData={tile.imageData}
          isSelected={selectedTile === index}
          onClick={() => onTileClick(index)}
        />
      ))}
    </div>
  );
}


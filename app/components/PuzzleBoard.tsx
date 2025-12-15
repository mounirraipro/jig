import React, { useMemo } from 'react';
import { Tile as TileType } from '../types/game';
import Tile from './Tile';

interface PuzzleBoardProps {
    tiles: TileType[];
    gridSize: number;
    tileWidth: number;
    tileHeight: number;
    imageUrl: string;
    selectedTile: number | null;
    hintedTileId: number | null;
    onTileClick: (index: number) => void;
    onTileDragSwap: (fromIndex: number, toIndex: number) => void;
    compact?: boolean;
}

export default function PuzzleBoard({
    tiles,
    gridSize,
    tileWidth,
    tileHeight,
    imageUrl,
    selectedTile,
    hintedTileId,
    onTileClick,
    onTileDragSwap,
    compact = false,
}: PuzzleBoardProps) {
    // Calculate aspect ratio for the container
    const aspectRatio = useMemo(() => {
        return (tileWidth * gridSize) / (tileHeight * gridSize);
    }, [tileWidth, tileHeight, gridSize]);

    return (
        <div
            className="relative select-none transition-all duration-500"
            style={{
                aspectRatio: `${aspectRatio}`,
                width: '100%',
                height: 'auto',
                maxWidth: '100%',
                maxHeight: '100%',
                boxShadow: 'var(--shadow-elevated)',
                borderRadius: 'var(--radius-round-large)',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(8px)',
                border: 'var(--glass-border)',
                overflow: 'hidden',
                objectFit: 'contain',
            }}
        >
            {tiles.map((tile, index) => {
                // Calculate position based on currentPos (where it is visually)
                const currentRow = Math.floor(tile.currentPos / gridSize);
                const currentCol = tile.currentPos % gridSize;

                const topPercent = (currentRow / gridSize) * 100;
                const leftPercent = (currentCol / gridSize) * 100;
                const widthPercent = 100 / gridSize;
                const heightPercent = 100 / gridSize;

                return (
                    <div
                        key={tile.id}
                        className="absolute transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                        style={{
                            top: `${topPercent}%`,
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`,
                            height: `${heightPercent}%`,
                            zIndex: selectedTile === index ? 50 : 10,
                            transform: selectedTile === index ? 'scale(1.05)' : 'scale(1)',
                        }}
                    >
                        <Tile
                            tile={tile}
                            index={index}
                            isSelected={selectedTile === index}
                            isHinted={hintedTileId === tile.id}
                            onClick={() => onTileClick(index)}
                            onDragSwap={onTileDragSwap}
                            width={tileWidth}
                            height={tileHeight}
                            imageUrl={imageUrl}
                            gridSize={gridSize}
                        />
                    </div>
                );
            })}
        </div>
    );
}

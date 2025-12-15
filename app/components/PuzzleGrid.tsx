'use client';

import { useMemo } from 'react';

import { Tile as TileType, TileMergeDirections } from '../types/game';
import Tile from './Tile';

interface PuzzleGridProps {
  tiles: TileType[];
  selectedTile: number | null;
  hintedTileId: number | null;
  onTileClick: (index: number) => void;
  onTileDragSwap: (fromIndex: number, toIndex: number) => void;
  compact?: boolean;
  tileWidth: number;
  tileHeight: number;
  imageUrl: string;
  gridSize: number;
}

export default function PuzzleGrid({
  tiles,
  selectedTile,
  hintedTileId,
  onTileClick,
  onTileDragSwap,
  compact = false,
  tileWidth,
  tileHeight,
  imageUrl,
  gridSize,
}: PuzzleGridProps) {
  const rows = gridSize;
  const cols = gridSize;
  const totalTiles = tiles.length;

  const createEmptyMerge = (): TileMergeDirections => ({
    top: false,
    right: false,
    bottom: false,
    left: false,
    topLeft: false,
    topRight: false,
    bottomLeft: false,
    bottomRight: false,
  });

  const mergeDirectionsByIndex = useMemo(() => {
    if (tiles.length === 0) return [];

    const size = gridSize;

    return tiles.map((tile, index) => {
      if (tile.currentPos !== tile.correctPos) {
        return createEmptyMerge();
      }

      const row = Math.floor(index / size);
      const col = index % size;

      const checkNeighbor = (rowOffset: number, colOffset: number) => {
        const targetRow = row + rowOffset;
        const targetCol = col + colOffset;

        if (targetRow < 0 || targetRow >= size || targetCol < 0 || targetCol >= size) {
          return false;
        }

        const neighborIndex = targetRow * size + targetCol;
        const neighborTile = tiles[neighborIndex];

        if (!neighborTile || neighborTile.currentPos !== neighborTile.correctPos) {
          return false;
        }

        const tileCorrectRow = Math.floor(tile.correctPos / size);
        const tileCorrectCol = tile.correctPos % size;
        const neighborCorrectRow = Math.floor(neighborTile.correctPos / size);
        const neighborCorrectCol = neighborTile.correctPos % size;

        return (
          neighborCorrectRow - tileCorrectRow === rowOffset &&
          neighborCorrectCol - tileCorrectCol === colOffset
        );
      };

      return {
        top: checkNeighbor(-1, 0),
        right: checkNeighbor(0, 1),
        bottom: checkNeighbor(1, 0),
        left: checkNeighbor(0, -1),
        topLeft: checkNeighbor(-1, -1),
        topRight: checkNeighbor(-1, 1),
        bottomLeft: checkNeighbor(1, -1),
        bottomRight: checkNeighbor(1, 1),
      };
    });
  }, [tiles, gridSize]);

  // Calculate which edges of merged groups should have borders
  const groupBorderEdges = useMemo(() => {
    if (tiles.length === 0) return new Map<number, { top: boolean; right: boolean; bottom: boolean; left: boolean }>();

    const edges = new Map<number, { top: boolean; right: boolean; bottom: boolean; left: boolean }>();

    tiles.forEach((tile, index) => {
      if (tile.currentPos !== tile.correctPos) {
        edges.set(index, { top: false, right: false, bottom: false, left: false });
        return;
      }

      const merge = mergeDirectionsByIndex[index] ?? createEmptyMerge();

      // Border shows on edges that are not merged (outer edges of the group)
      edges.set(index, {
        top: !merge.top,
        right: !merge.right,
        bottom: !merge.bottom,
        left: !merge.left,
      });
    });

    return edges;
  }, [tiles, mergeDirectionsByIndex]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        padding: 0,
        width: 'auto',
        height: 'auto',
        maxWidth: '100%',
        maxHeight: '100%',
        aspectRatio: `${tileWidth * cols} / ${tileHeight * rows}`,
        gap: 0,
        margin: 'auto',
        boxSizing: 'border-box',
        alignContent: 'center',
        overflow: 'hidden',
        boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.5)',
        borderRadius: '4px',
      }}
    >
      {tiles.map((tile, index) => (
        <Tile
          key={tile.id}
          index={index}
          imageUrl={imageUrl}
          correctPos={tile.correctPos}
          gridSize={gridSize}
          isSelected={selectedTile === index}
          isCorrect={tile.currentPos === tile.correctPos}
          isHinted={tile.id === hintedTileId}
          onClick={() => onTileClick(index)}
          onDragSwap={onTileDragSwap}
          mergeDirections={mergeDirectionsByIndex[index] ?? createEmptyMerge()}
          groupBorderEdges={groupBorderEdges.get(index) ?? { top: false, right: false, bottom: false, left: false }}
          width={tileWidth}
          height={tileHeight}
        />
      ))}
    </div>
  );
}

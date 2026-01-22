'use client';

import {
  useMemo,
  useRef,
  useState,
  useEffect,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { Tile as TileType, TileMergeDirections, GroupBorderEdges } from '../types/game';

// Dynamic import for GSAP to prevent SSR errors
let gsap: any = null;
if (typeof window !== 'undefined') {
  import('gsap').then(module => {
    gsap = module.default;
  });
}

interface TileProps {
  tile: TileType;
  index: number;
  isSelected: boolean;
  isHinted: boolean;
  isDragging?: boolean;
  isDragTarget?: boolean;
  onClick: () => void;
  // Simplified Drag Events - Parent handles the logic
  onDragStart?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onDragMove?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onDragEnd?: (e: ReactPointerEvent<HTMLDivElement>) => void;

  width: number;
  height: number;
  imageUrl: string;
  gridSize: number;
  mergeDirections?: TileMergeDirections;
  groupBorderEdges?: GroupBorderEdges;
}

export default function Tile({
  tile,
  imageUrl,
  isSelected,
  isHinted,
  isDragging = false,
  isDragTarget = false,
  gridSize,
  onClick,
  onDragStart,
  onDragMove,
  onDragEnd,
  mergeDirections,
  groupBorderEdges,
}: TileProps) {
  const { currentPos, correctPos } = tile;
  const isCorrect = currentPos === correctPos;
  const [isHovered, setIsHovered] = useState(false);
  const tileRef = useRef<HTMLDivElement | null>(null);

  // --- Visuals / Animations ---

  // React to Drag State
  useEffect(() => {
    if (!tileRef.current || !gsap) return;

    if (isDragging) {
      // Lift up
      gsap.to(tileRef.current, {
        scale: 1.15,
        zIndex: 100,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
        duration: 0.2
      });
    } else {
      // Put down
      gsap.to(tileRef.current, {
        scale: isHovered || isSelected ? 1.05 : 1,
        zIndex: isSelected ? 50 : 1,
        boxShadow: isSelected ? '0 10px 15px -3px rgba(0,0,0,0.1)' : 'none',
        duration: 0.2
      });
      // We do NOT reset x/y here automatically, relying on FLIP in parent or direct control
      // But for safety, if we aren't dragging, we should probably be at 0,0 distinct 
      // from the parent's positioning?
      // Actually, if the parent uses FLIP, the parent will set the 'style.top/left'
      // and we might need to reset 'translate' if we used it for dragging.
      // We'll assume the Drag handler in parent manages the 'transform' during drag,
      // or we do it here. 
      // For this refactor, let's keep simple local drag-following here?
      // No, user assumes "Smart Grid". Parent should probably control POSITION.
      // But for performance, local transform is better.
      // Let's reset translation when not dragging.
      gsap.to(tileRef.current, { x: 0, y: 0, duration: 0.2 });
    }
  }, [isDragging, isHovered, isSelected]);

  // Magnet / Target Effect
  useEffect(() => {
    if (!tileRef.current || isDragging || !gsap) return;

    if (isDragTarget) {
      // Scale 1.05 creates slight overlap which visually merges the tiles
      // and gives the "pop" effect requested without splitting seams
      gsap.to(tileRef.current, { scale: 1.05, brightness: 1.1, duration: 0.2 });
    } else if (!isHovered && !isSelected) {
      gsap.to(tileRef.current, { scale: 1, brightness: 1, duration: 0.2 });
    }
  }, [isDragTarget, isDragging, isHovered, isSelected]);


  // --- Event Handling ---
  // We handle looking at the pointer to move the tile visually 'locally' 
  // but report to parent for game logic.

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    onDragStart?.(e);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      onDragMove?.(e);
    }
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (isDragging) {
      onDragEnd?.(e);
    } else {
      onClick();
    }
  };


  // --- Styles ---
  const borderStyles = useMemo(() => {
    if (isCorrect) {
      const borderWidth = '2px';
      const borderColor = 'rgba(255, 191, 0, 0.4)'; // Gold-ish
      const { top = false, right = false, bottom = false, left = false } = groupBorderEdges || {};
      return {
        borderTopWidth: top ? borderWidth : 0,
        borderRightWidth: right ? borderWidth : 0,
        borderBottomWidth: bottom ? borderWidth : 0,
        borderLeftWidth: left ? borderWidth : 0,
        borderStyle: 'solid',
        borderColor: borderColor,
      };
    }
    const { top = false, right = false, bottom = false, left = false } = mergeDirections || {};
    return {
      borderTopWidth: top ? 0 : '1px',
      borderRightWidth: right ? 0 : '1px',
      borderBottomWidth: bottom ? 0 : '1px',
      borderLeftWidth: left ? 0 : '1px',
      borderStyle: 'solid',
      borderColor: 'rgba(255, 255, 255, 0.2)',
    };
  }, [mergeDirections, isCorrect, groupBorderEdges]);

  // Background Image Position
  const bgPosition = useMemo(() => {
    const row = Math.floor(correctPos / gridSize);
    const col = correctPos % gridSize;
    // e.g. 3x3 grid. items at 0, 1, 2.
    // 0 -> 0%, 1 -> 50%, 2 -> 100%
    const percentX = gridSize > 1 ? (col / (gridSize - 1)) * 100 : 0;
    const percentY = gridSize > 1 ? (row / (gridSize - 1)) * 100 : 0;
    return `${percentX}% ${percentY}%`;
  }, [correctPos, gridSize]);


  return (
    <div
      ref={tileRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => !isCorrect && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="tile-content relative w-full h-full select-none touch-none"
      style={{
        ...borderStyles,
        background: 'var(--color-surface)',
        outline: isSelected || isHinted ? '2px solid var(--color-primary)' : 'none',
        outlineOffset: '-2px',
        cursor: isDragging ? 'grabbing' : 'grab',
        overflow: 'hidden',
        // Performance optimization
        willChange: 'transform',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
          backgroundPosition: bgPosition,
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Overlays */}
      {!isCorrect && (isHovered || isDragging) && (
        <div className="absolute inset-0 bg-white/10 pointer-events-none transition-opacity" />
      )}

      {isDragTarget && !isDragging && (
        <div className="absolute inset-0 bg-amber-400/30 border-2 border-amber-400 pointer-events-none animate-pulse" />
      )}

      {isHinted && !isCorrect && (
        <div className="pointer-events-none absolute inset-0 animate-[pulse_1.6s_ease-in-out_infinite] border-2 border-yellow-400" />
      )}
    </div>
  );
}

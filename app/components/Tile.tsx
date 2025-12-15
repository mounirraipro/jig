'use client';

import {
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';


import { Tile as TileType, TileMergeDirections, GroupBorderEdges } from '../types/game';

const BASE_BORDER_WIDTH = 0;



interface TileProps {
  tile: TileType;
  index: number;
  isSelected: boolean;
  isHinted: boolean;
  onClick: () => void;
  onDragSwap: (fromIndex: number, toIndex: number) => void;
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
  index,
  gridSize,
  onClick,
  onDragSwap,
  mergeDirections,
  groupBorderEdges,
  width,
  height,
}: TileProps) {
  const { currentPos, correctPos } = tile;
  const isCorrect = currentPos === correctPos;
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const tileRef = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const startPositionRef = useRef({ x: 0, y: 0 });
  const dragMovedRef = useRef(false);

  const baseScale = useMemo(() => {
    if (isDragging) return 1.05;
    if (isHovered || isSelected) return 1.02;
    return 1;
  }, [isDragging, isHovered, isSelected]);

  const borderStyles = useMemo(() => {
    if (isCorrect) {
      // For correct tiles, use group border style
      const borderWidth = '2px';
      const borderColor = 'rgba(255, 191, 0, 0.4)';

      const {
        top: groupTop = false,
        right: groupRight = false,
        bottom: groupBottom = false,
        left: groupLeft = false,
      } = groupBorderEdges || {};

      return {
        borderTopWidth: groupTop ? borderWidth : 0,
        borderRightWidth: groupRight ? borderWidth : 0,
        borderBottomWidth: groupBottom ? borderWidth : 0,
        borderLeftWidth: groupLeft ? borderWidth : 0,
        borderTopStyle: groupTop ? ('solid' as const) : ('none' as const),
        borderRightStyle: groupRight ? ('solid' as const) : ('none' as const),
        borderBottomStyle: groupBottom ? ('solid' as const) : ('none' as const),
        borderLeftStyle: groupLeft ? ('solid' as const) : ('none' as const),
        borderTopColor: groupTop ? borderColor : 'transparent',
        borderRightColor: groupRight ? borderColor : 'transparent',
        borderBottomColor: groupBottom ? borderColor : 'transparent',
        borderLeftColor: groupLeft ? borderColor : 'transparent',
      };
    }

    // For incorrect tiles, remove borders on merged edges
    const {
      top: mergeTop = false,
      right: mergeRight = false,
      bottom: mergeBottom = false,
      left: mergeLeft = false,
    } = mergeDirections || {};

    return {
      borderTopWidth: mergeTop ? 0 : '1px',
      borderRightWidth: mergeRight ? 0 : '1px',
      borderBottomWidth: mergeBottom ? 0 : '1px',
      borderLeftWidth: mergeLeft ? 0 : '1px',
      borderStyle: 'solid',
      borderColor: 'rgba(255, 255, 255, 0.1)',
    };
  }, [mergeDirections, isCorrect, groupBorderEdges]);

  const borderRadiusStyles = useMemo(() => {
    return { borderRadius: 0 };
  }, []);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (isCorrect) {
      event.preventDefault();
      return;
    }

    if (event.button !== 0) return;
    event.preventDefault();

    pointerIdRef.current = event.pointerId;
    startPositionRef.current = { x: event.clientX, y: event.clientY };
    dragMovedRef.current = false;
    setIsDragging(true);
    setDragOffset({ x: 0, y: 0 });

    tileRef.current?.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || pointerIdRef.current !== event.pointerId) return;

    const dx = event.clientX - startPositionRef.current.x;
    const dy = event.clientY - startPositionRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const threshold = 6;

    if (!dragMovedRef.current && distance > threshold) {
      dragMovedRef.current = true;
    }

    if (distance === 0) {
      setDragOffset({ x: 0, y: 0 });
      return;
    }

    const maxDistance = 92;
    const normalized = Math.min(distance / maxDistance, 1);
    const eased = 1 - Math.pow(1 - normalized, 2.4);
    const limitedDistance = eased * maxDistance;
    const factor = limitedDistance / distance;

    setDragOffset({
      x: dx * factor,
      y: dy * factor,
    });
  };

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>, cancelled = false) => {
    if (!isDragging) return;

    if (pointerIdRef.current !== null) {
      tileRef.current?.releasePointerCapture(pointerIdRef.current);
    }

    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });

    if (!cancelled) {
      if (dragMovedRef.current) {
        const dropTarget = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
        const dropTile = dropTarget?.closest('[data-tile-index]') as HTMLElement | null;

        if (dropTile) {
          const dropIndex = Number(dropTile.dataset.tileIndex);
          if (!Number.isNaN(dropIndex) && dropIndex !== index) {
            onDragSwap(index, dropIndex);
          }
        }
      } else {
        onClick();
      }
    }

    pointerIdRef.current = null;
    dragMovedRef.current = false;
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    finishDrag(event);
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    finishDrag(event, true);
  };

  const isLocked = isCorrect;

  // Calculate background position based on correct position
  const bgPosition = useMemo(() => {
    const row = Math.floor(correctPos / gridSize);
    const col = correctPos % gridSize;
    const percentX = (col / (gridSize - 1)) * 100;
    const percentY = (row / (gridSize - 1)) * 100;
    return `${percentX}% ${percentY}%`;
  }, [correctPos, gridSize]);

  return (
    <div
      ref={tileRef}
      data-tile-index={index}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onMouseEnter={() => !isLocked && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`tile-content relative cursor-pointer overflow-hidden w-full h-full ${isCorrect ? 'z-0' : isSelected ? 'z-20 shadow-2xl' : 'z-10 hover:brightness-110'
        }`}
      style={{
        ...borderStyles,
        ...borderRadiusStyles,
        background: 'var(--color-surface)',
        transition: isDragging ? 'transform 70ms ease-out' : 'transform 200ms var(--motion-easing)',
        boxShadow: isDragging
          ? 'var(--shadow-elevated)'
          : (isLocked
            ? '0 2px 4px rgba(16,16,16,0.04)'
            : '0 4px 8px rgba(16,16,16,0.1), 0 2px 4px rgba(16,16,16,0.06)'),
        outline: isSelected || isHinted ? '2px solid var(--color-primary)' : 'none',
        outlineOffset: isSelected || isHinted ? '-2px' : '0',
        pointerEvents: isLocked ? 'none' : 'auto',
        margin: 0,
        padding: 0,
        width: '100%',
        height: '100%',
        // aspectRatio: `${width} / ${height}`, // Handled by parent container dimensions
        boxSizing: 'border-box',
        transform: isLocked
          ? `scale(${baseScale})`
          : `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) scale(${baseScale})`,
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

      {isHinted && !isCorrect && (
        <div
          className="pointer-events-none absolute inset-0 animate-[pulse_1.6s_ease-in-out_infinite] border-2"
          style={{
            borderColor: 'var(--color-primary)',
            opacity: 0.6,
            borderRadius: 0,
          }}
        />
      )}
    </div>
  );
}

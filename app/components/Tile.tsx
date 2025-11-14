'use client';

import {
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import Image from 'next/image';

import type { TileMergeDirections } from '../types/game';

const BASE_BORDER_WIDTH = 0;

interface GroupBorderEdges {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

interface TileProps {
  imageData: string;
  isSelected: boolean;
  isCorrect: boolean;
  isHinted: boolean;
  index: number;
  onClick: () => void;
  onDragSwap: (fromIndex: number, toIndex: number) => void;
  mergeDirections: TileMergeDirections;
  groupBorderEdges: GroupBorderEdges;
}

export default function Tile({
  imageData,
  isSelected,
  isHinted,
  isCorrect,
  index,
  onClick,
  onDragSwap,
  mergeDirections,
  groupBorderEdges,
}: TileProps) {
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
      
      return {
        borderTopWidth: groupBorderEdges.top ? borderWidth : 0,
        borderRightWidth: groupBorderEdges.right ? borderWidth : 0,
        borderBottomWidth: groupBorderEdges.bottom ? borderWidth : 0,
        borderLeftWidth: groupBorderEdges.left ? borderWidth : 0,
        borderTopStyle: groupBorderEdges.top ? ('solid' as const) : ('none' as const),
        borderRightStyle: groupBorderEdges.right ? ('solid' as const) : ('none' as const),
        borderBottomStyle: groupBorderEdges.bottom ? ('solid' as const) : ('none' as const),
        borderLeftStyle: groupBorderEdges.left ? ('solid' as const) : ('none' as const),
        borderTopColor: groupBorderEdges.top ? borderColor : 'transparent',
        borderRightColor: groupBorderEdges.right ? borderColor : 'transparent',
        borderBottomColor: groupBorderEdges.bottom ? borderColor : 'transparent',
        borderLeftColor: groupBorderEdges.left ? borderColor : 'transparent',
      };
    }
    
    // For incorrect tiles, remove borders on merged edges
    return {
      borderTopWidth: mergeDirections.top ? 0 : BASE_BORDER_WIDTH,
      borderRightWidth: mergeDirections.right ? 0 : BASE_BORDER_WIDTH,
      borderBottomWidth: mergeDirections.bottom ? 0 : BASE_BORDER_WIDTH,
      borderLeftWidth: mergeDirections.left ? 0 : BASE_BORDER_WIDTH,
      borderTopStyle: 'solid' as const,
      borderRightStyle: 'solid' as const,
      borderBottomStyle: 'solid' as const,
      borderLeftStyle: 'solid' as const,
      borderTopColor: 'rgba(255, 255, 255, 0.92)',
      borderRightColor: 'rgba(255, 255, 255, 0.92)',
      borderBottomColor: 'rgba(255, 255, 255, 0.92)',
      borderLeftColor: 'rgba(255, 255, 255, 0.92)',
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
      className={`
        group relative overflow-hidden touch-none
        transition-shadow duration-200 ease-out
        ${isLocked ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
      `}
      style={{
        ...borderStyles,
        ...borderRadiusStyles,
        background: 'var(--color-surface)',
        transform: isLocked ? 'none' : `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) scale(${baseScale})`,
        transition: isDragging ? 'transform 70ms ease-out' : 'transform 200ms var(--motion-easing)',
        boxShadow: isDragging ? 'var(--shadow-elevated)' : (isLocked ? 'none' : 'var(--shadow-soft)'),
        outline: isSelected || isHinted ? '2px solid var(--color-primary)' : 'none',
        outlineOffset: isSelected || isHinted ? '-2px' : '0',
        pointerEvents: isLocked ? 'none' : 'auto',
        margin: 0,
        padding: 0,
        width: '100%',
        height: '100%',
        aspectRatio: '3 / 4',
        boxSizing: 'border-box',
      }}
    >
      <Image
        src={imageData}
        alt="Puzzle piece"
        fill
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
        }}
        draggable={false}
        unoptimized
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

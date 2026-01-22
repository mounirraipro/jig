import React, { useMemo, useRef, useLayoutEffect, useState, useCallback, useEffect } from 'react';
import { Tile as TileType } from '../types/game';
import Tile from './Tile';
import gsap from 'gsap';

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
    isHardLevel?: boolean;
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
    isHardLevel = false,
}: PuzzleBoardProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const tilesRef = useRef<{ [key: number]: HTMLDivElement | null }>({});

    // State to track dragging
    const [dragState, setDragState] = useState<{
        activeTileId: number | null; // The tile being dragged
        targetTileIndex: number | null; // The grid index (currentPos) we are hovering over
    }>({ activeTileId: null, targetTileIndex: null });

    // Constants for Dragging
    const dragStartPos = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
    const dragOffset = useRef<{ x: number, y: number }>({ x: 0, y: 0 });

    // --- Grid Math Helpers ---

    // Calculate aspect ratio for the container
    const aspectRatio = useMemo(() => {
        return (tileWidth * gridSize) / (tileHeight * gridSize);
    }, [tileWidth, tileHeight, gridSize]);

    // Get strictly defined style position for a grid index (0 to N-1)
    const getGridStyle = useCallback((index: number) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        return {
            top: `${(row / gridSize) * 100}%`,
            left: `${(col / gridSize) * 100}%`,
            width: `${100 / gridSize}%`,
            height: `${100 / gridSize}%`,
        };
    }, [gridSize]);


    // --- Drag Handlers ---

    const handleDragStart = (e: React.PointerEvent, tileId: number) => {
        setDragState({ activeTileId: tileId, targetTileIndex: null });
        dragStartPos.current = { x: e.clientX, y: e.clientY };
        dragOffset.current = { x: 0, y: 0 };

        // Ensure the element is ready to be moved visually
        const el = tilesRef.current[tileId];
        if (el) gsap.set(el, { zIndex: 100 });
    };

    const handleDragMove = (e: React.PointerEvent) => {
        if (dragState.activeTileId === null || !containerRef.current) return;

        // 1. Move the visual tile
        const dx = e.clientX - dragStartPos.current.x;
        const dy = e.clientY - dragStartPos.current.y;
        dragOffset.current = { x: dx, y: dy };

        const el = tilesRef.current[dragState.activeTileId];
        if (el) {
            gsap.set(el, { x: dx, y: dy });
        }

        // 2. Identify Target Slot
        const rect = containerRef.current.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;

        // Check bounds
        if (relX < 0 || relX > rect.width || relY < 0 || relY > rect.height) {
            if (dragState.targetTileIndex !== null) {
                setDragState(prev => ({ ...prev, targetTileIndex: null }));
            }
            return;
        }

        // Map to grid
        const col = Math.floor((relX / rect.width) * gridSize);
        const row = Math.floor((relY / rect.height) * gridSize);
        const targetIndex = row * gridSize + col;

        // Clamp
        const isValid = row >= 0 && row < gridSize && col >= 0 && col < gridSize;

        if (isValid) {
            // Find which tile is currently at this pos (for logic, if needed)
            // But we just store the INDEX.
            if (targetIndex !== dragState.targetTileIndex) {
                setDragState(prev => ({ ...prev, targetTileIndex: targetIndex }));
            }
        }
    };

    const handleDragEnd = () => {
        const { activeTileId, targetTileIndex } = dragState;

        if (activeTileId !== null && targetTileIndex !== null) {
            const fromIndex = tiles.findIndex(t => t.id === activeTileId);
            const toTile = tiles.find(t => t.currentPos === targetTileIndex);

            if (fromIndex !== -1 && toTile) {
                // Check if the target tile is already in the correct position (locked)
                const isTargetLocked = toTile.currentPos === toTile.correctPos;

                if (isTargetLocked) {
                    // Invalid Move: Target is locked. Snap back.
                    const el = tilesRef.current[activeTileId];
                    if (el) gsap.to(el, { x: 0, y: 0, duration: 0.2, clearProps: "zIndex" });
                } else {
                    const toIndex = tiles.findIndex(t => t.id === toTile.id);
                    // Perform Swap
                    onTileDragSwap(fromIndex, toIndex);
                }
            }
        } else if (activeTileId !== null) {
            // Dropped outside or invalid
            const el = tilesRef.current[activeTileId];
            if (el) gsap.to(el, { x: 0, y: 0, duration: 0.2, clearProps: "zIndex" });
        }

        setDragState({ activeTileId: null, targetTileIndex: null });
    };

    // --- FLIP & Shuffle Logic ---
    const prevTilesRef = useRef(tiles);
    const isFirstRender = useRef(true);
    const prevGridSize = useRef(gridSize);
    const prevImageUrl = useRef(imageUrl);
    const prevTileIdsRef = useRef(tiles.map(t => t.id).sort().join(','));

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const currentTileIds = tiles.map(t => t.id).sort().join(',');
            const hasNewTiles = prevTileIdsRef.current !== currentTileIds;

            // Detect Shuffle vs Swap
            // A shuffle is: First Render, OR Grid/Image Change, OR >2 tiles moved (Game Reset), OR New Tiles (Hard Level Puzzle Change)
            let changedTilesCount = 0;
            if (!hasNewTiles && prevGridSize.current === gridSize && prevImageUrl.current === imageUrl) {
                changedTilesCount = tiles.reduce((acc, tile) => {
                    const prev = prevTilesRef.current.find(t => t.id === tile.id);
                    return (prev && prev.currentPos !== tile.currentPos) ? acc + 1 : acc;
                }, 0);
            }

            const isShuffle =
                isFirstRender.current ||
                prevGridSize.current !== gridSize ||
                prevImageUrl.current !== imageUrl ||
                hasNewTiles || // KEY FIX: Different tiles = new puzzle
                changedTilesCount > 2;

            if (isShuffle) {
                // --- SHUFFLE ANIMATION ---
                // 1. Ensure clean slate logic
                gsap.set(".puzzle-tile", { clearProps: "transform,zIndex" });

                // 2. Animate from "Back" or "Center" to Shuffled
                const tl = gsap.timeline({
                    defaults: { ease: "power3.inOut" },
                    onComplete: () => {
                        gsap.set(".puzzle-tile", { clearProps: "transform,zIndex" });
                    }
                });

                // Animate each tile from its CORRECT position to its CURRENT (shuffled) position
                tiles.forEach(tile => {
                    const el = tilesRef.current[tile.id];
                    if (!el) return;

                    // If it's a new puzzle/hard level, maybe add some flare?
                    const delay = isHardLevel ? Math.random() * 0.3 : 0;

                    // Grid math: 
                    // Row/Col at Correct Pos
                    const correctRow = Math.floor(tile.correctPos / gridSize);
                    const correctCol = tile.correctPos % gridSize;

                    // Row/Col at Current (Shuffled) Pos
                    const currentRow = Math.floor(tile.currentPos / gridSize);
                    const currentCol = tile.currentPos % gridSize;

                    // Delta (Movement needed to go FROM Correct TO Current)
                    const dRow = correctRow - currentRow;
                    const dCol = correctCol - currentCol;

                    const xPercent = dCol * 100;
                    const yPercent = dRow * 100;

                    // We add a random delay/stagger for natural feel
                    tl.fromTo(el,
                        { xPercent: isHardLevel ? xPercent * 1.5 : xPercent, yPercent: isHardLevel ? yPercent * 1.5 : yPercent, scale: 0.5, opacity: 0, zIndex: 10 },
                        {
                            xPercent: 0,
                            yPercent: 0,
                            scale: 1,
                            opacity: 1,
                            zIndex: 1,
                            duration: isHardLevel ? 1.0 : 1.2,
                            ease: "back.out(1.2)", // Bouncy for new tiles
                            delay: delay
                        },
                        "<+=0.01"
                    );
                });

            } else {
                // --- FLIP (Smooth Swap) ---
                // Calculate changes
                tiles.forEach(tile => {
                    const prev = prevTilesRef.current.find(t => t.id === tile.id);
                    const el = tilesRef.current[tile.id];
                    if (!prev || !el) return;

                    // If position changed
                    if (prev.currentPos !== tile.currentPos) {
                        // 1. Calculate Old Visual Position (based on Grid Math)
                        const oldRow = Math.floor(prev.currentPos / gridSize);
                        const oldCol = prev.currentPos % gridSize;

                        const newRow = Math.floor(tile.currentPos / gridSize);
                        const newCol = tile.currentPos % gridSize;

                        // Get delta in percentages
                        const dRow = oldRow - newRow;
                        const dCol = oldCol - newCol;

                        const xPercent = dCol * 100;
                        const yPercent = dRow * 100;

                        gsap.fromTo(el,
                            { xPercent: xPercent, yPercent: yPercent, zIndex: 10 },
                            { xPercent: 0, yPercent: 0, zIndex: 1, duration: 0.3, ease: "power2.out", clearProps: "zIndex,transform" }
                        );
                    } else {
                        // Reset if no move
                        gsap.to(el, { x: 0, y: 0, xPercent: 0, yPercent: 0, duration: 0.2, overwrite: "auto" });
                    }
                });
            }

        }, containerRef);

        prevTilesRef.current = tiles;
        prevGridSize.current = gridSize;
        prevImageUrl.current = imageUrl;
        prevTileIdsRef.current = tiles.map(t => t.id).sort().join(',');
        isFirstRender.current = false;

        return () => ctx.revert();
    }, [tiles, gridSize, imageUrl, isHardLevel]);


    return (
        <div
            ref={containerRef}
            className={`relative select-none transition-all duration-500 ${isHardLevel ? 'p-1' : ''}`}
            style={{
                aspectRatio: `${aspectRatio}`,
                width: '100%',
                maxWidth: '100%',
                borderRadius: '24px',
                backgroundColor: isHardLevel ? 'rgba(30, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.5)',
                boxShadow: isHardLevel
                    ? '0 20px 50px -12px rgba(220, 38, 38, 0.5), inset 0 0 20px rgba(220, 38, 38, 0.2)'
                    : 'var(--shadow-elevated)',
                border: isHardLevel ? '2px solid rgba(220, 38, 38, 0.3)' : 'none',
                touchAction: 'none', // Critical for pointer events
            }}
        >

            {tiles.map((tile, i) => {
                const style = getGridStyle(tile.currentPos);
                const isDragTarget = dragState.targetTileIndex === tile.currentPos;
                const isDragging = dragState.activeTileId === tile.id;

                return (
                    <div
                        key={tile.id}
                        ref={el => { tilesRef.current[tile.id] = el; }}
                        className="absolute puzzle-tile"
                        style={{
                            ...style,
                            // If dragging, we want proper z-index.
                            // Note: transform is handled by GSAP during drag
                            zIndex: isDragging ? 100 : 1,
                        }}
                    >
                        <Tile
                            tile={tile}
                            index={i}
                            gridSize={gridSize}
                            width={tileWidth}
                            height={tileHeight}
                            imageUrl={imageUrl}
                            isSelected={selectedTile === i}
                            isHinted={hintedTileId === tile.id}
                            isDragging={isDragging}
                            isDragTarget={isDragTarget}
                            onClick={() => onTileClick(i)}
                            // Pass simplified event handlers
                            onDragStart={(e) => handleDragStart(e, tile.id)}
                            onDragMove={handleDragMove}
                            onDragEnd={handleDragEnd}
                        />
                    </div>
                );
            })}
        </div>
    );
}

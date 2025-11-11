'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Tile, GameImage } from '../types/game';
import { splitImage, shuffleArray } from '../utils/imageSplitter';
import PuzzleGrid from '../components/PuzzleGrid';
import Stats from '../components/Stats';
import Controls from '../components/Controls';
import WinModal from '../components/WinModal';

function formatImageName(filename: string): string {
  const withoutExtension = filename.replace(/\.[^/.]+$/, '');
  const spaced = withoutExtension.replace(/[_\-]+/g, ' ').trim();

  if (!spaced) {
    return 'Puzzle Image';
  }

  return spaced
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function GamePage() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [time, setTime] = useState('0:00');
  const [isComplete, setIsComplete] = useState(false);
  const [currentImage, setCurrentImage] = useState<GameImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableImages, setAvailableImages] = useState<GameImage[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hintedTileId, setHintedTileId] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (!isComplete && tiles.length > 0) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        setTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [startTime, isComplete, tiles.length]);

  const shuffleTiles = useCallback((tilesToShuffle: Tile[]): Tile[] => {
    const positions = tilesToShuffle.map(t => t.currentPos);
    const shuffledPositions = shuffleArray(positions);

    const shuffled = tilesToShuffle.map((tile, index) => ({
      ...tile,
      currentPos: shuffledPositions[index],
    }));

    return shuffled.sort((a, b) => a.currentPos - b.currentPos);
  }, []);

  const createNewGame = useCallback(async (image: GameImage) => {
    const pieces = await splitImage(image.url);
    const newTiles: Tile[] = pieces.map((piece, index) => ({
      id: index,
      currentPos: index,
      correctPos: index,
      imageData: piece,
    }));

    const shuffledTiles = shuffleTiles(newTiles);

    setTiles(shuffledTiles);
    setCurrentImage(image);
    setSelectedTile(null);
    setMoves(0);
    setStartTime(Date.now());
    setIsComplete(false);
    setHintedTileId(null);
    if (hintTimeoutRef.current) {
      clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = null;
    }
  }, [shuffleTiles]);

  const initializeGame = useCallback(async () => {
    if (availableImages.length === 0) {
      setLoadError('No puzzle images available.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];

    try {
      await createNewGame(randomImage);
      setLoadError(null);
    } catch (error) {
      console.error('Failed to create game:', error);
      setLoadError('Failed to start a new puzzle. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [availableImages, createNewGame]);

  const loadManifest = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/jig-images/manifest.json');

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data: unknown = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Manifest is empty or invalid');
      }

      const mappedImages = (data as string[])
        .sort()
        .map(filename => ({
          name: formatImageName(filename),
          url: `/jig-images/${filename}`,
        }));

      setAvailableImages(mappedImages);
      setLoadError(null);
    } catch (error) {
      console.error('Failed to load image manifest:', error);
      setAvailableImages([]);
      setLoadError('Failed to load puzzle collection. Please retry.');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadManifest();
  }, [loadManifest]);

  useEffect(() => {
    if (availableImages.length > 0) {
      initializeGame();
    }
  }, [availableImages, initializeGame]);

  const handleRetry = useCallback(() => {
    if (availableImages.length > 0) {
      setLoadError(null);
      initializeGame();
    } else {
      setLoadError(null);
      loadManifest();
    }
  }, [availableImages.length, initializeGame, loadManifest]);

  const progress = useMemo(() => {
    if (tiles.length === 0) return 0;
    const completed = tiles.filter(tile => tile.currentPos === tile.correctPos).length;
    return (completed / tiles.length) * 100;
  }, [tiles]);

  const handleTileClick = (index: number) => {
    if (isComplete) return;
    setHintedTileId(null);

    if (selectedTile === null) {
      setSelectedTile(index);
    } else if (selectedTile === index) {
      setSelectedTile(null);
    } else {
      swapTiles(selectedTile, index);
      setSelectedTile(null);
      setMoves(prev => prev + 1);
    }
  };

  const swapTiles = (index1: number, index2: number) => {
    const newTiles = [...tiles];
    const tempPos = newTiles[index1].currentPos;
    newTiles[index1].currentPos = newTiles[index2].currentPos;
    newTiles[index2].currentPos = tempPos;

    const sorted = newTiles.sort((a, b) => a.currentPos - b.currentPos);
    setTiles(sorted);

    // Check win condition
    if (checkWin(sorted)) {
      setTimeout(() => setIsComplete(true), 300);
    }
  };

  const checkWin = (tilesToCheck: Tile[]): boolean => {
    return tilesToCheck.every(tile => tile.currentPos === tile.correctPos);
  };

  const handleShuffle = () => {
    if (tiles.length > 0) {
      const shuffled = shuffleTiles(tiles);
      setTiles(shuffled);
      setSelectedTile(null);
      setHintedTileId(null);
    }
  };

  const handleHint = () => {
    const misplacedTile = tiles.find(tile => tile.currentPos !== tile.correctPos);
    if (misplacedTile) {
      const index = tiles.findIndex(t => t.currentPos === misplacedTile.currentPos);
      setSelectedTile(index);
      setHintedTileId(misplacedTile.id);
      
      // Clear previous timeout
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
      
      // Auto-deselect after 2 seconds
      hintTimeoutRef.current = setTimeout(() => {
        setSelectedTile(null);
        setHintedTileId(null);
      }, 2000);
    }
  };

  const handleNewGame = () => {
    initializeGame();
  };

  const handlePlayAgain = () => {
    setIsComplete(false);
    initializeGame();
  };

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
          <h1 className="text-2xl font-semibold text-slate-900">Something went wrong</h1>
          <p className="mt-4 text-sm text-slate-600">{loadError}</p>
          <button
            onClick={handleRetry}
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-slate-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-slate-300">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-svh items-center justify-center bg-slate-100 px-2 py-3 sm:px-4 sm:py-4">
      <div className="flex h-full w-full max-h-[92svh] max-w-[1080px] flex-col rounded-3xl bg-white/85 p-3 shadow-lg backdrop-blur-sm sm:p-5">
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-center">
            <Stats moves={moves} time={time} progress={progress} />
          </div>

          <div className="flex flex-1 items-center justify-center overflow-hidden">
            <div className="flex w-full max-w-[640px] flex-col items-center gap-4 sm:gap-6">
              {currentImage && (
                <div className="block overflow-hidden rounded-lg border border-slate-200 sm:hidden">
                  <Image
                    src={currentImage.url}
                    alt={currentImage.name}
                    width={192}
                    height={128}
                    className="h-16 w-24 object-cover"
                    priority
                  />
                </div>
              )}
              <div className="w-full max-w-[360px] sm:max-w-[440px] md:max-w-[500px] lg:max-w-[520px]">
                <PuzzleGrid
                  tiles={tiles}
                  selectedTile={selectedTile}
                  hintedTileId={hintedTileId}
                  onTileClick={handleTileClick}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <Controls
            onNewGame={handleNewGame}
            onShuffle={handleShuffle}
            onHint={handleHint}
          />
        </div>
      </div>

      <WinModal
        isOpen={isComplete}
        moves={moves}
        time={time}
        completedImage={currentImage?.url || ''}
        completedImageName={currentImage?.name || ''}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  );
}


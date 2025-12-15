'use client';

import { useState, useEffect, useCallback, useRef, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Tile, GameImage, PuzzleSet } from './types/game';
import { shuffleTiles as shuffleArray } from './utils/imageSplitter';
import { saveLevelProgress, getLastPlayedLevel, setLastPlayedLevel } from './utils/storage';
import { getSettings } from './utils/settings';
import { getSoundManager } from './utils/sounds';
import { getBackgroundMusicManager } from './utils/backgroundMusic';
import PuzzleBoard from './components/PuzzleBoard';
import Stats from './components/Stats';
import Controls from './components/Controls';
import WinModal from './components/WinModal';
import LevelSelector from './components/LevelSelector';
import Confetti from './components/Confetti';
import SEOContent from './components/SEOContent';
import MiniPlayer from './components/MiniPlayer';

// Calculate stars from time
function calculateStars(timeInSeconds: number): number {
  if (timeInSeconds < 10) return 3;
  if (timeInSeconds < 20) return 2;
  if (timeInSeconds >= 30) return 1;
  return 2; // 20-29 seconds
}

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

function GamePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [puzzleSets, setPuzzleSets] = useState<PuzzleSet[]>([]); // For hard levels
  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [time, setTime] = useState('0:00');
  const [timeInSeconds, setTimeInSeconds] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentImage, setCurrentImage] = useState<GameImage | null>(null);
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [isHardLevel, setIsHardLevel] = useState(false);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0); // For hard levels
  const [isLoading, setIsLoading] = useState(true);
  const [availableImages, setAvailableImages] = useState<GameImage[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hintedTileId, setHintedTileId] = useState<number | null>(null);
  const [settings, setSettings] = useState(getSettings());
  const [earnedStars, setEarnedStars] = useState(0);
  const [history, setHistory] = useState<Tile[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tileDimensions, setTileDimensions] = useState({ width: 200, height: 280 });
  const [gridSize, setGridSize] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const soundManagerRef = useRef(getSoundManager());
  const backgroundMusicRef = useRef(getBackgroundMusicManager());
  const previousCorrectCountRef = useRef(0);

  // Sound effect - sync with settings
  useEffect(() => {
    soundManagerRef.current.setEnabled(!settings.muted);
    backgroundMusicRef.current.setEnabled(!settings.muted);
  }, [settings.muted]);

  // Start background music when game starts
  useEffect(() => {
    if (tiles.length > 0 && !isComplete && !settings.muted) {
      // Delay to allow user interaction
      const timer = setTimeout(() => {
        backgroundMusicRef.current.play();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [tiles.length, isComplete, settings.muted]);

  // Stop background music when game ends or component unmounts
  useEffect(() => {
    const bgMusic = backgroundMusicRef.current;

    if (isComplete) {
      bgMusic.stop();
    }

    return () => {
      bgMusic.stop();
    };
  }, [isComplete]);

  // Detect tile matches and play click sound
  useEffect(() => {
    if (tiles.length === 0) return;

    const correctCount = tiles.filter(tile => tile.currentPos === tile.correctPos).length;
    const previousCount = previousCorrectCountRef.current;

    // If a new tile was placed correctly, play click sound
    if (correctCount > previousCount && !isComplete) {
      soundManagerRef.current.playClick();
    }

    previousCorrectCountRef.current = correctCount;
  }, [tiles, isComplete]);

  // Timer effect
  // Timer effect
  useEffect(() => {
    if (isComplete || !settings.playWithTime) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (tiles.length > 0) {
      // Clear any existing timer
      if (timerRef.current) clearInterval(timerRef.current);

      const start = Date.now() - (timeInSeconds * 1000); // Resume from current time if any
      setStartTime(start);

      timerRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - start) / 1000);
        setTimeInSeconds(elapsed);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        setTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [isComplete, tiles.length > 0, settings.playWithTime]);

  const shuffleTiles = useCallback((tilesToShuffle: Tile[]): Tile[] => {
    const positions = tilesToShuffle.map(t => t.currentPos);
    const shuffledPositions = shuffleArray(positions); // Use the imported shuffleArray

    const shuffled = tilesToShuffle.map((tile, index) => ({
      ...tile,
      currentPos: shuffledPositions[index],
    }));

    return shuffled.sort((a, b) => a.currentPos - b.currentPos);
  }, []);

  const createNewGame = useCallback(async (image: GameImage, gridSize: number, puzzleIndex: number = 0) => {
    setIsLoading(true);
    try {
      // Load image to get dimensions
      const img = new Image();
      img.src = image.url;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Calculate tile dimensions based on image aspect ratio
      const imageAspectRatio = img.width / img.height;

      // We want the grid to fit within the container while maintaining aspect ratio
      // Let's say base tile width is 100 (relative unit)
      const baseTileWidth = 100;
      const baseTileHeight = baseTileWidth / imageAspectRatio;

      setTileDimensions({ width: baseTileWidth, height: baseTileHeight });
      setGridSize(gridSize);

      const totalTiles = gridSize * gridSize;
      const newTiles: Tile[] = Array.from({ length: totalTiles }, (_, i) => ({
        id: i + (puzzleIndex * 1000), // Unique IDs for multiple puzzles
        currentPos: i,
        correctPos: i,
        puzzleIndex,
      }));

      const shuffledTiles = shuffleTiles(newTiles);
      setTiles(shuffledTiles);
      setMoves(0);
      setTime('00:00');
      setIsComplete(false);
      setEarnedStars(0);
      setHistory([]);
      setHistoryIndex(-1);

      // Reset timer
      if (timerRef.current) clearInterval(timerRef.current);
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const delta = Math.floor((Date.now() - startTime) / 1000);
        const m = Math.floor(delta / 60).toString().padStart(2, '0');
        const s = (delta % 60).toString().padStart(2, '0');
        setTime(`${m}:${s}`);
      }, 1000);

      return shuffledTiles;

    } catch (error) {
      console.error('Failed to initialize game:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [shuffleTiles]);

  const createHardLevel = useCallback(async (images: GameImage[]) => {
    const sets: PuzzleSet[] = [];
    for (let i = 0; i < images.length; i++) {
      const tiles = await createNewGame(images[i], 4, i);
      sets.push({
        tiles,
        isComplete: false,
        image: images[i],
      });
    }
    setPuzzleSets(sets);
    setTiles(sets[0].tiles); // Start with first puzzle
    setCurrentImage(sets[0].image);
    setCurrentPuzzleIndex(0);
  }, [createNewGame]);

  const initializeGame = useCallback(async () => {
    if (availableImages.length === 0) {
      setLoadError('No puzzle images available.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setSettings(getSettings());

    // Check if a specific level was requested via URL
    const levelParam = searchParams.get('level');
    let level: number | null = null;
    const isHard = levelParam ? parseInt(levelParam, 10) % 5 === 0 : false;
    setIsHardLevel(isHard);

    if (levelParam) {
      const levelNum = parseInt(levelParam, 10);
      if (!isNaN(levelNum) && levelNum > 0 && levelNum <= availableImages.length) {
        level = levelNum;

        if (isHard) {
          // Hard level: use 3 different images
          const imageIndices: number[] = [];
          const baseIndex = levelNum - 1;
          // Use the level's image and 2 nearby images
          for (let i = 0; i < 3; i++) {
            const idx = (baseIndex + i) % availableImages.length;
            imageIndices.push(idx);
          }
          const hardImages = imageIndices.map(idx => availableImages[idx]);
          await createHardLevel(hardImages);
        } else {
          // Normal level: single image
          const selectedImage = availableImages[levelNum - 1];
          const tiles = await createNewGame(selectedImage, 3);
          setTiles(tiles);
          setCurrentImage(selectedImage);
          setPuzzleSets([]);
        }
      } else {
        const selectedImage = availableImages[0];
        const tiles = await createNewGame(selectedImage, 3);
        setTiles(tiles);
        setCurrentImage(selectedImage);
        setPuzzleSets([]);
      }
    } else {
      // No level specified in URL - use last played level
      const lastLevel = getLastPlayedLevel();
      const levelToLoad = Math.min(lastLevel, availableImages.length);
      level = levelToLoad;
      
      const selectedImage = availableImages[levelToLoad - 1];
      const tiles = await createNewGame(selectedImage, 3);
      setTiles(tiles);
      setCurrentImage(selectedImage);
      setPuzzleSets([]);
    }

    // Save the current level as last played
    if (level) {
      setLastPlayedLevel(level);
    }
    
    setCurrentLevel(level);
    setSelectedTile(null);
    setMoves(0);
    setStartTime(Date.now());
    setTimeInSeconds(0);
    setIsComplete(false);
    setHintedTileId(null);
    setEarnedStars(0);
    if (hintTimeoutRef.current) {
      clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = null;
    }
    setLoadError(null);
    setIsLoading(false);
  }, [availableImages, createNewGame, createHardLevel, searchParams]);

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
    if (isHardLevel && puzzleSets.length > 0) {
      // For hard levels, calculate progress across all puzzles
      const totalTiles = puzzleSets.reduce((sum, set) => sum + set.tiles.length, 0);
      const completedTiles = puzzleSets.reduce((sum, set) => {
        return sum + set.tiles.filter(tile => tile.currentPos === tile.correctPos).length;
      }, 0);
      return totalTiles > 0 ? (completedTiles / totalTiles) * 100 : 0;
    }
    if (tiles.length === 0) return 0;
    const completed = tiles.filter(tile => tile.currentPos === tile.correctPos).length;
    return (completed / tiles.length) * 100;
  }, [tiles, puzzleSets, isHardLevel]);

  const handleTileClick = (index: number) => {
    if (isComplete) return;
    // Don't allow clicking on correct tiles (they're locked/merged)
    const tile = tiles[index];
    if (tile && tile.currentPos === tile.correctPos) {
      return;
    }
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
    // Don't allow swapping correct tiles
    const tile1 = tiles[index1];
    const tile2 = tiles[index2];
    if ((tile1 && tile1.currentPos === tile1.correctPos) ||
      (tile2 && tile2.currentPos === tile2.correctPos)) {
      return;
    }

    if (isHardLevel && puzzleSets.length > 0) {
      // Update the current puzzle set
      const newSets = [...puzzleSets];
      const currentSet = newSets[currentPuzzleIndex];
      const newTiles = [...currentSet.tiles];
      const tempPos = newTiles[index1].currentPos;
      newTiles[index1].currentPos = newTiles[index2].currentPos;
      newTiles[index2].currentPos = tempPos;

      const sorted = newTiles.sort((a, b) => a.currentPos - b.currentPos);
      currentSet.tiles = sorted;

      // Check if current puzzle is complete
      if (checkWin(sorted)) {
        currentSet.isComplete = true;

        // Check if all puzzles are complete
        if (newSets.every(set => set.isComplete)) {
          setTimeout(() => {
            setIsComplete(true);
            soundManagerRef.current.playWin();
            const stars = calculateStars(timeInSeconds);
            setEarnedStars(stars);
            if (currentLevel !== null && settings.playWithTime) {
              saveLevelProgress(currentLevel, timeInSeconds);
            }
          }, 300);
        } else {
          // Move to next puzzle
          const nextIndex = newSets.findIndex(set => !set.isComplete);
          if (nextIndex >= 0) {
            setCurrentPuzzleIndex(nextIndex);
            setTiles(newSets[nextIndex].tiles);
            setCurrentImage(newSets[nextIndex].image);
            setSelectedTile(null);
            setHintedTileId(null);
          }
        }
      }

      setPuzzleSets(newSets);
      setTiles(sorted);
    } else {
      // Normal level
      const newTiles = [...tiles];
      const tempPos = newTiles[index1].currentPos;
      newTiles[index1].currentPos = newTiles[index2].currentPos;
      newTiles[index2].currentPos = tempPos;

      const sorted = newTiles.sort((a, b) => a.currentPos - b.currentPos);
      setTiles(sorted);

      // Check win condition
      if (checkWin(sorted)) {
        setTimeout(() => {
          setIsComplete(true);
          soundManagerRef.current.playWin();
          const stars = calculateStars(timeInSeconds);
          setEarnedStars(stars);
          // Save progress if this is a level
          if (currentLevel !== null && settings.playWithTime) {
            saveLevelProgress(currentLevel, timeInSeconds);
          }
        }, 300);
      }
    }
  };

  const handleTileDragSwap = (fromIndex: number, toIndex: number) => {
    if (isComplete) return;
    if (fromIndex === toIndex) return;

    // Don't allow swapping correct tiles (they're locked/merged)
    const fromTile = tiles[fromIndex];
    const toTile = tiles[toIndex];
    if ((fromTile && fromTile.currentPos === fromTile.correctPos) ||
      (toTile && toTile.currentPos === toTile.correctPos)) {
      return;
    }

    setSelectedTile(null);
    setHintedTileId(null);
    swapTiles(fromIndex, toIndex);
    setMoves(prev => prev + 1);
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
    if (!settings.showHints) return;

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
    // Already on home, just reload or reset
    // router.push('/'); 
    // Since we are on the same page, we can just reset state or reload
    window.location.reload();
  };

  const handlePlayAgain = () => {
    setIsComplete(false);
    initializeGame();
  };

  const handleNextLevel = () => {
    if (currentLevel !== null && currentLevel < availableImages.length) {
      const nextLevel = currentLevel + 1;
      setLastPlayedLevel(nextLevel);
      router.push(`/?level=${nextLevel}`);
    } else {
      router.push('/levels');
    }
  };

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4" style={{ background: 'var(--color-surface)' }}>
        <div className="card card-elevated w-full max-w-md p-8 text-center">
          <h1
            className="text-2xl font-bold uppercase tracking-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Something went wrong
          </h1>
          <p
            className="mt-4 text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {loadError}
          </p>
          <button
            onClick={handleRetry}
            className="btn-primary mt-6 w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--color-surface)' }}>
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full border-2"
          style={{ borderColor: 'var(--color-light-gray)' }}
        >
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
            style={{ borderColor: 'var(--color-primary)' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-surface)' }}>
      {isComplete && <Confetti />}

      {/* Hero Game Section - Full Height */}
      <div className="h-screen flex flex-col relative overflow-hidden">
        {/* Navbar */}
        <nav className="shrink-0 z-50 w-full glass-panel px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>JigSolitaire</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Mini Music Player */}
            <MiniPlayer />
            
            <button
              onClick={() => router.push('/settings')}
              className="btn-ghost rounded-full h-10 w-10 p-0 flex items-center justify-center"
              aria-label="Settings"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </nav>

        <div id="play-now" className="flex-1 min-h-0 relative flex flex-col lg:flex-row">
          {/* Main Game Area */}
          <div className="relative flex-1 min-h-0 flex flex-col">
            {/* Game Header / HUD */}
            <div className="absolute top-4 left-0 right-0 z-10 px-6 flex justify-between items-start pointer-events-none">
              <div className="pointer-events-auto">
                <Stats moves={moves} time={time} progress={progress} compact={true} />
              </div>

              {isHardLevel && (
                <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-3 pointer-events-auto">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Hard Mode</span>
                  {puzzleSets.length > 0 && (
                    <span className="text-sm font-medium text-slate-600">
                      {currentPuzzleIndex + 1} / {puzzleSets.length}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div
              id="game-container"
              className="relative flex-1 min-h-0 flex items-center justify-center p-4 lg:p-6"
              style={{
                background: 'radial-gradient(circle at center, #F8FAFC 0%, #E2E8F0 100%)',
              }}
            >
              <div className="w-full h-full flex items-center justify-center" style={{ maxWidth: '500px' }}>
                <PuzzleBoard
                  tiles={tiles}
                  selectedTile={selectedTile}
                  hintedTileId={hintedTileId}
                  onTileClick={handleTileClick}
                  onTileDragSwap={handleTileDragSwap}
                  compact={isHardLevel}
                  tileWidth={tileDimensions.width}
                  tileHeight={tileDimensions.height}
                  imageUrl={currentImage?.url || ''}
                  gridSize={gridSize}
                />
              </div>
              <WinModal
                isOpen={isComplete}
                moves={moves}
                time={time}
                completedImage={currentImage?.url || ''}
                completedImageName={currentImage?.name || ''}
                stars={earnedStars}
                currentLevel={currentLevel}
                onPlayAgain={handlePlayAgain}
                onNextLevel={currentLevel !== null ? handleNextLevel : undefined}
              />
            </div>

            {/* Floating Dock Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
              <div className="glass-panel p-2 rounded-full flex items-center gap-2 shadow-2xl">
                <Controls
                  onNewGame={handleNewGame}
                  onShuffle={handleShuffle}
                  onHint={handleHint}
                  showHints={settings.showHints}
                  compact={true}
                />
              </div>
            </div>
          </div>

          {/* Sidebar / Level Selector */}
          <div className="hidden lg:flex flex-col w-80 shrink-0 min-h-0 p-3 pl-0">
            <LevelSelector
              images={availableImages}
              currentLevel={currentLevel}
              onSelect={(level) => {
                router.push(`/?level=${level}`);
              }}
            />
          </div>
        </div>

        {/* Mobile Level Selector Drawer (Simplified for now) */}
        <div className="lg:hidden shrink-0 p-3 bg-white border-t border-slate-200">
          <button
            onClick={() => router.push('/levels')}
            className="btn-secondary w-full text-sm py-2"
          >
            Browse Collections
          </button>
        </div>
      </div>

      {/* SEO Content Section - Below the fold */}
      <SEOContent />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--color-surface)' }}>
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full border-2"
          style={{ borderColor: 'var(--color-light-gray)' }}
        >
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
            style={{ borderColor: 'var(--color-primary)' }}
          />
        </div>
      </div>
    }>
      <GamePageContent />
    </Suspense>
  );
}

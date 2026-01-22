'use client';

import { useState, useEffect, useCallback, useRef, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Tile, GameImage, PuzzleSet } from './types/game';
import { shuffleTiles as shuffleArray } from './utils/imageSplitter';
import { saveLevelProgress, getLastPlayedLevel, setLastPlayedLevel, startPlaySession, savePlaySession, endPlaySession, checkDailyVisit, StreakInfo } from './utils/storage';
import StreakPopup from './components/StreakPopup';
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
  const [, setStartTime] = useState<number>(Date.now());
  const [time, setTime] = useState('0:00');
  const [timeInSeconds, setTimeInSeconds] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentImage, setCurrentImage] = useState<GameImage | null>(null);
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [isHardLevel, setIsHardLevel] = useState(false);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0); // For hard levels
  const [isInitialLoading, setIsInitialLoading] = useState(true); // Only for first load
  const [isTransitioning, setIsTransitioning] = useState(false); // For level switches
  const [availableImages, setAvailableImages] = useState<GameImage[]>([]);
  const imageCache = useRef<Map<string, { width: number; height: number }>>(new Map());
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hintedTileId, setHintedTileId] = useState<number | null>(null);
  const [settings, setSettings] = useState(getSettings());
  const [earnedStars, setEarnedStars] = useState(0);
  const [tileDimensions, setTileDimensions] = useState({ width: 200, height: 280 });
  const [gridSize, setGridSize] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const soundManagerRef = useRef(getSoundManager());
  const backgroundMusicRef = useRef(getBackgroundMusicManager());
  const previousCorrectCountRef = useRef(0);
  const [streakInfo, setStreakInfo] = useState<StreakInfo | null>(null);
  const [showStreakPopup, setShowStreakPopup] = useState(false);

  // Check daily visit for streak popup (SEO-safe: delayed and skips bots)
  useEffect(() => {
    // Skip for bots/crawlers to not affect SEO
    const isBot = /bot|crawler|spider|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot/i.test(navigator.userAgent);
    if (isBot) return;

    const info = checkDailyVisit();
    if (info) {
      setStreakInfo(info);
      // Delay popup to after LCP is measured (2.5s is the LCP threshold)
      // This ensures the popup doesn't affect Core Web Vitals
      setTimeout(() => setShowStreakPopup(true), 1500);
    }
  }, []);

  // Sound effect - sync with settings
  useEffect(() => {
    soundManagerRef.current.setEnabled(!settings.muted);
    backgroundMusicRef.current.setEnabled(!settings.muted);
  }, [settings.muted]);

  // Music is now controlled by MiniPlayer - we only sync mute setting
  // Music should NOT stop on level change or component unmount

  // Track play time for statistics
  useEffect(() => {
    startPlaySession();

    // Save time every 30 seconds
    const saveInterval = setInterval(() => {
      savePlaySession();
    }, 30000);

    // Save on page visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        savePlaySession();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(saveInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      endPlaySession();
    };
  }, []);

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
  const hasTiles = tiles.length > 0;
  useEffect(() => {
    if (isComplete || !settings.playWithTime) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (hasTiles) {
      // Clear any existing timer
      if (timerRef.current) clearInterval(timerRef.current);

      const start = Date.now();
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
  }, [isComplete, hasTiles, settings.playWithTime]);

  const shuffleTiles = useCallback((tilesToShuffle: Tile[]): Tile[] => {
    const positions = tilesToShuffle.map(t => t.currentPos);
    const shuffledPositions = shuffleArray(positions); // Use the imported shuffleArray

    const shuffled = tilesToShuffle.map((tile, index) => ({
      ...tile,
      currentPos: shuffledPositions[index],
    }));

    return shuffled.sort((a, b) => a.currentPos - b.currentPos);
  }, []);

  // Get image dimensions (cached or load)
  const getImageDimensions = useCallback(async (imageUrl: string): Promise<{ width: number; height: number }> => {
    // Check cache first
    const cached = imageCache.current.get(imageUrl);
    if (cached) return cached;

    // Load image to get dimensions
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const dims = { width: img.width, height: img.height };
        imageCache.current.set(imageUrl, dims);
        resolve(dims);
      };
      img.onerror = () => {
        // Default to square if image fails
        resolve({ width: 1, height: 1 });
      };
      img.src = imageUrl;
    });
  }, []);

  const createNewGame = useCallback(async (image: GameImage, gridSize: number, puzzleIndex: number = 0, skipDimensionWait: boolean = false) => {
    try {
      // Use default dimensions initially, update when image loads
      let imageAspectRatio = 1;

      if (skipDimensionWait) {
        // Start with square tiles, update async
        const baseTileWidth = 100;
        setTileDimensions({ width: baseTileWidth, height: baseTileWidth });
        setGridSize(gridSize);

        // Load dimensions in background and update
        getImageDimensions(image.url).then(dims => {
          const ratio = dims.width / dims.height;
          setTileDimensions({ width: 100, height: 100 / ratio });
        });
      } else {
        // Wait for dimensions (only on initial load)
        const dims = await getImageDimensions(image.url);
        imageAspectRatio = dims.width / dims.height;
        const baseTileWidth = 100;
        const baseTileHeight = baseTileWidth / imageAspectRatio;
        setTileDimensions({ width: baseTileWidth, height: baseTileHeight });
        setGridSize(gridSize);
      }

      const totalTiles = gridSize * gridSize;
      const newTiles: Tile[] = Array.from({ length: totalTiles }, (_, i) => ({
        id: i + (puzzleIndex * 1000),
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
    }
  }, [shuffleTiles, getImageDimensions]);

  const createHardLevel = useCallback(async (images: GameImage[], skipDimensionWait: boolean = false) => {
    const sets: PuzzleSet[] = [];
    for (let i = 0; i < images.length; i++) {
      const tiles = await createNewGame(images[i], 4, i, skipDimensionWait);
      sets.push({
        tiles,
        isComplete: false,
        image: images[i],
      });
    }
    setPuzzleSets(sets);
    setTiles(sets[0].tiles);
    setCurrentImage(sets[0].image);
    setCurrentPuzzleIndex(0);
  }, [createNewGame]);

  const initializeGame = useCallback(async () => {
    if (availableImages.length === 0) {
      setLoadError('No puzzle images available.');
      setIsInitialLoading(false);
      return;
    }

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
          const imageIndices: number[] = [];
          const baseIndex = levelNum - 1;
          for (let i = 0; i < 3; i++) {
            const idx = (baseIndex + i) % availableImages.length;
            imageIndices.push(idx);
          }
          const hardImages = imageIndices.map(idx => availableImages[idx]);
          await createHardLevel(hardImages);
        } else {
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
      const lastLevel = getLastPlayedLevel();
      const levelToLoad = Math.min(lastLevel, availableImages.length);
      level = levelToLoad;

      const selectedImage = availableImages[levelToLoad - 1];
      const tiles = await createNewGame(selectedImage, 3);
      setTiles(tiles);
      setCurrentImage(selectedImage);
      setPuzzleSets([]);
    }

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
    setIsInitialLoading(false);
  }, [availableImages, createNewGame, createHardLevel, searchParams]);

  const loadManifest = useCallback(async () => {
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

      // Preload first few images in background
      mappedImages.slice(0, 5).forEach(img => {
        const preload = new Image();
        preload.src = img.url;
      });
    } catch (error) {
      console.error('Failed to load image manifest:', error);
      setAvailableImages([]);
      setLoadError('Failed to load puzzle collection. Please retry.');
      setIsInitialLoading(false);
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

  const handleNewGame = useCallback(() => {
    // Quick reset to current level without reload
    if (currentImage && tiles.length > 0) {
      setIsComplete(false);
      const shuffled = shuffleTiles(tiles.map(t => ({ ...t, currentPos: t.correctPos })));
      setTiles(shuffled);
      setMoves(0);
      setTime('0:00');
      setTimeInSeconds(0);
      setSelectedTile(null);
      setHintedTileId(null);
      setEarnedStars(0);
      previousCorrectCountRef.current = 0;

      if (timerRef.current) clearInterval(timerRef.current);
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const delta = Math.floor((Date.now() - startTime) / 1000);
        const m = Math.floor(delta / 60).toString().padStart(2, '0');
        const s = (delta % 60).toString().padStart(2, '0');
        setTime(`${m}:${s}`);
        setTimeInSeconds(delta);
      }, 1000);
    }
  }, [currentImage, tiles, shuffleTiles]);

  const handlePlayAgain = useCallback(() => {
    setIsComplete(false);
    // Quick reset without full reinitialization
    if (currentImage && tiles.length > 0) {
      const shuffled = shuffleTiles(tiles.map(t => ({ ...t, currentPos: t.correctPos })));
      setTiles(shuffled);
      setMoves(0);
      setTime('0:00');
      setTimeInSeconds(0);
      setSelectedTile(null);
      setHintedTileId(null);
      setEarnedStars(0);
      previousCorrectCountRef.current = 0;

      // Restart timer
      if (timerRef.current) clearInterval(timerRef.current);
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const delta = Math.floor((Date.now() - startTime) / 1000);
        const m = Math.floor(delta / 60).toString().padStart(2, '0');
        const s = (delta % 60).toString().padStart(2, '0');
        setTime(`${m}:${s}`);
        setTimeInSeconds(delta);
      }, 1000);
    } else {
      initializeGame();
    }
  }, [currentImage, tiles, shuffleTiles, initializeGame]);

  // Fast level switching without page reload - instant transition
  const switchToLevel = useCallback(async (level: number) => {
    if (level < 1 || level > availableImages.length) return;

    setIsTransitioning(true);
    setLastPlayedLevel(level);

    const isHard = level % 5 === 0;
    setIsHardLevel(isHard);
    setCurrentLevel(level);

    // Update URL without navigation
    window.history.replaceState({}, '', `/?level=${level}`);

    // Preload next level's image
    if (level < availableImages.length) {
      const nextImg = new Image();
      nextImg.src = availableImages[level].url;
    }

    if (isHard) {
      const imageIndices: number[] = [];
      const baseIndex = level - 1;
      for (let i = 0; i < 3; i++) {
        const idx = (baseIndex + i) % availableImages.length;
        imageIndices.push(idx);
      }
      const hardImages = imageIndices.map(idx => availableImages[idx]);
      // Skip dimension wait for instant transitions
      await createHardLevel(hardImages, true);
    } else {
      const selectedImage = availableImages[level - 1];
      // Skip dimension wait for instant transitions
      const newTiles = await createNewGame(selectedImage, 3, 0, true);
      setTiles(newTiles);
      setCurrentImage(selectedImage);
      setPuzzleSets([]);
    }

    setSelectedTile(null);
    setMoves(0);
    setStartTime(Date.now());
    setTimeInSeconds(0);
    setTime('0:00');
    setIsComplete(false);
    setHintedTileId(null);
    setEarnedStars(0);

    // Short delay for smooth visual transition
    requestAnimationFrame(() => {
      setIsTransitioning(false);
    });
  }, [availableImages, createNewGame, createHardLevel]);

  const handleNextLevel = () => {
    if (currentLevel !== null && currentLevel < availableImages.length) {
      switchToLevel(currentLevel + 1);
    } else {
      router.push('/levels');
    }
  };

  const handlePrevLevel = () => {
    if (currentLevel !== null && currentLevel > 1) {
      switchToLevel(currentLevel - 1);
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

  // Only show full-page loading on initial load, not on level switches
  if (isInitialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--color-surface)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg animate-pulse">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-sm font-medium text-slate-500">Loading JigSolitaire...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-surface)' }}>
      {isComplete && <Confetti />}

      {/* Hero Game Section - Full Height */}
      <div className="h-dvh flex flex-col relative overflow-hidden">
        {/* Navbar - More compact on mobile */}
        <nav className="shrink-0 z-50 w-full glass-panel px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-linear-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="sm:w-5 sm:h-5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-base sm:text-xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>JigSolitaire</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            {/* Level indicator on mobile */}
            {currentLevel && (
              <span className="sm:hidden text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                Lv.{currentLevel}
              </span>
            )}

            {/* Mini Music Player - hidden on small mobile */}
            <div className="hidden sm:block">
              <MiniPlayer />
            </div>

            <button
              onClick={() => router.push('/settings')}
              className="btn-ghost rounded-full h-9 w-9 sm:h-10 sm:w-10 p-0 flex items-center justify-center"
              aria-label="Settings"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-5 sm:h-5">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </nav>

        <div id="play-now" className="flex-1 min-h-0 relative flex flex-col lg:flex-row">
          {/* Main Game Area */}
          <div className="relative flex-1 min-h-0 flex flex-col">
            {/* Game Header / HUD - Desktop */}
            <div className="hidden sm:flex absolute top-4 left-0 right-0 z-10 px-6 justify-between items-start pointer-events-none">
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
              className="relative flex-1 min-h-0 flex items-center justify-center p-2 sm:p-4 lg:p-6"
              style={{
                background: 'radial-gradient(circle at center, #F8FAFC 0%, #E2E8F0 100%)',
              }}
            >
              <div className={`w-full h-full flex items-center justify-center max-w-[95vw] sm:max-w-[500px] transition-opacity duration-150 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
                <PuzzleBoard
                  tiles={tiles}
                  selectedTile={selectedTile}
                  hintedTileId={hintedTileId}
                  onTileClick={handleTileClick}
                  onTileDragSwap={handleTileDragSwap}
                  compact={isHardLevel}
                  isHardLevel={isHardLevel}
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

              {/* Streak Popup - shown on first daily visit */}
              {showStreakPopup && streakInfo && (
                <StreakPopup
                  streakInfo={streakInfo}
                  onClose={() => setShowStreakPopup(false)}
                />
              )}
            </div>

            {/* Desktop Floating Dock Controls */}
            <div className="hidden sm:block absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
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

          {/* Sidebar / Level Selector - Desktop */}
          <div className="hidden lg:flex flex-col w-80 shrink-0 min-h-0 p-3 pl-0">
            <LevelSelector
              images={availableImages}
              currentLevel={currentLevel}
              onSelect={(level) => {
                switchToLevel(level);
              }}
            />
          </div>
        </div>

        {/* Mobile Bottom Bar - Stats, Controls, Navigation */}
        <div className="sm:hidden shrink-0 glass-panel border-t border-slate-200/50 safe-area-inset-bottom">
          {/* Mobile Stats Row */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                <span className="text-sm font-semibold text-slate-700 tabular-nums">{moves}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span className="text-sm font-semibold text-slate-700 tabular-nums">{time}</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-slate-500">{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Mobile Controls Row */}
          <div className="flex items-center justify-between px-2 py-2">
            {/* Level Navigation */}
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevLevel}
                disabled={!currentLevel || currentLevel <= 1}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-transform"
                aria-label="Previous level"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => router.push('/levels')}
                className="h-10 px-3 flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm active:scale-95 transition-transform"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span>Levels</span>
              </button>
              <button
                onClick={handleNextLevel}
                disabled={!currentLevel || currentLevel >= availableImages.length}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-transform"
                aria-label="Next level"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>

            {/* Game Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleShuffle}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 active:scale-95 transition-transform"
                aria-label="Shuffle"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
                </svg>
              </button>
              {settings.showHints && (
                <button
                  onClick={handleHint}
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600 active:scale-95 transition-transform"
                  aria-label="Hint"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
                  </svg>
                </button>
              )}
              <button
                onClick={handleNewGame}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 active:scale-95 transition-transform"
                aria-label="Restart"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </button>
            </div>
          </div>
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

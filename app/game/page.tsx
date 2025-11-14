'use client';

import { useState, useEffect, useCallback, useRef, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Tile, GameImage, PuzzleSet } from '../types/game';
import { splitImage, shuffleArray } from '../utils/imageSplitter';
import { saveLevelProgress } from '../utils/storage';
import { getSettings } from '../utils/settings';
import { getSoundManager } from '../utils/sounds';
import { getBackgroundMusicManager } from '../utils/backgroundMusic';
import PuzzleGrid from '../components/PuzzleGrid';
import Stats from '../components/Stats';
import Controls from '../components/Controls';
import WinModal from '../components/WinModal';

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
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const soundManagerRef = useRef(getSoundManager());
  const backgroundMusicRef = useRef(getBackgroundMusicManager());
  const previousCorrectCountRef = useRef(0);

  // Sound effect - sync with settings
  useEffect(() => {
    soundManagerRef.current.setEnabled(!settings.muted);
    backgroundMusicRef.current.setEnabled(!settings.muted);
  }, [settings.muted]);

  // Start background music when game starts (after preview is dismissed)
  useEffect(() => {
    if (!showPreview && tiles.length > 0 && !isComplete && !settings.muted) {
      // Delay to allow user interaction
      const timer = setTimeout(() => {
        backgroundMusicRef.current.play();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showPreview, tiles.length, isComplete, settings.muted]);

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
  useEffect(() => {
    if (!isComplete && tiles.length > 0 && settings.playWithTime && !showPreview) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setTimeInSeconds(elapsed);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        setTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else if (!settings.playWithTime) {
      setTime('--:--');
    }
  }, [startTime, isComplete, tiles.length, settings.playWithTime, showPreview]);

  const shuffleTiles = useCallback((tilesToShuffle: Tile[]): Tile[] => {
    const positions = tilesToShuffle.map(t => t.currentPos);
    const shuffledPositions = shuffleArray(positions);

    const shuffled = tilesToShuffle.map((tile, index) => ({
      ...tile,
      currentPos: shuffledPositions[index],
    }));

    return shuffled.sort((a, b) => a.currentPos - b.currentPos);
  }, []);

  const createNewGame = useCallback(async (image: GameImage, puzzleIdx = 0, showPreviewFirst = true) => {
    // Show preview first (only for first puzzle in a game)
    if (showPreviewFirst && puzzleIdx === 0) {
      setPreviewImage(image.url);
      setShowPreview(true);
      
      // Auto-hide preview after 3 seconds
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
      previewTimeoutRef.current = setTimeout(() => {
        setShowPreview(false);
        setPreviewImage(null);
      }, 3000);
      
      // Wait a bit for preview to show, then split image
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const pieces = await splitImage(image.url);
    const newTiles: Tile[] = pieces.map((piece, index) => ({
      id: index + (puzzleIdx * 1000), // Unique IDs for multiple puzzles
      currentPos: index,
      correctPos: index,
      imageData: piece,
      puzzleIndex: puzzleIdx,
    }));

    const shuffledTiles = shuffleTiles(newTiles);
    return shuffledTiles;
  }, [shuffleTiles]);

  const createHardLevel = useCallback(async (images: GameImage[]) => {
    const sets: PuzzleSet[] = [];
    for (let i = 0; i < images.length; i++) {
      const tiles = await createNewGame(images[i], i);
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
          const tiles = await createNewGame(selectedImage, 0);
          setTiles(tiles);
          setCurrentImage(selectedImage);
          setPuzzleSets([]);
        }
      } else {
        const selectedImage = availableImages[0];
        const tiles = await createNewGame(selectedImage, 0);
        setTiles(tiles);
        setCurrentImage(selectedImage);
        setPuzzleSets([]);
      }
    } else {
      // Random game (no level)
      const selectedImage = availableImages[Math.floor(Math.random() * availableImages.length)];
      const tiles = await createNewGame(selectedImage, 0);
      setTiles(tiles);
      setCurrentImage(selectedImage);
      setPuzzleSets([]);
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
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
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
    router.push('/');
  };

  const handlePlayAgain = () => {
    setIsComplete(false);
    initializeGame();
  };

  const handleNextLevel = () => {
    if (currentLevel !== null && currentLevel < availableImages.length) {
      router.push(`/game?level=${currentLevel + 1}`);
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
    <div className="min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <div id="play-now" className="bg-white py-4 md:py-8" aria-label="Play game section">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-0 md:px-6 text-center lg:px-8">
          <div className="flex w-full justify-center">
            <div 
              id="game-wrapper" 
              className="w-full md:max-w-3xl md:rounded-lg md:border bg-white md:p-4 md:shadow-lg"
              style={{
                borderColor: 'rgba(178, 223, 219, 0.3)', // turquoise-light/30
                borderRadius: 'var(--radius-round-large)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div 
                id="game-container"
                className="flex aspect-[3/4] w-full max-w-[600px] items-center justify-center overflow-hidden md:rounded-lg md:shadow-inner"
                style={{ 
                  background: isHardLevel ? 'var(--color-primary)' : 'var(--color-light-gray)',
                  margin: '0 auto',
                  position: 'relative',
                }}
              >
                {showPreview && previewImage ? (
                  <div
                    className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer"
                    onClick={() => {
                      setShowPreview(false);
                      setPreviewImage(null);
                      if (previewTimeoutRef.current) {
                        clearTimeout(previewTimeoutRef.current);
                        previewTimeoutRef.current = null;
                      }
                      // Start timer when preview is dismissed
                      setStartTime(Date.now());
                    }}
                    style={{
                      background: 'var(--color-light-gray)',
                      transition: 'opacity var(--motion-normal) var(--motion-easing)',
                      width: '100%',
                      height: '100%',
                      borderRadius: 'inherit',
                    }}
                  >
                        <div
                          className="relative w-full h-full flex flex-col items-center justify-center"
                          style={{
                            padding: 'var(--spacing-sm)',
                          }}
                        >
                          <div
                            className="relative flex-1 w-full"
                            style={{
                              background: 'var(--color-surface)',
                              borderRadius: 'var(--radius-round-large)',
                              boxShadow: 'var(--shadow-elevated)',
                              border: 'var(--border-thin)',
                              overflow: 'hidden',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minHeight: 0,
                              width: '100%',
                            }}
                          >
                            <img
                              src={previewImage}
                              alt="Puzzle preview"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                              }}
                            />
                          </div>
                          <div
                            className="mt-3 px-6 py-3 rounded-lg shrink-0"
                            style={{
                              background: 'var(--color-primary)',
                              color: 'var(--color-black)',
                              borderRadius: 'var(--radius-round-medium)',
                              boxShadow: 'var(--shadow-soft)',
                              fontSize: '16px',
                              fontWeight: 500,
                              letterSpacing: '0.01em',
                              cursor: 'pointer',
                              transition: 'transform var(--motion-fast) var(--motion-easing)',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.02)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            Click to start puzzle
                          </div>
                        </div>
                      </div>
                ) : (
                  <div 
                    className="flex h-full w-full flex-col"
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      background: 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px',
                    }}
                  >
                    <div className="flex flex-col items-center gap-0.5 sm:gap-1 mb-0.5 sm:mb-1 shrink-0">
                      {isHardLevel && (
                        <div 
                          className="card-elevated px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg flex items-center gap-2 shrink-0"
                          style={{
                            background: 'var(--color-black)',
                            borderRadius: 'var(--radius-round-medium)',
                            boxShadow: 'var(--shadow-elevated)',
                          }}
                        >
                          <svg 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="var(--color-primary)"
                            style={{ color: 'var(--color-primary)', flexShrink: 0 }}
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <div className="flex items-center gap-2">
                            <span 
                              className="font-bold uppercase tracking-wide"
                              style={{
                                color: 'var(--color-primary)',
                                fontSize: '10px',
                                lineHeight: '12px',
                                letterSpacing: '0.15em',
                              }}
                            >
                              HARD
                            </span>
                            {puzzleSets.length > 0 && (
                              <span 
                                className="font-medium"
                                style={{
                                  color: 'var(--color-off-white)',
                                  fontSize: '10px',
                                  lineHeight: '12px',
                                }}
                              >
                                {currentPuzzleIndex + 1}/{puzzleSets.length}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      <div style={{ width: '100%' }}>
                        <Stats moves={moves} time={time} progress={progress} compact={isHardLevel} />
                      </div>
                    </div>

                    <div 
                      className="flex flex-1 items-center justify-center overflow-hidden min-h-0"
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      <PuzzleGrid
                        tiles={tiles}
                        selectedTile={selectedTile}
                        hintedTileId={hintedTileId}
                        onTileClick={handleTileClick}
                        onTileDragSwap={handleTileDragSwap}
                        compact={isHardLevel}
                      />
                    </div>

                    <div className="flex items-center justify-center shrink-0 mt-1 sm:mt-2">
                      <Controls
                        onNewGame={handleNewGame}
                        onShuffle={handleShuffle}
                        onHint={handleHint}
                        showHints={settings.showHints}
                        compact={isHardLevel}
                      />
                    </div>
                  </div>
                )}

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
            </div>
          </div>
          <div className="max-w-3xl space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.35em]" style={{ color: 'var(--color-text-secondary)' }}>Play JigSolitaire Online</p>
            <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: 'var(--color-text-primary)' }}>Jump into the interactive puzzle board</h2>
            <p className="text-base" style={{ color: 'var(--color-text-secondary)' }}>
              Press play to launch the responsive JigSolitaire canvas. Our smart layout keeps the jigsaw puzzle crisp and centered on any screen size—from smartphones to tablets to desktop. Touch-optimized controls let you drag, rotate, and snap pieces with ease on any device.
            </p>
          </div>
        </div>
      </div>

      {/* Game Features Section */}
      <section className="relative overflow-hidden bg-white py-12 md:py-16">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at top, rgba(255, 191, 0, 0.08), transparent 65%)' }}></div>
        <div className="relative mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[1.1fr,0.9fr] lg:px-8 lg:gap-12">
          <div className="flex flex-col justify-center gap-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em]" style={{ color: 'var(--color-text-secondary)' }}>Relaxing Jigsaw Puzzle Game</p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl" style={{ color: 'var(--color-text-primary)' }}>
              Jigsaw meet Solitaire. Simple but fun and relaxing gameplay
            </h2>
            <p className="text-base lg:text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              JigSolitaire blends the calm rhythm of classic jigsaw puzzles with rewarding unlocks and theme-based challenges. Discover curated puzzle packs, earn achievements, and enjoy mindful gameplay sessions backed by relaxing music and smooth animations.
            </p>
            <ul className="grid gap-3 text-sm lg:text-base" style={{ color: 'var(--color-text-secondary)' }}>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full font-bold shrink-0" style={{ background: 'var(--color-primary)', color: 'var(--color-black)', fontSize: '14px' }}>1</span>
                <span>Unlock hand-picked puzzle themes spanning nature, travel, wildlife, and cozy everyday moments.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full font-bold shrink-0" style={{ background: 'var(--color-primary)', color: 'var(--color-black)', fontSize: '14px' }}>2</span>
                <span>Follow an adaptive difficulty path that grows with your skills and keeps the challenge balanced.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full font-bold shrink-0" style={{ background: 'var(--color-primary)', color: 'var(--color-black)', fontSize: '14px' }}>3</span>
                <span>Track your progress, replay favorite puzzles, and unlock achievements for every completed collection.</span>
              </li>
            </ul>
            <div className="rounded-lg p-4 border" style={{ background: 'var(--color-surface)', borderColor: 'var(--border-thin)', boxShadow: 'var(--shadow-soft)' }}>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] mb-2" style={{ color: 'var(--color-text-secondary)' }}>SEO Highlights</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Keywords: mobile jigsaw puzzle game, relaxing puzzle game, online brain training, calm solitaire puzzles, casual puzzle adventure, unlock puzzle themes, guided puzzle tutorial, free mobile games, touch screen puzzles.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-5 rounded-xl border p-5 lg:p-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--border-thin)', boxShadow: 'var(--shadow-elevated)' }}>
            <p className="text-xs font-semibold uppercase tracking-[0.35em]" style={{ color: 'var(--color-text-secondary)' }}>Game Snapshot</p>
            <h3 className="text-xl lg:text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>A mindful puzzle routine for every day</h3>
            <p className="text-sm lg:text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Choose from themed puzzle collections designed for short breaks or long sessions. Every pack features handcrafted jigsaw puzzles that unlock in a satisfying progression. Our accessible controls, optional hints, and soothing background music create the perfect flow state.
            </p>
            <ul className="grid gap-2.5 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <li className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ background: 'var(--color-primary)' }}></span>
                <span>250+ beautifully illustrated puzzle themes.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ background: 'var(--color-primary)' }}></span>
                <span>Progress saves automatically across sessions.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ background: 'var(--color-primary)' }}></span>
                <span>Optimized for mobile, tablet, and desktop play.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-16" style={{ background: 'var(--color-light-gray)' }}>
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] mb-2" style={{ color: 'var(--color-text-secondary)' }}>Game Features</p>
            <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: 'var(--color-text-primary)' }}>New JigSolitaire update coming soon!</h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              From mindful design to rewarding progression, JigSolitaire delivers a polished solitaire puzzle experience that keeps casual and seasoned players coming back.
            </p>
          </div>
          <div className="mt-10 md:mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <article className="flex flex-col gap-4 rounded-xl border p-5 lg:p-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--border-thin)', boxShadow: 'var(--shadow-soft)' }}>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg mb-1" style={{ background: 'var(--color-primary)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-black)' }}>
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3 className="text-lg lg:text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Unlockable Theme Collections</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Progress through puzzles in each category to illuminate the full gallery. Celebrate every milestone with badges and shareable achievements.
              </p>
              <ul className="grid gap-2.5 text-xs lg:text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: 'var(--color-primary)' }}></span>
                  <span>Nature escapes, wildlife, city nights, cozy cafés, festive holidays.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: 'var(--color-primary)' }}></span>
                  <span>High-resolution artwork curated for clarity and visual delight.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: 'var(--color-primary)' }}></span>
                  <span>Seasonal drops keep the puzzle library fresh all year.</span>
                </li>
              </ul>
            </article>
            <article className="flex flex-col gap-4 rounded-xl border p-5 lg:p-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--border-thin)', boxShadow: 'var(--shadow-soft)' }}>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg mb-1" style={{ background: 'var(--color-primary)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-black)' }}>
                  <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                </svg>
              </div>
              <h3 className="text-lg lg:text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Guided How-To-Play Journey</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                New to jigsaw puzzles? Our interactive tutorial teaches every control, from selecting pieces to rotating edges, with step-by-step overlays.
              </p>
              <ul className="grid gap-2.5 text-xs lg:text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: 'var(--color-primary)' }}></span>
                  <span>Smart hints highlight the next best puzzle pieces to try.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: 'var(--color-primary)' }}></span>
                  <span>Optional assist mode for players who prefer relaxed guidance.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: 'var(--color-primary)' }}></span>
                  <span>Replay the tutorial any time from the pause menu.</span>
                </li>
              </ul>
            </article>
            <article className="flex flex-col gap-4 rounded-xl border p-5 lg:p-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--border-thin)', boxShadow: 'var(--shadow-soft)' }}>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg mb-1" style={{ background: 'var(--color-primary)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-black)' }}>
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <h3 className="text-lg lg:text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Daily Brain Training Routine</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Keep your mind sharp with purposeful puzzles. JigSolitaire encourages pattern recognition, spatial awareness, and memory recall through a gentle daily challenge.
              </p>
              <ul className="grid gap-2.5 text-xs lg:text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: 'var(--color-primary)' }}></span>
                  <span>Track streaks, completion time, and accuracy stats.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: 'var(--color-primary)' }}></span>
                  <span>Switch between calming soundscapes and focus playlists.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: 'var(--color-primary)' }}></span>
                  <span>Pause anytime and return exactly where you left off.</span>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      <section id="how-to-play" className="bg-white py-12 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[0.9fr,1.1fr] lg:px-8 lg:gap-12">
          <div className="flex flex-col justify-center gap-5">
            <p className="text-xs font-semibold uppercase tracking-[0.35em]" style={{ color: 'var(--color-text-secondary)' }}>How to Play</p>
            <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: 'var(--color-text-primary)' }}>Master JigSolitaire in four simple steps</h2>
            <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Whether you&apos;re a puzzle enthusiast or exploring your first jigsaw solitaire game, this quick guide will help you jump in with confidence.
            </p>
            <ol className="space-y-3 text-sm lg:text-base" style={{ color: 'var(--color-text-secondary)' }}>
              <li className="flex gap-3 rounded-lg p-3 border transition-all hover:shadow-sm" style={{ background: 'var(--color-light-gray)', borderColor: 'var(--border-thin)' }}>
                <span className="flex h-9 w-9 items-center justify-center rounded-full text-base font-bold shrink-0" style={{ background: 'var(--color-primary)', color: 'var(--color-black)' }}>1</span>
                <span className="leading-relaxed">Pick a theme from the gallery. The first puzzle in each set unlocks immediately to ease you in.</span>
              </li>
              <li className="flex gap-3 rounded-lg p-3 border transition-all hover:shadow-sm" style={{ background: 'var(--color-light-gray)', borderColor: 'var(--border-thin)' }}>
                <span className="flex h-9 w-9 items-center justify-center rounded-full text-base font-bold shrink-0" style={{ background: 'var(--color-primary)', color: 'var(--color-black)' }}>2</span>
                <span className="leading-relaxed">Drag and snap pieces onto the board. Border pieces glow softly to help frame the picture fast.</span>
              </li>
              <li className="flex gap-3 rounded-lg p-3 border transition-all hover:shadow-sm" style={{ background: 'var(--color-light-gray)', borderColor: 'var(--border-thin)' }}>
                <span className="flex h-9 w-9 items-center justify-center rounded-full text-base font-bold shrink-0" style={{ background: 'var(--color-primary)', color: 'var(--color-black)' }}>3</span>
                <span className="leading-relaxed">Use the rotate button or keyboard shortcuts to align tricky shapes without losing your flow.</span>
              </li>
              <li className="flex gap-3 rounded-lg p-3 border transition-all hover:shadow-sm" style={{ background: 'var(--color-light-gray)', borderColor: 'var(--border-thin)' }}>
                <span className="flex h-9 w-9 items-center justify-center rounded-full text-base font-bold shrink-0" style={{ background: 'var(--color-primary)', color: 'var(--color-black)' }}>4</span>
                <span className="leading-relaxed">Complete the image to unlock the next challenge, earn XP, and move closer to mastering the theme.</span>
              </li>
            </ol>
          </div>
          <div className="flex flex-col gap-5 rounded-xl border p-5 lg:p-6" style={{ background: 'var(--color-light-gray)', borderColor: 'var(--border-thin)', boxShadow: 'var(--shadow-inner)' }}>
            <h3 className="text-xl lg:text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Why players love JigSolitaire</h3>
            <ul className="grid gap-3.5 text-sm lg:text-base" style={{ color: 'var(--color-text-secondary)' }}>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full font-bold shrink-0" style={{ background: 'var(--color-primary)', color: 'var(--color-black)' }}>✓</span>
                <span className="leading-relaxed">Designed for calm focus with subtle animations and tactile feedback.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full font-bold shrink-0" style={{ background: 'var(--color-primary)', color: 'var(--color-black)' }}>✓</span>
                <span className="leading-relaxed">Adaptive hints make every puzzle achievable without diminishing the thrill of discovery.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full font-bold shrink-0" style={{ background: 'var(--color-primary)', color: 'var(--color-black)' }}>✓</span>
                <span className="leading-relaxed">Built with performance-first web technology for smooth gameplay on modern browsers.</span>
              </li>
            </ul>
            <div className="rounded-lg border p-4 mt-2" style={{ background: 'var(--color-surface)', borderColor: 'var(--border-thin)', boxShadow: 'var(--shadow-soft)' }}>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] mb-2" style={{ color: 'var(--color-text-secondary)' }}>Player Benefits</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Improve concentration, relieve stress, and unlock a steady stream of inspiring puzzle art. JigSolitaire blends play and mindfulness in one relaxing experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 md:py-16" style={{ background: 'var(--color-light-gray)' }}>
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] mb-2" style={{ color: 'var(--color-text-secondary)' }}>FAQ & Support</p>
            <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: 'var(--color-text-primary)' }}>Answers to common JigSolitaire questions</h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Learn more about this relaxing online jigsaw puzzle game, including save features, accessibility, and community events.
            </p>
          </div>
          <div className="mt-10 md:mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-xl border p-5 transition-all hover:shadow-lg" style={{ background: 'var(--color-surface)', borderColor: 'var(--border-thin)', boxShadow: 'var(--shadow-soft)' }}>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Can I save my progress?</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Yes. JigSolitaire automatically saves your puzzle state and theme unlocks to your browser profile. Return anytime to continue exactly where you left off.
              </p>
            </article>
            <article className="rounded-xl border p-5 transition-all hover:shadow-lg" style={{ background: 'var(--color-surface)', borderColor: 'var(--border-thin)', boxShadow: 'var(--shadow-soft)' }}>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Is the game free to play?</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                JigSolitaire is a free-to-play browser puzzle game. Optional premium packs with seasonal artwork will arrive soon to support ongoing development.
              </p>
            </article>
            <article className="rounded-xl border p-5 transition-all hover:shadow-lg" style={{ background: 'var(--color-surface)', borderColor: 'var(--border-thin)', boxShadow: 'var(--shadow-soft)' }}>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>What devices are supported?</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                The game runs smoothly on all modern devices including desktop browsers (Chrome, Edge, Firefox), tablets, and smartphones. Touch controls are optimized for responsive, accurate piece movement on any screen size.
              </p>
            </article>
            <article className="rounded-xl border p-5 transition-all hover:shadow-lg" style={{ background: 'var(--color-surface)', borderColor: 'var(--border-thin)', boxShadow: 'var(--shadow-soft)' }}>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>How often are new puzzles released?</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Expect fresh puzzle drops every month featuring trending topics and community-curated collections. Follow our newsletter for release highlights.
              </p>
            </article>
            <article className="rounded-xl border p-5 transition-all hover:shadow-lg" style={{ background: 'var(--color-surface)', borderColor: 'var(--border-thin)', boxShadow: 'var(--shadow-soft)' }}>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Does JigSolitaire work on mobile phones?</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Yes! JigSolitaire is fully responsive and optimized for mobile devices including smartphones and tablets. Touch controls make it easy to drag, rotate, and place puzzle pieces on any screen size.
              </p>
            </article>
            <article className="rounded-xl border p-5 transition-all hover:shadow-lg" style={{ background: 'var(--color-surface)', borderColor: 'var(--border-thin)', boxShadow: 'var(--shadow-soft)' }}>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Do I need to download an app to play?</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                No download required! JigSolitaire runs directly in your mobile or desktop browser. Simply visit jigsolitaire.net on any device and start playing instantly.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <GamePageContent />
    </Suspense>
  );
}

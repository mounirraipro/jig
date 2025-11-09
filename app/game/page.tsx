'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Tile, GameImage } from '../types/game';
import { splitImage, shuffleArray } from '../utils/imageSplitter';
import PuzzleGrid from '../components/PuzzleGrid';
import Stats from '../components/Stats';
import Controls from '../components/Controls';
import WinModal from '../components/WinModal';

const GAME_IMAGES: GameImage[] = [
  { 
    name: 'Mountain Lake', 
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=900&fit=crop'
  },
  { 
    name: 'City Lights', 
    url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=900&fit=crop'
  },
  { 
    name: 'Ocean Sunset', 
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=900&fit=crop'
  },
  { 
    name: 'Northern Lights', 
    url: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=600&h=900&fit=crop'
  },
  { 
    name: 'Desert Dunes', 
    url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&h=900&fit=crop'
  },
];

export default function GamePage() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [time, setTime] = useState('0:00');
  const [isComplete, setIsComplete] = useState(false);
  const [currentImage, setCurrentImage] = useState<GameImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    setIsLoading(true);
    const randomImage = GAME_IMAGES[Math.floor(Math.random() * GAME_IMAGES.length)];
    await createNewGame(randomImage);
    setIsLoading(false);
  };

  const createNewGame = async (image: GameImage) => {
    try {
      const pieces = await splitImage(image.url);
      const newTiles: Tile[] = pieces.map((piece, index) => ({
        id: index,
        currentPos: index,
        correctPos: index,
        imageData: piece,
      }));

      // Shuffle tiles
      const shuffledTiles = shuffleTiles(newTiles);
      
      setTiles(shuffledTiles);
      setCurrentImage(image);
      setSelectedTile(null);
      setMoves(0);
      setStartTime(Date.now());
      setIsComplete(false);
    } catch (error) {
      console.error('Failed to create game:', error);
    }
  };

  const shuffleTiles = (tilesToShuffle: Tile[]): Tile[] => {
    const positions = tilesToShuffle.map(t => t.currentPos);
    const shuffledPositions = shuffleArray(positions);
    
    const shuffled = tilesToShuffle.map((tile, index) => ({
      ...tile,
      currentPos: shuffledPositions[index],
    }));

    return shuffled.sort((a, b) => a.currentPos - b.currentPos);
  };

  const handleTileClick = (index: number) => {
    if (isComplete) return;

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
    }
  };

  const handleHint = () => {
    const misplacedTile = tiles.find(tile => tile.currentPos !== tile.correctPos);
    if (misplacedTile) {
      const index = tiles.findIndex(t => t.currentPos === misplacedTile.currentPos);
      setSelectedTile(index);
      
      // Clear previous timeout
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
      
      // Auto-deselect after 2 seconds
      hintTimeoutRef.current = setTimeout(() => {
        setSelectedTile(null);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading puzzle...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl">
        {/* Header */}
        <div className="bg-slate-700 p-5 rounded-2xl text-center mb-6">
          <h1 className="text-white text-xl font-semibold">
            Move the cards to complete the picture
          </h1>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <Stats moves={moves} time={time} />
        </div>

        {/* Puzzle Grid */}
        <div className="mb-6">
          <PuzzleGrid
            tiles={tiles}
            selectedTile={selectedTile}
            onTileClick={handleTileClick}
          />
        </div>

        {/* Controls */}
        <div className="mb-6">
          <Controls
            onNewGame={handleNewGame}
            onShuffle={handleShuffle}
            onHint={handleHint}
          />
        </div>

        {/* Footer */}
        <div className="bg-orange-500 p-4 rounded-2xl text-center">
          <h2 className="text-white text-xl font-bold uppercase tracking-wider">
            Simple To Play!
          </h2>
        </div>
      </div>

      {/* Win Modal */}
      <WinModal
        isOpen={isComplete}
        moves={moves}
        time={time}
        completedImage={currentImage?.url || ''}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  );
}


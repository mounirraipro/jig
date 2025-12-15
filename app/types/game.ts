export interface Tile {
  id: number;
  currentPos: number;
  correctPos: number;
  puzzleIndex?: number; // For hard levels with multiple puzzles
}

export interface GameImage {
  name: string;
  url: string;
}

export interface GameState {
  tiles: Tile[];
  selectedTile: number | null;
  moves: number;
  startTime: number;
  isComplete: boolean;
}

export interface TileMergeDirections {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
  topLeft: boolean;
  topRight: boolean;
  bottomLeft: boolean;
  bottomRight: boolean;
}

export interface GroupBorderEdges {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

export interface PuzzleSet {
  tiles: Tile[];
  isComplete: boolean;
  image: GameImage;
}

export interface Tile {
  id: number;
  currentPos: number;
  correctPos: number;
  imageData: string;
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


import { Tile } from '../types/game';

/**
 * Get all tile indices that belong to the same connected group as the given tile.
 * A group consists of tiles that are:
 * 1. In their correct positions (currentPos === correctPos)
 * 2. Adjacent to each other (horizontally or vertically)
 * 
 * Uses breadth-first search (BFS) to find all connected tiles.
 */
export function getTileGroup(
  tileIndex: number,
  tiles: Tile[],
  gridSize: number
): number[] {
  const tile = tiles[tileIndex];
  
  // NOTE: Logic successfully changed to allow merging even if not in correct absolute position.
  // We just need neighbors that are relatively correct.

  const visited = new Set<number>();
  const queue: number[] = [tileIndex];
  const group: number[] = [];

  while (queue.length > 0) {
    const currentIndex = queue.shift()!;
    
    if (visited.has(currentIndex)) continue;
    visited.add(currentIndex);
    
    // Add current tile to group
    group.push(currentIndex);
    
    const currentTile = tiles[currentIndex];

    // Check all 4 currently adjacent neighbors on the BOARD
    // We look for neighbors that SHOULD be adjacent to this tile in the solution
    const neighbors = getNeighborIndices(currentIndex, tiles, gridSize);
    
    for (const neighborIndex of neighbors) {
      if (visited.has(neighborIndex)) continue;
      
      const neighborTile = tiles[neighborIndex];
      
      // KEY CHANGE: Merge if they are adjacent in the solution AND adjacent on the board
      // AND strictly in the same relative orientation
      if (areAdjacentInSolution(currentTile, neighborTile, gridSize)) {
          // Double check they are adjacent on board in same way
          // (getNeighborIndices ensures they are adjacent on board)
          // We need to ensure the relative direction matches the solution direction
          
          if (hasSameRelativePosition(currentTile, neighborTile, gridSize)) {
             queue.push(neighborIndex);
          }
      }
    }
  }

  return group;
}

/**
 * Check if the relative position between two tiles on the board matches their relative position in the solution.
 * e.g. If B is to the right of A in solution, B must be to the right of A on board.
 */
function hasSameRelativePosition(tileA: Tile, tileB: Tile, gridSize: number): boolean {
    const currentDiff = tileB.currentPos - tileA.currentPos;
    const correctDiff = tileB.correctPos - tileA.correctPos;
    return currentDiff === correctDiff;
}

/**
 * Get all connected groups in the puzzle.
 * Returns an array of groups, where each group is an array of tile indices.
 */
export function getAllTileGroups(tiles: Tile[], gridSize: number): number[][] {
  const visited = new Set<number>();
  const groups: number[][] = [];

  for (let i = 0; i < tiles.length; i++) {
    if (visited.has(i)) continue;
    
    // We scan ALL tiles now, not just correct ones
    const group = getTileGroup(i, tiles, gridSize);
    group.forEach(idx => visited.add(idx));
    
    // Only return groups strictly larger than 1 tile to avoid noise, OR keep 1 if needed?
    // Usually getAllTileGroups is used for "merged" visuals. 
    // If a tile is alone, it's a group of 1.
    if (group.length > 0) {
      groups.push(group);
    }
  }

  return groups;
}

/**
 * Get indices of tiles that are currently adjacent to the given tile.
 */
function getNeighborIndices(
  tileIndex: number,
  tiles: Tile[],
  gridSize: number
): number[] {
  const tile = tiles[tileIndex];
  const currentPos = tile.currentPos;
  
  const row = Math.floor(currentPos / gridSize);
  const col = currentPos % gridSize;

  const neighbors: number[] = [];

  // Up
  if (row > 0) {
    const upPos = currentPos - gridSize;
    const upIndex = tiles.findIndex(t => t.currentPos === upPos);
    if (upIndex !== -1) neighbors.push(upIndex);
  }

  // Right
  if (col < gridSize - 1) {
    const rightPos = currentPos + 1;
    const rightIndex = tiles.findIndex(t => t.currentPos === rightPos);
    if (rightIndex !== -1) neighbors.push(rightIndex);
  }

  // Down
  if (row < gridSize - 1) {
    const downPos = currentPos + gridSize;
    const downIndex = tiles.findIndex(t => t.currentPos === downPos);
    if (downIndex !== -1) neighbors.push(downIndex);
  }

  // Left
  if (col > 0) {
    const leftPos = currentPos - 1;
    const leftIndex = tiles.findIndex(t => t.currentPos === leftPos);
    if (leftIndex !== -1) neighbors.push(leftIndex);
  }

  return neighbors;
}

/**
 * Check if two tiles are adjacent in their correct positions.
 */
function areAdjacentInSolution(
  tile1: Tile,
  tile2: Tile,
  gridSize: number
): boolean {
  const pos1 = tile1.correctPos;
  const pos2 = tile2.correctPos;

  const row1 = Math.floor(pos1 / gridSize);
  const col1 = pos1 % gridSize;
  const row2 = Math.floor(pos2 / gridSize);
  const col2 = pos2 % gridSize;

  // Check if adjacent horizontally or vertically
  const rowDiff = Math.abs(row1 - row2);
  const colDiff = Math.abs(col1 - col2);

  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

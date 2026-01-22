import { Tile } from '../types/game';

/**
 * Simplified displacement logic that shifts tiles directionally to fill gaps.
 * When a group is placed, other tiles simply shift up/down/left/right to fill empty spaces.
 */
export function displaceTimesForGroupPlacement(
  tiles: Tile[],
  groupIndices: number[],
  targetPosition: number,
  gridSize: number
): Tile[] | null {
  const newTiles = tiles.map(t => ({ ...t }));
  const groupTileIds = new Set(groupIndices.map(idx => newTiles[idx].id));
  
  // Get group tiles 
  const groupTiles = groupIndices.map(idx => newTiles[idx]);
  const anchorTile = groupTiles[0];
  
  // Calculate offset
  const offsetRow = Math.floor(targetPosition / gridSize) - Math.floor(anchorTile.currentPos / gridSize);
  const offsetCol = (targetPosition % gridSize) - (anchorTile.currentPos % gridSize);
  
  // 1. Calculate Target Positions (T) and check Bounds
  const targetPositions = new Set<number>();
  const newPosMap = new Map<number, number>(); // TileID -> NewPos

  for (const tile of groupTiles) {
    const r = Math.floor(tile.currentPos / gridSize);
    const c = tile.currentPos % gridSize;
    const nr = r + offsetRow;
    const nc = c + offsetCol;
    
    // Strict bounds check
    if (nr < 0 || nr >= gridSize || nc < 0 || nc >= gridSize) {
      return null;
    }
    const newPos = nr * gridSize + nc;
    targetPositions.add(newPos);
    newPosMap.set(tile.id, newPos);
  }
  
  // 2. Identify Source Positions (S)
  const sourcePositions = new Set(groupTiles.map(t => t.currentPos));
  
  // 3. Identify Vacancies (S \ T)
  // These are spots the group is leaving that are NOT immediately re-occupied by the group itself.
  const vacancies: number[] = [];
  sourcePositions.forEach(pos => {
    if (!targetPositions.has(pos)) {
      vacancies.push(pos);
    }
  });
  
  // 4. Identify Victims (Tiles at T \ S)
  // These are non-group tiles currently sitting at the target spots.
  // Note: Tiles at (T ∩ S) are group tiles staying within the group footprint, so no victim there.
  const victims: Tile[] = [];
  newTiles.forEach(tile => {
    if (!groupTileIds.has(tile.id) && targetPositions.has(tile.currentPos)) {
       victims.push(tile);
    }
  });

  // Safety check: Count of vacancies must equal count of victims
  // Logic: |S| = |T|. |S \ T| = |S| - |S ∩ T|. |T \ S| = |T| - |T ∩ S|. 
  // Since |S|=|T| and Intersection is same, size must match.
  if (vacancies.length !== victims.length) {
      console.error("Mismatch in displacement logic", vacancies, victims);
      return null; // Abort to prevent corruption
  }
  
  // 5. Move Victims to Vacancies
  // We just zip them. Order doesn't strictly matter for validity, but consistent sorting helps stability.
  victims.sort((a, b) => a.id - b.id);
  vacancies.sort((a, b) => a - b);
  
  victims.forEach((victim, i) => {
      victim.currentPos = vacancies[i];
  });
  
  // 6. Move Group to Target
  groupIndices.forEach(idx => {
      const tile = newTiles[idx];
      const newPos = newPosMap.get(tile.id);
      if (newPos !== undefined) {
          tile.currentPos = newPos;
      }
  });

  return newTiles.sort((a, b) => a.currentPos - b.currentPos);
}

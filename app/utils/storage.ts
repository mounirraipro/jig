// LocalStorage utilities for game progress

export interface LevelProgress {
  level: number;
  stars: number; // 0-3
  bestTime: number; // in seconds
  completed: boolean;
  completedAt?: string; // ISO date string
}

export interface PlayerStats {
  totalPuzzlesSolved: number;
  totalStarsEarned: number;
  totalTimePlayed: number; // in seconds
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string | null; // ISO date string (YYYY-MM-DD)
  dailyChallengeCompleted: string | null; // ISO date string of last completed daily
  unlockedCollections: number[]; // collection indices that are unlocked
  lastPlayedLevel: number | null; // The last level the user was playing
}

const PROGRESS_KEY = 'jigsolitaire-progress';
const STATS_KEY = 'jigsolitaire-stats';

// Get today's date as YYYY-MM-DD
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Initialize default stats
function getDefaultStats(): PlayerStats {
  return {
    totalPuzzlesSolved: 0,
    totalStarsEarned: 0,
    totalTimePlayed: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastPlayedDate: null,
    dailyChallengeCompleted: null,
    unlockedCollections: [0], // First collection always unlocked
    lastPlayedLevel: 1, // Start at level 1 by default
  };
}

export function getLastPlayedLevel(): number {
  const stats = getPlayerStats();
  return stats.lastPlayedLevel ?? 1;
}

export function setLastPlayedLevel(level: number): void {
  const stats = getPlayerStats();
  stats.lastPlayedLevel = level;
  savePlayerStats(stats);
}

export function getPlayerStats(): PlayerStats {
  if (typeof window === 'undefined') return getDefaultStats();
  
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (!stored) return getDefaultStats();
    return { ...getDefaultStats(), ...JSON.parse(stored) };
  } catch {
    return getDefaultStats();
  }
}

export function savePlayerStats(stats: PlayerStats): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function updateStreak(): PlayerStats {
  const stats = getPlayerStats();
  const today = getTodayDate();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (stats.lastPlayedDate === today) {
    // Already played today, no streak update needed
    return stats;
  } else if (stats.lastPlayedDate === yesterday) {
    // Played yesterday, increment streak
    stats.currentStreak += 1;
    stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak);
  } else {
    // Streak broken or first time playing
    stats.currentStreak = 1;
  }
  
  stats.lastPlayedDate = today;
  savePlayerStats(stats);
  return stats;
}

export function unlockCollection(collectionIndex: number): void {
  const stats = getPlayerStats();
  if (!stats.unlockedCollections.includes(collectionIndex)) {
    stats.unlockedCollections.push(collectionIndex);
    savePlayerStats(stats);
  }
}

export function isCollectionUnlocked(collectionIndex: number): boolean {
  const stats = getPlayerStats();
  // First 3 collections are always unlocked, rest need to be earned
  if (collectionIndex < 3) return true;
  return stats.unlockedCollections.includes(collectionIndex);
}

export function getDailyChallengeLevelIndex(totalLevels: number): number {
  // Generate a consistent level for today based on date
  const today = getTodayDate();
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = ((hash << 5) - hash) + today.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash) % totalLevels;
}

export function isDailyChallengeCompleted(): boolean {
  const stats = getPlayerStats();
  return stats.dailyChallengeCompleted === getTodayDate();
}

export function completeDailyChallenge(): void {
  const stats = getPlayerStats();
  stats.dailyChallengeCompleted = getTodayDate();
  savePlayerStats(stats);
}

export function getAllProgress(): LevelProgress[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function getLevelProgress(level: number): LevelProgress | null {
  const allProgress = getAllProgress();
  return allProgress.find(p => p.level === level) || null;
}

export function isLevelCompleted(level: number): boolean {
  const progress = getLevelProgress(level);
  return progress?.completed ?? false;
}

export function getCompletedLevelsInRange(startLevel: number, endLevel: number): number {
  const allProgress = getAllProgress();
  return allProgress.filter(p => 
    p.completed && p.level >= startLevel && p.level <= endLevel
  ).length;
}

export function getStarsInRange(startLevel: number, endLevel: number): number {
  const allProgress = getAllProgress();
  return allProgress
    .filter(p => p.level >= startLevel && p.level <= endLevel)
    .reduce((sum, p) => sum + p.stars, 0);
}

export function saveLevelProgress(level: number, timeInSeconds: number): LevelProgress {
  const allProgress = getAllProgress();
  const stats = getPlayerStats();
  
  // Calculate stars based on time
  let stars = 0;
  if (timeInSeconds < 10) {
    stars = 3;
  } else if (timeInSeconds < 20) {
    stars = 2;
  } else if (timeInSeconds >= 30) {
    stars = 1;
  } else {
    stars = 2;
  }
  
  const existingIndex = allProgress.findIndex(p => p.level === level);
  const isNewCompletion = existingIndex < 0;
  
  const newProgress: LevelProgress = {
    level,
    stars,
    bestTime: timeInSeconds,
    completed: true,
    completedAt: new Date().toISOString(),
  };
  
  if (existingIndex >= 0) {
    const existing = allProgress[existingIndex];
    if (timeInSeconds < existing.bestTime || stars > existing.stars) {
      // Update stats with star difference
      stats.totalStarsEarned += Math.max(0, stars - existing.stars);
      allProgress[existingIndex] = newProgress;
    } else {
      return existing;
    }
  } else {
    allProgress.push(newProgress);
    // Update stats for new completion
    stats.totalPuzzlesSolved += 1;
    stats.totalStarsEarned += stars;
  }
  
  // Update total time played
  stats.totalTimePlayed += timeInSeconds;
  
  // Update streak
  updateStreak();
  
  // Check if we should unlock next collection
  // Unlock next collection when 4+ puzzles completed in current one
  const collectionSize = 6;
  const currentCollectionIndex = Math.floor((level - 1) / collectionSize);
  const collectionStart = currentCollectionIndex * collectionSize + 1;
  const collectionEnd = collectionStart + collectionSize - 1;
  const completedInCollection = getCompletedLevelsInRange(collectionStart, collectionEnd);
  
  if (completedInCollection >= 4) {
    unlockCollection(currentCollectionIndex + 1);
  }
  
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
  savePlayerStats(stats);
  
  return newProgress;
}

export function clearProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PROGRESS_KEY);
  localStorage.removeItem(STATS_KEY);
}

// Track play time - call periodically during gameplay
export function addPlayTime(seconds: number): void {
  if (typeof window === 'undefined' || seconds <= 0) return;
  
  const stats = getPlayerStats();
  stats.totalTimePlayed += seconds;
  savePlayerStats(stats);
}

// Session time tracker - tracks time spent in game
let sessionStartTime: number | null = null;
let lastSaveTime: number | null = null;

export function startPlaySession(): void {
  sessionStartTime = Date.now();
  lastSaveTime = Date.now();
}

export function savePlaySession(): void {
  if (!lastSaveTime) return;
  
  const now = Date.now();
  const elapsedSeconds = Math.floor((now - lastSaveTime) / 1000);
  
  if (elapsedSeconds > 0) {
    addPlayTime(elapsedSeconds);
    lastSaveTime = now;
  }
}

export function endPlaySession(): void {
  savePlaySession();
  sessionStartTime = null;
  lastSaveTime = null;
}

// Check if user is visiting for the first time today and update streak
// Returns streak info if first visit, null if already visited today
export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  isNewRecord: boolean;
  streakContinued: boolean; // true if streak continued from yesterday
  isFirstVisitEver: boolean;
}

const LAST_VISIT_KEY = 'jigsolitaire-last-visit';

export function checkDailyVisit(): StreakInfo | null {
  if (typeof window === 'undefined') return null;
  
  const today = getTodayDate();
  const lastVisit = localStorage.getItem(LAST_VISIT_KEY);
  
  // Already visited today
  if (lastVisit === today) {
    return null;
  }
  
  const stats = getPlayerStats();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const isFirstVisitEver = stats.lastPlayedDate === null;
  const streakContinued = stats.lastPlayedDate === yesterday;
  
  // Update streak
  let newStreak: number;
  if (streakContinued) {
    newStreak = stats.currentStreak + 1;
  } else {
    newStreak = 1;
  }
  
  const isNewRecord = newStreak > stats.longestStreak;
  const newLongestStreak = Math.max(newStreak, stats.longestStreak);
  
  // Save updated stats
  stats.currentStreak = newStreak;
  stats.longestStreak = newLongestStreak;
  stats.lastPlayedDate = today;
  savePlayerStats(stats);
  
  // Mark today as visited
  localStorage.setItem(LAST_VISIT_KEY, today);
  
  return {
    currentStreak: newStreak,
    longestStreak: newLongestStreak,
    isNewRecord,
    streakContinued,
    isFirstVisitEver,
  };
}

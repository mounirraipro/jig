// Background music handler with persistent state across page navigation
// Music continues playing seamlessly during level changes

type MusicEventCallback = () => void;

interface MusicState {
  isPlaying: boolean;
  currentTrackIndex: number;
  currentTime: number;
  volume: number;
}

const STORAGE_KEY = 'jigsolitaire_music_state';

class BackgroundMusicManager {
  private tracks: HTMLAudioElement[] = [];
  private currentTrackIndex: number = 0;
  private isEnabled: boolean = true;
  private isPlaying: boolean = false;
  private fadeDuration: number = 1000;
  private fadeInterval: number | null = null;
  private volume: number = 0.3;
  private readonly MAX_TRACKS = 10;
  private listeners: Set<MusicEventCallback> = new Set();
  private loadedTrackCount: number = 0;
  private initialized: boolean = false;
  private pendingPlay: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadState();
      this.loadTracks();
      
      // Save state periodically and on page unload
      window.addEventListener('beforeunload', () => this.saveState());
      setInterval(() => this.saveState(), 5000);
    }
  }

  private loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state: MusicState = JSON.parse(saved);
        this.currentTrackIndex = state.currentTrackIndex || 0;
        this.volume = state.volume ?? 0.3;
        // Remember if music was playing
        this.pendingPlay = state.isPlaying || false;
      }
    } catch {
      // Ignore storage errors
    }
  }

  private saveState() {
    try {
      const currentTrack = this.getCurrentTrack();
      const state: MusicState = {
        isPlaying: this.isPlaying,
        currentTrackIndex: this.currentTrackIndex,
        currentTime: currentTrack?.currentTime || 0,
        volume: this.volume,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors
    }
  }

  private loadTracks() {
    const tracksToLoad: HTMLAudioElement[] = [];
    
    for (let i = 1; i <= this.MAX_TRACKS; i++) {
      const audio = new Audio(`/sounds/bg/mbg${i}.mp3`);
      audio.volume = 0;
      audio.preload = 'auto';
      audio.loop = false;
      
      audio.addEventListener('ended', () => {
        this.handleTrackEnd();
      });

      audio.addEventListener('canplaythrough', () => {
        this.loadedTrackCount++;
        // Restore playback state once tracks are loaded
        if (!this.initialized && this.loadedTrackCount > 0) {
          this.initialized = true;
          this.restorePlayback();
        }
      }, { once: true });

      audio.addEventListener('error', () => {
        const index = this.tracks.indexOf(audio);
        if (index > -1) {
          this.tracks.splice(index, 1);
          if (this.currentTrackIndex >= this.tracks.length && this.tracks.length > 0) {
            this.currentTrackIndex = 0;
          }
        }
      });

      try {
        audio.load();
      } catch {
        // Ignore load errors
      }
      
      tracksToLoad.push(audio);
    }
    
    this.tracks = tracksToLoad;
  }

  private async restorePlayback() {
    if (!this.pendingPlay) return;
    
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state: MusicState = JSON.parse(saved);
        const track = this.getCurrentTrack();
        
        if (track && state.currentTime > 0) {
          track.currentTime = Math.min(state.currentTime, track.duration || state.currentTime);
        }
        
        if (state.isPlaying) {
          // Small delay to allow page to be interactive
          setTimeout(() => {
            this.play().catch(() => {});
          }, 100);
        }
      }
    } catch {
      // Ignore restore errors
    }
  }

  subscribe(callback: MusicEventCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(cb => cb());
  }

  private getCurrentTrack(): HTMLAudioElement | null {
    if (this.tracks.length === 0) return null;
    return this.tracks[this.currentTrackIndex] || null;
  }

  private async fadeOut(track: HTMLAudioElement, callback: () => void) {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
    }

    const steps = 20;
    const stepDuration = this.fadeDuration / steps;
    const volumeStep = track.volume / steps;

    return new Promise<void>((resolve) => {
      this.fadeInterval = window.setInterval(() => {
        track.volume = Math.max(0, track.volume - volumeStep);
        
        if (track.volume <= 0) {
          if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
            this.fadeInterval = null;
          }
          track.pause();
          // Don't reset currentTime - keep position for seamless resume
          callback();
          resolve();
        }
      }, stepDuration);
    });
  }

  private async fadeIn(track: HTMLAudioElement) {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
    }

    // Start from current volume (might be resuming)
    const startVolume = track.volume;
    const steps = 20;
    const stepDuration = this.fadeDuration / steps;
    const volumeStep = (this.volume - startVolume) / steps;

    return new Promise<void>((resolve) => {
      this.fadeInterval = window.setInterval(() => {
        track.volume = Math.min(this.volume, track.volume + volumeStep);
        
        if (track.volume >= this.volume) {
          if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
            this.fadeInterval = null;
          }
          resolve();
        }
      }, stepDuration);
    });
  }

  private handleTrackEnd() {
    if (!this.isEnabled || !this.isPlaying) return;
    this.nextTrack();
  }

  async nextTrack() {
    const currentTrack = this.getCurrentTrack();
    if (!currentTrack || this.tracks.length === 0) return;

    if (this.isPlaying) {
      await this.fadeOut(currentTrack, () => {});
    }
    
    currentTrack.pause();
    currentTrack.currentTime = 0;

    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.notifyListeners();
    this.saveState();

    if (this.isPlaying) {
      const nextTrack = this.getCurrentTrack();
      if (nextTrack) {
        nextTrack.currentTime = 0;
        nextTrack.volume = 0;
        await nextTrack.play().catch(() => {});
        await this.fadeIn(nextTrack);
      }
    }
  }

  async previousTrack() {
    const currentTrack = this.getCurrentTrack();
    if (!currentTrack || this.tracks.length === 0) return;

    if (this.isPlaying) {
      await this.fadeOut(currentTrack, () => {});
    }
    
    currentTrack.pause();
    currentTrack.currentTime = 0;

    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.notifyListeners();
    this.saveState();

    if (this.isPlaying) {
      const prevTrack = this.getCurrentTrack();
      if (prevTrack) {
        prevTrack.currentTime = 0;
        prevTrack.volume = 0;
        await prevTrack.play().catch(() => {});
        await this.fadeIn(prevTrack);
      }
    }
  }

  async play() {
    if (!this.isEnabled || this.tracks.length === 0) return;

    const currentTrack = this.getCurrentTrack();
    if (!currentTrack) return;

    this.isPlaying = true;
    this.notifyListeners();
    this.saveState();

    try {
      // If track is already playing at target volume, do nothing
      if (!currentTrack.paused && currentTrack.volume >= this.volume) {
        return;
      }
      
      // Resume or start playing
      if (currentTrack.paused) {
        await currentTrack.play();
      }
      await this.fadeIn(currentTrack);
    } catch {
      this.isPlaying = false;
      this.notifyListeners();
    }
  }

  async stop() {
    const wasPlaying = this.isPlaying;
    this.isPlaying = false;
    this.notifyListeners();
    
    const currentTrack = this.getCurrentTrack();
    if (currentTrack && wasPlaying) {
      await this.fadeOut(currentTrack, () => {});
      // Reset to beginning when stopped (not paused)
      currentTrack.currentTime = 0;
    }
    
    this.saveState();
  }

  pause() {
    const currentTrack = this.getCurrentTrack();
    if (currentTrack) {
      // Save position before pausing
      this.saveState();
      currentTrack.pause();
    }
    
    this.isPlaying = false;
    this.notifyListeners();
    this.saveState();
  }

  async toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      await this.play();
    }
  }

  resume() {
    if (!this.isEnabled) return;
    
    const currentTrack = this.getCurrentTrack();
    if (currentTrack) {
      this.isPlaying = true;
      this.notifyListeners();
      currentTrack.play().catch(() => {
        this.isPlaying = false;
        this.notifyListeners();
      });
      this.fadeIn(currentTrack);
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.pause();
    }
    // Don't auto-resume when enabled - let user control via MiniPlayer
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    const currentTrack = this.getCurrentTrack();
    if (currentTrack && !currentTrack.paused) {
      currentTrack.volume = this.volume;
    }
    this.notifyListeners();
    this.saveState();
  }

  // Getters for UI state
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  getCurrentTrackIndex(): number {
    return this.currentTrackIndex;
  }

  getTotalTracks(): number {
    return this.tracks.length;
  }

  getVolume(): number {
    return this.volume;
  }

  getProgress(): number {
    const track = this.getCurrentTrack();
    if (!track || !track.duration || isNaN(track.duration)) return 0;
    return track.currentTime / track.duration;
  }

  getCurrentTime(): number {
    const track = this.getCurrentTrack();
    return track?.currentTime || 0;
  }

  getDuration(): number {
    const track = this.getCurrentTrack();
    return track?.duration || 0;
  }

  // Seek to position (0-1)
  seek(position: number) {
    const track = this.getCurrentTrack();
    if (track && track.duration) {
      track.currentTime = position * track.duration;
      this.saveState();
      this.notifyListeners();
    }
  }
}

// Singleton instance - persists across component mounts
let backgroundMusicInstance: BackgroundMusicManager | null = null;

export function getBackgroundMusicManager(): BackgroundMusicManager {
  if (!backgroundMusicInstance) {
    backgroundMusicInstance = new BackgroundMusicManager();
  }
  return backgroundMusicInstance;
}

// Background music handler with fade in/out transitions

type MusicEventCallback = () => void;

class BackgroundMusicManager {
  private tracks: HTMLAudioElement[] = [];
  private currentTrackIndex: number = 0;
  private isEnabled: boolean = true;
  private isPlaying: boolean = false;
  private fadeDuration: number = 1000; // 1 second fade
  private fadeInterval: number | null = null;
  private volume: number = 0.3;
  private readonly MAX_TRACKS = 10;
  private listeners: Set<MusicEventCallback> = new Set();
  private loadedTrackCount: number = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadTracks();
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
      });

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

  // Subscribe to state changes
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
          track.currentTime = 0;
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

    track.volume = 0;
    const steps = 20;
    const stepDuration = this.fadeDuration / steps;
    const volumeStep = this.volume / steps;

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
    } else {
      currentTrack.pause();
      currentTrack.currentTime = 0;
    }

    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.notifyListeners();

    if (this.isPlaying) {
      const nextTrack = this.getCurrentTrack();
      if (nextTrack) {
        nextTrack.currentTime = 0;
        await this.fadeIn(nextTrack);
        await nextTrack.play().catch(() => {});
      }
    }
  }

  async previousTrack() {
    const currentTrack = this.getCurrentTrack();
    if (!currentTrack || this.tracks.length === 0) return;

    if (this.isPlaying) {
      await this.fadeOut(currentTrack, () => {});
    } else {
      currentTrack.pause();
      currentTrack.currentTime = 0;
    }

    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.notifyListeners();

    if (this.isPlaying) {
      const prevTrack = this.getCurrentTrack();
      if (prevTrack) {
        prevTrack.currentTime = 0;
        await this.fadeIn(prevTrack);
        await prevTrack.play().catch(() => {});
      }
    }
  }

  async play() {
    if (!this.isEnabled || this.tracks.length === 0) return;

    const currentTrack = this.getCurrentTrack();
    if (!currentTrack) return;

    this.isPlaying = true;
    this.notifyListeners();

    try {
      if (currentTrack.currentTime === 0 || currentTrack.paused) {
        await this.fadeIn(currentTrack);
      }
      await currentTrack.play();
    } catch {
      this.isPlaying = false;
      this.notifyListeners();
    }
  }

  async stop() {
    this.isPlaying = false;
    this.notifyListeners();
    
    const currentTrack = this.getCurrentTrack();
    if (currentTrack) {
      await this.fadeOut(currentTrack, () => {});
    }
  }

  pause() {
    this.isPlaying = false;
    this.notifyListeners();
    
    const currentTrack = this.getCurrentTrack();
    if (currentTrack) {
      currentTrack.pause();
    }
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
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.pause();
    } else if (this.isPlaying) {
      this.resume();
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    const currentTrack = this.getCurrentTrack();
    if (currentTrack && !currentTrack.paused) {
      currentTrack.volume = this.volume;
    }
    this.notifyListeners();
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
    if (!track || !track.duration) return 0;
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
}

// Singleton instance
let backgroundMusicInstance: BackgroundMusicManager | null = null;

export function getBackgroundMusicManager(): BackgroundMusicManager {
  if (!backgroundMusicInstance) {
    backgroundMusicInstance = new BackgroundMusicManager();
  }
  return backgroundMusicInstance;
}

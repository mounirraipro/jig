// Background music handler with fade in/out transitions
class BackgroundMusicManager {
  private tracks: HTMLAudioElement[] = [];
  private currentTrackIndex: number = 0;
  private isEnabled: boolean = true;
  private isPlaying: boolean = false;
  private fadeDuration: number = 2000; // 2 seconds fade
  private fadeInterval: number | null = null;
  private volume: number = 0.3;
  private readonly MAX_TRACKS = 10; // Support up to mbg1.mp3 through mbg10.mp3

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
      
      // Add event listener for track end
      audio.addEventListener('ended', () => {
        this.handleTrackEnd();
      });

      // Test if file exists - add error handler
      audio.addEventListener('error', () => {
        const index = this.tracks.indexOf(audio);
        if (index > -1) {
          this.tracks.splice(index, 1);
          if (this.currentTrackIndex >= this.tracks.length && this.tracks.length > 0) {
            this.currentTrackIndex = 0;
          }
        }
      });

      // Try to load to verify existence (load() is synchronous, errors handled by event listener)
      try {
        audio.load();
      } catch {
        // Ignore load errors, will be handled by error event listener
      }
      
      tracksToLoad.push(audio);
    }
    
    this.tracks = tracksToLoad;
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

    const currentTrack = this.getCurrentTrack();
    if (!currentTrack) return;

    // If only one track, loop it
    if (this.tracks.length === 1) {
      currentTrack.currentTime = 0;
      this.fadeIn(currentTrack).then(() => {
        currentTrack.play().catch(() => {
          // Ignore play errors
        });
      });
      return;
    }

    // Fade out current track, then fade in next
    this.fadeOut(currentTrack, () => {
      this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
      const nextTrack = this.getCurrentTrack();
      
      if (nextTrack) {
        nextTrack.currentTime = 0;
        this.fadeIn(nextTrack).then(() => {
          nextTrack.play().catch(() => {
            // Ignore play errors
          });
        });
      }
    });
  }

  async play() {
    if (!this.isEnabled || this.tracks.length === 0) return;

    const currentTrack = this.getCurrentTrack();
    if (!currentTrack) return;

    this.isPlaying = true;

    try {
      currentTrack.currentTime = 0;
      await this.fadeIn(currentTrack);
      await currentTrack.play();
    } catch (error) {
      // Ignore play errors (user interaction required)
      this.isPlaying = false;
    }
  }

  async stop() {
    this.isPlaying = false;
    
    const currentTrack = this.getCurrentTrack();
    if (currentTrack) {
      await this.fadeOut(currentTrack, () => {
        // Track already paused in fadeOut
      });
    }
  }

  pause() {
    this.isPlaying = false;
    this.tracks.forEach(track => {
      track.pause();
    });
  }

  resume() {
    if (!this.isEnabled) return;
    
    const currentTrack = this.getCurrentTrack();
    if (currentTrack && !currentTrack.paused) {
      this.isPlaying = true;
      currentTrack.play().catch(() => {
        // Ignore play errors
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
    this.tracks.forEach(track => {
      if (!track.paused) {
        track.volume = this.volume;
      }
    });
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


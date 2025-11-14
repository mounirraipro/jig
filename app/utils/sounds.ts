// Sound management utility (click and win sounds only)
class SoundManager {
  private clickSound: HTMLAudioElement | null = null;
  private winSound: HTMLAudioElement | null = null;
  private isEnabled: boolean = true;
  private lastClickTime: number = 0;
  private readonly CLICK_THROTTLE_MS = 80;

  constructor() {
    if (typeof window !== 'undefined') {
      this.clickSound = new Audio('/sounds/click-2.mp3');
      this.clickSound.volume = 0.5;
      this.clickSound.preload = 'auto';

      this.winSound = new Audio('/sounds/win.mp3');
      this.winSound.volume = 0.6;
      this.winSound.preload = 'auto';
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  playClick() {
    if (!this.isEnabled || !this.clickSound) return;
    
    const now = Date.now();
    if (now - this.lastClickTime < this.CLICK_THROTTLE_MS) return;
    this.lastClickTime = now;

    try {
      this.clickSound.currentTime = 0;
      this.clickSound.play().catch(() => {
        // Ignore play errors (e.g., user hasn't interacted yet)
      });
    } catch {
      // Ignore errors
    }
  }

  playWin() {
    if (!this.isEnabled || !this.winSound) return;
    
    try {
      this.winSound.currentTime = 0;
      this.winSound.play().catch(() => {
        // Ignore play errors
      });
    } catch {
      // Ignore errors
    }
  }

}

// Singleton instance
let soundManagerInstance: SoundManager | null = null;

export function getSoundManager(): SoundManager {
  if (!soundManagerInstance) {
    soundManagerInstance = new SoundManager();
  }
  return soundManagerInstance;
}


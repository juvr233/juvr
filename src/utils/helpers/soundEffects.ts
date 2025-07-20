/**
 * Sound effect management utilities
 */

import { AUDIO_CONFIG } from '../config/audio';

// Keep track of all audio instances for global volume control
const audioInstances: Record<string, HTMLAudioElement> = {};

/**
 * Sound effects configuration
 */
export interface SoundEffectsConfig {
  enabled: boolean;
  volume: number; // 0.0 to 1.0
}

// Default configuration with moderate volume
const defaultConfig: SoundEffectsConfig = {
  enabled: true,
  volume: 0.5
};

// Current configuration
let currentConfig: SoundEffectsConfig = { ...defaultConfig };

/**
 * Initialize or update sound settings
 * @param config Sound configuration options
 */
export function configureSoundEffects(config: Partial<SoundEffectsConfig> = {}): void {
  currentConfig = { ...currentConfig, ...config };
  
  // Update all existing audio elements
  Object.values(audioInstances).forEach(audio => {
    audio.volume = currentConfig.volume;
    if (!currentConfig.enabled) {
      audio.pause();
    }
  });
}

/**
 * Play a sound effect
 * @param soundName The name of the sound file (without path or extension)
 * @param options Optional settings for this sound instance
 * @returns Promise that resolves when sound begins playing (or rejects on error)
 */
export function playSoundEffect(
  soundName: string, 
  options: { 
    volume?: number; 
    loop?: boolean;
    onEnded?: () => void;
  } = {}
): Promise<void> {
  if (!currentConfig.enabled) {
    return Promise.resolve();
  }
  
  return new Promise((resolve, reject) => {
    try {
      // Create or reuse audio element
      const soundId = `sound-${soundName}`;
      let audio = audioInstances[soundId];
      
      if (!audio) {
        // Map sound names to configured paths
        const soundPath = soundName === 'card-flip' ? AUDIO_CONFIG.effects.cardFlip :
                         soundName === 'card-select' ? AUDIO_CONFIG.effects.cardSelect :
                         `/audio/effects/${soundName}.mp3`; // fallback
        
        audio = new Audio(soundPath);
        audioInstances[soundId] = audio;
      }
      
      // Reset if already playing
      audio.pause();
      audio.currentTime = 0;
      
      // Configure audio
      audio.volume = options.volume !== undefined ? options.volume : currentConfig.volume;
      audio.loop = options.loop || false;
      
      // Add event handlers
      if (options.onEnded) {
        const handleEnded = () => {
          options.onEnded?.();
          audio.removeEventListener('ended', handleEnded);
        };
        audio.addEventListener('ended', handleEnded);
      }
      
      // Play sound
      audio.play()
        .then(() => resolve())
        .catch(error => {
          if (process.env.NODE_ENV === 'development') {
            console.log(`Sound playback failed for ${soundName}:`, error);
          }
          reject(error);
        });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Error setting up sound ${soundName}:`, error);
      }
      reject(error);
    }
  });
}

/**
 * Stop a currently playing sound effect
 * @param soundName The name of the sound to stop
 */
export function stopSoundEffect(soundName: string): void {
  const soundId = `sound-${soundName}`;
  const audio = audioInstances[soundId];
  
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}

/**
 * Get the current sound configuration
 */
export function getSoundConfig(): SoundEffectsConfig {
  return { ...currentConfig };
}

/**
 * Clean up all audio instances (call on component unmount)
 */
export function cleanupSoundEffects(): void {
  Object.values(audioInstances).forEach(audio => {
    audio.pause();
    audio.src = '';
  });
  
  // Clear instances
  Object.keys(audioInstances).forEach(key => {
    delete audioInstances[key];
  });
}

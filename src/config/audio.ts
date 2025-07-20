/**
 * Audio configuration for the application
 * Centralizes all audio file paths and settings
 */

export const AUDIO_CONFIG = {
  background: {
    tarot: '/audio/background/tarot-background.mp3'
  },
  effects: {
    cardFlip: '/audio/effects/card-flip.mp3',
    cardSelect: '/audio/effects/card-select.mp3'
  }
} as const;

/**
 * Audio playback settings
 */
export const AUDIO_SETTINGS = {
  background: {
    defaultVolume: 0.3,
    fadeInDuration: 1000,
    fadeOutDuration: 500
  },
  effects: {
    defaultVolume: 0.5,
    maxConcurrent: 3 // Maximum number of concurrent sound effects
  }
} as const;

/**
 * Check if audio file exists and is accessible
 * @param audioPath Path to the audio file
 * @returns Promise<boolean>
 */
export const checkAudioAvailability = async (audioPath: string): Promise<boolean> => {
  try {
    const audio = new Audio(audioPath);
    return new Promise((resolve) => {
      audio.addEventListener('canplaythrough', () => resolve(true), { once: true });
      audio.addEventListener('error', () => resolve(false), { once: true });
      audio.load();
    });
  } catch {
    return false;
  }
};

/**
 * Get fallback audio configuration for missing files
 */
export const FALLBACK_AUDIO_CONFIG = {
  background: {
    tarot: '' // No background music if file is missing
  },
  effects: {
    cardFlip: '', // Silent fallback
    cardSelect: ''
  }
} as const;
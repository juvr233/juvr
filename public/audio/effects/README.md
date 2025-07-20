# Audio Effects Files

## Required Sound Effects

### card-flip.mp3
- **Usage**: Sound when tarot cards are flipped/revealed
- **Duration**: ~0.5-1 second
- **Type**: Subtle paper/card flipping sound
- **Volume**: Medium (will be controlled by app settings)

### card-select.mp3  
- **Usage**: Sound when user selects/clicks a card
- **Duration**: ~0.3-0.5 seconds
- **Type**: Gentle selection chime or click
- **Volume**: Lower than card-flip

## Creating Sound Effects

### DIY Options
1. Record actual card flipping sounds
2. Use audio editing software (Audacity, etc.)
3. Layer multiple sounds for richness

### Free Resources
- **Freesound.org**: Large library of Creative Commons sounds
- **Zapsplat**: Free with registration
- **BBC Sound Effects**: Free for personal use

### File Specifications
- **Format**: MP3 (preferred) or OGG
- **Bitrate**: 128kbps minimum
- **Sample Rate**: 44.1kHz
- **Length**: Keep effects short (under 2 seconds)
- **Volume**: Normalized but not too loud

## Integration Notes

These files are referenced in:
- `/src/config/audio.ts` - Configuration file
- `/src/utils/helpers/soundEffects.ts` - Audio playback system
- `/src/components/TarotCard.tsx` - Card flip effects
- `/src/pages/TarotPage.tsx` - Card selection effects
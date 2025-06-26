import React, { useState, useEffect } from 'react';
import type { TarotCard as TarotCardType } from '../utils/tarotCards';
import { loadImage } from '../utils/helpers/imageLoader';
import { playSoundEffect } from '../utils/helpers/soundEffects';

interface TarotCardProps {
  card: TarotCardType | null;
  position?: string;
  isRevealed: boolean;
  onReveal?: () => void;
  index?: number;
  spreadType?: string;
  enableSoundEffects?: boolean;
}

const TarotCard: React.FC<TarotCardProps> = ({ 
  card, 
  position, 
  isRevealed, 
  onReveal,
  index = 0,
  spreadType = 'classic',
  enableSoundEffects = true
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isRevealed && !isFlipped) {
      // Preload card image if we have a card
      if (card && card.image) {
        loadImage(card.image).catch(e => console.log('Image loading failed:', e));
      }
      
      const timer = setTimeout(() => {
        setIsFlipped(true);
        // Play flip sound
        if (enableSoundEffects) {
          playSoundEffect('card-flip', { volume: 0.5 }).catch(error => console.log('Sound playback failed:', error));
        }
      }, 300 * index); // Cascade animation effect
      return () => clearTimeout(timer);
    }
  }, [isRevealed, index, isFlipped, enableSoundEffects, card]);

  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (!isRevealed && onReveal) {
      setIsClicked(true);
      // Add visual feedback with a slight delay before calling onReveal
      setTimeout(() => {
        onReveal();
        setIsClicked(false);
      }, 150);
    }
  };

  // Card back pattern
  const cardBack = "https://upload.wikimedia.org/wikipedia/commons/6/67/Card_back_06.svg";
  
  // Calculate card positioning based on spread type
  const getCardPosition = () => {
    if (spreadType === 'classic' || !spreadType) {
      return {};
    } else if (spreadType === 'celtic-cross') {
      // Celtic Cross specific positions
      const positions = [
        { transform: 'translate(0, 0)' }, // Center
        { transform: 'translate(0, 0) rotate(90deg)' }, // Crossing card
        { transform: 'translate(-160px, 0)' }, // Left side
        { transform: 'translate(0, -160px)' }, // Above
        { transform: 'translate(160px, 0)' }, // Right side
        { transform: 'translate(0, 160px)' }, // Below
        { transform: 'translate(280px, -240px)' }, // Staff position 1
        { transform: 'translate(280px, -80px)' }, // Staff position 2
        { transform: 'translate(280px, 80px)' }, // Staff position 3
        { transform: 'translate(280px, 240px)' }, // Staff position 4
      ];
      return index < positions.length ? positions[index] : {};
    }
    return {};
  };

  return (
    <div 
      className="relative perspective-1000 w-44 h-72 mx-2 mb-4 select-none"
      role="button"
      aria-label={isFlipped && card ? `${card.name} ${card.isReversed ? 'Reversed' : 'Upright'}` : 'Tarot Card'}
      aria-pressed={isFlipped}
      tabIndex={!isRevealed && onReveal ? 0 : -1}
      data-testid="tarot-card"
    >
      <div 
        className={`absolute inset-0 w-full h-full transition-all duration-700 transform transform-style-preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''} ${isHovered ? 'scale-105' : ''} ${isClicked ? 'brightness-125' : ''}`}
        onClick={handleClick}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isRevealed && onReveal) {
            e.preventDefault();
            handleClick();
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={getCardPosition()}
      >
        {/* Card front */}
        <div className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl shadow-xl overflow-hidden ${card?.isReversed ? 'rotate-180' : ''}`}>
          {card && (
            <img 
              src={card.image} 
              alt={card.name} 
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        {/* Card back */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-purple-900 rounded-xl shadow-xl overflow-hidden border-2 border-purple-400">
          <img 
            src={cardBack} 
            alt="Tarot Card Back" 
            className="w-full h-full object-cover opacity-80" 
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-transparent to-indigo-900/50"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Position label */}
      {position && isFlipped && (
        <div className="absolute -bottom-6 left-0 right-0 text-center">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-900/70 text-white rounded-full">
            {position}
          </span>
        </div>
      )}
    </div>
  );
};

export default TarotCard;

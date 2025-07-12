import React from 'react';
import TarotCard from './TarotCard';
import type { TarotCard as TarotCardType } from '../utils/tarotCards';

interface TarotSpreadProps {
  cards: TarotCardType[];
  spreadType: string;
  isRevealed: boolean;
  onCardClick?: (index: number) => void;
}

const TarotSpread: React.FC<TarotSpreadProps> = ({ 
  cards, 
  spreadType, 
  isRevealed,
  onCardClick 
}) => {
  // Get position names for the spread
  const getPositionNames = (spreadType: string): string[] => {
    switch(spreadType) {
      case 'three-card':
        return ['Past', 'Present', 'Future'];
      case 'five-card':
        return ['Current Situation', 'Challenge', 'Foundation', 'Potential Future', 'Final Outcome'];
      case 'celtic-cross':
        return [
          'Current Situation', 'Challenge', 'Foundation', 'Past Influence', 
          'Potential Future', 'Upcoming Influence', 'Inner Self', 'External Influence', 
          'Hopes or Fears', 'Final Outcome'
        ];
      default:
        return [];
    }
  };

  const positions = getPositionNames(spreadType);
  
  // Get layout class for the spread type
  const getSpreadLayoutClass = (): string => {
    switch(spreadType) {
      case 'three-card':
        return 'flex flex-row justify-center items-center gap-4';
      case 'five-card':
        return 'grid grid-cols-5 gap-4 justify-items-center';
      case 'celtic-cross':
        return 'relative h-[600px] w-full';
      default:
        return 'flex flex-wrap justify-center';
    }
  };

  const renderCards = () => {
    if (spreadType === 'celtic-cross') {
      return (
        <div className="relative" style={{ width: '700px', height: '600px', margin: '0 auto' }}>
          {cards.map((card, index) => (
            <div 
              key={index}
              className="absolute transform"
              style={{
                // Celtic Cross specific positions
                ...(index === 0 && { top: '250px', left: '250px' }), // Center
                ...(index === 1 && { top: '250px', left: '250px' }), // Crossing card
                ...(index === 2 && { top: '250px', left: '100px' }), // Left
                ...(index === 3 && { top: '100px', left: '250px' }), // Above
                ...(index === 4 && { top: '250px', left: '400px' }), // Right
                ...(index === 5 && { top: '400px', left: '250px' }), // Below
                ...(index === 6 && { top: '50px', left: '500px' }), // Staff position 1
                ...(index === 7 && { top: '175px', left: '500px' }),
                ...(index === 8 && { top: '300px', left: '500px' }),
                ...(index === 9 && { top: '425px', left: '500px' })
              }}
            >
              <TarotCard 
                card={card} 
                position={positions[index]} 
                isRevealed={isRevealed}
                index={index}
                spreadType="celtic-cross"
              />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className={getSpreadLayoutClass()}>
        {cards.map((card, index) => (
          <TarotCard 
            key={index} 
            card={card} 
            position={positions[index]} 
            isRevealed={isRevealed}
            onReveal={() => onCardClick && onCardClick(index)}
            index={index}
            spreadType={spreadType}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="tarot-spread">
      {renderCards()}
      
      {/* Spread description */}
      {isRevealed && (
        <div className="mt-8 text-center">
          <h3 className="text-xl font-semibold text-purple-200 mb-2">
            {spreadType === 'three-card' && 'Three Card Spread - Past, Present, Future'}
            {spreadType === 'five-card' && 'Five Card Cross - Destiny Pathway'}
            {spreadType === 'celtic-cross' && 'Celtic Cross - Complete Life Guidance'}
          </h3>
          <p className="text-sm text-gray-300 max-w-2xl mx-auto">
            {spreadType === 'three-card' && 'This simple yet powerful spread shows the flow of time, revealing past influences, present state, and future possibilities.'}
            {spreadType === 'five-card' && 'The Destiny Cross reveals your current situation, challenges, and the origins and possible solutions to your question.'}
            {spreadType === 'celtic-cross' && 'The Celtic Cross is one of the most comprehensive tarot spreads, providing deep insights into your current circumstances, including obstacles, inner motivations, external influences, and potential outcomes.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TarotSpread;

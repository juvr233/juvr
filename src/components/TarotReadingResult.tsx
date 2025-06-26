import React, { useState } from 'react';
import type { TarotCard } from '../utils/tarotCards';

interface TarotReadingResultProps {
  cards: TarotCard[];
  spreadType: string;
  lifeArea: string;
}

const TarotReadingResult: React.FC<TarotReadingResultProps> = ({ 
  cards, 
  spreadType,
  lifeArea
}) => {
  const [activeCard, setActiveCard] = useState<number>(0);
  
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
  
  // Get life area description
  const getLifeAreaDescription = (area: string): string => {
    switch(area) {
      case 'love':
        return 'Love & Relationships';
      case 'career':
        return 'Career & Professional Life';
      case 'wealth':
        return 'Wealth & Abundance';
      case 'spiritual':
        return 'Spiritual Growth';
      case 'health':
        return 'Health & Vitality';
      default:
        return 'Your Life';
    }
  };

  // Generate custom interpretation based on card position and life area
  const getCustomInterpretation = (card: TarotCard, position: string, area: string): string => {
    // Generate specific interpretation based on card meaning, position and life area
    const upright = !card.isReversed;
    const areaText = getLifeAreaDescription(area);
    
    let baseText = upright ? card.meaning : card.reversedMeaning;
    
    // Add interpretation based on position
    switch(position) {
      case 'Past':
        return `In your past ${areaText.toLowerCase()}, ${baseText} has influenced you. This may reflect your previous experiences and foundation.`;
      case 'Present':
        return `In your current ${areaText.toLowerCase()}, ${baseText} is influencing you. Notice how this energy manifests in your life.`;
      case 'Future':
        return `In your future trajectory of ${areaText.toLowerCase()}, ${baseText} will manifest. This indicates possible developments, but remember the future can always be shaped by your present actions.`;
      case 'Current Situation':
        return `In your current ${areaText.toLowerCase()} situation, ${baseText} is at play. This describes your present environment and state.`;
      case 'Challenge':
        return `The challenge you face in your ${areaText.toLowerCase()} is: ${baseText}. Understanding this can help you overcome obstacles.`;
      default:
        return `Regarding the ${position.toLowerCase()} in your ${areaText.toLowerCase()}: ${baseText}`;
    }
  };

  return (
    <div className="mt-12 p-6 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl backdrop-blur-sm border border-purple-500/20">
      <h2 className="text-2xl font-bold text-center text-purple-100 mb-6">
        Tarot Reading: {getLifeAreaDescription(lifeArea)}
      </h2>
      
      {/* Card Selector */}
      <div className="flex justify-center mb-8 overflow-x-auto pb-4 max-w-full gap-2">
        {cards.map((card, idx) => (
          <div 
            key={idx}
            className={`relative cursor-pointer transition-all ${activeCard === idx ? 'scale-110 -translate-y-2' : 'opacity-70 hover:opacity-100'}`}
            onClick={() => setActiveCard(idx)}
          >
            <img 
              src={card.image} 
              alt={card.name}
              className={`w-20 h-32 object-cover rounded-lg border-2 ${activeCard === idx ? 'border-purple-400' : 'border-transparent'} ${card.isReversed ? 'rotate-180' : ''}`}
            />
            {positions[idx] && (
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-purple-900 text-xs px-2 py-0.5 rounded-full text-white whitespace-nowrap">
                {positions[idx]}
              </span>
            )}
          </div>
        ))}
      </div>
      
      {/* Current card detailed interpretation */}
      {cards[activeCard] && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Card image and basic info */}
          <div className="flex flex-col items-center">
            <div className="w-64 h-96 rounded-xl overflow-hidden shadow-2xl border-2 border-purple-600/50 mb-4">
              <img 
                src={cards[activeCard].image} 
                alt={cards[activeCard].name}
                className={`w-full h-full object-cover ${cards[activeCard].isReversed ? 'rotate-180' : ''}`}
              />
            </div>
            <h3 className="text-xl font-bold text-white mt-2">
              {cards[activeCard].name}
              {cards[activeCard].isReversed && <span className="text-red-400 ml-2">(Reversed)</span>}
            </h3>
            <p className="text-sm text-purple-300 font-medium">
              {cards[activeCard].suit}
            </p>
          </div>
          
          {/* Right: Detailed interpretation */}
          <div className="space-y-4">
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-purple-200 mb-2 flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                Position Interpretation: {positions[activeCard]}
              </h4>
              <p className="text-gray-200 text-sm leading-relaxed">
                {getCustomInterpretation(cards[activeCard], positions[activeCard], lifeArea)}
              </p>
            </div>
            
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-purple-200 mb-2 flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                Card Symbolism
              </h4>
              <p className="text-gray-200 text-sm leading-relaxed">
                {cards[activeCard].isReversed ? cards[activeCard].reversedMeaning : cards[activeCard].meaning}
              </p>
            </div>
            
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-purple-200 mb-2 flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                Recommended Actions
              </h4>
              <p className="text-gray-200 text-sm leading-relaxed">
                {cards[activeCard].isReversed ? 
                  `Face obstacles and find balance. The reversed ${cards[activeCard].name} reminds you to listen more to your inner voice and try new approaches to overcome current challenges.` :
                  `Use your strengths and realize your potential. The upright ${cards[activeCard].name} encourages you to embrace its positive energy and believe in your ability to create positive change.`
                }
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Overall interpretation */}
      <div className="mt-12 bg-gradient-to-br from-purple-800/20 to-indigo-800/20 rounded-lg p-6 border border-purple-500/20">
        <h3 className="text-xl font-bold text-center text-purple-100 mb-4">Overall Reading</h3>
        <p className="text-gray-200 leading-relaxed">
          This {spreadType === 'three-card' ? 'Three Card Spread' : spreadType === 'five-card' ? 'Five Card Spread' : 'Celtic Cross'} reveals your situation in the area of {getLifeAreaDescription(lifeArea).toLowerCase()}.
          {spreadType === 'three-card' && cards.length >= 3 && `
            The ${cards[0].name}${cards[0].isReversed ? ' (Reversed)' : ''} in your past and the ${cards[1].name}${cards[1].isReversed ? ' (Reversed)' : ''} in your present form a ${cards[0].isReversed === cards[1].isReversed ? 'continuation' : 'transition'} pattern,
            while the ${cards[2].name}${cards[2].isReversed ? ' (Reversed)' : ''} in your future indicates ${cards[2].isReversed ? 'challenges you need to overcome' : 'potential positive developments'}.
          `}
          {spreadType === 'five-card' && cards.length >= 5 && `
            Your current situation is represented by the ${cards[0].name}${cards[0].isReversed ? ' (Reversed)' : ''}, and your challenge is the ${cards[1].name}${cards[1].isReversed ? ' (Reversed)' : ''}.
            The ${cards[2].name}${cards[2].isReversed ? ' (Reversed)' : ''} shows what influences you from the past, while the ${cards[3].name}${cards[3].isReversed ? ' (Reversed)' : ''} and ${cards[4].name}${cards[4].isReversed ? ' (Reversed)' : ''}
            indicate your potential future and final outcome respectively.
          `}
          Remember, tarot shows possibilities and potential - you always have the power to shape your own destiny.
        </p>
      </div>
      
      {/* Save and share */}
      <div className="mt-8 flex justify-center gap-4">
        <button className="px-6 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-full transition-colors flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Save Reading
        </button>
        <button className="px-6 py-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded-full transition-colors flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share Results
        </button>
      </div>
    </div>
  );
};

export default TarotReadingResult;

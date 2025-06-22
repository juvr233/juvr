import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, RotateCcw, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { AUTHENTIC_RWS_DECK, shuffleDeck, getDetailedInterpretation, type TarotCard } from '../utils/tarotCards';
import SoulChronicleLogin from '../components/SoulChronicleLogin';

interface ReadingState {
  phase: 'welcome' | 'question' | 'shuffling' | 'shuffled' | 'drawing' | 'drawn' | 'login' | 'analysis';
  selectedArea: string;
  shuffledDeck: TarotCard[];
  drawnCards: TarotCard[];
  cardCount: number;
  isRevealed: boolean;
  userSacredName?: string;
}

const LIFE_AREAS = [
  { 
    key: 'love', 
    title: 'The Labyrinth of Love', 
    description: 'Matters of the heart, relationships, and emotional connections',
    mysticalDesc: 'Navigate the intricate pathways of romance, passion, and soul connections'
  },
  { 
    key: 'career', 
    title: 'The Future of Career', 
    description: 'Professional path, ambitions, and life purpose',
    mysticalDesc: 'Illuminate your professional destiny and discover your true calling'
  },
  { 
    key: 'wealth', 
    title: 'The Ups and Downs of Wealth', 
    description: 'Financial matters, abundance, and material security',
    mysticalDesc: 'Explore the ebb and flow of prosperity and material abundance'
  },
  { 
    key: 'spiritual', 
    title: 'The Journey of Spirit', 
    description: 'Personal growth, spirituality, and inner wisdom',
    mysticalDesc: 'Delve into the depths of your soul and spiritual evolution'
  },
  { 
    key: 'health', 
    title: 'The Temple of Health', 
    description: 'Physical wellbeing, vitality, and life energy',
    mysticalDesc: 'Understand the sacred vessel of your physical being and vitality'
  }
];

export default function TarotPage() {
  const [searchParams] = useSearchParams();
  const cardCount = parseInt(searchParams.get('cards') || '3');
  
  const [readingState, setReadingState] = useState<ReadingState>({
    phase: 'welcome',
    selectedArea: '',
    shuffledDeck: [],
    drawnCards: [],
    cardCount: cardCount,
    isRevealed: false
  });

  const handleAreaSelection = (areaKey: string) => {
    const area = LIFE_AREAS.find(a => a.key === areaKey);
    if (!area) return;

    // MANDATORY: Enter shuffling ceremony phase first
    setReadingState(prev => ({ 
      ...prev, 
      selectedArea: areaKey, 
      phase: 'shuffling'
    }));

    // Start the sacred shuffling ceremony (4 seconds)
    setTimeout(() => {
      // Background: Execute real shuffling algorithm during ceremony
      const shuffled = shuffleDeck();
      setReadingState(prev => ({ 
        ...prev, 
        shuffledDeck: shuffled,
        phase: 'shuffled' // NEW PHASE: Shuffled and ready for user to proceed
      }));
    }, 4000); // 4 second sacred ceremony
  };

  // NEW: Manual transition from shuffled to drawing phase
  const proceedToDrawing = () => {
    setReadingState(prev => ({ 
      ...prev, 
      phase: 'drawing'
    }));
  };

  const handleCardClick = (cardIndex: number) => {
    if (readingState.drawnCards.length >= readingState.cardCount) return;
    
    const selectedCard = readingState.shuffledDeck[cardIndex];
    const newDrawnCards = [...readingState.drawnCards, selectedCard];
    
    setReadingState(prev => ({ 
      ...prev, 
      drawnCards: newDrawnCards
    }));

    // NEW: If all cards are drawn, enter "drawn" phase instead of analysis
    if (newDrawnCards.length === readingState.cardCount) {
      setTimeout(() => {
        setReadingState(prev => ({ 
          ...prev, 
          phase: 'drawn' // NEW PHASE: Cards drawn, waiting for manual confirmation
        }));
      }, 500); // Minimal delay for smooth transition
    }
  };

  // NEW: Manual transition from drawn to LOGIN phase (before analysis)
  const proceedToReveal = () => {
    setReadingState(prev => ({ 
      ...prev, 
      phase: 'login' // NEW: Login required before analysis
    }));
  };

  // Handle successful login/registration
  const handleLoginSuccess = (userData: { sacredName: string; isReturning: boolean }) => {
    setReadingState(prev => ({ 
      ...prev, 
      phase: 'analysis',
      isRevealed: true,
      userSacredName: userData.sacredName
    }));
  };

  // Handle login cancellation
  const handleLoginCancel = () => {
    setReadingState(prev => ({ 
      ...prev, 
      phase: 'drawn' // Return to drawn phase
    }));
  };

  const getSpreadPositions = () => {
    if (readingState.cardCount === 3) {
      return ['Past', 'Present', 'Future'];
    } else if (readingState.cardCount === 5) {
      return ['Situation', 'Challenge', 'Past', 'Future', 'Outcome'];
    }
    return [];
  };

  const resetReading = () => {
    setReadingState({
      phase: 'welcome',
      selectedArea: '',
      shuffledDeck: [],
      drawnCards: [],
      cardCount: cardCount,
      isRevealed: false
    });
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-[#101118] via-[#101118] to-[#101118]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Mystical Header */}
        <div className="text-center mb-12">
          <div className="relative">
            <div className="bg-gradient-to-r from-[#8A2BE2]/30 to-[#8A2BE2]/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Sparkles className="h-12 w-12 text-[#8A2BE2] animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div className="absolute inset-0 bg-[#8A2BE2]/5 rounded-full blur-xl"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#FFFFFF] mb-4 tracking-wide">
            Sacred Tarot Divination
          </h1>
          <p className="text-xl text-[#A0A0A0] italic font-light mb-2">
            "The cards speak to those who listen with their hearts"
          </p>
          <p className="text-sm text-[#A0A0A0] italic">
            Authentic Rider-Waite-Smith Deck • {cardCount} Card Reading
          </p>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#8A2BE2] to-transparent mx-auto mt-6"></div>
        </div>

        {/* Main Sacred Reading Chamber */}
        <div className="bg-gradient-to-br from-[#22232E]/90 to-[#101118]/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-[#8A2BE2]/30 shadow-2xl relative overflow-hidden">
          
          {/* Mystical Background Effects */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#8A2BE2] rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#FF00FF] rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          {/* Welcome Phase - Mystical Greeting & Life Area Selection */}
          {readingState.phase === 'welcome' && (
            <div className="relative z-10 space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[#FFFFFF] mb-6 tracking-wide">
                  Welcome, Sacred Seeker
                </h2>
                <div className="max-w-4xl mx-auto space-y-6">
                  <p className="text-[#A0A0A0] text-xl leading-relaxed italic">
                    "Calm your mind and take a deep breath. Feel the ancient energy of the Rider-Waite-Smith cards 
                    calling to your spirit. The universe has guided you here for a reason."
                  </p>
                  <p className="text-[#FFFFFF] text-lg leading-relaxed">
                    I am here to serve as your guide through the mystical realm of tarot wisdom. 
                    The cards hold profound insights waiting to illuminate your path forward.
                  </p>
                  <p className="text-[#A0A0A0] text-lg leading-relaxed font-medium">
                    When you are ready, dear soul, please tell me which sacred realm of your life 
                    calls for divine guidance today...
                  </p>
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-[#8A2BE2] text-center mb-8 tracking-wide">
                Choose Your Sacred Path of Inquiry
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {LIFE_AREAS.map((area) => (
                  <button
                    key={area.key}
                    onClick={() => handleAreaSelection(area.key)}
                    className="bg-[#101118]/70 hover:bg-[#8A2BE2]/20 border border-[#8A2BE2]/30 hover:border-[#8A2BE2]/60 rounded-2xl p-8 text-left transition-all duration-500 group transform hover:scale-105 hover:shadow-xl"
                  >
                    <h4 className="text-xl font-bold text-[#FFFFFF] mb-3 group-hover:text-[#8A2BE2] transition-colors">
                      {area.title}
                    </h4>
                    <p className="text-[#A0A0A0] text-sm mb-3 leading-relaxed">
                      {area.description}
                    </p>
                    <p className="text-[#A0A0A0] text-xs italic leading-relaxed">
                      {area.mysticalDesc}
                    </p>
                  </button>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <p className="text-[#A0A0A0] italic text-sm max-w-2xl mx-auto">
                  "Trust your intuition, beloved seeker. Your heart knows which path calls to you most strongly. 
                  The cards are already aligning to reveal the wisdom you need."
                </p>
              </div>
            </div>
          )}

          {/* PHASE 2: SHUFFLING CEREMONY - MANDATORY TRANSITION PHASE */}
          {readingState.phase === 'shuffling' && (
            <div className="relative z-10 text-center">
              <div className="max-w-4xl mx-auto space-y-8">
                <h2 className="text-4xl font-bold text-[#8A2BE2] mb-8 tracking-wide">
                  Sacred Shuffling Ceremony
                </h2>
                
                {/* Mystical Shuffling Animation */}
                <div className="relative mb-12">
                  <div className="flex justify-center items-center space-x-4 mb-8">
                    {/* Swirling Card Animation */}
                    <div className="relative w-64 h-64">
                      {/* Central Vortex */}
                      <div className="absolute inset-0 rounded-full border-4 border-[#8A2BE2]/30 animate-spin" style={{ animationDuration: '3s' }}></div>
                      <div className="absolute inset-4 rounded-full border-2 border-[#8A2BE2]/50 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
                      <div className="absolute inset-8 rounded-full border border-[#8A2BE2]/70 animate-spin" style={{ animationDuration: '1.5s' }}></div>
                      
                      {/* Floating Cards in Vortex */}
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-8 h-12 bg-gradient-to-br from-[#22232E] to-[#101118] rounded border border-[#8A2BE2]/40 flex items-center justify-center text-xs text-[#8A2BE2] animate-pulse"
                          style={{
                            top: `${50 + 35 * Math.cos((i * Math.PI * 2) / 8)}%`,
                            left: `${50 + 35 * Math.sin((i * Math.PI * 2) / 8)}%`,
                            transform: 'translate(-50%, -50%)',
                            animationDelay: `${i * 0.2}s`,
                            animationDuration: '2s'
                          }}
                        >
                          🔮
                        </div>
                      ))}
                      
                      {/* Central Energy Core */}
                      <div className="absolute inset-1/3 bg-gradient-to-br from-[#8A2BE2]/30 to-[#8A2BE2]/10 rounded-full flex items-center justify-center">
                        <Sparkles className="h-12 w-12 text-[#8A2BE2] animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {/* Energy Particles */}
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-[#8A2BE2] rounded-full animate-ping"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${1 + Math.random()}s`
                        }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Sacred Dialogue Script */}
                <div className="space-y-6">
                  <p className="text-[#FFFFFF] text-2xl leading-relaxed italic">
                    "Very good, we have locked our focus on your{' '}
                    <span className="text-[#8A2BE2] font-bold">
                      {LIFE_AREAS.find(a => a.key === readingState.selectedArea)?.title}
                    </span>."
                  </p>
                  
                  <p className="text-[#A0A0A0] text-xl leading-relaxed">
                    "Now, please maintain this focus."
                  </p>
                  
                  <p className="text-[#FFFFFF] text-lg leading-relaxed max-w-3xl mx-auto">
                    "I will start the card array for you. This is not only a shuffle, but also a sacred ritual - 
                    it will inject your thoughts, your confusion, and your expectations into these 78 cards."
                  </p>
                  
                  <p className="text-[#A0A0A0] text-xl italic leading-relaxed">
                    "Feel the flow of this energy... Every card is resonating with you at this moment, 
                    ready to reveal the deepest insights for you."
                  </p>
                </div>

                {/* Sacred Progress Indicator */}
                <div className="mt-12">
                  <div className="bg-[#101118]/50 rounded-2xl p-6 border border-[#8A2BE2]/20">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#8A2BE2] border-t-transparent"></div>
                      <span className="text-[#8A2BE2] font-medium">Sacred Energy Infusion in Progress...</span>
                    </div>
                    <div className="w-full bg-[#101118] rounded-full h-2">
                      <div className="bg-gradient-to-r from-[#8A2BE2] to-[#FF00FF] h-2 rounded-full animate-pulse" style={{ width: '100%', animation: 'pulse 1s ease-in-out infinite' }}></div>
                    </div>
                    <p className="text-[#A0A0A0] text-sm mt-3 italic text-center">
                      "The 78 sacred cards are aligning with your spiritual energy..."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NEW PHASE: SHUFFLED - Cards ready, waiting for user to proceed */}
          {readingState.phase === 'shuffled' && (
            <div className="relative z-10 text-center">
              <div className="max-w-4xl mx-auto space-y-8">
                <h2 className="text-4xl font-bold text-[#8A2BE2] mb-8 tracking-wide">
                  The Sacred Deck is Ready
                </h2>
                
                {/* Completion Animation */}
                <div className="relative mb-12">
                  <div className="flex justify-center items-center mb-8">
                    <div className="relative w-48 h-48">
                      {/* Completed Energy Circle */}
                      <div className="absolute inset-0 rounded-full border-4 border-[#8A2BE2]/60 animate-pulse"></div>
                      <div className="absolute inset-4 rounded-full border-2 border-[#8A2BE2]/80 animate-pulse delay-300"></div>
                      
                      {/* Central Deck Representation */}
                      <div className="absolute inset-1/4 bg-gradient-to-br from-[#8A2BE2]/40 to-[#8A2BE2]/20 rounded-2xl flex items-center justify-center border border-[#8A2BE2]/50">
                        <div className="text-center">
                          <div className="text-6xl text-[#8A2BE2] mb-2">🔮</div>
                          <div className="text-sm text-[#8A2BE2] font-bold">78 Cards</div>
                          <div className="text-xs text-[#A0A0A0]">Ready</div>
                        </div>
                      </div>
                      
                      {/* Success Sparkles */}
                      <div className="absolute inset-0">
                        {[...Array(12)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-3 h-3 text-[#8A2BE2] animate-ping"
                            style={{
                              top: `${20 + Math.random() * 60}%`,
                              left: `${20 + Math.random() * 60}%`,
                              animationDelay: `${Math.random() * 2}s`,
                              animationDuration: `${1.5 + Math.random()}s`
                            }}
                          >
                            ✨
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sacred Completion Message */}
                <div className="space-y-6">
                  <p className="text-[#FFFFFF] text-2xl leading-relaxed italic">
                    "Perfect! The sacred shuffling ceremony is complete."
                  </p>
                  
                  <p className="text-[#A0A0A0] text-xl leading-relaxed">
                    "The 78 cards of the Rider-Waite-Smith deck have been infused with your energy 
                    and aligned with your inquiry about{' '}
                    <span className="text-[#FFFFFF] font-semibold">
                      {LIFE_AREAS.find(a => a.key === readingState.selectedArea)?.title}
                    </span>."
                  </p>
                  
                  <p className="text-[#FFFFFF] text-lg leading-relaxed max-w-3xl mx-auto">
                    "The cards now hold the sacred vibration of your question. They are ready to reveal 
                    the ancient wisdom that will guide you on your path."
                  </p>
                  
                  <p className="text-[#A0A0A0] text-lg italic leading-relaxed">
                    "When you feel ready to receive the universe's guidance, we shall proceed to the selection ritual."
                  </p>
                </div>

                {/* Manual Proceed Button */}
                <div className="mt-12">
                  <div className="bg-[#101118]/50 rounded-2xl p-8 border border-[#8A2BE2]/20">
                    <div className="mb-6">
                      <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="w-4 h-4 bg-[#8A2BE2] rounded-full animate-pulse"></div>
                        <span className="text-[#8A2BE2] font-medium">Sacred Deck Prepared</span>
                        <div className="w-4 h-4 bg-[#8A2BE2] rounded-full animate-pulse delay-500"></div>
                      </div>
                      <p className="text-[#A0A0A0] text-sm italic">
                        "The cards await your sacred touch. Take a moment to center yourself, 
                        then proceed when your spirit feels aligned."
                      </p>
                    </div>
                    
                    <button
                      onClick={proceedToDrawing}
                      className="bg-[#8A2BE2] text-[#FFFFFF] px-12 py-4 rounded-2xl font-bold text-xl hover:bg-[#FF00FF] transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto"
                    >
                      <span>Proceed to Card Selection</span>
                      <ArrowRight className="h-6 w-6" />
                    </button>
                    
                    <p className="text-[#A0A0A0] text-xs mt-4 italic">
                      "Trust in the divine timing. The right moment to proceed will feel natural to your soul."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PHASE 3: THE RITUAL OF SELECTION - Card Drawing Phase */}
          {readingState.phase === 'drawing' && (
            <div className="relative z-10">
              <div className="text-center mb-12">
                <h3 className="text-4xl font-bold text-[#8A2BE2] mb-6 tracking-wide">
                  The Sacred Deck Awaits Your Touch
                </h3>
                <div className="max-w-4xl mx-auto space-y-4">
                  <p className="text-[#FFFFFF] text-xl leading-relaxed">
                    "Perfect. The cards are ready for you. The sacred shuffling has infused them with your energy 
                    and aligned them with your inquiry about{' '}
                    <span className="text-[#8A2BE2] font-semibold italic">
                      {LIFE_AREAS.find(a => a.key === readingState.selectedArea)?.title}
                    </span>."
                  </p>
                  <p className="text-[#A0A0A0] text-lg italic leading-relaxed">
                    "Now, follow your intuition and choose the {readingState.cardCount} cards 
                    that call to your spirit. Trust the wisdom of your inner voice."
                  </p>
                  <p className="text-[#FFFFFF]/80 text-base">
                    The right cards will draw you to them like magnets to your soul.
                  </p>
                </div>
                
                <div className="mt-8 p-4 bg-[#101118]/50 rounded-xl border border-[#8A2BE2]/20">
                  <p className="text-[#8A2BE2] font-medium">
                    Cards Selected: {readingState.drawnCards.length} / {readingState.cardCount}
                  </p>
                  <p className="text-[#A0A0A0] text-sm italic mt-1">
                    Authentic Rider-Waite-Smith Tarot • 78 Sacred Cards • Listen to Your Heart
                  </p>
                </div>
              </div>
              
              {/* 78 Card Grid - UNIFIED CARD BACKS ONLY */}
              <div className="grid grid-cols-6 md:grid-cols-10 lg:grid-cols-13 gap-3 mb-8">
                {readingState.shuffledDeck.map((card, index) => {
                  const isSelected = readingState.drawnCards.some(drawn => drawn.id === card.id);
                  const canSelect = readingState.drawnCards.length < readingState.cardCount && !isSelected;
                  
                  return (
                    <div
                      key={`${card.id}-${index}`}
                      onClick={() => canSelect && handleCardClick(index)}
                      className={`relative w-16 h-24 md:w-20 md:h-28 rounded-lg border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                        isSelected 
                          ? 'border-[#8A2BE2] bg-[#8A2BE2]/20 scale-110 shadow-lg' 
                          : canSelect
                            ? 'border-[#8A2BE2]/30 bg-[#101118] hover:border-[#8A2BE2]/60 hover:scale-105 hover:shadow-md'
                            : 'border-[#8A2BE2]/10 bg-[#101118]/50 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      {/* UNIFIED CARD BACK - NO FRONT IMAGES REVEALED */}
                      <div className="w-full h-full bg-gradient-to-br from-[#22232E] to-[#101118] flex items-center justify-center border border-[#8A2BE2]/20 rounded-md relative">
                        <div className="text-center">
                          <div className="text-2xl md:text-3xl text-[#8A2BE2] mb-1">🔮</div>
                          <div className="text-xs text-[#A0A0A0] font-bold">RWS</div>
                        </div>
                        
                        {/* Selection indicator only */}
                        {isSelected && (
                          <div className="absolute bottom-1 right-1 bg-[#8A2BE2] text-[#FFFFFF] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                            {readingState.drawnCards.findIndex(drawn => drawn.id === card.id) + 1}
                          </div>
                        )}
                        
                        {/* Mystical glow for selected cards */}
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#8A2BE2]/20 rounded-md animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selection Progress - NO CARD FRONTS SHOWN */}
              {readingState.drawnCards.length > 0 && (
                <div className="bg-[#101118]/50 rounded-2xl p-6 border border-[#8A2BE2]/20">
                  <h4 className="text-lg font-bold text-[#8A2BE2] mb-4 text-center italic">
                    "Your Sacred Selection Unfolds..."
                  </h4>
                  <div className="flex justify-center gap-4 flex-wrap">
                    {readingState.drawnCards.map((card, index) => (
                      <div key={card.id} className="text-center">
                        {/* CARD BACKS ONLY - NO FRONTS */}
                        <div className="w-20 h-28 bg-gradient-to-br from-[#22232E] to-[#101118] rounded-lg border border-[#8A2BE2]/30 overflow-hidden mb-2 relative flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl text-[#8A2BE2] mb-1">🔮</div>
                            <div className="text-xs text-[#A0A0A0] font-bold">RWS</div>
                          </div>
                          <div className="absolute bottom-1 right-1 bg-[#8A2BE2] text-[#FFFFFF] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                        </div>
                        <div className="text-xs text-[#8A2BE2] font-medium">
                          {getSpreadPositions()[index]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* NEW PHASE: DRAWN - Cards selected, mystical confirmation needed */}
          {readingState.phase === 'drawn' && (
            <div className="relative z-10 text-center">
              <div className="max-w-4xl mx-auto space-y-8">
                <h2 className="text-4xl font-bold text-[#8A2BE2] mb-8 tracking-wide">
                  The Sacred Contract Awaits
                </h2>
                
                {/* Mystical Card Display */}
                <div className="relative mb-12">
                  <div className="flex justify-center gap-6 flex-wrap mb-8">
                    {readingState.drawnCards.map((card, index) => (
                      <div key={card.id} className="text-center">
                        <div className="mb-3">
                          <span className="bg-[#8A2BE2]/20 text-[#8A2BE2] px-3 py-1 rounded-full text-sm font-semibold">
                            {getSpreadPositions()[index]}
                          </span>
                        </div>
                        <div className="relative w-24 h-36 bg-gradient-to-br from-[#22232E] to-[#101118] rounded-xl border-2 border-[#8A2BE2]/40 overflow-hidden flex items-center justify-center animate-pulse">
                          <div className="text-center">
                            <div className="text-4xl text-[#8A2BE2] mb-2">🔮</div>
                            <div className="text-xs text-[#A0A0A0] font-bold">RWS</div>
                          </div>
                          <div className="absolute bottom-1 right-1 bg-[#8A2BE2] text-[#FFFFFF] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          {/* Mystical energy aura */}
                          <div className="absolute inset-0 bg-[#8A2BE2]/10 rounded-xl animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Energy Particles around selected cards */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 text-[#8A2BE2] animate-ping"
                        style={{
                          top: `${20 + Math.random() * 60}%`,
                          left: `${20 + Math.random() * 60}%`,
                          animationDelay: `${Math.random() * 3}s`,
                          animationDuration: `${1.5 + Math.random()}s`
                        }}
                      >
                        ✨
                      </div>
                    ))}
                  </div>
                </div>

                {/* MYSTICAL SECRET LANGUAGE - Tarot Master's Confirmation */}
                <div className="space-y-8">
                  <div className="bg-[#101118]/70 rounded-2xl p-8 border border-[#8A2BE2]/30">
                    <h3 className="text-2xl font-bold text-[#8A2BE2] mb-6 italic">
                      The Sacred Calling Has Been Answered
                    </h3>
                    
                    <div className="space-y-6 text-center">
                      <p className="text-[#FFFFFF] text-xl leading-relaxed italic">
                        "You have answered its call. These cards have chosen you."
                      </p>
                      
                      <p className="text-[#A0A0A0] text-lg leading-relaxed">
                        "I can feel the ancient energy pulsing between you and these sacred symbols. 
                        The connection has been forged, dear soul."
                      </p>
                      
                      <p className="text-[#FFFFFF] text-lg leading-relaxed max-w-3xl mx-auto">
                        "Now, make your final confirmation. Bring them into the light with your own hands 
                        and place them on the altar of fate."
                      </p>
                      
                      <p className="text-[#A0A0A0] text-xl italic leading-relaxed font-semibold">
                        "This is the contract you made with them."
                      </p>
                    </div>
                  </div>

                  {/* Sacred Confirmation Details */}
                  <div className="bg-gradient-to-br from-[#8A2BE2]/10 to-[#8A2BE2]/5 rounded-2xl p-6 border border-[#8A2BE2]/20">
                    <div className="text-center space-y-4">
                      <h4 className="text-lg font-bold text-[#8A2BE2] italic">
                        "The Moment of Sacred Revelation Awaits"
                      </h4>
                      <p className="text-[#FFFFFF]/90 leading-relaxed">
                        Your {readingState.cardCount} chosen cards hold the wisdom of the Rider-Waite-Smith tradition, 
                        ready to illuminate your path regarding{' '}
                        <span className="text-[#8A2BE2] font-semibold">
                          {LIFE_AREAS.find(a => a.key === readingState.selectedArea)?.title}
                        </span>.
                      </p>
                      <p className="text-[#A0A0A0] text-sm italic">
                        "When you are ready to witness their sacred faces and receive their ancient messages, 
                        seal this mystical contract with your conscious choice."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Manual Confirmation Button */}
                <div className="mt-12">
                  <div className="bg-[#101118]/50 rounded-2xl p-8 border border-[#8A2BE2]/20">
                    <div className="mb-6">
                      <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="w-4 h-4 bg-[#8A2BE2] rounded-full animate-pulse"></div>
                        <span className="text-[#8A2BE2] font-medium">Sacred Contract Ready</span>
                        <div className="w-4 h-4 bg-[#8A2BE2] rounded-full animate-pulse delay-500"></div>
                      </div>
                      <p className="text-[#A0A0A0] text-sm italic">
                        "The cards await your final confirmation. When you are ready to receive their wisdom, 
                        complete the sacred ritual."
                      </p>
                    </div>
                    
                    <button
                      onClick={proceedToReveal}
                      className="bg-gradient-to-r from-[#8A2BE2] to-[#FF00FF] text-[#FFFFFF] px-12 py-4 rounded-2xl font-bold text-xl hover:from-[#FF00FF] hover:to-[#8A2BE2] transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto shadow-lg"
                    >
                      <span>Reveal the Sacred Wisdom</span>
                      <ArrowRight className="h-6 w-6" />
                    </button>
                    
                    <p className="text-[#A0A0A0] text-xs mt-4 italic">
                      "Trust in the divine timing. The universe has prepared this moment especially for you."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PHASE 4: Analysis Phase - FIRST TIME CARD FRONTS ARE REVEALED */}
          {readingState.phase === 'analysis' && readingState.isRevealed && (
            <div className="relative z-10">
              <div className="text-center mb-12">
                <h3 className="text-4xl font-bold text-[#8A2BE2] mb-6 tracking-wide">
                  The Sacred Revelation
                </h3>
                <div className="max-w-4xl mx-auto space-y-4">
                  <p className="text-[#FFFFFF] text-xl leading-relaxed italic">
                    "Behold, {readingState.userSacredName ? `dear ${readingState.userSacredName}` : 'dear soul'}, 
                    the ancient wisdom of the Rider-Waite-Smith cards reveals itself to you. 
                    Each card carries a sacred message about your{' '}
                    <span className="text-[#8A2BE2] font-semibold">
                      {LIFE_AREAS.find(a => a.key === readingState.selectedArea)?.title}
                    </span>."
                  </p>
                  <p className="text-[#A0A0A0] text-base">
                    "Listen with your heart as I interpret the divine messages the universe has chosen for you."
                  </p>
                </div>
              </div>

              {/* FIRST TIME CARD FRONTS ARE SHOWN - With Flip Animation */}
              <div className={`grid gap-8 mb-12 ${
                readingState.cardCount === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5'
              }`}>
                {readingState.drawnCards.map((card, index) => {
                  const position = getSpreadPositions()[index];
                  return (
                    <div key={card.id} className="text-center">
                      {/* Position Label */}
                      <div className="mb-4">
                        <span className="bg-[#8A2BE2]/20 text-[#8A2BE2] px-4 py-2 rounded-full text-sm font-semibold">
                          {position}
                        </span>
                      </div>
                      
                      {/* FLIP ANIMATION - Card Back to Front */}
                      <div className="perspective-1000">
                        <div className="relative w-48 h-72 mx-auto transform-style-preserve-3d transition-transform duration-1000 rotate-y-180">
                          {/* Card Back */}
                          <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#22232E] to-[#101118] rounded-2xl border border-[#8A2BE2]/20 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-6xl text-[#8A2BE2] mb-4">🔮</div>
                              <div className="text-lg text-[#A0A0A0] font-bold">RWS</div>
                            </div>
                          </div>
                          
                          {/* Card Front - AUTHENTIC RWS IMAGE */}
                          <div className={`absolute inset-0 backface-hidden rotate-y-180 bg-[#22232E] rounded-2xl border border-[#8A2BE2]/20 overflow-hidden shadow-xl ${
                            card.isReversed ? 'transform rotate-180' : ''
                          }`}>
                            <img 
                              src={card.image} 
                              alt={card.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                            <div className="hidden w-full h-full bg-[#22232E] flex-col items-center justify-center p-6">
                              <h3 className="text-lg font-bold text-[#FFFFFF] mb-2 text-center">
                                {card.name}
                              </h3>
                              <p className="text-[#8A2BE2] text-sm text-center mb-2">{card.suit}</p>
                              {card.isReversed && (
                                <span className="bg-red-600/20 text-red-400 px-2 py-1 rounded text-xs">
                                  Reversed
                                </span>
                              )}
                            </div>
                            {/* Card name overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                              <h3 className="text-sm font-bold text-white text-center">
                                {card.name}
                              </h3>
                              {card.isReversed && (
                                <span className="block text-center text-xs text-red-400 mt-1">
                                  Reversed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Detailed Interpretations with Mystical Wisdom */}
              <div className="space-y-8">
                <h3 className="text-3xl font-bold text-[#FFFFFF] text-center mb-8 italic">
                  Sacred Interpretations from the Ancient Wisdom
                </h3>
                
                {readingState.drawnCards.map((card, index) => {
                  const position = getSpreadPositions()[index];
                  const detailedInterpretation = getDetailedInterpretation(card, position, readingState.selectedArea);
                  
                  return (
                    <div key={card.id} className="bg-[#101118]/70 rounded-2xl p-8 border border-[#8A2BE2]/20">
                      <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                        <div className="flex-shrink-0">
                          <div className="w-24 h-36 bg-[#22232E] rounded-xl border border-[#8A2BE2]/10 overflow-hidden relative">
                            <img 
                              src={card.image} 
                              alt={card.name}
                              className={`w-full h-full object-cover ${card.isReversed ? 'transform rotate-180' : ''}`}
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                            <div className="hidden w-full h-full bg-[#22232E] items-center justify-center text-center p-2">
                              <div className="text-xs text-[#8A2BE2] font-bold">{card.name}</div>
                            </div>
                            {card.isReversed && (
                              <div className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                                R
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-6">
                            <h3 className="text-2xl font-bold text-[#FFFFFF]">{card.name}</h3>
                            <span className="bg-[#8A2BE2]/20 text-[#8A2BE2] px-3 py-1 rounded-full text-sm">
                              {position}
                            </span>
                            {card.isReversed && (
                              <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm">
                                Reversed
                              </span>
                            )}
                            <span className="bg-[#22232E]/50 text-[#A0A0A0] px-2 py-1 rounded text-xs">
                              Authentic RWS
                            </span>
                          </div>
                          
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-lg font-semibold text-[#8A2BE2] mb-3 italic">
                                "The Sacred Message Speaks..."
                              </h4>
                              <p className="text-[#FFFFFF] leading-relaxed text-base">
                                {detailedInterpretation}
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="text-lg font-semibold text-[#8A2BE2] mb-3 italic">
                                {card.isReversed ? '"The Shadow Energy Reveals..."' : '"The Light Energy Illuminates..."'}
                              </h4>
                              <p className="text-[#FFFFFF] leading-relaxed text-base">
                                "{card.isReversed ? card.reversedMeaning : card.meaning}. 
                                This energy calls you to embrace its wisdom and integrate its lessons into your journey."
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sacred Blessing & Guidance */}
              <div className="text-center mt-12 p-8 bg-gradient-to-br from-[#101118]/70 to-[#22232E]/50 rounded-2xl border border-[#8A2BE2]/20">
                <h3 className="text-2xl font-bold text-[#8A2BE2] mb-6 italic">Sacred Blessing & Final Guidance</h3>
                <div className="max-w-3xl mx-auto space-y-4">
                  <p className="text-[#FFFFFF] italic leading-relaxed text-lg">
                    "The ancient wisdom of the Rider-Waite-Smith cards has spoken, {readingState.userSacredName ? `dear ${readingState.userSacredName}` : 'dear soul'}. 
                    These sacred symbols have revealed the energies surrounding your{' '}
                    <span className="text-[#8A2BE2] font-semibold">
                      {LIFE_AREAS.find(a => a.key === readingState.selectedArea)?.title}
                    </span>."
                  </p>
                  <p className="text-[#A0A0A0] leading-relaxed">
                    "Remember, beloved seeker, that you hold the power to shape your destiny through conscious choice 
                    and mindful action. The cards illuminate the path, but you must walk it with courage and wisdom."
                  </p>
                  <p className="text-[#FFFFFF]/80 italic text-base">
                    "May this reading serve as a guiding light on your journey. Trust in yourself, 
                    for the universe conspires to support those who listen to their hearts."
                  </p>
                  {readingState.userSacredName && (
                    <p className="text-[#A0A0A0] text-sm italic mt-6">
                      "This sacred reading has been recorded in your Soul Chronicle, {readingState.userSacredName}. 
                      Return anytime to continue your spiritual journey."
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-6 mt-12">
                <button
                  onClick={resetReading}
                  className="bg-[#101118]/80 border border-[#8A2BE2]/30 text-[#FFFFFF] px-8 py-4 rounded-xl hover:bg-[#101118] hover:border-[#8A2BE2]/60 transition-all duration-300 flex items-center space-x-3 font-medium"
                >
                  <RotateCcw className="h-5 w-5" />
                  <span>Begin New Sacred Reading</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sacred Footer Blessing */}
        <div className="text-center mt-12">
          <div className="w-48 h-px bg-gradient-to-r from-transparent via-[#8A2BE2] to-transparent mx-auto mb-6"></div>
          <p className="text-[#A0A0A0] italic text-sm leading-relaxed max-w-2xl mx-auto">
            "Remember, beloved soul, the future is not carved in stone, but shaped by the sacred choices you make in each precious moment. 
            You are the author of your destiny, guided by the timeless wisdom of the Rider-Waite-Smith tradition."
          </p>
        </div>
      </div>

      {/* Soul Chronicle Login Modal */}
      {readingState.phase === 'login' && (
        <SoulChronicleLogin
          onLoginSuccess={handleLoginSuccess}
          onCancel={handleLoginCancel}
        />
      )}
    </div>
  );
}
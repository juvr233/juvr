import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, ArrowRight, Music, VolumeX } from 'lucide-react';
import { shuffleDeck, type TarotCard, AUTHENTIC_RWS_DECK } from '../utils/tarotCards';
import { playSoundEffect, configureSoundEffects } from '../utils/helpers/soundEffects';
import { AUDIO_CONFIG } from '../config/audio';
import CardBack from '../components/CardBack';
import { useImagePreloader } from '../hooks/useImagePreloader';
import { PerformanceDetector } from '../config/performance';

interface ReadingState {
  phase: 'welcome' | 'question' | 'shuffling' | 'shuffled' | 'drawing' | 'drawn' | 'login' | 'analysis';
  selectedArea: string;
  shuffledDeck: TarotCard[];
  drawnCards: TarotCard[];
  cardCount: number;
  isRevealed: boolean;
  userSacredName?: string;
  spreadType: 'three-card' | 'five-card' | 'celtic-cross';
  hasBackgroundMusic: boolean;
}

const LIFE_AREAS = [
  { 
    key: 'love', 
    title: 'Labyrinth of Love', 
    description: 'Matters of the heart, relationships and emotional connections',
    mysticalDesc: 'Explore the complex paths of love, passion and soul connections'
  },
  { 
    key: 'career', 
    title: 'Future of Career', 
    description: 'Professional path, ambitions and life goals',
    mysticalDesc: 'Illuminate your career destiny and discover your true calling'
  },
  { 
    key: 'wealth', 
    title: 'Ripples of Wealth', 
    description: 'Financial matters, abundance and material security',
    mysticalDesc: 'Explore the ebb and flow of prosperity and material abundance'
  },
  { 
    key: 'spiritual', 
    title: 'Spiritual Journey', 
    description: 'Personal growth, inner wisdom and spiritual awareness',
    mysticalDesc: 'Explore the depths of your soul and spiritual evolution'
  },
  { 
    key: 'health', 
    title: 'Temple of Health', 
    description: 'Physical wellbeing, vitality and life energy',
    mysticalDesc: 'Understand the mysteries of your sacred vessel and vitality'
  }
];

const SPREAD_TYPES = [
  {
    key: 'three-card',
    name: 'Three Card Spread',
    description: 'Simple yet powerful insights into past, present and future',
    cardCount: 3,
  },
  {
    key: 'five-card',
    name: 'Five Card Cross',
    description: 'Deeper understanding of current situation, challenges and possible outcomes',
    cardCount: 5,
  },
  {
    key: 'celtic-cross',
    name: 'Celtic Cross',
    description: 'Most comprehensive tarot spread, offering deep life guidance',
    cardCount: 10,
  }
];

export default function TarotPage() {
  const [searchParams] = useSearchParams();
  const initialCardCount = parseInt(searchParams.get('cards') || '3');
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [readingState, setReadingState] = useState<ReadingState>({
    phase: 'welcome',
    selectedArea: '',
    shuffledDeck: [],
    drawnCards: [],
    cardCount: initialCardCount,
    isRevealed: false,
    spreadType: 'three-card',
    hasBackgroundMusic: false
  });

  // Get performance detector instance
  const performanceDetector = useMemo(() => PerformanceDetector.getInstance(), []);
  
  // Preload tarot card images with performance optimization
  const imageUrls = useMemo(() => AUTHENTIC_RWS_DECK.map(card => card.image), []);
  const imagePreloadState = useImagePreloader(imageUrls, {
    batchSize: performanceDetector.getOptimalBatchSize(),
    delay: performanceDetector.getOptimalDelay(),
    onProgress: (state) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Image preloading progress: ${state.progress}%`);
      }
    }
  });

  // Handle background music
  useEffect(() => {
    if (audioRef.current) {
      if (readingState.hasBackgroundMusic) {
        audioRef.current.play().catch(e => {
          if (process.env.NODE_ENV === 'development') {
            console.log('Music playback failed:', e);
          }
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [readingState.hasBackgroundMusic]);
  
  // Toggle background music and sound effects
  const toggleBackgroundMusic = () => {
    const newState = !readingState.hasBackgroundMusic;
    
    setReadingState(prev => ({
      ...prev,
      hasBackgroundMusic: newState
    }));
    
    // Configure sound effects based on music setting
    configureSoundEffects({
      enabled: newState,
      volume: newState ? 0.5 : 0
    });
  };

  // Choose tarot spread layout
  const handleSpreadTypeChange = (spreadType: 'three-card' | 'five-card' | 'celtic-cross') => {
    const spreadConfig = SPREAD_TYPES.find(s => s.key === spreadType);
    if (!spreadConfig) return;
    
    setReadingState(prev => ({
      ...prev,
      spreadType,
      cardCount: spreadConfig.cardCount
    }));
  };

  // Select life area
  const handleAreaSelection = (areaKey: string) => {
    const area = LIFE_AREAS.find(a => a.key === areaKey);
    if (!area) return;

    // Enter the shuffling ritual phase
    setReadingState(prev => ({ 
      ...prev, 
      selectedArea: areaKey, 
      phase: 'shuffling'
    }));

    // Start the sacred shuffling ritual (4 seconds)
    setTimeout(() => {
      // Execute the actual shuffling algorithm
      const shuffled = shuffleDeck();
      
      // Always go to the shuffled phase to allow user interaction for all spreads
      setReadingState(prev => ({ 
        ...prev, 
        shuffledDeck: shuffled,
        phase: 'shuffled'
      }));
    }, 4000); // 4 second sacred ritual
  };

  // Proceed from shuffling to drawing phase
  const proceedToDrawing = () => {
    setReadingState(prev => ({ 
      ...prev, 
      phase: 'drawing'
    }));
  };

  // Handle card selection via click or drag
  const drawnCardIds = useMemo(() => new Set(readingState.drawnCards.map(c => c.id)), [readingState.drawnCards]);

  const handleCardSelection = (cardIndex: number) => {
    setReadingState(prev => {
      const selectedCard = prev.shuffledDeck[cardIndex];
      
      // Conditions to bail out: reading complete or card already selected
      if (prev.drawnCards.length >= prev.cardCount || prev.drawnCards.some(c => c.id === selectedCard.id)) {
        return prev;
      }

      const newDrawnCards = [...prev.drawnCards, selectedCard];

      if (prev.hasBackgroundMusic) {
        playSoundEffect('card-select', { volume: 0.3 }).catch(e => {
          if (process.env.NODE_ENV === 'development') {
            console.log('Sound effect failed', e);
          }
        });
      }

      // Check for completion and schedule transition to the 'drawn' phase
      if (newDrawnCards.length === prev.cardCount) {
        setTimeout(() => {
          setReadingState(current => ({ ...current, phase: 'drawn' }));
        }, 800);
      }

      return { ...prev, drawnCards: newDrawnCards };
    });
  };
  
  // Handle card click
  const handleCardClick = (cardIndex: number) => {
    handleCardSelection(cardIndex);
  };
  
  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-purple-500', 'bg-purple-900/30');
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-purple-500', 'bg-purple-900/30');
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-purple-500', 'bg-purple-900/30');
    
    const cardIndex = Number(e.dataTransfer.getData('text/plain'));
    if (!isNaN(cardIndex)) {
      handleCardSelection(cardIndex);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-[#101118] via-[#101118] to-[#101118]">
      {/* Hidden audio player */}
      <audio 
        ref={audioRef} 
        src={AUDIO_CONFIG.background.tarot} 
        loop 
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Image preloading indicator */}
        {imagePreloadState.isLoading && (
          <div className="fixed top-4 left-4 z-40 bg-purple-900/80 text-white px-3 py-2 rounded-lg text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <span>Loading images... {imagePreloadState.progress}%</span>
            </div>
          </div>
        )}
        
        {/* Mystical header */}
        <div className="text-center mb-12 relative">
          <div className="relative">
            <div className="bg-gradient-to-r from-[#8A2BE2]/30 to-[#8A2BE2]/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Sparkles className="h-12 w-12 text-[#8A2BE2] animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div className="absolute inset-0 bg-[#8A2BE2]/5 rounded-full blur-xl"></div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-[#FFFFFF] mb-4 tracking-wide">
            Sacred Tarot Reading
          </h1>
          
          <p className="text-xl text-[#A0A0A0] italic font-light mb-2">
            "The cards whisper secrets to those who listen with their hearts"
          </p>
          
          <p className="text-sm text-[#A0A0A0] italic">
            Authentic Rider-Waite-Smith Tarot • {readingState.spreadType === 'three-card' ? 'Three Card Spread' : readingState.spreadType === 'five-card' ? 'Five Card Spread' : 'Celtic Cross'} Reading
          </p>
          
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#8A2BE2] to-transparent mx-auto mt-6"></div>
          
          {/* Audio control button */}
          <button 
            onClick={toggleBackgroundMusic}
            className="absolute top-2 right-2 p-2 rounded-full hover:bg-purple-900/20 transition-colors"
            title={readingState.hasBackgroundMusic ? "Turn off background music" : "Turn on background music"}
          >
            {readingState.hasBackgroundMusic ? (
              <Music className="h-6 w-6 text-purple-400" />
            ) : (
              <VolumeX className="h-6 w-6 text-purple-600/60" />
            )}
          </button>
        </div>
        
        {/* Main sacred reading room */}
        <div className="bg-gradient-to-br from-[#22232E]/90 to-[#101118]/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-[#8A2BE2]/30 shadow-2xl relative overflow-hidden">
          {/* Mystical background effect */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#8A2BE2] rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#FF00FF] rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          {/* Welcome phase - mystical greeting and life area selection */}
          {readingState.phase === 'welcome' && (
            <div className="relative z-10 space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[#FFFFFF] mb-6 tracking-wide">
                  Welcome, Sacred Seeker
                </h2>
                <p className="text-lg text-[#D0D0D0] max-w-3xl mx-auto">
                  Tarot does not predict a fixed future, but reveals the hidden energies of the present moment. Begin your personal sacred journey by selecting a life area below.
                </p>
              </div>
              
              {/* Select tarot spread */}
              <div className="mb-12">
                <h3 className="text-2xl font-semibold text-center text-purple-200 mb-6">Choose a Tarot Spread</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {SPREAD_TYPES.map((spread) => (
                    <button
                      key={spread.key}
                      onClick={() => handleSpreadTypeChange(spread.key as any)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        readingState.spreadType === spread.key 
                          ? 'border-purple-500 bg-purple-900/40 shadow-lg shadow-purple-900/30' 
                          : 'border-purple-800/40 bg-purple-900/20 hover:bg-purple-900/30'
                      }`}
                    >
                      <h4 className="text-lg font-medium text-white">{spread.name}</h4>
                      <p className="text-sm text-gray-300">{spread.description}</p>
                      <div className="mt-2 text-xs text-purple-300">{spread.cardCount} cards</div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Select life area */}
              <div>
                <h3 className="text-2xl font-semibold text-center text-purple-200 mb-6">
                  Choose the Life Area You Want to Explore
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {LIFE_AREAS.map((area) => (
                    <button
                      key={area.key}
                      onClick={() => handleAreaSelection(area.key)}
                      className="p-6 border border-purple-500/30 rounded-2xl bg-gradient-to-br from-purple-900/30 to-indigo-900/20 hover:from-purple-800/40 hover:to-indigo-800/30 transition-colors group"
                    >
                      <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">{area.title}</h3>
                      <p className="text-gray-300">{area.description}</p>
                      <p className="mt-3 text-sm italic text-purple-400">{area.mysticalDesc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Shuffling phase - Enhanced with card shuffle animation */}
          {readingState.phase === 'shuffling' && (
            <div className="relative z-10 text-center min-h-[500px] flex flex-col items-center justify-center">
              {/* Card shuffle animation */}
              <div className="relative w-72 h-72 mb-6">
                {/* Main spinning circle */}
                <div className="absolute inset-0 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-l-transparent border-r-transparent border-indigo-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
                <div className="absolute inset-4 border-4 border-b-transparent border-purple-300 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
                
                {/* Optimized flying cards animation */}
                <div className="absolute inset-0">
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute w-16 h-24 bg-purple-800 rounded-md border border-purple-600 transform-style-preserve-3d" 
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        animation: `fly-card-${i % 5 + 1} ${2 + Math.random() * 2}s infinite`,
                        animationDelay: `${i * 0.1}s`,
                        opacity: 0,
                        zIndex: i
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center backface-hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <h2 className="text-3xl font-bold text-white mb-4">Shuffling Ritual in Progress...</h2>
              <p className="text-lg text-gray-300 max-w-2xl">
                The cards are being combined and arranged, connecting the ancient wisdom of the tarot with your energy field. This sacred ritual ensures that the guidance you receive is tailored specifically for you.
              </p>

              {/* Enhanced animation keyframes with 3D effects and rotation */}
              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes fly-card-1 {
                  0% { transform: translate(-50%, -50%) rotate(0deg) rotateX(0deg); opacity: 0; }
                  20% { transform: translate(-150%, -100%) rotate(-20deg) rotateX(30deg); opacity: 1; }
                  100% { transform: translate(100%, 100%) rotate(30deg) rotateX(-20deg); opacity: 0; }
                }
                @keyframes fly-card-2 {
                  0% { transform: translate(-50%, -50%) rotate(0deg) rotateY(0deg); opacity: 0; }
                  20% { transform: translate(150%, -120%) rotate(25deg) rotateY(30deg); opacity: 1; }
                  100% { transform: translate(-120%, 80%) rotate(-40deg) rotateY(-15deg); opacity: 0; }
                }
                @keyframes fly-card-3 {
                  0% { transform: translate(-50%, -50%) rotate(0deg) rotateZ(0deg); opacity: 0; }
                  20% { transform: translate(-100%, 150%) rotate(-15deg) rotateZ(20deg); opacity: 1; }
                  100% { transform: translate(80%, -130%) rotate(35deg) rotateZ(-25deg); opacity: 0; }
                }
                @keyframes fly-card-4 {
                  0% { transform: translate(-50%, -50%) rotate(0deg) rotateX(0deg); opacity: 0; }
                  20% { transform: translate(120%, 130%) rotate(30deg) rotateX(-20deg); opacity: 1; }
                  100% { transform: translate(-140%, -90%) rotate(-25deg) rotateX(15deg); opacity: 0; }
                }
                @keyframes fly-card-5 {
                  0% { transform: translate(-50%, -50%) rotate(0deg) rotateY(0deg); opacity: 0; }
                  20% { transform: translate(-80%, -140%) rotate(-10deg) rotateY(-25deg); opacity: 1; }
                  100% { transform: translate(130%, -70%) rotate(20deg) rotateY(35deg); opacity: 0; }
                }
              `}} />

              {/* Add user interaction hint */}
              <div className="mt-4 text-purple-300 animate-pulse">
                <p>Focusing your energy...</p>
              </div>
            </div>
          )}
          
          {/* Shuffled, waiting to draw phase - Enhanced with interactive deck visualization */}
          {readingState.phase === 'shuffled' && (
            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Cards Are Shuffled</h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                The cards are now resonating with your energy and are ready to reveal their wisdom. Focus on your question, then click the button below to continue.
              </p>
              
              {/* Interactive visualized deck with hover effects */}
              <div className="perspective-1000 relative w-48 h-64 mx-auto mb-10 group cursor-pointer" onClick={proceedToDrawing}>
                {[...Array(7)].map((_, i) => (
                  <div 
                    key={i}
                    className={`absolute w-44 h-60 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl border border-purple-500 shadow-xl transition-all duration-300 group-hover:translate-y-${i % 3 + 1}`}
                    style={{ 
                      transform: `translate(${i * 3}px, ${i * -1}px) rotate(${i * 1.5 - 5}deg)`,
                      zIndex: i,
                      transitionDelay: `${i * 50}ms`
                    }}
                  >
                    <div className="w-full h-full p-6 flex items-center justify-center">
                      <div className="w-full h-full rounded-lg bg-purple-800/30 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-300 group-hover:text-purple-100 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Animated energy pulse */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 animate-ping"></div>
                </div>

                {/* Card glow on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-70 bg-gradient-to-b from-purple-400/0 via-purple-400/10 to-purple-400/0 transition-opacity duration-500"></div>
              </div>
              
              {/* Interactive button with floating effect */}
              <button
                onClick={proceedToDrawing}
                className="px-8 py-4 bg-gradient-to-r from-purple-700 to-indigo-800 text-white rounded-full text-lg font-medium shadow-lg hover:from-purple-600 hover:to-indigo-700 transition-all flex items-center mx-auto animate-float"
              >
                <span>Begin Drawing Cards</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>

              <div className="mt-6 text-purple-300 text-sm animate-fade-in">
                <p>Touch the deck when you're ready to proceed</p>
              </div>
            </div>
          )}
          
          {/* Drawing phase - Enhanced with improved draggable cards and interaction */}
          {readingState.phase === 'drawing' && (
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-center text-white mb-6">
                Draw Your Cards
              </h2>
              <p className="text-lg text-center text-gray-300 mb-6 max-w-2xl mx-auto">
                Please select {readingState.cardCount} cards. Let your intuition guide you, choosing the cards that attract your attention.
                <br/>
                <span className="text-sm italic text-purple-300 mt-1">You can click on cards or drag them to the reading area below.</span>
              </p>
              
              {/* Enhanced progress indicator with animated highlights */}
              <div className="mb-8 flex justify-center">
                <div className="relative w-64 h-2 rounded-full bg-purple-900/30 overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                    style={{ 
                      width: `${(readingState.drawnCards.length / readingState.cardCount) * 100}%`,
                      boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)'
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
                <span className="ml-4 text-purple-300 font-medium">
                  {readingState.drawnCards.length}/{readingState.cardCount}
                </span>
              </div>

              {/* Enhanced reading area - with active drop zone highlights */}
              <div 
                className="relative mb-8 min-h-[160px] flex justify-center items-center border-2 border-dashed border-purple-500/30 rounded-xl p-6 transition-all backdrop-blur-sm"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {readingState.drawnCards.length > 0 ? (
                  <div className="flex flex-wrap justify-center gap-6">
                    {readingState.drawnCards.map((_, idx) => (
                      <div key={idx} className="relative w-16 h-24 md:w-20 md:h-32 animate-fade-in">
                        <div className="w-full h-full bg-gradient-to-br from-purple-700 to-indigo-800 rounded-lg border border-purple-400 shadow-lg flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 border border-purple-400 shadow flex items-center justify-center text-xs text-white font-medium">
                          {idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-purple-400/70 italic text-center">
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                      </svg>
                      <span className="text-sm">Drag cards here or click on them below</span>
                      <span className="text-xs mt-2">Your selected cards will appear here</span>
                    </div>
                  </div>
                )}
                
                {/* Subtle guidance indicators */}
                {readingState.drawnCards.length < readingState.cardCount && readingState.drawnCards.length > 0 && (
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full bg-purple-900/70 text-xs text-purple-200">
                    {readingState.cardCount - readingState.drawnCards.length} more {readingState.cardCount - readingState.drawnCards.length === 1 ? 'card' : 'cards'} to select
                  </div>
                )}
              </div>
              
              {/* Enhanced card selection area with improved layout and effects */}
              <div className="relative">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full bg-purple-900/80 text-sm text-white font-medium shadow-md">
                  Tarot Deck
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 max-h-[45vh] p-8 bg-gradient-to-b from-black/40 to-purple-900/20 backdrop-blur-sm rounded-xl shadow-inner overflow-y-auto">
                  {readingState.shuffledDeck.map((card, idx) => {
                    const isSelected = drawnCardIds.has(card.id);
                    return (
                      <div
                        key={card.id}
                        className={`relative aspect-[3/5] rounded-lg cursor-pointer transition-all transform ${
                          isSelected
                            ? 'opacity-30 grayscale pointer-events-none'
                            : 'hover:scale-110 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-2'
                        }`}
                        onClick={() => handleCardClick(idx)}
                        draggable={!isSelected}
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', idx.toString());
                          e.currentTarget.classList.add('opacity-50', 'scale-105');
                        }}
                        onDragEnd={(e) => {
                          e.currentTarget.classList.remove('opacity-50', 'scale-105');
                        }}
                      >
                        <div className="w-full h-full perspective-1000">
                          <CardBack className="w-full h-full" animated={true} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Drawn phase - show selected cards and proceed to analysis */}
          {readingState.phase === 'drawn' && (
            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Your Chosen Cards</h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                The cards have been drawn. Now, let's unveil their secrets.
              </p>
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                {readingState.drawnCards.map((card, idx) => (
                  <div key={card.id} className="relative w-24 h-40 md:w-28 md:h-48 animate-fade-in">
                    <div className="w-full h-full bg-gradient-to-br from-purple-700 to-indigo-800 rounded-lg border border-purple-400 shadow-lg flex items-center justify-center">
                      <img src={card.image} alt={card.name} className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 border border-purple-400 shadow flex items-center justify-center text-xs text-white font-medium">
                      {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setReadingState(prev => ({ ...prev, phase: 'login' }))}
                className="px-8 py-4 bg-gradient-to-r from-purple-700 to-indigo-800 text-white rounded-full text-lg font-medium shadow-lg hover:from-purple-600 hover:to-indigo-700 transition-all flex items-center mx-auto animate-float"
              >
                <span>Reveal My Reading</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

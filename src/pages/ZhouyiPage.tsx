import { useState } from 'react';
import { Sparkles, RotateCcw, BookOpen, Mountain, Waves, ArrowRight, User, Calendar, Users, ArrowDownUp } from 'lucide-react';
import { generateIChinReading, QUESTION_GUIDANCE, type IChinReading } from '../utils/iching';
import SoulChronicleLogin from '../components/SoulChronicleLogin';
import HexagramDisplay from '../components/HexagramDisplay';
import HexagramAnalysis from '../components/HexagramAnalysis';

interface ZhouyiState {
  phase: 'welcome' | 'birthInfo' | 'question' | 'casting' | 'cast' | 'login' | 'interpretation';
  birthInfo: {
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    birthTime: string;
    birthPlace: string;
  };
  question: string;
  reading?: IChinReading;
  userSacredName?: string;
}

export default function ZhouyiPage() {
  const [state, setState] = useState<ZhouyiState>({
    phase: 'welcome',
    birthInfo: {
      firstName: '',
      lastName: '',
      birthDate: '',
      gender: '',
      birthTime: '',
      birthPlace: ''
    },
    question: ''
  });

  const handleBirthInfoSubmit = () => {
    const { firstName, lastName, birthDate, gender } = state.birthInfo;
    if (!firstName || !lastName || !birthDate || !gender) return;
    
    setState(prev => ({ ...prev, phase: 'question' }));
  };

  const handleQuestionSubmit = () => {
    if (!state.question.trim()) return;
    
    setState(prev => ({ ...prev, phase: 'casting' }));
    
    // Simulate the ancient casting ceremony (5 seconds)
    setTimeout(() => {
      const reading = generateIChinReading(state.question);
      setState(prev => ({ 
        ...prev, 
        reading,
        phase: 'cast'
      }));
    }, 5000);
  };

  const proceedToReveal = () => {
    setState(prev => ({ ...prev, phase: 'login' }));
  };

  const handleLoginSuccess = (userData: { sacredName: string; isReturning: boolean }) => {
    setState(prev => ({ 
      ...prev, 
      phase: 'interpretation',
      userSacredName: userData.sacredName
    }));
  };

  const handleLoginCancel = () => {
    setState(prev => ({ ...prev, phase: 'cast' }));
  };

  const resetReading = () => {
    setState({
      phase: 'welcome',
      birthInfo: {
        firstName: '',
        lastName: '',
        birthDate: '',
        gender: '',
        birthTime: '',
        birthPlace: ''
      },
      question: ''
    });
  };



  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-[#1a1830] via-[#2C2A4A] to-[#1a1830]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Mystical Header */}
        <div className="text-center mb-12">
          <div className="relative">
            <div className="bg-gradient-to-r from-[#C0A573]/30 to-[#C0A573]/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <BookOpen className="h-12 w-12 text-[#C0A573]" />
            </div>
            <div className="absolute inset-0 bg-[#C0A573]/5 rounded-full blur-xl"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#F0F0F0] mb-4 tracking-wide">
            Zhouyi Numerology
          </h1>
          <p className="text-xl text-[#C0A573] italic font-light mb-2">
            "易者，变也 - Yi means change"
          </p>
          <p className="text-lg text-[#C0A573]/80 mb-4">
            Ancient Chinese Wisdom • The Book of Changes • 64 Sacred Hexagrams
          </p>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#C0A573] to-transparent mx-auto mt-6"></div>
        </div>

        {/* Main Sacred Chamber */}
        <div className="bg-gradient-to-br from-[#4F4C7A]/90 to-[#2C2A4A]/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-[#C0A573]/30 shadow-2xl relative overflow-hidden">
          
          {/* Mystical Background Effects */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#C0A573] rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#C0A573] rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          {/* Welcome Phase */}
          {state.phase === 'welcome' && (
            <div className="relative z-10 space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[#F0F0F0] mb-6 tracking-wide">
                  Welcome to the Ancient Wisdom
                </h2>
                <div className="max-w-4xl mx-auto space-y-6">
                  <p className="text-[#C0A573] text-xl leading-relaxed italic">
                    "Yi means change. Welcome here to talk with the wisdom of thousands of years, 
                    to gain insight into the way of change, and to explore the way of action."
                  </p>
                  <p className="text-[#F0F0F0] text-lg leading-relaxed">
                    You come here not to seek a predetermined answer, but to understand your current situation, 
                    clarify your position, gain inspiration, and cultivate wisdom through ancient guidance.
                  </p>
                </div>
              </div>

              {/* Philosophy Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="bg-[#2C2A4A]/70 rounded-2xl p-6 border border-[#C0A573]/20">
                  <Mountain className="h-8 w-8 text-[#C0A573] mb-4" />
                  <h3 className="text-xl font-bold text-[#F0F0F0] mb-3">See the Current Situation</h3>
                  <p className="text-[#C0A573] leading-relaxed">
                    Understand your current environment, stage, and circumstances through the lens of ancient wisdom.
                  </p>
                </div>
                <div className="bg-[#2C2A4A]/70 rounded-2xl p-6 border border-[#C0A573]/20">
                  <Waves className="h-8 w-8 text-[#C0A573] mb-4" />
                  <h3 className="text-xl font-bold text-[#F0F0F0] mb-3">Clear Your Position</h3>
                  <p className="text-[#C0A573] leading-relaxed">
                    Find the most appropriate role and position in your current situation.
                  </p>
                </div>
                <div className="bg-[#2C2A4A]/70 rounded-2xl p-6 border border-[#C0A573]/20">
                  <Sparkles className="h-8 w-8 text-[#C0A573] mb-4" />
                  <h3 className="text-xl font-bold text-[#F0F0F0] mb-3">Gain Inspiration</h3>
                  <p className="text-[#C0A573] leading-relaxed">
                    Receive guidance on "how to act" from wisdom passed down for thousands of years.
                  </p>
                </div>
                <div className="bg-[#2C2A4A]/70 rounded-2xl p-6 border border-[#C0A573]/20">
                  <BookOpen className="h-8 w-8 text-[#C0A573] mb-4" />
                  <h3 className="text-xl font-bold text-[#F0F0F0] mb-3">Self-Cultivation</h3>
                  <p className="text-[#C0A573] leading-relaxed">
                    Reflect on your virtues and thoughts through the wisdom of the hexagrams.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setState(prev => ({ ...prev, phase: 'birthInfo' }))}
                  className="bg-[#C0A573] text-[#2C2A4A] px-12 py-4 rounded-2xl font-bold text-xl hover:bg-[#D4B885] transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto"
                >
                  <span>Begin Your Consultation</span>
                  <ArrowRight className="h-6 w-6" />
                </button>
              </div>
            </div>
          )}

          {/* Birth Information Phase */}
          {state.phase === 'birthInfo' && (
            <div className="relative z-10 space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-[#C0A573] mb-6 tracking-wide">
                  Sacred Birth Information
                </h2>
                <div className="max-w-4xl mx-auto space-y-4">
                  <p className="text-[#F0F0F0] text-xl leading-relaxed italic">
                    "To align the ancient wisdom with your personal energy, we must first understand the cosmic moment of your arrival in this world."
                  </p>
                  <p className="text-[#C0A573] text-lg leading-relaxed">
                    "Your birth details help us attune the I Ching consultation to your unique spiritual blueprint and life circumstances."
                  </p>
                </div>
              </div>

              {/* Sacred Information Form */}
              <div className="bg-[#2C2A4A]/70 rounded-2xl p-8 border border-[#C0A573]/20">
                <h3 className="text-2xl font-bold text-[#C0A573] mb-8 text-center italic">
                  Your Sacred Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-[#F0F0F0] font-semibold mb-3 text-lg">
                      <User className="inline h-5 w-5 mr-2" />
                      Sacred First Name
                    </label>
                    <input
                      type="text"
                      value={state.birthInfo.firstName}
                      onChange={(e) => setState(prev => ({ 
                        ...prev, 
                        birthInfo: { ...prev.birthInfo, firstName: e.target.value }
                      }))}
                      className="w-full px-6 py-4 rounded-2xl bg-[#2C2A4A]/70 border border-[#C0A573]/30 text-[#F0F0F0] placeholder-[#C0A573]/50 focus:outline-none focus:ring-2 focus:ring-[#C0A573] focus:border-transparent text-lg"
                      placeholder="Enter your first name"
                    />
                    <p className="text-[#C0A573]/70 text-sm mt-2 italic">
                      "Your given name carries the energy of your earthly identity"
                    </p>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-[#F0F0F0] font-semibold mb-3 text-lg">
                      <User className="inline h-5 w-5 mr-2" />
                      Sacred Family Name
                    </label>
                    <input
                      type="text"
                      value={state.birthInfo.lastName}
                      onChange={(e) => setState(prev => ({ 
                        ...prev, 
                        birthInfo: { ...prev.birthInfo, lastName: e.target.value }
                      }))}
                      className="w-full px-6 py-4 rounded-2xl bg-[#2C2A4A]/70 border border-[#C0A573]/30 text-[#F0F0F0] placeholder-[#C0A573]/50 focus:outline-none focus:ring-2 focus:ring-[#C0A573] focus:border-transparent text-lg"
                      placeholder="Enter your family name"
                    />
                    <p className="text-[#C0A573]/70 text-sm mt-2 italic">
                      "Your family name connects you to ancestral wisdom"
                    </p>
                  </div>

                  {/* Birth Date */}
                  <div>
                    <label className="block text-[#F0F0F0] font-semibold mb-3 text-lg">
                      <Calendar className="inline h-5 w-5 mr-2" />
                      Sacred Birth Date
                    </label>
                    <input
                      type="date"
                      value={state.birthInfo.birthDate}
                      onChange={(e) => setState(prev => ({ 
                        ...prev, 
                        birthInfo: { ...prev.birthInfo, birthDate: e.target.value }
                      }))}
                      className="w-full px-6 py-4 rounded-2xl bg-[#2C2A4A]/70 border border-[#C0A573]/30 text-[#F0F0F0] focus:outline-none focus:ring-2 focus:ring-[#C0A573] focus:border-transparent text-lg"
                    />
                    <p className="text-[#C0A573]/70 text-sm mt-2 italic">
                      "The cosmic moment when your soul entered this realm"
                    </p>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-[#F0F0F0] font-semibold mb-3 text-lg">
                      <Users className="inline h-5 w-5 mr-2" />
                      Sacred Gender
                    </label>
                    <select
                      value={state.birthInfo.gender}
                      onChange={(e) => setState(prev => ({ 
                        ...prev, 
                        birthInfo: { ...prev.birthInfo, gender: e.target.value }
                      }))}
                      className="w-full px-6 py-4 rounded-2xl bg-[#2C2A4A]/70 border border-[#C0A573]/30 text-[#F0F0F0] focus:outline-none focus:ring-2 focus:ring-[#C0A573] focus:border-transparent text-lg"
                    >
                      <option value="">Select your gender</option>
                      <option value="male">Male (Yang)</option>
                      <option value="female">Female (Yin)</option>
                      <option value="other">Other (Harmony)</option>
                    </select>
                    <p className="text-[#C0A573]/70 text-sm mt-2 italic">
                      "Your energetic polarity influences the hexagram interpretation"
                    </p>
                  </div>

                  {/* Birth Time (Optional) */}
                  <div>
                    <label className="block text-[#F0F0F0] font-semibold mb-3 text-lg">
                      <Calendar className="inline h-5 w-5 mr-2" />
                      Birth Time (Optional)
                    </label>
                    <input
                      type="time"
                      value={state.birthInfo.birthTime}
                      onChange={(e) => setState(prev => ({ 
                        ...prev, 
                        birthInfo: { ...prev.birthInfo, birthTime: e.target.value }
                      }))}
                      className="w-full px-6 py-4 rounded-2xl bg-[#2C2A4A]/70 border border-[#C0A573]/30 text-[#F0F0F0] focus:outline-none focus:ring-2 focus:ring-[#C0A573] focus:border-transparent text-lg"
                    />
                    <p className="text-[#C0A573]/70 text-sm mt-2 italic">
                      "The precise hour enhances the cosmic alignment"
                    </p>
                  </div>

                  {/* Birth Place (Optional) */}
                  <div>
                    <label className="block text-[#F0F0F0] font-semibold mb-3 text-lg">
                      <Mountain className="inline h-5 w-5 mr-2" />
                      Birth Place (Optional)
                    </label>
                    <input
                      type="text"
                      value={state.birthInfo.birthPlace}
                      onChange={(e) => setState(prev => ({ 
                        ...prev, 
                        birthInfo: { ...prev.birthInfo, birthPlace: e.target.value }
                      }))}
                      className="w-full px-6 py-4 rounded-2xl bg-[#2C2A4A]/70 border border-[#C0A573]/30 text-[#F0F0F0] placeholder-[#C0A573]/50 focus:outline-none focus:ring-2 focus:ring-[#C0A573] focus:border-transparent text-lg"
                      placeholder="City, Country"
                    />
                    <p className="text-[#C0A573]/70 text-sm mt-2 italic">
                      "The sacred land where your journey began"
                    </p>
                  </div>
                </div>

                {/* Sacred Purpose */}
                <div className="mt-8 bg-gradient-to-br from-[#C0A573]/10 to-[#C0A573]/5 rounded-2xl p-6 border border-[#C0A573]/20">
                  <h4 className="text-lg font-bold text-[#C0A573] mb-3 italic text-center">
                    Sacred Purpose of This Information
                  </h4>
                  <p className="text-[#F0F0F0]/90 text-center leading-relaxed">
                    Your birth details help us align the ancient I Ching wisdom with your personal energy signature. 
                    This creates a more personalized and accurate consultation that resonates with your unique life path 
                    and spiritual journey.
                  </p>
                </div>

                <div className="text-center mt-8">
                  <button
                    onClick={handleBirthInfoSubmit}
                    disabled={!state.birthInfo.firstName || !state.birthInfo.lastName || !state.birthInfo.birthDate || !state.birthInfo.gender}
                    className="bg-[#C0A573] text-[#2C2A4A] px-12 py-4 rounded-2xl font-bold text-xl hover:bg-[#D4B885] transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-3 mx-auto"
                  >
                    <span>Proceed to Sacred Question</span>
                    <ArrowRight className="h-6 w-6" />
                  </button>
                  
                  <p className="text-[#C0A573]/70 text-sm mt-4 italic">
                    "Your sacred information is protected by ancient mystical encryption"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Question Phase */}
          {state.phase === 'question' && (
            <div className="relative z-10 space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-[#C0A573] mb-6 tracking-wide">
                  Prepare Your Sacred Question
                </h2>
                <div className="max-w-4xl mx-auto space-y-4">
                  <p className="text-[#F0F0F0] text-xl leading-relaxed italic">
                    "Greetings, {state.birthInfo.firstName}. Now that we have aligned with your cosmic energy, 
                    please prepare your sacred question for the ancient wisdom."
                  </p>
                  <p className="text-[#C0A573] text-lg leading-relaxed">
                    "One question for each matter, sincere heart will work. Please silently recite the specific matters that confuse you."
                  </p>
                </div>
              </div>

              {/* Personal Energy Display */}
              <div className="bg-[#2C2A4A]/70 rounded-2xl p-6 border border-[#C0A573]/20 mb-8">
                <h3 className="text-xl font-bold text-[#C0A573] mb-4 text-center">Your Sacred Energy Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-[#F0F0F0] font-semibold">{state.birthInfo.firstName} {state.birthInfo.lastName}</p>
                    <p className="text-[#C0A573]/70 text-sm">Sacred Name</p>
                  </div>
                  <div>
                    <p className="text-[#F0F0F0] font-semibold">
                      {new Date(state.birthInfo.birthDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-[#C0A573]/70 text-sm">Cosmic Birth Moment</p>
                  </div>
                  <div>
                    <p className="text-[#F0F0F0] font-semibold capitalize">
                      {state.birthInfo.gender === 'male' ? 'Yang' : state.birthInfo.gender === 'female' ? 'Yin' : 'Harmony'}
                    </p>
                    <p className="text-[#C0A573]/70 text-sm">Energy Polarity</p>
                  </div>
                </div>
              </div>

              {/* Question Guidance */}
              <div className="bg-[#2C2A4A]/70 rounded-2xl p-8 border border-[#C0A573]/20 mb-8">
                <h3 className="text-2xl font-bold text-[#C0A573] mb-6 text-center">Questioning Guidance</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-[#F0F0F0] mb-4">Example Questions:</h4>
                    <ul className="space-y-2 text-[#C0A573]">
                      {QUESTION_GUIDANCE.examples.slice(0, 4).map((example, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-[#C0A573] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <span className="italic">"{example}"</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-[#F0F0F0] mb-4">Sacred Principles:</h4>
                    <ul className="space-y-2 text-[#C0A573]">
                      {QUESTION_GUIDANCE.principles.slice(0, 4).map((principle, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-[#C0A573] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <span>{principle}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Question Input */}
              <div className="space-y-6">
                <div>
                  <label className="block text-[#F0F0F0] font-semibold mb-4 text-lg text-center">
                    Your Sacred Question
                  </label>
                  <textarea
                    value={state.question}
                    onChange={(e) => setState(prev => ({ ...prev, question: e.target.value }))}
                    className="w-full px-6 py-4 rounded-2xl bg-[#2C2A4A]/70 border border-[#C0A573]/30 text-[#F0F0F0] placeholder-[#C0A573]/50 focus:outline-none focus:ring-2 focus:ring-[#C0A573] focus:border-transparent text-lg resize-none"
                    rows={4}
                    placeholder="Enter your specific question here... The clearer the question, the clearer the revelation of the hexagram will be."
                  />
                </div>

                <div className="text-center">
                  <button
                    onClick={handleQuestionSubmit}
                    disabled={!state.question.trim()}
                    className="bg-[#C0A573] text-[#2C2A4A] px-12 py-4 rounded-2xl font-bold text-xl hover:bg-[#D4B885] transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-3 mx-auto"
                  >
                    <span>Cast the Sacred Hexagram</span>
                    <ArrowRight className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Casting Phase */}
          {state.phase === 'casting' && (
            <div className="relative z-10 text-center">
              <div className="max-w-4xl mx-auto space-y-8">
                <h2 className="text-4xl font-bold text-[#C0A573] mb-8 tracking-wide">
                  Sacred Casting Ceremony
                </h2>
                
                {/* Personal Energy Acknowledgment */}
                <div className="bg-[#2C2A4A]/70 rounded-2xl p-6 border border-[#C0A573]/20 mb-8">
                  <p className="text-[#F0F0F0] text-xl leading-relaxed italic">
                    "The ancient coins are being cast for {state.birthInfo.firstName}, 
                    born under the {state.birthInfo.gender === 'male' ? 'Yang' : state.birthInfo.gender === 'female' ? 'Yin' : 'Harmonious'} energy 
                    on {new Date(state.birthInfo.birthDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}..."
                  </p>
                </div>
                
                {/* Ancient Casting Animation */}
                <div className="relative mb-12">
                  <div className="flex justify-center items-center mb-8">
                    <div className="relative w-64 h-64">
                      {/* Coin Animation */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-12 h-12 bg-gradient-to-br from-[#C0A573] to-[#D4B885] rounded-full border-2 border-[#C0A573]/50 animate-bounce"
                            style={{
                              left: `${40 + i * 20}%`,
                              animationDelay: `${i * 0.3}s`,
                              animationDuration: '2s'
                            }}
                          >
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#C0A573]/80 to-[#D4B885]/80 flex items-center justify-center text-[#2C2A4A] font-bold text-sm">
                              易
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Energy Circles */}
                      <div className="absolute inset-0 rounded-full border-2 border-[#C0A573]/30 animate-ping"></div>
                      <div className="absolute inset-4 rounded-full border border-[#C0A573]/50 animate-ping delay-500"></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-[#C0A573] text-xl leading-relaxed">
                    "Each coin carries the weight of destiny, channeling your personal energy and cosmic alignment 
                    to reveal the pattern of change that surrounds your question."
                  </p>
                  
                  <p className="text-[#F0F0F0] text-lg leading-relaxed max-w-3xl mx-auto">
                    "The hexagram is forming, line by line, as the universe aligns your birth energy 
                    with the ancient wisdom to provide you with the guidance you seek."
                  </p>
                </div>

                {/* Progress Indicator */}
                <div className="mt-12">
                  <div className="bg-[#2C2A4A]/50 rounded-2xl p-6 border border-[#C0A573]/20">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#C0A573] border-t-transparent"></div>
                      <span className="text-[#C0A573] font-medium">Consulting the Ancient Wisdom...</span>
                    </div>
                    <p className="text-[#C0A573]/70 text-sm italic text-center">
                      "The 64 hexagrams are aligning with your personal energy and sacred question..."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cast Phase - Hexagram Ready */}
          {state.phase === 'cast' && state.reading && (
            <div className="relative z-10 text-center">
              <div className="max-w-4xl mx-auto space-y-8">
                <h2 className="text-4xl font-bold text-[#C0A573] mb-8 tracking-wide">
                  The Hexagram Has Spoken
                </h2>
                
                {/* Personal Acknowledgment */}
                <div className="bg-[#2C2A4A]/70 rounded-2xl p-6 border border-[#C0A573]/20 mb-8">
                  <p className="text-[#F0F0F0] text-lg leading-relaxed italic">
                    "For {state.birthInfo.firstName} {state.birthInfo.lastName}, 
                    born with {state.birthInfo.gender === 'male' ? 'Yang' : state.birthInfo.gender === 'female' ? 'Yin' : 'Harmonious'} energy, 
                    the ancient wisdom has revealed its guidance."
                  </p>
                </div>
                
                {/* Hexagram Display */}
                <div className="relative mb-12">
                  <div className="flex justify-center items-center mb-8">
                    <div className="bg-[#2C2A4A]/70 rounded-2xl p-8 border border-[#C0A573]/30">
                      <HexagramDisplay 
                        hexagram={state.reading.hexagram}
                        changingLines={state.reading.changingLines}
                        showDetails={false}
                      />
                      {state.reading.transformedHexagram && (
                        <div className="mt-8 pt-8 border-t border-[#C0A573]/20">
                          <div className="flex items-center justify-center mb-6">
                            <ArrowDownUp className="text-[#C0A573] h-10 w-10 animate-pulse" />
                          </div>
                          <HexagramDisplay 
                            hexagram={state.reading.transformedHexagram}
                            isTransformed={true}
                            showDetails={false}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-[#F0F0F0] text-2xl leading-relaxed italic">
                    "The ancient wisdom has revealed the hexagram for your question:"
                  </p>
                  
                  <div className="bg-[#2C2A4A]/70 rounded-2xl p-6 border border-[#C0A573]/20">
                    <p className="text-[#C0A573] text-lg italic">
                      "{state.reading.question}"
                    </p>
                  </div>
                  
                  <p className="text-[#F0F0F0] text-lg leading-relaxed max-w-3xl mx-auto">
                    "The hexagram {state.reading.hexagram.name} holds the key to understanding your path forward. 
                    When you are ready to receive its ancient wisdom, we shall unveil its sacred meaning."
                  </p>
                </div>

                <div className="mt-12">
                  <button
                    onClick={proceedToReveal}
                    className="bg-gradient-to-r from-[#C0A573] to-[#D4B885] text-[#2C2A4A] px-12 py-4 rounded-2xl font-bold text-xl hover:from-[#D4B885] hover:to-[#C0A573] transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto"
                  >
                    <span>Reveal the Ancient Wisdom</span>
                    <ArrowRight className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Interpretation Phase */}
          {state.phase === 'interpretation' && state.reading && (
            <div className="relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[#C0A573] mb-6 tracking-wide">
                  Ancient Wisdom Revealed
                </h2>
                <p className="text-[#F0F0F0] text-xl leading-relaxed italic max-w-4xl mx-auto">
                  "Behold, {state.userSacredName ? `dear ${state.userSacredName}` : `honored ${state.birthInfo.firstName}`}, 
                  the wisdom of the I Ching speaks to your question through the sacred hexagram, 
                  aligned with your {state.birthInfo.gender === 'male' ? 'Yang' : state.birthInfo.gender === 'female' ? 'Yin' : 'Harmonious'} energy."
                </p>
              </div>

              {/* Personal Energy Context */}
              <div className="bg-[#2C2A4A]/70 rounded-2xl p-6 border border-[#C0A573]/20 mb-8">
                <h3 className="text-xl font-bold text-[#C0A573] mb-4 text-center">Your Sacred Context</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-[#F0F0F0] font-semibold">{state.birthInfo.firstName}</p>
                    <p className="text-[#C0A573]/70 text-sm">Sacred Name</p>
                  </div>
                  <div>
                    <p className="text-[#F0F0F0] font-semibold">
                      {new Date(state.birthInfo.birthDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-[#C0A573]/70 text-sm">Birth Date</p>
                  </div>
                  <div>
                    <p className="text-[#F0F0F0] font-semibold">
                      {state.birthInfo.gender === 'male' ? 'Yang' : state.birthInfo.gender === 'female' ? 'Yin' : 'Harmony'}
                    </p>
                    <p className="text-[#C0A573]/70 text-sm">Energy Type</p>
                  </div>
                  <div>
                    <p className="text-[#F0F0F0] font-semibold">{state.reading.hexagram.name}</p>
                    <p className="text-[#C0A573]/70 text-sm">Your Hexagram</p>
                  </div>
                </div>
              </div>

              {/* Hexagram Presentation */}
              <div className="bg-[#2C2A4A]/70 rounded-3xl p-8 border border-[#C0A573]/20 mb-12">
                <div className="mb-8 border-b border-[#C0A573]/20 pb-8">
                  <HexagramDisplay 
                    hexagram={state.reading.hexagram}
                    changingLines={state.reading.changingLines}
                    showDetails={true}
                  />
                </div>
                
                {state.reading.transformedHexagram && (
                  <div className="mt-12 pt-6">
                    <div className="flex items-center justify-center space-x-4 mb-8">
                      <div className="h-px bg-[#C0A573]/30 w-32"></div>
                      <div className="bg-[#2C2A4A] border border-[#C0A573]/30 rounded-full p-3">
                        <ArrowDownUp className="text-[#C0A573] h-8 w-8" />
                      </div>
                      <div className="h-px bg-[#C0A573]/30 w-32"></div>
                    </div>
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-[#C0A573]">Transformed Hexagram</h3>
                      <p className="text-[#F0F0F0] text-lg mt-2">
                        Based on your changing lines, we now have a second hexagram that reveals your future path
                      </p>
                    </div>
                    <HexagramDisplay 
                      hexagram={state.reading.transformedHexagram}
                      isTransformed={true}
                      showDetails={true}
                    />
                  </div>
                )}
              </div>

              {/* Five Elements Analysis */}
              <div className="mb-8">
                <HexagramAnalysis 
                  upperTrigram={state.reading.hexagram.trigrams.upper} 
                  lowerTrigram={state.reading.hexagram.trigrams.lower} 
                />
              </div>

              {/* Interpretation */}
              <div className="space-y-8">
                <div className="bg-[#2C2A4A]/70 rounded-2xl p-8 border border-[#C0A573]/20">
                  <h3 className="text-2xl font-bold text-[#C0A573] mb-6 italic">Explanation</h3>
                  <p className="text-[#F0F0F0] leading-relaxed text-lg">
                    {state.reading.hexagram.interpretation.explanation}
                  </p>
                </div>

                <div className="bg-[#2C2A4A]/70 rounded-2xl p-8 border border-[#C0A573]/20">
                  <h3 className="text-2xl font-bold text-[#C0A573] mb-6 italic">Revelation for {state.birthInfo.firstName}</h3>
                  <p className="text-[#F0F0F0] leading-relaxed text-lg">
                    Given your {state.birthInfo.gender === 'male' ? 'Yang' : state.birthInfo.gender === 'female' ? 'Yin' : 'Harmonious'} energy 
                    and your life path, {state.reading.hexagram.interpretation.revelation}
                  </p>
                </div>

                <div className="bg-[#2C2A4A]/70 rounded-2xl p-8 border border-[#C0A573]/20">
                  <h3 className="text-2xl font-bold text-[#C0A573] mb-6 italic">Personal Guidance</h3>
                  <p className="text-[#F0F0F0] leading-relaxed text-lg">
                    For someone born on {new Date(state.birthInfo.birthDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}, {state.reading.hexagram.interpretation.guidance}
                  </p>
                </div>

                {/* Changing Lines */}
                {state.reading.changingLines.length > 0 && (
                  <div className="bg-[#2C2A4A]/70 rounded-2xl p-8 border border-[#C0A573]/20">
                    <h3 className="text-2xl font-bold text-[#C0A573] mb-6 italic">Changing Lines</h3>
                    <p className="text-[#F0F0F0] leading-relaxed mb-4">
                      The following lines are in motion, indicating areas of particular significance for your situation:
                    </p>
                    {state.reading.changingLines.map(lineNum => {
                      const line = state.reading!.hexagram.lines[lineNum - 1];
                      return (
                        <div key={lineNum} className="mb-4 p-4 bg-[#4F4C7A]/30 rounded-xl">
                          <h4 className="text-lg font-semibold text-[#C0A573] mb-2">
                            Line {lineNum}: {line.text}
                          </h4>
                          <p className="text-[#F0F0F0]">{line.meaning}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Sacred Blessing */}
              <div className="text-center mt-12 p-8 bg-gradient-to-br from-[#2C2A4A]/70 to-[#4F4C7A]/50 rounded-2xl border border-[#C0A573]/20">
                <h3 className="text-2xl font-bold text-[#C0A573] mb-6 italic">Ancient Blessing</h3>
                <div className="max-w-3xl mx-auto space-y-4">
                  <p className="text-[#F0F0F0] italic leading-relaxed text-lg">
                    "The wisdom of the I Ching has spoken, {state.userSacredName ? `dear ${state.userSacredName}` : `honored ${state.birthInfo.firstName}`}. 
                    The hexagram {state.reading.hexagram.name} illuminates the path of change and transformation before you, 
                    aligned with your sacred birth energy."
                  </p>
                  <p className="text-[#C0A573] leading-relaxed">
                    "Remember that the I Ching does not predict a fixed future, but reveals the patterns of change 
                    and the wisdom needed to navigate them skillfully. Use this guidance to cultivate virtue and make wise decisions."
                  </p>
                  <p className="text-[#F0F0F0]/80 italic text-base">
                    "May this ancient wisdom guide you on your path of continuous learning and self-cultivation, 
                    {state.birthInfo.firstName}."
                  </p>
                  {state.userSacredName && (
                    <p className="text-[#C0A573]/80 text-sm italic mt-6">
                      "This sacred I Ching consultation has been recorded in your Soul Chronicle, {state.userSacredName}. 
                      Return anytime to continue your journey of ancient wisdom."
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-6 mt-12">
                <button
                  onClick={resetReading}
                  className="bg-[#2C2A4A]/80 border border-[#C0A573]/30 text-[#F0F0F0] px-8 py-4 rounded-xl hover:bg-[#2C2A4A] hover:border-[#C0A573]/60 transition-all duration-300 flex items-center space-x-3 font-medium"
                >
                  <RotateCcw className="h-5 w-5" />
                  <span>Consult Again</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sacred Footer */}
        <div className="text-center mt-12">
          <div className="w-48 h-px bg-gradient-to-r from-transparent via-[#C0A573] to-transparent mx-auto mb-6"></div>
          <p className="text-[#C0A573]/70 italic text-sm leading-relaxed max-w-2xl mx-auto">
            "The I Ching teaches us that change is the only constant. Through understanding the patterns of change, 
            we learn to flow with life's rhythms and make decisions aligned with the natural order of the universe."
          </p>
        </div>
      </div>

      {/* Soul Chronicle Login Modal */}
      {state.phase === 'login' && (
        <SoulChronicleLogin
          onLoginSuccess={handleLoginSuccess}
          onCancel={handleLoginCancel}
        />
      )}
    </div>
  );
}

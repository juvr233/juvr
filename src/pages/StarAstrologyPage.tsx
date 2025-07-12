import React, { useState } from 'react';
import { Star, Calendar, User, ArrowRight, Info, MoveDown, Clock, Users } from 'lucide-react';
import { calculateStarAstrologyProfile, StarInfo } from '../utils/starAstrology';

interface StarAstrologyState {
  phase: 'welcome' | 'input' | 'result';
  userInfo: {
    name: string;
    birthDate: string;
    birthTime: string;
    gender: string;
  };
  result: StarInfo | null;
}

export default function StarAstrologyPage() {
  const [state, setState] = useState<StarAstrologyState>({
    phase: 'welcome',
    userInfo: {
      name: '',
      birthDate: '',
      birthTime: '',
      gender: ''
    },
    result: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      userInfo: { ...prev.userInfo, [name]: value }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { birthDate, birthTime, gender } = state.userInfo;
    
    if (!birthDate || !birthTime || !gender) return;
    
    const birthDateTime = new Date(`${birthDate}T${birthTime}`);
    const result = calculateStarAstrologyProfile(birthDateTime, gender);
    
    setState(prev => ({ ...prev, result, phase: 'result' }));
  };

  const resetForm = () => {
    setState({
      phase: 'welcome',
      userInfo: {
        name: '',
        birthDate: '',
        birthTime: '',
        gender: ''
      },
      result: null
    });
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-[#1a1830] to-[#2C2A4A]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-[#C0A573]/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star className="h-10 w-10 text-[#C0A573]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#F0F0F0] mb-4">
            Star Astrology
          </h1>
          <p className="text-xl text-[#C0A573] max-w-3xl mx-auto">
            Explore the influence of the 28 lunar mansions on your destiny, and let ancient wisdom guide your life path.
          </p>
        </div>

        {state.phase === 'welcome' && (
          <div className="bg-[#2C2A4A] rounded-3xl p-8 shadow-2xl border border-[#C0A573]/20 max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#F0F0F0] mb-6">The Wisdom of the Ancient Stars</h2>
              <p className="text-lg text-[#C0A573] mb-4">
                Ancient Chinese astronomers divided the sky into 28 sectors, known as the "28 Lunar Mansions," believing they governed the rise and fall of all things on Earth.
              </p>
              <p className="text-lg text-[#F0F0F0]">
                Through your date and time of birth, we will reveal the guardian star of your destiny and its influence on your personality and fate.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {['Azure Dragon of the East', 'Black Tortoise of the North', 'White Tiger of the West', 'Vermilion Bird of the South'].map((group, index) => (
                <div key={index} className="bg-[#1a1830] rounded-xl p-5 border border-[#C0A573]/10 text-center">
                  <h3 className="text-xl font-bold text-[#C0A573] mb-3">{group}</h3>
                  <p className="text-[#F0F0F0] text-sm">
                    {index === 0 && 'Jiao, Kang, Di, Fang, Xin, Wei, Ji'}
                    {index === 1 && 'Dou, Niu, Nü, Xu, Wei, Shi, Bi'}
                    {index === 2 && 'Kui, Lou, Wei, Mao, Bi, Zi, Shen'}
                    {index === 3 && 'Jing, Gui, Liu, Xing, Zhang, Yi, Zhen'}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button 
                onClick={() => setState(prev => ({ ...prev, phase: 'input' }))}
                className="bg-[#C0A573] text-[#1a1830] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#D4B885] transition-all transform hover:scale-105 flex items-center space-x-2 mx-auto"
              >
                <span>Start Star Analysis</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {state.phase === 'input' && (
          <div className="bg-[#2C2A4A] rounded-3xl p-8 shadow-2xl border border-[#C0A573]/20 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[#F0F0F0] mb-6 text-center">Enter Your Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[#F0F0F0] font-semibold mb-2">
                  <User className="inline-block mr-2 h-5 w-5" />
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={state.userInfo.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#1a1830] border border-[#C0A573]/30 text-[#F0F0F0] placeholder-[#C0A573]/50 focus:outline-none focus:ring-2 focus:ring-[#C0A573] focus:border-transparent"
                  placeholder="Enter your name (optional)"
                />
              </div>
              
              <div>
                <label className="block text-[#F0F0F0] font-semibold mb-2">
                  <Calendar className="inline-block mr-2 h-5 w-5" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={state.userInfo.birthDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#1a1830] border border-[#C0A573]/30 text-[#F0F0F0] focus:outline-none focus:ring-2 focus:ring-[#C0A573] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-[#F0F0F0] font-semibold mb-2">
                  <Clock className="inline-block mr-2 h-5 w-5" />
                  Time of Birth
                </label>
                <input
                  type="time"
                  name="birthTime"
                  value={state.userInfo.birthTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#1a1830] border border-[#C0A573]/30 text-[#F0F0F0] focus:outline-none focus:ring-2 focus:ring-[#C0A573] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-[#F0F0F0] font-semibold mb-2">
                  <Users className="inline-block mr-2 h-5 w-5" />
                  Gender
                </label>
                <select
                  name="gender"
                  value={state.userInfo.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#1a1830] border border-[#C0A573]/30 text-[#F0F0F0] focus:outline-none focus:ring-2 focus:ring-[#C0A573] focus:border-transparent"
                  required
                >
                  <option value="">Please select...</option>
                  <option value="male">Male (Yang)</option>
                  <option value="female">Female (Yin)</option>
                </select>
              </div>

              <div className="flex justify-between mt-10">
                <button
                  type="button"
                  onClick={() => setState(prev => ({ ...prev, phase: 'welcome' }))}
                  className="px-6 py-2 border border-[#C0A573]/30 rounded-lg text-[#C0A573] hover:bg-[#C0A573]/10 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-[#C0A573] text-[#1a1830] px-8 py-3 rounded-xl font-bold hover:bg-[#D4B885] transition-all transform hover:scale-105 flex items-center space-x-2"
                  disabled={!state.userInfo.birthDate || !state.userInfo.birthTime || !state.userInfo.gender}
                >
                  <span>Analyze Star Chart</span>
                  <MoveDown className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {state.phase === 'result' && state.result && (
          <div className="bg-[#2C2A4A] rounded-3xl p-8 shadow-2xl border border-[#C0A573]/20 max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#F0F0F0] mb-3">Your Star Chart Analysis</h2>
              <p className="text-lg text-[#C0A573]">
                {state.userInfo.name ? state.userInfo.name + ", " : ""}Based on your birth information, here is your star chart.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-[#1a1830] rounded-xl p-6 border border-[#C0A573]/10 text-center">
                <h3 className="text-xl font-bold text-[#C0A573] mb-3">Natal Star</h3>
                <div className="text-3xl font-bold text-[#F0F0F0] mb-2">{state.result.mainStar.name}</div>
                <div className="text-[#C0A573]">{state.result.mainStar.group}</div>
              </div>
              
              <div className="bg-[#1a1830] rounded-xl p-6 border border-[#C0A573]/10 text-center">
                <h3 className="text-xl font-bold text-[#C0A573] mb-3">Five Elements Attribute</h3>
                <div className="text-3xl font-bold text-[#F0F0F0] mb-2">{state.result.element}</div>
                <div className="text-[#C0A573]">The dominant five elements of your chart</div>
              </div>
              
              <div className="bg-[#1a1830] rounded-xl p-6 border border-[#C0A573]/10 text-center">
                <h3 className="text-xl font-bold text-[#C0A573] mb-3">Guardian Beast</h3>
                <div className="text-3xl font-bold text-[#F0F0F0] mb-2">{state.result.guardian}</div>
                <div className="text-[#C0A573]">Your chart's guardian symbol</div>
              </div>
            </div>

            <div className="bg-[#1a1830] rounded-xl p-6 border border-[#C0A573]/10 mb-10">
              <h3 className="text-2xl font-bold text-[#C0A573] mb-6 text-center">Star Personality Analysis</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="text-lg font-semibold text-[#F0F0F0] mb-3 flex items-center">
                    <Star className="h-5 w-5 text-[#C0A573] mr-2" />
                    Personality Strengths
                  </h4>
                  <ul className="list-disc list-inside text-[#F0F0F0] space-y-2">
                    {state.result.strengths.map((strength: string, index: number) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-[#F0F0F0] mb-3 flex items-center">
                    <Info className="h-5 w-5 text-[#C0A573] mr-2" />
                    Personality Challenges
                  </h4>
                  <ul className="list-disc list-inside text-[#F0F0F0] space-y-2">
                    {state.result.challenges.map((challenge: string, index: number) => (
                      <li key={index}>{challenge}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-[#C0A573]/20 pt-6 mt-6">
                <h4 className="text-lg font-semibold text-[#F0F0F0] mb-3">Destiny Outlook</h4>
                <p className="text-[#C0A573] leading-relaxed">{state.result.destiny}</p>
              </div>
            </div>

            <div className="bg-[#1a1830] rounded-xl p-6 border border-[#C0A573]/10 mb-10">
              <h3 className="text-2xl font-bold text-[#C0A573] mb-6 text-center">Star Guidance</h3>
              <p className="text-[#F0F0F0] mb-6 leading-relaxed">{state.result.guidance}</p>
              
              <div className="bg-[#2C2A4A] rounded-lg p-4 border border-[#C0A573]/10">
                <h4 className="text-lg font-semibold text-[#C0A573] mb-2">Lucky Directions</h4>
                <p className="text-[#F0F0F0]">{state.result.luckyDirections.join(', ')}</p>
              </div>
            </div>

            <div className="flex justify-center mt-10">
              <button
                onClick={resetForm}
                className="bg-[#C0A573] text-[#1a1830] px-8 py-3 rounded-xl font-bold hover:bg-[#D4B885] transition-all transform hover:scale-105"
              >
                Re-analyze
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

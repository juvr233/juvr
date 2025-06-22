import React, { useState } from 'react';
import { Heart, Users, Calculator, ArrowRight, Star } from 'lucide-react';
import { calculateLifePath, calculateCompatibility } from '../utils/numerology';

interface CompatibilityResult {
  score: number;
  description: string;
  person1Number: number;
  person2Number: number;
}

export default function CompatibilityPage() {
  const [person1, setPerson1] = useState({
    name: '',
    birthDate: ''
  });
  const [person2, setPerson2] = useState({
    name: '',
    birthDate: ''
  });
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async () => {
    if (!person1.name || !person1.birthDate || !person2.name || !person2.birthDate) {
      return;
    }

    setIsCalculating(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Convert date format from YYYY-MM-DD to MM/DD/YYYY for calculation
    const formatDateForCalculation = (dateStr: string) => {
      const [year, month, day] = dateStr.split('-');
      return `${month}/${day}/${year}`;
    };

    const person1Number = calculateLifePath(formatDateForCalculation(person1.birthDate));
    const person2Number = calculateLifePath(formatDateForCalculation(person2.birthDate));
    const compatibility = calculateCompatibility(person1Number, person2Number);

    setResult({
      ...compatibility,
      person1Number,
      person2Number
    });

    setIsCalculating(false);
  };

  const getScoreColor = (score: number) => {
    return 'text-[#C0A573]';
  };

  const getScoreGradient = (score: number) => {
    return 'bg-[#C0A573]';
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="bg-[#C0A573]/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Heart className="h-10 w-10 text-[#C0A573]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#F0F0F0] mb-4">
            Compatibility Analysis
          </h1>
          <p className="text-xl text-[#C0A573] max-w-2xl mx-auto">
            Discover the numerological compatibility between you and someone special. 
            Understanding your numbers can strengthen any relationship.
          </p>
        </div>

        <div className="bg-[#4F4C7A] rounded-3xl p-8 md:p-12 shadow-2xl border border-[#C0A573]/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Person 1 */}
            <div className="bg-[#2C2A4A] rounded-2xl p-6 border border-[#C0A573]/10">
              <h3 className="text-xl font-bold text-[#F0F0F0] mb-6 flex items-center">
                <Users className="h-5 w-5 mr-2 text-[#C0A573]" />
                First Person
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[#F0F0F0] font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    value={person1.name}
                    onChange={(e) => setPerson1({ ...person1, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#4F4C7A] border border-[#C0A573]/30 text-[#F0F0F0] placeholder-[#C0A573]/50 focus:outline-none focus:ring-2 focus:ring-[#C0A573] focus:border-transparent"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block text-[#F0F0F0] font-semibold mb-2">Birth Date</label>
                  <input
                    type="date"
                    value={person1.birthDate}
                    onChange={(e) => setPerson1({ ...person1, birthDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#4F4C7A] border border-[#C0A573]/30 text-[#F0F0F0] focus:outline-none focus:ring-2 focus:ring-[#C0A573] focus:border-transparent"
                  />
                  <p className="text-[#C0A573]/70 text-xs mt-1 italic">
                    Will be calculated as MM/DD/YYYY format
                  </p>
                </div>
              </div>
            </div>

            {/* Person 2 */}
            <div className="bg-[#2C2A4A] rounded-2xl p-6 border border-[#C0A573]/10">
              <h3 className="text-xl font-bold text-[#F0F0F0] mb-6 flex items-center">
                <Users className="h-5 w-5 mr-2 text-[#C0A573]" />
                Second Person
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[#F0F0F0] font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    value={person2.name}
                    onChange={(e) => setPerson2({ ...person2, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#4F4C7A] border border-[#C0A573]/30 text-[#F0F0F0] placeholder-[#C0A573]/50 focus:outline-none focus:ring-2 focus:ring-[#C0A573] focus:border-transparent"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block text-[#F0F0F0] font-semibold mb-2">Birth Date</label>
                  <input
                    type="date"
                    value={person2.birthDate}
                    onChange={(e) => setPerson2({ ...person2, birthDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#4F4C7A] border border-[#C0A573]/30 text-[#F0F0F0] focus:outline-none focus:ring-2 focus:ring-[#C0A573] focus:border-transparent"
                  />
                  <p className="text-[#C0A573]/70 text-xs mt-1 italic">
                    Will be calculated as MM/DD/YYYY format
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={isCalculating || !person1.name || !person1.birthDate || !person2.name || !person2.birthDate}
            className="w-full bg-[#C0A573] text-[#2C2A4A] font-bold py-6 px-8 rounded-2xl hover:bg-[#D4B885] transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-xl mb-8"
          >
            {isCalculating ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-3 border-[#2C2A4A] border-t-transparent"></div>
                <span>Analyzing Compatibility...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Calculator className="h-6 w-6" />
                <span>Calculate Compatibility</span>
              </div>
            )}
          </button>

          {result && (
            <div className="space-y-8">
              {/* Compatibility Score */}
              <div className="text-center">
                <div className={`text-6xl font-bold ${getScoreColor(result.score)} mb-4`}>
                  {result.score}%
                </div>
                <div className="w-full bg-[#2C2A4A] rounded-full h-4 mb-6">
                  <div 
                    className={`${getScoreGradient(result.score)} h-4 rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${result.score}%` }}
                  ></div>
                </div>
                <p className="text-xl text-[#F0F0F0] max-w-2xl mx-auto">
                  {result.description}
                </p>
              </div>

              {/* Individual Numbers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#2C2A4A] rounded-2xl p-6 border border-[#C0A573]/10 text-center">
                  <h4 className="text-lg font-semibold text-[#C0A573] mb-2">{person1.name}</h4>
                  <div className="text-3xl font-bold text-[#F0F0F0] mb-2">Life Path {result.person1Number}</div>
                  <p className="text-[#C0A573] text-sm">Primary life path energy</p>
                </div>
                <div className="bg-[#2C2A4A] rounded-2xl p-6 border border-[#C0A573]/10 text-center">
                  <h4 className="text-lg font-semibold text-[#C0A573] mb-2">{person2.name}</h4>
                  <div className="text-3xl font-bold text-[#F0F0F0] mb-2">Life Path {result.person2Number}</div>
                  <p className="text-[#C0A573] text-sm">Primary life path energy</p>
                </div>
              </div>

              {/* Compatibility Insights */}
              <div className="bg-[#2C2A4A] rounded-2xl p-8 border border-[#C0A573]/10">
                <h3 className="text-2xl font-bold text-[#F0F0F0] mb-6 text-center">
                  Relationship Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-[#C0A573] mb-4 flex items-center">
                      <Star className="h-5 w-5 mr-2" />
                      Strengths Together
                    </h4>
                    <ul className="space-y-2 text-[#F0F0F0]">
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-[#C0A573] mr-2 mt-1 flex-shrink-0" />
                        Complementary energies that balance each other
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-[#C0A573] mr-2 mt-1 flex-shrink-0" />
                        Shared values and life perspectives
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-[#C0A573] mr-2 mt-1 flex-shrink-0" />
                        Natural understanding and communication
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-[#C0A573] mb-4 flex items-center">
                      <Star className="h-5 w-5 mr-2" />
                      Growth Opportunities
                    </h4>
                    <ul className="space-y-2 text-[#F0F0F0]">
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-[#C0A573] mr-2 mt-1 flex-shrink-0" />
                        Learning patience and understanding
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-[#C0A573] mr-2 mt-1 flex-shrink-0" />
                        Embracing different approaches to life
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-[#C0A573] mr-2 mt-1 flex-shrink-0" />
                        Supporting each other's individual growth
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Calculator, Calendar, User, Heart, Star } from 'lucide-react';

interface CalculatorProps {
  onCalculate?: (results: NumerologyResults) => void;
}

interface NumerologyResults {
  lifePathNumber: number;
  expressionNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  birthDayNumber: number;
}

export default function NumerologyCalculator({ onCalculate }: CalculatorProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
  });
  const [results, setResults] = useState<NumerologyResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateLifePath = (birthDate: string): number => {
    const digits = birthDate.replace(/\D/g, '');
    let sum = digits.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    
    return sum;
  };

  const calculateNameNumber = (name: string): number => {
    const letterValues: { [key: string]: number } = {
      A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
      J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
      S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
    };

    let sum = name.toUpperCase().split('').reduce((acc, letter) => {
      return acc + (letterValues[letter] || 0);
    }, 0);

    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }

    return sum;
  };

  const calculateSoulUrge = (name: string): number => {
    const vowels = 'AEIOU';
    const vowelString = name.toUpperCase().split('').filter(letter => vowels.includes(letter)).join('');
    return calculateNameNumber(vowelString);
  };

  const calculatePersonality = (name: string): number => {
    const vowels = 'AEIOU';
    const consonantString = name.toUpperCase().split('').filter(letter => /[A-Z]/.test(letter) && !vowels.includes(letter)).join('');
    return calculateNameNumber(consonantString);
  };

  const handleCalculate = async () => {
    if (!formData.firstName || !formData.lastName || !formData.birthDate) {
      return;
    }

    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    const fullName = `${formData.firstName} ${formData.lastName}`;
    const calculatedResults: NumerologyResults = {
      lifePathNumber: calculateLifePath(formData.birthDate),
      expressionNumber: calculateNameNumber(fullName),
      soulUrgeNumber: calculateSoulUrge(fullName),
      personalityNumber: calculatePersonality(fullName),
      birthDayNumber: parseInt(formData.birthDate.split('-')[2]) || 1,
    };

    setResults(calculatedResults);
    setIsCalculating(false);
    onCalculate?.(calculatedResults);
  };

  const getNumberMeaning = (number: number, type: string): string => {
    const meanings: { [key: string]: { [key: number]: string } } = {
      lifePath: {
        1: "The Leader - Independent, pioneering, and ambitious",
        2: "The Peacemaker - Cooperative, diplomatic, and sensitive",
        3: "The Creative - Artistic, expressive, and optimistic",
        4: "The Builder - Practical, organized, and hardworking",
        5: "The Explorer - Adventurous, freedom-loving, and versatile",
        6: "The Nurturer - Caring, responsible, and family-oriented",
        7: "The Seeker - Analytical, spiritual, and introspective",
        8: "The Achiever - Ambitious, material success, and leadership",
        9: "The Humanitarian - Compassionate, generous, and idealistic",
        11: "The Intuitive - Highly intuitive, inspirational, and spiritual",
        22: "The Master Builder - Visionary, practical idealist, and powerful",
        33: "The Master Teacher - Highly evolved, compassionate leader"
      }
    };

    return meanings[type]?.[number] || "A unique path of discovery and growth";
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-[#4F4C7A] rounded-3xl p-8 shadow-2xl border border-[#C0A573]/20">
        <div className="text-center mb-8">
          <div className="bg-[#C0A573]/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calculator className="h-8 w-8 text-[#C0A573]" />
          </div>
          <h2 className="text-3xl font-bold text-[#F0F0F0] mb-2">Numerology Calculator</h2>
          <p className="text-[#C0A573]">Enter your details to discover your numerological profile</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-[#F0F0F0] font-semibold mb-2">
              <User className="inline h-4 w-4 mr-2" />
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#2C2A4A] border border-[#C0A573]/30 text-[#F0F0F0] placeholder-[#C0A573]/50 focus:outline-none focus:ring-2 focus:ring-[#C0A573] focus:border-transparent"
              placeholder="Enter your first name"
            />
          </div>

          <div>
            <label className="block text-[#F0F0F0] font-semibold mb-2">
              <User className="inline h-4 w-4 mr-2" />
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#2C2A4A] border border-[#C0A573]/30 text-[#F0F0F0] placeholder-[#C0A573]/50 focus:outline-none focus:ring-2 focus:ring-[#C0A573] focus:border-transparent"
              placeholder="Enter your last name"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[#F0F0F0] font-semibold mb-2">
              <Calendar className="inline h-4 w-4 mr-2" />
              Birth Date
            </label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#2C2A4A] border border-[#C0A573]/30 text-[#F0F0F0] focus:outline-none focus:ring-2 focus:ring-[#C0A573] focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={isCalculating || !formData.firstName || !formData.lastName || !formData.birthDate}
          className="w-full bg-[#C0A573] text-[#2C2A4A] font-bold py-4 px-8 rounded-xl hover:bg-[#D4B885] transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isCalculating ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#2C2A4A] border-t-transparent"></div>
              <span>Calculating Your Destiny...</span>
            </div>
          ) : (
            'Calculate My Numbers'
          )}
        </button>

        {results && (
          <div className="mt-12 space-y-6">
            <h3 className="text-2xl font-bold text-[#F0F0F0] text-center mb-8">Your Numerology Profile</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#2C2A4A] rounded-2xl p-6 border border-[#C0A573]/20">
                <div className="flex items-center mb-4">
                  <Star className="h-6 w-6 text-[#C0A573] mr-2" />
                  <h4 className="text-lg font-semibold text-[#F0F0F0]">Life Path</h4>
                </div>
                <div className="text-3xl font-bold text-[#C0A573] mb-2">{results.lifePathNumber}</div>
                <p className="text-[#C0A573] text-sm">{getNumberMeaning(results.lifePathNumber, 'lifePath')}</p>
              </div>

              <div className="bg-[#2C2A4A] rounded-2xl p-6 border border-[#C0A573]/20">
                <div className="flex items-center mb-4">
                  <User className="h-6 w-6 text-[#C0A573] mr-2" />
                  <h4 className="text-lg font-semibold text-[#F0F0F0]">Expression</h4>
                </div>
                <div className="text-3xl font-bold text-[#C0A573] mb-2">{results.expressionNumber}</div>
                <p className="text-[#C0A573] text-sm">Your natural talents and abilities</p>
              </div>

              <div className="bg-[#2C2A4A] rounded-2xl p-6 border border-[#C0A573]/20">
                <div className="flex items-center mb-4">
                  <Heart className="h-6 w-6 text-[#C0A573] mr-2" />
                  <h4 className="text-lg font-semibold text-[#F0F0F0]">Soul Urge</h4>
                </div>
                <div className="text-3xl font-bold text-[#C0A573] mb-2">{results.soulUrgeNumber}</div>
                <p className="text-[#C0A573] text-sm">Your inner desires and motivations</p>
              </div>

              <div className="bg-[#2C2A4A] rounded-2xl p-6 border border-[#C0A573]/20">
                <div className="flex items-center mb-4">
                  <User className="h-6 w-6 text-[#C0A573] mr-2" />
                  <h4 className="text-lg font-semibold text-[#F0F0F0]">Personality</h4>
                </div>
                <div className="text-3xl font-bold text-[#C0A573] mb-2">{results.personalityNumber}</div>
                <p className="text-[#C0A573] text-sm">How others perceive you</p>
              </div>

              <div className="bg-[#2C2A4A] rounded-2xl p-6 border border-[#C0A573]/20">
                <div className="flex items-center mb-4">
                  <Calendar className="h-6 w-6 text-[#C0A573] mr-2" />
                  <h4 className="text-lg font-semibold text-[#F0F0F0]">Birth Day</h4>
                </div>
                <div className="text-3xl font-bold text-[#C0A573] mb-2">{results.birthDayNumber}</div>
                <p className="text-[#C0A573] text-sm">Your special talents and gifts</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button className="bg-[#2C2A4A] border border-[#C0A573]/30 text-[#F0F0F0] px-8 py-3 rounded-xl hover:bg-[#2C2A4A]/80 transition-all duration-300">
                Get Detailed Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
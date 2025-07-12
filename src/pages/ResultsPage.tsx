import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductRecommendation from '../components/ProductRecommendation';
import api from '../services/api';
import { Star, User, Heart, Calendar, TrendingUp, ArrowRight, Download, Share2 } from 'lucide-react';
import { useNumerology } from '../context/NumerologyContext';
import { getNumberInterpretation } from '../utils/numerology';

export default function ResultsPage() {
  const navigate = useNavigate();
  const { currentReading, userProfile } = useNumerology();

  if (!currentReading || !userProfile) {
    navigate('/calculator');
    return null;
  }

  const numbers = [
    {
      type: 'Life Path',
      number: currentReading.lifePathNumber,
      icon: Star,
      color: 'bg-[#C0A573]/20',
      textColor: 'text-[#C0A573]',
      description: 'Your core life purpose and the path you\'re meant to walk'
    },
    {
      type: 'Expression',
      number: currentReading.expressionNumber,
      icon: User,
      color: 'bg-[#C0A573]/20',
      textColor: 'text-[#C0A573]',
      description: 'Your natural talents, abilities, and how you express yourself'
    },
    {
      type: 'Soul Urge',
      number: currentReading.soulUrgeNumber,
      icon: Heart,
      color: 'bg-[#C0A573]/20',
      textColor: 'text-[#C0A573]',
      description: 'Your inner desires, motivations, and what drives you'
    },
    {
      type: 'Personality',
      number: currentReading.personalityNumber,
      icon: User,
      color: 'bg-[#C0A573]/20',
      textColor: 'text-[#C0A573]',
      description: 'How others perceive you and your outer personality'
    },
    {
      type: 'Birth Day',
      number: currentReading.birthDayNumber,
      icon: Calendar,
      color: 'bg-[#C0A573]/20',
      textColor: 'text-[#C0A573]',
      description: 'Your special talents and gifts from your birth day'
    },
    {
      type: 'Personal Year',
      number: currentReading.personalYearNumber,
      icon: TrendingUp,
      color: 'bg-[#C0A573]/20',
      textColor: 'text-[#C0A573]',
      description: 'The energy and opportunities in your current year cycle'
    }
  ];

  const lifePathInterpretation = getNumberInterpretation(currentReading.lifePathNumber);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.post('/recommendations', {
          numerologyData: {
            lifePathNumber: currentReading.lifePathNumber,
            expressionNumber: currentReading.expressionNumber,
            soulUrgeNumber: currentReading.soulUrgeNumber,
          },
        });
        setRecommendedProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch recommendations', error);
      }
    };

    fetchRecommendations();
  }, [currentReading]);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header with Sacred Name */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#F0F0F0] mb-4">
            Your Sacred Numerology Chronicle
          </h1>
          <p className="text-xl text-[#C0A573] mb-2">
            Welcome {userProfile.sacredName ? `${userProfile.sacredName}` : userProfile.firstName}, 
            here's your complete numerological analysis
          </p>
          <p className="text-[#C0A573]/70 italic text-sm mb-6">
            "The numbers have spoken, and your destiny path is illuminated"
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-[#4F4C7A] border border-[#C0A573]/30 text-[#F0F0F0] px-6 py-3 rounded-xl hover:bg-[#4F4C7A]/80 transition-all duration-300 flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Download Sacred Report</span>
            </button>
            <button className="bg-[#4F4C7A] border border-[#C0A573]/30 text-[#F0F0F0] px-6 py-3 rounded-xl hover:bg-[#4F4C7A]/80 transition-all duration-300 flex items-center space-x-2">
              <Share2 className="h-4 w-4" />
              <span>Share Your Chronicle</span>
            </button>
          </div>
        </div>

        {/* Sacred Blessing */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-br from-[#2C2A4A]/70 to-[#4F4C7A]/50 rounded-2xl p-8 border border-[#C0A573]/20 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-[#C0A573] mb-4 italic">Sacred Blessing</h2>
            <p className="text-[#F0F0F0] italic leading-relaxed text-lg">
              "The ancient wisdom of numbers has revealed itself to you, {userProfile.sacredName ? `dear ${userProfile.sacredName}` : 'beloved soul'}. 
              These sacred calculations illuminate the divine blueprint of your existence, 
              showing you the path your soul chose before entering this earthly realm."
            </p>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#C0A573] to-transparent mx-auto mt-6"></div>
          </div>
        </div>

        {/* Numbers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {numbers.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.type} className="bg-[#4F4C7A] rounded-3xl p-8 border border-[#C0A573]/20 hover:bg-[#4F4C7A]/80 transition-all duration-300 group">
                <div className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#C0A573]/30 transition-all duration-300`}>
                  <Icon className="h-8 w-8 text-[#C0A573]" />
                </div>
                <h3 className="text-2xl font-bold text-[#F0F0F0] mb-2">{item.type}</h3>
                <div className={`text-5xl font-bold ${item.textColor} mb-4`}>{item.number}</div>
                <p className="text-[#C0A573] text-sm leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* Detailed Life Path Analysis */}
        <div className="bg-[#4F4C7A] rounded-3xl p-8 md:p-12 border border-[#C0A573]/20 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#F0F0F0] mb-4">
              Life Path {currentReading.lifePathNumber}: {lifePathInterpretation.title}
            </h2>
            <p className="text-xl text-[#C0A573] max-w-4xl mx-auto leading-relaxed italic">
              "The sacred number {currentReading.lifePathNumber} illuminates your soul's chosen journey. {lifePathInterpretation.description}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#2C2A4A] rounded-2xl p-6 border border-[#C0A573]/10">
              <h3 className="text-xl font-bold text-[#C0A573] mb-4">Sacred Strengths</h3>
              <ul className="space-y-2">
                {lifePathInterpretation.strengths.map((strength, index) => (
                  <li key={index} className="text-[#F0F0F0] flex items-center">
                    <div className="w-2 h-2 bg-[#C0A573] rounded-full mr-3"></div>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#2C2A4A] rounded-2xl p-6 border border-[#C0A573]/10">
              <h3 className="text-xl font-bold text-[#C0A573] mb-4">Soul Lessons</h3>
              <ul className="space-y-2">
                {lifePathInterpretation.challenges.map((challenge, index) => (
                  <li key={index} className="text-[#F0F0F0] flex items-center">
                    <div className="w-2 h-2 bg-[#C0A573] rounded-full mr-3"></div>
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#2C2A4A] rounded-2xl p-6 border border-[#C0A573]/10">
              <h3 className="text-xl font-bold text-[#C0A573] mb-4">Divine Callings</h3>
              <ul className="space-y-2">
                {lifePathInterpretation.careerPaths.map((career, index) => (
                  <li key={index} className="text-[#F0F0F0] flex items-center">
                    <div className="w-2 h-2 bg-[#C0A573] rounded-full mr-3"></div>
                    {career}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Personal Year Insights */}
        <div className="bg-[#4F4C7A] rounded-3xl p-8 md:p-12 border border-[#C0A573]/20 mb-12">
          <h2 className="text-3xl font-bold text-[#F0F0F0] mb-6 text-center">
            Your Sacred Year {currentReading.personalYearNumber} Cycle
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-[#C0A573] mb-4">Divine Energy of This Year</h3>
              <p className="text-[#F0F0F0] leading-relaxed mb-6 italic">
                "The universe has aligned to bring you the energy of {currentReading.personalYearNumber}. 
                {currentReading.personalYearNumber === 1 && "This is a sacred year of new beginnings, leadership, and independence. The cosmos calls you to start fresh projects and take divine initiative."}
                {currentReading.personalYearNumber === 2 && "This is a sacred year of cooperation, partnerships, and patience. The universe guides you to focus on relationships and collaborative spiritual efforts."}
                {currentReading.personalYearNumber === 3 && "This is a sacred year of creativity, communication, and self-expression. The divine calls you to share your sacred talents with the world."}
                {currentReading.personalYearNumber === 4 && "This is a sacred year of hard work, organization, and building foundations. The universe asks you to focus on practical matters and long-term spiritual goals."}
                {currentReading.personalYearNumber === 5 && "This is a sacred year of freedom, adventure, and change. The cosmos invites you to embrace new experiences and opportunities for soul growth."}
                {currentReading.personalYearNumber === 6 && "This is a sacred year of responsibility, family, and service. The divine guides you to focus on home, relationships, and helping others on their journey."}
                {currentReading.personalYearNumber === 7 && "This is a sacred year of introspection, spirituality, and inner growth. The universe calls you to study, meditate, and discover your deeper self."}
                {currentReading.personalYearNumber === 8 && "This is a sacred year of achievement, material success, and recognition. The cosmos aligns to support your career advancement and financial goals."}
                {currentReading.personalYearNumber === 9 && "This is a sacred year of completion, letting go, and humanitarian service. The divine asks you to finish projects and serve others with compassion."}"
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#C0A573] mb-4">Sacred Opportunities</h3>
              <ul className="space-y-3 text-[#F0F0F0]">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#C0A573] mr-2 mt-0.5 flex-shrink-0" />
                  Focus on personal development and sacred skill building
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#C0A573] mr-2 mt-0.5 flex-shrink-0" />
                  Strengthen important soul connections in your life
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#C0A573] mr-2 mt-0.5 flex-shrink-0" />
                  Pursue goals aligned with your divine life path number
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#C0A573] mr-2 mt-0.5 flex-shrink-0" />
                  Trust your sacred intuition and inner divine wisdom
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sacred Chronicle Blessing */}
        <div className="text-center mb-12 p-8 bg-gradient-to-br from-[#2C2A4A]/70 to-[#4F4C7A]/50 rounded-2xl border border-[#C0A573]/20">
          <h3 className="text-2xl font-bold text-[#C0A573] mb-6 italic">Sacred Chronicle Blessing</h3>
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-[#F0F0F0] italic leading-relaxed text-lg">
              "The sacred numbers have revealed their ancient wisdom to you, {userProfile.sacredName ? `dear ${userProfile.sacredName}` : 'beloved soul'}. 
              Your numerological blueprint has been inscribed in the cosmic records, 
              showing you the divine path your soul chose before entering this earthly realm."
            </p>
            <p className="text-[#C0A573] leading-relaxed">
              "Remember, sacred seeker, that you hold the divine power to shape your destiny through conscious choice 
              and mindful action. The numbers illuminate the path, but you must walk it with courage and sacred wisdom."
            </p>
            <p className="text-[#F0F0F0]/80 italic text-base">
              "May this sacred reading serve as a guiding light on your spiritual journey. Trust in yourself, 
              for the universe conspires to support those who listen to their divine hearts."
            </p>
            {userProfile.sacredName && (
              <p className="text-[#C0A573]/80 text-sm italic mt-6">
                "This sacred numerology reading has been recorded in your Soul Chronicle, {userProfile.sacredName}. 
                Return anytime to continue your spiritual journey of self-discovery."
              </p>
            )}
          </div>
        </div>

        {/* Product Recommendations */}
        <ProductRecommendation products={recommendedProducts} />

        {/* Next Steps */}
        <div className="text-center mt-12">
          <h2 className="text-3xl font-bold text-[#F0F0F0] mb-8">Continue Your Sacred Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Link
              to="/compatibility"
              className="bg-[#4F4C7A] text-[#F0F0F0] p-6 rounded-2xl hover:bg-[#4F4C7A]/80 transform hover:scale-105 transition-all duration-300 group border border-[#C0A573]/20"
            >
              <Heart className="h-8 w-8 mx-auto mb-4 text-[#C0A573] group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Sacred Compatibility</h3>
              <p className="text-[#C0A573]">Discover how your soul connects with others</p>
            </Link>
            <Link
              to="/tarot?cards=3"
              className="bg-[#4F4C7A] text-[#F0F0F0] p-6 rounded-2xl hover:bg-[#4F4C7A]/80 transform hover:scale-105 transition-all duration-300 group border border-[#C0A573]/20"
            >
              <Star className="h-8 w-8 mx-auto mb-4 text-[#C0A573] group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Sacred Tarot Reading</h3>
              <p className="text-[#C0A573]">Receive mystical guidance from the cards</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

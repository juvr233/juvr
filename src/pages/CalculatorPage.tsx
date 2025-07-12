import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Calendar, User, Heart, Star, Sparkles } from 'lucide-react';
import { getNumerologyProfile } from '../utils/numerology';
import { useNumerology } from '../context/NumerologyContext';
import SoulChronicleLogin from '../components/SoulChronicleLogin';

export default function CalculatorPage() {
  const navigate = useNavigate();
  const { setCurrentReading, setUserProfile } = useNumerology();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [calculatedProfile, setCalculatedProfile] = useState(null);

  const handleCalculate = async () => {
    if (!formData.firstName || !formData.lastName || !formData.birthDate) {
      return;
    }

    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Convert date format from YYYY-MM-DD to MM/DD/YYYY for calculation
    const formatDateForCalculation = (dateStr: string) => {
      const [year, month, day] = dateStr.split('-');
      return `${month}/${day}/${year}`;
    };

    const profile = getNumerologyProfile(
      formData.firstName, 
      formData.lastName, 
      formatDateForCalculation(formData.birthDate)
    );
    
    // Store the calculated profile and show login
    setCalculatedProfile(profile);
    setIsCalculating(false);
    setShowLogin(true);
  };

  const handleLoginSuccess = (userData) => {
    // Update context with both profile and calculated results
    setCurrentReading(calculatedProfile);
    setUserProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      birthDate: formData.birthDate,
      numerologyProfile: calculatedProfile,
      readingHistory: [],
      sacredName: userData.sacredName
    });

    // Navigate to results
    navigate('/results');
  };

  const handleLoginCancel = () => {
    setShowLogin(false);
    setCalculatedProfile(null);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="bg-[#8A2BE2]/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Calculator className="h-10 w-10 text-[#8A2BE2]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#FFFFFF] mb-4">
            Numerology Calculator
          </h1>
          <p className="text-xl text-[#A0A0A0] max-w-2xl mx-auto">
            Enter your details below to discover your complete numerological profile and unlock the secrets of your destiny.
          </p>
        </div>

        <div className="bg-[#22232E] rounded-3xl p-8 md:p-12 shadow-2xl border border-[#8A2BE2]/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <label className="block text-[#FFFFFF] font-semibold text-lg">
                <User className="inline h-5 w-5 mr-2" />
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-6 py-4 rounded-2xl bg-[#101118] border border-[#8A2BE2]/30 text-[#FFFFFF] placeholder-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#8A2BE2] focus:border-transparent text-lg"
                placeholder="Enter your first name"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[#FFFFFF] font-semibold text-lg">
                <User className="inline h-5 w-5 mr-2" />
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-6 py-4 rounded-2xl bg-[#101118] border border-[#8A2BE2]/30 text-[#FFFFFF] placeholder-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#8A2BE2] focus:border-transparent text-lg"
                placeholder="Enter your last name"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-[#FFFFFF] font-semibold text-lg">
                <Calendar className="inline h-5 w-5 mr-2" />
                Birth Date
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full px-6 py-4 rounded-2xl bg-[#101118] border border-[#8A2BE2]/30 text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#8A2BE2] focus:border-transparent text-lg"
              />
              <p className="text-[#A0A0A0] text-sm italic">
                Your birth date will be calculated in MM/DD/YYYY format for numerological accuracy
              </p>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="bg-[#101118] rounded-2xl p-6 border border-[#8A2BE2]/10">
              <h3 className="text-[#FFFFFF] font-semibold mb-4 flex items-center justify-center">
                <Sparkles className="h-5 w-5 mr-2 text-[#8A2BE2]" />
                What You'll Discover
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#A0A0A0]">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-[#8A2BE2]" />
                  <span>Life Path Number & Purpose</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-[#8A2BE2]" />
                  <span>Expression & Personality Numbers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-[#8A2BE2]" />
                  <span>Soul Urge & Inner Desires</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-[#8A2BE2]" />
                  <span>Personal Year Forecast</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={isCalculating || !formData.firstName || !formData.lastName || !formData.birthDate}
            className="w-full bg-[#8A2BE2] text-[#FFFFFF] font-bold py-6 px-8 rounded-2xl hover:bg-[#FF00FF] transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-xl"
          >
            {isCalculating ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-3 border-[#FFFFFF] border-t-transparent"></div>
                <span>Calculating Your Destiny...</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[#FFFFFF] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#FFFFFF] rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-[#FFFFFF] rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Calculator className="h-6 w-6" />
                <span>Calculate My Numbers</span>
              </div>
            )}
          </button>

          <div className="mt-8 text-center text-[#A0A0A0] text-sm">
            <p>Your information is secure and will never be shared with third parties.</p>
            <p className="mt-2 italic">
              Note: Birth dates are processed in MM/DD/YYYY format for traditional numerological calculations
            </p>
          </div>
        </div>
      </div>

      {/* Soul Chronicle Login Modal */}
      {showLogin && (
        <SoulChronicleLogin
          onLoginSuccess={handleLoginSuccess}
          onCancel={handleLoginCancel}
        />
      )}
    </div>
  );
}
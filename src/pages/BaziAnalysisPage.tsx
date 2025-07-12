import React, { useState } from 'react';
import { Calendar, Clock, User, MapPin, Sparkles, ArrowRight, Briefcase, Heart, Shield, Users } from 'lucide-react';
import { calculateChineseBaZi, BaziChart, BaziColumn } from '../utils/ichingExtended';

interface BaziState {
  phase: 'welcome' | 'input' | 'result';
  userInfo: {
    name: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    gender: string;
  };
  baziChart: BaziChart | null;
}

export default function BaziAnalysisPage() {
  const [state, setState] = useState<BaziState>({
    phase: 'welcome',
    userInfo: {
      name: '',
      birthDate: '',
      birthTime: '',
      birthPlace: '',
      gender: ''
    },
    baziChart: null
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
    const { birthDate, birthTime } = state.userInfo;
    
    if (!birthDate || !birthTime) return;
    
    const birthDateTime = new Date(`${birthDate}T${birthTime}`);
    const baziChart = calculateChineseBaZi(birthDateTime);
    
    setState(prev => ({ ...prev, baziChart, phase: 'result' }));
  };

  const resetForm = () => {
    setState({
      phase: 'welcome',
      userInfo: {
        name: '',
        birthDate: '',
        birthTime: '',
        birthPlace: '',
        gender: ''
      },
      baziChart: null
    });
  };

  const getElementColor = (element: string): string => {
    switch(element) {
      case 'Wood': return 'text-green-500';
      case 'Fire': return 'text-red-500';
      case 'Earth': return 'text-yellow-500';
      case 'Metal': return 'text-gray-300';
      case 'Water': return 'text-blue-500';
      default: return 'text-white';
    }
  };

  const getBgElementColor = (element: string): string => {
    switch(element) {
      case 'Wood': return 'bg-green-500/20';
      case 'Fire': return 'bg-red-500/20';
      case 'Earth': return 'bg-yellow-500/20';
      case 'Metal': return 'bg-gray-300/20';
      case 'Water': return 'bg-blue-500/20';
      default: return 'bg-white/20';
    }
  };

  const renderBaziColumn = (column?: BaziColumn, title?: string) => {
    if (!column) return null;
    
    const strengthLevel = column.strength && column.strength > 70 
      ? 'Strong' 
      : column.strength && column.strength < 40 
        ? 'Weak' 
        : 'Medium';
        
    return (
      <div className="bg-[#2C2A4A] rounded-xl p-4 border border-[#C0A573]/20 text-center">
        <h3 className="text-lg font-medium text-[#C0A573] mb-2">{title}</h3>
        <div className="flex justify-center items-center gap-2 mb-3">
          <span className={`text-2xl font-bold ${getElementColor(column.stemElement || '')}`}>
            {column.stem}
          </span>
          <span className={`text-2xl font-bold ${getElementColor(column.branchElement || '')}`}>
            {column.branch}
          </span>
        </div>
        <div className="text-sm text-[#F0F0F0]">
          <div className="flex justify-between mb-1">
            <span>Stem Element:</span>
            <span className={getElementColor(column.stemElement || '')}>
              {column.stemElement}
            </span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Branch Element:</span>
            <span className={getElementColor(column.branchElement || '')}>
              {column.branchElement}
            </span>
          </div>
          {column.hiddenElements && column.hiddenElements.length > 0 && (
            <div className="flex justify-between mb-1">
              <span>Hidden Stems:</span>
              <span>
                {column.hiddenElements.map((elem, i) => (
                  <span key={i} className={getElementColor(elem)}>
                    {elem}{i < column.hiddenElements!.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </span>
            </div>
          )}
          <div className="flex justify-between mb-1">
            <span>Relation:</span>
            <span>{column.stemBranchRelation}</span>
          </div>
          <div className="flex justify-between">
            <span>Strength:</span>
            <span className={
              strengthLevel === 'Strong' ? 'text-red-400' :
              strengthLevel === 'Weak' ? 'text-blue-400' :
              'text-yellow-400'
            }>
              {strengthLevel} ({column.strength})
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderElementStrength = (masterElement?: string, strength?: number) => {
    if (!masterElement || strength === undefined) return null;
    
    let statusText = '';
    let statusClass = '';
    
    if (strength > 70) {
      statusText = 'Prosperous';
      statusClass = 'text-red-500';
    } else if (strength < 40) {
      statusText = 'Weak';
      statusClass = 'text-blue-500';
    } else {
      statusText = 'Balanced';
      statusClass = 'text-yellow-500';
    }
    
    return (
      <div className="bg-[#2C2A4A] rounded-xl p-6 border border-[#C0A573]/20 mb-8">
        <h3 className="text-xl font-bold text-[#F0F0F0] mb-4">Day Master Element Strength</h3>
        <div className="flex items-center justify-center mb-6">
          <div className={`${getBgElementColor(masterElement)} rounded-full w-32 h-32 flex items-center justify-center`}>
            <div className="text-center">
              <span className={`text-5xl font-bold ${getElementColor(masterElement)}`}>{masterElement}</span>
              <div className={`text-sm font-semibold ${statusClass}`}>{statusText}</div>
            </div>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
          <div className={`h-2.5 rounded-full ${
            strength > 70 ? 'bg-red-500' :
            strength < 40 ? 'bg-blue-500' :
            'bg-yellow-500'
          }`} style={{ width: `${strength}%` }}></div>
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>Weak (0)</span>
          <span>Balanced (50)</span>
          <span>Strong (100)</span>
        </div>
      </div>
    );
  };

  const renderAnalysisSection = (
    icon: React.ReactNode, 
    title: string, 
    items?: string[],
    bgColor: string = 'bg-[#2C2A4A]'
  ) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className={`${bgColor} rounded-xl p-6 border border-[#C0A573]/20 mb-8`}>
        <div className="flex items-center mb-4">
          <div className="bg-[#C0A573]/20 p-2 rounded-full mr-3">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-[#F0F0F0]">{title}</h3>
        </div>
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-start">
              <div className="min-w-4 mt-1 mr-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C0A573]"></div>
              </div>
              <span className="text-[#F0F0F0]">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderFavorableElements = (favorableElements?: string[], unfavorableElements?: string[]) => {
    if (!favorableElements || !unfavorableElements) return null;
    
    return (
      <div className="bg-[#2C2A4A] rounded-xl p-6 border border-[#C0A573]/20 mb-8">
        <h3 className="text-xl font-bold text-[#F0F0F0] mb-4">Favorable and Unfavorable Elements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-[#C0A573] mb-3">Favorable Elements (Gods of Joy)</h4>
            <div className="flex flex-wrap gap-3">
              {favorableElements.map((elem, i) => (
                <span key={i} className={`${getBgElementColor(elem)} ${getElementColor(elem)} px-4 py-2 rounded-lg font-bold`}>
                  {elem}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-[#C0A573] mb-3">Unfavorable Elements (Gods of Annoyance)</h4>
            <div className="flex flex-wrap gap-3">
              {unfavorableElements.map((elem, i) => (
                <span key={i} className={`${getBgElementColor(elem)} ${getElementColor(elem)} px-4 py-2 rounded-lg font-bold`}>
                  {elem}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-[#1a1830] to-[#2C2A4A]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-[#C0A573]/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="h-10 w-10 text-[#C0A573]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#F0F0F0] mb-4">
            Bazi Chart Analysis
          </h1>
          <p className="text-xl text-[#C0A573] max-w-3xl mx-auto">
            Explore your Bazi chart, reveal the secrets of your destiny, and understand your innate advantages and life direction.
          </p>
        </div>

        {state.phase === 'welcome' && (
          <div className="bg-[#2C2A4A] rounded-3xl p-8 shadow-2xl border border-[#C0A573]/20 max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#F0F0F0] mb-6">The Mysteries of Bazi</h2>
              <p className="text-lg text-[#C0A573] mb-4">
                Bazi, or the Eight Characters of Birth Time, originates from the ancient theory of Yin-Yang and the Five Elements. It calculates the course of your destiny through the four pillars of your birth year, month, day, and hour.
              </p>
              <p className="text-lg text-[#F0F0F0]">
                Bazi analysis can reveal information about your innate personality traits, career development direction, health status, and interpersonal relationships.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {['Year Pillar', 'Month Pillar', 'Day Pillar', 'Hour Pillar'].map((pillar, index) => (
                <div key={index} className="bg-[#1a1830] rounded-xl p-5 border border-[#C0A573]/10 text-center">
                  <h3 className="text-xl font-bold text-[#C0A573] mb-3">{pillar}</h3>
                  <p className="text-[#F0F0F0] text-sm">
                    {index === 0 && 'Represents ancestors, family influence, and childhood development'}
                    {index === 1 && 'Represents adolescence and family environment'}
                    {index === 2 && 'Represents the main body of personal destiny and adulthood'}
                    {index === 3 && 'Represents old age fortune and descendants'}
                  </p>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setState(prev => ({ ...prev, phase: 'input' }))}
              className="w-full bg-gradient-to-r from-[#C0A573] to-[#9A7A56] hover:from-[#C8AE7D] hover:to-[#A58560] text-white py-4 px-8 rounded-xl font-bold text-lg flex items-center justify-center"
            >
              Start Bazi Analysis <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        )}

        {state.phase === 'input' && (
          <div className="bg-[#2C2A4A] rounded-3xl p-8 shadow-2xl border border-[#C0A573]/20 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#F0F0F0] mb-8 text-center">Enter Your Basic Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#C0A573] mb-2 font-medium">Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={state.userInfo.name}
                      onChange={handleInputChange}
                      className="w-full bg-[#1a1830] text-white border border-[#C0A573]/30 rounded-lg py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#C0A573]"
                      placeholder="Enter your name"
                    />
                    <User className="absolute left-4 top-3.5 h-5 w-5 text-[#C0A573]/70" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[#C0A573] mb-2 font-medium">Gender</label>
                  <div className="relative">
                    <select
                      name="gender"
                      value={state.userInfo.gender}
                      onChange={handleInputChange}
                      className="w-full bg-[#1a1830] text-white border border-[#C0A573]/30 rounded-lg py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#C0A573] appearance-none"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <Users className="absolute left-4 top-3.5 h-5 w-5 text-[#C0A573]/70" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[#C0A573] mb-2 font-medium">Date of Birth</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="birthDate"
                      value={state.userInfo.birthDate}
                      onChange={handleInputChange}
                      className="w-full bg-[#1a1830] text-white border border-[#C0A573]/30 rounded-lg py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#C0A573]"
                      required
                    />
                    <Calendar className="absolute left-4 top-3.5 h-5 w-5 text-[#C0A573]/70" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[#C0A573] mb-2 font-medium">Time of Birth</label>
                  <div className="relative">
                    <input
                      type="time"
                      name="birthTime"
                      value={state.userInfo.birthTime}
                      onChange={handleInputChange}
                      className="w-full bg-[#1a1830] text-white border border-[#C0A573]/30 rounded-lg py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#C0A573]"
                      required
                    />
                    <Clock className="absolute left-4 top-3.5 h-5 w-5 text-[#C0A573]/70" />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-[#C0A573] mb-2 font-medium">Place of Birth</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="birthPlace"
                      value={state.userInfo.birthPlace}
                      onChange={handleInputChange}
                      className="w-full bg-[#1a1830] text-white border border-[#C0A573]/30 rounded-lg py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#C0A573]"
                      placeholder="City of birth (optional)"
                    />
                    <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-[#C0A573]/70" />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setState(prev => ({ ...prev, phase: 'welcome' }))}
                  className="w-1/3 bg-[#1a1830] text-[#C0A573] py-3 px-6 rounded-xl font-medium border border-[#C0A573]/30 hover:bg-[#1a1830]/80"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-gradient-to-r from-[#C0A573] to-[#9A7A56] hover:from-[#C8AE7D] hover:to-[#A58560] text-white py-3 px-6 rounded-xl font-bold"
                >
                  Generate Bazi Analysis
                </button>
              </div>
            </form>
          </div>
        )}

        {state.phase === 'result' && state.baziChart && (
          <div className="space-y-8">
            {/* User Information Summary */}
            <div className="bg-[#2C2A4A] rounded-3xl p-6 border border-[#C0A573]/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="bg-[#C0A573]/20 p-3 rounded-full mr-4">
                    <User className="h-6 w-6 text-[#C0A573]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#F0F0F0]">
                      {state.userInfo.name || "Anonymous User"}
                    </h2>
                    <p className="text-[#C0A573]">
                      {new Date(state.userInfo.birthDate).toLocaleDateString('en-US')} 
                      {state.userInfo.birthTime && ` ${state.userInfo.birthTime}`}
                      {state.userInfo.gender && ` · ${state.userInfo.gender === 'male' ? 'Male' : 'Female'}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  className="bg-[#1a1830] text-[#C0A573] py-2 px-4 rounded-lg font-medium border border-[#C0A573]/30 hover:bg-[#1a1830]/80 flex items-center"
                >
                  Restart
                </button>
              </div>
            </div>
            
            {/* Bazi Chart Display */}
            <div className="bg-[#2C2A4A] rounded-3xl p-6 border border-[#C0A573]/20">
              <h2 className="text-2xl font-bold text-[#F0F0F0] mb-6 text-center">Bazi Chart</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {renderBaziColumn(state.baziChart.year, "Year Pillar")}
                {renderBaziColumn(state.baziChart.month, "Month Pillar")}
                {renderBaziColumn(state.baziChart.day, "Day Pillar")}
                {renderBaziColumn(state.baziChart.hour, "Hour Pillar")}
              </div>
            </div>
            
            {/* Chart Analysis Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                {/* Day Master Element Strength */}
                {renderElementStrength(
                  state.baziChart.masterElement, 
                  state.baziChart.dayMasterStrength
                )}
                
                {/* Favorable and Unfavorable Elements */}
                {renderFavorableElements(
                  state.baziChart.favorableElements,
                  state.baziChart.unfavorableElements
                )}
              </div>
              
              <div>
                {/* Luck Analysis */}
                {state.baziChart.luck && (
                  <div className="bg-[#2C2A4A] rounded-xl p-6 border border-[#C0A573]/20 mb-8">
                    <h3 className="text-xl font-bold text-[#F0F0F0] mb-4">Luck Analysis</h3>
                    <p className="text-[#F0F0F0]">{state.baziChart.luck}</p>
                  </div>
                )}
                
                {/* Overall Comments */}
                {state.baziChart.comments && (
                  <div className="bg-[#2C2A4A] rounded-xl p-6 border border-[#C0A573]/20 mb-8">
                    <h3 className="text-xl font-bold text-[#F0F0F0] mb-4">Overall Comments</h3>
                    <p className="text-[#F0F0F0]">{state.baziChart.comments}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Health, Career, and Relationship Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {renderAnalysisSection(
                <Shield className="h-5 w-5 text-[#C0A573]" />,
                "Health Analysis",
                state.baziChart.healthIndications,
                'bg-[#2C2A4A]/80'
              )}
              
              {renderAnalysisSection(
                <Briefcase className="h-5 w-5 text-[#C0A573]" />,
                "Career Analysis",
                state.baziChart.careerIndications,
                'bg-[#2C2A4A]/80'
              )}
              
              {renderAnalysisSection(
                <Heart className="h-5 w-5 text-[#C0A573]" />,
                "Relationship Analysis",
                state.baziChart.relationshipIndications,
                'bg-[#2C2A4A]/80'
              )}
            </div>
            
            {/* Related Numerology Suggestions */}
            <div className="bg-gradient-to-r from-[#2C2A4A] to-[#3D3B5F] rounded-3xl p-8 border border-[#C0A573]/20">
              <h2 className="text-2xl font-bold text-[#F0F0F0] mb-6">Comprehensive Numerology Suggestions</h2>
              <p className="text-[#C0A573] mb-6">
                Bazi analysis is only one aspect of numerology. You can also obtain a more comprehensive interpretation of your destiny through the following methods:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button 
                  onClick={() => window.location.href = '/zhouyi'}
                  className="bg-[#1a1830]/70 hover:bg-[#1a1830] text-white p-4 rounded-xl flex items-center justify-between border border-[#C0A573]/10"
                >
                  <span className="font-medium">I Ching Hexagram Interpretation</span>
                  <ArrowRight className="h-4 w-4 text-[#C0A573]" />
                </button>
                <button 
                  onClick={() => window.location.href = '/star-astrology'}
                  className="bg-[#1a1830]/70 hover:bg-[#1a1830] text-white p-4 rounded-xl flex items-center justify-between border border-[#C0A573]/10"
                >
                  <span className="font-medium">28 Mansions Analysis</span>
                  <ArrowRight className="h-4 w-4 text-[#C0A573]" />
                </button>
                <button 
                  onClick={() => window.location.href = '/compatibility'}
                  className="bg-[#1a1830]/70 hover:bg-[#1a1830] text-white p-4 rounded-xl flex items-center justify-between border border-[#C0A573]/10"
                >
                  <span className="font-medium">Compatibility Analysis</span>
                  <ArrowRight className="h-4 w-4 text-[#C0A573]" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

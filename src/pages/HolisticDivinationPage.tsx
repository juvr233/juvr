import React, { useState } from 'react';
import { Calendar, Clock, User, MapPin, Sparkles, ArrowRight, BookOpen, Star, Scroll, Users } from 'lucide-react';
import { generateHolisticDivination, HolisticDivinationResult } from '../utils/holisticDivination';

interface HolisticDivinationState {
  phase: 'welcome' | 'input' | 'processing' | 'result';
  userInfo: {
    name: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    gender: string;
    question: string;
  };
  result: HolisticDivinationResult | null;
  error: string | null;
}

export default function HolisticDivinationPage() {
  const [state, setState] = useState<HolisticDivinationState>({
    phase: 'welcome',
    userInfo: {
      name: '',
      birthDate: '',
      birthTime: '',
      birthPlace: '',
      gender: '',
      question: ''
    },
    result: null,
    error: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      userInfo: { ...prev.userInfo, [name]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, birthDate, birthTime, gender, question } = state.userInfo;
    
    if (!name || !birthDate || !birthTime || !gender) {
      setState(prev => ({ ...prev, error: "请填写必要的信息" }));
      return;
    }
    
    setState(prev => ({ ...prev, phase: 'processing', error: null }));
    
    try {
      const birthDateTime = new Date(`${birthDate}T${birthTime}`);
      const result = await generateHolisticDivination(name, birthDateTime, gender, question);
      
      setState(prev => ({ ...prev, result, phase: 'result' }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: "分析过程中出现错误，请稍后再试", 
        phase: 'input' 
      }));
      console.error(error);
    }
  };

  const resetForm = () => {
    setState({
      phase: 'welcome',
      userInfo: {
        name: '',
        birthDate: '',
        birthTime: '',
        birthPlace: '',
        gender: '',
        question: ''
      },
      result: null,
      error: null
    });
  };
  
  const getElementColor = (element: string): string => {
    switch(element) {
      case '木': return 'text-green-500';
      case '火': return 'text-red-500';
      case '土': return 'text-yellow-500';
      case '金': return 'text-gray-300';
      case '水': return 'text-blue-500';
      default: return 'text-white';
    }
  };

  const getBgElementColor = (element: string): string => {
    switch(element) {
      case '木': return 'bg-green-500/20';
      case '火': return 'bg-red-500/20';
      case '土': return 'bg-yellow-500/20';
      case '金': return 'bg-gray-300/20';
      case '水': return 'bg-blue-500/20';
      default: return 'bg-white/20';
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-[#1a1830] to-[#2C2A4A]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-[#C0A573]/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Scroll className="h-10 w-10 text-[#C0A573]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#F0F0F0] mb-4">
            命运全书
          </h1>
          <p className="text-xl text-[#C0A573] max-w-3xl mx-auto">
            融合八字、六爻、星宿、塔罗、数字命理的综合命运解析
          </p>
        </div>

        {/* Welcome Phase */}
        {state.phase === 'welcome' && (
          <div className="bg-[#2C2A4A] rounded-3xl p-8 shadow-2xl border border-[#C0A573]/20 max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#F0F0F0] mb-6">命运全书 · 综合解析</h2>
              <p className="text-lg text-[#C0A573] mb-4">
                我们运用中国古代命理学、西方占星术以及现代心理学的知识，为您提供全方位的命运解析。
              </p>
              <p className="text-lg text-[#F0F0F0]">
                通过分析您的生辰八字、星宿、卦象和数字命理，我们可以揭示您的性格特点、潜能优势、人生挑战以及未来发展方向。
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-[#1a1830] rounded-xl p-6 border border-[#C0A573]/10 flex flex-col items-center">
                <div className="bg-[#C0A573]/20 p-3 rounded-full mb-4">
                  <Calendar className="h-6 w-6 text-[#C0A573]" />
                </div>
                <h3 className="text-xl font-bold text-[#C0A573] mb-2">传统命理</h3>
                <p className="text-[#F0F0F0] text-center text-sm">
                  包含生辰八字、五行分析、九星命盘、六爻卦象、二十八宿等传统命理系统
                </p>
              </div>
              
              <div className="bg-[#1a1830] rounded-xl p-6 border border-[#C0A573]/10 flex flex-col items-center">
                <div className="bg-[#C0A573]/20 p-3 rounded-full mb-4">
                  <Sparkles className="h-6 w-6 text-[#C0A573]" />
                </div>
                <h3 className="text-xl font-bold text-[#C0A573] mb-2">现代解读</h3>
                <p className="text-[#F0F0F0] text-center text-sm">
                  结合现代心理学和数字命理学，提供更符合当代生活的实用建议和人生指导
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setState(prev => ({ ...prev, phase: 'input' }))}
              className="w-full bg-gradient-to-r from-[#C0A573] to-[#9A7A56] hover:from-[#C8AE7D] hover:to-[#A58560] text-white py-4 px-8 rounded-xl font-bold text-lg flex items-center justify-center"
            >
              开始综合命运解析 <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        )}

        {/* Input Phase */}
        {state.phase === 'input' && (
          <div className="bg-[#2C2A4A] rounded-3xl p-8 shadow-2xl border border-[#C0A573]/20 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#F0F0F0] mb-8 text-center">提供您的基本信息</h2>
            
            {state.error && (
              <div className="bg-red-500/20 border border-red-500/30 text-white rounded-lg p-4 mb-6">
                {state.error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#C0A573] mb-2 font-medium">姓名</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={state.userInfo.name}
                      onChange={handleInputChange}
                      className="w-full bg-[#1a1830] text-white border border-[#C0A573]/30 rounded-lg py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#C0A573]"
                      placeholder="请输入您的姓名"
                      required
                    />
                    <User className="absolute left-4 top-3.5 h-5 w-5 text-[#C0A573]/70" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[#C0A573] mb-2 font-medium">性别</label>
                  <div className="relative">
                    <select
                      name="gender"
                      value={state.userInfo.gender}
                      onChange={handleInputChange}
                      className="w-full bg-[#1a1830] text-white border border-[#C0A573]/30 rounded-lg py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#C0A573] appearance-none"
                      required
                    >
                      <option value="">请选择性别</option>
                      <option value="male">男</option>
                      <option value="female">女</option>
                    </select>
                    <Users className="absolute left-4 top-3.5 h-5 w-5 text-[#C0A573]/70" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[#C0A573] mb-2 font-medium">出生日期</label>
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
                  <label className="block text-[#C0A573] mb-2 font-medium">出生时间</label>
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
                  <label className="block text-[#C0A573] mb-2 font-medium">出生地点</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="birthPlace"
                      value={state.userInfo.birthPlace}
                      onChange={handleInputChange}
                      className="w-full bg-[#1a1830] text-white border border-[#C0A573]/30 rounded-lg py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#C0A573]"
                      placeholder="出生城市（可选）"
                    />
                    <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-[#C0A573]/70" />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-[#C0A573] mb-2 font-medium">想要咨询的问题 (可选)</label>
                  <div className="relative">
                    <textarea
                      name="question"
                      value={state.userInfo.question}
                      onChange={handleInputChange}
                      className="w-full bg-[#1a1830] text-white border border-[#C0A573]/30 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#C0A573]"
                      placeholder="请输入您想要咨询的具体问题，如事业、健康、感情等"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setState(prev => ({ ...prev, phase: 'welcome' }))}
                  className="w-1/3 bg-[#1a1830] text-[#C0A573] py-3 px-6 rounded-xl font-medium border border-[#C0A573]/30 hover:bg-[#1a1830]/80"
                >
                  返回
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-gradient-to-r from-[#C0A573] to-[#9A7A56] hover:from-[#C8AE7D] hover:to-[#A58560] text-white py-3 px-6 rounded-xl font-bold"
                >
                  生成命运解析
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Processing Phase */}
        {state.phase === 'processing' && (
          <div className="bg-[#2C2A4A] rounded-3xl p-8 shadow-2xl border border-[#C0A573]/20 max-w-4xl mx-auto text-center">
            <div className="py-10">
              <div className="animate-spin mb-6 mx-auto">
                <div className="w-16 h-16 border-4 border-[#C0A573] border-t-transparent rounded-full"></div>
              </div>
              <h2 className="text-2xl font-bold text-[#F0F0F0] mb-4">正在生成您的命运全书...</h2>
              <p className="text-[#C0A573]">
                我们正在分析您的八字、星宿、五行属性和数字能量，请稍候...
              </p>
            </div>
          </div>
        )}

        {/* Result Phase */}
        {state.phase === 'result' && state.result && (
          <div className="space-y-8">
            {/* 用户信息摘要 */}
            <div className="bg-[#2C2A4A] rounded-3xl p-6 border border-[#C0A573]/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="bg-[#C0A573]/20 p-3 rounded-full mr-4">
                    <User className="h-6 w-6 text-[#C0A573]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#F0F0F0]">
                      {state.userInfo.name}
                    </h2>
                    <p className="text-[#C0A573]">
                      {new Date(state.userInfo.birthDate).toLocaleDateString('zh-CN')} 
                      {state.userInfo.birthTime && ` ${state.userInfo.birthTime}`}
                      {state.userInfo.gender && ` · ${state.userInfo.gender === 'male' ? '男' : '女'}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  className="bg-[#1a1830] text-[#C0A573] py-2 px-4 rounded-lg font-medium border border-[#C0A573]/30 hover:bg-[#1a1830]/80 flex items-center"
                >
                  重新开始
                </button>
              </div>
            </div>
            
            {/* 关键洞见 */}
            <div className="bg-gradient-to-r from-[#2C2A4A] to-[#3A3756] rounded-3xl p-8 border border-[#C0A573]/20">
              <h2 className="text-2xl font-bold text-[#F0F0F0] mb-6 flex items-center">
                <Sparkles className="h-6 w-6 mr-3 text-[#C0A573]" />
                命运洞见
              </h2>
              
              <div className="space-y-4">
                {state.result.synthesis.keyInsights.map((insight, i) => (
                  <div key={i} className="bg-[#1a1830]/50 p-4 rounded-xl border border-[#C0A573]/10">
                    <p className="text-[#F0F0F0]">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 五行元素平衡 */}
            <div className="bg-[#2C2A4A] rounded-3xl p-8 border border-[#C0A573]/20">
              <h2 className="text-2xl font-bold text-[#F0F0F0] mb-6">五行元素平衡</h2>
              
              <div className="grid grid-cols-5 gap-3 mb-8">
                {['木', '火', '土', '金', '水'].map((element) => {
                  const value = state.result.synthesis.elementBalance[
                    element === '木' ? 'wood' : 
                    element === '火' ? 'fire' : 
                    element === '土' ? 'earth' : 
                    element === '金' ? 'metal' : 
                    'water'
                  ];
                  
                  return (
                    <div key={element} className={`${getBgElementColor(element)} p-4 rounded-xl text-center`}>
                      <h3 className={`text-2xl font-bold ${getElementColor(element)} mb-2`}>{element}</h3>
                      <div className="w-full bg-[#1a1830] rounded-full h-2 mb-1">
                        <div 
                          className={`h-2 rounded-full ${getElementColor(element).replace('text-', 'bg-')}`} 
                          style={{ width: `${Math.min(100, value * 20)}%` }}
                        ></div>
                      </div>
                      <p className="text-[#F0F0F0] text-sm">{value.toFixed(1)}</p>
                    </div>
                  );
                })}
              </div>
              
              <div className="bg-[#1a1830]/70 p-4 rounded-xl">
                <p className="text-[#F0F0F0]">
                  您的五行中<span className={getElementColor(state.result.synthesis.elementBalance.dominantElement)}>{state.result.synthesis.elementBalance.dominantElement}</span>最为强盛，
                  而<span className={getElementColor(state.result.synthesis.elementBalance.deficientElement)}>{state.result.synthesis.elementBalance.deficientElement}</span>相对不足。
                  {state.result.baziChart?.luck}
                </p>
              </div>
            </div>
            
            {/* 人生阶段趋势 */}
            <div className="bg-[#2C2A4A] rounded-3xl p-8 border border-[#C0A573]/20">
              <h2 className="text-2xl font-bold text-[#F0F0F0] mb-6">人生阶段趋势</h2>
              
              <div className="relative mb-10 pt-6">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-yellow-500 to-purple-500 rounded-full"></div>
                
                <div className="flex justify-between relative">
                  <div className="absolute" style={{ left: '0%' }}>
                    <div className="w-3 h-3 bg-green-500 rounded-full -mt-7 mx-auto"></div>
                    <p className="text-xs text-[#C0A573] mt-2">出生</p>
                  </div>
                  
                  <div className="absolute" style={{ left: '30%' }}>
                    <div className="w-3 h-3 bg-blue-500 rounded-full -mt-7 mx-auto"></div>
                    <p className="text-xs text-[#C0A573] mt-2">30岁</p>
                  </div>
                  
                  <div className="absolute" style={{ left: '60%' }}>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full -mt-7 mx-auto"></div>
                    <p className="text-xs text-[#C0A573] mt-2">60岁</p>
                  </div>
                  
                  <div className="absolute" style={{ left: `${state.result.synthesis.lifeTrends.peakAge}%` }}>
                    <div className="w-5 h-5 bg-purple-500 rounded-full -mt-8 mx-auto border-2 border-white"></div>
                    <p className="text-xs text-purple-300 mt-2 -ml-4">巅峰期</p>
                  </div>
                  
                  <div className="absolute" style={{ left: `${state.result.synthesis.lifeTrends.challengeAge}%` }}>
                    <div className="w-5 h-5 bg-red-500 rounded-full -mt-8 mx-auto border-2 border-white"></div>
                    <p className="text-xs text-red-300 mt-2 -ml-4">挑战期</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6 mt-16">
                <div className="bg-[#1a1830]/50 p-4 rounded-xl border-l-4 border-green-500">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">青年期 (0-30岁)</h3>
                  <p className="text-[#F0F0F0]">{state.result.synthesis.lifeTrends.youth}</p>
                </div>
                
                <div className="bg-[#1a1830]/50 p-4 rounded-xl border-l-4 border-yellow-500">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-2">中年期 (30-60岁)</h3>
                  <p className="text-[#F0F0F0]">{state.result.synthesis.lifeTrends.middle}</p>
                </div>
                
                <div className="bg-[#1a1830]/50 p-4 rounded-xl border-l-4 border-purple-500">
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">老年期 (60岁以上)</h3>
                  <p className="text-[#F0F0F0]">{state.result.synthesis.lifeTrends.elder}</p>
                </div>
              </div>
            </div>
            
            {/* 建议与指导 */}
            <div className="bg-gradient-to-r from-[#2C2A4A] to-[#3A3756] rounded-3xl p-8 border border-[#C0A573]/20">
              <h2 className="text-2xl font-bold text-[#F0F0F0] mb-6">命运指引</h2>
              
              <div className="space-y-4">
                {state.result.synthesis.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start">
                    <div className="min-w-4 mt-1.5 mr-3">
                      <div className="w-2 h-2 rounded-full bg-[#C0A573]"></div>
                    </div>
                    <p className="text-[#F0F0F0]">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 命理体系整合 */}
            <div className="bg-[#2C2A4A] rounded-3xl p-8 border border-[#C0A573]/20">
              <h2 className="text-2xl font-bold text-[#F0F0F0] mb-6 text-center">多维命理体系</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-[#1a1830]/70 rounded-xl p-6 border border-[#C0A573]/10">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-5 w-5 text-[#C0A573] mr-3" />
                    <h3 className="text-lg font-bold text-[#F0F0F0]">生辰八字</h3>
                  </div>
                  
                  {state.result.baziChart && (
                    <div>
                      <p className="text-[#C0A573] mb-2">日主五行: <span className={getElementColor(state.result.baziChart.masterElement || '')}>{state.result.baziChart.masterElement}</span></p>
                      <p className="text-[#F0F0F0] text-sm">
                        {state.result.baziChart.comments?.substring(0, 120)}...
                      </p>
                      <div className="mt-3">
                        <button
                          onClick={() => window.location.href = '/bazi-analysis'}
                          className="text-[#C0A573] text-sm flex items-center hover:underline"
                        >
                          查看详细八字分析 <ArrowRight className="h-3 w-3 ml-1" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-[#1a1830]/70 rounded-xl p-6 border border-[#C0A573]/10">
                  <div className="flex items-center mb-4">
                    <Star className="h-5 w-5 text-[#C0A573] mr-3" />
                    <h3 className="text-lg font-bold text-[#F0F0F0]">星宿命盘</h3>
                  </div>
                  
                  {state.result.starInfo && (
                    <div>
                      <p className="text-[#C0A573] mb-2">命宫星宿: {state.result.starInfo.mainStar.name} ({state.result.starInfo.mainStar.group})</p>
                      <p className="text-[#F0F0F0] text-sm">
                        {state.result.starInfo.destiny?.substring(0, 120)}...
                      </p>
                      <div className="mt-3">
                        <button
                          onClick={() => window.location.href = '/star-astrology'}
                          className="text-[#C0A573] text-sm flex items-center hover:underline"
                        >
                          查看详细星宿解析 <ArrowRight className="h-3 w-3 ml-1" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-[#1a1830]/70 rounded-xl p-6 border border-[#C0A573]/10">
                  <div className="flex items-center mb-4">
                    <BookOpen className="h-5 w-5 text-[#C0A573] mr-3" />
                    <h3 className="text-lg font-bold text-[#F0F0F0]">周易卦象</h3>
                  </div>
                  
                  {state.result.ichingReading ? (
                    <div>
                      <p className="text-[#C0A573] mb-2">本卦: {state.result.ichingReading.hexagram.chineseName} ({state.result.ichingReading.hexagram.name})</p>
                      <p className="text-[#F0F0F0] text-sm">
                        {state.result.ichingReading.hexagram.judgment.substring(0, 120)}...
                      </p>
                      <div className="mt-3">
                        <button
                          onClick={() => window.location.href = '/zhouyi'}
                          className="text-[#C0A573] text-sm flex items-center hover:underline"
                        >
                          查看详细周易解析 <ArrowRight className="h-3 w-3 ml-1" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[#C0A573]">需要提问具体问题才能进行周易卦象解读。</p>
                  )}
                </div>
                
                {/* 数字命理 */}
                <div className="bg-[#1a1830]/70 rounded-xl p-6 border border-[#C0A573]/10 lg:col-span-3">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      <Sparkles className="h-5 w-5 text-[#C0A573] mr-3" />
                      <h3 className="text-lg font-bold text-[#F0F0F0]">数字命理解析</h3>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-[#C0A573] mb-1">生命之路数: {state.result.numerology?.lifePathNumber}</p>
                      <p className="text-[#F0F0F0] text-sm mb-3">
                        {state.result.numerology?.lifePathMeaning}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#C0A573] mb-1">表达数字: {state.result.numerology?.expressionNumber}</p>
                      <p className="text-[#F0F0F0] text-sm mb-3">
                        {state.result.numerology?.expressionMeaning}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

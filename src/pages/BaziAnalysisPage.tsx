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

  const renderBaziColumn = (column?: BaziColumn, title?: string) => {
    if (!column) return null;
    
    const strengthLevel = column.strength && column.strength > 70 
      ? '强' 
      : column.strength && column.strength < 40 
        ? '弱' 
        : '中';
        
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
            <span>天干五行:</span>
            <span className={getElementColor(column.stemElement || '')}>
              {column.stemElement}
            </span>
          </div>
          <div className="flex justify-between mb-1">
            <span>地支五行:</span>
            <span className={getElementColor(column.branchElement || '')}>
              {column.branchElement}
            </span>
          </div>
          {column.hiddenElements && column.hiddenElements.length > 0 && (
            <div className="flex justify-between mb-1">
              <span>藏干:</span>
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
            <span>关系:</span>
            <span>{column.stemBranchRelation}</span>
          </div>
          <div className="flex justify-between">
            <span>强度:</span>
            <span className={
              strengthLevel === '强' ? 'text-red-400' :
              strengthLevel === '弱' ? 'text-blue-400' :
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
      statusText = '旺盛';
      statusClass = 'text-red-500';
    } else if (strength < 40) {
      statusText = '衰弱';
      statusClass = 'text-blue-500';
    } else {
      statusText = '平衡';
      statusClass = 'text-yellow-500';
    }
    
    return (
      <div className="bg-[#2C2A4A] rounded-xl p-6 border border-[#C0A573]/20 mb-8">
        <h3 className="text-xl font-bold text-[#F0F0F0] mb-4">日主五行力量</h3>
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
          <span>弱 (0)</span>
          <span>平衡 (50)</span>
          <span>强 (100)</span>
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
        <h3 className="text-xl font-bold text-[#F0F0F0] mb-4">五行喜忌</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-[#C0A573] mb-3">有利五行 (喜神)</h4>
            <div className="flex flex-wrap gap-3">
              {favorableElements.map((elem, i) => (
                <span key={i} className={`${getBgElementColor(elem)} ${getElementColor(elem)} px-4 py-2 rounded-lg font-bold`}>
                  {elem}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-[#C0A573] mb-3">不利五行 (忌神)</h4>
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
            八字命盘分析
          </h1>
          <p className="text-xl text-[#C0A573] max-w-3xl mx-auto">
            探索您的生辰八字，揭示命运天机，了解先天优势与人生方向
          </p>
        </div>

        {state.phase === 'welcome' && (
          <div className="bg-[#2C2A4A] rounded-3xl p-8 shadow-2xl border border-[#C0A573]/20 max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#F0F0F0] mb-6">生辰八字的奥秘</h2>
              <p className="text-lg text-[#C0A573] mb-4">
                生辰八字源自古老的阴阳五行学说，通过您的出生年、月、日、时四柱，来推算命运走向。
              </p>
              <p className="text-lg text-[#F0F0F0]">
                八字分析能揭示您的先天性格特点、事业发展方向、健康状况以及人际关系等多方面的信息。
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {['年柱', '月柱', '日柱', '时柱'].map((pillar, index) => (
                <div key={index} className="bg-[#1a1830] rounded-xl p-5 border border-[#C0A573]/10 text-center">
                  <h3 className="text-xl font-bold text-[#C0A573] mb-3">{pillar}</h3>
                  <p className="text-[#F0F0F0] text-sm">
                    {index === 0 && '代表祖先、家族影响和童年发展'}
                    {index === 1 && '代表青少年时期和家庭环境'}
                    {index === 2 && '代表个人命运主体和成年阶段'}
                    {index === 3 && '代表晚年运势和子孙后代'}
                  </p>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setState(prev => ({ ...prev, phase: 'input' }))}
              className="w-full bg-gradient-to-r from-[#C0A573] to-[#9A7A56] hover:from-[#C8AE7D] hover:to-[#A58560] text-white py-4 px-8 rounded-xl font-bold text-lg flex items-center justify-center"
            >
              开始八字分析 <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        )}

        {state.phase === 'input' && (
          <div className="bg-[#2C2A4A] rounded-3xl p-8 shadow-2xl border border-[#C0A573]/20 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#F0F0F0] mb-8 text-center">输入您的基本信息</h2>
            
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
                      placeholder="请输入姓名"
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
                  生成八字分析
                </button>
              </div>
            </form>
          </div>
        )}

        {state.phase === 'result' && state.baziChart && (
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
                      {state.userInfo.name || "匿名用户"}
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
            
            {/* 八字命盘展示 */}
            <div className="bg-[#2C2A4A] rounded-3xl p-6 border border-[#C0A573]/20">
              <h2 className="text-2xl font-bold text-[#F0F0F0] mb-6 text-center">八字命盘</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {renderBaziColumn(state.baziChart.year, "年柱")}
                {renderBaziColumn(state.baziChart.month, "月柱")}
                {renderBaziColumn(state.baziChart.day, "日柱")}
                {renderBaziColumn(state.baziChart.hour, "时柱")}
              </div>
            </div>
            
            {/* 命盘分析结果 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                {/* 日主五行强弱 */}
                {renderElementStrength(
                  state.baziChart.masterElement, 
                  state.baziChart.dayMasterStrength
                )}
                
                {/* 有利和不利五行 */}
                {renderFavorableElements(
                  state.baziChart.favorableElements,
                  state.baziChart.unfavorableElements
                )}
              </div>
              
              <div>
                {/* 运势分析 */}
                {state.baziChart.luck && (
                  <div className="bg-[#2C2A4A] rounded-xl p-6 border border-[#C0A573]/20 mb-8">
                    <h3 className="text-xl font-bold text-[#F0F0F0] mb-4">运势分析</h3>
                    <p className="text-[#F0F0F0]">{state.baziChart.luck}</p>
                  </div>
                )}
                
                {/* 整体评价 */}
                {state.baziChart.comments && (
                  <div className="bg-[#2C2A4A] rounded-xl p-6 border border-[#C0A573]/20 mb-8">
                    <h3 className="text-xl font-bold text-[#F0F0F0] mb-4">整体评价</h3>
                    <p className="text-[#F0F0F0]">{state.baziChart.comments}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* 健康、事业、感情分析 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {renderAnalysisSection(
                <Shield className="h-5 w-5 text-[#C0A573]" />,
                "健康分析",
                state.baziChart.healthIndications,
                'bg-[#2C2A4A]/80'
              )}
              
              {renderAnalysisSection(
                <Briefcase className="h-5 w-5 text-[#C0A573]" />,
                "事业分析",
                state.baziChart.careerIndications,
                'bg-[#2C2A4A]/80'
              )}
              
              {renderAnalysisSection(
                <Heart className="h-5 w-5 text-[#C0A573]" />,
                "情感分析",
                state.baziChart.relationshipIndications,
                'bg-[#2C2A4A]/80'
              )}
            </div>
            
            {/* 相关命理建议 */}
            <div className="bg-gradient-to-r from-[#2C2A4A] to-[#3D3B5F] rounded-3xl p-8 border border-[#C0A573]/20">
              <h2 className="text-2xl font-bold text-[#F0F0F0] mb-6">综合命理建议</h2>
              <p className="text-[#C0A573] mb-6">
                八字分析只是命理的一个方面，您还可以通过以下方式获取更全面的命运解读：
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button 
                  onClick={() => window.location.href = '/zhouyi'}
                  className="bg-[#1a1830]/70 hover:bg-[#1a1830] text-white p-4 rounded-xl flex items-center justify-between border border-[#C0A573]/10"
                >
                  <span className="font-medium">周易卦象解读</span>
                  <ArrowRight className="h-4 w-4 text-[#C0A573]" />
                </button>
                <button 
                  onClick={() => window.location.href = '/star-astrology'}
                  className="bg-[#1a1830]/70 hover:bg-[#1a1830] text-white p-4 rounded-xl flex items-center justify-between border border-[#C0A573]/10"
                >
                  <span className="font-medium">二十八星宿分析</span>
                  <ArrowRight className="h-4 w-4 text-[#C0A573]" />
                </button>
                <button 
                  onClick={() => window.location.href = '/compatibility'}
                  className="bg-[#1a1830]/70 hover:bg-[#1a1830] text-white p-4 rounded-xl flex items-center justify-between border border-[#C0A573]/10"
                >
                  <span className="font-medium">兼容性分析</span>
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

import { useEffect, useState } from 'react';
import { 
  getNumberInterpretation,
  type NumberInterpretation 
} from '../utils/numerology';

interface CompatibilityAreaResult {
  area: string;
  score: number;
  description: string;
  advice: string;
}

interface DetailedCompatibilityProps {
  person1: {
    name: string;
    birthDate: string;
    number: number;
  };
  person2: {
    name: string;
    birthDate: string;
    number: number;
  };
}

export default function CompatibilityAnalysis({ person1, person2 }: DetailedCompatibilityProps) {
  const [profile1, setProfile1] = useState<NumberInterpretation | null>(null);
  const [profile2, setProfile2] = useState<NumberInterpretation | null>(null);
  const [areas, setAreas] = useState<CompatibilityAreaResult[]>([]);

  useEffect(() => {
    // 获取两个人的命理解释
    const interpretation1 = getNumberInterpretation(person1.number);
    const interpretation2 = getNumberInterpretation(person2.number);

    setProfile1(interpretation1);
    setProfile2(interpretation2);

    // 计算不同生活领域的兼容性
    calculateAreaCompatibility(interpretation1, interpretation2);
  }, [person1.number, person2.number]);

  const calculateAreaCompatibility = (
    profile1: NumberInterpretation,
    profile2: NumberInterpretation
  ) => {
    // 分析不同领域的兼容性
    const areas: CompatibilityAreaResult[] = [
      analyzeRomantic(profile1, profile2),
      analyzeCareer(profile1, profile2),
      analyzeFriendship(profile1, profile2),
      analyzeValues(profile1, profile2),
      analyzeCommunication(profile1, profile2)
    ];
    
    setAreas(areas);
  };

  // 浪漫关系兼容性分析
  const analyzeRomantic = (p1: NumberInterpretation, p2: NumberInterpretation): CompatibilityAreaResult => {
    let score = 50;
    const isHighlyCompatible = p1.compatibility.includes(p2.number) || p2.compatibility.includes(p1.number);
    
    if (isHighlyCompatible) score += 25;
    
    // 特殊规则
    if ((p1.number === 2 && p2.number === 6) || (p1.number === 6 && p2.number === 2)) score += 20; // 情感兼容
    if ((p1.number === 4 && p2.number === 8) || (p1.number === 8 && p2.number === 4)) score += 15; // 稳定+野心
    if ((p1.number === 3 && p2.number === 5) || (p1.number === 5 && p2.number === 3)) score += 10; // 创造性兼容

    // 冲突处理
    if ((p1.number === 1 && p2.number === 9) || (p1.number === 9 && p2.number === 1)) score -= 10; // 领导权冲突

    score = Math.min(100, Math.max(10, score));
    
    let description, advice;
    if (score >= 80) {
      description = "浪漫关系中有着极高的和谐度，彼此的能量相互促进。";
      advice = "珍惜这种天然的联系，保持开放的沟通。";
    } else if (score >= 60) {
      description = "在浪漫关系中有良好的基础，可以建立持久的连接。";
      advice = "关注彼此的差异，并将其视为互补而非冲突。";
    } else if (score >= 40) {
      description = "浪漫关系需要双方的努力和理解，但有成长的潜力。";
      advice = "建立共同的活动和目标，增强相互理解。";
    } else {
      description = "浪漫关系可能面临挑战，需要大量的包容和适应。";
      advice = "设定明确的边界，尊重彼此的个人空间和需求。";
    }
    
    return {
      area: "浪漫关系",
      score,
      description,
      advice
    };
  };

  // 事业兼容性分析
  const analyzeCareer = (p1: NumberInterpretation, p2: NumberInterpretation): CompatibilityAreaResult => {
    let score = 50;
    
    // 基于职业路径的兼容性
    const careerPaths1 = p1.careerPaths || [];
    const careerPaths2 = p2.careerPaths || [];
    
    // 检查职业路径的相似度
    const commonPaths = careerPaths1.filter(path => careerPaths2.includes(path));
    if (commonPaths.length > 0) {
      score += commonPaths.length * 5;
    }
    
    // 有些数字在工作中更协调
    if ((p1.number === 1 && p2.number === 7) || (p1.number === 7 && p2.number === 1)) score += 20; // 领导+分析
    if ((p1.number === 3 && p2.number === 9) || (p1.number === 9 && p2.number === 3)) score += 15; // 创造+人道
    if ((p1.number === 4 && p2.number === 8) || (p1.number === 8 && p2.number === 4)) score += 25; // 务实+野心
    
    score = Math.min(100, Math.max(10, score));
    
    let description, advice;
    if (score >= 80) {
      description = "在工作或事业上有出色的协作能力和共同目标。";
      advice = "建立一个共同的长期规划，明确各自的优势和角色。";
    } else if (score >= 60) {
      description = "在职业合作中能够相互支持，共同进步。";
      advice = "定期分享职业目标和愿景，找到合作的最佳方式。";
    } else if (score >= 40) {
      description = "职业合作需要相互理解和适应，但有成长空间。";
      advice = "明确各自的职责和期望，建立有效的沟通机制。";
    } else {
      description = "在职业方向上可能有显著差异，需要找到平衡。";
      advice = "尊重彼此的职业选择，寻找能够支持双方成长的方式。";
    }
    
    return {
      area: "事业合作",
      score,
      description,
      advice
    };
  };

  // 友谊兼容性分析
  const analyzeFriendship = (p1: NumberInterpretation, p2: NumberInterpretation): CompatibilityAreaResult => {
    let score = 60; // 友谊通常比浪漫关系更容易保持
    
    // 有些数字自然形成良好的友谊
    if ((p1.number === 3 && p2.number === 5) || (p1.number === 5 && p2.number === 3)) score += 20; // 社交活跃
    if ((p1.number === 2 && p2.number === 9) || (p1.number === 9 && p2.number === 2)) score += 15; // 情感支持
    if ((p1.number === 4 && p2.number === 6) || (p1.number === 6 && p2.number === 4)) score += 10; // 忠诚可靠
    
    // 潜在的友谊挑战
    if ((p1.number === 1 && p2.number === 1) || (p1.number === 8 && p2.number === 8)) score -= 10; // 可能竞争
    
    score = Math.min(100, Math.max(10, score));
    
    let description, advice;
    if (score >= 80) {
      description = "能够建立深厚、持久的友谊，相互尊重和理解。";
      advice = "定期安排共同的活动，保持友谊的活力和深度。";
    } else if (score >= 60) {
      description = "友谊基础良好，能够为彼此提供支持和快乐。";
      advice = "关注彼此的兴趣爱好，找到共同话题和活动。";
    } else if (score >= 40) {
      description = "友谊需要投入和理解，有时可能需要克服差异。";
      advice = "尝试新的共同活动，拓展友谊的维度。";
    } else {
      description = "友谊可能面临理解上的挑战，需要更多的包容。";
      advice = "接受并尊重彼此的不同，不要试图改变对方。";
    }
    
    return {
      area: "友谊关系",
      score,
      description,
      advice
    };
  };

  // 价值观兼容性
  const analyzeValues = (p1: NumberInterpretation, p2: NumberInterpretation): CompatibilityAreaResult => {
    let score = 50;
    
    const strengths1 = p1.strengths || [];
    const strengths2 = p2.strengths || [];
    
    // 检查价值观的相似度
    const commonStrengths = strengths1.filter(s => strengths2.includes(s));
    if (commonStrengths.length > 0) {
      score += commonStrengths.length * 8;
    }
    
    // 有些数字在价值观上更一致
    if ((p1.number === 2 && p2.number === 6) || (p1.number === 6 && p2.number === 2)) score += 20; // 关爱和谐
    if ((p1.number === 7 && p2.number === 9) || (p1.number === 9 && p2.number === 7)) score += 15; // 精神层面
    
    // 价值观冲突
    if ((p1.number === 8 && p2.number === 7) || (p1.number === 7 && p2.number === 8)) score -= 10; // 物质vs精神
    
    score = Math.min(100, Math.max(10, score));
    
    let description, advice;
    if (score >= 80) {
      description = "在核心价值观上有很高的一致性，能够共同向着相似的目标前进。";
      advice = "深入探讨彼此的长期目标和梦想，加强这种连接。";
    } else if (score >= 60) {
      description = "共享许多重要的价值观，差异主要在细节上。";
      advice = "关注并庆祝共同的价值观，同时尊重各自的独特性。";
    } else if (score >= 40) {
      description = "核心价值观有一些差异，但通过沟通可以相互理解。";
      advice = "开放地讨论各自的信念和价值观，寻找共同点。";
    } else {
      description = "价值观和世界观可能存在显著差异，需要相互尊重。";
      advice = "尝试从对方的角度思考问题，培养同理心和理解。";
    }
    
    return {
      area: "价值观",
      score,
      description,
      advice
    };
  };

  // 沟通兼容性
  const analyzeCommunication = (p1: NumberInterpretation, p2: NumberInterpretation): CompatibilityAreaResult => {
    let score = 55;
    
    // 有些数字组合在沟通上更顺畅
    if ((p1.number === 2 && p2.number === 3) || (p1.number === 3 && p2.number === 2)) score += 25; // 倾听+表达
    if ((p1.number === 5 && p2.number === 7) || (p1.number === 7 && p2.number === 5)) score += 15; // 探索+思考
    if ((p1.number === 1 && p2.number === 6) || (p1.number === 6 && p2.number === 1)) score += 10; // 直接+和谐
    
    // 沟通挑战
    if ((p1.number === 1 && p2.number === 4) || (p1.number === 4 && p2.number === 1)) score -= 10; // 直接vs保守
    
    score = Math.min(100, Math.max(10, score));
    
    let description, advice;
    if (score >= 80) {
      description = "沟通流畅自然，能够轻松表达想法和感受。";
      advice = "保持开放和诚实的沟通习惯，定期分享内心想法。";
    } else if (score >= 60) {
      description = "沟通基础良好，大部分时候能够相互理解。";
      advice = "注意倾听的质量，确保真正理解对方的含义。";
    } else if (score >= 40) {
      description = "沟通可能需要额外的努力，有时会出现误解。";
      advice = "尝试不同的沟通方式，找到最适合双方的方法。";
    } else {
      description = "沟通可能存在障碍，需要耐心和明确的表达。";
      advice = "建立清晰的沟通规则，避免在情绪激动时做重要决定。";
    }
    
    return {
      area: "沟通方式",
      score,
      description,
      advice
    };
  };

  if (!profile1 || !profile2) {
    return <div className="animate-pulse">加载中...</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-[#C0A573] mb-6">详细兼容性分析</h3>
      
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-[#2C2A4A]/80 rounded-xl p-6 border border-[#C0A573]/20">
          <h4 className="text-xl font-semibold text-[#F0F0F0] mb-4">命理数字特质</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-bold text-[#C0A573] mb-2">{person1.name} - 命理数 {person1.number}</h5>
              <ul className="list-disc list-inside text-[#F0F0F0] space-y-1">
                {profile1.strengths?.slice(0, 3).map((strength, index) => (
                  <li key={index} className="text-sm">{strength}</li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-[#C0A573] mb-2">{person2.name} - 命理数 {person2.number}</h5>
              <ul className="list-disc list-inside text-[#F0F0F0] space-y-1">
                {profile2.strengths?.slice(0, 3).map((strength, index) => (
                  <li key={index} className="text-sm">{strength}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {areas.map((area, index) => (
          <div key={index} className="bg-[#2C2A4A]/80 rounded-xl p-6 border border-[#C0A573]/20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <h4 className="text-lg font-semibold text-[#F0F0F0]">{area.area}</h4>
              <div className="mt-2 md:mt-0">
                <div className="flex items-center">
                  <div className="h-2 w-24 bg-[#2C2A4A] rounded-full mr-2">
                    <div 
                      className="h-full bg-gradient-to-r from-[#C0A573]/70 to-[#C0A573] rounded-full" 
                      style={{ width: `${area.score}%` }}
                    ></div>
                  </div>
                  <span className="text-[#C0A573] font-bold">{area.score}%</span>
                </div>
              </div>
            </div>
            <p className="text-[#F0F0F0] mb-3 text-sm">{area.description}</p>
            <p className="text-[#C0A573] text-sm italic">建议: {area.advice}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-[#2C2A4A]/60 rounded-xl p-6 border border-[#C0A573]/30">
        <h4 className="text-lg font-semibold text-[#C0A573] mb-4">综合建议</h4>
        <p className="text-[#F0F0F0]">
          {person1.name}和{person2.name}的命理组合最强的领域是
          {areas.sort((a, b) => b.score - a.score)[0].area}，
          而最需要关注的是
          {areas.sort((a, b) => a.score - b.score)[0].area}。
          双方可以通过关注各自的优势，相互补充，共同成长。保持开放的沟通和理解，尊重彼此的差异，
          将有助于建立更加和谐与稳固的关系。
        </p>
      </div>
    </div>
  );
}

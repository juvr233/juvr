// 整体命理分析 - 融合多种命理体系
import { calculateChineseBaZi, BaziChart, adjustHexagramWeightsByBaZi } from './ichingExtended';
import { calculateStarAstrologyProfile, StarInfo } from './starAstrology';
import { generateIChinReading, IChinReading } from './iching';
import { calculateLifePath, calculateExpression } from './numerology';

// 整合命理分析结果
export interface HolisticDivinationResult {
  baziChart?: BaziChart;
  starInfo?: StarInfo;
  ichingReading?: IChinReading;
  numerology?: {
    lifePathNumber?: number;
    lifePathMeaning?: string;
    expressionNumber?: number;
    expressionMeaning?: string;
  };
  synthesis: {
    elementBalance: ElementBalance;
    lifeTrends: LifeTrends;
    keyInsights: string[];
    recommendations: string[];
  };
}

// 五行元素平衡
export interface ElementBalance {
  wood: number; // 木
  fire: number; // 火
  earth: number; // 土
  metal: number; // 金
  water: number; // 水
  dominantElement: string;
  deficientElement: string;
}

// 人生趋势
export interface LifeTrends {
  youth: string; // 年轻阶段 (0-30)
  middle: string; // 中年阶段 (30-60)
  elder: string; // 老年阶段 (60+)
  peakAge: number; // 人生高峰年龄段
  challengeAge: number; // 人生挑战年龄段
}

// 生成整合命理分析
export async function generateHolisticDivination(
  name: string,
  birthDate: Date,
  gender: string,
  question?: string
): Promise<HolisticDivinationResult> {
  // 1. 计算八字
  const baziChart = calculateChineseBaZi(birthDate);
  
  // 2. 计算星宿
  const starInfo = calculateStarAstrologyProfile(birthDate, gender);
  
  // 3. 根据八字调整卦象权重，生成更符合个人命运的卦象
  const hexagramWeights = adjustHexagramWeightsByBaZi(birthDate);
  const ichingReading = question 
    ? generateIChinReading(question) 
    : undefined;
  
  // 4. 计算数字命理
  const firstName = name.split(' ')[0];
  const lastName = name.split(' ').slice(1).join(' ');
  const lifePathNumber = calculateLifePath(birthDate.toISOString().split('T')[0]);
  const expressionNumber = calculateExpression(firstName + " " + lastName);
  
  // 5. 综合分析
  const elementBalance = calculateElementBalance(baziChart, starInfo);
  const lifeTrends = predictLifeTrends(baziChart, starInfo, lifePathNumber);
  const keyInsights = generateKeyInsights(baziChart, starInfo, ichingReading, lifePathNumber);
  const recommendations = generateRecommendations(elementBalance, baziChart, starInfo);
  
  return {
    baziChart,
    starInfo,
    ichingReading,
    numerology: {
      lifePathNumber,
      lifePathMeaning: getLifePathMeaning(lifePathNumber),
      expressionNumber,
      expressionMeaning: getExpressionMeaning(expressionNumber)
    },
    synthesis: {
      elementBalance,
      lifeTrends,
      keyInsights,
      recommendations
    }
  };
}

// 计算五行平衡
function calculateElementBalance(baziChart?: BaziChart, starInfo?: StarInfo): ElementBalance {
  // 初始化五行值
  let wood = 0, fire = 0, earth = 0, metal = 0, water = 0;
  
  // 从八字中提取五行信息
  if (baziChart) {
    const columns = [baziChart.year, baziChart.month, baziChart.day, baziChart.hour];
    
    for (const column of columns) {
      // 天干五行
      if (column.stemElement === '木') wood += 1;
      else if (column.stemElement === '火') fire += 1;
      else if (column.stemElement === '土') earth += 1;
      else if (column.stemElement === '金') metal += 1;
      else if (column.stemElement === '水') water += 1;
      
      // 地支五行
      if (column.branchElement === '木') wood += 0.5;
      else if (column.branchElement === '火') fire += 0.5;
      else if (column.branchElement === '土') earth += 0.5;
      else if (column.branchElement === '金') metal += 0.5;
      else if (column.branchElement === '水') water += 0.5;
      
      // 藏干五行
      if (column.hiddenElements) {
        for (const element of column.hiddenElements) {
          if (element === '木') wood += 0.3;
          else if (element === '火') fire += 0.3;
          else if (element === '土') earth += 0.3;
          else if (element === '金') metal += 0.3;
          else if (element === '水') water += 0.3;
        }
      }
    }
  }
  
  // 从星宿中增加五行影响
  if (starInfo) {
    if (starInfo.element === '木') wood += 2;
    else if (starInfo.element === '火') fire += 2;
    else if (starInfo.element === '土') earth += 2;
    else if (starInfo.element === '金') metal += 2;
    else if (starInfo.element === '水') water += 2;
  }
  
  // 确定主导和缺乏的五行
  const elements = [
    { name: '木', value: wood },
    { name: '火', value: fire },
    { name: '土', value: earth },
    { name: '金', value: metal },
    { name: '水', value: water }
  ];
  
  elements.sort((a, b) => b.value - a.value);
  const dominantElement = elements[0].name;
  const deficientElement = elements[4].name;
  
  return {
    wood, fire, earth, metal, water,
    dominantElement,
    deficientElement
  };
}

// 预测人生趋势
function predictLifeTrends(baziChart?: BaziChart, starInfo?: StarInfo, lifePathNumber?: number): LifeTrends {
  // 默认值
  let youth = "早年积累经验，学习成长，为未来打下基础。";
  let middle = "中年事业逐渐稳定，家庭生活和谐，达到人生平衡。";
  let elder = "晚年安享生活，回馈社会，享受天伦之乐。";
  let peakAge = 35;
  let challengeAge = 45;
  
  // 根据八字调整
  if (baziChart) {
    const dayMasterStrength = baziChart.dayMasterStrength || 50;
    
    if (dayMasterStrength > 70) {
      youth = "早年充满活力和机遇，发展较快，容易受到赏识。";
      peakAge = 30;
    } else if (dayMasterStrength < 40) {
      youth = "早年可能面临挑战，需要更多耐心和努力，打下扎实基础。";
      peakAge = 40;
    }
    
    // 根据日主五行调整
    const dayMasterElement = baziChart.masterElement;
    if (dayMasterElement === '木') {
      middle = "中年如茂盛之树，事业蓬勃发展，人际关系广泛。";
      challengeAge = 50;
    } else if (dayMasterElement === '火') {
      middle = "中年光芒四射，事业达到高峰，但需注意健康和情绪控制。";
      challengeAge = 40;
    } else if (dayMasterElement === '土') {
      middle = "中年稳定踏实，家庭和事业根基牢固，收获丰厚。";
      challengeAge = 55;
    } else if (dayMasterElement === '金') {
      middle = "中年财富积累明显，社会地位提升，人脉资源丰富。";
      challengeAge = 45;
    } else if (dayMasterElement === '水') {
      middle = "中年智慧增长，适应能力强，能够在变化中把握机遇。";
      challengeAge = 42;
    }
  }
  
  // 根据星宿调整
  if (starInfo) {
    if (starInfo.guardian === '青龙') {
      elder = "晚年德高望重，受人尊敬，能发挥余热，享有盛名。";
    } else if (starInfo.guardian === '白虎') {
      elder = "晚年精神矍铄，依然有活力，可能仍有一番作为。";
    } else if (starInfo.guardian === '朱雀') {
      elder = "晚年思维敏锐，可能在艺术或学术上有所建树，桃花运也不错。";
    } else if (starInfo.guardian === '玄武') {
      elder = "晚年生活安稳，健康长寿，能够安享天年。";
    }
  }
  
  // 根据生命路径数调整
  if (lifePathNumber) {
    switch(lifePathNumber) {
      case 1:
        peakAge = 28;
        break;
      case 2:
        peakAge = 38;
        break;
      case 3:
        peakAge = 33;
        break;
      case 4:
        peakAge = 42;
        break;
      case 5:
        peakAge = 31;
        break;
      case 6:
        peakAge = 37;
        break;
      case 7:
        peakAge = 40;
        break;
      case 8:
        peakAge = 36;
        break;
      case 9:
        peakAge = 45;
        break;
    }
  }
  
  return {
    youth,
    middle,
    elder,
    peakAge,
    challengeAge
  };
}

// 生成关键洞见
function generateKeyInsights(
  baziChart?: BaziChart,
  starInfo?: StarInfo,
  ichingReading?: IChinReading,
  lifePathNumber?: number
): string[] {
  const insights: string[] = [];
  
  // 从八字中提取洞见
  if (baziChart) {
    insights.push(`您的日主五行为${baziChart.masterElement}，${
      baziChart.dayMasterStrength && baziChart.dayMasterStrength > 70 
      ? '表现强势，性格坚定，适合主导和领导角色。' 
      : baziChart.dayMasterStrength && baziChart.dayMasterStrength < 40 
        ? '表现较弱，性格温和，适合协作和辅助角色。' 
        : '力量平衡，性格稳定，适合多种角色。'
    }`);
    
    if (baziChart.favorableElements && baziChart.favorableElements.length > 0) {
      insights.push(`五行${baziChart.favorableElements.join('、')}对您较为有利，可以在相关领域寻求发展。`);
    }
  }
  
  // 从星宿中提取洞见
  if (starInfo) {
    insights.push(`您的命宿为${starInfo.mainStar.name}，受${starInfo.guardian}守护，具有${starInfo.strengths.slice(0, 2).join('、')}等特质。`);
    
    if (starInfo.luckyDirections && starInfo.luckyDirections.length > 0) {
      insights.push(`您的幸运方位为${starInfo.luckyDirections.join('、')}，在这些方向发展会更顺利。`);
    }
  }
  
  // 从周易中提取洞见
  if (ichingReading) {
    insights.push(`周易显示您当前的状态为"${ichingReading.hexagram.name}"，建议您关注其中的智慧与启示。`);
    
    if (ichingReading.changingLines.length > 0) {
      insights.push(`需要注意的是第${ichingReading.changingLines[0]}爻的变化，它显示了当前形势的关键点。`);
    }
  }
  
  // 从数字命理提取洞见
  if (lifePathNumber) {
    const lifePathInsight = getLifePathInsight(lifePathNumber);
    if (lifePathInsight) {
      insights.push(lifePathInsight);
    }
  }
  
  // 如果洞见不足，添加一些通用洞见
  if (insights.length < 3) {
    insights.push("通过命理分析，建议您在人生决策时保持平衡，既要考虑现实条件，也要关注内心渴望。");
    insights.push("成功不仅来自外在环境，更源于内在的修炼和成长。保持学习和进步的态度将助您一生。");
  }
  
  return insights;
}

// 生成个性化建议
function generateRecommendations(
  elementBalance: ElementBalance,
  baziChart?: BaziChart,
  starInfo?: StarInfo
): string[] {
  const recommendations: string[] = [];
  
  // 根据五行平衡给出建议
  recommendations.push(`您的五行中${elementBalance.dominantElement}较强，${elementBalance.deficientElement}较弱，可以通过以下方式调整平衡：`);
  
  if (elementBalance.deficientElement === '木') {
    recommendations.push("增强木元素：多接触绿色植物，在东方位置摆放绿色植物，多穿绿色衣物，饮食中增加绿叶蔬菜摄入。");
  } else if (elementBalance.deficientElement === '火') {
    recommendations.push("增强火元素：增加阳光照射时间，在南方位置摆放红色物品，多穿红色或紫色衣物，适当增加辛辣食物摄入。");
  } else if (elementBalance.deficientElement === '土') {
    recommendations.push("增强土元素：多接触土地、陶土制品，在中央或西南方位摆放黄色物品，多穿黄色或棕色衣物，适当增加甜食和根茎类食物摄入。");
  } else if (elementBalance.deficientElement === '金') {
    recommendations.push("增强金元素：使用金属饰品，在西方位置摆放金属制品，多穿白色或金色衣物，适当增加辛辣和干燥食物摄入。");
  } else if (elementBalance.deficientElement === '水') {
    recommendations.push("增强水元素：多接触水源，在北方位置摆放流水或蓝色物品，多穿蓝色或黑色衣物，适当增加咸味和海鲜类食物摄入。");
  }
  
  // 根据八字给出职业建议
  if (baziChart && baziChart.careerIndications && baziChart.careerIndications.length > 0) {
    const careerSuggestion = baziChart.careerIndications.find(item => item.includes("适合从事的行业"));
    if (careerSuggestion) {
      recommendations.push(`事业选择：${careerSuggestion}`);
    }
  }
  
  // 根据星宿给出性格发展建议
  if (starInfo && starInfo.challenges && starInfo.challenges.length > 0) {
    recommendations.push(`性格发展：注意改善${starInfo.challenges.slice(0, 2).join('、')}等性格弱点，充分发挥${starInfo.strengths.slice(0, 2).join('、')}等优势。`);
  }
  
  // 一些通用的健康和关系建议
  recommendations.push("健康建议：保持规律的作息，均衡的饮食，适度的运动，定期体检，注意身心平衡。");
  recommendations.push("人际关系：真诚对待他人，善于倾听，表达清晰，建立互信，选择积极向上的朋友圈。");
  
  return recommendations;
}

// 获取生命路径数对应的含义
function getLifePathMeaning(lifePathNumber?: number): string {
  if (!lifePathNumber) return "";
  
  const meanings: {[key: number]: string} = {
    1: "独立、创新、领导力、决断力、原创性",
    2: "合作、外交、和谐、敏感、平衡",
    3: "表达、创造力、社交、乐观、灵感",
    4: "实际、组织、勤奋、稳定、可靠",
    5: "自由、变化、冒险、适应力、机智",
    6: "责任、爱、服务、和谐、平衡",
    7: "分析、智慧、内省、神秘、精神",
    8: "力量、成就、权威、物质、务实",
    9: "人道主义、同情、智慧、理想主义、艺术"
  };
  
  return meanings[lifePathNumber] || "";
}

// 获取表达数对应的含义
function getExpressionMeaning(expressionNumber?: number): string {
  if (!expressionNumber) return "";
  
  const meanings: {[key: number]: string} = {
    1: "领导者、独立思考、创新、积极进取",
    2: "外交家、和平使者、敏感、善解人意",
    3: "艺术家、表达者、社交达人、乐观积极",
    4: "建设者、组织者、务实、可靠稳定",
    5: "自由人、探险家、多变、适应力强",
    6: "照顾者、责任感强、关爱、和谐",
    7: "思想家、分析者、内省、追求真理",
    8: "成就者、管理者、务实、追求成功",
    9: "人道主义者、理想主义者、富有同情心"
  };
  
  return meanings[expressionNumber] || "";
}

// 根据生命路径数获取洞见
function getLifePathInsight(lifePathNumber: number): string {
  const insights: {[key: number]: string} = {
    1: "作为1号生命路径的人，您天生具有领导能力和独立思考的特质。您的使命是开创新局面，展现个人独特性。",
    2: "作为2号生命路径的人，您具有协调与平衡的天赋。您的使命是促进和谐，成为团队中的桥梁和纽带。",
    3: "作为3号生命路径的人，您拥有出色的表达能力和创造力。您的使命是传递joy和美，激发他人的创造性。",
    4: "作为4号生命路径的人，您有组织和务实的特质。您的使命是建立稳固的基础，确保事物有序运行。",
    5: "作为5号生命路径的人，您渴望自由和变化。您的使命是体验多元人生，并帮助他人适应变化的世界。",
    6: "作为6号生命路径的人，您具有责任感和关爱他人的特质。您的使命是创造和谐环境，照顾那些需要帮助的人。",
    7: "作为7号生命路径的人，您有深思熟虑和求知的特质。您的使命是探索真相，追求智慧和精神成长。",
    8: "作为8号生命路径的人，您有实现目标和管理能力的特质。您的使命是创造物质成功，同时保持正直和平衡。",
    9: "作为9号生命路径的人，您有博爱和理想主义的特质。您的使命是服务人类，创造更美好的世界。"
  };
  
  return insights[lifePathNumber] || "";
}

// 更新十二个地支
export const EARTHLY_BRANCHES = [
  { name: "子", element: "水", zodiac: "鼠", translation: "Zi (Rat)" },
  { name: "丑", element: "土", zodiac: "牛", translation: "Chou (Ox)" },
  { name: "寅", element: "木", zodiac: "虎", translation: "Yin (Tiger)" },
  { name: "卯", element: "木", zodiac: "兔", translation: "Mao (Rabbit)" },
  { name: "辰", element: "土", zodiac: "龙", translation: "Chen (Dragon)" },
  { name: "巳", element: "火", zodiac: "蛇", translation: "Si (Snake)" },
  { name: "午", element: "火", zodiac: "马", translation: "Wu (Horse)" },
  { name: "未", element: "土", zodiac: "羊", translation: "Wei (Goat)" },
  { name: "申", element: "金", zodiac: "猴", translation: "Shen (Monkey)" },
  { name: "酉", element: "金", zodiac: "鸡", translation: "You (Rooster)" },
  { name: "戌", element: "土", zodiac: "狗", translation: "Xu (Dog)" },
  { name: "亥", element: "水", zodiac: "猪", translation: "Hai (Pig)" }
];

// 更新十天干
export const HEAVENLY_STEMS = [
  { name: "甲", element: "木", yin_yang: "阳", translation: "Jia" },
  { name: "乙", element: "木", yin_yang: "阴", translation: "Yi" },
  { name: "丙", element: "火", yin_yang: "阳", translation: "Bing" },
  { name: "丁", element: "火", yin_yang: "阴", translation: "Ding" },
  { name: "戊", element: "土", yin_yang: "阳", translation: "Wu" },
  { name: "己", element: "土", yin_yang: "阴", translation: "Ji" },
  { name: "庚", element: "金", yin_yang: "阳", translation: "Geng" },
  { name: "辛", element: "金", yin_yang: "阴", translation: "Xin" },
  { name: "壬", element: "水", yin_yang: "阳", translation: "Ren" },
  { name: "癸", element: "水", yin_yang: "阴", translation: "Gui" }
];

// 八字基本结构
export interface BaziColumn {
  stem: string;
  branch: string;
  stemElement?: string;
  branchElement?: string;
  hiddenElements?: string[];
  stemBranchRelation?: string;
  strength?: number; // 0-100表示强弱
}

export interface BaziChart {
  year: BaziColumn;
  month: BaziColumn;
  day: BaziColumn;
  hour: BaziColumn;
  masterElement?: string;
  dayMasterStrength?: number; // 0-100，表示日主的强弱
  favorableElements?: string[];
  unfavorableElements?: string[];
  luck?: string;
  healthIndications?: string[];
  careerIndications?: string[];
  relationshipIndications?: string[];
  comments?: string;
}

// 天干地支五行关系
const STEM_ELEMENT_MAP: {[key: string]: string} = {
  "甲": "木", "乙": "木",
  "丙": "火", "丁": "火",
  "戊": "土", "己": "土",
  "庚": "金", "辛": "金",
  "壬": "水", "癸": "水"
};

const BRANCH_ELEMENT_MAP: {[key: string]: string} = {
  "子": "水",
  "丑": "土",
  "寅": "木",
  "卯": "木",
  "辰": "土",
  "巳": "火",
  "午": "火",
  "未": "土",
  "申": "金",
  "酉": "金",
  "戌": "土",
  "亥": "水"
};

// 地支藏干（显示地支中隐藏的天干）
const HIDDEN_STEMS: {[key: string]: string[]} = {
  "子": ["癸"],
  "丑": ["己", "癸", "辛"],
  "寅": ["甲", "丙", "戊"],
  "卯": ["乙"],
  "辰": ["戊", "乙", "癸"],
  "巳": ["丙", "庚", "戊"],
  "午": ["丁", "己"],
  "未": ["己", "丁", "乙"],
  "申": ["庚", "壬", "戊"],
  "酉": ["辛"],
  "戌": ["戊", "辛", "丁"],
  "亥": ["壬", "甲"]
};

// 天干地支相合关系
const STEM_BRANCH_COMBINATIONS: {[key: string]: {relation: string, effect: string}} = {
  "甲子": { relation: "六合", effect: "木水相生" },
  "乙丑": { relation: "六合", effect: "木土相克" },
  "丙寅": { relation: "六合", effect: "火木相生" },
  "丁卯": { relation: "六合", effect: "火木相生" },
  "戊辰": { relation: "六合", effect: "土土比和" },
  "己巳": { relation: "六合", effect: "土火相生" },
  "庚午": { relation: "六合", effect: "金火相克" },
  "辛未": { relation: "六合", effect: "金土相生" },
  "壬申": { relation: "六合", effect: "水金相生" },
  "癸酉": { relation: "六合", effect: "水金相生" }
};

// 五行相生相克关系
const ELEMENT_RELATIONS: {[key: string]: {[key: string]: string}} = {
  "木": { "木": "比和", "火": "生", "土": "克", "金": "被克", "水": "被生" },
  "火": { "木": "被生", "火": "比和", "土": "生", "金": "克", "水": "被克" },
  "土": { "木": "被克", "火": "被生", "土": "比和", "金": "生", "水": "克" },
  "金": { "木": "克", "火": "被克", "土": "被生", "金": "比和", "水": "生" },
  "水": { "木": "生", "火": "克", "土": "被克", "金": "被生", "水": "比和" }
};

// 获取生辰八字
export function calculateChineseBaZi(birthDate: Date): BaziChart {
  // 这里是改进版的八字计算，仍然简化但比之前更详细
  // 真实算命应使用专业的农历转换库
  
  const yearIndex = (birthDate.getFullYear() - 4) % 60;
  const yearStem = HEAVENLY_STEMS[yearIndex % 10].name;
  const yearBranch = EARTHLY_BRANCHES[yearIndex % 12].name;
  
  // 改进的月干支计算
  const monthIndex = birthDate.getMonth();
  const yearStemIndex = HEAVENLY_STEMS.findIndex(stem => stem.name === yearStem);
  // 月干与年干有对应关系
  const monthStemBase = (yearStemIndex % 5) * 2; // 依据年干确定月干起点
  const monthStem = HEAVENLY_STEMS[(monthStemBase + monthIndex) % 10].name;
  const monthBranch = EARTHLY_BRANCHES[monthIndex % 12].name;
  
  // 简化的日干支计算（实际应考虑农历和节气）
  const dayOffset = Math.floor(birthDate.getTime() / (24 * 60 * 60 * 1000));
  const dayStem = HEAVENLY_STEMS[dayOffset % 10].name;
  const dayBranch = EARTHLY_BRANCHES[dayOffset % 12].name;
  
  // 时辰干支计算
  const birthHour = birthDate.getHours();
  const hourIndex = Math.floor(birthHour / 2);
  const hourBranch = EARTHLY_BRANCHES[hourIndex % 12].name;
  // 时干需要根据日干推算
  const dayStemIndex = HEAVENLY_STEMS.findIndex(stem => stem.name === dayStem);
  const hourStem = HEAVENLY_STEMS[(dayStemIndex * 2 + hourIndex) % 10].name;
  
  // 构建八字列
  const year = buildBaziColumn(yearStem, yearBranch);
  const month = buildBaziColumn(monthStem, monthBranch);
  const day = buildBaziColumn(dayStem, dayBranch);
  const hour = buildBaziColumn(hourStem, hourBranch);
  
  // 分析八字整体情况
  const chart = analyzeChart({ year, month, day, hour });
  
  return chart;
}

// 构建八字单柱信息
function buildBaziColumn(stem: string, branch: string): BaziColumn {
  const stemElement = STEM_ELEMENT_MAP[stem] || "未知";
  const branchElement = BRANCH_ELEMENT_MAP[branch] || "未知";
  const hiddenElements = (HIDDEN_STEMS[branch] || []).map(hiddenStem => STEM_ELEMENT_MAP[hiddenStem]);
  const stemBranchRelation = STEM_BRANCH_COMBINATIONS[stem + branch]?.relation || "无特殊关系";
  
  // 计算柱子五行强度
  const strength = calculateColumnStrength(stem, branch, stemElement, branchElement, hiddenElements);
  
  return {
    stem,
    branch,
    stemElement,
    branchElement,
    hiddenElements,
    stemBranchRelation,
    strength
  };
}

// 计算单柱五行强度
function calculateColumnStrength(
  stem: string, 
  branch: string, 
  stemElement: string, 
  branchElement: string,
  hiddenElements: string[]
): number {
  // 基础强度
  let strength = 50;
  
  // 天干地支五行相同，增加强度
  if (stemElement === branchElement) {
    strength += 20;
  }
  
  // 天干地支特殊组合
  if (STEM_BRANCH_COMBINATIONS[stem + branch]) {
    const effect = STEM_BRANCH_COMBINATIONS[stem + branch].effect;
    if (effect.includes("相生")) {
      strength += 15;
    } else if (effect.includes("比和")) {
      strength += 10;
    } else if (effect.includes("相克")) {
      strength -= 10;
    }
  }
  
  // 地支藏干五行影响
  for (const element of hiddenElements) {
    const relation = ELEMENT_RELATIONS[stemElement]?.[element] || "未知";
    if (relation === "被生") strength += 10;
    else if (relation === "生") strength += 5;
    else if (relation === "比和") strength += 5;
    else if (relation === "被克") strength -= 10;
    else if (relation === "克") strength += 0; // 中性
  }
  
  // 限制范围
  return Math.max(0, Math.min(100, strength));
}

// 分析整个八字
function analyzeChart(chart: BaziChart): BaziChart {
  // 确定日主（日柱天干）及其强弱
  const dayMasterElement = chart.day.stemElement || "未知";
  const dayMasterStrength = analyzeDayMasterStrength(chart);
  
  // 确定喜用神（日主过弱需要补，过强需要泄）
  const favorableElements = determineFavorableElements(dayMasterElement, dayMasterStrength);
  
  // 不利五行
  const unfavorableElements = determineUnfavorableElements(dayMasterElement, favorableElements);
  
  // 生成分析
  const luck = generateLuckAnalysis(chart, favorableElements);
  const healthIndications = generateHealthAnalysis(chart);
  const careerIndications = generateCareerAnalysis(chart, favorableElements);
  const relationshipIndications = generateRelationshipAnalysis(chart);
  
  return {
    ...chart,
    masterElement: dayMasterElement,
    dayMasterStrength,
    favorableElements,
    unfavorableElements,
    luck,
    healthIndications,
    careerIndications,
    relationshipIndications,
    comments: generateOverallComments(chart)
  };
}

// 分析日主强弱
function analyzeDayMasterStrength(chart: BaziChart): number {
  const dayElement = chart.day.stemElement || "未知";
  let strength = chart.day.strength || 50;
  
  // 考虑其他柱对日主的支持或削弱
  const columns = [chart.year, chart.month, chart.hour];
  for (const column of columns) {
    const stemElement = column.stemElement || "未知";
    const relation = ELEMENT_RELATIONS[dayElement]?.[stemElement] || "未知";
    
    if (relation === "被生") strength += 10;
    else if (relation === "生") strength -= 5;
    else if (relation === "比和") strength += 5;
    else if (relation === "被克") strength -= 10;
    else if (relation === "克") strength += 5;
    
    // 考虑地支藏干的影响
    const hiddenElements = column.hiddenElements || [];
    for (const hidden of hiddenElements) {
      const hiddenRelation = ELEMENT_RELATIONS[dayElement]?.[hidden] || "未知";
      if (hiddenRelation === "被生") strength += 5;
      else if (hiddenRelation === "生") strength -= 2;
      else if (hiddenRelation === "比和") strength += 2;
      else if (hiddenRelation === "被克") strength -= 5;
      else if (hiddenRelation === "克") strength += 2;
    }
  }
  
  return Math.max(0, Math.min(100, strength));
}

// 确定喜用神（有利五行）
function determineFavorableElements(dayMasterElement: string, dayMasterStrength: number): string[] {
  const elements = ["木", "火", "土", "金", "水"];
  
  if (dayMasterStrength > 70) {
    // 日主过强，需要泄、克
    return elements.filter(element => 
      ELEMENT_RELATIONS[dayMasterElement]?.[element] === "生" || 
      ELEMENT_RELATIONS[dayMasterElement]?.[element] === "被克"
    );
  } else if (dayMasterStrength < 40) {
    // 日主过弱，需要生、同
    return elements.filter(element => 
      ELEMENT_RELATIONS[dayMasterElement]?.[element] === "被生" || 
      ELEMENT_RELATIONS[dayMasterElement]?.[element] === "比和"
    );
  } else {
    // 日主中和，可用同、生
    return elements.filter(element => 
      ELEMENT_RELATIONS[dayMasterElement]?.[element] === "比和" || 
      ELEMENT_RELATIONS[dayMasterElement]?.[element] === "被生"
    );
  }
}

// 确定不利五行
function determineUnfavorableElements(dayMasterElement: string, favorableElements: string[]): string[] {
  return ["木", "火", "土", "金", "水"].filter(
    element => !favorableElements.includes(element) && element !== dayMasterElement
  );
}

// 生成运势分析
function generateLuckAnalysis(chart: BaziChart, favorableElements: string[]): string {
  const dayMasterStrength = chart.dayMasterStrength || 50;
  const dayMasterElement = chart.day.stemElement || "未知";
  
  if (dayMasterStrength > 70) {
    return `日主${dayMasterElement}过强，宜泻不宜补。五行中${favorableElements.join('、')}对您有利，可带来好运。`;
  } else if (dayMasterStrength < 40) {
    return `日主${dayMasterElement}偏弱，宜补不宜泻。五行中${favorableElements.join('、')}能增强您的能量，带来好运。`;
  } else {
    return `日主${dayMasterElement}平衡适中，五行较为和谐。${favorableElements.join('、')}可作为您的助力，强化运势。`;
  }
}

// 生成健康分析
function generateHealthAnalysis(chart: BaziChart): string[] {
  const elements = ["木", "火", "土", "金", "水"];
  const organMap = {
    "木": "肝胆",
    "火": "心脏、小肠",
    "土": "脾胃",
    "金": "肺、大肠",
    "水": "肾膀胱"
  };
  
  const dayMasterElement = chart.day.stemElement || "未知";
  const dayMasterStrength = chart.dayMasterStrength || 50;
  const weakElements = elements.filter(elem => {
    const relation = ELEMENT_RELATIONS[dayMasterElement]?.[elem] || "未知";
    return relation === "被克" || relation === "克";
  });
  
  const healthTips = [];
  
  // 根据日主强弱
  if (dayMasterStrength > 70) {
    healthTips.push(`日主${dayMasterElement}偏强，注意保持情绪稳定，避免过度劳累。`);
  } else if (dayMasterStrength < 40) {
    healthTips.push(`日主${dayMasterElement}偏弱，应加强锻炼，增强体质，保持充足休息。`);
  } else {
    healthTips.push(`日主${dayMasterElement}平衡，保持良好的生活习惯有助于维持健康。`);
  }
  
  // 根据薄弱五行给出具体建议
  for (const elem of weakElements) {
    healthTips.push(`五行中${elem}较弱，可能影响${organMap[elem as keyof typeof organMap]}的健康，应多加注意。`);
  }
  
  return healthTips;
}

// 生成事业分析
function generateCareerAnalysis(chart: BaziChart, favorableElements: string[]): string[] {
  const careerMap = {
    "木": ["教育", "法律", "创业", "规划"],
    "火": ["演艺", "营销", "公关", "厨师"],
    "土": ["房地产", "农业", "建筑", "服务业"],
    "金": ["金融", "IT", "机械", "制造"],
    "水": ["艺术", "科研", "旅游", "运输"]
  };
  
  const tips = [];
  
  // 根据有利五行推荐职业
  let careers = [];
  for (const elem of favorableElements) {
    careers = [...careers, ...(careerMap[elem as keyof typeof careerMap] || [])];
  }
  
  if (careers.length > 0) {
    tips.push(`适合从事的行业: ${careers.slice(0, 5).join('、')}等`);
  }
  
  // 根据日主特点给出事业建议
  const dayMasterStrength = chart.dayMasterStrength || 50;
  const dayMasterElement = chart.day.stemElement || "未知";
  
  if (dayMasterStrength > 70) {
    tips.push(`日主${dayMasterElement}偏强，适合独立创业或担任领导职位。`);
    tips.push("工作中注意倾听他人意见，避免过于强势。");
  } else if (dayMasterStrength < 40) {
    tips.push(`日主${dayMasterElement}偏弱，适合团队协作或辅助性工作。`);
    tips.push("工作中应提升自信，发挥专业特长。");
  } else {
    tips.push(`日主${dayMasterElement}平衡，事业发展稳定，适应性强。`);
    tips.push("工作中可以灵活变通，适合多领域发展。");
  }
  
  return tips;
}

// 生成感情分析
function generateRelationshipAnalysis(chart: BaziChart): string[] {
  const tips = [];
  const dayMasterElement = chart.day.stemElement || "未知";
  const dayMasterStrength = chart.dayMasterStrength || 50;
  
  // 分析适合的伴侣五行
  const suitablePartnerElements = ["木", "火", "土", "金", "水"].filter(elem => {
    const relation = ELEMENT_RELATIONS[dayMasterElement]?.[elem] || "未知";
    return dayMasterStrength > 60 
      ? relation === "被克" || relation === "生" // 强者需要被制衡
      : relation === "被生" || relation === "比和"; // 弱者需要被滋养
  });
  
  tips.push(`在感情中，您可能与五行属${suitablePartnerElements.join('、')}的人相处融洽。`);
  
  // 根据日主特点给出感情建议
  if (dayMasterStrength > 70) {
    tips.push("您个性较强，在感情中注意倾听和包容，避免过于主导。");
  } else if (dayMasterStrength < 40) {
    tips.push("您性格温和，在感情中需要表达自己的需求，避免过度迁就。");
  } else {
    tips.push("您在感情中较为平衡，能够既表达关爱又保持自我。");
  }
  
  return tips;
}

// 生成整体评价
function generateOverallComments(chart: BaziChart): string {
  const elements = countElements(chart);
  const dayMasterStrength = chart.dayMasterStrength || 50;
  
  let comment = "您的八字";
  
  // 五行平衡性评价
  const elementTypes = Object.keys(elements).length;
  if (elementTypes >= 4) {
    comment += "五行齐全，基础运势较为平衡。";
  } else if (elementTypes === 3) {
    comment += "五行分布较为均衡，但有所偏重。";
  } else {
    comment += "五行分布不均，可能在某些方面有所偏颇。";
  }
  
  // 日主评价
  if (dayMasterStrength > 70) {
    comment += "日主较强，性格坚定，做事有主见，但需注意倾听他人意见。";
  } else if (dayMasterStrength < 40) {
    comment += "日主较弱，性格温和，善于配合，但应增强自信和决断力。";
  } else {
    comment += "日主适中，性格均衡，处事灵活，适应能力强。";
  }
  
  return comment;
}

// 统计八字中的五行分布
function countElements(chart: BaziChart): {[key: string]: number} {
  const elements: {[key: string]: number} = {};
  const columns = [chart.year, chart.month, chart.day, chart.hour];
  
  for (const column of columns) {
    // 天干五行
    const stemElement = column.stemElement || "";
    if (stemElement) {
      elements[stemElement] = (elements[stemElement] || 0) + 1;
    }
    
    // 地支五行
    const branchElement = column.branchElement || "";
    if (branchElement) {
      elements[branchElement] = (elements[branchElement] || 0) + 0.5; // 地支主气
    }
    
    // 藏干五行
    const hiddenElements = column.hiddenElements || [];
    for (const hidden of hiddenElements) {
      elements[hidden] = (elements[hidden] || 0) + 0.3; // 地支藏干
    }
  }
  
  return elements;
}

// 根据生辰八字增加卦象权重
export function adjustHexagramWeightsByBaZi(birthDate: Date): { [key: number]: number } {
  const baziChart = calculateChineseBaZi(birthDate);
  const weights: { [key: number]: number } = {};
  
  // 根据日主五行调整卦象权重
  const dayMasterElement = baziChart.masterElement;
  
  // 八卦五行对应
  const hexagramElementMap: {[key: string]: number[]} = {
    "木": [51, 32, 57], // 震、艮、巽
    "火": [30, 56, 50], // 离
    "土": [2, 15, 20, 23, 35], // 坤、剥、蹇、谦
    "金": [44, 1, 43], // 乾、夬、泰
    "水": [29, 59, 39] // 坎、涣、蹇
  };
  
  // 增加对应卦象权重
  if (dayMasterElement && hexagramElementMap[dayMasterElement]) {
    for (const hexId of hexagramElementMap[dayMasterElement]) {
      weights[hexId] = (weights[hexId] || 1) * 1.8;
    }
  }
  
  // 考虑五行平衡
  if (baziChart.favorableElements) {
    for (const element of baziChart.favorableElements) {
      if (hexagramElementMap[element]) {
        for (const hexId of hexagramElementMap[element]) {
          weights[hexId] = (weights[hexId] || 1) * 1.5;
        }
      }
    }
  }
  
  return weights;
}

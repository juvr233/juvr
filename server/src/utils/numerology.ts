import { NumerologyData } from '../models/userHistory.model';

/**
 * 计算生命数字
 * @param birthDate 出生日期，格式 YYYY-MM-DD
 * @returns 生命数字（1-9）
 */
export const calculateLifePathNumber = (birthDate: string): number => {
  if (!birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    throw new Error('出生日期格式无效，请使用YYYY-MM-DD格式');
  }

  // 移除所有非数字字符
  const dateDigits = birthDate.replace(/\D/g, '');
  
  // 将所有数字相加，直到得到单个数字（或主要数字11、22）
  let sum = dateDigits.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  
  // 继续相加数字直到得到单个数字
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  
  return sum;
};

/**
 * 计算表达数字（基于姓名）
 * @param name 姓名
 * @returns 表达数字（1-9）
 */
export const calculateExpressionNumber = (name: string): number => {
  if (!name) return 0;
  
  const letterValues: { [key: string]: number } = {
    'a': 1, 'j': 1, 's': 1,
    'b': 2, 'k': 2, 't': 2,
    'c': 3, 'l': 3, 'u': 3,
    'd': 4, 'm': 4, 'v': 4,
    'e': 5, 'n': 5, 'w': 5,
    'f': 6, 'o': 6, 'x': 6,
    'g': 7, 'p': 7, 'y': 7,
    'h': 8, 'q': 8, 'z': 8,
    'i': 9, 'r': 9
  };
  
  // 移除所有非字母字符并转换为小写
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  
  // 将每个字母转换为对应的数字并相加
  let sum = 0;
  for (const letter of cleanName) {
    sum += letterValues[letter] || 0;
  }
  
  // 继续相加数字直到得到单个数字（或主要数字11、22）
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  
  return sum;
};

/**
 * 计算灵魂渴望数字
 * @param name 姓名
 * @returns 灵魂渴望数字（1-9）
 */
export const calculateSoulUrgeNumber = (name: string): number => {
  if (!name) return 0;
  
  const vowelValues: { [key: string]: number } = {
    'a': 1, 'e': 5, 'i': 9, 'o': 6, 'u': 3, 'y': 7
  };
  
  // 移除所有非字母字符并转换为小写
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  
  // 只计算元音字母
  let sum = 0;
  for (const letter of cleanName) {
    if (vowelValues[letter]) {
      sum += vowelValues[letter];
    }
  }
  
  // 继续相加数字直到得到单个数字（或主要数字11、22）
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  
  return sum;
};

/**
 * 计算人格数字
 * @param name 姓名
 * @returns 人格数字（1-9）
 */
export const calculatePersonalityNumber = (name: string): number => {
  if (!name) return 0;
  
  const consonantValues: { [key: string]: number } = {
    'b': 2, 'c': 3, 'd': 4, 'f': 6, 'g': 7, 'h': 8, 'j': 1, 'k': 2, 'l': 3,
    'm': 4, 'n': 5, 'p': 7, 'q': 8, 'r': 9, 's': 1, 't': 2, 'v': 4,
    'w': 5, 'x': 6, 'z': 8
  };
  
  // 移除所有非字母字符并转换为小写
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  
  // 只计算辅音字母
  let sum = 0;
  for (const letter of cleanName) {
    if (consonantValues[letter]) {
      sum += consonantValues[letter];
    }
  }
  
  // 继续相加数字直到得到单个数字（或主要数字11、22）
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  
  return sum;
};

/**
 * 根据出生日期和姓名生成完整的数字学分析
 * @param birthDate 出生日期，格式 YYYY-MM-DD
 * @param name 姓名（可选）
 * @returns 数字学分析数据
 */
export const generateNumerologyAnalysis = (birthDate: string, name?: string): NumerologyData => {
  // 计算主要数字
  const lifePathNumber = calculateLifePathNumber(birthDate);
  
  // 初始化结果对象
  const result: NumerologyData = {
    birthDate,
    name,
    lifePathNumber,
    interpretations: {
      lifePath: interpretLifePathNumber(lifePathNumber)
    }
  };
  
  // 如果提供了姓名，计算其他数字
  if (name) {
    const destinyNumber = calculateExpressionNumber(name);
    const soulUrgeNumber = calculateSoulUrgeNumber(name);
    const personalityNumber = calculatePersonalityNumber(name);
    
    // 添加到结果中
    result.destinyNumber = destinyNumber;
    result.soulUrgeNumber = soulUrgeNumber;
    result.personalityNumber = personalityNumber;
    
    // 添加解释
    result.interpretations.destiny = interpretDestinyNumber(destinyNumber);
    result.interpretations.soulUrge = interpretSoulUrgeNumber(soulUrgeNumber);
    result.interpretations.personality = interpretPersonalityNumber(personalityNumber);
  }
  
  return result;
};

// 数字解释函数（简化版）
function interpretLifePathNumber(number: number): string {
  const interpretations: { [key: number]: string } = {
    1: '作为1号人物，你天生就是一个领导者，勇于开创，独立自主，富有创造力。你渴望成就，勇于尝试新事物，并且拥有强烈的决心。',
    2: '作为2号人物，你富有同情心、敏感且善解人意。你是一个天然的和平使者，擅长调解矛盾和创造和谐。你重视合作而非竞争。',
    3: '作为3号人物，你充满创造力和表现力。你天生就有艺术天赋，能够通过各种形式表达自己。你乐观向上，善于交际，总是能带给他人快乐。',
    4: '作为4号人物，你务实可靠，组织能力强，重视稳定和秩序。你是一个辛勤的工作者，以诚信、责任感和决心为特点。',
    5: '作为5号人物，你渴望自由和变化。你适应能力强，好奇心旺盛，喜欢冒险和新体验。你有感染力的个性常常吸引他人。',
    6: '作为6号人物，你富有责任感，具有天生的滋养和关爱能力。你重视家庭和社区，总是愿意为他人提供帮助和支持。',
    7: '作为7号人物，你思维深邃，富有分析力，渴望知识和智慧。你天生就是一个思考者和观察者，重视精神成长和内在探索。',
    8: '作为8号人物，你有着强大的执行力和实现物质成功的能力。你自信、有野心、高效，天生就懂得如何处理权力和财富。',
    9: '作为9号人物，你具有强烈的同情心和人道主义精神。你心胸宽广，追求更高的理想，并且有能力激励他人实现共同目标。',
    11: '作为11号人物，你是一个直觉强烈的精神领袖。你有着高度的敏感性和洞察力，能够连接物质世界和精神领域。',
    22: '作为22号人物，你是一个实干家，能够将宏伟的愿景转化为具体现实。你有能力在大规模层面上创造和建设，造福众多人。'
  };
  
  return interpretations[number] || '未知生命数字解释';
}

function interpretDestinyNumber(number: number): string {
  const interpretations: { [key: number]: string } = {
    1: '你的命运是成为领导者和开拓者，通过自己的努力和决心实现目标。',
    2: '你的命运是成为和平缔造者，通过合作和外交手段解决冲突。',
    3: '你的命运是通过创意和艺术表达自我，启发和娱乐他人。',
    4: '你的命运是建立稳固的基础，通过努力工作和组织能力实现目标。',
    5: '你的命运是体验变化和冒险，成为适应性和自由的象征。',
    6: '你的命运是关爱他人，创造和谐的家庭和社区环境。',
    7: '你的命运是寻求知识和真理，通过研究和自我发现获得智慧。',
    8: '你的命运是实现物质成功和权威，学会平衡物质和精神世界。',
    9: '你的命运是为更大的善而工作，超越个人利益服务于社会。',
    11: '你的命运是成为精神导师，连接并启发他人。',
    22: '你的命运是成为大师级的实干家，创造对社会有持久影响的项目。'
  };
  
  return interpretations[number] || '未知命运数字解释';
}

function interpretSoulUrgeNumber(number: number): string {
  const interpretations: { [key: number]: string } = {
    1: '你的内心渴望独立自主，成为自己命运的主宰。',
    2: '你的内心渴望和平、爱与合作，重视亲密关系。',
    3: '你的内心渴望自我表达和创造，希望被欣赏和认可。',
    4: '你的内心渴望稳定和秩序，追求实用和实际的解决方案。',
    5: '你的内心渴望自由和变化，希望体验丰富多彩的生活。',
    6: '你的内心渴望和谐与平衡，希望创造美好的家庭环境。',
    7: '你的内心渴望知识和智慧，追求精神和内在的真相。',
    8: '你的内心渴望实现物质成功，希望获得安全感和认可。',
    9: '你的内心渴望为人类福祉贡献力量，追求更高的理想。',
    11: '你的内心渴望实现高度的精神觉醒和启发他人。',
    22: '你的内心渴望通过实际行动创造持久的改变。'
  };
  
  return interpretations[number] || '未知灵魂渴望数字解释';
}

function interpretPersonalityNumber(number: number): string {
  const interpretations: { [key: number]: string } = {
    1: '你的外在个性展现出独立、自信和领导力。',
    2: '你的外在个性展现出敏感、善解人意和外交能力。',
    3: '你的外在个性展现出乐观、社交能力和表现力。',
    4: '你的外在个性展现出可靠、勤奋和务实的一面。',
    5: '你的外在个性展现出适应能力、冒险精神和社交魅力。',
    6: '你的外在个性展现出责任感、关爱和奉献精神。',
    7: '你的外在个性展现出思考能力、分析能力和神秘感。',
    8: '你的外在个性展现出权威、自信和管理能力。',
    9: '你的外在个性展现出慈悲、包容和高尚的道德标准。',
    11: '你的外在个性展现出敏感、理想主义和启发性。',
    22: '你的外在个性展现出实用智慧、决心和建设能力。'
  };
  
  return interpretations[number] || '未知人格数字解释';
}

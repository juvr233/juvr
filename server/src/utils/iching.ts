import { IChingData } from '../models/userHistory.model';

// 六十四卦数据
const hexagrams = [
  { 
    number: 1, 
    name: { 
      chinese: '乾', 
      pinyin: 'Qián', 
      english: 'The Creative' 
    },
    structure: '111111',
    elements: ['heaven', 'heaven'],
    description: '乾为天，刚健中正',
    judgment: '元亨利贞。',
    image: '天行健，君子以自强不息。'
  },
  { 
    number: 2, 
    name: { 
      chinese: '坤', 
      pinyin: 'Kūn', 
      english: 'The Receptive' 
    },
    structure: '000000',
    elements: ['earth', 'earth'],
    description: '坤为地，柔顺包容',
    judgment: '元亨，利牝马之贞。君子有攸往，先迷后得主。利西南得朋，东北丧朋。安贞吉。',
    image: '地势坤，君子以厚德载物。'
  },
  // 其余卦象数据...可以根据需要添加
];

/**
 * 根据六爻生成卦象
 * @param lines 六爻数组，1代表阳爻，0代表阴爻
 * @returns 卦象信息
 */
export const getHexagramByLines = (lines: number[]): any => {
  if (!lines || lines.length !== 6) {
    throw new Error('必须提供六个爻位');
  }

  const structureStr = lines.join('');
  return hexagrams.find(hex => hex.structure === structureStr) || null;
};

/**
 * 计算变卦
 * @param originalLines 原卦爻线
 * @param changingLines 变爻位置（从下到上1-6）
 * @returns 变卦信息
 */
export const calculateChangedHexagram = (originalLines: number[], changingLines: number[]): any => {
  if (!originalLines || originalLines.length !== 6) {
    throw new Error('必须提供六个爻位');
  }

  // 复制原卦爻线
  const newLines = [...originalLines];
  
  // 应用变爻（1变0，0变1）
  changingLines.forEach(line => {
    if (line < 1 || line > 6) return;
    const index = line - 1; // 转换为0-5索引
    newLines[index] = newLines[index] === 1 ? 0 : 1;
  });
  
  return getHexagramByLines(newLines);
};

/**
 * 通过铜钱方法生成卦象
 * @returns 卦象数据
 */
export const castIChing = (): IChingData => {
  // 生成六个爻
  const lines: number[] = [];
  const changingLines: number[] = [];
  
  for (let i = 0; i < 6; i++) {
    // 模拟掷三枚铜钱，每枚正面为2分，反面为3分
    const cast1 = Math.random() < 0.5 ? 2 : 3;
    const cast2 = Math.random() < 0.5 ? 2 : 3;
    const cast3 = Math.random() < 0.5 ? 2 : 3;
    const sum = cast1 + cast2 + cast3;
    
    // 根据总和判断爻的性质
    // 6=老阴(0且变化)，7=少阳(1不变)，8=少阴(0不变)，9=老阳(1且变化)
    switch (sum) {
      case 6: // 老阴，阴爻变阳
        lines.push(0);
        changingLines.push(i + 1);
        break;
      case 7: // 少阳，阳爻不变
        lines.push(1);
        break;
      case 8: // 少阴，阴爻不变
        lines.push(0);
        break;
      case 9: // 老阳，阳爻变阴
        lines.push(1);
        changingLines.push(i + 1);
        break;
    }
  }
  
  // 获取本卦
  const originalHexagram = getHexagramByLines(lines);
  
  // 如果有变爻，计算变卦
  let resultHexagram = null;
  if (changingLines.length > 0) {
    resultHexagram = calculateChangedHexagram(lines, changingLines);
  }
  
  // 构造卦象数据
  const result: IChingData = {
    hexagram: {
      number: originalHexagram.number,
      name: originalHexagram.name,
      changingLines,
      ...(resultHexagram && {
        resultHexagram: {
          number: resultHexagram.number,
          name: resultHexagram.name
        }
      })
    },
    interpretation: {
      overall: `${originalHexagram.description}。${originalHexagram.judgment}`,
      judgment: originalHexagram.judgment,
      image: originalHexagram.image,
    }
  };
  
  return result;
};

/**
 * 简单解释卦象
 * @param hexagramNumber 卦象编号(1-64)
 * @returns 基本解释
 */
export const interpretHexagram = (hexagramNumber: number): string => {
  const hexagram = hexagrams.find(h => h.number === hexagramNumber);
  if (!hexagram) return '未找到对应卦象';
  
  return `${hexagram.name.chinese}（${hexagram.name.pinyin}）：${hexagram.description}。\n
  卦辞：${hexagram.judgment}\n
  象辞：${hexagram.image}`;
};

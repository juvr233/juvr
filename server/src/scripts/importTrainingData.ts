// @ts-nocheck
/**
 * 命理AI模型训练数据导入脚本
 * 用于导入初始训练数据
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ensureDbConnected } from '../config/database';
import { logger } from '../config/logger';
import { trainingDataService, AiModelType } from '../services/ai';

// 加载环境变量
dotenv.config();

/**
 * 生成示例训练数据
 */
function generateSampleTrainingData() {
  // 数字学训练数据示例
  const numerologyData = [
    {
      input: {
        birthDate: '1990-01-01',
        name: '张三'
      },
      output: {
        lifePathNumber: 2,
        destinyNumber: 7,
        interpretations: {
          lifePath: '生命数字2的人充满合作精神，善于协调，天生的调解者，有耐心、敏感且具有外交手腕。他们重视关系，善于倾听，能够理解不同的观点。',
          destiny: '命运数字7的人注定要追求知识和智慧。他们的使命是深入探索生活的奥秘，人生旅程中将不断进行自我反思和精神成长。'
        }
      },
      source: 'sample',
      quality: 0.9
    },
    {
      input: {
        birthDate: '1985-05-15',
        name: '李四'
      },
      output: {
        lifePathNumber: 7,
        destinyNumber: 5,
        interpretations: {
          lifePath: '生命数字7的人深思熟虑、内省、追求智慧和精神成长。他们喜欢独处，热衷于分析和研究，寻求更深层次的真理和理解。',
          destiny: '命运数字5的人注定要经历变化和冒险。他们的使命是追求自由和多样性的体验，人生旅程中将不断适应新环境，拓展自己的视野。'
        }
      },
      source: 'sample',
      quality: 0.9
    },
    {
      input: {
        birthDate: '1978-12-28',
        name: '王五'
      },
      output: {
        lifePathNumber: 1,
        destinyNumber: 3,
        interpretations: {
          lifePath: '生命数字1的人是天生的领导者，独立、有创造力、决断力强，是开创者和先驱者。他们具有强烈的进取心和决心，追求卓越，渴望成功。',
          destiny: '命运数字3的人注定要通过创造性表达来启发他人。他们的使命是传播欢乐和乐观，人生旅程中将不断发现自己的艺术才能和表达能力。'
        }
      },
      source: 'sample',
      quality: 0.9
    }
  ];
  
  // 塔罗牌训练数据示例
  const tarotData = [
    {
      input: {
        question: '我的职业发展如何？',
        spread: 'three-card',
        cards: ['The Magician', 'The Wheel of Fortune', 'The World']
      },
      output: {
        interpretations: {
          card1: '魔术师代表你拥有实现目标的所有工具和技能，是行动、创造力和自信的象征。在职业方面，这表明你有能力驾驭自己的命运，创造自己想要的结果。',
          card2: '命运之轮代表转折点和机遇。它表明你的职业将经历重大变化，这些变化将带来新的可能性。保持灵活性和适应性将帮助你利用这些机会。',
          card3: '世界牌代表完成、成就和圆满。这表明你的职业道路将导向一个令人满意的结果，你的努力将得到认可和奖励。'
        },
        overallReading: '这个塔罗牌组合显示你正处于职业发展的强劲时期。你拥有所需的技能和资源(魔术师)，即将迎来重要的转机(命运之轮)，最终将达到理想的成就(世界)。这是一个非常积极的预兆，表明成功将是你努力的结果。',
        advice: '充分利用你现有的技能和资源，对即将到来的变化保持开放心态，并坚持你的长期目标。机会即将来临，只要你准备好接受并利用它们，成功将成为必然。'
      },
      source: 'sample',
      quality: 0.9
    }
  ];
  
  // 易经训练数据示例
  const ichingData = [
    {
      input: {
        question: '我应该如何处理当前的人际关系挑战？',
        hexagram: '101111'
      },
      output: {
        reading: '第13卦 同人卦 火天同人 同人于野，亨。利涉大川，利君子贞。这个卦象代表人与人之间的和谐与团结。当前的挑战需要通过开放的沟通和真诚的合作来解决。',
        changing: '第二爻变，同人于宗，吝。爻辞提醒你不要将自己局限在熟悉的圈子内，需要拓展视野，与更多不同背景的人建立联系。',
        advice: '面对人际关系挑战，应保持开放的心态，寻求共同点而非分歧。诚实沟通对解决当前问题至关重要，但也要注意平衡个人需求与集体利益。'
      },
      source: 'sample',
      quality: 0.9
    }
  ];
  
  return {
    numerologyData,
    tarotData,
    ichingData
  };
}

/**
 * 导入示例训练数据
 */
async function importSampleData() {
  try {
    logger.info('开始导入示例训练数据');
    
    // 生成示例数据
    const { numerologyData, tarotData, ichingData } = generateSampleTrainingData();
    
    // 导入数字学训练数据
    const numerologyCount = await trainingDataService.addTrainingData(AiModelType.NUMEROLOGY, numerologyData);
    logger.info(`成功导入${numerologyCount}条数字学示例训练数据`);
    
    // 导入塔罗牌训练数据
    const tarotCount = await trainingDataService.addTrainingData(AiModelType.TAROT, tarotData);
    logger.info(`成功导入${tarotCount}条塔罗牌示例训练数据`);
    
    // 导入易经训练数据
    const ichingCount = await trainingDataService.addTrainingData(AiModelType.ICHING, ichingData);
    logger.info(`成功导入${ichingCount}条易经示例训练数据`);
    
    logger.info('示例训练数据导入完成');
  } catch (error) {
    logger.error(`导入示例训练数据失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    // 确保数据库连接
    await ensureDbConnected();
    
    // 导入示例数据
    await importSampleData();
    
    logger.info('训练数据导入脚本执行完成');
  } catch (error) {
    logger.error(`脚本执行失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    // 关闭数据库连接
    mongoose.connection.close();
    logger.info('数据库连接已关闭');
  }
}

// 运行主函数
main();

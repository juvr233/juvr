/**
 * 命理数据元数据初始化脚本
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DivinationMetadata from '../models/divinationMetadata.model';
import { HistoryType } from '../models/userHistory.model';
import { logger } from '../config/logger';

// 加载环境变量
dotenv.config();

// 连接数据库
async function connectDB() {
  try {
    if (process.env.USE_MOCK_DB === 'true') {
      logger.info('使用模拟数据库，跳过初始化脚本');
      return false;
    }
    
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/zenith_destiny';
    await mongoose.connect(mongoUri);
    logger.info(`MongoDB 已连接: ${mongoose.connection.host}`);
    return true;
  } catch (error) {
    logger.error(`数据库连接失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
}

// 初始化命理数据元数据
async function initDivinationMetadata() {
  try {
    // 检查是否已经初始化
    const count = await DivinationMetadata.countDocuments();
    
    if (count > 0) {
      logger.info(`命理数据元数据已存在，跳过初始化（发现${count}条记录）`);
      return;
    }
    
    // 数字学元数据
    const numerologyMetadata = {
      type: HistoryType.NUMEROLOGY,
      name: '数字学分析',
      description: '通过出生日期和姓名揭示您的生命数字、表达数字、灵魂渴望数字等，解读您的命运轨迹和潜在特质。',
      icon: 'calculator',
      templates: [
        {
          id: 'basic-numerology',
          name: '基础数字学解读',
          description: '包含生命数字基本解读',
          content: '# {name}的数字学分析\n\n## 生命数字: {lifePathNumber}\n\n{interpretations.lifePath}\n\n生命数字{lifePathNumber}的人通常{traits}。'
        },
        {
          id: 'full-numerology',
          name: '完整数字学解读',
          description: '包含所有数字学数值的详细解读',
          content: '# {name}的完整数字学分析\n\n## 生命数字: {lifePathNumber}\n\n{interpretations.lifePath}\n\n## 表达数字: {destinyNumber}\n\n{interpretations.destiny}\n\n## 灵魂渴望数字: {soulUrgeNumber}\n\n{interpretations.soulUrge}\n\n## 人格数字: {personalityNumber}\n\n{interpretations.personality}\n\n## 态度数字: {attitudeNumber}\n\n{interpretations.attitude}\n\n## 综合分析\n\n根据您的各项数字，您的核心特质是{coreTraits}，适合的职业方向包括{careers}。'
        }
      ],
      interpretationKeys: ['lifePathNumber', 'destinyNumber', 'soulUrgeNumber', 'personalityNumber', 'attitudeNumber'],
      sampleQuestions: [
        '我的生命数字代表什么？',
        '我适合什么职业？',
        '我的表达数字和灵魂渴望数字有什么含义？',
        '我的数字学分析显示我有哪些天赋？',
        '数字学如何指导我的生活方向？'
      ],
      settings: {
        defaultVisualization: {
          chartType: 'radar',
          showLabels: true,
          showLegend: true
        },
        requiredFields: ['birthDate'],
        premiumFeatures: ['fullInterpretation', 'careerGuidance', 'yearlyForecast'],
        maxQueriesPerDay: 3
      },
      active: true,
      order: 1
    };
    
    // 塔罗牌元数据
    const tarotMetadata = {
      type: HistoryType.TAROT,
      name: '塔罗牌解读',
      description: '通过神秘的塔罗牌象征，窥探您的过去、现在与未来，获得指引和洞察。',
      icon: 'zap',
      templates: [
        {
          id: 'three-card',
          name: '三张牌阵',
          description: '解读过去、现在与未来',
          content: '# {question}的塔罗解读\n\n## 过去: {cards[0].name} {cards[0].isReversed ? "(逆位)" : ""}\n\n{cards[0].meaning}\n\n## 现在: {cards[1].name} {cards[1].isReversed ? "(逆位)" : ""}\n\n{cards[1].meaning}\n\n## 未来: {cards[2].name} {cards[2].isReversed ? "(逆位)" : ""}\n\n{cards[2].meaning}\n\n## 整体解读\n\n{overallInterpretation}'
        },
        {
          id: 'celtic-cross',
          name: '凯尔特十字牌阵',
          description: '详细的十张牌解读',
          content: '# {question}的凯尔特十字牌阵解读\n\n[详细内容根据十张牌位置和含义生成]'
        }
      ],
      interpretationKeys: ['cards', 'overallInterpretation'],
      sampleQuestions: [
        '我未来的职业发展会如何？',
        '我目前的感情状况如何？',
        '我应该如何应对当前的挑战？',
        '对于我考虑的改变，塔罗牌有什么建议？',
        '我和伴侣的关系未来会如何发展？'
      ],
      settings: {
        defaultVisualization: {
          chartType: 'custom',
          showLabels: true
        },
        requiredFields: ['cards'],
        premiumFeatures: ['tenCardReading', 'relationshipSpread', 'yearlyForecast'],
        maxQueriesPerDay: 2
      },
      active: true,
      order: 2
    };
    
    // 易经元数据
    const ichingMetadata = {
      type: HistoryType.ICHING,
      name: '易经卦象',
      description: '基于古老的中国智慧系统，通过六十四卦的变化揭示宇宙规律和人生智慧。',
      icon: 'book-open',
      templates: [
        {
          id: 'basic-hexagram',
          name: '基础卦象解读',
          description: '包含卦象的基本解读',
          content: '# {question}的易经解读\n\n## 本卦：{hexagram.name.chinese} ({hexagram.name.pinyin}) - 第{hexagram.number}卦\n\n《象曰》：{interpretation.image}\n\n《彖曰》：{interpretation.judgment}\n\n## 总体解读\n\n{interpretation.overall}'
        },
        {
          id: 'changing-hexagram',
          name: '变卦解读',
          description: '包含本卦和变卦的完整解读',
          content: '# {question}的易经解读\n\n## 本卦：{hexagram.name.chinese} ({hexagram.name.pinyin}) - 第{hexagram.number}卦\n\n《象曰》：{interpretation.image}\n\n《彖曰》：{interpretation.judgment}\n\n## 变爻\n\n{interpretation.lines}\n\n## 变卦：{hexagram.resultHexagram.name.chinese} ({hexagram.resultHexagram.name.pinyin}) - 第{hexagram.resultHexagram.number}卦\n\n## 总体解读\n\n{interpretation.overall}\n\n## 启示\n\n由{hexagram.name.chinese}卦变{hexagram.resultHexagram.name.chinese}卦，表明{insight}'
        }
      ],
      interpretationKeys: ['hexagram', 'interpretation'],
      sampleQuestions: [
        '我现在的处境如何发展？',
        '我应该如何处理当前的关系？',
        '对于我考虑的决定，易经有什么建议？',
        '我目前面临的困难有什么解决之道？',
        '我的事业发展趋势如何？'
      ],
      settings: {
        defaultVisualization: {
          chartType: 'custom',
          showLabels: true
        },
        requiredFields: ['hexagram'],
        premiumFeatures: ['detailedLineReading', 'yearlyHexagramForecast', 'lifeHexagramAnalysis'],
        maxQueriesPerDay: 1
      },
      active: true,
      order: 3
    };
    
    // 兼容性分析元数据
    const compatibilityMetadata = {
      type: HistoryType.COMPATIBILITY,
      name: '兼容性分析',
      description: '通过比较两个人的命理数据，分析两者之间的兼容性、互补性和潜在的挑战。',
      icon: 'users',
      templates: [
        {
          id: 'basic-compatibility',
          name: '基础兼容性分析',
          description: '生命数字兼容性',
          content: '# {person1.name}与{person2.name}的兼容性分析\n\n## 兼容性得分: {compatibilityScore}/10\n\n{person1.name}的生命数字为{person1.numbers.lifePath}，{person2.name}的生命数字为{person2.numbers.lifePath}。\n\n## 分析\n\n{analysis}\n\n## 建议\n\n{recommendations}'
        }
      ],
      interpretationKeys: ['compatibilityScore', 'analysis', 'recommendations'],
      sampleQuestions: [
        '我们的关系有何特点？',
        '我们可能面临哪些挑战？',
        '我们如何增进彼此理解？',
        '我们的数字兼容性如何？',
        '我们的关系有什么发展潜力？'
      ],
      settings: {
        defaultVisualization: {
          chartType: 'bar',
          showLabels: true,
          showLegend: true
        },
        requiredFields: ['person1.birthDate', 'person2.birthDate'],
        premiumFeatures: ['detailedAnalysis', 'relationshipGuidance', 'potentialChallenges'],
        maxQueriesPerDay: 2
      },
      active: true,
      order: 4
    };
    
    // 创建记录
    await DivinationMetadata.create([
      numerologyMetadata,
      tarotMetadata,
      ichingMetadata,
      compatibilityMetadata
    ]);
    
    logger.info('命理数据元数据初始化成功');
  } catch (error) {
    logger.error(`命理数据元数据初始化失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

// 运行初始化脚本
async function run() {
  try {
    const connected = await connectDB();
    if (!connected) return;
    
    await initDivinationMetadata();
    
    logger.info('初始化脚本执行完成');
  } catch (error) {
    logger.error(`初始化脚本执行失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    // 断开数据库连接
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      logger.info('数据库连接已关闭');
    }
  }
}

// 直接运行脚本
if (require.main === module) {
  run().catch(err => {
    logger.error('脚本执行出错:', err);
    process.exit(1);
  });
}

export { initDivinationMetadata };

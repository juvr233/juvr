import { AiModelType } from '../src/models/aiModel.model';
import aiInferenceService from '../src/services/ai/aiInference.service';
import modelTrainingService from '../src/services/ai/modelTraining.service';

// 模拟依赖
jest.mock('../src/config/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
  }
}));

jest.mock('../src/models/aiModel.model', () => ({
  AiModelType: {
    TAROT: 'tarot',
    NUMEROLOGY: 'numerology',
    ICHING: 'iching',
    COMPATIBILITY: 'compatibility',
    BAZI: 'bazi',
    STAR_ASTROLOGY: 'star_astrology',
    HOLISTIC: 'holistic'
  },
  default: {
    findOne: jest.fn().mockImplementation(() => ({
      _id: 'mock-model-id',
      type: 'tarot',
      name: 'Tarot Model',
      version: 1,
      status: 'active',
      trainingData: [
        {
          input: {
            cards: [
              { name: 'The Fool', reversed: false },
              { name: 'The Magician', reversed: true }
            ],
            spread: 'two-card',
            question: '我的事业发展如何？'
          },
          output: {
            interpretations: {
              position_1: 'The Fool: 新的开始',
              position_2: 'The Magician (逆位): 创意受阻'
            },
            overallReading: '你正处于职业转型期，但可能遇到一些障碍。',
            advice: '尝试不同的方法来突破当前局面。'
          }
        }
      ],
      accuracy: 0.85
    }))
  }
}));

// 模拟文件系统
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn().mockResolvedValue(JSON.stringify({
      major: {
        'The Fool': {
          upright: '新的开始，冒险，可能性',
          reversed: '鲁莽，谨慎，风险'
        },
        'The Magician': {
          upright: '创造力，意志力，技能，信心',
          reversed: '操纵，失去专注，技能不足'
        }
      }
    }))
  },
  readFileSync: jest.fn().mockReturnValue(JSON.stringify({
    major: {
      'The Fool': {
        upright: '新的开始，冒险，可能性',
        reversed: '鲁莽，谨慎，风险'
      },
      'The Magician': {
        upright: '创造力，意志力，技能，信心',
        reversed: '操纵，失去专注，技能不足'
      }
    }
  }))
}));

describe('AI推理服务测试', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('塔罗牌推理', () => {
    test('成功生成塔罗牌解读', async () => {
      // 模拟AI服务返回
      (aiInferenceService as any).callAiService = jest.fn().mockResolvedValue(`
        根据您的问题"我的事业发展如何？"和选择的卡牌，以下是塔罗牌解读：
        
        1. 第一张牌 - 愚者：代表新的开始和可能性。您可能正处于职业生涯的转折点。
        
        2. 第二张牌 - 魔术师（逆位）：表明您的创造力和技能可能暂时受阻。
        
        3. 总体解读：您正处于职业转型期，充满了可能性，但目前可能遇到一些障碍。这是一个重新评估自己技能的好时机。
        
        4. 建议：尝试从不同角度思考问题，发掘自己未被充分利用的才能，突破当前局面。
      `);
      
      const result = await aiInferenceService.generateReading(AiModelType.TAROT, {
        cards: [
          { name: 'The Fool', reversed: false },
          { name: 'The Magician', reversed: true }
        ],
        spread: 'two-card',
        question: '我的事业发展如何？'
      });
      
      // 验证结果
      expect(result).toBeDefined();
      expect(result.interpretations).toBeDefined();
      expect(Object.keys(result.interpretations).length).toBeGreaterThan(0);
      expect(result.overallReading).toContain('职业转型期');
      expect(result.advice).toBeDefined();
    });
    
    test('在AI服务失败时回退到规则引擎', async () => {
      // 模拟AI服务失败
      (aiInferenceService as any).callAiService = jest.fn().mockResolvedValue(null);
      
      const result = await aiInferenceService.generateReading(AiModelType.TAROT, {
        cards: [
          { name: 'The Fool', reversed: false },
          { name: 'The Magician', reversed: true }
        ],
        spread: 'two-card',
        question: '我的事业发展如何？'
      });
      
      // 验证结果
      expect(result).toBeDefined();
      expect(result.interpretations).toBeDefined();
      expect(Object.keys(result.interpretations).length).toBeGreaterThan(0);
      expect(result.overallReading).toBeDefined();
      expect(result.advice).toBeDefined();
    });
  });
  
  describe('数字学推理', () => {
    test('成功生成数字学解读', async () => {
      const result = await aiInferenceService.generateReading(AiModelType.NUMEROLOGY, {
        birthDate: '1990-01-01',
        name: 'John Doe'
      });
      
      // 验证结果
      expect(result).toBeDefined();
      expect(result.lifePathNumber).toBeDefined();
      expect(result.destinyNumber).toBeDefined();
      expect(result.interpretations).toBeDefined();
      expect(result.interpretations.lifePath).toBeDefined();
      expect(result.interpretations.destiny).toBeDefined();
    });
  });
  
  describe('易经推理', () => {
    test('成功生成易经解读', async () => {
      // 模拟AI服务返回
      (aiInferenceService as any).callAiService = jest.fn().mockResolvedValue(`
        1. 卦象的总体含义：乾卦代表天，象征着强大、持久的创造力和领导力。
        
        2. 对于用户问题的具体指导：在你的事业问题上，当前形势有利于主动出击。
        
        3. 当前形势分析：你正处于有利位置，拥有必要的资源和支持。
        
        4. 未来发展趋势：如果坚持正确的方向，会有显著的进展。
        
        5. 建议和行动指南：保持决断力和毅力，同时注意不要盲目自信。
      `);
      
      const result = await aiInferenceService.generateReading(AiModelType.ICHING, {
        hexagram: {
          number: 1,
          name: {
            chinese: '乾',
            pinyin: 'Qián',
            english: 'The Creative'
          },
          changingLines: [3, 6],
          resultHexagram: {
            number: 2,
            name: {
              chinese: '坤',
              pinyin: 'Kūn',
              english: 'The Receptive'
            }
          }
        },
        question: '我的事业发展如何？'
      });
      
      // 验证结果
      expect(result).toBeDefined();
      expect(result.hexagram).toBeDefined();
      expect(result.interpretation).toBeDefined();
      expect(result.interpretation.overall).toContain('乾卦代表天');
      expect(result.interpretation.guidance).toContain('事业问题');
      expect(result.interpretation.currentSituation).toContain('有利位置');
      expect(result.interpretation.futureTrend).toBeDefined();
      expect(result.interpretation.advice).toBeDefined();
    });
  });
  
  describe('模型训练服务', () => {
    test('能够训练塔罗牌模型', async () => {
      // 模拟查找模型
      const mockModel = {
        _id: 'mock-model-id',
        type: 'tarot',
        name: 'Tarot Model',
        version: 1,
        status: 'inactive',
        trainingData: [
          {
            input: { cards: [{ name: 'The Fool', reversed: false }] },
            output: { interpretations: { position_1: 'New beginnings' } }
          }
        ],
        accuracy: 0,
        save: jest.fn().mockResolvedValue(true)
      };
      
      // 模拟更新方法
      (modelTrainingService as any).trainTarotModel = jest.fn().mockImplementation(async (model) => {
        model.accuracy = 0.85;
        model.status = 'active';
        return true;
      });
      
      // 执行测试
      await modelTrainingService.trainModel('tarot', { useEnhancedTraining: true });
      
      // 验证结果
      expect((modelTrainingService as any).trainTarotModel).toHaveBeenCalled();
    });
  });
}); 
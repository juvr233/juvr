// @ts-nocheck
import { logger } from '../../config/logger';
import AiModel, { AiModelType } from '../../models/aiModel.model';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import aiService from '../../services/ai.service';

declare const process: any;
declare const __dirname: string;

const readFile = promisify(fs.readFile);

/**
 * 塔罗牌卡牌
 */
interface TarotCard {
  name: string;
  position?: string;
  reversed?: boolean;
}

/**
 * 塔罗牌解读输入
 */
interface TarotReadingInput {
  question: string;
  spread: string;
  cards: TarotCard[];
}

/**
 * 塔罗牌解读模型和卡牌
 */
interface TarotReadingOutput {
  interpretations: Record<string, string>;
  overallReading: string;
  advice: string;
}

/**
 * 塔罗牌解读推理服务
 * 负责使用训练好的模型生成塔罗牌解读
 */
class TarotInferenceService {
  private readonly modelDir = path.join(process.cwd(), 'models/tarot');
  private tarotCardMeanings: Record<string, any> | null = null;
  private cache = new Map<string, TarotReadingOutput>();
  
  constructor() {
    // 预加载塔罗牌卡牌含义
    this.loadTarotCardMeanings();
  }
  
  /**
   * 加载塔罗牌卡牌含义
   */
  private async loadTarotCardMeanings(): Promise<void> {
    try {
      const tarotDataPath = path.join(process.cwd(), 'data/tarot/tarot_card_meanings.json');
      
      // 如果文件不存在，先创建默认卡牌含义文件
      try {
        await readFile(tarotDataPath);
      } catch (error) {
        await this.createDefaultTarotMeanings(tarotDataPath);
      }
      
      // 读取卡牌含义
      const data = await readFile(tarotDataPath, 'utf8');
      this.tarotCardMeanings = JSON.parse(data);
      logger.info('塔罗牌卡牌含义加载成功');
    } catch (error) {
      logger.error(`加载塔罗牌卡牌含义失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * 创建默认塔罗牌含义文件
   * @param filePath 文件路径
   */
  private async createDefaultTarotMeanings(filePath: string): Promise<void> {
    try {
      const defaultMeanings = {
        "major": {
          "The Fool": {
            "upright": "新的开始，冒险，可能性，天真，自发性",
            "reversed": "愚蠢的冒险，鲁莽，冲动，漫无目的"
          },
          "The Magician": {
            "upright": "创造力，意志力，技能，行动力，掌控能力",
            "reversed": "操纵，欺骗，未实现潜力，虚假表象"
          },
          "The High Priestess": {
            "upright": "直觉，潜意识，神秘，内在声音，智慧",
            "reversed": "秘密，失去直觉，表面解释，压抑直觉"
          },
          "The Empress": {
            "upright": "丰饶，母性，创造力，自然，舒适",
            "reversed": "依赖，过度保护，创造力受阻，不安全感"
          },
          "The Emperor": {
            "upright": "权威，结构，领导力，稳定，父性",
            "reversed": "独裁，僵化，过度控制，无能领导"
          },
          "The Hierophant": {
            "upright": "传统，精神指导，遵循规则，教育",
            "reversed": "个人信仰，打破常规，不服从"
          },
          "The Lovers": {
            "upright": "爱，和谐，关系，价值观，选择",
            "reversed": "不和谐，失衡，价值观冲突，不良选择"
          },
          "The Chariot": {
            "upright": "决心，控制力，胜利，野心，坚持",
            "reversed": "缺乏方向，缺乏控制，攻击性，失败"
          },
          "Strength": {
            "upright": "内在力量，勇气，耐心，同情，自信",
            "reversed": "自我怀疑，弱点，缺乏自信，不耐烦"
          },
          "The Hermit": {
            "upright": "内省，寻求真相，独处，内在指引",
            "reversed": "孤独，隔绝，回避，退缩，过度分析"
          },
          "Wheel of Fortune": {
            "upright": "命运，转折点，机会，变化，循环",
            "reversed": "坏运气，抵抗变化，打破循环"
          },
          "Justice": {
            "upright": "公正，真相，法律，清晰，因果",
            "reversed": "不公正，不诚实，不负责任，不平衡"
          },
          "The Hanged Man": {
            "upright": "暂停，放弃，新视角，牺牲",
            "reversed": "拖延，抵抗，徒劳，不必要的牺牲"
          },
          "Death": {
            "upright": "结束，变革，转变，过渡，放下",
            "reversed": "抵抗变化，无法前进，停滞不前"
          },
          "Temperance": {
            "upright": "平衡，适度，耐心，调和，目标",
            "reversed": "不平衡，过度，冲动，不耐烦"
          },
          "The Devil": {
            "upright": "物质主义，成瘾，限制，阴影面，依附",
            "reversed": "挣脱束缚，觉醒，重获控制力，解放"
          },
          "The Tower": {
            "upright": "突变，混乱，启示，觉醒，真相",
            "reversed": "避免灾难，恐惧改变，延迟必要的改变"
          },
          "The Star": {
            "upright": "希望，信念，灵感，平静，宁静",
            "reversed": "绝望，失去信心，消沉，丧失动力"
          },
          "The Moon": {
            "upright": "直觉，潜意识，幻觉，恐惧，焦虑",
            "reversed": "解除恐惧，混乱减轻，澄清"
          },
          "The Sun": {
            "upright": "幸福，成功，喜悦，活力，启蒙",
            "reversed": "暂时的失落，过度乐观，幼稚"
          },
          "Judgement": {
            "upright": "重生，内在呼唤，觉醒，赎罪，反思",
            "reversed": "自我怀疑，拒绝转变，后悔，停滞"
          },
          "The World": {
            "upright": "完成，成就，旅程，整合，满足",
            "reversed": "不完整，失败，拖延，失望"
          }
        },
        "spreads": {
          "three-card": {
            "positions": ["past", "present", "future"],
            "descriptions": {
              "past": "这张牌代表过去的影响和经历",
              "present": "这张牌代表当前的情况和能量",
              "future": "这张牌代表潜在的结果和未来发展"
            }
          },
          "five-card": {
            "positions": ["current", "challenge", "advice", "influence", "outcome"],
            "descriptions": {
              "current": "这张牌代表当前的情况",
              "challenge": "这张牌代表你面临的挑战或障碍",
              "advice": "这张牌提供如何处理情况的建议",
              "influence": "这张牌显示外部影响因素",
              "outcome": "这张牌代表可能的结果"
            }
          },
          "ten-card": {
            "positions": ["present", "challenge", "basis", "past", "crown", "future", "approach", "environment", "hopes", "outcome"],
            "descriptions": {
              "present": "当前情况的核心",
              "challenge": "面临的挑战或障碍",
              "basis": "情况的基础",
              "past": "最近的过去经历",
              "crown": "可能发生的最佳结果",
              "future": "未来发展",
              "approach": "咨询者的态度或方法",
              "environment": "环境影响",
              "hopes": "恐惧和希望",
              "outcome": "最终结果"
            }
          }
        },
        "question_types": {
          "love": {
            "themes": ["关系", "爱", "情感连接", "伴侣", "吸引力", "和谐"],
            "key_cards": ["The Lovers", "The Empress", "The Emperor", "Two of Cups", "Ten of Cups"]
          },
          "career": {
            "themes": ["工作", "成就", "成功", "创造力", "领导力", "稳定性"],
            "key_cards": ["The Emperor", "The Magician", "Three of Pentacles", "Eight of Pentacles", "The World"]
          },
          "health": {
            "themes": ["健康", "活力", "平衡", "休息", "恢复", "能量"],
            "key_cards": ["The Sun", "Temperance", "The Star", "Four of Swords", "Nine of Pentacles"]
          },
          "finance": {
            "themes": ["金钱", "物质", "丰富", "投资", "安全", "成长"],
            "key_cards": ["The Emperor", "King of Pentacles", "Queen of Pentacles", "Nine of Pentacles", "Ace of Pentacles"]
          }
        }
      };
      
      // 确保目录存在
      const dirPath = path.dirname(filePath);
      await promisify(fs.mkdir)(dirPath, { recursive: true });
      
      // 写入默认数据
      await promisify(fs.writeFile)(filePath, JSON.stringify(defaultMeanings, null, 2), 'utf8');
      logger.info(`创建默认塔罗牌含义文件: ${filePath}`);
    } catch (error) {
      logger.error(`创建默认塔罗牌含义失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 生成塔罗牌解读
   * @param input 塔罗牌解读输入
   * @returns 塔罗牌解读结果
   */
  public async generateReading(input: TarotReadingInput): Promise<TarotReadingOutput> {
    try {
      logger.info(`开始生成塔罗牌解读，问题: "${input.question}", 牌阵: ${input.spread}`);
      
      // 验证输入
      this.validateTarotInput(input);
      
      // 查找活跃的塔罗牌模型
      const model = await AiModel.findOne({
        type: AiModelType.TAROT,
        status: 'active'
      });
      
      if (!model) {
        logger.warn('未找到活跃的塔罗牌模型，使用规则引擎生成解读');
        return this.generateReadingWithRuleEngine(input);
      }
      
      // 使用AI模型生成解读
      return this.generateReadingWithAiModel(model, input);
    } catch (error) {
      logger.error(`生成塔罗牌解读失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // 发生错误时回退到规则引擎
      return this.generateReadingWithRuleEngine(input);
    }
  }
  
  /**
   * 验证塔罗牌输入
   * @param input 塔罗牌解读输入
   * @throws 如果输入无效
   */
  private validateTarotInput(input: TarotReadingInput): void {
    if (!input.question || typeof input.question !== 'string') {
      throw new Error('塔罗牌解读需要提供有效的问题');
    }
    
    if (!input.spread || typeof input.spread !== 'string') {
      throw new Error('需要提供有效的牌阵类型');
    }
    
    if (!input.cards || !Array.isArray(input.cards) || input.cards.length === 0) {
      throw new Error('需要提供至少一张塔罗牌');
    }
    
    // 验证每张卡牌
    input.cards.forEach((card, index) => {
      if (!card.name) {
        throw new Error(`第${index + 1}张塔罗牌缺少名称`);
      }
    });
  }
  
  /**
   * 使用AI模型生成塔罗牌解读
   * @param model AI模型
   * @param input 塔罗牌解读输入
   * @returns 塔罗牌解读结果
   */
  private async generateReadingWithAiModel(model: any, input: TarotReadingInput): Promise<TarotReadingOutput> {
    try {
      logger.info(`使用AI模型(v${model.version})生成塔罗牌解读`);
      
      // 创建缓存键
      const cacheKey = `${input.question}_${input.spread}_${input.cards.map(c => `${c.name}${c.reversed ? 'R' : ''}`).join('_')}`;
      
      // 检查缓存
      if (this.cache.has(cacheKey)) {
        logger.info('从缓存中返回塔罗牌解读');
        return this.cache.get(cacheKey)!;
      }
      
      // 构建AI提示
      const prompt = this.buildAiPrompt(input);
      
      // 调用AI服务获取解读
      const aiResponse = await aiService.generateReading(prompt);
      
      // 解析AI响应
      const result = this.parseAiResponse(aiResponse, input);
      
      // 缓存结果（限制缓存大小为100条）
      if (this.cache.size >= 100) {
        // 删除最早添加的缓存项
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }
      this.cache.set(cacheKey, result);
      
      return result;
    } catch (error) {
      logger.error(`使用AI模型生成塔罗牌解读失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // 回退到规则引擎
      return this.generateReadingWithRuleEngine(input);
    }
  }
  
  /**
   * 使用规则引擎生成塔罗牌解读
   * @param input 塔罗牌解读输入
   * @returns 塔罗牌解读结果
   */
  private generateReadingWithRuleEngine(input: TarotReadingInput): TarotReadingOutput {
    logger.info('使用规则引擎生成塔罗牌解读');
    
    // 初始化解读结果
    const interpretations: Record<string, string> = {};
    
    // 为每张牌生成解读
    input.cards.forEach((card, index) => {
      const position = card.position || `card${index + 1}`;
      
      // 生成卡牌解读
      let interpretation = '';
      
      // 使用卡牌基本含义
      if (this.tarotCardMeanings) {
        // 查找大阿卡那
        const majorCard = this.tarotCardMeanings.major[card.name];
        
        if (majorCard) {
          interpretation = card.reversed ? majorCard.reversed : majorCard.upright;
          
          // 添加位置相关内容
          if (this.tarotCardMeanings.spreads[input.spread] && 
              this.tarotCardMeanings.spreads[input.spread].descriptions[position]) {
            interpretation += ` ${this.tarotCardMeanings.spreads[input.spread].descriptions[position]}`;
          }
        }
      }
      
      // 如果没有找到含义，生成通用解读
      if (!interpretation) {
        interpretation = this.generateGenericCardInterpretation(card, position);
      }
      
      interpretations[position] = interpretation;
    });
    
    // 生成整体解读
    const overallReading = this.generateOverallReading(input, interpretations);
    
    // 生成建议
    const advice = this.generateAdvice(input, interpretations, overallReading);
    
    return {
      interpretations,
      overallReading,
      advice
    };
  }
  
  /**
   * 获取最新的模型文件
   * @returns 模型文件路径，如果不存在则返回null
   */
  private async getLatestModelFile(): Promise<string | null> {
    try {
      // 获取模型目录中的所有文件
      const files = await promisify(fs.readdir)(this.modelDir);
      
      // 筛选出塔罗牌模型文件
      const modelFiles = files.filter((file: string) => file.startsWith('tarot_model_v') && file.endsWith('.json'));
      
      if (modelFiles.length === 0) {
        return null;
      }
      
      // 按版本号和时间戳排序，获取最新的模型文件
      modelFiles.sort((a: string, b: string) => {
        // 提取版本号
        const versionA = a.match(/v(\d+\.\d+\.\d+)/)?.[1] || '0.0.0';
        const versionB = b.match(/v(\d+\.\d+\.\d+)/)?.[1] || '0.0.0';
        
        // 比较版本号
        const versionComparison = this.compareVersions(versionA, versionB);
        
        if (versionComparison !== 0) {
          return versionComparison;
        }
        
        // 如果版本号相同，按时间戳排序
        return b.localeCompare(a);
      });
      
      return path.join(this.modelDir, modelFiles[0]);
    } catch (error) {
      logger.error(`获取最新模型文件失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }
  
  /**
   * 比较版本号
   * @param versionA 版本A
   * @param versionB 版本B
   * @returns 比较结果：-1表示A<B，0表示A=B，1表示A>B
   */
  private compareVersions(versionA: string, versionB: string): number {
    const partsA = versionA.split('.').map(Number);
    const partsB = versionB.split('.').map(Number);
    
    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
      const partA = partsA[i] || 0;
      const partB = partsB[i] || 0;
      
      if (partA < partB) return -1;
      if (partA > partB) return 1;
    }
    
    return 0;
  }
  
  /**
   * 从训练数据中提取模式
   * @param trainingData 训练数据
   * @returns 提取的模式
   */
  private extractPatternsFromTrainingData(trainingData: any[] = []): Record<string, any> {
    // 卡牌解释映射
    const cardInterpretations: Record<string, string[]> = {};
    
    // 卡牌组合解释映射
    const cardCombinations: Record<string, string[]> = {};
    
    // 问题类型映射
    const questionPatterns: Record<string, Array<{ cards: string[], interpretations: string[] }>> = {
      love: [],
      career: [],
      health: [],
      finance: [],
      general: []
    };
    
    // 提取模式
    trainingData.forEach(data => {
      if (!data.input?.cards || !Array.isArray(data.input.cards) || !data.output?.interpretations) {
        return;
      }
      
      // 提取单卡解释
      data.input.cards.forEach((card: { name: string, position: string }, index: number) => {
        if (!card.name) return;
        
        if (!cardInterpretations[card.name]) {
          cardInterpretations[card.name] = [];
        }
        
        // 如果有对应位置的解释，添加到该卡的解释列表
        const interpretation = data.output.interpretations[card.position];
        if (interpretation && typeof interpretation === 'string') {
          cardInterpretations[card.name].push(interpretation);
          
          // 最多保留10个解释样本
          if (cardInterpretations[card.name].length > 10) {
            cardInterpretations[card.name].shift();
          }
        }
      });
      
      // 提取卡牌组合
      if (data.input.cards.length > 1) {
        const cardNames = data.input.cards.map((c: any) => c.name).sort().join('-');
        
        if (!cardCombinations[cardNames]) {
          cardCombinations[cardNames] = [];
        }
        
        // 添加整体解释
        if (data.output.overallReading && typeof data.output.overallReading === 'string') {
          cardCombinations[cardNames].push(data.output.overallReading);
          
          // 最多保留5个组合解释样本
          if (cardCombinations[cardNames].length > 5) {
            cardCombinations[cardNames].shift();
          }
        }
      }
      
      // 提取问题类型模式
      let questionType = 'general';
      if (data.input?.question) {
        const question = data.input.question.toLowerCase();
        if (question.includes('爱情') || question.includes('感情') || question.includes('情感')) {
          questionType = 'love';
        } else if (question.includes('事业') || question.includes('工作') || question.includes('职业')) {
          questionType = 'career';
        } else if (question.includes('健康') || question.includes('身体')) {
          questionType = 'health';
        } else if (question.includes('财务') || question.includes('钱') || question.includes('财富')) {
          questionType = 'finance';
        }
      }
      
      questionPatterns[questionType].push({
        cards: data.input.cards.map((c: any) => c.name),
        interpretations: Object.values(data.output.interpretations).filter((i: any) => typeof i === 'string')
      });
    });
    
    return {
      cardInterpretations,
      cardCombinations,
      questionPatterns
    };
  }
  
  /**
   * 生成通用卡牌解释
   * @param card 塔罗牌
   * @param position 位置
   * @returns 通用解释
   */
  private generateGenericCardInterpretation(card: TarotCard, position: string): string {
    // 根据卡牌名称生成通用解释
    let interpretation = `${card.name}`;
    
    // 根据卡牌是否逆位添加不同的描述
    if (card.reversed) {
      interpretation += '逆位表示你可能正在经历一些挑战或阻碍，需要反思和调整。';
    } else {
      interpretation += '正位表示这个方面的能量是积极流动的。';
    }
    
    // 根据位置添加不同的解释
    if (position === 'past' || position.includes('过去')) {
      interpretation += '这张牌代表过去的影响，显示了带你到当前情况的能量。';
    } else if (position === 'present' || position.includes('现在')) {
      interpretation += '这张牌代表当前的情况，反映了你目前面对的能量和挑战。';
    } else if (position === 'future' || position.includes('未来')) {
      interpretation += '这张牌揭示了潜在的未来方向，取决于你如何处理当前的能量。';
    } else if (position === 'advice' || position.includes('建议')) {
      interpretation += '这张牌提供了关于如何最好地处理情况的建议。';
    } else if (position === 'outcome' || position.includes('结果')) {
      interpretation += '这张牌代表可能的结果，基于当前的能量和趋势。';
    } else {
      interpretation += `这张牌在${position}位置上，帮助你更深入地理解这个问题的不同方面。`;
    }
    
    return interpretation;
  }
  
  /**
   * 生成整体解读
   * @param input 塔罗牌解读输入
   * @param interpretations 单卡解读
   * @returns 整体解读
   */
  private generateOverallReading(input: TarotReadingInput, interpretations: Record<string, string>): string {
    // 分析问题类型
    let questionType = 'general';
    const question = input.question.toLowerCase();
    
    if (question.includes('爱情') || question.includes('感情') || question.includes('情感') || question.includes('关系')) {
      questionType = 'love';
    } else if (question.includes('事业') || question.includes('工作') || question.includes('职业') || question.includes('项目')) {
      questionType = 'career';
    } else if (question.includes('健康') || question.includes('身体') || question.includes('疾病') || question.includes('康复')) {
      questionType = 'health';
    } else if (question.includes('财务') || question.includes('钱') || question.includes('财富') || question.includes('投资')) {
      questionType = 'finance';
    }
    
    // 根据问题类型生成开头
    let overallReading = '';
    
    switch (questionType) {
      case 'love':
        overallReading = '关于你的感情问题，塔罗牌揭示了重要的见解。';
        break;
      case 'career':
        overallReading = '在职业道路上，这些塔罗牌展示了值得注意的能量和方向。';
        break;
      case 'health':
        overallReading = '关于你的健康问题，这些塔罗牌提供了有价值的线索和指导。';
        break;
      case 'finance':
        overallReading = '在财务方面，这些塔罗牌指出了当前的状况和潜在的发展。';
        break;
      default:
        overallReading = '基于你的问题，塔罗牌提供了以下洞见。';
    }
    
    // 添加牌阵解读
    if (input.spread === 'three-card') {
      // 过去-现在-未来
      overallReading += ' 这个三卡牌阵展示了从过去经历，通过现在的情况，到未来可能性的旅程。';
      
      // 综合解读
      const positions = ['past', 'present', 'future'];
      const validPositions = positions.filter(pos => interpretations[pos]);
      
      if (validPositions.length >= 2) {
        overallReading += ' 整体来看，';
        
        // 分析能量流动
        if (validPositions.includes('past') && validPositions.includes('present')) {
          overallReading += `从${interpretations['past'].substring(0, 20)}...的过去经历，发展到现在的${interpretations['present'].substring(0, 20)}...，`;
        }
        
        if (validPositions.includes('present') && validPositions.includes('future')) {
          overallReading += `当前的情况正在引导你走向${interpretations['future'].substring(0, 20)}...的未来。`;
        }
      }
    } else if (input.spread === 'five-card') {
      // 五卡牌阵
      overallReading += ' 这个五卡牌阵提供了当前情况的全面视角，包括挑战、建议和可能的结果。';
      
      // 添加核心主题
      if (interpretations['current']) {
        overallReading += ` 核心问题是${interpretations['current'].substring(0, 30)}...`;
      }
      
      // 添加挑战和建议
      if (interpretations['challenge'] && interpretations['advice']) {
        overallReading += ` 你面临的主要挑战是${interpretations['challenge'].substring(0, 20)}...，而牌阵建议你${interpretations['advice'].substring(0, 30)}...`;
      }
    } else {
      // 其他牌阵
      overallReading += ` 这个${input.cards.length}卡牌阵显示了你问题的多个方面。`;
      
      // 寻找关键卡牌
      const significantCards = input.cards.filter(card => 
        ['The Tower', 'Death', 'The Sun', 'The World', 'The Lovers', 'The Fool', 'Wheel of Fortune'].includes(card.name)
      );
      
      if (significantCards.length > 0) {
        overallReading += ` 特别注意${significantCards.map(card => card.name).join('和')}的出现，这表明重要的转变或关键时刻。`;
      }
    }
    
    // 总结整体能量
    const positiveCards = input.cards.filter(card => 
      ['The Sun', 'The World', 'The Star', 'The Lovers', 'Ten of Cups', 'Ten of Pentacles'].includes(card.name) && !card.reversed
    );
    
    const challengingCards = input.cards.filter(card => 
      ['The Tower', 'Death', 'The Devil', 'Ten of Swords', 'Three of Swords'].includes(card.name) || card.reversed
    );
    
    if (positiveCards.length > challengingCards.length) {
      overallReading += ' 整体上，牌阵显示积极的能量和有利的结果，尽管可能需要克服一些挑战。';
    } else if (challengingCards.length > positiveCards.length) {
      overallReading += ' 整体上，牌阵表明当前有一些挑战需要面对，但每个挑战都是成长和转变的机会。';
    } else {
      overallReading += ' 整体上，牌阵显示平衡的能量，有挑战但也有机会，关键在于你如何应对当前的情况。';
    }
    
    return overallReading;
  }
  
  /**
   * 生成建议
   * @param input 塔罗牌解读输入
   * @param interpretations 单卡解读
   * @param overallReading 整体解读
   * @returns 建议
   */
  private generateAdvice(input: TarotReadingInput, interpretations: Record<string, string>, overallReading: string): string {
    // 提取牌阵的核心建议
    let advice = '基于这个塔罗牌阵，建议你：\n\n';
    
    // 从解读中提取建议
    if (interpretations['advice']) {
      // 如果有专门的建议位
      advice += `1. ${interpretations['advice']}\n\n`;
    } else if (input.spread === 'three-card' && interpretations['future']) {
      // 从三卡牌阵的未来卡中提取建议
      advice += `1. 考虑未来的方向：${interpretations['future']}\n\n`;
    }
    
    // 添加基于问题类型的建议
    const question = input.question.toLowerCase();
    
    if (question.includes('爱情') || question.includes('感情') || question.includes('情感') || question.includes('关系')) {
      advice += '2. 在感情方面，关注自己的情感需求，同时也要理解伴侣的视角。\n\n';
      advice += '3. 保持开放的沟通和真诚的态度，这对于任何关系都是至关重要的。\n\n';
    } else if (question.includes('事业') || question.includes('工作') || question.includes('职业') || question.includes('项目')) {
      advice += '2. 在职业上，认识到你的优势并充分发挥它们。\n\n';
      advice += '3. 保持专注和坚持，同时也要灵活应对变化。\n\n';
    } else if (question.includes('健康') || question.includes('身体') || question.includes('疾病') || question.includes('康复')) {
      advice += '2. 关注身心平衡，确保有足够的休息和放松时间。\n\n';
      advice += '3. 倾听你的身体信号，必要时寻求专业建议。\n\n';
    } else if (question.includes('财务') || question.includes('钱') || question.includes('财富') || question.includes('投资')) {
      advice += '2. 在财务决策上保持理性和长远眼光。\n\n';
      advice += '3. 平衡收入和支出，建立稳健的财务基础。\n\n';
    } else {
      advice += '2. 信任你的直觉，但也要考虑理性的分析。\n\n';
      advice += '3. 保持开放的心态，准备好接受新的机会和可能性。\n\n';
    }
    
    // 基于卡牌组合添加特定建议
    const majorArcanaCards = input.cards.filter(card => 
      ['The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
       'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
       'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
       'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun',
       'Judgement', 'The World'].includes(card.name)
    );
    
    if (majorArcanaCards.length > 0) {
      const significantCard = majorArcanaCards[0];
      
      advice += '4. ';
      
      switch (significantCard.name) {
        case 'The Fool':
          advice += '准备好开始新的旅程，保持开放和冒险的精神。';
          break;
        case 'The Magician':
          advice += '认识到你拥有所需的所有工具和能力，相信自己的创造力。';
          break;
        case 'The High Priestess':
          advice += '信任你的直觉和内在智慧，倾听内心的声音。';
          break;
        case 'The Empress':
          advice += '培养创造力和丰饶，关注自己和他人的滋养和支持。';
          break;
        case 'The Emperor':
          advice += '建立稳定的结构和边界，采取明确的领导角色。';
          break;
        case 'The Hierophant':
          advice += '考虑传统和既定规则，寻求精神指导或教育机会。';
          break;
        case 'The Lovers':
          advice += '关注重要的关系和选择，寻求和谐与平衡。';
          break;
        case 'The Chariot':
          advice += '保持决心和自律，面对挑战时坚持不懈。';
          break;
        case 'Strength':
          advice += '培养内在力量和勇气，以温和和耐心的方式处理困难。';
          break;
        case 'The Hermit':
          advice += '寻求独处的时间，进行内在反思和寻找真相。';
          break;
        case 'Wheel of Fortune':
          advice += '接受生活的变化和循环，适应新的机会和挑战。';
          break;
        case 'Justice':
          advice += '寻求平衡和公正，诚实地面对自己和他人。';
          break;
        case 'The Hanged Man':
          advice += '暂停并获取新的视角，学会放手和接受。';
          break;
        case 'Death':
          advice += '接受必要的结束和转变，为新的开始腾出空间。';
          break;
        case 'Temperance':
          advice += '寻求平衡和适度，耐心地协调不同的元素。';
          break;
        case 'The Devil':
          advice += '认识到自己的限制和依附，寻求更大的自由和选择。';
          break;
        case 'The Tower':
          advice += '准备好面对突然的变化和启示，接受必要的破坏以重建更好的基础。';
          break;
        case 'The Star':
          advice += '保持希望和信心，相信更美好的未来。';
          break;
        case 'The Moon':
          advice += '面对你的恐惧和不确定性，探索潜意识的深度。';
          break;
        case 'The Sun':
          advice += '庆祝成功和喜悦，分享你的能量和光芒。';
          break;
        case 'Judgement':
          advice += '接受重生和唤醒的机会，反思过去并向前迈进。';
          break;
        case 'The World':
          advice += '认识到完成和整合的重要性，庆祝成就和新旅程的开始。';
          break;
        default:
          advice += '注意牌阵中的主要能量，并据此调整你的行动和态度。';
      }
    } else {
      advice += '4. 记住，塔罗牌提供的是指导和见解，最终的选择和行动掌握在你自己手中。';
    }
    
    return advice;
  }

  /**
   * 构建AI提示
   * @param input 塔罗牌解读输入
   * @returns AI提示
   */
  private buildAiPrompt(input: TarotReadingInput): string {
    // 构建卡牌信息
    const cardsInfo = input.cards.map((card, index) => {
      const position = card.position || `位置${index + 1}`;
      return `${position}: ${card.name}${card.reversed ? ' (逆位)' : ' (正位)'}`;
    }).join('\n');
    
    // 构建提示
    return `请作为专业的塔罗牌解读师，为以下塔罗牌阵提供详细的解读：

问题: "${input.question}"
牌阵类型: ${input.spread}

抽到的牌:
${cardsInfo}

请提供以下格式的解读:
1. 每张牌的单独解读，包括在其位置上的特殊含义
2. 整体牌阵的综合解读，考虑牌与牌之间的关系和能量流动
3. 基于牌阵的具体建议

解读应该深入、专业，同时易于理解。请考虑问题的性质和牌阵类型，提供有针对性的解读。`;
  }
  
  /**
   * 解析AI响应
   * @param aiResponse AI响应
   * @param input 塔罗牌解读输入
   * @returns 解析后的塔罗牌解读结果
   */
  private parseAiResponse(aiResponse: string, input: TarotReadingInput): TarotReadingOutput {
    // 初始化结果
    const interpretations: Record<string, string> = {};
    let overallReading = '';
    let advice = '';
    
    try {
      // 尝试从AI响应中提取各部分
      
      // 1. 提取单卡解读
      input.cards.forEach((card, index) => {
        const position = card.position || `位置${index + 1}`;
        const cardName = card.name + (card.reversed ? ' (逆位)' : ' (正位)');
        
        // 尝试找到该卡的解读部分
        const cardRegex = new RegExp(`${position}[：:].+?(?=\\n\\n|$)`, 's');
        const match = aiResponse.match(cardRegex);
        
        if (match) {
          interpretations[position] = match[0];
        } else {
          // 如果找不到特定卡的解读，使用规则引擎生成
          interpretations[position] = this.generateGenericCardInterpretation(card, position);
        }
      });
      
      // 2. 提取整体解读
      const overallRegex = /整体[解读|分析|解释][:：](.+?)(?=\n\n建议|$)/s;
      const overallMatch = aiResponse.match(overallRegex);
      
      if (overallMatch && overallMatch[1]) {
        overallReading = overallMatch[1].trim();
      } else {
        // 如果没有明确的整体解读部分，尝试从中间部分提取
        const middlePart = aiResponse.substring(
          Math.floor(aiResponse.length * 0.3),
          Math.floor(aiResponse.length * 0.7)
        );
        overallReading = middlePart;
      }
      
      // 3. 提取建议
      const adviceRegex = /建议[:：](.+?)$/s;
      const adviceMatch = aiResponse.match(adviceRegex);
      
      if (adviceMatch && adviceMatch[1]) {
        advice = adviceMatch[1].trim();
      } else {
        // 如果没有明确的建议部分，使用最后一部分作为建议
        const lastPart = aiResponse.substring(Math.floor(aiResponse.length * 0.7));
        advice = lastPart;
      }
      
      // 如果提取失败，使用整个AI响应
      if (!overallReading && !advice) {
        const parts = aiResponse.split('\n\n');
        
        if (parts.length >= 3) {
          // 如果有足够的段落，使用中间部分作为整体解读，最后部分作为建议
          overallReading = parts[Math.floor(parts.length / 2)];
          advice = parts[parts.length - 1];
        } else {
          // 否则，将整个响应作为整体解读
          overallReading = aiResponse;
          advice = '根据塔罗牌阵，建议你深入反思牌面所揭示的信息，并在日常生活中应用这些见解。';
        }
      }
    } catch (error) {
      logger.error(`解析AI响应失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // 如果解析失败，使用整个AI响应作为整体解读
      overallReading = aiResponse;
      advice = '根据塔罗牌阵，建议你深入反思牌面所揭示的信息，并在日常生活中应用这些见解。';
      
      // 确保每张牌都有解读
      input.cards.forEach((card, index) => {
        const position = card.position || `位置${index + 1}`;
        if (!interpretations[position]) {
          interpretations[position] = this.generateGenericCardInterpretation(card, position);
        }
      });
    }
    
    return {
      interpretations,
      overallReading,
      advice
    };
  }
}

export default new TarotInferenceService();

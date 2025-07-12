// @ts-nocheck
import { logger } from '../../config/logger';
import AiModel, { AiModelType, TrainingData } from '../../models/aiModel.model';
import UserHistory from '../../models/userHistory.model';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

declare const process: any;
declare const __dirname: string;

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

/**
 * 塔罗牌训练数据服务
 * 专门负责塔罗牌解读AI模型的训练数据收集与管理
 */
class TarotTrainingDataService {
  private readonly dataDir = path.join(__dirname, '../../../../data/tarot');
  
  constructor() {
    // 确保数据目录存在
    this.ensureDataDirectory();
  }
  
  /**
   * 确保数据目录存在
   */
  private async ensureDataDirectory(): Promise<void> {
    try {
      await mkdir(this.dataDir, { recursive: true });
    } catch (error) {
      if ((error as any).code !== 'EEXIST') {
        logger.error(`创建塔罗牌数据目录失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  /**
   * 从用户历史记录收集塔罗牌解读数据
   * @param limit 限制收集数量
   * @returns 收集到的数据条数
   */
  public async collectFromUserHistory(limit: number = 1000): Promise<number> {
    try {
      logger.info(`开始从用户历史记录收集塔罗牌训练数据，限制: ${limit}条`);
      
      // 查询用户历史中的塔罗牌记录
      const tarotHistories = await UserHistory.find({ 
        type: 'tarot',
        // 筛选高质量数据
        $or: [
          { isFavorite: true },
          { rating: { $gte: 4 } }
        ]
      }).limit(limit);
      
      logger.info(`找到${tarotHistories.length}条塔罗牌历史记录`);
      
      if (tarotHistories.length === 0) {
        return 0;
      }
      
      // 转换为训练数据格式
      const trainingData: TrainingData[] = tarotHistories.map((history: any) => {
        const data = history.data;
        
        // 提取输入数据
        const input = {
          question: data.question || '',
          spread: data.spread || 'three-card',
          cards: Array.isArray(data.cards) ? data.cards.map((card: any) => ({
            name: card.name,
            position: card.position,
            reversed: !!card.reversed
          })) : []
        };
        
        // 提取输出数据
        const output = {
          interpretations: data.interpretations || {},
          overallReading: data.overallReading || '',
          advice: data.advice || ''
        };
        
        return {
          input,
          output,
          source: 'user_history',
          quality: history.isFavorite ? 0.9 : (history.rating ? history.rating / 5 : 0.7),
          createdAt: new Date()
        };
      }).filter((data: any) => 
        data.input.cards.length > 0 && 
        (data.output.interpretations || data.output.overallReading)
      );
      
      // 保存到AI模型
      if (trainingData.length > 0) {
        // 查找或创建塔罗牌模型
        let model = await AiModel.findOne({ type: AiModelType.TAROT });
        if (!model) {
          model = new AiModel({
            type: AiModelType.TAROT,
            version: '0.1.0',
            status: 'inactive',
            description: '塔罗牌解读AI模型',
            trainingData: []
          });
        }
        
        // 添加新的训练数据
        model.trainingData.push(...trainingData);
        model.trainingDataSize = model.trainingData.length;
        
        await model.save();
        logger.info(`成功添加${trainingData.length}条塔罗牌训练数据`);
        
        // 同时将数据保存到本地文件系统以便备份
        await this.saveTrainingDataToFile(trainingData);
        
        return trainingData.length;
      }
      
      logger.warn('塔罗牌训练数据处理后为空');
      return 0;
    } catch (error) {
      logger.error(`收集塔罗牌训练数据失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
  
  /**
   * 导入专业塔罗牌解读数据
   * @param filePath 数据文件路径
   * @returns 导入的数据条数
   */
  public async importFromExpertSource(filePath?: string): Promise<number> {
    try {
      const dataFilePath = filePath || path.join(this.dataDir, 'expert_tarot_readings.json');
      
      logger.info(`尝试从${dataFilePath}导入专业塔罗牌解读数据`);
      
      // 检查文件是否存在
      try {
        await readFile(dataFilePath, 'utf8');
      } catch (error) {
        // 如果文件不存在，生成示例数据
        await this.generateExampleExpertData(dataFilePath);
      }
      
      // 读取数据文件
      const fileContent = await readFile(dataFilePath, 'utf8');
      const expertReadings = JSON.parse(fileContent);
      
      if (!Array.isArray(expertReadings) || expertReadings.length === 0) {
        logger.warn(`专业塔罗牌解读数据为空或格式不正确: ${dataFilePath}`);
        return 0;
      }
      
      // 转换为训练数据格式
      const trainingData: TrainingData[] = expertReadings.map(reading => ({
        input: {
          question: reading.question,
          spread: reading.spread,
          cards: reading.cards
        },
        output: {
          interpretations: reading.interpretations,
          overallReading: reading.overallReading,
          advice: reading.advice
        },
        source: 'expert',
        quality: 0.95, // 专业数据质量高
        createdAt: new Date()
      }));
      
      // 保存到AI模型
      if (trainingData.length > 0) {
        let model = await AiModel.findOne({ type: AiModelType.TAROT });
        if (!model) {
          model = new AiModel({
            type: AiModelType.TAROT,
            version: '0.1.0',
            status: 'inactive',
            description: '塔罗牌解读AI模型',
            trainingData: []
          });
        }
        
        // 添加新的训练数据
        model.trainingData.push(...trainingData);
        model.trainingDataSize = model.trainingData.length;
        
        await model.save();
        logger.info(`成功导入${trainingData.length}条专业塔罗牌解读数据`);
        
        return trainingData.length;
      }
      
      return 0;
    } catch (error) {
      logger.error(`导入专业塔罗牌解读数据失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
  
  /**
   * 生成塔罗牌训练数据增强样本
   * @param baseCount 基础样本数量
   * @returns 生成的增强样本数量
   */
  public async generateAugmentedData(baseCount: number = 50): Promise<number> {
    try {
      logger.info(`开始生成塔罗牌训练数据增强样本，基础数量: ${baseCount}`);
      
      // 获取现有的训练数据作为基础
      const model = await AiModel.findOne({ type: AiModelType.TAROT });
      if (!model || !model.trainingData || model.trainingData.length === 0) {
        logger.warn('没有找到基础训练数据，无法生成增强样本');
        return 0;
      }
      
      // 从现有数据中选取基础样本
      const baseData = model.trainingData.slice(0, Math.min(model.trainingData.length, baseCount));
      
      // 生成增强样本
      const augmentedData: TrainingData[] = [];
      
      for (const sample of baseData) {
        // 1. 修改问题但保持相同的牌阵
        if (sample.input?.question) {
          const newSample1 = this.createAugmentedSample(sample, {
            input: {
              ...sample.input,
              question: this.modifyQuestion(sample.input.question)
            }
          });
          augmentedData.push(newSample1);
        }
        
        // 2. 保持相同的牌阵但调整牌的顺序
        if (sample.input?.cards && Array.isArray(sample.input.cards) && sample.input.cards.length > 1) {
          const newSample2 = this.createAugmentedSample(sample, {
            input: {
              ...sample.input,
              cards: this.shuffleArray([...sample.input.cards])
            }
          });
          augmentedData.push(newSample2);
        }
        
        // 3. 翻转部分牌的正逆位
        if (sample.input?.cards && Array.isArray(sample.input.cards) && sample.input.cards.length > 0) {
          const newSample3 = this.createAugmentedSample(sample, {
            input: {
              ...sample.input,
              cards: sample.input.cards.map((card: any) => ({
                ...card,
                reversed: Math.random() > 0.5 ? !card.reversed : card.reversed
              }))
            }
          });
          augmentedData.push(newSample3);
        }
      }
      
      // 保存增强样本
      if (augmentedData.length > 0) {
        // 添加新的训练数据
        model.trainingData.push(...augmentedData);
        model.trainingDataSize = model.trainingData.length;
        
        await model.save();
        logger.info(`成功生成${augmentedData.length}条塔罗牌训练数据增强样本`);
        
        // 同时将数据保存到本地文件系统以便备份
        await this.saveTrainingDataToFile(augmentedData, 'augmented_tarot_data.json');
        
        return augmentedData.length;
      }
      
      return 0;
    } catch (error) {
      logger.error(`生成塔罗牌训练数据增强样本失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
  
  /**
   * 将训练数据保存到文件
   * @param data 训练数据
   * @param fileName 文件名
   */
  private async saveTrainingDataToFile(data: TrainingData[], fileName?: string): Promise<void> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const outputFileName = fileName || `tarot_training_data_${timestamp}.json`;
      const outputPath = path.join(this.dataDir, outputFileName);
      
      await writeFile(outputPath, JSON.stringify(data, null, 2), 'utf8');
      logger.info(`训练数据已保存到: ${outputPath}`);
    } catch (error) {
      logger.error(`保存训练数据到文件失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * 生成示例专家数据
   * @param outputPath 输出文件路径
   */
  private async generateExampleExpertData(outputPath: string): Promise<void> {
    try {
      logger.info('生成示例专家塔罗牌解读数据');
      
      // 塔罗牌牌名
      const majorArcana = [
        'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
        'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
        'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
        'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun',
        'Judgement', 'The World'
      ];
      
      // 生成示例数据
      const exampleData = [
        {
          question: '我的职业发展如何？',
          spread: 'three-card',
          cards: [
            { name: 'The Magician', position: 'past', reversed: false },
            { name: 'The Wheel of Fortune', position: 'present', reversed: false },
            { name: 'The World', position: 'future', reversed: false }
          ],
          interpretations: {
            past: '魔术师牌表明你过去有很强的创造力和自我驱动力。你拥有所需的才能和资源，开始了职业之旅。',
            present: '命运之轮代表当前正经历重要的转变期。机会正在出现，环境在变化，这是一个充满可能性的时刻。',
            future: '世界牌是塔罗牌中最积极的牌之一，预示着圆满的成功。你的努力将得到回报，职业上将达到一个重要的里程碑。'
          },
          overallReading: '这个牌阵显示一个非常积极的职业发展轨迹。从过去的准备和技能积累(魔术师)，通过当前的变革和机遇(命运之轮)，最终达到成功与完成(世界)。你的职业道路显示出清晰的进展和最终的成就。',
          advice: '现在是采取行动的关键时刻，利用当前的变化带来的机会。保持灵活性，同时不要忘记你的长期目标。你已经具备了成功所需的一切，只需要顺应命运的流动并保持前进。'
        },
        {
          question: '我的感情生活如何发展？',
          spread: 'three-card',
          cards: [
            { name: 'The Lovers', position: 'past', reversed: false },
            { name: 'The Tower', position: 'present', reversed: true },
            { name: 'The Sun', position: 'future', reversed: false }
          ],
          interpretations: {
            past: '恋人牌代表过去你经历了深刻的连接和重要的选择。这可能指向一段有意义的关系或者重要的感情决定。',
            present: '倒立的高塔牌表明目前你可能正在避免必要的变化或破坏。有些需要结束的事情你可能在抗拒，或者内在的动荡没有完全表现出来。',
            future: '太阳牌预示着光明的未来。在感情上，这代表幸福、满足和成功的关系。困难将被克服，真正的快乐就在前方。'
          },
          overallReading: '你的感情旅程经历了从有意义的连接(恋人)，通过当前的调整和变化(倒立的高塔)，最终走向光明和幸福(太阳)。虽然现在可能感觉有些困难或停滞，但这只是迈向更美好感情生活的必要过渡。',
          advice: '不要害怕面对当前的挑战或必要的变化。有时候，只有通过释放不再适合你的事物，才能为新的幸福创造空间。保持开放的心态，相信未来的光明。'
        },
        {
          question: '我如何改善当前的财务状况？',
          spread: 'five-card',
          cards: [
            { name: 'The Emperor', position: 'current', reversed: false },
            { name: 'The Hermit', position: 'challenge', reversed: true },
            { name: 'Justice', position: 'advice', reversed: false },
            { name: 'The High Priestess', position: 'influence', reversed: false },
            { name: 'The Star', position: 'outcome', reversed: false }
          ],
          interpretations: {
            current: '皇帝牌表明你当前的财务状况需要更多的结构和规则。可能需要建立更好的财务体系和长期计划。',
            challenge: '倒立的隐士牌显示你可能缺乏必要的内省或寻求建议。不愿独自面对财务问题或过度依赖他人的意见可能是当前的挑战。',
            advice: '正义牌建议你需要平衡收入和支出，做出公平合理的财务决策。诚实地面对自己的财务状况，并采取平衡的方法。',
            influence: '女祭司牌显示你拥有内在的智慧和直觉，可以帮助你做出正确的财务决策。相信你的内在声音。',
            outcome: '星星牌预示着希望和积极的未来。通过遵循建议，你的财务状况将逐步改善，带来更大的安心和稳定。'
          },
          overallReading: '这个牌阵表明，通过建立更有序的财务体系(皇帝)，克服不愿寻求帮助的倾向(倒立的隐士)，公平平衡地处理财务(正义)，并信任你的直觉(女祭司)，你可以实现财务状况的改善(星星)。你有能力创建一个更加稳定和满意的财务未来。',
          advice: '开始制定具体的财务计划，包括预算、储蓄和投资策略。不要害怕寻求专业建议，但同时也要倾听你内心的智慧。保持收支平衡，做出诚实和公平的财务决策。坚持这些原则，你将看到逐步但持续的改善。'
        }
      ];
      
      // 保存示例数据
      await writeFile(outputPath, JSON.stringify(exampleData, null, 2), 'utf8');
      logger.info(`示例专家塔罗牌解读数据已保存到: ${outputPath}`);
    } catch (error) {
      logger.error(`生成示例专家数据失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * 创建增强样本
   * @param baseSample 基础样本
   * @param override 要覆盖的部分
   * @returns 增强后的样本
   */
  private createAugmentedSample(baseSample: TrainingData, override: Partial<{ input: any, output: any }>): TrainingData {
    return {
      input: {
        ...(baseSample.input || {}),
        ...(override.input || {})
      },
      output: {
        ...(baseSample.output || {}),
        ...(override.output || {})
      },
      source: 'augmented',
      quality: baseSample.quality !== undefined ? Math.max(0.5, baseSample.quality - 0.1) : 0.7,
      createdAt: new Date()
    };
  }
  
  /**
   * 修改问题文本
   * @param question 原问题
   * @returns 修改后的问题
   */
  private modifyQuestion(question: string): string {
    const questionTemplates = [
      '请告诉我关于我的{{topic}}？',
      '我的{{topic}}会如何发展？',
      '我需要知道我的{{topic}}情况',
      '对于{{topic}}，塔罗牌怎么说？',
      '我想了解我的{{topic}}前景'
    ];
    
    const topics = [
      '职业', '事业', '工作', '职场发展',
      '爱情', '感情', '恋情', '关系',
      '健康', '身体状况',
      '财务', '财运', '金钱状况',
      '人际关系', '社交圈',
      '个人成长', '精神发展'
    ];
    
    // 提取可能的主题
    let extractedTopic = '';
    for (const topic of topics) {
      if (question.includes(topic)) {
        extractedTopic = topic;
        break;
      }
    }
    
    // 如果没有提取到主题，随机选择一个
    const topic = extractedTopic || topics[Math.floor(Math.random() * topics.length)];
    
    // 随机选择一个模板并替换主题
    const template = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
    
    return template.replace('{{topic}}', topic);
  }
  
  /**
   * 随机打乱数组
   * @param array 要打乱的数组
   * @returns 打乱后的数组
   */
  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

export default new TarotTrainingDataService();

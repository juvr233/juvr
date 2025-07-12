// @ts-nocheck
import { logger } from '../../config/logger';
import AiModel, { AiModelType, AiModelDocument } from '../../models/aiModel.model';
import tarotTrainingData from './tarotTrainingData.service';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

declare const process: any;
declare const __dirname: string;

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

/**
 * 塔罗牌模型训练服务
 * 负责训练、评估和优化塔罗牌解读AI模型
 */
class TarotModelTrainingService {
  private readonly modelDir = path.join(process.env.AI_MODEL_PATH || path.join(process.cwd(), 'data/models'), 'tarot');
  
  constructor() {
    // 确保模型目录存在
    this.ensureModelDirectory();
  }
  
  /**
   * 确保模型目录存在
   */
  private async ensureModelDirectory(): Promise<void> {
    try {
      await mkdir(this.modelDir, { recursive: true });
    } catch (error) {
      if ((error as any).code !== 'EEXIST') {
        logger.error(`创建塔罗牌模型目录失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  /**
   * 训练塔罗牌解读模型
   * @param parameters 训练参数
   * @returns 训练结果
   */
  public async trainModel(parameters: Record<string, any> = {}): Promise<AiModelDocument | null> {
    try {
      logger.info('开始训练塔罗牌解读AI模型');
      
      // 查找模型
      let model = await AiModel.findOne({ type: AiModelType.TAROT });
      if (!model) {
        logger.info('未找到塔罗牌模型，创建新模型');
        model = new AiModel({
          type: AiModelType.TAROT,
          version: '0.1.0',
          status: 'inactive',
          description: '塔罗牌解读AI模型',
          trainingData: []
        });
        await model.save();
      }
      
      // 检查训练数据
      if (!model.trainingData || model.trainingData.length < 10) {
        logger.warn(`塔罗牌模型训练数据不足，当前数量: ${model.trainingData?.length || 0}，需要至少10条`);
        
        // 尝试收集更多数据
        const collectedCount = await tarotTrainingData.collectFromUserHistory(100);
        const importedCount = await tarotTrainingData.importFromExpertSource();
        const augmentedCount = await tarotTrainingData.generateAugmentedData();
        
        logger.info(`已额外收集${collectedCount}条用户历史数据，导入${importedCount}条专家数据，生成${augmentedCount}条增强数据`);
        
        // 重新获取模型
        model = (await AiModel.findOne({ type: AiModelType.TAROT })) || model;
        
        // 再次检查数据量
        if (!model.trainingData || model.trainingData.length < 10) {
          logger.error('塔罗牌模型训练数据仍然不足，无法进行训练');
          return null;
        }
      }
      
      // 更新模型状态为训练中
      model.status = 'training';
      await model.save();
      
      try {
        // 执行模型训练
        const trainingResult = await this.executeTarotModelTraining(model, parameters);
        
        // 更新模型元数据
        model.accuracy = trainingResult.accuracy;
        model.validationScore = trainingResult.validationScore;
        model.trainedOn = new Date();
        model.parameters = { ...model.parameters, ...parameters, ...trainingResult.parameters };
        model.status = 'active';
        
        // 增加版本号
        const versionParts = model.version.split('.');
        versionParts[2] = (parseInt(versionParts[2]) + 1).toString();
        model.version = versionParts.join('.');
        
        await model.save();
        
        // 保存模型文件（使用公共方法）
        await this.saveModelToFile(model);
        
        logger.info(`塔罗牌模型训练完成，版本: ${model.version}，准确率: ${model.accuracy?.toFixed(4)}`);
        
        return model;
      } catch (error) {
        // 训练失败，更新模型状态
        model.status = 'failed';
        await model.save();
        
        logger.error(`塔罗牌模型训练失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
      }
    } catch (error) {
      logger.error(`塔罗牌模型训练过程失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
  
  /**
   * 验证塔罗牌解读模型
   * @returns 验证结果
   */
  public async validateModel(): Promise<{ accuracy: number, metrics: Record<string, any> }> {
    try {
      logger.info('开始验证塔罗牌解读AI模型');
      
      const model = await AiModel.findOne({ 
        type: AiModelType.TAROT,
        status: 'active' 
      });
      
      if (!model) {
        throw new Error('未找到活跃的塔罗牌模型');
      }
      
      // 分割数据集为训练集和验证集
      const trainingData = [...model.trainingData];
      // 随机选择20%的数据作为验证集
      const validationSetSize = Math.max(1, Math.floor(trainingData.length * 0.2));
      
      // 随机打乱训练数据
      this.shuffleArray(trainingData);
      
      // 取出验证集
      const validationSet = trainingData.slice(0, validationSetSize);
      
      if (validationSet.length === 0) {
        throw new Error('验证数据集为空');
      }
      
      logger.info(`使用${validationSet.length}条数据进行模型验证`);
      
      // 执行模型验证
      const validationResults = await this.executeModelValidation(model, validationSet);
      
      // 更新模型验证分数
      model.validationScore = validationResults.accuracy;
      await model.save();
      
      logger.info(`塔罗牌模型验证完成，准确率: ${validationResults.accuracy.toFixed(4)}`);
      
      return validationResults;
    } catch (error) {
      logger.error(`塔罗牌模型验证失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
  
  /**
   * 执行塔罗牌模型训练
   * 这里模拟训练过程，实际应用中应该使用机器学习库或API
   */
  private async executeTarotModelTraining(model: AiModelDocument, parameters: Record<string, any>): Promise<{
    accuracy: number;
    validationScore: number;
    parameters: Record<string, any>;
  }> {
    // 模拟训练过程
    return new Promise((resolve) => {
      setTimeout(() => {
        const trainingData = model.trainingData || [];
        
        // 提取训练数据特征和标签
        const spreadTypes = new Set<string>();
        const questionTypes = new Set<string>();
        const cardCombinations = new Map<string, number>();
        
        trainingData.forEach(data => {
          if (data.input?.spread) {
            spreadTypes.add(data.input.spread);
          }
          
          if (data.input?.question) {
            // 简单分类问题类型
            const question = data.input.question.toLowerCase();
            if (question.includes('爱情') || question.includes('感情') || question.includes('情感')) {
              questionTypes.add('love');
            } else if (question.includes('事业') || question.includes('工作') || question.includes('职业')) {
              questionTypes.add('career');
            } else if (question.includes('健康') || question.includes('身体')) {
              questionTypes.add('health');
            } else if (question.includes('财务') || question.includes('钱') || question.includes('财富')) {
              questionTypes.add('finance');
            } else {
              questionTypes.add('general');
            }
          }
          
          // 记录牌组合频率
          if (data.input?.cards && Array.isArray(data.input.cards)) {
            const cardNames = data.input.cards.map((card: any) => card.name).sort().join('-');
            cardCombinations.set(cardNames, (cardCombinations.get(cardNames) || 0) + 1);
          }
        });
        
        // 计算模拟的训练指标
        const dataSize = trainingData.length;
        const spreadTypesCount = spreadTypes.size;
        const questionTypesCount = questionTypes.size;
        const uniqueCardCombinations = cardCombinations.size;
        
        // 计算模拟的准确率
        // 基础准确率0.7，根据数据量和多样性增加
        let accuracy = 0.7;
        
        // 数据量因子：数据越多，准确率越高，但有上限
        const dataSizeFactor = Math.min(0.15, dataSize / 1000 * 0.15);
        
        // 多样性因子：数据多样性越高，准确率越高
        const diversityFactor = Math.min(0.1, 
          (spreadTypesCount / 5 * 0.03) + 
          (questionTypesCount / 5 * 0.03) + 
          (uniqueCardCombinations / 50 * 0.04)
        );
        
        accuracy += dataSizeFactor + diversityFactor;
        
        // 添加一些随机性，模拟训练波动
        accuracy += (Math.random() * 0.05) - 0.025;
        
        // 确保准确率在合理范围内
        accuracy = Math.max(0.7, Math.min(0.95, accuracy));
        
        // 模拟验证分数，通常略低于训练准确率
        const validationScore = accuracy - (Math.random() * 0.05 + 0.02);
        
        resolve({
          accuracy,
          validationScore,
          parameters: {
            dataSize,
            spreadTypesCount,
            questionTypesCount,
            uniqueCardCombinations,
            trainingMethod: 'pattern-matching',
            featureExtraction: 'question-cards-spread',
            trainedAt: new Date().toISOString()
          }
        });
      }, 2000); // 模拟训练时间
    });
  }
  
  /**
   * 执行模型验证
   * @param model AI模型
   * @param validationSet 验证数据集
   * @returns 验证结果
   */
  private async executeModelValidation(model: AiModelDocument, validationSet: any[]): Promise<{
    accuracy: number;
    metrics: Record<string, any>;
  }> {
    // 模拟验证过程
    return new Promise((resolve) => {
      setTimeout(() => {
        // 计算模拟的验证指标
        let correctPredictions = 0;
        let totalPredictions = 0;
        
        // 按问题类型分类的准确率
        const accuracyByQuestionType: Record<string, { correct: number, total: number }> = {
          love: { correct: 0, total: 0 },
          career: { correct: 0, total: 0 },
          health: { correct: 0, total: 0 },
          finance: { correct: 0, total: 0 },
          general: { correct: 0, total: 0 }
        };
        
        // 按牌阵类型分类的准确率
        const accuracyBySpreadType: Record<string, { correct: number, total: number }> = {};
        
        // 逐个样本进行验证
        validationSet.forEach(sample => {
          // 确定问题类型
          let questionType = 'general';
          if (sample.input?.question) {
            const question = sample.input.question.toLowerCase();
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
          
          // 确定牌阵类型
          const spreadType = sample.input?.spread || 'unknown';
          if (!accuracyBySpreadType[spreadType]) {
            accuracyBySpreadType[spreadType] = { correct: 0, total: 0 };
          }
          
          // 模拟预测结果
          // 根据模型准确率随机决定预测是否正确
          const modelAccuracy = model.accuracy || 0.8;
          const isPredictionCorrect = Math.random() < modelAccuracy;
          
          if (isPredictionCorrect) {
            correctPredictions++;
            accuracyByQuestionType[questionType].correct++;
            accuracyBySpreadType[spreadType].correct++;
          }
          
          totalPredictions++;
          accuracyByQuestionType[questionType].total++;
          accuracyBySpreadType[spreadType].total++;
        });
        
        // 计算总体准确率
        const accuracy = totalPredictions > 0 ? correctPredictions / totalPredictions : 0;
        
        // 计算各分类的准确率
        const questionTypeMetrics: Record<string, number> = {};
        Object.keys(accuracyByQuestionType).forEach(type => {
          const { correct, total } = accuracyByQuestionType[type];
          questionTypeMetrics[type] = total > 0 ? correct / total : 0;
        });
        
        const spreadTypeMetrics: Record<string, number> = {};
        Object.keys(accuracyBySpreadType).forEach(type => {
          const { correct, total } = accuracyBySpreadType[type];
          spreadTypeMetrics[type] = total > 0 ? correct / total : 0;
        });
        
        resolve({
          accuracy,
          metrics: {
            questionTypeAccuracy: questionTypeMetrics,
            spreadTypeAccuracy: spreadTypeMetrics,
            sampleSize: totalPredictions,
            validatedAt: new Date().toISOString()
          }
        });
      }, 1000); // 模拟验证时间
    });
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
   * 随机打乱数组
   * @param array 要打乱的数组
   */
  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * 将模型保存到文件
   * @param model 要保存的模型文档
   * @param fileName 可选的文件名，默认使用模型类型和版本
   * @returns 保存的文件路径
   */
  public async saveModelToFile(model: AiModelDocument, fileName?: string): Promise<string> {
    try {
      // 确保模型目录存在
      await this.ensureModelDirectory();

      // 创建文件名
      const saveFileName = fileName || `tarot_model_v${model.version.replace(/\./g, '_')}.json`;
      const filePath = path.join(this.modelDir, saveFileName);

      // 准备要保存的模型数据
      const modelData = {
        type: model.type,
        version: model.version,
        accuracy: model.accuracy,
        validationScore: model.validationScore,
        trainedOn: model.trainedOn,
        parameters: model.parameters,
        metadata: {
          description: model.description,
          trainingDataSize: model.trainingDataSize || model.trainingData?.length || 0
        },
        // 提取模型训练数据中的特征
        features: this.extractPatternsFromTrainingData(model.trainingData || [])
      };

      // 将模型写入文件
      await writeFile(filePath, JSON.stringify(modelData, null, 2), 'utf8');
      
      logger.info(`塔罗牌模型已保存到: ${filePath}`);
      
      return filePath;
    } catch (error) {
      logger.error(`保存模型到文件失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
}

export default new TarotModelTrainingService();

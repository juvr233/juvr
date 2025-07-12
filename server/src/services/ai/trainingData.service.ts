// @ts-nocheck
import AiModel, { AiModelType, TrainingData } from '../../models/aiModel.model';
import { logger } from '../../config/logger';
import UserHistory from '../../models/userHistory.model';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';

/**
 * AI训练数据采集服务
 * 负责收集和管理命理解读AI模型的训练数据
 */
class TrainingDataService {
  /**
   * 从用户历史记录收集训练数据
   * @param modelType AI模型类型
   * @param limit 收集数据量限制
   * @returns 收集的训练数据数量
   */
  public async collectFromUserHistory(modelType: AiModelType, limit: number = 1000): Promise<number> {
    try {
      logger.info(`开始从用户历史记录收集${modelType}训练数据`);
      
      // 查询用户历史中相关类型的记录
      const userHistories = await UserHistory.find({ 
        type: modelType, 
        // 筛选高质量数据，例如用户已收藏或评分高的
        $or: [
          { isFavorite: true },
          { rating: { $gte: 4 } }
        ] 
      }).limit(limit);
      
      if (userHistories.length === 0) {
        logger.warn(`未找到类型为${modelType}的用户历史记录`);
        return 0;
      }
      
      // 转换为训练数据格式
      const trainingData: TrainingData[] = userHistories.map((history: any) => {
        // 根据不同类型提取输入和输出
        const input = this.extractInputData(history);
        const output = this.extractOutputData(history);
        
        return {
          input,
          output,
          source: 'user_history',
          quality: history.isFavorite ? 0.9 : (history.rating ? history.rating / 5 : 0.7),
          createdAt: new Date()
        };
      }).filter((data: any) => data.input && data.output); // 过滤掉无效数据
      
      // 将数据添加到模型的训练数据集
      if (trainingData.length > 0) {
        // 查找或创建模型
        let model = await AiModel.findOne({ type: modelType });
        if (!model) {
          model = new AiModel({
            type: modelType,
            version: '0.1.0',
            status: 'inactive',
            trainingData: []
          });
        }
        
        // 添加新的训练数据
        model.trainingData.push(...trainingData);
        model.trainingDataSize = model.trainingData.length;
        
        await model.save();
        logger.info(`成功添加${trainingData.length}条${modelType}训练数据`);
        
        return trainingData.length;
      }
      
      logger.warn(`类型为${modelType}的训练数据处理后为空`);
      return 0;
    } catch (error) {
      logger.error(`收集${modelType}训练数据失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
  
  /**
   * 手动添加训练数据
   * @param modelType AI模型类型
   * @param data 训练数据数组
   * @returns 添加的训练数据数量
   */
  public async addTrainingData(modelType: AiModelType, data: Array<{ input: any; output: any; source?: string; quality?: number }>): Promise<number> {
    try {
      if (!data || data.length === 0) {
        return 0;
      }
      
      // 转换为训练数据格式
      const trainingData: TrainingData[] = data.map(item => ({
        input: item.input,
        output: item.output,
        source: item.source || 'manual',
        quality: item.quality || 0.8,
        createdAt: new Date()
      }));
      
      // 查找或创建模型
      let model = await AiModel.findOne({ type: modelType });
      if (!model) {
        model = new AiModel({
          type: modelType,
          version: '0.1.0',
          status: 'inactive',
          trainingData: []
        });
      }
      
      // 添加新的训练数据
      model.trainingData.push(...trainingData);
      model.trainingDataSize = model.trainingData.length;
      
      await model.save();
      logger.info(`成功手动添加${trainingData.length}条${modelType}训练数据`);
      
      return trainingData.length;
    } catch (error) {
      logger.error(`手动添加${modelType}训练数据失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
  
  /**
   * 从外部数据源导入训练数据
   * @param modelType AI模型类型
   * @param source 数据源（例如：文件路径、API URL等）
   * @param format 数据格式（例如：json、csv等）
   * @returns 导入的训练数据数量
   */
  public async importFromExternalSource(modelType: AiModelType, source: string, format: 'json' | 'csv' = 'json'): Promise<number> {
    try {
      logger.info(`开始从外部数据源 '${source}' 导入${modelType}训练数据`);
      
      if (!fs.existsSync(source)) {
        throw new Error(`数据源文件不存在: ${source}`);
      }
      
      const fileContent = fs.readFileSync(source, 'utf-8');
      let records: any[];
      
      if (format === 'json') {
        records = JSON.parse(fileContent);
      } else if (format === 'csv') {
        records = parse(fileContent, {
          columns: true,
          skip_empty_lines: true
        });
      } else {
        throw new Error(`不支持的数据格式: ${format}`);
      }
      
      if (!records || records.length === 0) {
        logger.warn('数据源为空或格式不正确');
        return 0;
      }
      
      const trainingData: TrainingData[] = records.map(record => ({
        input: record.input,
        output: record.output,
        source: `external_${format}`,
        quality: record.quality || 0.75,
        createdAt: new Date()
      }));
      
      let model = await AiModel.findOne({ type: modelType });
      if (!model) {
        model = new AiModel({
          type: modelType,
          version: '0.1.0',
          status: 'inactive',
          trainingData: []
        });
      }
      
      model.trainingData.push(...trainingData);
      model.trainingDataSize = model.trainingData.length;
      
      await model.save();
      logger.info(`成功从 '${source}' 导入 ${trainingData.length} 条${modelType}训练数据`);
      
      return trainingData.length;
    } catch (error) {
      logger.error(`导入${modelType}训练数据失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
  
  /**
   * 清理低质量训练数据
   * @param modelType AI模型类型
   * @param qualityThreshold 质量阈值，低于该阈值的数据将被删除
   * @returns 清理的训练数据数量
   */
  public async cleanTrainingData(modelType: AiModelType, qualityThreshold: number = 0.5): Promise<number> {
    try {
      const model = await AiModel.findOne({ type: modelType });
      if (!model) {
        return 0;
      }
      
      const originalSize = model.trainingData.length;
      model.trainingData = model.trainingData.filter((data: any) => 
        data.quality === undefined || data.quality >= qualityThreshold
      );
      model.trainingDataSize = model.trainingData.length;
      
      await model.save();
      
      const cleanedCount = originalSize - model.trainingData.length;
      logger.info(`成功清理${cleanedCount}条低质量${modelType}训练数据`);
      
      return cleanedCount;
    } catch (error) {
      logger.error(`清理${modelType}训练数据失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
  
  /**
   * 提取输入数据
   * 根据不同类型的历史记录提取适合作为模型输入的数据
   */
  private extractInputData(history: any): any {
    try {
      const type = history.type;
      const data = history.data;
      
      if (!data) return null;
      
      switch (type) {
        case AiModelType.NUMEROLOGY:
          return {
            birthDate: data.birthDate,
            name: data.name
          };
        
        case AiModelType.TAROT:
          return {
            question: data.question,
            spread: data.spread,
            cards: data.cards.map((card: any) => card.name)
          };
        
        case AiModelType.ICHING:
          return {
            question: data.question,
            hexagram: data.hexagram
          };
        
        case AiModelType.COMPATIBILITY:
          return {
            person1: {
              birthDate: data.person1?.birthDate,
              name: data.person1?.name
            },
            person2: {
              birthDate: data.person2?.birthDate,
              name: data.person2?.name
            }
          };
        
        case AiModelType.BAZI:
          return {
            birthDate: data.birthDate,
            birthTime: data.birthTime,
            gender: data.gender
          };
        
        case AiModelType.STAR_ASTROLOGY:
          return {
            birthDate: data.birthDate,
            birthTime: data.birthTime,
            birthLocation: data.birthLocation
          };
        
        case AiModelType.HOLISTIC:
          return {
            birthDate: data.birthDate,
            birthTime: data.birthTime,
            name: data.name,
            gender: data.gender,
            question: data.question
          };
        
        default:
          return null;
      }
    } catch (error) {
      logger.error(`提取输入数据失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }
  
  /**
   * 提取输出数据
   * 根据不同类型的历史记录提取适合作为模型输出的数据
   */
  private extractOutputData(history: any): any {
    try {
      const type = history.type;
      const data = history.data;
      
      if (!data) return null;
      
      switch (type) {
        case AiModelType.NUMEROLOGY:
          return {
            lifePathNumber: data.lifePathNumber,
            destinyNumber: data.destinyNumber,
            soulUrgeNumber: data.soulUrgeNumber,
            personalityNumber: data.personalityNumber,
            interpretations: data.interpretations
          };
        
        case AiModelType.TAROT:
          return {
            interpretations: data.interpretations,
            overallReading: data.overallReading,
            advice: data.advice
          };
        
        case AiModelType.ICHING:
          return {
            reading: data.reading,
            changing: data.changing,
            advice: data.advice
          };
        
        case AiModelType.COMPATIBILITY:
          return {
            compatibility: data.compatibility,
            strengths: data.strengths,
            challenges: data.challenges,
            advice: data.advice
          };
        
        case AiModelType.BAZI:
          return {
            chart: data.chart,
            elements: data.elements,
            reading: data.reading,
            insights: data.insights
          };
        
        case AiModelType.STAR_ASTROLOGY:
          return {
            chart: data.chart,
            houses: data.houses,
            aspects: data.aspects,
            reading: data.reading
          };
        
        case AiModelType.HOLISTIC:
          return {
            readings: data.readings,
            insights: data.insights,
            advice: data.advice
          };
        
        default:
          return null;
      }
    } catch (error) {
      logger.error(`提取输出数据失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }
}

export default new TrainingDataService();

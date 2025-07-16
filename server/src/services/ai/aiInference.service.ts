import AiModel, { AiModelType } from '../../models/aiModel.model';
import { logger } from '../../config/logger';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import aiService from '../ai.service';
import * as tf from '@tensorflow/tfjs-node';

const readFile = promisify(fs.readFile);

/**
 * AI推理服务
 * 负责使用训练好的模型进行命理解读预测
 */
class AiInferenceService {
  /**
   * 使用AI模型进行命理解读
   * @param modelType AI模型类型
   * @param inputData 输入数据
   * @returns AI生成的命理解读结果
   */
  public async generateReading(modelType: AiModelType, inputData: any): Promise<any> {
    try {
      // 查找活跃的模型
      const model = await AiModel.findOne({
        type: modelType,
        status: 'active'
      });
      
      if (!model) {
        logger.warn(`未找到活跃的${modelType}模型，将使用规则引擎进行解读`);
        return this.fallbackToRuleEngine(modelType, inputData);
      }
      
      logger.info(`使用${modelType}模型(${model.version})生成命理解读`);
      
      // 根据不同类型的模型进行推理
      let result;
      switch (modelType) {
        case AiModelType.NUMEROLOGY:
          result = await this.inferNumerology(model, inputData);
          break;
        case AiModelType.TAROT:
          result = await this.inferTarot(model, inputData);
          break;
        case AiModelType.ICHING:
          result = await this.inferIChing(model, inputData);
          break;
        case AiModelType.COMPATIBILITY:
          result = await this.inferCompatibility(model, inputData);
          break;
        case AiModelType.BAZI:
          result = await this.inferBazi(model, inputData);
          break;
        case AiModelType.STAR_ASTROLOGY:
          result = await this.inferStarAstrology(model, inputData);
          break;
        case AiModelType.HOLISTIC:
          result = await this.inferHolistic(model, inputData);
          break;
        default:
          throw new Error(`不支持的模型类型: ${modelType}`);
      }
      
      // 记录输入和输出，可以用于未来的模型优化
      this.logInferenceData(modelType, inputData, result);
      
      return result;
    } catch (error) {
      logger.error(`AI模型推理失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // 发生错误时，回退到规则引擎
      return this.fallbackToRuleEngine(modelType, inputData);
    }
  }
  
  /**
   * 批量生成命理解读
   * @param modelType AI模型类型
   * @param batchInputData 批量输入数据
   * @returns 批量AI生成的命理解读结果
   */
  public async batchGenerateReading(modelType: AiModelType, batchInputData: any[]): Promise<any[]> {
    try {
      const results = [];
      
      // 串行处理每个输入数据
      for (const inputData of batchInputData) {
        const result = await this.generateReading(modelType, inputData);
        results.push(result);
      }
      
      return results;
    } catch (error) {
      logger.error(`批量AI模型推理失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
  
  /**
   * 数字学推理
   */
  private async inferNumerology(model: any, inputData: any): Promise<any> {
    try {
      // 验证输入数据
      if (!inputData.birthDate) {
        throw new Error('数字学解读需要提供出生日期');
      }

      // 加载模型
      const modelPath = `file://${model.modelPath}/model.json`;
      const tfModel = await tf.loadLayersModel(modelPath);

      // 预处理输入数据
      const preprocessedInput = this.preprocessInput(inputData, AiModelType.NUMEROLOGY);
      const inputTensor = tf.tensor2d([preprocessedInput]);

      // 执行推理
      const prediction = tfModel.predict(inputTensor) as tf.Tensor;
      const resultData = await prediction.data();

      // 后处理结果
      const result = this.postprocessOutput(resultData, AiModelType.NUMEROLOGY);

      return { ...result, prediction: resultData };
    } catch (error) {
      logger.error(`数字学推理失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return this.fallbackToRuleEngine(AiModelType.NUMEROLOGY, inputData);
    }
  }
  
  /**
   * 塔罗牌推理
   */
  private async inferTarot(model: any, inputData: any): Promise<any> {
    try {
      // 验证输入数据
      if (!inputData.question || !inputData.spread || !inputData.cards || !Array.isArray(inputData.cards)) {
        throw new Error('塔罗牌解读需要提供问题、牌阵和卡牌');
      }

      // 检查是否有足够的卡牌
      if (inputData.cards.length === 0) {
        throw new Error('塔罗牌解读需要至少一张卡牌');
      }

      // 加载模型
      const modelPath = `file://${model.modelPath}/model.json`;
      const tfModel = await tf.loadLayersModel(modelPath);

      // 预处理输入数据
      const preprocessedInput = this.preprocessInput(inputData, AiModelType.TAROT);
      const inputTensor = tf.tensor2d([preprocessedInput]);

      // 执行推理
      const prediction = tfModel.predict(inputTensor) as tf.Tensor;
      const resultData = await prediction.data();

      // 后处理结果
      const result = this.postprocessOutput(resultData, AiModelType.TAROT);

      return result;
    } catch (error) {
      logger.error(`塔罗牌推理失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return this.fallbackToRuleEngine(AiModelType.TAROT, inputData);
    }
  }
  
  /**
   * 加载塔罗牌数据
   */
  private async loadTarotData(): Promise<any> {
    try {
      const tarotDataPath = path.join(process.cwd(), 'data/tarot/tarot_card_meanings.json');
      const data = await fs.promises.readFile(tarotDataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      logger.error(`加载塔罗牌数据失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }
  
  /**
   * 构建塔罗牌推理提示
   */
  private buildTarotPrompt(inputData: any, tarotData: any): string {
    const { question, spread, cards } = inputData;
    
    // 获取牌阵信息
    const spreadInfo = tarotData.spreads[spread] || {
      positions: cards.map((_: any, i: number) => `position_${i + 1}`),
      descriptions: {}
    };
    
    // 构建卡牌描述
    const cardDescriptions = cards.map((card: any, i: number) => {
      const position = card.position || spreadInfo.positions[i] || `position_${i + 1}`;
      const positionDesc = spreadInfo.descriptions[position] || `位置 ${i + 1}`;
      
      // 获取卡牌含义
      let cardMeaning;
      if (tarotData.major[card.name]) {
        cardMeaning = card.reversed ? tarotData.major[card.name].reversed : tarotData.major[card.name].upright;
      } else {
        cardMeaning = "未知卡牌含义";
      }
      
      return `卡牌 ${i + 1}: ${card.name} (${card.reversed ? '逆位' : '正位'})
位置: ${position} - ${positionDesc}
含义: ${cardMeaning}`;
    }).join('\n\n');
    
    // 构建完整提示
    return `请根据以下塔罗牌阵列为用户提供详细的塔罗牌解读。

问题: ${question}
牌阵: ${spread}

${cardDescriptions}

请提供以下内容:
1. 每张卡牌在其位置上的具体解读
2. 整体牌阵的综合解读
3. 针对用户问题的具体建议

请确保解读具有洞察力、富有同理心，并为用户提供有价值的指导。`;
  }
  
  /**
   * 调用AI服务进行推理
   */
  private async callAiService(prompt: string, model: any): Promise<string | null> {
    try {
      // 使用AI服务进行推理
      const response = await aiService.generateText(prompt, {
        model: process.env.AI_MODEL || 'Gemini-2.5-Pro',
        temperature: 0.7,
        maxTokens: 2048
      });
      
      return response;
    } catch (error) {
      logger.error(`调用AI服务失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }
  
  /**
   * 解析塔罗牌AI响应
   */
  private parseTarotAiResponse(aiResponse: string, inputData: any, tarotData: any): any {
    try {
      // 解析AI响应
      const cardInterpretations: Record<string, string> = {};
      
      // 为每张卡牌分配解读
      inputData.cards.forEach((card: any, i: number) => {
        const position = card.position || `position_${i + 1}`;
        // 提取该卡牌的解读（这里使用简单的启发式方法）
        const cardName = card.name;
        const cardRegex = new RegExp(`(${cardName}[^]*?(?=\\n\\n|$))`, 'i');
        const match = aiResponse.match(cardRegex);
        
        if (match) {
          cardInterpretations[position] = match[0].trim();
        } else {
          // 如果没有找到匹配，使用默认解读
          const cardMeaning = tarotData.major[cardName];
          cardInterpretations[position] = `${cardName} (${card.reversed ? '逆位' : '正位'}): ${
            card.reversed ? cardMeaning?.reversed : cardMeaning?.upright
          }`;
        }
      });
      
      // 提取整体解读
      let overallReading = '';
      const overallRegex = /整体(解读|分析)[：:]([\s\S]*?)(?=建议|$)/i;
      const overallMatch = aiResponse.match(overallRegex);
      
      if (overallMatch) {
        overallReading = overallMatch[2].trim();
      } else {
        // 如果没有找到整体解读，使用AI响应的后半部分
        overallReading = aiResponse.substring(Math.floor(aiResponse.length / 2)).trim();
      }
      
      // 提取建议
      let advice = '';
      const adviceRegex = /建议[：:]([\s\S]*?)$/i;
      const adviceMatch = aiResponse.match(adviceRegex);
      
      if (adviceMatch) {
        advice = adviceMatch[1].trim();
      } else {
        // 如果没有找到建议，使用AI响应的最后一段
        const paragraphs = aiResponse.split('\n\n');
        advice = paragraphs[paragraphs.length - 1].trim();
      }
      
      return {
        interpretations: cardInterpretations,
        overallReading,
        advice
      };
    } catch (error) {
      logger.error(`解析AI响应失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // 返回简单的结构化结果
      return {
        interpretations: inputData.cards.reduce((acc: Record<string, string>, card: any, i: number) => {
          const position = card.position || `position_${i + 1}`;
          acc[position] = `${card.name} (${card.reversed ? '逆位' : '正位'})`;
          return acc;
        }, {}),
        overallReading: '无法解析AI响应，请重试。',
        advice: '建议重新进行塔罗牌解读。'
      };
    }
  }
  
  /**
   * 易经推理
   */
  private async inferIChing(model: any, inputData: any): Promise<any> {
    try {
      // 验证输入数据
      if (!inputData.hexagram) {
        throw new Error('易经解读需要提供卦象信息');
      }

      // 加载模型
      const modelPath = `file://${model.modelPath}/model.json`;
      const tfModel = await tf.loadLayersModel(modelPath);

      // 预处理输入数据
      const preprocessedInput = this.preprocessInput(inputData, AiModelType.ICHING);
      const inputTensor = tf.tensor2d([preprocessedInput]);

      // 执行推理
      const prediction = tfModel.predict(inputTensor) as tf.Tensor;
      const resultData = await prediction.data();

      // 后处理结果
      const result = this.postprocessOutput(resultData, AiModelType.ICHING);

      return result;
    } catch (error) {
      logger.error(`易经推理失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return this.fallbackToRuleEngine(AiModelType.ICHING, inputData);
    }
  }
  
  /**
   * 加载易经数据
   */
  private async loadIChingData(): Promise<any> {
    try {
      // 从文件加载易经数据
      const dataPath = path.join(process.cwd(), 'data/iching/iching_meanings.json');
      
      const data = await fs.promises.readFile(dataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      logger.error(`加载易经数据失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }
  
  /**
   * 构建易经AI提示
   */
  private buildIChingPrompt(inputData: any, ichingData: any): string {
    const { hexagram, question } = inputData;
    const hexNumber = hexagram.number;
    const hexInfo = ichingData.hexagrams.find((h: any) => h.number === hexNumber);
    
    if (!hexInfo) {
      return `请为用户解读一个未知卦象（编号：${hexNumber}）针对问题："${question || '未提供问题'}"。`;
    }
    
    let prompt = `请根据易经为用户解读${hexInfo.name.chinese}卦（第${hexNumber}卦，${hexInfo.name.pinyin}，${hexInfo.name.english}）`;
    
    if (question) {
      prompt += `，解答用户的问题："${question}"。`;
    } else {
      prompt += '。';
    }
    
    prompt += `\n\n卦象信息：\n`;
    prompt += `- 卦辞：${hexInfo.judgment}\n`;
    prompt += `- 象辞：${hexInfo.image}\n`;
    prompt += `- 卦象结构：${hexInfo.structure}\n`;
    
    // 如果有变爻，添加变爻信息
    if (hexagram.changingLines && hexagram.changingLines.length > 0) {
      prompt += `\n变爻：${hexagram.changingLines.join(', ')}爻`;
      
      if (hexagram.resultHexagram) {
        const resultHex = ichingData.hexagrams.find((h: any) => h.number === hexagram.resultHexagram.number);
        if (resultHex) {
          prompt += `，变为${resultHex.name.chinese}卦（第${resultHex.number}卦）。`;
        }
      }
    }
    
    prompt += `\n\n请提供以下内容：
1. 卦象的总体含义
2. 对于用户问题的具体指导
3. 当前形势分析
4. 未来发展趋势
5. 建议和行动指南`;
    
    return prompt;
  }
  
  /**
   * 解析易经AI响应
   */
  private parseIChingAiResponse(aiResponse: string | null, inputData: any, ichingData: any): any {
    if (!aiResponse) {
      return this.fallbackToRuleEngine(AiModelType.ICHING, inputData);
    }
    
    try {
      // 尝试将响应按章节分割
      const sections = aiResponse.split(/\d+\.\s+/);
      
      // 构建解读结果
      const result = {
        hexagram: inputData.hexagram,
        interpretation: {
          overall: sections[1] || '无法解析整体含义',
          guidance: sections[2] || '无法解析具体指导',
          currentSituation: sections[3] || '无法解析当前形势',
          futureTrend: sections[4] || '无法解析未来趋势',
          advice: sections[5] || '无法解析建议和行动指南'
        }
      };
      
      return result;
    } catch (error) {
      logger.error(`解析易经AI响应失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return this.fallbackToRuleEngine(AiModelType.ICHING, inputData);
    }
  }
  
  /**
   * 兼容性分析推理
   */
  private async inferCompatibility(model: any, inputData: any): Promise<any> {
    try {
      // 验证输入数据
      if (!inputData.person1 || !inputData.person2) {
        throw new Error('兼容性分析需要提供两个人的数据');
      }

      // 加载模型
      const modelPath = `file://${model.modelPath}/model.json`;
      const tfModel = await tf.loadLayersModel(modelPath);

      // 预处理输入数据
      const preprocessedInput = this.preprocessInput(inputData, AiModelType.COMPATIBILITY);
      const inputTensor = tf.tensor2d([preprocessedInput]);

      // 执行推理
      const prediction = tfModel.predict(inputTensor) as tf.Tensor;
      const resultData = await prediction.data();

      // 后处理结果
      const result = this.postprocessOutput(resultData, AiModelType.COMPATIBILITY);

      return result;
    } catch (error) {
      logger.error(`兼容性分析推理失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return this.fallbackToRuleEngine(AiModelType.COMPATIBILITY, inputData);
    }
  }
  
  /**
   * 构建兼容性分析提示
   */
  private buildCompatibilityPrompt(person1: any, person2: any, profile1: any, profile2: any): string {
    const relationship = person1.relationship || '关系未指定';
    
    let prompt = `请分析以下两个人的兼容性：\n\n`;
    
    prompt += `第一个人：${person1.name || '匿名'}\n`;
    if (person1.birthDate) {
      prompt += `出生日期：${person1.birthDate}\n`;
    }
    if (profile1) {
      prompt += `生命数字：${profile1.lifePathNumber}\n`;
      if (profile1.destinyNumber) {
        prompt += `命运数字：${profile1.destinyNumber}\n`;
      }
    }
    
    prompt += `\n第二个人：${person2.name || '匿名'}\n`;
    if (person2.birthDate) {
      prompt += `出生日期：${person2.birthDate}\n`;
    }
    if (profile2) {
      prompt += `生命数字：${profile2.lifePathNumber}\n`;
      if (profile2.destinyNumber) {
        prompt += `命运数字：${profile2.destinyNumber}\n`;
      }
    }
    
    prompt += `\n关系类型：${relationship}\n`;
    
    prompt += `\n请提供以下分析：
1. 总体兼容性评分（0-100分）
2. 性格兼容性分析
3. 沟通方式兼容性
4. 价值观兼容性
5. 潜在挑战及克服方法
6. 关系发展建议`;
    
    return prompt;
  }
  
  /**
   * 解析兼容性分析AI响应
   */
  private parseCompatibilityAiResponse(
    aiResponse: string | null,
    person1: any,
    person2: any,
    profile1: any,
    profile2: any
  ): any {
    if (!aiResponse) {
      return this.fallbackToRuleEngine(AiModelType.COMPATIBILITY, { person1, person2 });
    }
    
    try {
      // 尝试从AI响应中提取评分
      let compatibilityScore = 0;
      const scoreMatch = aiResponse.match(/兼容性评分[：:]\s*(\d+)/);
      if (scoreMatch && scoreMatch[1]) {
        compatibilityScore = parseInt(scoreMatch[1]);
        // 确保评分在0-100范围内
        compatibilityScore = Math.max(0, Math.min(100, compatibilityScore));
      } else {
        // 如果没有找到明确的评分，基于数字学计算一个
        compatibilityScore = this.calculateCompatibilityScore(profile1, profile2);
      }
      
      // 提取分析部分
      const sections = aiResponse.split(/\d+\.\s+/);
      
      // 构建解读结果
      return {
        profiles: {
          person1: {
            name: person1.name || '匿名',
            lifePathNumber: profile1 ? profile1.lifePathNumber : null,
            destinyNumber: profile1 ? profile1.destinyNumber : null
          },
          person2: {
            name: person2.name || '匿名',
            lifePathNumber: profile2 ? profile2.lifePathNumber : null,
            destinyNumber: profile2 ? profile2.destinyNumber : null
          }
        },
        compatibility: {
          score: compatibilityScore,
          overall: sections[1] || '无法解析总体兼容性',
          personality: sections[2] || '无法解析性格兼容性',
          communication: sections[3] || '无法解析沟通方式兼容性',
          values: sections[4] || '无法解析价值观兼容性',
          challenges: sections[5] || '无法解析潜在挑战',
          advice: sections[6] || '无法解析关系发展建议'
        }
      };
    } catch (error) {
      logger.error(`解析兼容性分析AI响应失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return this.fallbackToRuleEngine(AiModelType.COMPATIBILITY, { person1, person2 });
    }
  }
  
  /**
   * 计算兼容性评分
   */
  private calculateCompatibilityScore(profile1: any, profile2: any): number {
    if (!profile1 || !profile2) {
      return 50; // 默认中等兼容性
    }
    
    // 基础兼容性评分
    let baseScore = 50;
    
    // 生命数字兼容性
    if (profile1.lifePathNumber && profile2.lifePathNumber) {
      const lifePath1 = profile1.lifePathNumber;
      const lifePath2 = profile2.lifePathNumber;
      
      // 生命数字完全相同（高度共鸣，但可能有相同盲点）
      if (lifePath1 === lifePath2) {
        baseScore += 15;
      } 
      // 生命数字互补（1-9, 2-8, 3-7, 4-6, 5与自身）
      else if (
        (lifePath1 + lifePath2 === 10) || 
        (lifePath1 === 5 && lifePath2 === 5)
      ) {
        baseScore += 20;
      }
      // 生命数字和谐（1-3-9, 2-4-8, 3-6-9, 4-8-1, 5-7-2）
      else if (
        (lifePath1 % 3 === lifePath2 % 3) ||
        ((lifePath1 + lifePath2) % 9 === 0)
      ) {
        baseScore += 10;
      }
    }
    
    // 命运数字兼容性（如果有）
    if (profile1.destinyNumber && profile2.destinyNumber) {
      const destiny1 = profile1.destinyNumber;
      const destiny2 = profile2.destinyNumber;
      
      // 命运数字兼容性分析（简化版）
      if (destiny1 === destiny2) {
        baseScore += 10;
      } else if (destiny1 + destiny2 === 10) {
        baseScore += 15;
      } else if ((destiny1 + destiny2) % 3 === 0) {
        baseScore += 5;
      }
    }
    
    // 确保评分在0-100范围内
    return Math.max(0, Math.min(100, baseScore));
  }
  
  /**
   * 八字推理
   */
  private async inferBazi(model: any, inputData: any): Promise<any> {
    try {
      // 验证输入数据
      if (!inputData.birthDate || !inputData.birthTime) {
        throw new Error('八字解读需要提供出生日期和时间');
      }

      // 加载模型
      const modelPath = `file://${model.modelPath}/model.json`;
      const tfModel = await tf.loadLayersModel(modelPath);

      // 预处理输入数据
      const preprocessedInput = this.preprocessInput(inputData, AiModelType.BAZI);
      const inputTensor = tf.tensor2d([preprocessedInput]);

      // 执行推理
      const prediction = tfModel.predict(inputTensor) as tf.Tensor;
      const resultData = await prediction.data();

      // 后处理结果
      const result = this.postprocessOutput(resultData, AiModelType.BAZI);

      return result;
    } catch (error) {
      logger.error(`八字推理失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return this.fallbackToRuleEngine(AiModelType.BAZI, inputData);
    }
  }
  
  /**
   * 计算八字数据
   */
  private async calculateBazi(inputData: any): Promise<any> {
    try {
      // 解析出生日期和时间
      const { birthDate, birthTime, gender, location } = inputData;
      const birthDateObj = new Date(`${birthDate}T${birthTime || '12:00:00'}`);
      
      // 这里应该使用专业的八字计算库
      // 但为简化示例，我们手动构建基本的八字信息
      
      // 天干地支年月日时
      const heavenlyStemsYear = this.getHeavenlyStem(birthDateObj.getFullYear());
      const earthlyBranchesYear = this.getEarthlyBranch(birthDateObj.getFullYear());
      
      const heavenlyStemsMonth = this.getHeavenlyStem((birthDateObj.getMonth() + 1) + (birthDateObj.getFullYear() % 10) * 2);
      const earthlyBranchesMonth = this.getEarthlyBranch(birthDateObj.getMonth() + 1);
      
      const heavenlyStemsDay = this.getHeavenlyStem(Math.floor(birthDateObj.getTime() / 86400000) % 10);
      const earthlyBranchesDay = this.getEarthlyBranch(Math.floor(birthDateObj.getTime() / 86400000) % 12);
      
      const hourIndex = Math.floor(birthDateObj.getHours() / 2) % 12;
      const heavenlyStemsHour = this.getHeavenlyStem((hourIndex + Math.floor(birthDateObj.getTime() / 86400000)) % 10);
      const earthlyBranchesHour = this.getEarthlyBranch(hourIndex);
      
      // 构建八字数据
      return {
        birthData: {
          date: birthDate,
          time: birthTime,
          gender: gender || '未知',
          location: location || '未知'
        },
        eightCharacters: {
          year: {
            heavenlyStem: heavenlyStemsYear,
            earthlyBranch: earthlyBranchesYear,
            element: this.getElement(heavenlyStemsYear)
          },
          month: {
            heavenlyStem: heavenlyStemsMonth,
            earthlyBranch: earthlyBranchesMonth,
            element: this.getElement(heavenlyStemsMonth)
          },
          day: {
            heavenlyStem: heavenlyStemsDay,
            earthlyBranch: earthlyBranchesDay,
            element: this.getElement(heavenlyStemsDay)
          },
          hour: {
            heavenlyStem: heavenlyStemsHour,
            earthlyBranch: earthlyBranchesHour,
            element: this.getElement(heavenlyStemsHour)
          }
        },
        elementCounts: this.countElements([
          this.getElement(heavenlyStemsYear),
          this.getElement(heavenlyStemsMonth),
          this.getElement(heavenlyStemsDay),
          this.getElement(heavenlyStemsHour),
          this.getBranchElement(earthlyBranchesYear),
          this.getBranchElement(earthlyBranchesMonth),
          this.getBranchElement(earthlyBranchesDay),
          this.getBranchElement(earthlyBranchesHour)
        ])
      };
    } catch (error) {
      logger.error(`计算八字失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }
  
  /**
   * 获取天干
   */
  private getHeavenlyStem(index: number): string {
    const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    return stems[index % 10];
  }
  
  /**
   * 获取地支
   */
  private getEarthlyBranch(index: number): string {
    const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    return branches[index % 12];
  }
  
  /**
   * 获取天干对应的五行
   */
  private getElement(heavenlyStem: string): string {
    const elements: Record<string, string> = {
      '甲': '木', '乙': '木',
      '丙': '火', '丁': '火',
      '戊': '土', '己': '土',
      '庚': '金', '辛': '金',
      '壬': '水', '癸': '水'
    };
    return elements[heavenlyStem] || '未知';
  }
  
  /**
   * 获取地支对应的五行
   */
  private getBranchElement(earthlyBranch: string): string {
    const elements: Record<string, string> = {
      '子': '水', '丑': '土',
      '寅': '木', '卯': '木',
      '辰': '土', '巳': '火',
      '午': '火', '未': '土',
      '申': '金', '酉': '金',
      '戌': '土', '亥': '水'
    };
    return elements[earthlyBranch] || '未知';
  }
  
  /**
   * 统计五行数量
   */
  private countElements(elements: string[]): Record<string, number> {
    const counts: Record<string, number> = {
      '木': 0, '火': 0, '土': 0, '金': 0, '水': 0
    };
    
    elements.forEach(element => {
      if (counts[element] !== undefined) {
        counts[element]++;
      }
    });
    
    return counts;
  }
  
  /**
   * 构建八字AI提示
   */
  private buildBaziPrompt(inputData: any, baziData: any): string {
    const { question, birthDate, birthTime, gender, location } = inputData;
    
    let prompt = `请根据以下八字信息进行命理解读：\n\n`;
    
    prompt += `出生信息：\n`;
    prompt += `- 出生日期：${birthDate}\n`;
    prompt += `- 出生时间：${birthTime || '未知'}\n`;
    prompt += `- 性别：${gender || '未知'}\n`;
    if (location) {
      prompt += `- 出生地点：${location}\n`;
    }
    
    prompt += `\n八字：\n`;
    prompt += `- 年柱：${baziData.eightCharacters.year.heavenlyStem}${baziData.eightCharacters.year.earthlyBranch}（${baziData.eightCharacters.year.element}）\n`;
    prompt += `- 月柱：${baziData.eightCharacters.month.heavenlyStem}${baziData.eightCharacters.month.earthlyBranch}（${baziData.eightCharacters.month.element}）\n`;
    prompt += `- 日柱：${baziData.eightCharacters.day.heavenlyStem}${baziData.eightCharacters.day.earthlyBranch}（${baziData.eightCharacters.day.element}）\n`;
    prompt += `- 时柱：${baziData.eightCharacters.hour.heavenlyStem}${baziData.eightCharacters.hour.earthlyBranch}（${baziData.eightCharacters.hour.element}）\n`;
    
    prompt += `\n五行统计：\n`;
    prompt += `- 木：${baziData.elementCounts['木']}个\n`;
    prompt += `- 火：${baziData.elementCounts['火']}个\n`;
    prompt += `- 土：${baziData.elementCounts['土']}个\n`;
    prompt += `- 金：${baziData.elementCounts['金']}个\n`;
    prompt += `- 水：${baziData.elementCounts['水']}个\n`;
    
    if (question) {
      prompt += `\n用户问题：${question}\n`;
    }
    
    prompt += `\n请提供以下内容：
1. 八字总体分析
2. 五行平衡情况
3. 命局特点
4. 事业发展前景
5. 财运分析
6. 健康状况
7. 人际关系
8. 吉凶建议`;
    
    return prompt;
  }
  
  /**
   * 解析八字AI响应
   */
  private parseBaziAiResponse(aiResponse: string | null, inputData: any, baziData: any): any {
    if (!aiResponse) {
      return this.fallbackToRuleEngine(AiModelType.BAZI, inputData);
    }
    
    try {
      // 尝试将响应按章节分割
      const sections = aiResponse.split(/\d+\.\s+/);
      
      // 构建解读结果
      return {
        birthData: baziData.birthData,
        eightCharacters: baziData.eightCharacters,
        elementCounts: baziData.elementCounts,
        reading: {
          overall: sections[1] || '无法解析总体分析',
          elementBalance: sections[2] || '无法解析五行平衡情况',
          characteristics: sections[3] || '无法解析命局特点',
          career: sections[4] || '无法解析事业发展前景',
          wealth: sections[5] || '无法解析财运分析',
          health: sections[6] || '无法解析健康状况',
          relationships: sections[7] || '无法解析人际关系',
          advice: sections[8] || '无法解析吉凶建议'
        }
      };
    } catch (error) {
      logger.error(`解析八字AI响应失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return this.fallbackToRuleEngine(AiModelType.BAZI, inputData);
    }
  }
  
  /**
   * 星座占星推理
   */
  private async inferStarAstrology(model: any, inputData: any): Promise<any> {
    try {
      // 验证输入数据
      if (!inputData.birthDate) {
        throw new Error('星座占星解读需要提供出生日期');
      }

      // 加载模型
      const modelPath = `file://${model.modelPath}/model.json`;
      const tfModel = await tf.loadLayersModel(modelPath);

      // 预处理输入数据
      const preprocessedInput = this.preprocessInput(inputData, AiModelType.STAR_ASTROLOGY);
      const inputTensor = tf.tensor2d([preprocessedInput]);

      // 执行推理
      const prediction = tfModel.predict(inputTensor) as tf.Tensor;
      const resultData = await prediction.data();

      // 后处理结果
      const result = this.postprocessOutput(resultData, AiModelType.STAR_ASTROLOGY);

      return result;
    } catch (error) {
      logger.error(`星座占星推理失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return this.fallbackToRuleEngine(AiModelType.STAR_ASTROLOGY, inputData);
    }
  }
  
  /**
   * 计算星座和占星数据
   */
  private calculateAstrologyData(inputData: any): any {
    try {
      // 解析出生日期和时间
      const { birthDate, birthTime, location } = inputData;
      const birthDateObj = new Date(`${birthDate}T${birthTime || '12:00:00'}`);
      
      // 计算星座
      const zodiacSign = this.getZodiacSign(birthDateObj);
      
      // 计算上升星座和月亮星座（这需要专业的占星算法，这里简化处理）
      const ascendant = this.getAscendant(birthDateObj, birthTime, location);
      const moonSign = this.getMoonSign(birthDateObj);
      
      // 计算主要行星位置（简化）
      const planets = this.calculatePlanetPositions(birthDateObj);
      
      // 构建占星数据
      return {
        birthInfo: {
          date: birthDate,
          time: birthTime || '未知',
          location: location || '未知'
        },
        signs: {
          sun: zodiacSign,
          moon: moonSign,
          ascendant: ascendant
        },
        planets: planets,
        aspects: this.calculateAspects(planets),
        houses: this.calculateHouses(birthDateObj, birthTime, location)
      };
    } catch (error) {
      logger.error(`计算占星数据失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }
  
  /**
   * 获取星座
   */
  private getZodiacSign(date: Date): string {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '水瓶座';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return '双鱼座';
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '白羊座';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '金牛座';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return '双子座';
    if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return '巨蟹座';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '狮子座';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '处女座';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return '天秤座';
    if ((month === 10 && day >= 24) || (month === 11 && day <= 21)) return '天蝎座';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return '射手座';
    return '摩羯座';
  }
  
  /**
   * 获取上升星座（简化）
   */
  private getAscendant(date: Date, time: string, location: string): string {
    // 实际应用中，上升星座计算需要考虑出生时间和地理位置
    // 这里使用简化的方法，基于出生时间估算
    
    if (!time) return '未知';
    
    const hour = parseInt(time.split(':')[0]);
    
    // 简化的上升星座估算
    const signs = [
      '白羊座', '金牛座', '双子座', '巨蟹座',
      '狮子座', '处女座', '天秤座', '天蝎座',
      '射手座', '摩羯座', '水瓶座', '双鱼座'
    ];
    
    // 简单估算，真实计算需要专业占星算法
    return signs[hour % 12];
  }
  
  /**
   * 获取月亮星座（简化）
   */
  private getMoonSign(date: Date): string {
    // 实际应用中，月亮星座计算需要精确的天文算法
    // 这里使用简化的方法
    
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
    
    const signs = [
      '白羊座', '金牛座', '双子座', '巨蟹座',
      '狮子座', '处女座', '天秤座', '天蝎座',
      '射手座', '摩羯座', '水瓶座', '双鱼座'
    ];
    
    // 月亮大约每2.5天换一个星座，一年12个月，每个星座停留约2.5天
    return signs[Math.floor((dayOfYear % 30) / 2.5) % 12];
  }
  
  /**
   * 计算行星位置（简化）
   */
  private calculatePlanetPositions(date: Date): Record<string, string> {
    // 实际应用中，行星位置计算需要专业的天文算法
    // 这里使用简化的方法
    
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
    const year = date.getFullYear();
    
    const signs = [
      '白羊座', '金牛座', '双子座', '巨蟹座',
      '狮子座', '处女座', '天秤座', '天蝎座',
      '射手座', '摩羯座', '水瓶座', '双鱼座'
    ];
    
    // 简化计算，仅作示例
    return {
      'Mercury': signs[(dayOfYear * 4 + year) % 12],
      'Venus': signs[(dayOfYear * 2 + year) % 12],
      'Mars': signs[(dayOfYear + year * 2) % 12],
      'Jupiter': signs[(Math.floor(year / 12) + dayOfYear) % 12],
      'Saturn': signs[(Math.floor(year / 29) + dayOfYear) % 12],
      'Uranus': signs[(Math.floor(year / 84) + dayOfYear) % 12],
      'Neptune': signs[(Math.floor(year / 165) + dayOfYear) % 12],
      'Pluto': signs[(Math.floor(year / 248) + dayOfYear) % 12]
    };
  }
  
  /**
   * 计算行星相位（简化）
   */
  private calculateAspects(planets: Record<string, string>): any[] {
    // 实际应用中，相位计算需要精确的角度计算
    // 这里返回示例数据
    
    return [
      { planets: ['Sun', 'Moon'], aspect: '合相', influence: '积极', description: '能量和谐融合' },
      { planets: ['Venus', 'Mars'], aspect: '六分相', influence: '中性', description: '创造性张力' },
      { planets: ['Jupiter', 'Saturn'], aspect: '对分相', influence: '挑战', description: '需要平衡' }
    ];
  }
  
  /**
   * 计算宫位（简化）
   */
  private calculateHouses(date: Date, time: string, location: string): Record<number, string> {
    // 实际应用中，宫位计算需要专业的占星算法和出生地经纬度
    // 这里返回示例数据
    
    const houses: Record<number, string> = {};
    const signs = [
      '白羊座', '金牛座', '双子座', '巨蟹座',
      '狮子座', '处女座', '天秤座', '天蝎座',
      '射手座', '摩羯座', '水瓶座', '双鱼座'
    ];
    
    // 简单分配，真实占星需要专业计算
    for (let i = 1; i <= 12; i++) {
      houses[i] = signs[(i - 1) % 12];
    }
    
    return houses;
  }
  
  /**
   * 构建占星AI提示
   */
  private buildAstrologyPrompt(inputData: any, astrologyData: any): string {
    const { question, birthDate, birthTime } = inputData;
    
    let prompt = `请根据以下占星数据进行解读：\n\n`;
    
    prompt += `出生信息：\n`;
    prompt += `- 出生日期：${birthDate}\n`;
    if (birthTime) {
      prompt += `- 出生时间：${birthTime}\n`;
    }
    
    prompt += `\n星座信息：\n`;
    prompt += `- 太阳星座：${astrologyData.signs.sun}\n`;
    prompt += `- 月亮星座：${astrologyData.signs.moon}\n`;
    prompt += `- 上升星座：${astrologyData.signs.ascendant}\n`;
    
    prompt += `\n行星位置：\n`;
    Object.entries(astrologyData.planets).forEach(([planet, sign]) => {
      prompt += `- ${planet}：${sign}\n`;
    });
    
    if (question) {
      prompt += `\n用户问题：${question}\n`;
    }
    
    prompt += `\n请提供以下内容：
1. 太阳星座分析
2. 月亮星座分析
3. 上升星座分析
4. 主要行星影响
5. 性格特点综合分析
6. 事业方向建议
7. 人际关系分析
8. 未来发展趋势`;
    
    return prompt;
  }
  
  /**
   * 解析占星AI响应
   */
  private parseAstrologyAiResponse(aiResponse: string | null, inputData: any, astrologyData: any): any {
    if (!aiResponse) {
      return this.fallbackToRuleEngine(AiModelType.STAR_ASTROLOGY, inputData);
    }
    
    try {
      // 尝试将响应按章节分割
      const sections = aiResponse.split(/\d+\.\s+/);
      
      // 构建解读结果
      return {
        birthInfo: astrologyData.birthInfo,
        signs: astrologyData.signs,
        planets: astrologyData.planets,
        reading: {
          sunSign: sections[1] || '无法解析太阳星座分析',
          moonSign: sections[2] || '无法解析月亮星座分析',
          ascendant: sections[3] || '无法解析上升星座分析',
          planets: sections[4] || '无法解析主要行星影响',
          personality: sections[5] || '无法解析性格特点综合分析',
          career: sections[6] || '无法解析事业方向建议',
          relationships: sections[7] || '无法解析人际关系分析',
          future: sections[8] || '无法解析未来发展趋势'
        }
      };
    } catch (error) {
      logger.error(`解析占星AI响应失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return this.fallbackToRuleEngine(AiModelType.STAR_ASTROLOGY, inputData);
    }
  }
  
  /**
   * 综合命理推理
   */
  private async inferHolistic(model: any, inputData: any): Promise<any> {
    try {
      // 验证输入数据
      if (!inputData.birthDate) {
        throw new Error('综合命理解读需要提供出生日期');
      }

      // 加载模型
      const modelPath = `file://${model.modelPath}/model.json`;
      const tfModel = await tf.loadLayersModel(modelPath);

      // 预处理输入数据
      const preprocessedInput = this.preprocessInput(inputData, AiModelType.HOLISTIC);
      const inputTensor = tf.tensor2d([preprocessedInput]);

      // 执行推理
      const prediction = tfModel.predict(inputTensor) as tf.Tensor;
      const resultData = await prediction.data();

      // 后处理结果
      const result = this.postprocessOutput(resultData, AiModelType.HOLISTIC);

      return result;
    } catch (error) {
      logger.error(`综合命理推理失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return this.fallbackToRuleEngine(AiModelType.HOLISTIC, inputData);
    }
  }
  
  /**
   * 构建综合命理AI提示
   */
  private buildHolisticPrompt(inputData: any, holisticData: Record<string, any>): string {
    const { question, birthDate, birthTime, name } = inputData;
    
    let prompt = `请根据以下综合命理数据进行全面解读：\n\n`;
    
    prompt += `个人信息：\n`;
    prompt += `- 姓名：${name || '未提供'}\n`;
    prompt += `- 出生日期：${birthDate}\n`;
    if (birthTime) {
      prompt += `- 出生时间：${birthTime}\n`;
    }
    
    prompt += `\n数字学数据：\n`;
    prompt += `- 生命数字：${holisticData.numerology.lifePathNumber}\n`;
    if (holisticData.numerology.destinyNumber) {
      prompt += `- 命运数字：${holisticData.numerology.destinyNumber}\n`;
    }
    
    prompt += `\n星座数据：\n`;
    prompt += `- 太阳星座：${holisticData.astrology.zodiacSign}\n`;
    prompt += `- 月亮星座：${holisticData.astrology.moonSign}\n`;
    
    // 如果有八字数据，添加八字信息
    if (holisticData.bazi) {
      prompt += `\n八字数据：\n`;
      prompt += `- 年柱：${holisticData.bazi.eightCharacters.year.heavenlyStem}${holisticData.bazi.eightCharacters.year.earthlyBranch}（${holisticData.bazi.eightCharacters.year.element}）\n`;
      prompt += `- 月柱：${holisticData.bazi.eightCharacters.month.heavenlyStem}${holisticData.bazi.eightCharacters.month.earthlyBranch}（${holisticData.bazi.eightCharacters.month.element}）\n`;
      prompt += `- 日柱：${holisticData.bazi.eightCharacters.day.heavenlyStem}${holisticData.bazi.eightCharacters.day.earthlyBranch}（${holisticData.bazi.eightCharacters.day.element}）\n`;
      prompt += `- 时柱：${holisticData.bazi.eightCharacters.hour.heavenlyStem}${holisticData.bazi.eightCharacters.hour.earthlyBranch}（${holisticData.bazi.eightCharacters.hour.element}）\n`;
      
      prompt += `\n五行统计：\n`;
      prompt += `- 木：${holisticData.bazi.elementCounts['木']}个\n`;
      prompt += `- 火：${holisticData.bazi.elementCounts['火']}个\n`;
      prompt += `- 土：${holisticData.bazi.elementCounts['土']}个\n`;
      prompt += `- 金：${holisticData.bazi.elementCounts['金']}个\n`;
      prompt += `- 水：${holisticData.bazi.elementCounts['水']}个\n`;
    }
    
    if (question) {
      prompt += `\n用户问题：${question}\n`;
    }
    
    prompt += `\n请综合以上所有命理数据，提供以下内容：
1. 命运总体分析
2. 性格特质解读
3. 天赋才能分析
4. 事业发展建议
5. 财富机遇分析
6. 人际关系解读
7. 健康状况预测
8. 人生关键时期
9. 生活改善建议`;
    
    return prompt;
  }
  
  /**
   * 解析综合命理AI响应
   */
  private parseHolisticAiResponse(aiResponse: string | null, inputData: any, holisticData: Record<string, any>): any {
    if (!aiResponse) {
      return this.fallbackToRuleEngine(AiModelType.HOLISTIC, inputData);
    }
    
    try {
      // 尝试将响应按章节分割
      const sections = aiResponse.split(/\d+\.\s+/);
      
      // 构建解读结果
      return {
        personalInfo: {
          name: inputData.name || '未提供',
          birthDate: inputData.birthDate,
          birthTime: inputData.birthTime || '未提供'
        },
        numerologyData: holisticData.numerology,
        astrologyData: holisticData.astrology,
        baziData: holisticData.bazi || null,
        reading: {
          destiny: sections[1] || '无法解析命运总体分析',
          personality: sections[2] || '无法解析性格特质解读',
          talents: sections[3] || '无法解析天赋才能分析',
          career: sections[4] || '无法解析事业发展建议',
          wealth: sections[5] || '无法解析财富机遇分析',
          relationships: sections[6] || '无法解析人际关系解读',
          health: sections[7] || '无法解析健康状况预测',
          keyPeriods: sections[8] || '无法解析人生关键时期',
          advice: sections[9] || '无法解析生活改善建议'
        }
      };
    } catch (error) {
      logger.error(`解析综合命理AI响应失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return this.fallbackToRuleEngine(AiModelType.HOLISTIC, inputData);
    }
  }
  
  /**
   * 综合命理规则引擎
   */
  private holisticRuleEngine(inputData: any): any {
    try {
      // 基础信息
      const { birthDate, name } = inputData;
      
      // 计算数字学信息
      const lifePathNumber = this.calculateLifePathNumber(birthDate);
      let destinyNumber;
      if (name) {
        destinyNumber = this.calculateDestinyNumber(name);
      }
      
      // 计算星座
      const zodiacSign = this.getZodiacSign(new Date(birthDate));
      
      // 构建基础解读
      const basicReadings = {
        destiny: `基于生命数字${lifePathNumber}和${zodiacSign}星座的特质，您的人生道路...`,
        personality: `您的性格既有${zodiacSign}的${this.getZodiacTraits(zodiacSign)}特质，又具备生命数字${lifePathNumber}的${this.getNumerologyTraits(lifePathNumber)}特点。`,
        talents: `您天生具有${this.getZodiacStrengths(zodiacSign)}的才能，同时生命数字${lifePathNumber}赋予您${this.getNumerologyStrengths(lifePathNumber)}的优势。`,
        career: `适合您的职业方向包括${this.getCareerSuggestions(zodiacSign, lifePathNumber)}。`,
        wealth: `在财富方面，您可能${this.getWealthTendency(zodiacSign, lifePathNumber)}。`,
        relationships: `在人际关系中，您倾向于${this.getRelationshipStyle(zodiacSign, lifePathNumber)}。`,
        health: `健康方面需要注意${this.getHealthConcerns(zodiacSign, lifePathNumber)}。`,
        keyPeriods: `您的人生关键时期可能在${this.getKeyPeriods(lifePathNumber)}。`,
        advice: `建议您${this.getLifeAdvice(zodiacSign, lifePathNumber)}。`
      };
      
      return {
        personalInfo: {
          name: name || '未提供',
          birthDate: birthDate
        },
        numerologyData: {
          lifePathNumber,
          destinyNumber
        },
        astrologyData: {
          zodiacSign
        },
        reading: basicReadings
      };
    } catch (error) {
      logger.error(`综合命理规则引擎失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        personalInfo: {
          name: inputData.name || '未提供',
          birthDate: inputData.birthDate || '未提供'
        },
        reading: {
          destiny: '无法生成综合命理解读',
          advice: '请提供更完整的个人信息以获取准确解读'
        }
      };
    }
  }
  
  // 辅助方法
  
  private getZodiacTraits(zodiacSign: string): string {
    const traits: Record<string, string> = {
      '白羊座': '勇敢、冲动、热情',
      '金牛座': '稳重、实际、固执',
      '双子座': '好奇、灵活、善变',
      '巨蟹座': '敏感、关爱、情绪化',
      '狮子座': '自信、慷慨、戏剧化',
      '处女座': '分析、细致、挑剔',
      '天秤座': '和谐、社交、优雅',
      '天蝎座': '深刻、神秘、强烈',
      '射手座': '冒险、乐观、直率',
      '摩羯座': '责任、自律、严肃',
      '水瓶座': '创新、独立、叛逆',
      '双鱼座': '富有想象、敏感、梦幻'
    };
    return traits[zodiacSign] || '多样化';
  }
  
  private getNumerologyTraits(lifePathNumber: number): string {
    const traits: Record<number, string> = {
      1: '独立、创新、领导力',
      2: '和谐、合作、敏感',
      3: '创造、表达、社交',
      4: '实际、稳定、可靠',
      5: '冒险、自由、适应性',
      6: '责任、关爱、和谐',
      7: '分析、精神、智慧',
      8: '权力、成就、物质',
      9: '人道、理想、普世'
    };
    return traits[lifePathNumber] || '复杂';
  }
  
  private getZodiacStrengths(zodiacSign: string): string {
    const strengths: Record<string, string> = {
      '白羊座': '领导能力、勇气',
      '金牛座': '实践能力、耐心',
      '双子座': '沟通能力、适应性',
      '巨蟹座': '直觉能力、关爱能力',
      '狮子座': '组织能力、创造力',
      '处女座': '分析能力、实用能力',
      '天秤座': '外交能力、审美能力',
      '天蝎座': '专注能力、洞察力',
      '射手座': '哲学思维、乐观态度',
      '摩羯座': '管理能力、毅力',
      '水瓶座': '创新思维、人道关怀',
      '双鱼座': '艺术能力、同情心'
    };
    return strengths[zodiacSign] || '多方面';
  }
  
  private getNumerologyStrengths(lifePathNumber: number): string {
    const strengths: Record<number, string> = {
      1: '开创性思维、自立能力',
      2: '协调能力、外交才能',
      3: '艺术表达、沟通技巧',
      4: '组织能力、执行力',
      5: '适应能力、灵活性',
      6: '教导能力、关爱能力',
      7: '研究能力、分析技巧',
      8: '管理能力、财务技巧',
      9: '人道关怀、普世价值'
    };
    return strengths[lifePathNumber] || '多样化';
  }
  
  private getCareerSuggestions(zodiacSign: string, lifePathNumber: number): string {
    // 根据星座和生命数字给出职业建议
    const zodiacCareers: Record<string, string> = {
      '白羊座': '管理、销售、体育',
      '金牛座': '金融、艺术、农业',
      '双子座': '媒体、教育、销售',
      '巨蟹座': '护理、烹饪、教育',
      '狮子座': '表演、管理、政治',
      '处女座': '研究、医疗、编辑',
      '天秤座': '法律、外交、设计',
      '天蝎座': '研究、心理学、调查',
      '射手座': '旅游、哲学、教育',
      '摩羯座': '管理、金融、建筑',
      '水瓶座': '科技、人道工作、创新',
      '双鱼座': '艺术、医疗、心理学'
    };
    
    const numerologyCareers: Record<number, string> = {
      1: '企业家、发明家、领导者',
      2: '协调员、外交官、顾问',
      3: '艺术家、作家、演讲者',
      4: '会计师、建筑师、工程师',
      5: '记者、营销人员、旅行者',
      6: '教师、辅导员、设计师',
      7: '研究员、科学家、哲学家',
      8: '经理、金融顾问、投资者',
      9: '慈善工作、社会工作、治疗师'
    };
    
    return `${zodiacCareers[zodiacSign] || '多种行业'}以及${numerologyCareers[lifePathNumber] || '多样职位'}`;
  }
  
  private getWealthTendency(zodiacSign: string, lifePathNumber: number): string {
    // 简单的财富倾向描述
    const wealthMap: Record<string, Record<number, string>> = {
      '白羊座': {
        1: '通过个人创业获得财富',
        2: '通过合作伙伴关系积累财富',
        3: '通过创意表达创造财富',
        4: '通过稳健投资获得财富',
        5: '通过多元化投资获得财富',
        6: '通过服务他人获得财富',
        7: '通过专业知识获得财富',
        8: '通过管理和领导获得显著财富',
        9: '通过国际化事业获得财富'
      },
      '默认': {
        1: '倾向于开创自己的财富道路',
        2: '通过合作获得财务稳定',
        3: '通过创意实现财务成功',
        4: '通过稳健储蓄和投资积累财富',
        5: '通过多元化收入来源获得财富',
        6: '通过关爱和服务获得回报',
        7: '通过专业知识和研究获得财富',
        8: '有强烈的财富积累能力',
        9: '在帮助他人的过程中获得财务回报'
      }
    };
    
    return wealthMap[zodiacSign]?.[lifePathNumber] || wealthMap['默认'][lifePathNumber] || '有多种获取财富的可能性';
  }
  
  private getRelationshipStyle(zodiacSign: string, lifePathNumber: number): string {
    // 简单的关系风格描述
    const relationshipStyles: Record<string, string> = {
      '白羊座': '直接、热情但可能缺乏耐心',
      '金牛座': '忠诚、稳定但可能固执',
      '双子座': '善于交流但可能变化无常',
      '巨蟹座': '关爱、保护但可能情绪化',
      '狮子座': '慷慨、热情但可能自我中心',
      '处女座': '细心、体贴但可能过于批判',
      '天秤座': '和谐、公平但可能优柔寡断',
      '天蝎座': '忠诚、深刻但可能控制欲强',
      '射手座': '乐观、自由但可能难以承诺',
      '摩羯座': '负责任、可靠但可能情感保守',
      '水瓶座': '友好、独立但可能情感疏离',
      '双鱼座': '浪漫、富有同情心但可能逃避现实'
    };
    
    return relationshipStyles[zodiacSign] || '展现多样化的关系特质';
  }
  
  private getHealthConcerns(zodiacSign: string, lifePathNumber: number): string {
    // 简单的健康关注点
    const healthConcerns: Record<string, string> = {
      '白羊座': '头部、过度劳累',
      '金牛座': '喉咙、颈部',
      '双子座': '肺部、神经系统',
      '巨蟹座': '胃部、情绪压力',
      '狮子座': '心脏、背部',
      '处女座': '消化系统、过度焦虑',
      '天秤座': '肾脏、腰部',
      '天蝎座': '生殖系统、压力',
      '射手座': '肝脏、大腿',
      '摩羯座': '骨骼、关节',
      '水瓶座': '循环系统、脚踝',
      '双鱼座': '免疫系统、足部'
    };
    
    return healthConcerns[zodiacSign] || '保持整体健康平衡';
  }
  
  private getKeyPeriods(lifePathNumber: number): string {
    // 根据生命数字预测关键时期
    const keyPeriods: Record<number, string> = {
      1: '28-30岁、37-39岁、55-57岁',
      2: '25-27岁、34-36岁、52-54岁',
      3: '24-26岁、33-35岁、51-53岁',
      4: '32-34岁、41-43岁、59-61岁',
      5: '23-25岁、32-34岁、50-52岁',
      6: '26-28岁、35-37岁、53-55岁',
      7: '31-33岁、40-42岁、58-60岁',
      8: '29-31岁、38-40岁、56-58岁',
      9: '27-29岁、36-38岁、54-56岁'
    };
    
    return keyPeriods[lifePathNumber] || '生命中的每个10年期都有特殊意义';
  }
  
  private getLifeAdvice(zodiacSign: string, lifePathNumber: number): string {
    // 简单的生活建议
    const advice: Record<number, string> = {
      1: '发挥您的领导能力，同时学会倾听他人',
      2: '相信您的直觉，培养健康的人际关系',
      3: '充分利用您的创造力，学会专注',
      4: '在坚持目标的同时保持灵活性',
      5: '在追求自由的同时建立稳定的基础',
      6: '在照顾他人的同时不要忘记自我关爱',
      7: '平衡精神探索与现实生活',
      8: '将物质成功与精神价值相结合',
      9: '在帮助他人的同时设定健康的界限'
    };
    
    return advice[lifePathNumber] || '保持平衡，发挥您的天赋';
  }
  
  /**
   * 回退到规则引擎
   * 当AI模型不可用或失败时，使用传统规则引擎生成解读
   */
  private fallbackToRuleEngine(modelType: AiModelType, inputData: any): any {
    logger.info(`回退到${modelType}规则引擎`);
    
    switch (modelType) {
      case AiModelType.NUMEROLOGY:
        return this.numerologyRuleEngine(inputData);
      case AiModelType.TAROT:
        return this.tarotRuleEngine(inputData);
      case AiModelType.ICHING:
        return this.ichingRuleEngine(inputData);
      case AiModelType.COMPATIBILITY:
        return this.compatibilityRuleEngine(inputData);
      case AiModelType.BAZI:
        return this.baziRuleEngine(inputData);
      case AiModelType.STAR_ASTROLOGY:
        return this.starAstrologyRuleEngine(inputData);
      case AiModelType.HOLISTIC:
        return this.holisticRuleEngine(inputData);
      default:
        throw new Error(`不支持的模型类型: ${modelType}`);
    }
  }
  
  /**
   * 数字学规则引擎
   */
  private numerologyRuleEngine(inputData: any): any {
    // 简单的数字学解读规则
    const lifePathNumber = this.calculateLifePathNumber(inputData.birthDate);
    let destinyNumber;
    
    if (inputData.name) {
      destinyNumber = this.calculateDestinyNumber(inputData.name);
    }
    
    const interpretations: Record<string, string> = {
      lifePath: this.getLifePathInterpretation(lifePathNumber),
      destiny: destinyNumber ? this.getDestinyInterpretation(destinyNumber) : ''
    };
    
    return {
      lifePathNumber,
      destinyNumber,
      interpretations
    };
  }
  
  /**
   * 计算生命数字
   */
  private calculateLifePathNumber(birthDate: string): number {
    // 简化的生命数字计算
    try {
      const dateStr = birthDate.replace(/-/g, '');
      let sum = 0;
      
      for (let i = 0; i < dateStr.length; i++) {
        sum += parseInt(dateStr[i]);
      }
      
      // 降低到个位数
      while (sum > 9) {
        let tempSum = 0;
        while (sum > 0) {
          tempSum += sum % 10;
          sum = Math.floor(sum / 10);
        }
        sum = tempSum;
      }
      
      return sum;
    } catch (error) {
      logger.error(`计算生命数字失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return 0;
    }
  }
  
  /**
   * 计算命运数字
   */
  private calculateDestinyNumber(name: string): number {
    // 简化的命运数字计算
    try {
      const letterValues: Record<string, number> = {
        'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
        'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
        's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8
      };
      
      const nameStr = name.toLowerCase();
      let sum = 0;
      
      for (let i = 0; i < nameStr.length; i++) {
        const letter = nameStr[i];
        if (letterValues[letter]) {
          sum += letterValues[letter];
        }
      }
      
      // 降低到个位数
      while (sum > 9) {
        let tempSum = 0;
        while (sum > 0) {
          tempSum += sum % 10;
          sum = Math.floor(sum / 10);
        }
        sum = tempSum;
      }
      
      return sum;
    } catch (error) {
      logger.error(`计算命运数字失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return 0;
    }
  }
  
  /**
   * 获取生命数字解释
   */
  private getLifePathInterpretation(number: number): string {
    const interpretations: Record<number, string> = {
      1: '生命数字1的人是天生的领导者，独立、有创造力、决断力强，是开创者和先驱者。他们具有强烈的进取心和决心，追求卓越，渴望成功。',
      2: '生命数字2的人充满合作精神，善于协调，天生的调解者，有耐心、敏感且具有外交手腕。他们重视关系，善于倾听，能够理解不同的观点。',
      3: '生命数字3的人充满创造力、表现力和乐观精神，是天生的艺术家和沟通者。他们热爱生活，富有想象力，能够用语言和艺术感染他人。',
      4: '生命数字4的人实际、可靠、勤奋且有条理，是坚实的建设者。他们重视稳定性和安全感，具有强烈的责任感，做事一丝不苟。',
      5: '生命数字5的人追求自由、变化和探险，充满活力和适应性。他们渴望体验多样化的生活，讨厌束缚，喜欢冒险和尝试新事物。',
      6: '生命数字6的人富有责任感、关爱他人、追求和谐，是天生的照顾者。他们重视家庭和社区，愿意为他人提供帮助和支持。',
      7: '生命数字7的人深思熟虑、内省、追求智慧和精神成长。他们喜欢独处，热衷于分析和研究，寻求更深层次的真理和理解。',
      8: '生命数字8的人野心勃勃、权威、重视物质成功和财富积累。他们具有商业头脑，擅长管理和领导，追求权力和成就。',
      9: '生命数字9的人富有同情心、慷慨、理想主义，关注人道主义事业。他们具有广阔的视野，愿意为更大的善付出努力，追求精神上的满足。',
      0: '无法计算生命数字，请检查输入的出生日期是否正确。'
    };
    
    return interpretations[number] || '未知的生命数字。';
  }
  
  /**
   * 获取命运数字解释
   */
  private getDestinyInterpretation(number: number): string {
    const interpretations: Record<number, string> = {
      1: '命运数字1的人注定要开创新道路，成为领导者和先驱。他们通过独立行动和创新思维来实现自我价值，人生旅程中将不断挑战自我，追求卓越。',
      2: '命运数字2的人注定要在人际关系和合作中找到平衡。他们通过外交和调解来促进和谐，人生旅程中将学习耐心和理解他人的艺术。',
      3: '命运数字3的人注定要通过创造性表达来启发他人。他们的使命是传播欢乐和乐观，人生旅程中将不断发现自己的艺术才能和表达能力。',
      4: '命运数字4的人注定要建立坚实的基础和结构。他们的使命是通过勤奋和务实的努力创造稳定，人生旅程中将学习秩序和纪律的价值。',
      5: '命运数字5的人注定要经历变化和冒险。他们的使命是追求自由和多样性的体验，人生旅程中将不断适应新环境，拓展自己的视野。',
      6: '命运数字6的人注定要成为照顾者和和谐的创造者。他们的使命是服务他人和创造美好的环境，人生旅程中将学习平衡个人需求和责任。',
      7: '命运数字7的人注定要追求知识和智慧。他们的使命是深入探索生活的奥秘，人生旅程中将不断进行自我反思和精神成长。',
      8: '命运数字8的人注定要在物质世界中实现成功和权力。他们的使命是掌握资源和创造丰富，人生旅程中将学习如何负责任地运用权力。',
      9: '命运数字9的人注定要为更大的善而工作。他们的使命是通过慷慨和同情心来服务人类，人生旅程中将学习放弃个人利益，关注集体福祉。',
      0: '无法计算命运数字，请检查输入的姓名是否正确。'
    };
    
    return interpretations[number] || '未知的命运数字。';
  }
  
  /**
   * 根据生命数字和相似案例生成解释
   */
  private generateLifePathInterpretation(lifePathNumber: number, similarCases: any[]): string {
    // 基础解释
    const baseInterpretation = this.getLifePathInterpretation(lifePathNumber);
    
    // 如果没有相似案例，直接返回基础解释
    if (!similarCases || similarCases.length === 0) {
      return baseInterpretation;
    }
    
    // 从相似案例中获取更丰富的解释
    let additionalInsights = '';
    similarCases.forEach((data: any) => {
      if (data.output && data.output.interpretations && data.output.interpretations.lifePath) {
        const interpretation = data.output.interpretations.lifePath;
        // 提取一部分内容作为补充
        const sentences = interpretation.split('。');
        if (sentences.length > 1) {
          additionalInsights += sentences[Math.floor(Math.random() * sentences.length)] + '。';
        }
      }
    });
    
    return baseInterpretation + (additionalInsights ? '\n\n' + additionalInsights : '');
  }
  
  /**
   * 根据命运数字和相似案例生成解释
   */
  private generateDestinyInterpretation(destinyNumber: number, similarCases: any[]): string {
    // 基础解释
    const baseInterpretation = this.getDestinyInterpretation(destinyNumber);
    
    // 如果没有相似案例，直接返回基础解释
    if (!similarCases || similarCases.length === 0) {
      return baseInterpretation;
    }
    
    // 从相似案例中获取更丰富的解释
    let additionalInsights = '';
    similarCases.forEach((data: any) => {
      if (data.output && data.output.interpretations && data.output.interpretations.destiny) {
        const interpretation = data.output.interpretations.destiny;
        // 提取一部分内容作为补充
        const sentences = interpretation.split('。');
        if (sentences.length > 1) {
          additionalInsights += sentences[Math.floor(Math.random() * sentences.length)] + '。';
        }
      }
    });
    
    return baseInterpretation + (additionalInsights ? '\n\n' + additionalInsights : '');
  }
  
  /**
   * 塔罗牌规则引擎
   */
  private tarotRuleEngine(inputData: any): any {
    try {
      const { question, spread, cards } = inputData;
      
      if (!cards || !Array.isArray(cards) || cards.length === 0) {
        throw new Error('塔罗牌解读需要提供卡牌');
      }
      
      // 加载塔罗牌数据
      const tarotData = require(path.join(process.cwd(), 'data/tarot/tarot_card_meanings.json'));
      
      // 生成卡牌解读
      const interpretations: Record<string, string> = {};
      cards.forEach((card: any, i: number) => {
        const position = card.position || `position_${i + 1}`;
        const cardName = card.name;
        const isReversed = card.reversed || false;
        
        // 获取卡牌含义
        let meaning = '未知卡牌';
        if (tarotData.major[cardName]) {
          meaning = isReversed ? tarotData.major[cardName].reversed : tarotData.major[cardName].upright;
        }
        
        interpretations[position] = `${cardName} (${isReversed ? '逆位' : '正位'}): ${meaning}`;
      });
      
      // 生成整体解读
      let overallReading = `This is a rule-based tarot reading.`;
      
      // 生成建议
      let advice = `Consider the card meanings in the context of your question.`;

      return {
        interpretations,
        overallReading,
        advice
      };
    } catch (error) {
      logger.error(`塔罗牌规则引擎失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        interpretations: {},
        overallReading: '无法生成塔罗牌解读',
        advice: '请检查输入数据并重试'
      };
    }
  }

  private ichingRuleEngine(inputData: any): any {
    // Simplified I-Ching rule engine
    return {
      reading: "This is a rule-based I-Ching reading.",
      changing: "Consider the changing lines.",
      advice: "Act according to the wisdom of the I-Ching."
    };
  }

  private compatibilityRuleEngine(inputData: any): any {
    // Simplified compatibility rule engine
    return {
      compatibility: 50,
      strengths: "You have some strengths.",
      challenges: "You have some challenges.",
      advice: "Work on your communication."
    };
  }

  private baziRuleEngine(inputData: any): any {
    // Simplified Bazi rule engine
    return {
      chart: "This is a rule-based Bazi chart.",
      elements: "Your elements are balanced.",
      reading: "Your Bazi reading is positive.",
      insights: "You have many insights."
    };
  }

  private starAstrologyRuleEngine(inputData: any): any {
    // Simplified star astrology rule engine
    return {
      chart: "This is a rule-based astrology chart.",
      houses: "Your houses are well-aligned.",
      aspects: "Your aspects are favorable.",
      reading: "Your astrology reading is positive."
    };
  }

  private logInferenceData(modelType: AiModelType, inputData: any, result: any) {
    // In a real application, you would log this data to a database or a logging service
    // for monitoring, analysis, and future model retraining.
    logger.info(`Inference log for ${modelType}:`, { input: inputData, output: result });
  }

  private preprocessInput(inputData: any, modelType: AiModelType): number[] {
    const features: number[] = [];
    // This logic should be consistent with extractFeatures in modelTraining.service.ts
    switch (modelType) {
      case AiModelType.NUMEROLOGY:
        features.push(inputData.lifePathNumber || 0);
        features.push(inputData.expressionNumber || 0);
        features.push(inputData.soulUrgeNumber || 0);
        break;
      case AiModelType.TAROT:
        if (Array.isArray(inputData.cards)) {
          inputData.cards.forEach((card: any) => {
            features.push(card.id || 0);
            features.push(card.isReversed ? 1 : 0);
          });
        }
        break;
      default:
        for (const key in inputData) {
          if (typeof inputData[key] === 'number') {
            features.push(inputData[key]);
          } else if (typeof inputData[key] === 'string') {
            features.push(...this.tokenizeString(inputData[key]));
          }
        }
        break;
    }
    
    // Padding and Normalization should be applied here as in the training service
    // For simplicity, this example assumes a fixed length and simple normalization
    const maxFeatureLength = 50; // This should be consistent with training
    const paddedFeatures = this.padData([features], maxFeatureLength)[0];
    const normalizedFeatures = this.normalizeData([paddedFeatures])[0];

    return normalizedFeatures;
  }

  private postprocessOutput(outputData: any, modelType: AiModelType): any {
    // This logic should be able to convert raw model output (likely probabilities)
    // into a meaningful result.
    switch (modelType) {
      case AiModelType.NUMEROLOGY:
        return {
          interpretation: `Based on the model's prediction, your numerology reading is...`,
          prediction: outputData
        };
      case AiModelType.TAROT:
        return {
          overallReading: `The cards suggest...`,
          advice: `You should consider...`,
          prediction: outputData
        };
      default:
        return {
          prediction: outputData,
          interpretation: "This is a sample interpretation based on the model output."
        };
    }
  }

  // Helper methods for preprocessing, should be identical to those in modelTraining.service.ts
  private tokenizeString(str: string, maxLength: number = 10): number[] {
    const tokens = str.split(' ').map(word => {
      let hash = 0;
      for (let i = 0; i < word.length; i++) {
        hash = (hash << 5) - hash + word.charCodeAt(i);
        hash |= 0;
      }
      return hash;
    });
    return tokens.slice(0, maxLength).concat(Array(Math.max(0, maxLength - tokens.length)).fill(0));
  }

  private padData(data: number[][], maxLength: number): number[][] {
    return data.map(row => {
      const paddedRow = row.slice(0, maxLength);
      while (paddedRow.length < maxLength) {
        paddedRow.push(0);
      }
      return paddedRow;
    });
  }

  private normalizeData(data: number[][]): number[][] {
    if (data.length === 0) return [];

    const transposed = data[0].map((_, colIndex) => data.map(row => row[colIndex]));
    const maxValues = transposed.map(col => Math.max(...col.map(Math.abs)));

    return data.map(row => 
      row.map((value, colIndex) => 
        maxValues[colIndex] === 0 ? 0 : value / maxValues[colIndex]
      )
    );
  }
}

export default new AiInferenceService();

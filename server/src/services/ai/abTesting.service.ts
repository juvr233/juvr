import { logger } from '../../config/logger';

/**
 * TestVariant 定义了一个测试变体
 */
interface TestVariant {
  id: string;        // 变体ID
  weight: number;    // 变体权重，范围0-1
  description?: string;  // 变体描述
}

/**
 * TestResult 定义了一个测试结果
 */
interface TestResult {
  variantId: string;  // 变体ID
  userId: string;     // 用户ID
  testName: string;   // 测试名称
  success: boolean;   // 成功标志
  metrics?: Record<string, number>; // 可选的度量数据
  createdAt: Date;    // 创建时间
}

/**
 * A/B测试服务，用于管理和运行AI模型的A/B测试
 */
export class ABTestingService {
  private testConfigurations: Map<string, TestVariant[]> = new Map();
  private results: TestResult[] = [];
  
  /**
   * 创建A/B测试服务实例
   */
  constructor() {
    // 初始化测试配置
    this.setupTests();
  }
  
  /**
   * 设置预定义的测试配置
   */
  private setupTests() {
    // 为塔罗牌推理设置A/B测试
    this.testConfigurations.set('tarot_inference', [
      { id: 'model_v1', weight: 0.3, description: '基础模型' },
      { id: 'model_v2', weight: 0.7, description: '改进的模型，包含更多上下文处理' }
    ]);
    
    // 为易经推理设置A/B测试
    this.testConfigurations.set('iching_inference', [
      { id: 'model_standard', weight: 0.5, description: '标准易经解读模型' },
      { id: 'model_enhanced', weight: 0.5, description: '增强版易经解读模型' }
    ]);
    
    // 为八字推理设置A/B测试
    this.testConfigurations.set('bazi_inference', [
      { id: 'rule_based', weight: 0.3, description: '基于规则的八字分析' },
      { id: 'hybrid_model', weight: 0.7, description: '规则与AI混合的八字分析' }
    ]);
    
    // 为星座占星推理设置A/B测试
    this.testConfigurations.set('star_astrology_inference', [
      { id: 'basic_model', weight: 0.4, description: '基础星座分析模型' },
      { id: 'advanced_model', weight: 0.6, description: '高级星座分析模型' }
    ]);
    
    // 为整体命理推理设置A/B测试
    this.testConfigurations.set('holistic_inference', [
      { id: 'sequential_model', weight: 0.5, description: '顺序分析多种命理方法' },
      { id: 'integrated_model', weight: 0.5, description: '整合分析多种命理方法' }
    ]);
  }
  
  /**
   * 为用户分配测试变体
   * @param userId 用户ID
   * @param testName 测试名称
   * @returns 分配的变体ID
   */
  public assignTestVariant(userId: string, testName: string): string {
    try {
      const variants = this.testConfigurations.get(testName);
      if (!variants || variants.length === 0) {
        logger.warn(`测试"${testName}"没有配置变体，返回默认值`);
        return 'default';
      }
      
      // 确保同一用户始终获得相同变体
      const userHash = this.hashString(userId + testName);
      const normalized = userHash / Number.MAX_SAFE_INTEGER;
      
      let cumulativeWeight = 0;
      for (const variant of variants) {
        cumulativeWeight += variant.weight;
        if (normalized <= cumulativeWeight) {
          logger.debug(`用户${userId}被分配到测试${testName}的变体${variant.id}`);
          return variant.id;
        }
      }
      
      return variants[variants.length - 1].id;
    } catch (error) {
      logger.error(`分配测试变体失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return 'default';
    }
  }
  
  /**
   * 获取指定测试的所有变体
   * @param testName 测试名称
   * @returns 测试变体数组
   */
  public getTestVariants(testName: string): TestVariant[] {
    return this.testConfigurations.get(testName) || [];
  }
  
  /**
   * 添加或更新测试配置
   * @param testName 测试名称
   * @param variants 变体数组
   * @returns 是否成功
   */
  public setTestConfiguration(testName: string, variants: TestVariant[]): boolean {
    try {
      // 验证变体权重总和是否为1
      const totalWeight = variants.reduce((sum, variant) => sum + variant.weight, 0);
      if (Math.abs(totalWeight - 1) > 0.001) {
        logger.error(`测试${testName}的变体权重总和应为1，当前为${totalWeight}`);
        return false;
      }
      
      this.testConfigurations.set(testName, variants);
      logger.info(`已更新测试${testName}的配置，包含${variants.length}个变体`);
      return true;
    } catch (error) {
      logger.error(`设置测试配置失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }
  
  /**
   * 记录测试结果
   * @param result 测试结果
   */
  public recordResult(result: Omit<TestResult, 'createdAt'>): void {
    try {
      const fullResult: TestResult = {
        ...result,
        createdAt: new Date()
      };
      
      this.results.push(fullResult);
      
      // 在实际应用中，这里应该将结果持久化到数据库
      logger.debug(`记录了测试${result.testName}变体${result.variantId}的结果`);
    } catch (error) {
      logger.error(`记录测试结果失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * 获取测试结果
   * @param testName 测试名称
   * @returns 测试结果统计
   */
  public getTestResults(testName: string): Record<string, any> {
    try {
      const testResults = this.results.filter(result => result.testName === testName);
      
      if (testResults.length === 0) {
        return { success: false, message: '没有找到测试结果' };
      }
      
      // 按变体分组结果
      const resultsByVariant: Record<string, any> = {};
      
      const variants = this.getTestVariants(testName);
      
      // 初始化每个变体的结果
      variants.forEach(variant => {
        resultsByVariant[variant.id] = {
          variantId: variant.id,
          description: variant.description || '',
          totalCount: 0,
          successCount: 0,
          successRate: 0,
          metrics: {}
        };
      });
      
      // 统计结果
      testResults.forEach(result => {
        if (!resultsByVariant[result.variantId]) {
          resultsByVariant[result.variantId] = {
            variantId: result.variantId,
            description: '未知变体',
            totalCount: 0,
            successCount: 0,
            successRate: 0,
            metrics: {}
          };
        }
        
        const variantStats = resultsByVariant[result.variantId];
        variantStats.totalCount++;
        
        if (result.success) {
          variantStats.successCount++;
        }
        
        // 处理指标
        if (result.metrics) {
          Object.entries(result.metrics).forEach(([key, value]) => {
            if (!variantStats.metrics[key]) {
              variantStats.metrics[key] = { sum: 0, count: 0, average: 0 };
            }
            
            variantStats.metrics[key].sum += value;
            variantStats.metrics[key].count++;
            variantStats.metrics[key].average = variantStats.metrics[key].sum / variantStats.metrics[key].count;
          });
        }
        
        // 计算成功率
        variantStats.successRate = (variantStats.successCount / variantStats.totalCount) * 100;
      });
      
      return {
        success: true,
        testName,
        totalResults: testResults.length,
        resultsByVariant,
        startDate: this.getEarliestDate(testResults),
        endDate: this.getLatestDate(testResults)
      };
    } catch (error) {
      logger.error(`获取测试结果失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { success: false, message: '获取测试结果时发生错误' };
    }
  }
  
  /**
   * 从结果数组中获取最早的日期
   */
  private getEarliestDate(results: TestResult[]): Date | null {
    if (results.length === 0) return null;
    return new Date(Math.min(...results.map(r => r.createdAt.getTime())));
  }
  
  /**
   * 从结果数组中获取最晚的日期
   */
  private getLatestDate(results: TestResult[]): Date | null {
    if (results.length === 0) return null;
    return new Date(Math.max(...results.map(r => r.createdAt.getTime())));
  }
  
  /**
   * 简单的字符串哈希函数
   * @param str 输入字符串
   * @returns 哈希值
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
} 
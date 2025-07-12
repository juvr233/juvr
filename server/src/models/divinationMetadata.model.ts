import mongoose, { Document } from 'mongoose';
import { HistoryType } from './userHistory.model';

/**
 * 命理数据元数据模型
 * 用于存储各类命理数据的配置、模板和系统设置
 */
export interface IDivinationMetadata extends Document {
  type: HistoryType;
  name: string;
  description: string;
  icon?: string; // 图标
  templates: Array<{
    id: string;
    name: string;
    description?: string;
    content: string; // 可以是Markdown或HTML格式的模板
  }>;
  interpretationKeys: string[]; // 可解释的关键字段
  sampleQuestions: string[]; // 示例问题
  settings: {
    defaultVisualization?: Record<string, any>; // 默认可视化设置
    requiredFields: string[]; // 必填字段
    premiumFeatures?: string[]; // 高级功能（需付费）
    maxQueriesPerDay?: number; // 每天最大查询次数（免费用户）
  };
  active: boolean; // 是否启用此命理类型
  order: number; // 显示顺序
}

const divinationMetadataSchema = new mongoose.Schema<IDivinationMetadata>({
  type: {
    type: String,
    enum: Object.values(HistoryType),
    required: [true, '命理类型是必填项'],
    unique: true
  },
  name: {
    type: String,
    required: [true, '名称是必填项']
  },
  description: {
    type: String,
    required: [true, '描述是必填项']
  },
  icon: String,
  templates: [{
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: String,
    content: {
      type: String,
      required: true
    }
  }],
  interpretationKeys: [String],
  sampleQuestions: [String],
  settings: {
    defaultVisualization: mongoose.Schema.Types.Mixed,
    requiredFields: [String],
    premiumFeatures: [String],
    maxQueriesPerDay: Number
  },
  active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// 索引
divinationMetadataSchema.index({ type: 1 }, { unique: true });
divinationMetadataSchema.index({ active: 1, order: 1 });

// 优化元数据访问的其他索引
divinationMetadataSchema.index({ 'templates.id': 1 }); // 快速查找特定模板
divinationMetadataSchema.index({ name: 'text', description: 'text' }); // 全文搜索支持
divinationMetadataSchema.index({ 'settings.requiredFields': 1 }); // 优化按照必填字段查询
divinationMetadataSchema.index({ 'settings.premiumFeatures': 1 }); // 优化按高级功能查询
divinationMetadataSchema.index({ updatedAt: -1 }); // 按最后更新时间查询

// 实例方法
divinationMetadataSchema.methods = {
  /**
   * 获取指定ID的模板
   * @param templateId 模板ID
   */
  getTemplate: function(templateId: string) {
    if (!this.templates) return null;
    return this.templates.find((t: {id: string}) => t.id === templateId) || null;
  },

  /**
   * 检查字段是否是必填项
   * @param fieldName 字段名
   */
  isRequiredField: function(fieldName: string) {
    return this.settings?.requiredFields?.includes(fieldName) || false;
  },
  
  /**
   * 检查功能是否是高级功能
   * @param feature 功能名称
   */
  isPremiumFeature: function(feature: string) {
    return this.settings?.premiumFeatures?.includes(feature) || false;
  }
};

// 静态方法
divinationMetadataSchema.statics = {
  /**
   * 获取所有活跃的命理类型
   */
  getActiveTypes: function() {
    return this.find({ active: true }).sort({ order: 1 });
  },
  
  /**
   * 获取指定类型的模板列表
   * @param type 命理类型
   */
  getTemplatesForType: async function(type: string) {
    const metadata = await this.findOne({ type });
    return metadata?.templates || [];
  },
  
  /**
   * 获取示例问题
   * @param type 命理类型
   * @param limit 返回数量
   */
  getSampleQuestions: async function(type: string, limit = 3) {
    const metadata = await this.findOne({ type });
    if (!metadata?.sampleQuestions || metadata.sampleQuestions.length === 0) return [];
    
    // 随机选择问题
    const questions = [...metadata.sampleQuestions];
    const result = [];
    
    for (let i = 0; i < Math.min(limit, questions.length); i++) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      result.push(questions[randomIndex]);
      questions.splice(randomIndex, 1);
    }
    
    return result;
  }
};

const DivinationMetadata = mongoose.model<IDivinationMetadata>('DivinationMetadata', divinationMetadataSchema);

export default DivinationMetadata;

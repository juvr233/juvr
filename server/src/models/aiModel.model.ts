// @ts-nocheck
import mongoose, { Document, Schema } from 'mongoose';

/**
 * 命理AI模型类型
 */
export enum AiModelType {
  NUMEROLOGY = 'numerology',
  TAROT = 'tarot',
  ICHING = 'iching',
  COMPATIBILITY = 'compatibility',
  BAZI = 'bazi',
  STAR_ASTROLOGY = 'starAstrology',
  HOLISTIC = 'holistic'
}

/**
 * AI训练数据定义
 */
export interface TrainingData {
  input: any;
  output: any;
  source?: string;
  quality?: number;
  createdAt: Date;
}

/**
 * AI模型元数据接口
 */
export interface AiModelMetadata {
  type: AiModelType;
  version: string;
  accuracy?: number;
  trainedOn?: Date;
  parameters?: Record<string, any>;
  description?: string;
  trainingDataSize?: number;
  validationScore?: number;
  status: 'training' | 'active' | 'inactive' | 'failed';
}

/**
 * AI模型文档接口
 */
export interface AiModelDocument extends Document, AiModelMetadata {
  trainingData: TrainingData[];
}

/**
 * AI模型schema定义
 */
const aiModelSchema = new Schema<AiModelDocument>({
  type: {
    type: String,
    enum: Object.values(AiModelType),
    required: true
  },
  version: {
    type: String,
    required: true
  },
  accuracy: Number,
  trainedOn: Date,
  parameters: Schema.Types.Mixed,
  description: String,
  trainingDataSize: Number,
  validationScore: Number,
  status: {
    type: String,
    enum: ['training', 'active', 'inactive', 'failed'],
    default: 'inactive'
  },
  trainingData: [{
    input: Schema.Types.Mixed,
    output: Schema.Types.Mixed,
    source: String,
    quality: {
      type: Number,
      min: 0,
      max: 1
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

/**
 * 创建索引以提高查询效率
 */
aiModelSchema.index({ type: 1, version: 1 }, { unique: true });
aiModelSchema.index({ type: 1, status: 1 });

const AiModel = mongoose.model<AiModelDocument>('AiModel', aiModelSchema);

export default AiModel;

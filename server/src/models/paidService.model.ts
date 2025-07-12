import mongoose from 'mongoose';

export interface IPaidService extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  price: number;
  type: 'tarot' | 'iching';
  featureLevel: 'basic' | 'advanced';
  isActive: boolean;
}

const paidServiceSchema = new mongoose.Schema<IPaidService>({
  name: {
    type: String,
    required: [true, '服务名称是必填项'],
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    required: [true, '服务标识是必填项'],
    trim: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, '服务描述是必填项']
  },
  price: {
    type: Number,
    required: [true, '价格是必填项'],
    min: [0, '价格不能为负数']
  },
  type: {
    type: String,
    enum: ['tarot', 'iching'],
    required: [true, '服务类型是必填项']
  },
  featureLevel: {
    type: String,
    enum: ['basic', 'advanced'],
    required: [true, '功能等级是必填项']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// 创建索引以提高查询性能
paidServiceSchema.index({ slug: 1 });
paidServiceSchema.index({ type: 1, isActive: 1 });
paidServiceSchema.index({ price: 1 }); // 按价格排序查询
paidServiceSchema.index({ featureLevel: 1, isActive: 1 }); // 按功能级别查询
paidServiceSchema.index({ name: 'text', description: 'text' }); // 全文搜索
paidServiceSchema.index({ updatedAt: -1 }); // 最近更新服务

const PaidService = mongoose.model<IPaidService>('PaidService', paidServiceSchema);

export default PaidService;

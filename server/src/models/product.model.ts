import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: 'crystal' | 'book' | 'accessory' | 'course' | 'consultation';
  tags: string[];
  numerologyMatch: {
    lifePathNumbers: number[];
    expressionNumbers: number[];
    soulUrgeNumbers: number[];
  };
  tarotMatch: {
    cardIds: number[];
    spreads: string[];
  };
  ichingMatch: {
    hexagrams: number[];
  };
  imageUrl: string;
  isActive: boolean;
  rating: number;
  reviews: number;
  inStock: boolean;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: [true, '产品名称是必填项'],
    trim: true,
    maxlength: [100, '产品名称不能超过100个字符']
  },
  slug: {
    type: String,
    required: [true, '产品标识是必填项'],
    unique: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, '产品描述是必填项'],
    maxlength: [2000, '产品描述不能超过2000个字符']
  },
  price: {
    type: Number,
    required: [true, '价格是必填项'],
    min: [0, '价格不能为负数']
  },
  category: {
    type: String,
    enum: ['crystal', 'book', 'accessory', 'course', 'consultation'],
    required: [true, '产品类别是必填项']
  },
  tags: [{
    type: String,
    trim: true
  }],
  numerologyMatch: {
    lifePathNumbers: [{
      type: Number,
      min: 1,
      max: 9
    }],
    expressionNumbers: [{
      type: Number,
      min: 1,
      max: 9
    }],
    soulUrgeNumbers: [{
      type: Number,
      min: 1,
      max: 9
    }]
  },
  tarotMatch: {
    cardIds: [{
      type: Number,
      min: 0,
      max: 77
    }],
    spreads: [{
      type: String,
      enum: ['three', 'five', 'ten']
    }]
  },
  ichingMatch: {
    hexagrams: [{
      type: Number,
      min: 1,
      max: 64
    }]
  },
  imageUrl: {
    type: String,
    required: [true, '产品图片URL是必填项']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0
  },
  inStock: {
    type: Boolean,
    default: true
  },
  features: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// 创建索引以提高查询性能
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ 'numerologyMatch.lifePathNumbers': 1 });
productSchema.index({ 'tarotMatch.cardIds': 1 });
productSchema.index({ 'ichingMatch.hexagrams': 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;

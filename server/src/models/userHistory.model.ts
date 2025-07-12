import mongoose, { Document } from 'mongoose';

// 定义历史记录类型
export enum HistoryType {
  NUMEROLOGY = 'numerology',
  TAROT = 'tarot',
  ICHING = 'iching',
  COMPATIBILITY = 'compatibility',
  HOLISTIC = 'holistic',
  STAR_ASTROLOGY = 'starAstrology',
  BAZI = 'bazi'
}

// 定义各种命理数据的接口
export interface NumerologyData {
  birthDate: string;
  name?: string;
  lifePathNumber: number;
  destinyNumber?: number;
  soulUrgeNumber?: number;
  personalityNumber?: number;
  attitudeNumber?: number;
  interpretations: {
    lifePath?: string;
    destiny?: string;
    soulUrge?: string;
    personality?: string;
    attitude?: string;
  };
}

export interface TarotData {
  spread: string; // 牌阵类型
  question?: string;
  cards: Array<{
    name: string;
    position: string;
    isReversed: boolean;
    meaning: string;
    image?: string;
  }>;
  overallInterpretation: string;
}

export interface IChingData {
  question?: string;
  hexagram: {
    number: number;
    name: {
      chinese: string;
      pinyin?: string;
      english?: string;
    };
    image?: string;
    changingLines: number[];
    resultHexagram?: {
      number: number;
      name: {
        chinese: string;
        pinyin?: string;
        english?: string;
      };
    };
  };
  interpretation: {
    overall: string;
    judgment?: string;
    image?: string;
    lines?: Record<string, string>;  // 各爻的解释
  };
}

export interface CompatibilityData {
  person1: {
    name?: string;
    birthDate: string;
    numbers?: Record<string, number>;
  };
  person2: {
    name?: string;
    birthDate: string;
    numbers?: Record<string, number>;
  };
  compatibilityScore: number;
  analysis: string;
  recommendations?: string;
}

export interface BaziData {
  birthDate: string;
  birthTime?: string;
  gender?: string;
  chart: {
    year: {
      stem: string;
      branch: string;
    };
    month: {
      stem: string;
      branch: string;
    };
    day: {
      stem: string;
      branch: string;
    };
    hour?: {
      stem: string;
      branch: string;
    };
  };
  elements: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  interpretation: string;
}

export interface StarAstrologyData {
  birthDate: string;
  birthTime?: string;
  birthPlace?: string;
  chart?: Record<string, any>;
  interpretation: string;
}

export interface HolisticData {
  numerology?: Partial<NumerologyData>;
  tarot?: Partial<TarotData>;
  iChing?: Partial<IChingData>;
  bazi?: Partial<BaziData>;
  starAstrology?: Partial<StarAstrologyData>;
  integratedAnalysis: string;
}

// 联合类型表示可能的数据类型
export type DivinationData = 
  | NumerologyData 
  | TarotData 
  | IChingData 
  | CompatibilityData 
  | BaziData 
  | StarAstrologyData 
  | HolisticData;

// 增加命理解析评级
export interface RatingData {
  score: number;  // 1-5分
  feedback?: string;  // 用户反馈
  createdAt: Date;
}

// 增加数据可视化选项
export interface VisualizationOptions {
  chartType?: 'pie' | 'bar' | 'line' | 'radar' | 'custom';
  colorTheme?: string;  // 颜色主题
  showLabels?: boolean;  // 是否显示标签
  showLegend?: boolean;  // 是否显示图例
  customSettings?: Record<string, any>; // 自定义可视化设置
}

export interface IUserHistory extends Document {
  user: mongoose.Types.ObjectId;
  type: HistoryType;
  data: DivinationData;
  date: Date;
  title: string;
  description?: string;
  isFavorite: boolean;
  tags?: string[];  // 标签，用于更好地分类和搜索
  sharedWith?: mongoose.Types.ObjectId[];  // 与其他用户共享
  isPublic?: boolean;  // 是否公开分享
  version?: number;  // 版本号，用于跟踪数据变更
  viewCount?: number;  // 查看次数
  lastViewedAt?: Date;  // 最后查看时间
  rating?: RatingData;  // 用户对解析的评价
  visualization?: VisualizationOptions;  // 可视化选项
  source?: 'user' | 'system' | 'import';  // 数据来源
  exportedAt?: Date[];  // 导出记录
  notes?: string;  // 用户笔记
}

const userHistorySchema = new mongoose.Schema<IUserHistory>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '用户ID是必填项']
  },
  type: {
    type: String,
    enum: Object.values(HistoryType),
    required: [true, '历史类型是必填项']
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, '历史数据是必填项']
  },
  date: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: [true, '标题是必填项'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  tags: {
    type: [String],
    default: []
  },
  sharedWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  version: {
    type: Number,
    default: 1
  },
  viewCount: {
    type: Number,
    default: 0
  },
  lastViewedAt: {
    type: Date
  },
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  visualization: {
    chartType: {
      type: String,
      enum: ['pie', 'bar', 'line', 'radar', 'custom']
    },
    colorTheme: String,
    showLabels: Boolean,
    showLegend: Boolean,
    customSettings: mongoose.Schema.Types.Mixed
  },
  source: {
    type: String,
    enum: ['user', 'system', 'import'],
    default: 'user'
  },
  exportedAt: [Date],
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// 预保存钩子
userHistorySchema.pre('save', function(next) {
  // 如果是新文档，确保设置正确的初始值
  if (this.isNew) {
    if (!this.date) this.date = new Date();
    if (this.viewCount === undefined) this.viewCount = 0;
    if (this.version === undefined) this.version = 1;
    if (!this.tags) this.tags = [];
  }

  // 标签处理：去重、转小写、移除空标签
  if (this.tags && Array.isArray(this.tags)) {
    this.tags = [...new Set(this.tags)]  // 去重
      .map(tag => typeof tag === 'string' ? tag.toLowerCase().trim() : '')
      .filter(tag => tag !== '');
  }

  // 如果评级超出范围，进行调整
  if (this.rating && typeof this.rating.score === 'number') {
    this.rating.score = Math.min(Math.max(this.rating.score, 1), 5);
  }

  next();
});

// 虚拟属性
userHistorySchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const createdDate = this.date instanceof Date ? this.date : new Date(this.date);
  const diffTime = Math.abs(now.getTime() - createdDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// 是否是新鲜内容（7天内创建）
userHistorySchema.virtual('isFresh').get(function() {
  return this.get('ageInDays') <= 7;
});

// 是否受欢迎（查看次数超过10）
userHistorySchema.virtual('isPopular').get(function() {
  return (this.viewCount || 0) >= 10;
});

// 首要标签
userHistorySchema.virtual('primaryTag').get(function() {
  return this.tags && this.tags.length > 0 ? this.tags[0] : null;
});

// 获取分享状态描述
userHistorySchema.virtual('shareStatus').get(function() {
  if (this.isPublic) return 'public';
  else if (this.sharedWith && this.sharedWith.length > 0) return 'shared';
  return 'private';
});

// 创建索引以提高查询性能
userHistorySchema.index({ user: 1, type: 1 });
userHistorySchema.index({ date: -1 });
userHistorySchema.index({ tags: 1 });
userHistorySchema.index({ isPublic: 1 });
userHistorySchema.index({ title: 'text', description: 'text' });  // 全文搜索索引
userHistorySchema.index({ 'sharedWith': 1 });
userHistorySchema.index({ isFavorite: 1, user: 1 });  // 用于快速查询用户收藏的内容
userHistorySchema.index({ viewCount: -1 });  // 用于热门内容排序

// 复合索引优化
userHistorySchema.index({ user: 1, isFavorite: 1, date: -1 });  // 优化用户收藏内容按时间排序查询
userHistorySchema.index({ user: 1, type: 1, date: -1 });  // 优化用户特定类型按时间查询
userHistorySchema.index({ type: 1, isPublic: 1, date: -1 });  // 优化公开内容按类型和时间查询
userHistorySchema.index({ 'data.birthDate': 1 }, { sparse: true });  // 优化按出生日期查询（数字学、八字等）
userHistorySchema.index({ user: 1, 'rating.score': -1 });  // 优化用户评分排序查询
userHistorySchema.index({ lastViewedAt: -1, user: 1 });  // 优化最近查看记录查询
userHistorySchema.index({ 'sharedWith': 1, type: 1 });  // 优化共享内容按类型查询

// TTL索引（如果需要自动过期功能，取消注释下面的代码）
// userHistorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 365 });  // 一年后过期

// 实例方法
userHistorySchema.methods = {
  /**
   * 增加查看计数并更新最后查看时间
   */
  incrementViewCount: function() {
    this.viewCount = (this.viewCount || 0) + 1;
    this.lastViewedAt = new Date();
    return this.save();
  },

  /**
   * 添加或更新评分
   * @param score - 分数（1-5）
   * @param feedback - 反馈内容
   */
  addRating: function(score: number, feedback?: string) {
    this.rating = {
      score: Math.min(Math.max(score, 1), 5), // 确保分数在1-5之间
      feedback,
      createdAt: new Date()
    };
    return this.save();
  },

  /**
   * 添加标签
   * @param tags - 要添加的标签数组
   */
  addTags: function(tags: string[]) {
    if (!this.tags) this.tags = [];
    // 添加不存在的标签
    const newTags = tags.filter(tag => !this.tags?.includes(tag));
    if (newTags.length > 0) {
      this.tags = [...this.tags, ...newTags];
      return this.save();
    }
    return this;
  },

  /**
   * 切换收藏状态
   */
  toggleFavorite: function() {
    this.isFavorite = !this.isFavorite;
    return this.save();
  },

  /**
   * 创建新版本（复制当前记录并增加版本号）
   */
  createNewVersion: async function() {
    const currentData = this.toObject();
    delete currentData._id;
    delete currentData.__v;
    currentData.version = (this.version || 1) + 1;
    currentData.date = new Date();
    return await UserHistory.create(currentData);
  },

  /**
   * 记录导出
   */
  recordExport: function() {
    if (!this.exportedAt) this.exportedAt = [];
    this.exportedAt.push(new Date());
    return this.save();
  }
};

// 静态方法
userHistorySchema.statics = {
  /**
   * 查找用户的热门记录（基于查看次数）
   * @param userId - 用户ID
   * @param limit - 返回记录数量
   */
  findPopular: function(userId: string, limit = 5) {
    return this.find({ user: userId })
      .sort({ viewCount: -1 })
      .limit(limit);
  },

  /**
   * 查找最近添加的记录
   * @param userId - 用户ID
   * @param limit - 返回记录数量
   */
  findRecent: function(userId: string, limit = 5) {
    return this.find({ user: userId })
      .sort({ date: -1 })
      .limit(limit);
  },

  /**
   * 按类型统计
   * @param userId - 用户ID
   */
  countByType: async function(userId: string) {
    return await this.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
  },

  /**
   * 查找相关记录（基于相同标签）
   * @param recordId - 记录ID
   * @param limit - 返回记录数量
   */
  findRelated: async function(recordId: string, limit = 3) {
    const record = await this.findById(recordId);
    if (!record || !record.tags || record.tags.length === 0) return [];
    
    return this.find({ 
      _id: { $ne: recordId },
      user: record.user,
      tags: { $in: record.tags }
    }).limit(limit);
  }
};

const UserHistory = mongoose.model<IUserHistory>('UserHistory', userHistorySchema);

export default UserHistory;

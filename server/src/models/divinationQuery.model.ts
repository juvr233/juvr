import mongoose, { Document } from 'mongoose';
import { HistoryType } from './userHistory.model';

/**
 * 命理查询历史模型
 * 用于记录用户的命理查询，无论是否保存为历史记录
 */
export interface IDivinationQuery extends Document {
  user: mongoose.Types.ObjectId | null; // null为匿名查询
  type: HistoryType;
  queryParams: Record<string, any>; // 查询参数
  ip?: string; // 客户端IP
  userAgent?: string; // 用户代理
  timestamp: Date;
  executionTime?: number; // 执行时间（毫秒）
  resultSaved: boolean; // 是否已保存为历史记录
  savedRecordId?: mongoose.Types.ObjectId; // 如果保存了，对应的历史记录ID
  success: boolean; // 查询是否成功
  errorMessage?: string; // 如果失败，错误信息
  responseSize?: number; // 响应大小（字节）
}

const divinationQuerySchema = new mongoose.Schema<IDivinationQuery>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  type: {
    type: String,
    enum: Object.values(HistoryType),
    required: [true, '查询类型是必填项']
  },
  queryParams: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, '查询参数是必填项']
  },
  ip: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  executionTime: Number,
  resultSaved: {
    type: Boolean,
    default: false
  },
  savedRecordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserHistory'
  },
  success: {
    type: Boolean,
    default: true
  },
  errorMessage: String,
  responseSize: Number
});

// 索引
divinationQuerySchema.index({ user: 1, timestamp: -1 });
divinationQuerySchema.index({ type: 1, timestamp: -1 });
divinationQuerySchema.index({ success: 1 });
divinationQuerySchema.index({ timestamp: -1 }); // 用于查询时间趋势

// 优化性能的复合索引
divinationQuerySchema.index({ type: 1, success: 1, timestamp: -1 }); // 按类型和成功状态分析查询趋势
divinationQuerySchema.index({ user: 1, type: 1, success: 1 }); // 用户特定命理类型的成功率分析
divinationQuerySchema.index({ ip: 1, timestamp: -1 }, { sparse: true }); // IP分析，用于安全监控
divinationQuerySchema.index({ executionTime: 1 }); // 性能分析索引
divinationQuerySchema.index({ resultSaved: 1, savedRecordId: 1 }); // 用于关联用户历史记录查询

// 日期范围查询优化
divinationQuerySchema.index({ 
  timestamp: 1, 
  type: 1, 
  success: 1 
}); // 用于按日期范围筛选特定类型和状态的查询

// 自动过期索引 - 可选配置
// 保留90天的查询日志，超过自动删除
// divinationQuerySchema.index({ timestamp: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

// 统计方法
divinationQuerySchema.statics = {
  /**
   * 获取用户查询统计
   * @param userId 用户ID
   */
  getUserQueryStats: async function(userId: string) {
    return this.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: {
        _id: '$type',
        count: { $sum: 1 },
        successCount: { 
          $sum: { $cond: ['$success', 1, 0] } 
        },
        avgExecutionTime: { $avg: '$executionTime' }
      }}
    ]);
  },

  /**
   * 获取查询趋势（按时间）
   * @param days 过去的天数
   */
  getQueryTrend: async function(days = 7) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    
    return this.aggregate([
      { $match: { timestamp: { $gte: date } } },
      { $group: {
        _id: { 
          $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } 
        },
        count: { $sum: 1 },
        byType: { 
          $push: { type: '$type', count: 1 } 
        }
      }},
      { $sort: { _id: 1 } }
    ]);
  },

  /**
   * 获取最受欢迎的查询参数
   * @param type 查询类型
   * @param limit 返回数量
   */
  getPopularQueryParams: async function(type: string, limit = 5) {
    return this.aggregate([
      { $match: { type } },
      { $group: {
        _id: '$queryParams',
        count: { $sum: 1 }
      }},
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);
  }
};

// 日志清理方法（保留最近的日志，删除旧日志）
divinationQuerySchema.statics.cleanupLogs = async function(daysToKeep = 90) {
  const date = new Date();
  date.setDate(date.getDate() - daysToKeep);
  
  return this.deleteMany({
    timestamp: { $lt: date }
  });
};

const DivinationQuery = mongoose.model<IDivinationQuery>('DivinationQuery', divinationQuerySchema);

export default DivinationQuery;

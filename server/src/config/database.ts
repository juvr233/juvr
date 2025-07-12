// @ts-nocheck
import mongoose from 'mongoose';
import env from './env';
import { logger } from './logger';

// 初始连接状态
let isConnected = false;

// MongoDB连接配置
const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  // 连接池配置
  maxPoolSize: env.NODE_ENV === 'production' ? 20 : 10, // 生产环境使用更大的连接池
  minPoolSize: env.NODE_ENV === 'production' ? 5 : 2,   // 保持最小连接数
  socketTimeoutMS: 45000, // 45秒
  family: 4, // 强制使用IPv4
  // 心跳配置，确保连接保持活跃
  heartbeatFrequencyMS: 10000, // 10秒
  // 自动重连配置
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
  // 写入关注
  w: 'majority',
  // 读取偏好
  readPreference: 'primaryPreferred'
};

/**
 * 连接数据库
 */
export const ensureDbConnected = async (): Promise<void> => {
  if (isConnected) {
    return;
  }
  
  try {
    logger.info(`正在连接到数据库: ${maskConnectionString(env.MONGO_URI)}`);
    
    // 设置连接事件监听器
    mongoose.connection.on('connected', () => {
      isConnected = true;
      logger.info('数据库连接成功');
    });
    
    mongoose.connection.on('error', (err) => {
      logger.error(`数据库连接错误: ${err.message}`);
      isConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('数据库连接断开');
      isConnected = false;
    });
    
    mongoose.connection.on('reconnected', () => {
      logger.info('数据库重新连接成功');
      isConnected = true;
    });
    
    // 连接到数据库
    await mongoose.connect(env.MONGO_URI, connectOptions);
    
    // 添加索引检查
    await checkAndCreateIndexes();
    
    // 设置全局配置
    mongoose.set('debug', env.NODE_ENV === 'development');
    
    // 监控连接池状态
    if (env.NODE_ENV === 'production') {
      startConnectionPoolMonitoring();
    }
    
  } catch (error) {
    isConnected = false;
    logger.error(`数据库连接失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    // 如果是生产环境，尝试重连
    if (env.NODE_ENV === 'production') {
      logger.info('将在10秒后尝试重新连接...');
      setTimeout(() => ensureDbConnected(), 10000);
    } else {
      // 开发环境下，可以选择退出进程
      process.exit(1);
    }
  }
};

/**
 * 关闭数据库连接
 */
export const closeDbConnection = async (): Promise<void> => {
  if (!isConnected) {
    return;
  }
  
  try {
    await mongoose.connection.close();
    isConnected = false;
    logger.info('数据库连接已关闭');
  } catch (error) {
    logger.error(`关闭数据库连接时出错: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * 检查数据库连接状态
 */
export const isDbConnected = (): boolean => {
  return isConnected && mongoose.connection.readyState === 1;
};

/**
 * 掩盖连接字符串中的敏感信息
 */
const maskConnectionString = (uri: string): string => {
  try {
    const parsedUri = new URL(uri);
    if (parsedUri.password) {
      parsedUri.password = '****';
    }
    return parsedUri.toString();
  } catch (error) {
    // 如果解析失败，返回一个安全版本
    return uri.replace(/\/\/([^:]+):([^@]+)@/, '//\$1:****@');
  }
};

/**
 * 检查并创建必要的索引
 */
async function checkAndCreateIndexes(): Promise<void> {
  try {
    logger.info('检查并创建数据库索引...');
    
    // 用户集合索引
    await createUserIndexes();
    
    // 历史记录索引
    await createHistoryIndexes();
    
    // 占卜查询索引
    await createDivinationIndexes();
    
    // 付款和购买索引
    await createPaymentIndexes();
    
    // 社区和评论索引
    await createCommunityIndexes();
    
    logger.info('数据库索引创建完成');
  } catch (error) {
    logger.warn(`创建索引时出错: ${error instanceof Error ? error.message : 'Unknown error'}`);
    // 不中断启动过程
  }
}

/**
 * 创建用户集合索引
 */
async function createUserIndexes(): Promise<void> {
  const User = mongoose.models.User;
  if (User) {
    // 确保email和username有唯一索引
    await User.collection.createIndex({ email: 1 }, { unique: true, background: true });
    await User.collection.createIndex({ username: 1 }, { unique: true, background: true });
    
    // 添加认证相关索引
    await User.collection.createIndex({ 'oauth.provider': 1, 'oauth.id': 1 }, { sparse: true });
    await User.collection.createIndex({ resetPasswordToken: 1 }, { sparse: true, expireAfterSeconds: 86400 }); // 24小时过期
    
    // 添加用户搜索索引
    await User.collection.createIndex({ username: 'text', email: 'text', fullName: 'text' });
    
    logger.debug('用户集合索引已创建或已存在');
  }
}

/**
 * 创建历史记录索引
 */
async function createHistoryIndexes(): Promise<void> {
  const UserHistory = mongoose.models.UserHistory;
  if (UserHistory) {
    // 用户历史记录索引
    await UserHistory.collection.createIndex({ user: 1, date: -1 });
    await UserHistory.collection.createIndex({ type: 1, isPublic: 1, date: -1 });
    
    // 全文搜索索引
    await UserHistory.collection.createIndex({ 
      title: 'text', 
      description: 'text' 
    }, { 
      weights: { 
        title: 10, 
        description: 5 
      } 
    });
    
    logger.debug('历史记录索引已创建或已存在');
  }
}

/**
 * 创建占卜查询索引
 */
async function createDivinationIndexes(): Promise<void> {
  const DivinationQuery = mongoose.models.DivinationQuery;
  if (DivinationQuery) {
    // 基本查询索引
    await DivinationQuery.collection.createIndex({ user: 1, timestamp: -1 });
    await DivinationQuery.collection.createIndex({ type: 1, success: 1, timestamp: -1 });
    
    // IP分析索引
    await DivinationQuery.collection.createIndex({ ip: 1, timestamp: -1 }, { sparse: true });
    
    // 保存记录索引
    await DivinationQuery.collection.createIndex({ resultSaved: 1, savedRecordId: 1 });
    
    // 日期范围查询优化
    await DivinationQuery.collection.createIndex({ 
      timestamp: 1, 
      type: 1, 
      success: 1 
    });
    
    // 自动过期索引（可选）
    if (env.ENABLE_QUERY_EXPIRATION) {
      await DivinationQuery.collection.createIndex(
        { timestamp: 1 }, 
        { expireAfterSeconds: 60 * 60 * 24 * 90 } // 90天后过期
      );
    }
    
    logger.debug('占卜查询索引已创建或已存在');
  }
}

/**
 * 创建付款和购买索引
 */
async function createPaymentIndexes(): Promise<void> {
  const Purchase = mongoose.models.Purchase;
  if (Purchase) {
    // 基本查询索引
    await Purchase.collection.createIndex({ user: 1, status: 1 });
    await Purchase.collection.createIndex({ 'payment.transactionId': 1 }, { sparse: true });
    await Purchase.collection.createIndex({ createdAt: -1 });
    
    // 复合索引，用于报表
    await Purchase.collection.createIndex({ 
      status: 1, 
      'product.type': 1, 
      createdAt: -1 
    });
    
    logger.debug('付款和购买索引已创建或已存在');
  }
}

/**
 * 创建社区和评论索引
 */
async function createCommunityIndexes(): Promise<void> {
  const Comment = mongoose.models.Comment;
  if (Comment) {
    // 评论索引
    await Comment.collection.createIndex({ postId: 1, createdAt: -1 });
    await Comment.collection.createIndex({ userId: 1, createdAt: -1 });
    
    // 全文搜索
    await Comment.collection.createIndex({ content: 'text' });
  }
  
  const SharedPost = mongoose.models.SharedPost;
  if (SharedPost) {
    // 共享帖子索引
    await SharedPost.collection.createIndex({ userId: 1, createdAt: -1 });
    await SharedPost.collection.createIndex({ isPublic: 1, createdAt: -1 });
    
    // 全文搜索
    await SharedPost.collection.createIndex({ 
      title: 'text', 
      content: 'text' 
    }, { 
      weights: { 
        title: 10, 
        content: 5 
      } 
    });
  }
  
  logger.debug('社区和评论索引已创建或已存在');
}

/**
 * 监控数据库连接池状态
 */
function startConnectionPoolMonitoring(): void {
  const monitorInterval = 60000; // 每分钟监控一次
  
  setInterval(() => {
    if (!isConnected) return;
    
    const stats = mongoose.connection.db.admin().serverStatus();
    if (stats && stats.connections) {
      const { current, available, totalCreated } = stats.connections;
      
      logger.debug(`数据库连接池状态 - 当前: ${current}, 可用: ${available}, 总创建: ${totalCreated}`);
      
      // 如果连接使用率过高，记录警告
      if (available < 5 || (current / (current + available)) > 0.8) {
        logger.warn(`数据库连接池接近饱和 - 当前: ${current}, 可用: ${available}`);
      }
    }
  }, monitorInterval);
}

/**
 * 执行数据库批量操作的优化函数
 * @param model Mongoose模型
 * @param operations 操作数组
 * @param batchSize 批次大小
 */
export const performBulkOperations = async (model: any, operations: any[], batchSize: number = 500): Promise<any> => {
  if (!operations || operations.length === 0) {
    return { ok: 1, nModified: 0 };
  }
  
  const totalOps = operations.length;
  let processed = 0;
  let results = { ok: 1, nModified: 0, nInserted: 0, nUpserted: 0, nMatched: 0 };
  
  try {
    // 分批处理
    for (let i = 0; i < totalOps; i += batchSize) {
      const batch = operations.slice(i, i + batchSize);
      const bulkOp = model.collection.initializeUnorderedBulkOp();
      
      batch.forEach(op => {
        if (op.insertOne) {
          bulkOp.insert(op.insertOne.document);
        } else if (op.updateOne) {
          bulkOp.find(op.updateOne.filter).updateOne(op.updateOne.update);
        } else if (op.updateMany) {
          bulkOp.find(op.updateMany.filter).update(op.updateMany.update);
        } else if (op.deleteOne) {
          bulkOp.find(op.deleteOne.filter).deleteOne();
        } else if (op.deleteMany) {
          bulkOp.find(op.deleteMany.filter).delete();
        } else if (op.replaceOne) {
          bulkOp.find(op.replaceOne.filter).replaceOne(op.replaceOne.replacement);
        }
      });
      
      const result = await bulkOp.execute();
      
      // 合并结果
      results.nModified += result.nModified || 0;
      results.nInserted += result.nInserted || 0;
      results.nUpserted += result.nUpserted || 0;
      results.nMatched += result.nMatched || 0;
      
      processed += batch.length;
      logger.debug(`批量操作进度: ${processed}/${totalOps}`);
    }
    
    return results;
  } catch (error) {
    logger.error(`批量操作失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
};

/**
 * 获取数据库状态
 */
export const getDatabaseStatus = async (): Promise<any> => {
  if (!isConnected) {
    return { status: 'disconnected' };
  }
  
  try {
    const db = mongoose.connection.db;
    const adminDb = db.admin();
    
    // 并行执行多个状态查询
    const [serverStatus, dbStats] = await Promise.all([
      adminDb.serverStatus(),
      db.stats()
    ]);
    
    return {
      status: 'connected',
      version: serverStatus.version,
      uptime: serverStatus.uptime,
      connections: serverStatus.connections,
      dbStats: {
        db: dbStats.db,
        collections: dbStats.collections,
        objects: dbStats.objects,
        dataSize: dbStats.dataSize,
        storageSize: dbStats.storageSize,
        indexes: dbStats.indexes,
        indexSize: dbStats.indexSize
      }
    };
  } catch (error) {
    logger.error(`获取数据库状态失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { 
      status: 'error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

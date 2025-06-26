import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { rateLimit } from 'express-rate-limit';
import authRoutes from './routes/auth.routes';
import paymentRoutes from './routes/payment.routes';
import tarotRoutes from './routes/tarot.routes';
import iChingRoutes from './routes/iching.routes';
import { logger } from './config/logger';

// 加载环境变量
dotenv.config();

// 创建Express应用
const app = express();

// 安全头设置
app.use(helmet());

// 解析请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 配置CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-production-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// 请求限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每IP每15分钟最多100个请求
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tarot', tarotRoutes);
app.use('/api/iching', iChingRoutes);

// 健康检查端点
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// 404处理
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// 错误处理中间件
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error(`${err.name}: ${err.message}`);
  res.status(500).json({
    error: {
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    }
  });
});

// 连接数据库
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error: ${error.message}`);
    } else {
      logger.error('Unknown error occurred when connecting to MongoDB');
    }
    process.exit(1);
  }
};

// 启动服务器
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

startServer();

export default app;

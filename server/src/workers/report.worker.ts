import { Worker } from 'bullmq';
import { logger } from '../config/logger';

const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
};

const worker = new Worker(
  'report-generation',
  async (job) => {
    const { userId, data } = job.data;
    logger.info(`Generating report for user ${userId}`, { data });

    // 模拟报告生成过程
    await new Promise(resolve => setTimeout(resolve, 5000));

    logger.info(`Report generated for user ${userId}`);
    // 在实际应用中，这里可能会将报告保存到S3，并更新数据库
  },
  { connection: redisConnection }
);

worker.on('completed', (job) => {
  logger.info(`Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  if (job) {
    logger.error(`Job ${job.id} has failed with ${err.message}`);
  } else {
    logger.error(`A job has failed with ${err.message}`);
  }
});

logger.info('Report generation worker started.');

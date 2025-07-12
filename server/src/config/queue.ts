import { Queue } from 'bullmq';
import { logger } from './logger';

const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
};

const createQueue = (name: string) => {
  const queue = new Queue(name, { connection: redisConnection });

  queue.on('error', (err) => {
    logger.error(`Queue ${name} error:`, err);
  });

  return queue;
};

export const reportQueue = createQueue('report-generation');
export const emailQueue = createQueue('email-sending');

logger.info('Message queues initialized.');

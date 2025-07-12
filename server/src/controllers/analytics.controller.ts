import { Request, Response } from 'express';
import { logger } from '../config/logger';
import fs from 'fs';
import path from 'path';

export const getRecentActivity = async (req: Request, res: Response) => {
  try {
    // 在生产环境中，应该从结构化的日志存储（如ELK, Datadog）中查询
    // 这里我们从日志文件中读取作为演示
    const logFilePath = path.join(__dirname, '../../logs/app.log');

    if (!fs.existsSync(logFilePath)) {
      return res.json({ message: 'No activity log found.' });
    }

    const logData = await fs.promises.readFile(logFilePath, 'utf-8');
    const allLogs = logData.split('\n').filter(line => line.trim() !== '');

    const activityLogs = allLogs
      .map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(log => log && log.message === 'User Activity')
      .reverse()
      .slice(0, 100); // 返回最近100条活动

    res.json(activityLogs);
  } catch (error) {
    logger.error('Failed to get recent activity', error);
    res.status(500).json({ message: '获取最近活动失败' });
  }
};

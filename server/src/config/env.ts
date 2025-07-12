import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { logger } from './logger';

// 环境变量类型定义
export interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_EXPIRE: string;
  JWT_REFRESH_EXPIRE: string;
  API_KEY: string;
  CORS_ORIGIN: string;
  LOG_LEVEL: string;
  LOG_DIR: string;
  BACKUP_DIR: string;
  BACKUP_RETENTION_DAYS: number;
  AI_API_BASE_URL: string;
  AI_API_KEY: string;
  AI_MODEL: string;
  SHOPIFY_API_KEY: string;
  SHOPIFY_API_SECRET: string;
  SHOPIFY_STOREFRONT_TOKEN: string;
  SHOPIFY_ADMIN_TOKEN: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_SECURE: boolean;
  SMTP_USER: string;
  SMTP_PASSWORD: string;
  EMAIL_FROM: string;
  CLIENT_URL: string;
}

// 默认配置
const defaultConfig: Partial<EnvConfig> = {
  NODE_ENV: 'development',
  PORT: 5000,
  LOG_LEVEL: 'info',
  LOG_DIR: './logs',
  BACKUP_DIR: './backups',
  BACKUP_RETENTION_DAYS: 7,
  JWT_EXPIRE: '1h',
  JWT_REFRESH_EXPIRE: '7d',
  CORS_ORIGIN: 'http://localhost:3000',
  AI_API_BASE_URL: 'https://ai.novcase.com/gemini/v1beta',
  AI_MODEL: 'Gemini-2.5-Pro',
  SMTP_PORT: 587,
  SMTP_SECURE: false
};

// 必需的环境变量
const requiredEnvVars: (keyof EnvConfig)[] = [
  'MONGO_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'API_KEY',
  'AI_API_KEY'
];

/**
 * 加载环境变量
 */
export function loadEnv(): EnvConfig {
  // 确定环境
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  // 加载对应的.env文件
  const envFile = `.env.${nodeEnv}`;
  const defaultEnvFile = '.env';
  
  // 尝试加载特定环境的.env文件，如果不存在则加载默认.env
  if (fs.existsSync(path.join(process.cwd(), envFile))) {
    dotenv.config({ path: path.join(process.cwd(), envFile) });
    logger.info(`已加载环境配置: ${envFile}`);
  } else if (fs.existsSync(path.join(process.cwd(), defaultEnvFile))) {
    dotenv.config({ path: path.join(process.cwd(), defaultEnvFile) });
    logger.info(`已加载环境配置: ${defaultEnvFile}`);
  } else {
    logger.warn('未找到.env文件，使用默认配置和环境变量');
  }
  
  // 合并默认配置和环境变量
  const config = { ...defaultConfig } as EnvConfig;
  
  // 将环境变量加载到配置中
  for (const key in config) {
    if (process.env[key]) {
      const typedKey = key as keyof EnvConfig;
      const value = process.env[key] as string;
      
      // 根据默认值类型转换环境变量
      if (typeof defaultConfig[typedKey] === 'number') {
        config[typedKey] = Number(value) as any;
      } else if (typeof defaultConfig[typedKey] === 'boolean') {
        config[typedKey] = (value.toLowerCase() === 'true') as any;
      } else {
        config[typedKey] = value as any;
      }
    }
  }
  
  // 验证必需的环境变量
  validateEnv(config);
  
  return config;
}

/**
 * 验证环境变量
 */
function validateEnv(config: EnvConfig): void {
  const missingVars: string[] = [];
  
  for (const envVar of requiredEnvVars) {
    if (!config[envVar]) {
      missingVars.push(envVar);
    }
  }
  
  if (missingVars.length > 0) {
    logger.error(`缺少必需的环境变量: ${missingVars.join(', ')}`);
    throw new Error(`缺少必需的环境变量: ${missingVars.join(', ')}`);
  }
  
  // 验证JWT密钥长度
  if (config.JWT_SECRET && config.JWT_SECRET.length < 32) {
    logger.warn('JWT_SECRET 长度不足，建议至少32个字符');
  }
  
  if (config.JWT_REFRESH_SECRET && config.JWT_REFRESH_SECRET.length < 32) {
    logger.warn('JWT_REFRESH_SECRET 长度不足，建议至少32个字符');
  }
  
  // 验证数据库URI格式
  if (config.MONGO_URI && !config.MONGO_URI.startsWith('mongodb')) {
    logger.error('MONGO_URI 格式无效');
    throw new Error('MONGO_URI 格式无效');
  }
  
  logger.info(`环境: ${config.NODE_ENV}`);
  logger.debug('环境变量验证通过');
}

// 导出配置
export const env = loadEnv();

// 导出单例配置对象
export default env; 
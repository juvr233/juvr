import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { ensureDbConnected, closeDbConnection } from '../config/database';
import mockDatabase from '../config/mockDatabase';
import User from '../models/user.model';
import { AiModelType } from '../models/aiModel.model';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '../../.env') });

// 迁移状态接口
interface MigrationState {
  version: number;
  lastRun: Date;
  migrations: string[];
}

// 数据库初始化和迁移主函数
async function migrateDatabase() {
  console.log('开始数据库迁移...');
  
  try {
    // 连接到数据库
    await ensureDbConnected();
    
    // 检查迁移状态集合是否存在，不存在则创建
    const migrationStateModel = mongoose.models.MigrationState || 
      mongoose.model('MigrationState', new mongoose.Schema({
        version: { type: Number, required: true },
        lastRun: { type: Date, required: true },
        migrations: [String]
      }));
    
    // 获取当前迁移状态
    let migrationState = await migrationStateModel.findOne({}).sort({ version: -1 });
    if (!migrationState) {
      // 如果没有迁移状态记录，创建初始状态
      migrationState = new migrationStateModel({
        version: 0,
        lastRun: new Date(),
        migrations: []
      });
      await migrationState.save();
      console.log('创建初始迁移状态记录');
    }
    
    // 获取所有迁移文件
    const migrationsDir = path.join(__dirname, '../migrations');
    if (!fs.existsSync(migrationsDir)) {
      fs.mkdirSync(migrationsDir, { recursive: true });
      console.log('创建迁移目录:', migrationsDir);
    }
    
    // 如果是首次迁移，执行从模拟数据库导入数据
    if (migrationState.version === 0) {
      console.log('执行初始数据导入...');
      await importFromMockDatabase();
      
      // 更新迁移状态
      migrationState.version = 1;
      migrationState.lastRun = new Date();
      migrationState.migrations.push('initial_import_from_mock');
      await migrationState.save();
      console.log('初始数据导入完成');
    }
    
    // 运行其他待执行的迁移脚本
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.js'))
      .sort(); // 确保按字母顺序执行
    
    for (const migrationFile of migrationFiles) {
      if (migrationState.migrations.includes(migrationFile)) {
        console.log(`跳过已执行的迁移: ${migrationFile}`);
        continue;
      }
      
      console.log(`执行迁移: ${migrationFile}`);
      const migration = require(path.join(migrationsDir, migrationFile));
      
      if (typeof migration.up === 'function') {
        await migration.up();
        
        // 更新迁移状态
        migrationState.version += 1;
        migrationState.lastRun = new Date();
        migrationState.migrations.push(migrationFile);
        await migrationState.save();
        console.log(`迁移 ${migrationFile} 完成`);
      } else {
        console.warn(`迁移文件 ${migrationFile} 没有导出up函数`);
      }
    }
    
    console.log('所有迁移执行完成');
    return true;
  } catch (error) {
    console.error('数据库迁移失败:', error);
    return false;
  } finally {
    // 关闭数据库连接
    await closeDbConnection();
  }
}

// 从模拟数据库导入数据到真实数据库
async function importFromMockDatabase() {
  console.log('从模拟数据库导入数据...');
  
  try {
    // 导入用户数据
    const mockUsers = mockDatabase.getCollection('users');
    if (mockUsers.length > 0) {
      console.log(`导入 ${mockUsers.length} 个用户...`);
      for (const mockUser of mockUsers) {
        const { _id, ...userData } = mockUser;
        await User.create(userData);
      }
    }
    
    // 导入其他数据...
    // 可以根据需要添加其他集合的迁移代码
    
    console.log('模拟数据导入完成');
  } catch (error) {
    console.error('从模拟数据导入失败:', error);
    throw error;
  }
}

// 创建迁移脚本模板
export function createMigrationFile(name: string): string {
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const fileName = `${timestamp}_${name}.js`;
  const migrationsDir = path.join(__dirname, '../migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
  }
  
  const filePath = path.join(migrationsDir, fileName);
  
  const template = `
/**
 * 迁移: ${name}
 * 创建时间: ${new Date().toISOString()}
 */
module.exports = {
  async up() {
    // 在这里实现迁移上的变更
    const db = require('mongoose').connection.db;
    
    try {
      // 示例: 为用户添加新字段
      // await db.collection('users').updateMany({}, { $set: { newField: 'defaultValue' } });
      
      console.log('迁移成功执行');
    } catch (error) {
      console.error('迁移执行失败:', error);
      throw error;
    }
  },
  
  async down() {
    // 在这里实现迁移回滚的变更
    const db = require('mongoose').connection.db;
    
    try {
      // 示例: 移除用户的新字段
      // await db.collection('users').updateMany({}, { $unset: { newField: "" } });
      
      console.log('迁移成功回滚');
    } catch (error) {
      console.error('迁移回滚失败:', error);
      throw error;
    }
  }
};
`;
  
  fs.writeFileSync(filePath, template.trim());
  console.log(`创建迁移文件: ${filePath}`);
  return fileName;
}

// 如果直接运行此脚本
if (require.main === module) {
  migrateDatabase()
    .then(success => {
      if (success) {
        console.log('数据库迁移完成');
        process.exit(0);
      } else {
        console.error('数据库迁移失败');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('数据库迁移出错:', error);
      process.exit(1);
    });
}

export default migrateDatabase; 
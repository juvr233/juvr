import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '../../.env') });

// 备份配置
const BACKUP_DIR = process.env.BACKUP_DIR || path.join(__dirname, '../../backups');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/zenith-destiny';
const RETENTION_DAYS = parseInt(process.env.BACKUP_RETENTION_DAYS || '7', 10);

/**
 * 创建MongoDB数据库备份
 */
async function createBackup(): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);
  
  // 确保备份目录存在
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  // 解析MongoDB URI
  const uri = new URL(MONGO_URI);
  const dbName = uri.pathname.substring(1) || 'zenith-destiny';
  
  // 构建mongodump命令参数
  const args: string[] = ['--db', dbName, '--out', backupPath];
  
  // 如果有认证信息，添加到命令参数中
  if (uri.username && uri.password) {
    args.push('--username', uri.username);
    args.push('--password', uri.password);
    args.push('--authenticationDatabase', 'admin');
  }
  
  if (uri.hostname) {
    args.push('--host', uri.hostname);
  }
  
  if (uri.port) {
    args.push('--port', uri.port);
  }
  
  // 执行mongodump命令
  console.log(`开始备份数据库 ${dbName} 到 ${backupPath}`);
  
  return new Promise<string>((resolve, reject) => {
    const process = spawn('mongodump', args);
    
    let stdout = '';
    let stderr = '';
    
    process.stdout.on('data', data => {
      stdout += data.toString();
    });
    
    process.stderr.on('data', data => {
      stderr += data.toString();
    });
    
    process.on('close', code => {
      if (code === 0) {
        console.log(`数据库备份成功: ${backupPath}`);
        resolve(backupPath);
      } else {
        console.error(`数据库备份失败，退出代码: ${code}`);
        console.error(stderr);
        reject(new Error(`数据库备份失败: ${stderr}`));
      }
    });
  });
}

/**
 * 清理旧备份
 */
function cleanupOldBackups(): void {
  console.log('清理过期备份...');
  
  try {
    const files = fs.readdirSync(BACKUP_DIR);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);
    
    for (const file of files) {
      if (!file.startsWith('backup-')) continue;
      
      const filePath = path.join(BACKUP_DIR, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory() && stats.mtime < cutoffDate) {
        console.log(`删除过期备份: ${file}`);
        fs.rmSync(filePath, { recursive: true, force: true });
      }
    }
  } catch (error) {
    console.error('清理过期备份失败:', error);
  }
}

/**
 * 恢复备份
 * @param backupPath 备份路径
 */
async function restoreBackup(backupPath: string): Promise<boolean> {
  if (!fs.existsSync(backupPath)) {
    console.error(`备份路径不存在: ${backupPath}`);
    return false;
  }
  
  // 解析MongoDB URI
  const uri = new URL(MONGO_URI);
  const dbName = uri.pathname.substring(1) || 'zenith-destiny';
  
  // 构建mongorestore命令参数
  const args: string[] = [
    '--db', dbName, 
    '--drop', // 恢复前删除现有集合
    path.join(backupPath, dbName)
  ];
  
  // 如果有认证信息，添加到命令参数中
  if (uri.username && uri.password) {
    args.push('--username', uri.username);
    args.push('--password', uri.password);
    args.push('--authenticationDatabase', 'admin');
  }
  
  if (uri.hostname) {
    args.push('--host', uri.hostname);
  }
  
  if (uri.port) {
    args.push('--port', uri.port);
  }
  
  // 执行mongorestore命令
  console.log(`开始从 ${backupPath} 恢复数据库 ${dbName}`);
  
  return new Promise<boolean>((resolve, reject) => {
    const process = spawn('mongorestore', args);
    
    let stdout = '';
    let stderr = '';
    
    process.stdout.on('data', data => {
      stdout += data.toString();
    });
    
    process.stderr.on('data', data => {
      stderr += data.toString();
    });
    
    process.on('close', code => {
      if (code === 0) {
        console.log(`数据库恢复成功`);
        resolve(true);
      } else {
        console.error(`数据库恢复失败，退出代码: ${code}`);
        console.error(stderr);
        reject(new Error(`数据库恢复失败: ${stderr}`));
      }
    });
  });
}

/**
 * 列出所有可用备份
 */
function listBackups(): string[] {
  if (!fs.existsSync(BACKUP_DIR)) {
    return [];
  }
  
  return fs.readdirSync(BACKUP_DIR)
    .filter(file => file.startsWith('backup-') && fs.statSync(path.join(BACKUP_DIR, file)).isDirectory())
    .sort();
}

// 如果直接运行此脚本
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === 'backup') {
    createBackup()
      .then(() => cleanupOldBackups())
      .then(() => {
        console.log('备份过程完成');
      })
      .catch(error => {
        console.error('备份过程出错:', error);
        process.exit(1);
      });
  } else if (command === 'restore') {
    const backupPath = args[1];
    
    if (!backupPath) {
      console.error('必须提供备份路径');
      console.log('用法: node dbBackup.js restore <备份路径>');
      process.exit(1);
    }
    
    restoreBackup(backupPath)
      .then(success => {
        if (success) {
          console.log('恢复过程完成');
          process.exit(0);
        } else {
          console.error('恢复过程失败');
          process.exit(1);
        }
      })
      .catch(error => {
        console.error('恢复过程出错:', error);
        process.exit(1);
      });
  } else if (command === 'list') {
    const backups = listBackups();
    
    if (backups.length === 0) {
      console.log('没有找到备份');
    } else {
      console.log('可用备份:');
      backups.forEach(backup => {
        const stats = fs.statSync(path.join(BACKUP_DIR, backup));
        console.log(`- ${backup} (${stats.mtime.toLocaleString()})`);
      });
    }
  } else {
    console.log('用法:');
    console.log('  node dbBackup.js backup           # 创建新备份');
    console.log('  node dbBackup.js restore <path>   # 恢复指定备份');
    console.log('  node dbBackup.js list             # 列出所有备份');
  }
}

export {
  createBackup,
  restoreBackup,
  cleanupOldBackups,
  listBackups
}; 
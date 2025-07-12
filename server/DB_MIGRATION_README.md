# 数据库迁移与备份指南

本文档介绍如何使用Zenith Destiny项目中的数据库迁移、备份和恢复功能。

## 数据库初始化

首次设置数据库时，运行以下命令:

```bash
npm run db:init
```

此命令将:
1. 检查MongoDB是否已安装并运行
2. 创建必要的数据目录
3. 启动MongoDB服务（如果尚未运行）
4. 创建.env文件（如果尚不存在）
5. 运行初始数据迁移脚本

## 数据迁移

### 运行迁移

要应用所有未运行的迁移:

```bash
npm run db:migrate
```

### 创建新迁移

要创建新的数据库迁移脚本:

```bash
npm run db:create-migration <迁移名称>
```

例如:

```bash
npm run db:create-migration add-user-preferences
```

这将在`src/migrations`目录下创建一个新的迁移文件，格式为`YYYYMMDDHHMMSS_add-user-preferences.js`。

打开创建的文件，实现`up`函数中的迁移逻辑，以及`down`函数中的回滚逻辑。

## 数据库备份

### 创建备份

要创建数据库备份:

```bash
npm run db:backup
```

备份将保存在`backups`目录中，文件名格式为`backup-YYYYMMDDHHMMSS`。

### 列出备份

要列出所有可用备份:

```bash
npm run db:list-backups
```

### 恢复备份

要从备份恢复数据库:

```bash
npm run db:restore <备份路径>
```

例如:

```bash
npm run db:restore backups/backup-20250101120000
```

## 自动备份设置

要设置自动备份，可以使用crontab:

```bash
# 编辑crontab
crontab -e

# 添加以下行，每天凌晨2点运行备份脚本
0 2 * * * cd /path/to/project/server && ./backup-cron.sh >> ./logs/backup.log 2>&1
```

## 高级选项

### 环境变量

数据库配置可以通过以下环境变量自定义:

- `MONGO_URI`: MongoDB连接URI
- `BACKUP_DIR`: 备份目录路径
- `BACKUP_RETENTION_DAYS`: 保留备份的天数

这些变量可以在`.env`文件中设置。

### 直接使用脚本

脚本也可以直接执行:

```bash
# 备份脚本
node dist/scripts/dbBackup.js backup

# 迁移脚本
node dist/scripts/dbMigration.js
```

## 生产环境注意事项

1. 在生产环境中，建议使用MongoDB Atlas或其他托管服务
2. 确保备份保存到安全的位置，并定期测试恢复流程
3. 配置SMTP通知，在备份成功/失败时发送电子邮件通知
4. 监控迁移和备份日志，确保它们按预期工作 
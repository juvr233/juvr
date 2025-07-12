#!/bin/bash

# 数据库备份定时任务脚本
# 将此脚本添加到crontab中，例如:
# 0 2 * * * /path/to/backup-cron.sh >> /path/to/backup.log 2>&1

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 设置环境变量
if [ -f "$SCRIPT_DIR/.env" ]; then
  source "$SCRIPT_DIR/.env"
fi

# 备份日期格式
DATE=$(date +"%Y%m%d_%H%M%S")

# 备份保留天数
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-7}

# 备份目录
BACKUP_DIR=${BACKUP_DIR:-"$SCRIPT_DIR/backups"}
BACKUP_PATH="$BACKUP_DIR/backup-$DATE"

# 数据库连接信息
DB_URI=${MONGO_URI:-"mongodb://localhost:27017/zenith-destiny"}

# 解析URI
if [[ "$DB_URI" =~ mongodb://([^:]+):([^@]+)@([^:]+):([0-9]+)/(.+) ]]; then
  DB_USER="${BASH_REMATCH[1]}"
  DB_PASS="${BASH_REMATCH[2]}"
  DB_HOST="${BASH_REMATCH[3]}"
  DB_PORT="${BASH_REMATCH[4]}"
  DB_NAME="${BASH_REMATCH[5]}"
elif [[ "$DB_URI" =~ mongodb://([^:]+):([0-9]+)/(.+) ]]; then
  DB_HOST="${BASH_REMATCH[1]}"
  DB_PORT="${BASH_REMATCH[2]}"
  DB_NAME="${BASH_REMATCH[3]}"
else
  DB_HOST="localhost"
  DB_PORT="27017"
  DB_NAME="zenith-destiny"
fi

echo "====== 开始数据库备份 $(date) ======"

# 确保备份目录存在
mkdir -p "$BACKUP_DIR"

# 创建备份
echo "备份数据库 $DB_NAME 到 $BACKUP_PATH"

if [ -n "$DB_USER" ] && [ -n "$DB_PASS" ]; then
  mongodump --host "$DB_HOST" --port "$DB_PORT" --username "$DB_USER" --password "$DB_PASS" --authenticationDatabase admin --db "$DB_NAME" --out "$BACKUP_PATH"
else
  mongodump --host "$DB_HOST" --port "$DB_PORT" --db "$DB_NAME" --out "$BACKUP_PATH"
fi

# 检查备份是否成功
if [ $? -eq 0 ]; then
  echo "备份成功: $BACKUP_PATH"
  
  # 压缩备份
  tar -czf "$BACKUP_PATH.tar.gz" -C "$BACKUP_DIR" "backup-$DATE"
  
  if [ $? -eq 0 ]; then
    echo "备份压缩成功: $BACKUP_PATH.tar.gz"
    # 删除原始目录
    rm -rf "$BACKUP_PATH"
  else
    echo "备份压缩失败"
  fi
  
  # 清理旧备份
  echo "清理超过 $RETENTION_DAYS 天的旧备份"
  find "$BACKUP_DIR" -name "backup-*.tar.gz" -type f -mtime +$RETENTION_DAYS -delete
else
  echo "备份失败"
fi

echo "====== 备份完成 $(date) ======" 
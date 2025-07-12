#!/bin/sh

# 数据库备份脚本
# 将该脚本添加到crontab以定期执行
# 例如: 0 3 * * * /app/scripts/backup.sh

# 配置
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR=${BACKUP_DIR:-"/app/backups"}
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-30}
MONGO_URI=${MONGO_URI:-"mongodb://localhost:27017/divination"}

# 创建备份目录（如果不存在）
mkdir -p ${BACKUP_DIR}

echo "开始备份 - $(date)"

# 执行MongoDB备份
echo "执行mongodump..."
mongodump --uri="${MONGO_URI}" --out="${BACKUP_DIR}/${TIMESTAMP}" --gzip

if [ $? -ne 0 ]; then
  echo "备份失败！"
  exit 1
fi

# 压缩备份
echo "压缩备份文件..."
cd ${BACKUP_DIR}
tar -czf "${TIMESTAMP}.tar.gz" "${TIMESTAMP}"
rm -rf "${TIMESTAMP}"

# 记录备份信息
echo "备份完成：${BACKUP_DIR}/${TIMESTAMP}.tar.gz"
echo "备份大小：$(du -h ${TIMESTAMP}.tar.gz | cut -f1)"

# 清理旧备份
echo "清理超过 ${RETENTION_DAYS} 天的旧备份..."
find ${BACKUP_DIR} -name "*.tar.gz" -type f -mtime +${RETENTION_DAYS} -exec rm {} \;

echo "备份完成 - $(date)"

# 添加备份记录到数据库
if [ -n "$NODE_APP_INSTANCE" ]; then
  echo "更新备份记录到数据库..."
  curl -X POST -H "Content-Type: application/json" -d "{\"filename\":\"${TIMESTAMP}.tar.gz\",\"path\":\"${BACKUP_DIR}\",\"size\":\"$(du -b ${TIMESTAMP}.tar.gz | cut -f1)\"}" http://localhost:5000/api/admin/backup-records
fi

echo "==============================================="
echo "备份摘要:"
echo "日期：$(date)"
echo "文件名：${TIMESTAMP}.tar.gz"
echo "路径：${BACKUP_DIR}"
echo "==============================================="

exit 0 
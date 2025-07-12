#!/bin/bash

# 数据库初始化和启动脚本

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 检查MongoDB是否已安装
if ! command -v mongod &> /dev/null; then
  echo "MongoDB未安装，请先安装MongoDB"
  echo "可以访问 https://www.mongodb.com/try/download/community 获取安装指南"
  exit 1
fi

# 配置数据目录
DATA_DIR="./data/mongodb"
mkdir -p "$DATA_DIR"

# 检查MongoDB服务是否已在运行
if pgrep -x "mongod" > /dev/null; then
  echo "MongoDB已在运行"
else
  echo "启动MongoDB服务..."
  # 尝试使用标准的系统服务方式启动
  if command -v systemctl &> /dev/null && systemctl list-unit-files | grep -q mongodb; then
    sudo systemctl start mongodb || sudo systemctl start mongod
  # 尝试使用brew services启动(macOS)
  elif command -v brew &> /dev/null && brew services list | grep -q mongodb; then
    brew services start mongodb
  # 尝试手动启动
  else
    echo "使用本地数据目录启动MongoDB..."
    mongod --dbpath="$DATA_DIR" --fork --logpath="$DATA_DIR/mongod.log"
  fi
  
  # 检查是否启动成功
  sleep 3
  if pgrep -x "mongod" > /dev/null; then
    echo "MongoDB服务启动成功"
  else
    echo "MongoDB服务启动失败"
    exit 1
  fi
fi

# 检查.env文件是否存在
if [ ! -f ".env" ]; then
  echo "创建.env文件..."
  cp .env.example .env 2>/dev/null || echo "未找到.env.example模板文件"
  echo ".env文件已创建，请编辑该文件配置环境变量"
fi

# 运行数据迁移和初始化
echo "初始化数据库..."
npx ts-node src/scripts/dbMigration.ts

# 完成
echo "数据库服务已准备就绪"
echo ""
echo "运行命令启动应用服务器:"
echo "npm run dev" 
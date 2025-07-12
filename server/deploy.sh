#!/bin/bash

# 部署脚本 - 用于生产环境部署
# 使用方法: ./deploy.sh [版本标签]

# 获取版本标签
TAG=${1:-$(date +"%Y%m%d%H%M")}

# 显示部署信息
echo "====================================="
echo "Zenith Destiny API 部署脚本"
echo "版本: $TAG"
echo "====================================="

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
  echo "警告: 有未提交的更改。建议先提交更改。"
  read -p "是否继续? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# 检查Docker是否已安装
if ! command -v docker &> /dev/null; then
  echo "错误: Docker未安装。请先安装Docker。"
  exit 1
fi

# 检查Docker Compose是否已安装
if ! command -v docker-compose &> /dev/null; then
  echo "错误: Docker Compose未安装。请先安装Docker Compose。"
  exit 1
fi

# 创建.env.production文件（如果不存在）
if [ ! -f .env.production ]; then
  echo "创建.env.production文件..."
  cp .env.example .env.production
  echo "请编辑.env.production文件，设置生产环境配置。"
  read -p "按Enter键继续..."
fi

# 构建镜像
echo "构建Docker镜像..."
docker build -t zenith-destiny-api:$TAG .

# 标记最新版本
docker tag zenith-destiny-api:$TAG zenith-destiny-api:latest

# 导出环境变量
export TAG=$TAG

# 启动服务
echo "启动服务..."
docker-compose -f docker-compose.prod.yml up -d

# 显示服务状态
echo "服务状态:"
docker-compose -f docker-compose.prod.yml ps

# 显示日志
echo "显示服务日志(按Ctrl+C退出):"
docker-compose -f docker-compose.prod.yml logs -f api

echo "====================================="
echo "部署完成"
echo "API服务运行在: http://localhost:5000"
echo "=====================================" 
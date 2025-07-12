#!/bin/bash

# 命理解读AI服务启动脚本

echo "===== 启动命理解读AI服务 ====="

# 切换到服务器目录
cd "$(dirname "$0")"

# 安装依赖（如果需要）
echo "检查和安装依赖..."
npm install

# 初始化AI模型
echo "初始化AI模型..."
npm run init:ai

# 导入训练数据
echo "导入训练数据..."
npm run import:ai-data

# 启动服务器
echo "启动API服务器..."
npm run dev

echo "服务器已启动，可以通过 http://localhost:3000/api 访问API"

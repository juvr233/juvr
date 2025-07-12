#!/bin/bash

# 塔罗牌AI模型初始化脚本
# 用于导入训练数据、训练初始模型并启动AI服务

echo "开始初始化塔罗牌AI服务..."

# 确保目录存在
mkdir -p data/tarot
mkdir -p models/tarot

# 导入训练数据
echo "导入塔罗牌训练数据..."
node ./src/scripts/importTrainingData.js --model tarot

# 初始化AI模型
echo "初始化塔罗牌AI模型..."
node ./src/scripts/initAiModels.js --model tarot

# 启动AI服务
echo "启动AI服务..."
npm run start-ai-service

echo "塔罗牌AI服务初始化完成！"

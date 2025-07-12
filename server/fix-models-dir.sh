#!/bin/bash
# 修复模型目录脚本

echo "🔧 正在修复模型目录结构..."

# 创建必要的目录
mkdir -p /workspaces/juvr/server/data/models/tarot
mkdir -p /workspaces/juvr/server/data/models/numerology
mkdir -p /workspaces/juvr/server/data/models/iching
mkdir -p /workspaces/juvr/server/data/models/holistic

echo "✅ 创建目录完成"

# 如果已存在模型文件，复制到相应目录
if [ -f "/workspaces/juvr/server/data/models/tarot_inference_model.json" ]; then
  cp /workspaces/juvr/server/data/models/tarot_inference_model.json /workspaces/juvr/server/data/models/tarot/
  echo "✅ 复制塔罗牌模型文件完成"
fi

echo "🔎 检查模型文件..."
find /workspaces/juvr/server/data/models -type f -name "*.json" | sort

echo "🔧 模型目录修复完成"

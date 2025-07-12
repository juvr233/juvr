#!/bin/bash

echo "开始全面测试与修复系统..."

# 1. 检查依赖安装
echo "1. 检查依赖安装..."
cd /workspaces/juvr/server
npm install

# 2. 尝试构建项目
echo "2. 尝试构建项目..."
npm run build

# 3. 检查关键文件是否存在
echo "3. 检查关键文件..."
echo "检查模型文件..."
ls -la src/models/ | grep -E "\.(ts|js)$"

echo "检查控制器文件..."
ls -la src/controllers/ | grep -E "\.(ts|js)$"

echo "检查服务文件..."
ls -la src/services/ai/ | grep -E "\.(ts|js)$"

echo "检查路由文件..."
ls -la src/routes/ | grep -E "\.(ts|js)$"

# 4. 检查脚本文件
echo "4. 检查脚本文件..."
ls -la src/scripts/ | grep -E "\.(ts|js)$"

# 5. 检查配置文件
echo "5. 检查配置文件..."
ls -la src/config/ | grep -E "\.(ts|js)$"

echo "测试完成！如有错误，请检查上面的输出。"

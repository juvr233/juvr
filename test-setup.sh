#!/bin/bash

echo "=== 塔罗牌AI服务测试 ==="

# 检查必要的依赖
echo "1. 检查Node.js版本..."
node --version

echo "2. 检查npm版本..."
npm --version

# 安装前端依赖
echo "3. 安装前端依赖..."
npm install

# 安装后端依赖
echo "4. 安装后端依赖..."
cd server && npm install

# 检查TypeScript编译
echo "5. 检查后端TypeScript编译..."
npm run build

echo "6. 回到根目录..."
cd ..

# 构建前端
echo "7. 构建前端..."
npm run build

echo "=== 测试完成 ==="
echo "如果所有步骤都成功，您可以使用以下命令启动服务："
echo "npm run dev:all  # 同时启动前端和后端"
echo "或者分别启动："
echo "npm run dev      # 启动前端"
echo "npm run server   # 启动后端"

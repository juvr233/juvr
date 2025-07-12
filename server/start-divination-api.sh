#!/bin/bash

# 命理数据API启动脚本
# 作用：安装依赖并启动命理数据服务器

echo "开始启动命理数据API服务..."

# 定义颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查是否在server目录下
if [ ! -f "./package.json" ]; then
    echo -e "${RED}错误：请在server目录下运行此脚本${NC}"
    echo "请执行: cd server && ./start-divination-api.sh"
    exit 1
fi

echo -e "${YELLOW}安装依赖...${NC}"
npm install

# 检查.env文件是否存在
if [ ! -f "./.env" ]; then
    echo -e "${YELLOW}创建.env文件...${NC}"
    cat > .env << EOL
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/zenith_destiny
USE_MOCK_DB=true
JWT_SECRET=zhouyichan_tarot_numerology_secret_key_2025
JWT_EXPIRE=30d
EOL
    echo -e "${GREEN}.env文件已创建${NC}"
fi

# 构建应用
echo -e "${YELLOW}构建应用...${NC}"
npm run build

# 初始化数据库
echo -e "${YELLOW}初始化数据库...${NC}"
npm run seed:dev

# 启动服务器
echo -e "${GREEN}启动命理数据API服务器...${NC}"
echo -e "API将运行在 ${GREEN}http://localhost:5001/api${NC}"
echo -e "可通过 ${GREEN}http://localhost:5001/health${NC} 检查服务器状态"
echo -e "API文档可在${YELLOW}API_DOCUMENTATION.md${NC}中找到"
echo -e "按 Ctrl+C 可停止服务器"

npm run dev

#!/bin/bash

# 启动塔罗牌AI服务
# 此脚本执行完整的初始化、训练和启动流程

# 设置显示颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}===== 塔罗牌AI解读服务启动 =====${NC}"

# 安装依赖
echo -e "${GREEN}安装依赖...${NC}"
npm install

# 构建项目
echo -e "${GREEN}构建项目...${NC}"
npm run build

# 创建必要的目录
echo -e "${GREEN}创建数据目录...${NC}"
mkdir -p data/tarot
mkdir -p models/tarot

# 导入训练数据
echo -e "${GREEN}导入训练数据...${NC}"
npm run import:tarot-data

# 初始化和训练模型
echo -e "${GREEN}初始化并训练塔罗牌AI模型...${NC}"
npm run init:tarot-ai

# 启动服务
echo -e "${GREEN}启动AI服务...${NC}"
npm run start:ai-service

echo -e "${YELLOW}===== 塔罗牌AI服务已启动 =====${NC}"

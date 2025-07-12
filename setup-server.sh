#!/bin/bash

echo "开始安装和配置后端服务..."

# 确保在正确的目录
if [ ! -d "./server" ]; then
    echo "错误：找不到server目录，请确保你在项目根目录运行此脚本"
    exit 1
fi

# 进入服务器目录
cd server

echo "开始安装后端依赖..."
npm install

# 检查是否有MongoDB运行
echo "检查MongoDB服务..."
if command -v mongod &> /dev/null; then
    echo "MongoDB已安装"
else
    echo "警告：未检测到MongoDB安装，请确保MongoDB已安装并运行"
    echo "可访问 https://www.mongodb.com/try/download/community 下载安装"
fi

# 创建.env文件（如果不存在）
if [ ! -f ".env" ]; then
    echo "创建.env文件..."
    cat > .env << EOF
# 服务器配置
PORT=5000
NODE_ENV=development

# MongoDB 连接
MONGO_URI=mongodb://localhost:27017/zenith_destiny

# JWT密钥 (实际使用时请设置更复杂的密钥)
JWT_SECRET=zhouyichan_tarot_numerology_secret_key_2025

# 管理员账号
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123

# 跨域配置
CORS_ORIGIN=http://localhost:5173

# 日志级别
LOG_LEVEL=debug
EOF
    echo ".env文件已创建"
else
    echo ".env文件已存在，跳过创建"
fi

# 编译TypeScript文件
echo "编译TypeScript文件..."
npm run build

# 初始化数据库
echo "初始化数据库..."
npm run seed:dev

echo "后端服务安装和配置完成！"
echo "你可以使用以下命令来启动服务："
echo "  cd server && npm run dev"
echo "或者从项目根目录："
echo "  npm run server"

# 返回项目根目录
cd ..

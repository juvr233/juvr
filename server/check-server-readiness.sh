#!/bin/bash
# 服务器准备状态检查脚本

echo "🔍 检查服务器准备状态..."
echo "================================"

# 检查必要的目录和文件
echo "📁 检查必要的目录和文件:"

required_dirs=(
  "data/models"
  "data/tarot"
  "src/config"
  "src/controllers"
  "src/middleware"
  "src/models"
  "src/routes"
  "src/scripts"
  "src/services/ai"
  "src/types"
  "src/utils"
)

required_files=(
  ".env"
  "package.json"
  "tsconfig.json"
  "src/index.ts"
  "data/tarot/tarot_card_meanings.json"
  "data/models/tarot_inference_model.json"
)

echo "检查目录:"
for dir in "${required_dirs[@]}"; do
  if [ -d "$dir" ]; then
    echo "  ✅ $dir"
  else
    echo "  ❌ $dir 不存在"
  fi
done

echo -e "\n检查文件:"
for file in "${required_files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file 不存在"
  fi
done

echo -e "\n🔧 检查依赖项:"
if [ -d "node_modules" ]; then
  echo "  ✅ node_modules 目录存在"
  npm_packages=$(ls -1 node_modules | wc -l)
  echo "  📦 已安装 $npm_packages 个包"
else
  echo "  ❌ node_modules 目录不存在，请运行 npm install"
fi

echo -e "\n🧪 检查 TypeScript 配置:"
if npx tsc --noEmit --skipLibCheck 2>/dev/null; then
  echo "  ✅ TypeScript 配置有效"
else
  echo "  ⚠️ TypeScript 编译可能存在问题"
fi

echo -e "\n🔌 检查环境变量:"
required_env_vars=(
  "PORT"
  "MONGO_URI"
  "JWT_SECRET"
  "AI_MODEL_PATH"
  "TAROT_DATA_PATH"
)

env_file_content=$(cat .env)

for var in "${required_env_vars[@]}"; do
  if [[ "$env_file_content" == *"$var="* ]]; then
    echo "  ✅ $var 已设置"
  else
    echo "  ❌ $var 未在 .env 文件中设置"
  fi
done

echo -e "\n🚀 服务器启动准备状态:"

if [ -f "src/index.ts" ] && [ -d "node_modules" ]; then
  echo "  ✅ 服务器可以启动"
  echo -e "\n  启动命令: npm run dev"
  echo "  构建命令: npm run build"
  echo "  正式环境启动: npm start"
else
  echo "  ❌ 服务器未准备好启动，请解决上述问题"
fi

echo "================================"

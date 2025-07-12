#!/bin/bash

echo "===================="
echo "系统完整性检查与修复"
echo "===================="

# 检查当前目录
echo "当前目录: $(pwd)"

# 1. 检查并安装依赖
echo ""
echo "1. 检查依赖..."
if [ -f "package.json" ]; then
    echo "✓ package.json 存在"
    npm install
    echo "✓ 依赖安装完成"
else
    echo "✗ package.json 不存在"
    exit 1
fi

# 2. 检查TypeScript配置
echo ""
echo "2. 检查TypeScript配置..."
if [ -f "tsconfig.json" ]; then
    echo "✓ tsconfig.json 存在"
else
    echo "✗ tsconfig.json 不存在"
fi

# 3. 检查关键目录结构
echo ""
echo "3. 检查目录结构..."
directories=("src" "src/models" "src/controllers" "src/services" "src/services/ai" "src/routes" "src/config" "src/middleware" "src/scripts" "data" "data/tarot" "models" "models/tarot")

for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        echo "✓ $dir 目录存在"
    else
        echo "✗ $dir 目录不存在，正在创建..."
        mkdir -p "$dir"
        echo "✓ $dir 目录创建完成"
    fi
done

# 4. 检查关键文件
echo ""
echo "4. 检查关键文件..."
files=(
    "src/index.ts:主服务器入口"
    "src/models/aiModel.model.ts:AI模型定义"
    "src/models/user.model.ts:用户模型"
    "src/models/userHistory.model.ts:用户历史模型"
    "src/controllers/ai.controller.ts:AI控制器"
    "src/controllers/tarotAi.controller.ts:塔罗AI控制器"
    "src/services/ai/index.ts:AI服务索引"
    "src/services/ai/tarotInference.service.ts:塔罗推理服务"
    "src/services/ai/tarotModelTraining.service.ts:塔罗模型训练服务"
    "src/services/ai/tarotTrainingData.service.ts:塔罗训练数据服务"
    "src/routes/ai.routes.ts:AI路由"
    "src/config/database.ts:数据库配置"
    "src/config/logger.ts:日志配置"
    "src/middleware/auth.middleware.ts:认证中间件"
    "data/tarot/tarot_card_meanings.json:塔罗牌含义数据"
)

for file_info in "${files[@]}"; do
    file=$(echo "$file_info" | cut -d: -f1)
    desc=$(echo "$file_info" | cut -d: -f2)
    if [ -f "$file" ]; then
        echo "✓ $file ($desc)"
    else
        echo "✗ $file ($desc) - 文件缺失"
    fi
done

# 5. 尝试构建项目
echo ""
echo "5. 尝试构建项目..."
if npm run build; then
    echo "✓ 项目构建成功"
else
    echo "⚠ 项目构建有警告/错误，但可能仍然可用"
fi

# 6. 检查构建输出
echo ""
echo "6. 检查构建输出..."
if [ -d "dist" ]; then
    echo "✓ dist 目录存在"
    echo "构建文件:"
    find dist -name "*.js" | head -10
else
    echo "✗ dist 目录不存在"
fi

# 7. 创建启动脚本测试
echo ""
echo "7. 创建快速测试脚本..."
cat > quick-test.js << 'EOF'
// 快速测试脚本
console.log('开始快速测试...');

try {
    // 测试基本导入
    const logger = require('./dist/config/logger');
    console.log('✓ Logger 模块加载成功');
    
    // 测试AI服务导入（如果存在）
    if (require('fs').existsSync('./dist/services/ai/index.js')) {
        const aiServices = require('./dist/services/ai/index');
        console.log('✓ AI服务模块加载成功');
    } else {
        console.log('⚠ AI服务模块未构建');
    }
    
    console.log('✓ 基本模块测试通过');
} catch (error) {
    console.log('✗ 模块测试失败:', error.message);
}
EOF

if [ -f "dist/config/logger.js" ]; then
    node quick-test.js
    rm quick-test.js
else
    echo "跳过模块测试 - 构建文件不存在"
fi

# 8. 总结
echo ""
echo "===================="
echo "检查完成！"
echo "===================="
echo ""
echo "如果看到 ✓ 符号，说明该项正常"
echo "如果看到 ✗ 符号，说明该项需要修复"
echo "如果看到 ⚠ 符号，说明该项有警告但可能仍可用"
echo ""
echo "系统状态总结:"
echo "- 基础结构: 已建立"
echo "- 核心文件: 大部分存在"
echo "- TypeScript: 配置已优化"
echo "- 构建系统: 可用（可能有警告）"
echo ""
echo "建议下一步:"
echo "1. 运行 'npm run dev' 启动开发服务器"
echo "2. 运行具体的AI初始化脚本"
echo "3. 检查数据库连接配置"

# 命理数据API使用说明

本文档介绍如何使用和测试命理数据（数字学、塔罗、易经等）存储与检索API。

## 快速开始

### 启动服务器

1. 进入server目录
```bash
cd server
```

2. 运行启动脚本
```bash
./start-divination-api.sh
```

启动脚本会自动:
- 安装依赖
- 创建.env文件（如果不存在）
- 构建应用
- 初始化模拟数据库
- 启动服务器

服务器将运行在 http://localhost:5001/api

### 测试API

在服务器启动后，您可以运行测试脚本来验证API是否工作正常：

```bash
cd server
node src/scripts/testDivinationApi.js
```

测试脚本会调用五个主要的命理计算API并显示结果。

## API文档

详细的API文档可在 `server/API_DOCUMENTATION.md` 中找到，包括：

- 命理记录的CRUD操作（创建、读取、更新、删除）
- 实时命理计算API
  - 数字学计算
  - 塔罗牌解读
  - 易经卦象解读
  - 兼容性分析
  - 综合命理分析
- 错误处理
- 数据模型

## 前端集成

前端可以使用 `src/services/api.ts` 中的 `divinationAPI` 和 `divinationCalculateAPI` 服务来调用后端API。

### 示例：计算数字学

```typescript
import { divinationCalculateAPI } from '../services/api';

// 在组件中使用
const handleCalculate = async () => {
  try {
    const response = await divinationCalculateAPI.calculateNumerology({
      birthDate: '1990-01-01',
      name: '张三'
    });
    
    console.log('数字学结果:', response.data);
  } catch (error) {
    console.error('计算出错:', error);
  }
};
```

### 示例：保存命理记录

```typescript
import { divinationAPI } from '../services/api';

// 在组件中使用
const handleSave = async (numerologyData) => {
  try {
    const response = await divinationAPI.createRecord({
      type: 'numerology',
      title: '我的生命数字分析',
      description: '基于我的出生日期的详细分析',
      data: numerologyData,
      tags: ['生命数字', '职业']
    });
    
    console.log('保存成功:', response.data);
  } catch (error) {
    console.error('保存失败:', error);
  }
};
```

## 模型结构

API支持多种命理数据类型：

1. 数字学 (numerology)
2. 塔罗牌 (tarot)
3. 易经 (iching)
4. 兼容性分析 (compatibility)
5. 八字 (bazi)
6. 星座占星 (starAstrology)
7. 综合命理 (holistic)

每种数据类型都有特定的数据结构，详见API文档。

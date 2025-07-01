# Zenith Destiny 项目API集成指南


## 一、系统架构概览

系统由前端（React+TypeScript+Vite）和后端（Node.js+Express+MongoDB）组成：

- **前端**：用户界面、命理计算、结果展示
- **后端**：命理计算API、AI解读服务、用户认证、支付系统

## 二、后端API体系

### 1. 基础API路由

```typescript
// 主要API路由结构
router.use('/auth', authRoutes);        // 用户认证
router.use('/payments', paymentRoutes);  // 支付服务
router.use('/tarot', tarotRoutes);      // 塔罗牌服务
router.use('/iching', iChingRoutes);    // 易经服务 
router.use('/home', homeRoutes);        // 首页数据
router.use('/history', historyRoutes);  // 历史记录
router.use('/divination', divinationRoutes); // 命理数据
router.use('/ai', aiRoutes);            // AI解读服务
```

### 2. AI解读服务API

```typescript
// AI服务路由
// 管理接口 - 需要管理员权限
router.get('/models', protect, admin, aiController.getAiModelsStatus);
router.get('/models/:modelType', protect, admin, aiController.getAiModelDetails);
router.post('/train/collect', protect, admin, aiController.collectTrainingData);
router.post('/train/clean', protect, admin, aiController.cleanTrainingData);
router.post('/train/start', protect, admin, aiController.startModelTraining);
router.get('/validate/:modelType', protect, admin, aiController.validateModel);

// 用户接口 - 生成AI解读
router.post('/reading', aiController.generateAiReading);
router.post('/reading/batch', aiController.batchGenerateAiReading);
router.post('/tarot/reading', tarotAiController.generateTarotReading);
router.post('/tarot/evaluate', protect, tarotAiController.evaluateTarotReading);
```

### 3. 命理数据API

```typescript
// 命理数据路由
// 需要认证的API
protectedRoutes.post('/', createDivinationRecord);
protectedRoutes.get('/', getDivinationRecords);
protectedRoutes.get('/:id', getDivinationDetail);
protectedRoutes.put('/:id', updateDivinationRecord);
protectedRoutes.post('/:id/share', shareDivinationRecord);
protectedRoutes.delete('/:id', deleteDivinationRecord);

// 实时计算API - 不需要认证
router.post('/calculate/numerology', calculateNumerology);
router.post('/calculate/tarot', generateTarotReading);
router.post('/calculate/iching', generateIChingReading);
router.post('/calculate/compatibility', calculateCompatibility);
router.post('/calculate/holistic', generateHolisticReading);
```

## 三、前端集成方法

### 1. 配置API服务

在前端 api.ts 中已经封装了API调用：

```typescript
// API基础URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// 创建axios实例
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10秒超时
});

// 请求拦截器 - 添加认证token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 2. 调用命理计算API示例

以数字学计算为例：

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

### 3. 调用AI解读服务示例

```typescript
// 获取AI塔罗牌解读
async function getTarotReading(question, spread, cards) {
  try {
    const response = await api.post('/api/ai/tarot/reading', {
      question,
      spread,
      cards
    });
    
    if (response.data.success) {
      return response.data.reading;
    } else {
      throw new Error(response.data.message || '解读失败');
    }
  } catch (error) {
    console.error('获取塔罗牌解读失败:', error);
    throw error;
  }
}
```

## 四、开发流程

### 1. 环境配置

1. 设置环境变量（创建 `.env` 文件）：
   ```bash
   cd server
   cp .env.example .env
   # 编辑.env文件，设置必要的环境变量
   ```

2. 安装依赖：
   ```bash
   # 后端依赖
   cd server
   npm install
   
   # 前端依赖
   cd ..
   npm install
   ```

### 2. 启动开发服务器

```bash
# 启动后端服务
cd server
npm run dev

# 启动前端服务
cd ..
npm run dev
```

### 3. 测试API功能

```bash
# 测试命理数据API
cd server
node src/scripts/testDivinationApi.js

# 测试AI服务
node test-ai-service.js
```

### 4. API请求/响应示例

#### 数字学计算

**请求**:
```json
{
  "birthDate": "1990-01-01",
  "name": "张三"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "birthDate": "1990-01-01",
    "name": "张三",
    "lifePathNumber": 3,
    "destinyNumber": 5,
    "interpretations": {
      "lifePath": "生命数字3的解释..."
    }
  }
}
```

#### 塔罗牌解读

**请求**:
```json
{
  "question": "我的职业发展方向如何？",
  "spread": "three-card",
  "cards": [
    { "name": "愚者", "position": "过去", "isReversed": false },
    { "name": "星星", "position": "现在", "isReversed": true },
    { "name": "太阳", "position": "未来", "isReversed": false }
  ]
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "question": "我的职业发展方向如何？",
    "cards": [
      {
        "name": "愚者",
        "position": "过去",
        "isReversed": false,
        "meaning": "愚者牌在过去位置的解释..."
      },
      {
        "name": "星星",
        "position": "现在",
        "isReversed": true,
        "meaning": "逆位星星牌在现在位置的解释..."
      },
      {
        "name": "太阳",
        "position": "未来",
        "isReversed": false,
        "meaning": "太阳牌在未来位置的解释..."
      }
    ],
    "overallInterpretation": "整体塔罗牌解读..."
  }
}
```

## 五、部署与维护

1. **构建应用**:
   ```bash
   # 构建后端
   cd server
   npm run build
   
   # 构建前端
   cd ..
   npm run build
   ```

2. **启动生产服务**:
   ```bash
   # 启动后端服务
   cd server
   npm start
   ```

3. **监控与故障排除**:
   - 使用日志系统监控API调用
   - 定期检查数据库连接
   - 监控AI模型性能

## 六、安全与性能优化

1. **安全措施**:
   - 使用JWT保护认证路由
   - 实施请求速率限制
   - 设置安全的HTTP头

2. **性能优化**:
   - 实施缓存策略
   - 分页查询大数据集
   - 优化数据库查询

通过遵循这个指南，您可以顺利开发和集成Zenith Destiny项目的所有API功能。根据用户需求，您可以进一步扩展和优化API服务。
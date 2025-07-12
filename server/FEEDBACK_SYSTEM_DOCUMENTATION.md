# 用户反馈系统文档

## 概述

用户反馈系统是我们持续优化AI模型计划的核心组成部分。该系统允许用户对各种命理解读结果提供评分和反馈，这些数据将用于:

1. 监控和评估AI模型的性能
2. 识别需要改进的领域
3. 收集用于训练和改进AI模型的数据
4. 为用户提供更个性化和准确的命理解读

## 系统架构

反馈系统由以下组件组成:

### 1. 数据模型

- `UserFeedback`: 存储用户对特定解读的反馈
  - 主要字段: userId, readingId, readingType, rating, comment, helpful, accurate, usedForTraining
  - 索引: (userId, readingId), (readingType, rating), (usedForTraining, rating)

- `FeedbackStats`: 存储全局和特定类型的反馈统计信息
  - 结构: 全局统计和按解读类型分类的统计

### 2. API端点

| 方法 | 端点 | 描述 | 权限 |
|------|------|------|------|
| POST | /api/feedback | 提交反馈 | 需要认证 |
| GET | /api/feedback/stats/:readingType | 获取特定类型的反馈统计 | 需要认证 |
| GET | /api/feedback/reading/:readingId | 获取特定解读的所有反馈 | 需要认证 |
| GET | /api/feedback/training | 获取可用于训练的反馈 | 需要认证 |
| POST | /api/feedback/mark-used | 将反馈标记为已用于训练 | 需要认证 |

### 3. 前端组件

- `FeedbackForm`: 用于收集用户反馈的React组件
  - 功能: 评分系统、文本反馈、有用度和准确度评估

### 4. A/B测试系统

- `ABTestingService`: 用于评估不同AI模型版本性能的服务
  - 根据用户ID分配测试变体
  - 收集和分析测试结果
  - 支持多种测试配置

## 数据流程

1. 用户收到解读结果后，可以通过`FeedbackForm`组件提交反馈
2. 反馈数据通过API保存到`UserFeedback`集合中
3. 反馈数据会实时更新`FeedbackStats`统计信息
4. 高质量的反馈可用于训练和改进AI模型
5. 通过A/B测试比较不同模型版本的表现

## 反馈质量评估

系统使用以下标准评估反馈质量:

1. 评分值 (1-5星)
2. 用户是否认为解读有用 (helpful)
3. 用户是否认为解读准确 (accurate)
4. 评论内容的长度和质量 (适用于训练)

## 实现计划

### 第一阶段: 用户反馈收集系统 (已完成)
- [x] 创建`UserFeedback`模型
- [x] 实现反馈API端点
- [x] 开发前端`FeedbackForm`组件
- [x] 更新MongoDB初始化脚本

### 第二阶段: 反馈分析仪表板 (进行中)
- [ ] 开发统计数据聚合服务
- [ ] 创建管理员反馈仪表板
- [ ] 实现反馈趋势分析
- [ ] 添加导出功能

### 第三阶段: AI模型训练集成 (计划中)
- [ ] 实现反馈数据提取和转换
- [ ] 将高质量反馈整合到训练流程
- [ ] 开发模型评估框架
- [ ] 实现基于反馈的模型自动调优

## 使用指南

### 收集用户反馈

在任何命理解读结果页面中集成`FeedbackForm`组件:

```jsx
import FeedbackForm from './components/FeedbackForm';

// 在解读结果组件中
<FeedbackForm 
  readingId={readingId} 
  readingType="tarot" 
  onFeedbackSubmitted={handleFeedbackSubmitted} 
/>
```

### 获取反馈统计

使用前端API服务获取统计数据:

```javascript
import { feedbackAPI } from './services/api';

// 获取塔罗牌解读的反馈统计
const stats = await feedbackAPI.getFeedbackStats('tarot');
console.log(`平均评分: ${stats.averageRating}`);
console.log(`总反馈数: ${stats.totalCount}`);
```

### 实现A/B测试

使用A/B测试服务比较不同模型:

```typescript
import { ABTestingService } from './services/ai/abTesting.service';

// 创建测试服务实例
const abTestingService = new ABTestingService();

// 为用户分配测试变体
const variantId = abTestingService.assignTestVariant(userId, 'tarot_inference');

// 根据分配的变体选择模型
const model = models.find(m => m.id === variantId);

// 记录测试结果
abTestingService.recordResult({
  variantId,
  userId,
  testName: 'tarot_inference',
  success: true,
  metrics: { responseTime: 0.8, feedbackRating: 4.5 }
});
```

## 注意事项与最佳实践

1. 用户反馈应该是可选的，不要过度打扰用户
2. 确保反馈表单简洁易用，减少摩擦
3. 透明地告知用户他们的反馈将如何被使用
4. 定期分析反馈数据，识别改进机会
5. 保持A/B测试变体之间的平衡，避免过早优化

## 指标与监控

关键性能指标 (KPIs):

- 每种解读类型的平均评分
- 反馈提交率 (解读次数与反馈次数的比率)
- 模型准确性评分趋势
- A/B测试成功率差异

## 后续发展

- 实现更复杂的情感分析，从文本反馈中提取有价值的见解
- 开发自适应学习系统，根据用户反馈自动调整模型
- 添加个性化推荐系统，基于用户反馈提供相关命理服务
- 实现用户群体细分，为不同用户类型提供定制化体验 
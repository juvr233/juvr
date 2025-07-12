# 缓存优化系统文档

## 概述

本文档详细介绍了系统中实现的多级缓存优化策略，旨在提高应用性能、减少数据库负载并改善用户体验。缓存系统采用了内存缓存和Redis缓存的两级架构，结合了智能缓存失效和自适应缓存策略。

## 架构设计

### 多级缓存架构

缓存系统采用两级架构：

1. **L1缓存（内存缓存）**：
   - 存储在应用服务器内存中
   - 访问速度极快，延迟低
   - 适合频繁访问的热点数据
   - 容量有限，使用LRU（最近最少使用）策略进行管理

2. **L2缓存（Redis缓存）**：
   - 存储在Redis服务器中
   - 持久化存储，服务重启后仍然可用
   - 容量大，适合大量数据
   - 可在多个应用实例间共享

### 关键组件

1. **CacheManager服务**：
   - 核心缓存管理组件
   - 提供统一的缓存接口
   - 实现缓存项自动过期
   - 支持缓存统计和监控

2. **缓存中间件**：
   - 提供基于路由的缓存功能
   - 支持条件缓存和自定义缓存键
   - 提供不同粒度的缓存控制

## 使用指南

### 基本用法

#### 直接使用CacheManager

```typescript
import cacheManager from '../services/cacheManager.service';

// 设置缓存
await cacheManager.set('user:123', userData, 300000, 600);  // 内存缓存5分钟，Redis缓存10分钟

// 获取缓存
const userData = await cacheManager.get('user:123');

// 删除缓存
await cacheManager.delete('user:123');
```

#### 使用缓存中间件

```typescript
import { routeCache } from '../middleware/cache.middleware';

// 为整个路由应用缓存（缓存1小时）
router.use('/api/products', routeCache(3600), productsController);

// 为特定端点应用缓存（缓存5分钟）
router.get('/api/product/:id', routeCache(300), productController.getById);
```

### 高级用法

#### 自定义缓存键

```typescript
import { routeCache, createCacheKey } from '../middleware/cache.middleware';

// 使用自定义键生成器
router.get('/api/user/:id/profile', routeCache(600, (req) => {
  return `user:${req.params.id}:profile:${req.query.lang || 'default'}`;
}), userController.getProfile);
```

#### 条件缓存

```typescript
import { advancedCacheMiddleware } from '../middleware/cache.middleware';

// 仅为非认证用户缓存
router.get('/api/public-data', advancedCacheMiddleware({
  ttl: 1800,  // 30分钟
  condition: (req) => !req.user,  // 仅当没有用户时缓存
  keyPrefix: 'public:'
}), publicDataController.getData);
```

## 缓存策略指南

### 缓存时间选择

根据数据特性选择适当的缓存时间：

| 数据类型 | 建议缓存时间 | 说明 |
|---------|------------|------|
| 静态内容 | 24小时+ | 如塔罗牌定义、易经卦象等基本不变的数据 |
| 用户无关的动态内容 | 1-6小时 | 如公共文章、通用推荐等 |
| 用户相关的非敏感内容 | 5-30分钟 | 如用户历史记录、个人资料等 |
| 频繁变化的内容 | 1-5分钟 | 如评论、点赞数等 |
| 敏感数据 | 不缓存 | 如支付信息、安全凭证等 |

### 缓存键命名约定

良好的缓存键命名有助于管理和调试：

- 使用冒号分隔不同部分：`entity:id:attribute`
- 包含版本信息以便于缓存失效：`users:v2:123`
- 对于列表，包含过滤和分页信息：`products:category:5:page:2:limit:20`

示例：
```
user:123:profile
tarot:readings:spread:celtic-cross
iching:hexagram:1:interpretation
```

### 缓存失效策略

1. **基于时间的自动过期**：
   - 默认策略，设置TTL（生存时间）
   - 适用于大多数场景

2. **主动失效**：
   - 当数据发生变化时主动删除相关缓存
   - 示例：用户更新个人资料后，删除其个人资料缓存

```typescript
// 示例：更新用户后清除相关缓存
async function updateUser(userId, userData) {
  // 更新数据库
  await User.findByIdAndUpdate(userId, userData);
  
  // 清除相关缓存
  await cacheManager.delete(`user:${userId}:profile`);
  await cacheManager.delete(`user:${userId}:settings`);
}
```

3. **模式失效**：
   - 使用前缀匹配删除一组相关缓存
   - 适用于关联数据变更

```typescript
// 示例：发布新文章后清除文章列表缓存
async function publishArticle(article) {
  // 保存文章
  await article.save();
  
  // 清除所有文章列表缓存
  await clearCacheByPrefix('articles:list');
}
```

## 性能监控与优化

### 缓存统计

CacheManager提供了统计功能，可用于监控缓存性能：

```typescript
const stats = cacheManager.getStats();
console.log(stats);
// 输出:
// {
//   memorySize: 120,
//   hitCount: { memory: 850, redis: 320, miss: 230 },
//   hitRate: "83.57%",
//   topAccessedKeys: [...]
// }
```

### 缓存优化建议

1. **分析缓存命中率**：
   - 目标命中率应大于80%
   - 低命中率表明缓存策略可能需要调整

2. **识别热点数据**：
   - 使用`topAccessedKeys`识别最常访问的数据
   - 考虑为这些数据提供更长的缓存时间

3. **调整缓存大小**：
   - 如果内存使用率高，考虑增加`maxMemoryItems`
   - 监控Redis内存使用情况，必要时调整配置

4. **优化缓存粒度**：
   - 过大的缓存项可能导致网络传输开销
   - 过小的缓存项可能导致缓存管理开销增加

## 最佳实践

1. **避免缓存敏感数据**：
   - 不要缓存密码、支付信息等敏感数据
   - 对于必须缓存的敏感数据，确保加密存储

2. **防止缓存穿透**：
   - 对于不存在的数据，也缓存空结果（带短TTL）
   - 使用布隆过滤器预先过滤不存在的键

3. **防止缓存雪崩**：
   - 为缓存项设置随机过期时间，避免同时过期
   - 实现熔断机制，在缓存失效时限制数据库访问

4. **处理竞态条件**：
   - 使用"双重检查锁定"模式处理并发缓存更新
   - 考虑使用分布式锁防止多实例并发更新

## 故障排除

### 常见问题

1. **缓存未命中**：
   - 检查缓存键是否正确构造
   - 验证TTL设置是否过短
   - 确认数据是否已被其他进程删除

2. **Redis连接问题**：
   - 检查Redis服务器状态
   - 验证连接配置是否正确
   - 查看Redis错误日志

3. **内存使用过高**：
   - 减少`maxMemoryItems`设置
   - 缩短热点数据的TTL
   - 考虑增加服务器内存

### 调试技巧

1. **启用调试日志**：
   - 设置`NODE_ENV=development`获取详细缓存日志
   - 查看缓存命中/未命中情况

2. **监控Redis指标**：
   - 使用`redis-cli info`查看Redis状态
   - 监控`keyspace_hits`和`keyspace_misses`评估命中率

3. **使用缓存头**：
   - 检查响应中的`X-Cache`头（HIT/MISS）
   - 使用浏览器开发工具分析缓存行为

## 结论

多级缓存系统是提高应用性能和可扩展性的关键组件。通过合理配置和使用本文档中描述的缓存策略，可以显著减少数据库负载，降低响应时间，提升用户体验。

定期审查缓存性能指标，并根据应用负载特性调整缓存策略，将确保系统在高负载情况下仍能保持良好性能。 
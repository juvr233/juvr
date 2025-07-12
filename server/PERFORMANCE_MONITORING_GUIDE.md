# 性能监控系统文档

## 概述

性能监控系统是我们应用程序的核心组件，用于跟踪、收集和分析应用程序的性能指标。该系统旨在帮助开发团队和运维人员了解应用程序的运行状况，识别性能瓶颈，并在问题出现之前进行预防性维护。

本文档详细介绍了性能监控系统的架构、配置和使用方法，以及如何解读收集到的指标。

## 系统架构

性能监控系统由以下组件组成：

1. **监控服务（MonitoringService）**：核心服务，负责收集、存储和提供应用程序性能指标。
2. **性能中间件（Performance Middleware）**：Express中间件，用于跟踪HTTP请求的性能指标。
3. **指标控制器（Metrics Controller）**：提供API端点，用于访问收集到的性能指标。
4. **指标路由（Metrics Routes）**：定义API路由，将请求路由到相应的控制器方法。

### 数据流

```
客户端请求 → 性能中间件 → 应用程序处理 → 响应
                ↓
            监控服务 ← 指标控制器 ← 指标请求
                ↓
            指标存储
```

## 监控的指标类型

系统收集以下类型的性能指标：

### 1. 请求指标（Request Metrics）

- **请求计数**：按路径、方法和状态码分类的请求总数
- **响应时间**：请求处理时间（毫秒）
- **慢请求**：处理时间超过阈值（默认1000毫秒）的请求
- **请求路径分析**：按路径分组的请求统计

### 2. 资源使用指标（Resource Metrics）

- **CPU使用率**：应用程序CPU使用百分比
- **内存使用**：应用程序内存使用情况（RSS、堆内存等）
- **系统内存**：系统总内存和可用内存
- **进程运行时间**：应用程序运行时间

### 3. 自定义指标

系统支持以下类型的自定义指标：

- **计数器（Counter）**：单调递增的计数器
- **仪表（Gauge）**：可以上升或下降的数值
- **直方图（Histogram）**：对数值分布进行采样
- **摘要（Summary）**：类似于直方图，但可以计算百分位数

## 访问指标

### API端点

性能监控系统提供以下API端点：

1. **Prometheus格式指标**
   - 路径: `/api/metrics/prometheus`
   - 方法: `GET`
   - 权限: API密钥认证
   - 描述: 以Prometheus格式返回所有指标，可用于Prometheus监控系统

2. **健康指标**
   - 路径: `/api/metrics/health`
   - 方法: `GET`
   - 权限: 管理员
   - 描述: 返回应用程序健康状况指标，包括内存使用、CPU使用等

3. **请求指标**
   - 路径: `/api/metrics/requests`
   - 方法: `GET`
   - 权限: 管理员
   - 参数:
     - `startTime`: 开始时间戳（可选）
     - `endTime`: 结束时间戳（可选）
     - `full`: 是否返回完整指标（默认false）
   - 描述: 返回请求相关的指标和统计信息

4. **资源使用指标**
   - 路径: `/api/metrics/resources`
   - 方法: `GET`
   - 权限: 管理员
   - 参数:
     - `startTime`: 开始时间戳（可选）
     - `endTime`: 结束时间戳（可选）
     - `full`: 是否返回完整指标（默认false）
   - 描述: 返回资源使用相关的指标和统计信息

### 示例请求

#### 获取Prometheus格式指标

```bash
curl -H "X-API-Key: your-api-key" http://localhost:3000/api/metrics/prometheus
```

响应:
```
# HELP http_requests_total counter
# TYPE http_requests_total counter
http_requests_total{method="GET",path="/api/tarot",status="200"} 42
# HELP http_request_duration_ms histogram
# TYPE http_request_duration_ms histogram
http_request_duration_ms{method="GET",path="/api/tarot"} 123.45
# HELP system_memory_usage_percent gauge
# TYPE system_memory_usage_percent gauge
system_memory_usage_percent 35.2
```

#### 获取请求指标

```bash
curl -H "Authorization: Bearer your-token" http://localhost:3000/api/metrics/requests
```

响应:
```json
{
  "summary": {
    "totalRequests": 1250,
    "statusCodes": {
      "200": 1180,
      "400": 45,
      "500": 25
    },
    "avgResponseTime": 78.5,
    "slowRequestsCount": 15,
    "topPaths": [
      {
        "path": "/api/tarot",
        "count": 523,
        "avgResponseTime": 85.3,
        "methods": {
          "GET": 450,
          "POST": 73
        }
      },
      ...
    ]
  },
  "metrics": [...]
}
```

## 配置

### 性能中间件配置

性能中间件可以在应用程序入口点（如`index.ts`）中配置：

```typescript
import { performanceMonitoring, slowRequestTracking, memoryUsageTracking } from './middleware/performance.middleware';

// 添加性能监控中间件
app.use(performanceMonitoring);
app.use(slowRequestTracking(1000)); // 跟踪超过1000ms的请求
app.use(memoryUsageTracking);
```

### 监控服务配置

监控服务使用单例模式，可以通过以下方式获取实例：

```typescript
import { MonitoringService } from '../services/monitoring.service';

const monitoringService = MonitoringService.getInstance();
```

可配置的参数包括：

- **资源指标收集间隔**：默认为60秒，可通过`startResourceMetricsCollection(intervalMs)`方法配置
- **指标保留期**：默认为24小时，在`MonitoringService`构造函数中配置
- **最大请求指标数**：默认为10000，在`MonitoringService`构造函数中配置

## 最佳实践

### 监控关键指标

以下是建议监控的关键指标：

1. **响应时间**：平均响应时间、95和99百分位响应时间
2. **错误率**：5xx和4xx状态码的比例
3. **系统资源**：CPU和内存使用率
4. **请求吞吐量**：每秒请求数

### 设置警报

建议为以下情况设置警报：

1. **高错误率**：5xx错误率超过1%
2. **长响应时间**：95百分位响应时间超过1000毫秒
3. **高资源使用率**：CPU使用率超过80%或内存使用率超过85%
4. **异常请求模式**：请求数突然增加或减少

### 性能优化

基于收集的指标，可以考虑以下优化：

1. **识别热点路径**：优化访问频率高的API端点
2. **缓存常用数据**：减少数据库查询和计算密集型操作
3. **优化慢请求**：重点关注响应时间长的请求
4. **资源扩展**：根据资源使用情况考虑水平或垂直扩展

## 与外部监控系统集成

### Prometheus集成

系统提供了Prometheus格式的指标端点，可以配置Prometheus服务器抓取这些指标：

```yaml
scrape_configs:
  - job_name: 'divination-api'
    scrape_interval: 15s
    metrics_path: '/api/metrics/prometheus'
    scheme: 'http'
    static_configs:
      - targets: ['localhost:3000']
    bearer_token: 'your-api-key'
```

### Grafana仪表板

可以使用Grafana创建仪表板，可视化从Prometheus收集的指标。建议的仪表板面板包括：

1. **请求概览**：请求总数、错误率、平均响应时间
2. **热点端点**：按请求数和响应时间排序的前10个API端点
3. **资源使用**：CPU和内存使用率随时间的变化
4. **错误分析**：按状态码和路径分类的错误

## 故障排除

### 常见问题

1. **指标不更新**
   - 检查性能中间件是否正确配置
   - 验证监控服务是否正常运行

2. **内存使用过高**
   - 检查指标保留期和最大请求指标数设置
   - 考虑减少收集的指标详细程度

3. **Prometheus无法抓取指标**
   - 确认API密钥配置正确
   - 检查网络连接和防火墙设置

### 日志

性能监控系统使用应用程序的日志系统记录关键事件和错误。相关日志包括：

- 资源指标收集启动和停止
- 指标收集错误
- 慢请求警告
- 高内存使用警告

## 结论

性能监控系统为应用程序提供了全面的性能可见性，帮助开发和运维团队了解应用程序的运行状况，识别性能瓶颈，并在问题影响用户之前进行预防性维护。通过持续监控和优化，可以确保应用程序保持高性能和可靠性。 
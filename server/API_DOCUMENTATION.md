# API文档

本文档详细描述了系统的所有API接口，包括请求方法、URL、参数、响应格式和示例。

## 目录

1. [认证](#认证)
   - [注册用户](#注册用户)
   - [用户登录](#用户登录)
   - [刷新令牌](#刷新令牌)
   - [重置密码请求](#重置密码请求)
   - [验证重置令牌](#验证重置令牌)
   - [重置密码](#重置密码)
   - [退出登录](#退出登录)

2. [用户管理](#用户管理)
   - [获取当前用户](#获取当前用户)
   - [更新用户资料](#更新用户资料)
   - [修改密码](#修改密码)
   - [删除账户](#删除账户)

3. [塔罗牌服务](#塔罗牌服务)
   - [获取塔罗牌列表](#获取塔罗牌列表)
   - [获取塔罗牌详情](#获取塔罗牌详情)
   - [请求塔罗牌解读](#请求塔罗牌解读)
   - [获取牌阵模板列表](#获取牌阵模板列表)

4. [易经服务](#易经服务)
   - [获取卦象列表](#获取卦象列表)
   - [获取卦象详情](#获取卦象详情)
   - [请求易经解读](#请求易经解读)
   - [生成随机卦象](#生成随机卦象)

5. [数字学服务](#数字学服务)
   - [请求数字学解读](#请求数字学解读)
   - [获取数字学特质详情](#获取数字学特质详情)
   - [兼容性分析](#兼容性分析)

6. [支付服务](#支付服务)
   - [获取可购买服务列表](#获取可购买服务列表)
   - [创建支付会话](#创建支付会话)
   - [验证购买状态](#验证购买状态)
   - [获取用户订单](#获取用户订单)
   - [Shopify支付](#shopify支付)

7. [历史记录](#历史记录)
   - [获取用户历史记录](#获取用户历史记录)
   - [获取历史记录详情](#获取历史记录详情)
   - [删除历史记录](#删除历史记录)
   - [分享历史记录](#分享历史记录)

8. [推荐服务](#推荐服务)
   - [获取个性化推荐](#获取个性化推荐)
   - [获取热门产品](#获取热门产品)

9. [健康检查](#健康检查)
   - [基本健康检查](#基本健康检查)
   - [深度健康检查](#深度健康检查)
   - [系统状态](#系统状态)

## 认证

所有受保护的API端点需要在请求头中包含有效的JWT令牌：

```
Authorization: Bearer <your_jwt_token>
```

### 注册用户

**URL**: `/api/auth/register`

**方法**: `POST`

**描述**: 注册新用户

**请求体**:
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!"
}
```

**成功响应** (状态码 201):
```json
{
  "success": true,
  "message": "用户注册成功",
  "user": {
    "id": "6123456789abcdef12345678",
    "username": "newuser",
    "email": "user@example.com",
    "createdAt": "2023-07-01T12:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**错误响应** (状态码 400):
```json
{
  "success": false,
  "message": "邮箱已被注册"
}
```

### 用户登录

**URL**: `/api/auth/login`

**方法**: `POST`

**描述**: 用户登录并获取令牌

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**成功响应** (状态码 200):
```json
{
  "success": true,
  "user": {
    "id": "6123456789abcdef12345678",
    "username": "newuser",
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**错误响应** (状态码 401):
```json
{
  "success": false,
  "message": "无效的邮箱或密码"
}
```

### 刷新令牌

**URL**: `/api/auth/refresh`

**方法**: `POST`

**描述**: 使用刷新令牌获取新的访问令牌

**请求体**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**成功响应** (状态码 200):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**错误响应** (状态码 401):
```json
{
  "success": false,
  "message": "无效的刷新令牌"
}
```

## 塔罗牌服务

### 请求塔罗牌解读

**URL**: `/api/tarot/reading`

**方法**: `POST`

**描述**: 请求基于选择的塔罗牌的AI解读

**权限**: 需要认证

**请求体**:
```json
{
  "cards": [
    {
      "name": "The Fool",
      "position": "past",
      "reversed": false
    },
    {
      "name": "The Magician",
      "position": "present",
      "reversed": true
    },
    {
      "name": "The High Priestess",
      "position": "future",
      "reversed": false
    }
  ],
  "spread": "past-present-future",
  "question": "我的事业发展如何？"
}
```

**成功响应** (状态码 200):
```json
{
  "success": true,
  "reading": {
    "interpretations": {
      "past": "The Fool: 你过去敢于尝试新事物，充满冒险精神。",
      "present": "The Magician (逆位): 目前你可能感到创意受阻，需要重新集中精力。",
      "future": "The High Priestess: 未来将有深层次的洞察力，信任你的直觉。"
    },
    "overallReading": "你的职业生涯展示了从初始的冒险到当前的挑战，未来将通过更深的自我了解获得成功。",
    "advice": "重新连接你的创造力源泉，同时依靠直觉指导你的下一步行动。"
  },
  "savedId": "6123456789abcdef12345678"
}
```

**错误响应** (状态码 400):
```json
{
  "success": false,
  "message": "请提供有效的塔罗牌数据"
}
```

## 易经服务

### 请求易经解读

**URL**: `/api/iching/reading`

**方法**: `POST`

**描述**: 请求基于易经卦象的AI解读

**权限**: 需要认证

**请求体**:
```json
{
  "hexagram": {
    "number": 1,
    "name": {
      "chinese": "乾",
      "pinyin": "Qián",
      "english": "The Creative"
    },
    "changingLines": [3, 6],
    "resultHexagram": {
      "number": 2,
      "name": {
        "chinese": "坤",
        "pinyin": "Kūn", 
        "english": "The Receptive"
      }
    }
  },
  "question": "我应该如何处理当前的工作关系？"
}
```

**成功响应** (状态码 200):
```json
{
  "success": true,
  "reading": {
    "hexagram": {
      "number": 1,
      "name": {
        "chinese": "乾",
        "pinyin": "Qián",
        "english": "The Creative"
      },
      "changingLines": [3, 6],
      "resultHexagram": {
        "number": 2,
        "name": {
          "chinese": "坤",
          "pinyin": "Kūn",
          "english": "The Receptive"
        }
      }
    },
    "interpretation": {
      "overall": "乾卦代表天，象征着强大、持久的创造力和领导力。",
      "guidance": "在你的工作关系问题上，当前应保持坚强、积极的态度，展现领导力。",
      "currentSituation": "你目前处于需要主动引领的位置，周围环境需要你的坚定和决断。",
      "futureTrend": "变卦为坤，表明未来将需要更多的包容和顺应，领导方式需要由刚转柔。",
      "advice": "现在应坚定自信地行使领导权，但准备在适当时候转向更柔和的方式。"
    }
  },
  "savedId": "6123456789abcdef12345670"
}
```

**错误响应** (状态码 400):
```json
{
  "success": false,
  "message": "请提供有效的易经卦象数据"
}
```

## 数字学服务

### 请求数字学解读

**URL**: `/api/numerology/reading`

**方法**: `POST`

**描述**: 请求基于出生日期和姓名的数字学解读

**权限**: 需要认证

**请求体**:
```json
{
  "birthDate": "1990-01-01",
  "name": "张三"
}
```

**成功响应** (状态码 200):
```json
{
  "success": true,
  "reading": {
    "lifePathNumber": 2,
    "destinyNumber": 7,
    "interpretations": {
      "lifePath": "生命数字2表示你是天生的合作者和和平缔造者...",
      "destiny": "命运数字7表示你有深刻的分析能力和哲学思维..."
    }
  },
  "savedId": "6123456789abcdef12345671"
}
```

**错误响应** (状态码 400):
```json
{
  "success": false,
  "message": "请提供有效的出生日期"
}
```

## 支付服务

### 获取可购买服务列表

**URL**: `/api/payment/services`

**方法**: `GET`

**描述**: 获取所有可购买的服务列表

**权限**: 需要认证

**成功响应** (状态码 200):
```json
{
  "success": true,
  "services": [
    {
      "id": "6123456789abcdef12345672",
      "name": "五张塔罗牌解读",
      "slug": "five-card-tarot",
      "description": "使用五张塔罗牌阵为您提供更深入的生活情境分析...",
      "price": 29.99,
      "type": "tarot",
      "featureLevel": "advanced",
      "isActive": true
    },
    {
      "id": "6123456789abcdef12345673",
      "name": "十张塔罗牌凯尔特十字阵解读",
      "slug": "ten-card-tarot",
      "description": "使用经典的凯尔特十字牌阵，提供全面而深入的人生解读...",
      "price": 49.99,
      "type": "tarot",
      "featureLevel": "advanced",
      "isActive": true
    }
  ]
}
```

### 创建支付会话

**URL**: `/api/payment/create-checkout`

**方法**: `POST`

**描述**: 创建Stripe支付会话

**权限**: 需要认证

**请求体**:
```json
{
  "serviceId": "6123456789abcdef12345672"
}
```

**成功响应** (状态码 200):
```json
{
  "success": true,
  "id": "cs_test_a1b2c3d4e5f6g7h8i9j0",
  "url": "https://checkout.stripe.com/pay/cs_test_a1b2c3d4e5f6g7h8i9j0"
}
```

**错误响应** (状态码 400):
```json
{
  "success": false,
  "message": "未找到该服务"
}
```

## 历史记录

### 获取用户历史记录

**URL**: `/api/history`

**方法**: `GET`

**描述**: 获取当前用户的历史记录

**权限**: 需要认证

**查询参数**:
- `page`: 页码（默认：1）
- `limit`: 每页条数（默认：10）
- `type`: 记录类型（可选：tarot, numerology, iching）

**成功响应** (状态码 200):
```json
{
  "success": true,
  "histories": [
    {
      "id": "6123456789abcdef12345678",
      "type": "tarot",
      "question": "我的事业发展如何？",
      "createdAt": "2023-07-01T12:00:00Z",
      "summary": "三张牌解读，关于职业发展"
    },
    {
      "id": "6123456789abcdef12345677",
      "type": "numerology",
      "createdAt": "2023-06-28T15:30:00Z",
      "summary": "生命数字2，命运数字7的解读"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "pages": 2
  }
}
```

## 健康检查

### 基本健康检查

**URL**: `/health`

**方法**: `GET`

**描述**: 获取应用基本健康状态

**成功响应** (状态码 200):
```json
{
  "status": "ok",
  "timestamp": "2023-07-01T12:00:00Z",
  "uptime": 3600,
  "database": {
    "connected": true,
    "status": "healthy"
  }
}
```

**错误响应** (状态码 503):
```json
{
  "status": "error",
  "timestamp": "2023-07-01T12:00:00Z",
  "database": {
    "connected": false,
    "status": "unhealthy"
  }
}
```

### 系统状态

**URL**: `/status`

**方法**: `GET`

**描述**: 获取详细的系统状态信息

**权限**: 需要API密钥

**请求头**:
```
X-API-Key: your_api_key
```

**成功响应** (状态码 200):
```json
{
  "status": "ok",
  "timestamp": "2023-07-01T12:00:00Z",
  "uptime": 3600,
  "database": {
    "connected": true,
    "status": "healthy",
    "stats": {
      "collections": 10,
      "documents": 1500,
      "indexes": 25
    }
  },
  "externalServices": [
    {
      "name": "AI API",
      "status": "ok",
      "responseTime": 120
    }
  ],
  "system": {
    "cpu": {
      "cores": 4,
      "loadAvg": [0.5, 0.3, 0.2]
    },
    "memory": {
      "total": 8589934592,
      "free": 4294967296,
      "used": 4294967296
    }
  }
}
```

---

## 错误处理

所有API都使用以下错误状态码：

- `400 Bad Request`: 请求参数错误
- `401 Unauthorized`: 未认证或认证失败
- `403 Forbidden`: 权限不足
- `404 Not Found`: 资源不存在
- `429 Too Many Requests`: 请求频率超限
- `500 Internal Server Error`: 服务器内部错误

错误响应格式：

```json
{
  "success": false,
  "message": "错误描述",
  "errors": ["可选的详细错误信息"]
}
```

## API版本控制

当前API版本为v1，所有端点都以`/api`开头。未来版本可能使用`/api/v2`等路径。

## 速率限制

为防止滥用，API实施了以下速率限制：

- 认证接口：15分钟内15次请求
- 其他接口：15分钟内100次请求

超过限制时将返回429状态码：

```json
{
  "success": false,
  "message": "请求频率超限，请稍后再试",
  "retryAfter": 300
}
```

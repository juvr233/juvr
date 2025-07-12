# Zenith Destiny 后端服务

这是为Zenith Destiny项目开发的后端服务，提供用户认证与支付功能。

## 技术栈

- Node.js + Express
- TypeScript
- MongoDB (通过Mongoose)
- JWT认证
- Stripe支付集成

## 功能特性

- 用户注册与登录
- JWT令牌认证
- 付费服务购买
- 塔罗牌阵收费功能
  - 五张牌阵收费访问
  - 十张凯尔特十字阵收费访问
- 周易六十四卦收费访问
- 安全性防护
  - 请求速率限制
  - 安全的HTTP头
  - 密码加密存储

## 开始使用

### 环境要求

- Node.js 18+
- MongoDB 4.4+
- npm 9+

### 安装步骤

1. 克隆仓库
```bash
cd juvr
cd server
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
复制`.env.example`文件为`.env`并填写所需的配置：
```bash
cp .env.example .env
```

修改 .env 文件中的配置，尤其是数据库连接和密钥。

4. 启动服务
```bash
# 开发模式启动
npm run dev

# 或者构建后启动
npm run build
npm start
```
cp .env.example .env
```

关键配置：
- `MONGO_URI`: MongoDB连接字符串
- `JWT_SECRET`: JWT签名密钥
- `STRIPE_SECRET_KEY`: Stripe API密钥
- `STRIPE_WEBHOOK_SECRET`: Stripe Webhook密钥

4. 初始化数据库（仅开发环境）
```bash
npm run seed:dev
```

5. 编译TypeScript
```bash
npm run build
```

6. 启动服务器
```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

## API端点

### 认证相关

- `POST /api/auth/register` - 注册新用户
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取当前用户资料（需要认证）

### 支付相关

- `GET /api/payments/services` - 获取所有付费服务
- `POST /api/payments/create-checkout-session` - 创建支付会话
- `GET /api/payments/verify/:serviceSlug` - 验证用户是否已购买特定服务
- `POST /api/payments/webhook` - Stripe webhook处理

### 塔罗牌相关

- `GET /api/tarot/access/:spreadType` - 检查塔罗牌阵访问权限
- `POST /api/tarot/reading/:spreadType` - 获取塔罗牌解读

### 周易相关

- `GET /api/iching/access` - 检查周易访问权限
- `POST /api/iching/reading` - 获取周易卦象解读

## 开发指南

- 使用ESLint进行代码质量检查：
```bash
npm run lint
```

- 运行测试：
```bash
npm test
```

## 生产部署

1. 确保设置了正确的环境变量
2. 构建应用
```bash
npm run build
```
3. 启动服务
```bash
npm start
```

建议将服务部署到云服务提供商或容器服务中，如AWS、Azure、Google Cloud、阿里云等。

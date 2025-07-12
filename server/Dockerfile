# Stage 1: Build dependencies
FROM node:18-alpine AS deps

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# Stage 2: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装所有依赖（包括开发依赖）
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# Stage 3: Production image
FROM node:18-alpine AS runner

# 设置工作目录
WORKDIR /app

# 创建非root用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# 设置环境变量
ENV NODE_ENV=production

# 复制构建产物和依赖
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 创建必要的目录并设置权限
RUN mkdir -p logs backups data && \
    chown -R nodejs:nodejs /app

# 切换到非root用户
USER nodejs

# 暴露端口
EXPOSE 5000

# 健康检查
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:5000/health').then(res => process.exit(res.status === 200 ? 0 : 1)).catch(() => process.exit(1))"

# 设置启动命令
CMD ["node", "dist/index.js"]

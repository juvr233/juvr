# 生产环境部署指南

本文档提供了将应用部署到生产环境的详细步骤、配置说明和最佳实践。

## 目录

1. [环境要求](#环境要求)
2. [准备工作](#准备工作)
3. [配置](#配置)
4. [部署步骤](#部署步骤)
5. [安全配置](#安全配置)
6. [监控和维护](#监控和维护)
7. [常见问题](#常见问题)
8. [灾备和恢复](#灾备和恢复)

## 环境要求

- Docker 20.10+ 和 Docker Compose 2.0+
- 至少4GB内存，2核CPU的服务器
- 50GB存储空间（取决于预期的数据量）
- 公网IP地址和域名（用于HTTPS）
- Linux操作系统（推荐Ubuntu 20.04+）

## 准备工作

### 1. 安装Docker和Docker Compose

```bash
# 安装Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 安装Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.15.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. 克隆代码库

```bash
git clone https://github.com/your-organization/your-repository.git
cd your-repository
```

### 3. 创建必要的目录结构

```bash
mkdir -p nginx/conf.d nginx/ssl backups data/mongodb data/redis logs
```

## 配置

### 1. 环境变量

创建`.env`文件，用于存储敏感配置:

```bash
cp .env.production.example .env
```

编辑`.env`文件，设置实际的值:

```
# 数据库配置
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=strong-password-here
MONGO_URI=mongodb://admin:strong-password-here@mongo:27017/divination?authSource=admin
REDIS_URL=redis://redis:6379
REDIS_PASSWORD=strong-redis-password-here

# JWT配置
JWT_SECRET=your-jwt-secret-at-least-32-chars-long
JWT_REFRESH_SECRET=your-jwt-refresh-secret-at-least-32-chars-long

# API配置
API_KEY=your-secure-api-key-at-least-32-chars-long
CORS_ORIGIN=https://your-domain.com

# 其他必要配置...
```

### 2. Nginx配置

创建`nginx/nginx.conf`:

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log notice;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    sendfile on;
    keepalive_timeout 65;
    gzip on;

    include /etc/nginx/conf.d/*.conf;
}
```

创建`nginx/conf.d/default.conf`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # 将HTTP请求重定向到HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # API请求
    location /api/ {
        proxy_pass http://app:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 健康检查端点
    location /health {
        proxy_pass http://app:5000/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 静态资源
    location / {
        proxy_pass http://app:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. MongoDB初始化脚本

创建`mongo-init.js`:

```javascript
// 创建应用数据库和用户
db = db.getSiblingDB('divination');

// 创建应用用户
db.createUser({
  user: 'app_user',
  pwd: process.env.MONGO_APP_PASSWORD || 'app_password',
  roles: [
    { role: 'readWrite', db: 'divination' }
  ]
});

// 创建初始集合
db.createCollection('users');
db.createCollection('aiModels');
db.createCollection('paidServices');
```

### 4. 备份脚本

创建`scripts/backup.sh`:

```bash
#!/bin/sh

# 配置变量
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR=${BACKUP_DIR:-/backups}
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-30}

# 创建备份
echo "开始备份MongoDB..."
mongodump --uri="${MONGO_URI}" --out="${BACKUP_DIR}/${TIMESTAMP}"

# 压缩备份
cd ${BACKUP_DIR}
tar -czf "${TIMESTAMP}.tar.gz" "${TIMESTAMP}"
rm -rf "${TIMESTAMP}"

# 清理旧备份
find ${BACKUP_DIR} -name "*.tar.gz" -type f -mtime +${RETENTION_DAYS} -delete

echo "备份完成: ${BACKUP_DIR}/${TIMESTAMP}.tar.gz"
```

## 部署步骤

### 1. 设置SSL证书

您可以使用Let's Encrypt获取免费SSL证书:

```bash
# 安装certbot
sudo apt update
sudo apt install -y certbot

# 获取证书
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# 复制证书到Nginx目录
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/
```

### 2. 使用Docker Compose部署

```bash
# 启动所有服务
docker-compose -f docker-compose.prod.yml up -d

# 检查服务状态
docker-compose -f docker-compose.prod.yml ps
```

### 3. 初始化数据库

首次部署后，需要初始化一些基础数据:

```bash
# 进入应用容器
docker-compose -f docker-compose.prod.yml exec app sh

# 运行初始化脚本
node dist/scripts/initDb.js
node dist/scripts/initAiModels.js
```

## 安全配置

### 1. 防火墙设置

仅开放必要端口:

```bash
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp  # HTTP
sudo ufw allow 443/tcp # HTTPS
sudo ufw enable
```

### 2. 定期更新系统和依赖

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 更新Docker镜像
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## 监控和维护

### 1. 查看容器日志

```bash
# 查看应用日志
docker-compose -f docker-compose.prod.yml logs -f app

# 查看数据库日志
docker-compose -f docker-compose.prod.yml logs -f mongo
```

### 2. 健康检查

访问以下URL检查应用健康状态:

```
https://your-domain.com/health       # 基本健康检查
https://your-domain.com/health/deep  # 深度健康检查
```

### 3. 容器资源监控

```bash
docker stats
```

## 常见问题

### 1. 应用无法连接到数据库

检查以下几点:
- 确认`.env`文件中的MongoDB连接字符串是否正确
- 检查MongoDB容器是否正常运行
- 检查网络连接和防火墙设置

### 2. SSL证书问题

- 确保证书文件位于正确位置
- 检查证书是否过期: `certbot certificates`
- 更新证书: `certbot renew`

### 3. 性能问题

- 检查资源使用情况: `docker stats`
- 考虑增加容器资源限制
- 优化数据库索引
- 启用Redis缓存

## 灾备和恢复

### 1. 手动备份数据

```bash
# 备份MongoDB数据
docker-compose -f docker-compose.prod.yml exec mongo mongodump --out=/backup

# 将备份复制到宿主机
docker cp $(docker-compose -f docker-compose.prod.yml ps -q mongo):/backup ./mongodb-backup-$(date +%Y%m%d)
```

### 2. 从备份恢复

```bash
# 停止应用
docker-compose -f docker-compose.prod.yml stop app

# 恢复数据
docker cp ./mongodb-backup-YYYYMMDD $(docker-compose -f docker-compose.prod.yml ps -q mongo):/backup
docker-compose -f docker-compose.prod.yml exec mongo mongorestore /backup

# 重启应用
docker-compose -f docker-compose.prod.yml start app
```

---

如有更多问题，请联系系统管理员或参考官方文档。 
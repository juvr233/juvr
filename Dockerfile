# Stage 1: Build the React application
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy the rest of the frontend application source code
COPY . .

# Build the frontend application
RUN npm run build

# Stage 2: Build the server application
FROM node:18-alpine AS server-builder

WORKDIR /app

# Copy server package files and install dependencies
COPY server/package*.json ./
RUN npm ci --only=production

# Copy the server source code
COPY server/ .

# Compile TypeScript to JavaScript
RUN npm run build

# Stage 3: Production runtime
FROM node:18-alpine

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set working directory
WORKDIR /app

# Install production dependencies only
COPY server/package*.json ./
RUN npm ci --only=production --no-optional && npm cache clean --force

# Copy compiled server from builder
COPY --from=server-builder /app/dist ./dist
COPY --from=server-builder /app/data ./data

# Copy frontend assets
COPY --from=frontend-builder /app/dist ./public

# Create necessary directories with proper permissions
RUN mkdir -p /app/logs /app/backups /app/data \
    && chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose the application port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Start the application
CMD ["node", "dist/index.js"]

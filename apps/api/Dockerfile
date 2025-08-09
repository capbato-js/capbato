# Multi-stage build for Node.js API

# Stage 1: Build the application
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable pnpm

# Set working directory
WORKDIR /app

# Copy workspace configuration and package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY nx.json tsconfig.base.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/ ./apps/
COPY libs/ ./libs/

# Build the application
RUN pnpm build:api

# Stage 2: Production runtime
FROM node:20-alpine AS runtime

# Create app directory
WORKDIR /app

# Install pnpm
RUN corepack enable pnpm

# Copy package files for production dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY nx.json tsconfig.base.json ./

# Install all dependencies (including tslib and other runtime deps)
RUN pnpm install --frozen-lockfile

# Copy built application from builder stage
COPY --from=builder /app/dist/apps/api ./dist/apps/api

# Create directories and copy Philippines data to all expected locations
RUN mkdir -p ./src/data ./apps/api/src/data
COPY apps/api/src/data ./src/data
COPY apps/api/src/data ./apps/api/src/data
# The file is already at /app/dist/apps/api/data/ from the build stage

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -D -H -u 1001 -h /app -s /sbin/nologin -G nodejs -g nodejs nodejs

# Set proper permissions
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/health || exit 1

# Start the application
CMD ["node", "dist/apps/api/main.js"]
# Note: https://github.com/prisma/prisma/issues/16182#issuecomment-1371283457
# Multi-stage build for TypeScript compilation

# ================================
# Stage 1: Builder (Compilation)
# ================================
FROM node:20-bullseye-slim@sha256:affb1afa05024cf8282d966f7b0ffaf2a0fa94f197781bb6932fdf82c4917ed8 AS builder

ARG PRODUCTION

# Install OpenSSL for Prisma and build tools for native modules
RUN apt-get update && apt-get install -y openssl python3 make g++

# Enable pnpm via corepack (included in Node.js 20)
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

WORKDIR /app

# Copy workspace root dependency files (context is now repo root)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY api/package.json api/.npmrc ./api/

# Install ALL dependencies (dev + prod) for compilation
RUN pnpm install --frozen-lockfile

# Copy TypeScript sources and configuration from api/
COPY api/src/ ./api/src/
COPY api/tsconfig.json ./api/
COPY api/prisma/ ./api/prisma/

# Copy environment files for build context
COPY api/.env.staging api/.env.production ./api/
RUN if [ -z "$PRODUCTION" ]; then echo "Using staging config for build"; cp ./api/.env.staging ./api/.env; else echo "Using production config for build"; cp ./api/.env.production ./api/.env; fi

# Generate Prisma client (from api/ directory)
WORKDIR /app/api
RUN npx prisma generate

# Compile TypeScript to JavaScript
RUN pnpm build

# Verify compilation succeeded
RUN echo "Build completed. Contents of dist/:" && ls -la dist/ || (echo "Build failed - dist/ directory not found" && exit 1)

# ================================
# Stage 2: Production (Runtime)
# ================================
FROM node:20-bullseye-slim@sha256:affb1afa05024cf8282d966f7b0ffaf2a0fa94f197781bb6932fdf82c4917ed8 AS production

ARG PRODUCTION

# Install OpenSSL for Prisma and build tools for native modules
RUN apt-get update && apt-get install -y openssl python3 make g++

# Enable pnpm via corepack (included in Node.js 20)
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

RUN mkdir -p /app/api && chown -R 1000:1000 /app

WORKDIR /app

# Copy workspace root dependency files
COPY --chown=1000:1000 pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY --chown=1000:1000 api/package.json api/.npmrc ./api/

# Install ONLY production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy compiled JavaScript files from builder stage
COPY --from=builder --chown=1000:1000 /app/api/dist ./api/dist

# Copy Prisma schema for runtime (needed for migrations)
COPY --chown=1000:1000 api/prisma/ ./api/prisma/

# Copy environment configuration files
COPY --chown=1000:1000 api/.env.staging api/.env.production ./api/
RUN if [ -z "$PRODUCTION" ]; then echo "Copy staging values"; cp ./api/.env.staging ./api/.env; else cp ./api/.env.production ./api/.env; fi

# Set production environment
ENV NODE_ENV=production

# Set working directory to api for generating Prisma client
WORKDIR /app/api

# Generate Prisma client in production stage
RUN npx prisma generate

# Switch to non-root user
USER 1000

# Start the application (runs the compiled JavaScript)
ENTRYPOINT ["pnpm", "start"]

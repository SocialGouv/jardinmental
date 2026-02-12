# Note: https://github.com/prisma/prisma/issues/16182#issuecomment-1371283457
# Multi-stage build for TypeScript compilation

# ================================
# Stage 1: Builder (Compilation)
# ================================
FROM node:20-bullseye-slim@sha256:affb1afa05024cf8282d966f7b0ffaf2a0fa94f197781bb6932fdf82c4917ed8 AS builder

ARG PRODUCTION

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency configuration files
COPY ../pnpm-lock.yaml package.json ./

# Install ALL dependencies (dev + prod) for compilation
RUN pnpm install --frozen-lockfile

# Copy TypeScript sources and configuration
COPY src/ src/
COPY tsconfig.json ./
COPY prisma/ prisma/

# Copy environment files for build context
COPY .env.staging .env.production ./
RUN if [ -z "$PRODUCTION" ]; then echo "Using staging config for build"; cp .env.staging .env; else echo "Using production config for build"; cp .env.production .env; fi

# Generate Prisma client
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

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl
RUN mkdir /app && chown 1000:1000 /app

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency configuration files
COPY pnpm-lock.yaml package.json ./

# Install ONLY production dependencies
RUN pnpm install --prod --frozen-lockfile && pnpm store prune

# Copy compiled JavaScript files from builder stage
COPY --from=builder --chown=1000:1000 /app/dist ./dist

# Copy generated Prisma client from builder stage
COPY --from=builder --chown=1000:1000 /app/node_modules/.prisma ./node_modules/.prisma

# Copy Prisma schema for runtime (needed for migrations)
COPY --chown=1000:1000 prisma/ prisma/

# Copy environment configuration files
COPY .env.staging .env.production ./
RUN if [ -z "$PRODUCTION" ]; then echo "Copy staging values"; cp .env.staging .env; else cp .env.production .env; fi

# Set production environment
ENV NODE_ENV=production

# Switch to non-root user
USER 1000

# Start the application (runs the compiled JavaScript)
ENTRYPOINT ["pnpm", "start"]

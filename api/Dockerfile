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

# Copy workspace lockfiles/config first for better cache reuse
COPY pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# Copy API package manifest (workspace package)
COPY api/package.json ./api/package.json
COPY api/.npmrc ./api/.npmrc

# Prefetch dependencies based on lockfile only
RUN pnpm fetch

# Install ALL dependencies (dev + prod) for compilation (offline, workspace-aware)
RUN pnpm install --filter api_monsuivipsy... --frozen-lockfile --offline

# Copy TypeScript sources and configuration
COPY api/src/ src/
COPY api/tsconfig.json ./
COPY api/prisma/ prisma/

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

# Copy workspace lockfiles/config first for better cache reuse
COPY pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# Copy API package manifest (workspace package)
COPY api/package.json ./api/package.json
COPY api/.npmrc ./api/.npmrc

# Prefetch dependencies based on lockfile only
RUN pnpm fetch

# Install ONLY production dependencies (offline, workspace-aware)
RUN pnpm install --filter api_monsuivipsy... --prod --frozen-lockfile --offline && pnpm store prune

# Copy compiled JavaScript files from builder stage
COPY --from=builder --chown=1000:1000 /app/dist ./dist

# Copy generated Prisma client from builder stage
COPY --from=builder --chown=1000:1000 /app/node_modules/.prisma ./node_modules/.prisma

# Copy Prisma schema for runtime (needed for migrations)
COPY --chown=1000:1000 api/prisma/ prisma/

# Set production environment
ENV NODE_ENV=production

# Switch to non-root user
USER 1000

# Start the application (runs the compiled JavaScript)
ENTRYPOINT ["pnpm", "start"]

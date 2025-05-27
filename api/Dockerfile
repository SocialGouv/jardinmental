# Note: https://github.com/prisma/prisma/issues/16182#issuecomment-1371283457
# Multi-stage build for TypeScript compilation

# ================================
# Stage 1: Builder (Compilation)
# ================================
FROM node:20-bullseye-slim@sha256:f959c0047e2cc2dc01459067d9e898b7780862e52f4e7e80bb674f6040298f32 AS builder

ARG PRODUCTION

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl

WORKDIR /app

# Copy dependency configuration files
COPY yarn.lock .yarnrc.yml package.json ./
COPY --chown=1000:1000 .yarn .yarn

# Install ALL dependencies (dev + prod) for compilation
RUN yarn install --immutable

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
RUN yarn build

# Verify compilation succeeded
RUN echo "Build completed. Contents of dist/:" && ls -la dist/ || (echo "Build failed - dist/ directory not found" && exit 1)

# ================================
# Stage 2: Production (Runtime)
# ================================
FROM node:20-bullseye-slim@sha256:f959c0047e2cc2dc01459067d9e898b7780862e52f4e7e80bb674f6040298f32 AS production

ARG PRODUCTION

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl
RUN mkdir /app && chown 1000:1000 /app

WORKDIR /app

# Copy dependency configuration files
COPY yarn.lock .yarnrc.yml package.json ./
COPY --chown=1000:1000 .yarn .yarn

# Install ONLY production dependencies
RUN yarn workspaces focus --production && yarn cache clean

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
ENTRYPOINT ["yarn", "start"]

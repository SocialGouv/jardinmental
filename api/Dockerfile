
# Note: https://github.com/prisma/prisma/issues/16182#issuecomment-1371283457
FROM node:20-bullseye-slim@sha256:1f4a4b4532cd21864f0e575b0f81e2e25b0e7df7131f76c1a11d3b080fb4bcae

ARG PRODUCTION

RUN apt-get update && apt-get install -y openssl
RUN mkdir /app && chown 1000:1000 /app

WORKDIR /app

COPY yarn.lock .yarnrc.yml ./
COPY --chown=1000:1000 .yarn .yarn

RUN yarn fetch workspaces focus --production && yarn cache clean

COPY . .

RUN if [ -z "$PRODUCTION" ]; then echo "Copy staging values"; cp .env.staging .env; else cp .env.production .env; fi

ENV NODE_ENV=production

RUN npx prisma generate

USER 1000

ENTRYPOINT ["yarn", "start"]
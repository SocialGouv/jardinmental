# Note: https://github.com/prisma/prisma/issues/10649
FROM node:18.15.0-bullseye@sha256:16d7247706d3f3c52f0d7a8c73fe5805387d7c8007e1f7b05f6b5ef232ea5551

ARG PRODUCTION

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

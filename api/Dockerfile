FROM node:18-bullseye@sha256:772f910c34bf1419307abe281c8a0b27206359db864fac50781665508a88e7e6

ARG PRODUCTION

RUN mkdir /app && chown 1000:1000 /app
USER 1000
WORKDIR /app

COPY yarn.lock .yarnrc.yml ./
COPY --chown=1000:1000 .yarn .yarn
RUN yarn fetch workspaces focus --production && yarn cache clean

COPY . .

RUN if [ -z "$PRODUCTION" ]; then echo "Copy staging values"; cp .env.staging .env; else cp .env.production .env; fi

ENV NODE_ENV=production

RUN npx prisma generate

ENTRYPOINT ["yarn", "start"]

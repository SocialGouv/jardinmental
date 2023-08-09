FROM node:16-alpine3.18@sha256:af2e0094d3dedb96bac50457873485bd7c64a3dc4b3158152735833a891bf6f4

ARG PRODUCTION

WORKDIR /app

RUN chown node:node /app

COPY . .

RUN if [ -z "$PRODUCTION" ]; then echo "Copy staging values"; cp .env.staging .env; else cp .env.production .env; fi

RUN yarn --production --frozen-lockfile && yarn cache clean

USER 1000

ENV NODE_ENV=production

ENTRYPOINT ["yarn", "start"]

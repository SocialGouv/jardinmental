FROM node:16-alpine

ARG PRODUCTION

WORKDIR /app

RUN chown node:node /app

COPY . .

RUN if [ -z "$PRODUCTION" ]; then echo "Copy staging values"; cp .env.staging .env; else cp .env.production .env; fi

RUN yarn --production --frozen-lockfile

USER 1000

ENV NODE_ENV=production

ENTRYPOINT ["yarn", "start"]

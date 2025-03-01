
# Note: https://github.com/prisma/prisma/issues/16182#issuecomment-1371283457
FROM node:20-bullseye-slim@sha256:8572e48314571f102193d3711053abf3e267e8a6ffd39d350191ad7e13f84795

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
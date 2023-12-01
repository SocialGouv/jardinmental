
# Note: https://github.com/prisma/prisma/issues/16182#issuecomment-1371283457
FROM node:16-bullseye@sha256:8bdf5c089572f136904071bff5f94e3fcc19af232e0fe86f93c4fa08a184bc7b

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

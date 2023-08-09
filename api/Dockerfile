FROM node:18-bullseye@sha256:f27e3f4c8b5719cb9816084475d687a283c59149f3d11a7aa45b675fea56bed0

ARG PRODUCTION

WORKDIR /app

RUN chown node:node /app

COPY . .

RUN if [ -z "$PRODUCTION" ]; then echo "Copy staging values"; cp .env.staging .env; else cp .env.production .env; fi

RUN yarn --production --frozen-lockfile && yarn cache clean

USER 1000

ENV NODE_ENV=production

ENTRYPOINT ["yarn", "start"]

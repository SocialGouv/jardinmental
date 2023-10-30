FROM node:18-bullseye@sha256:f27e3f4c8b5719cb9816084475d687a283c59149f3d11a7aa45b675fea56bed0

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

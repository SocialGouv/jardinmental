FROM node:20-bullseye@sha256:16a459d48168e18e3c1cc63c7bf53f248c50ca8391d6345b4c4d0e62fc9b201f

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

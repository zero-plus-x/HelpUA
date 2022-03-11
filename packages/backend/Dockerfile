# alpine doesn't work on apple silicon
FROM node:14
RUN npm i -g pnpm

WORKDIR /home/node/app
COPY ./package.json ./
COPY ./pnpm-lock.yaml ./

COPY ./packages/backend ./packages/backend

RUN pnpm install --production --pure-lockfile --non-interactive --cache-folder ./ycache; rm -rf ./ycache

WORKDIR /home/node/app/packages/backend
RUN pnpm prisma generate
# RUN pnpm start:backend

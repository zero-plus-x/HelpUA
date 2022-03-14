FROM node:14-alpine
RUN npm i -g pnpm

WORKDIR /home/node/app
COPY ./pnpm-lock.yaml ./
COPY ./package.json ./
COPY ./packages/backend/package.json ./packages/backend/package.json

RUN pnpm install -r --prod

COPY ./packages/backend/src ./packages/backend/src
COPY ./packages/backend/prisma ./packages/backend/prisma

WORKDIR /home/node/app/packages/backend
RUN pnpm prisma generate

WORKDIR /home/node/app
CMD ["pnpm", "start:backend"]

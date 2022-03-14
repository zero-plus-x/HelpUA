FROM node:14-alpine
RUN npm i -g pnpm

WORKDIR /home/node/app
COPY ./pnpm-lock.yaml ./
COPY ./package.json ./
COPY ./packages/bot/package.json ./packages/bot/package.json

RUN pnpm install -r --prod

COPY ./packages/bot/src ./packages/bot/src

CMD ["pnpm", "start:bot"]

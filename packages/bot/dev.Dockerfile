FROM node:14-alpine
RUN npm i -g pnpm

WORKDIR /home/node/app
COPY ./pnpm-lock.yaml ./
RUN pnpm fetch

ADD . ./

RUN pnpm install -r --offline --prod

CMD ["pnpm", "dev:bot"]

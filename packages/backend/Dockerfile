# alpine doesn't work on apple silicon
FROM node:14
RUN npm i -g pnpm

WORKDIR /home/node/app
COPY ./pnpm-lock.yaml ./
RUN pnpm fetch


ADD . ./

RUN pnpm install -r --offline --prod

WORKDIR /home/node/app/packages/backend
RUN pnpm prisma generate

WORKDIR /home/node/app
CMD ["pnpm", "start:backend"]

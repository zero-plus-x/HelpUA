# alpine doesn't work with Prisma on apple silicon
FROM node:14
RUN npm i -g pnpm

WORKDIR /home/node/app
COPY ./pnpm-lock.yaml ./
RUN pnpm fetch


ADD . ./

RUN pnpm install -r --offline

WORKDIR /home/node/app/packages/backend
RUN pnpm prisma generate

WORKDIR /home/node/app
CMD ["pnpm", "dev:backend"]

# alpine doesn't work on apple silicon
FROM node:14
RUN npm i -g pnpm
RUN npm i -g prisma

WORKDIR /home/node/app
COPY ./package.json ./
COPY ./pnpm-lock.yaml ./

COPY ./packages/backend ./packages/backend

RUN pnpm install --pure-lockfile --non-interactive --cache-folder ./ycache; rm -rf ./ycache

WORKDIR /home/node/app/packages/backend
RUN pnpm prisma generate

WORKDIR /home/node/app
CMD ["pnpm", "dev:backend"]

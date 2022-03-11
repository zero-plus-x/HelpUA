# HELP-UA

Monorepo for the 0+X initiative: creating a telegram bot to match helpers with helpees

## Requirements

- Docker

## Running locally

craete .env file in packages/bot (use sample.env) as a reference

```
docker-compose up
```

## Running without Docker

We use `pnpm`, so if you don't have it installed - install

```
npm i -g pnpm
```

Then run

```
pnpm install
```

Create .env files in each of the packages

Use `pnpm start:bot` to start bot,
Use `pnpm start:backend` to start backend

Use `pnpm dev:{PACKAGE_NAME}` to run in dev mode

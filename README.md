# HELP-UA

Monorepo for the 0+X initiative: creating a telegram bot to match helpers with helpees

## Requirements

- Docker
- pnpm

## Running locally

create your own bot through https://t.me/BotFather
add bot token to .env file in packages/backend (use sample.env as a reference)

```
docker-compose up
docker exec helpua_backend_1 pnpm migrate:deploy
```

To have proper types in your editor, you need to install dependecies and generate prisma types

```
pnpm i
cd packages/backend
pnpm prisma generate
```

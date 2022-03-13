import { Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import dotenv from 'dotenv';
import { THelpUAContext } from './shared/types';
import { askForLanguage } from './questions';
import { initAnswerListeners } from './answers';
import fetch from 'node-fetch';

dotenv.config({ path: `${__dirname}/../.env` });

if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error('TELEGRAM_BOT_TOKEN env variable is not provided');
  process.exit(1);
}

if (!process.env.BACKEND_HOST) {
  console.error('BACKEND_HOST env variable is not provided');
  process.exit(1);
}

const bot = new Telegraf<THelpUAContext>(process.env.TELEGRAM_BOT_TOKEN);

const session = new LocalSession({ database: 'session_db.json' }).middleware();
bot.use(session); // @TODO use redis session storage https://github.com/telegraf/telegraf-session-redis

bot.start(ctx => {
  if (!ctx || !ctx.chat) return;

  ctx.session.selection = {
    language: null,
    option: null,
    userId: null,
    type: null
  };
  askForLanguage(bot, ctx.chat.id);
});

initAnswerListeners(bot);

bot.command('ping', async ctx => {
  const result = await fetch(`${process.env.BACKEND_HOST}/ping`);
  const text = await result.text();
  ctx.reply(text);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

import { Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import dotenv from 'dotenv';
import { THelpUAContext } from './shared/types';
import { askForLanguage } from './questions';
import { initAnswerListeners, initialSelection } from './answers';

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

  const chatId = ctx.chat.id;
  ctx.session.selection = { ...initialSelection, chatId };
  console.log(ctx.session.selection);
  askForLanguage(bot, chatId);
});

initAnswerListeners(bot);

bot.launch().then(() => console.log('>> Bot ready'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

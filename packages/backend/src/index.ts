import { Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import dotenv from 'dotenv';
import { HelpUAContext } from './bot/shared/types';
import { initListeners } from './bot';

dotenv.config({ path: `${__dirname}/../.env` });

if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error('TELEGRAM_BOT_TOKEN env variable is not provided');
  process.exit(1);
}

const bot = new Telegraf<HelpUAContext>(process.env.TELEGRAM_BOT_TOKEN);

const session = new LocalSession({ database: 'session_db.json' }).middleware();
bot.use(session); // @TODO use redis session storage https://github.com/telegraf/telegraf-session-redis

initListeners(bot);

bot.launch().then(() => console.log('>> Bot ready'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

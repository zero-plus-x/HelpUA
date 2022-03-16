import { Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import { HelpUAContext } from './shared/types';

if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error('TELEGRAM_BOT_TOKEN env variable is not provided');
  process.exit(1);
}

export const bot = new Telegraf<HelpUAContext>(process.env.TELEGRAM_BOT_TOKEN);

const session = new LocalSession({ database: 'session_db.json' }).middleware();
bot.use(session); // @TODO use redis session storage https://github.com/telegraf/telegraf-session-redis

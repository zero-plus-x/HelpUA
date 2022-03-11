import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/../.env` });

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

import { initListeners } from './bot';
import { bot } from './bot/bot'

initListeners(bot);

bot.launch().then(() => console.log('>> Bot ready'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

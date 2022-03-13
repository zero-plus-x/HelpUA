import { Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';

import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { askForHelp, askForInfo, askForLanguage, askToProvideHelp } from './questions';

dotenv.config({ path: `${__dirname}/../.env` });

if (process.env.TELEGRAM_BOT_TOKEN == null) {
  console.error('TELEGRAM_BOT_TOKEN env variable is not provided');
  process.exit(1);
}
if (process.env.BACKEND_HOST == null) {
  console.error('BACKEND_HOST env variable is not provided');
  process.exit(1);
}
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
bot.use(new LocalSession({ database: 'session_db.json' }).middleware()); // @TODO use redis session storage https://github.com/telegraf/telegraf-session-redis

interface ISelection {
  language: string | null;
  option: string | null;
  type: string | null;
  userId: number | null;
}

bot.start(ctx => {
  const selection: ISelection = {
    language: null,
    option: null,
    userId: null,
    type: null
  };
  ctx.session.selection = selection;
  askForLanguage(bot, ctx.chat.id);
});

function register(data: ISelection) {
  console.log('REGISTER:');
  console.log(data);
  // post to backend
  // fetch('http://localhost:8080/register', data)
}

bot.action('english', ctx => {
  if (ctx.chat == null) {
    return;
  }
  ctx.session.selection.language = 'english';
  ctx.session.selection.userId = ctx.update.callback_query.from.id;

  askForInfo(bot, ctx.chat.id);
});

bot.action('ukrainian', ctx => {
  if (ctx.chat == null) {
    return;
  }
  ctx.session.selection.language = 'ukrainian';
  ctx.session.selection.userId = ctx.update.callback_query.from.id;

  askForInfo(bot, ctx.chat.id);
});

bot.action('russian', ctx => {
  if (ctx.chat == null) {
    return;
  }
  ctx.session.selection.language = 'russian';
  ctx.session.selection.userId = ctx.update.callback_query.from.id;

  askForInfo(bot, chatId);
});

bot.action('need-help', ctx => {
  ctx.session.selection.option = 'need-help';

  askForHelp(bot, ctx.chat.id);
});

bot.action('provide-help', ctx => {
  ctx.session.selection.option = 'provide-help';

  askToProvideHelp(bot, ctx.chat.id);
});

bot.action('urgent-care', ctx => {
  ctx.session.selection.type = 'urgent-care';
  register(ctx.session.selection);
  ctx.reply(`urgent-care: ${JSON.stringify(ctx.session.selection)}`);
});

bot.action('transportation', ctx => {
  ctx.session.selection.type = 'transportation';
  register(ctx.session.selection);
  ctx.reply(`transportation: ${JSON.stringify(ctx.session.selection)}`);
});

bot.action('local-information', ctx => {
  ctx.session.selection.type = 'local-information';
  register(ctx.session.selection);
  ctx.reply(`local-information: ${JSON.stringify(ctx.session.selection)}`);
});

bot.action('accommodation', ctx => {
  ctx.session.selection.type = 'accommodation';
  register(ctx.session.selection);
  ctx.reply(`accommodation: ${JSON.stringify(ctx.session.selection)}`);
});

///

bot.action('medical-help', ctx => {
  ctx.session.selection.type = 'medical-help';
  register(ctx.session.selection);
  ctx.reply(`medical-help: ${JSON.stringify(ctx.session.selection)}`);
});

bot.action('accommodate-people', ctx => {
  ctx.session.selection.type = 'accommodate-people';
  register(ctx.session.selection);
  ctx.reply(`accommodate-people: ${JSON.stringify(ctx.session.selection)}`);
});

bot.action('transport-people', ctx => {
  ctx.session.selection.type = 'transport-people';
  register(ctx.session.selection);
  ctx.reply(`transport-people: ${JSON.stringify(ctx.session.selection)}`);
});

bot.action('provide-local-information', ctx => {
  ctx.session.selection.type = 'provide-local-information';
  register(ctx.session.selection);
  ctx.reply(`provide-local-information: ${JSON.stringify(ctx.session.selection)}`);
});

bot.command('ping', async ctx => {
  const result = await fetch(`${process.env.BACKEND_HOST}/ping`);
  const text = await result.text();
  ctx.reply(text);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

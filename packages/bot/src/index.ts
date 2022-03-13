import { Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';

import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { askForHelp, askForInfo, askForLanguage, askToProvideHelp, askToRestart } from './questions';
import { TSelection } from './shared/types';

dotenv.config({ path: `${__dirname}/../.env` });

if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error('TELEGRAM_BOT_TOKEN env variable is not provided');
  process.exit(1);
}

if (!process.env.BACKEND_HOST) {
  console.error('BACKEND_HOST env variable is not provided');
  process.exit(1);
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const session = new LocalSession({ database: 'session_db.json' }).middleware();
bot.use(session); // @TODO use redis session storage https://github.com/telegraf/telegraf-session-redis

bot.start(ctx => {
  if (!ctx || !ctx.chat) return;

  const selection: TSelection = {
    language: null,
    option: null,
    userId: null,
    type: null
  };
  ctx.session.selection = selection;
  askForLanguage(bot, ctx.chat.id);
});

function register(data: TSelection) {
  console.log('REGISTER:');
  console.log(data);
  // post to backend
  // fetch('http://localhost:8080/register', data)
}

bot.action(/language:(.*)/, ctx => {
  if (!ctx || !ctx.chat) return;

  const language = ctx.match[1];

  if (language) {
    ctx.session.selection.language = language;
    ctx.session.selection.userId = ctx.update.callback_query.from.id;
    askForInfo(bot, ctx.chat.id);
  } else {
    askToRestart(ctx);
  }
});

bot.action(/option:(.*)/, ctx => {
  if (!ctx || !ctx.chat) return;

  const option = ctx.match[1];

  if (option) {
    ctx.session.selection.option = option;
    option === 'need-help' ? askForHelp(bot, ctx.chat.id) : askToProvideHelp(bot, ctx.chat.id);
  } else {
    askToRestart(ctx);
  }
});

bot.action(/help-type:(.*)/, ctx => {
  if (!ctx || !ctx.chat) return;

  const helpType = ctx.match[1];

  if (helpType) {
    ctx.session.selection.type = helpType;
    register(ctx.session.selection);
    ctx.reply(`${helpType}: ${JSON.stringify(ctx.session.selection)}`);
  } else {
    askToRestart(ctx);
  }
});

bot.command('ping', async ctx => {
  const result = await fetch(`${process.env.BACKEND_HOST}/ping`);
  const text = await result.text();
  ctx.reply(text);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

import { Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local'

import dotenv from 'dotenv';
import fetch from 'node-fetch'

dotenv.config({ path: `${__dirname}/../.env` });

if (process.env.TELEGRAM_BOT_TOKEN == null) {
  console.error("TELEGRAM_BOT_TOKEN env variable is not provided")
  process.exit(1)
}
if (process.env.BACKEND_HOST == null) {
  console.error("BACKEND_HOST env variable is not provided")
  process.exit(1)
}
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
bot.use(new LocalSession({ database: 'session_db.json' }).middleware()) // @TODO use redis session storage https://github.com/telegraf/telegraf-session-redis

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
  ctx.session.selection = selection
  bot.telegram.sendMessage(ctx.chat.id, 'Please select a language', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'English', callback_data: 'english' },
          { text: 'Ukrainian', callback_data: 'ukrainian' },
          { text: 'Russian', callback_data: 'russian' }
        ]
      ]
    }
  });
});

function askForInfo(chatId: number) {
  bot.telegram.sendMessage(chatId, 'Please select an option', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'I need help', callback_data: 'need-help' },
          { text: 'I can provide help', callback_data: 'provide-help' }
        ]
      ]
    }
  });
}

function askForHelp(ctx: any) {
  bot.telegram.sendMessage(ctx.chat.id, 'What do you need help with?', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Urgent care', callback_data: 'urgent-care' },
          { text: 'Transportation', callback_data: 'transportation' },
          { text: 'Local information', callback_data: 'local-information' },
          { text: 'Accommodation', callback_data: 'accommodation' }
        ]
      ]
    }
  });
}

function askToProvideHelp(ctx: any) {
  bot.telegram.sendMessage(ctx.chat.id, 'What can you help with?', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Medical help', callback_data: 'medical-help' },
          { text: 'Accommodate people', callback_data: 'accommodate-people' },
          { text: 'Transport people', callback_data: 'transport-people' },
          { text: 'Provide local information', callback_data: 'provide-local-information' }
        ]
      ]
    }
  });
}

function register(data: ISelection) {
  console.log('REGISTER:');
  console.log(data);
  // post to backend
  // fetch('http://localhost:8080/register', data)
}


bot.action('english', ctx => {
  if (ctx.chat == null) {
    return
  }
  ctx.session.selection.language = 'english'
  ctx.session.selection.userId = ctx.update.callback_query.from.id;

  askForInfo(ctx.chat.id);
});

bot.action('ukrainian', ctx => {
  if (ctx.chat == null) {
    return
  }
  ctx.session.selection.language = 'ukrainian';
  ctx.session.selection.userId = ctx.update.callback_query.from.id;

  askForInfo(ctx.chat.id);
});

bot.action('russian', ctx => {
  if (ctx.chat == null) {
    return
  }
  ctx.session.selection.language = 'russian';
  ctx.session.selection.userId = ctx.update.callback_query.from.id;

  askForInfo(ctx.chat.id);
});

bot.action('need-help', ctx => {
  ctx.session.selection.option = 'need-help';

  askForHelp(ctx);
});

bot.action('provide-help', ctx => {
  ctx.session.selection.option = 'provide-help';

  askToProvideHelp(ctx);
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
  const result = await fetch(`${process.env.BACKEND_HOST}/ping`)
  const text = await result.text()
  ctx.reply(text)
})

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

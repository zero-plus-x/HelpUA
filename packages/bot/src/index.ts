import { Telegraf } from 'telegraf';
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

interface ISelection {
  language: string | null;
  option: string | null;
  type: string | null;
  userId: number | null;
}

const selection: ISelection = {
  language: null,
  option: null,
  userId: null,
  type: null
};

bot.start(ctx => {
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

function askForInfo(ctx: any) {
  bot.telegram.sendMessage(ctx.chat.id, 'Please select an option', {
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
  selection.language = 'english';
  selection.userId = ctx.update.callback_query.from.id;

  askForInfo(ctx);
});

bot.action('ukrainian', ctx => {
  selection.language = 'ukrainian';
  selection.userId = ctx.update.callback_query.from.id;

  askForInfo(ctx);
});

bot.action('russian', ctx => {
  selection.language = 'russian';
  selection.userId = ctx.update.callback_query.from.id;

  askForInfo(ctx);
});

bot.action('need-help', ctx => {
  selection.option = 'need-help';

  askForHelp(ctx);
});

bot.action('provide-help', ctx => {
  selection.option = 'provide-help';

  askToProvideHelp(ctx);
});

bot.action('urgent-care', ctx => {
  selection.type = 'urgent-care';
  register(selection);
  ctx.reply(`urgent-care: ${JSON.stringify(selection)}`);
});

bot.action('transportation', ctx => {
  selection.type = 'transportation';
  register(selection);
  ctx.reply(`transportation: ${JSON.stringify(selection)}`);
});

bot.action('local-information', ctx => {
  selection.type = 'local-information';
  register(selection);
  ctx.reply(`local-information: ${JSON.stringify(selection)}`);
});

bot.action('accommodation', ctx => {
  selection.type = 'accommodation';
  register(selection);
  ctx.reply(`accommodation: ${JSON.stringify(selection)}`);
});

///

bot.action('medical-help', ctx => {
  selection.type = 'medical-help';
  register(selection);
  ctx.reply(`medical-help: ${JSON.stringify(selection)}`);
});

bot.action('accommodate-people', ctx => {
  selection.type = 'accommodate-people';
  register(selection);
  ctx.reply(`accommodate-people: ${JSON.stringify(selection)}`);
});

bot.action('transport-people', ctx => {
  selection.type = 'transport-people';
  register(selection);
  ctx.reply(`transport-people: ${JSON.stringify(selection)}`);
});

bot.action('provide-local-information', ctx => {
  selection.type = 'provide-local-information';
  register(selection);
  ctx.reply(`provide-local-information: ${JSON.stringify(selection)}`);
});

bot.command('ping', async ctx => {
  const result = await fetch(`${process.env.BACKEND_HOST}/ping`)
  const text = await result.text()
  ctx.reply(text)
})

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

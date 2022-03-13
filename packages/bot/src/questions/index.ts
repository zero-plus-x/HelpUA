import { Telegraf } from 'telegraf';
import { THelpUAContext } from '../shared/types';

const askForLanguage = (bot: Telegraf<THelpUAContext>, chatId: number) => {
  bot.telegram.sendMessage(chatId, 'Please select a language', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'English', callback_data: 'language:english' },
          { text: 'Ukrainian', callback_data: 'language:ukrainian' },
          { text: 'Russian', callback_data: 'language:russian' }
        ]
      ]
    }
  });
};

const askForInfo = (bot: Telegraf<THelpUAContext>, chatId: number) => {
  bot.telegram.sendMessage(chatId, 'Please select an option', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'I need help', callback_data: 'option:need-help' },
          { text: 'I can provide help', callback_data: 'option:provide-help' }
        ]
      ]
    }
  });
};

const askForHelp = (bot: Telegraf<THelpUAContext>, chatId: number) => {
  bot.telegram.sendMessage(chatId, 'What do you need help with?', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Urgent care', callback_data: 'help-type:urgent-care' },
          { text: 'Transportation', callback_data: 'help-type:transportation' },
          { text: 'Local information', callback_data: 'help-type:local-information' },
          { text: 'Accommodation', callback_data: 'help-type:accommodation' }
        ]
      ]
    }
  });
};

const askToProvideHelp = (bot: Telegraf<THelpUAContext>, chatId: number) => {
  bot.telegram.sendMessage(chatId, 'What can you help with?', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Medical help', callback_data: 'help-type:medical-help' },
          { text: 'Accommodate people', callback_data: 'help-type:accommodate-people' },
          { text: 'Transport people', callback_data: 'help-type:transport-people' },
          { text: 'Provide local information', callback_data: 'help-type:provide-local-information' }
        ]
      ]
    }
  });
};

const askToRestart = (ctx: THelpUAContext) => {
  ctx.reply('Cannot process response, try /start again');
};

export { askForLanguage, askForInfo, askForHelp, askToProvideHelp, askToRestart };

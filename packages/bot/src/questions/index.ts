import { Telegraf } from 'telegraf';

const askForLanguage = (bot: Telegraf, chatId: number) => {
  bot.telegram.sendMessage(chatId, 'Please select a language', {
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
};

const askForInfo = (bot: Telegraf, chatId: number) => {
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
};

const askForHelp = (bot: Telegraf, chatId: number) => {
  bot.telegram.sendMessage(chatId, 'What do you need help with?', {
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
};

const askToProvideHelp = (bot: Telegraf, chatId: number) => {
  bot.telegram.sendMessage(chatId, 'What can you help with?', {
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
};

export { askForLanguage, askForInfo, askForHelp, askToProvideHelp };

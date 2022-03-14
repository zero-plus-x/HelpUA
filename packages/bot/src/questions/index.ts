import { Telegraf } from 'telegraf';
import { getOptions, getUILanguages } from '../db';
import { ILanguage, IOption, THelpUAContext } from '../shared/types';

const askForLanguage = async (bot: Telegraf<THelpUAContext>, chatId: number) => {
  const uiLanguages = (await getUILanguages()) as ILanguage[];
  const rows = uiLanguages.map(language => ({
    text: language.language,
    callback_data: `ui-language:${language.id}`
  }));

  bot.telegram.sendMessage(chatId, 'Please select a language', {
    reply_markup: {
      inline_keyboard: [rows]
    }
  });
};

const askForInfo = async (bot: Telegraf<THelpUAContext>, chatId: number, uiLanguageId: number) => {
  const options = (await getOptions(uiLanguageId)) as IOption[];
  const rows = options.map(option => ({
    text: option.label,
    callback_data: `option:${option.id}`
  }));
  bot.telegram.sendMessage(chatId, 'Please select an option', {
    reply_markup: {
      inline_keyboard: [rows]
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

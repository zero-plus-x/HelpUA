import { Telegraf } from 'telegraf';
import { getHelpTypes, getOptions, getUILanguages } from '../db';
import { IHelpType, ILanguage, IOption, THelpUAContext } from '../shared/types';

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

const askForHelpType = async (
  bot: Telegraf<THelpUAContext>,
  chatId: number,
  uiLanguageId: number,
  optionId: number
) => {
  const helpTypes = (await getHelpTypes(uiLanguageId, optionId)) as IHelpType[];
  const rows = helpTypes.map(helpType => ({
    text: helpType.label,
    callback_data: `help-type:${helpType.id}`
  }));
  bot.telegram.sendMessage(chatId, 'What do you need help with?', {
    reply_markup: {
      inline_keyboard: [rows]
    }
  });
};

const askToRestart = (ctx: THelpUAContext) => {
  ctx.reply('Cannot process response, try /start again');
};

export { askForLanguage, askForInfo, askForHelpType, askToRestart };
